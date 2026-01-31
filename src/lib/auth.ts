import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { storage } from './storage';
import type { User } from '../../shared/schema';

const scryptAsync = promisify(scrypt);

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Use a default secret for development only (not secure for production)
    console.warn('JWT_SECRET not set, using default secret (insecure for production)');
    return new TextEncoder().encode('development-secret-do-not-use-in-production');
  }
  return new TextEncoder().encode(secret);
};

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split('.');
  if (!hashed || !salt) return false;
  
  const hashedPasswordBuf = Buffer.from(hashed, 'hex');
  const suppliedPasswordBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({ 
    sub: String(user.id), 
    username: user.username,
    role: user.role 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
  
  return token;
}

export async function verifyToken(token: string): Promise<{ sub: string; username: string; role: string | null } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as { sub: string; username: string; role: string | null };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) return null;
  
  const payload = await verifyToken(token);
  if (!payload) return null;
  
  const user = await storage.getUser(Number(payload.sub));
  return user;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  // Hardcoded dev credentials for convenience
  if (username === 'nexa' && password === 'password') {
    let user = await storage.getUserByUsername('nexa');
    if (!user) {
      user = await storage.createUser({
        username: 'nexa',
        password: await hashPassword('password'),
      });
    }
    return user;
  }

  const user = await storage.getUserByUsername(username);
  if (!user) return null;

  const passwordMatch = await comparePasswords(password, user.password);
  if (!passwordMatch) return null;

  return user;
}

