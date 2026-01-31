import { db } from './db';
import {
  users, projects, messages, blogPosts,
  type User, type InsertUser, type UpdateUser,
  type Project, type InsertProject, type UpdateProjectRequest,
  type Message, type InsertMessage,
  type BlogPost, type InsertBlogPost, type UpdateBlogPostRequest
} from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

// Check if database is available
const isDbAvailable = () => db !== null;

// Mock user for development when no database
const mockUser: User = {
  id: 1,
  username: 'nexa',
  password: '3384fef89ed7da47a747b3af4df0760352367638c8419974f4f5f06c2e6076eb834031d621ca47256558fd156bdaac85af9d24f821c3ea310c54599ac0b5f97e.22baea40c0e20a825c70bf1a9f8ce0d4',
  role: 'admin',
};

export interface IStorage {
  // Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Blog
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: UpdateBlogPostRequest): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  deleteMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Auth - with mock fallback
  async getUser(id: number): Promise<User | undefined> {
    if (!isDbAvailable()) return id === 1 ? mockUser : undefined;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!isDbAvailable()) {
      return username === 'nexa' ? mockUser : undefined;
    }
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!isDbAvailable()) {
      // Return mock user for development
      return { ...insertUser, id: 1, role: 'admin' } as User;
    }
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User> {
    if (!isDbAvailable()) {
      return { ...mockUser, ...updates } as User;
    }
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    if (!isDbAvailable()) return [];
    return await db.select().from(projects).orderBy(desc(projects.priority));
  }

  async getProject(id: number): Promise<Project | undefined> {
    if (!isDbAvailable()) return undefined;
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    if (!isDbAvailable()) throw new Error('Database not available');
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updates: UpdateProjectRequest): Promise<Project> {
    if (!isDbAvailable()) throw new Error('Database not available');
    const [project] = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    if (!isDbAvailable()) return;
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Blog
  async getBlogPosts(): Promise<BlogPost[]> {
    if (!isDbAvailable()) return [];
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.title));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    if (!isDbAvailable()) return undefined;
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    if (!isDbAvailable()) return undefined;
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    if (!isDbAvailable()) throw new Error('Database not available');
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, updates: UpdateBlogPostRequest): Promise<BlogPost> {
    if (!isDbAvailable()) throw new Error('Database not available');
    const [post] = await db.update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<void> {
    if (!isDbAvailable()) return;
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    if (!isDbAvailable()) throw new Error('Database not available');
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    if (!isDbAvailable()) return [];
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async deleteMessage(id: number): Promise<void> {
    if (!isDbAvailable()) return;
    await db.delete(messages).where(eq(messages.id, id));
  }
}

// Export singleton instance
export const storage = new DatabaseStorage();

