# Vercel Deployment Plan

## Summary
Convert the Express+Next.js hybrid app to pure Next.js for Vercel serverless deployment.

## Issues Identified
1. ❌ `vercel.json` configured for Vite, not Next.js
2. ❌ Custom Express server won't work on Vercel (serverless functions)
3. ❌ MemoryStore for sessions won't persist in serverless
4. ❌ Direct PostgreSQL connection needs connection pooling
5. ❌ Express authentication won't work in serverless

---

## Implementation Steps

### Phase 1: Configuration Fixes
- [ ] 1.1 Create `vercel.json` for Next.js framework
- [ ] 1.2 Update `next.config.ts` to remove standalone output issues
- [ ] 1.3 Update `tsconfig.json` path mappings for serverless

### Phase 2: Database Setup
- [ ] 2.1 Create `src/lib/db.ts` for Vercel Postgres / Neon connection
- [ ] 2.2 Install `@vercel/postgres` or use drizzle with connection pooling
- [ ] 2.3 Update `server/storage.ts` → `src/lib/storage.ts`

### Phase 3: Convert API Routes to Next.js Route Handlers
- [ ] 3.1 Create `src/app/api/auth/[...nextauth]/route.ts` (or custom JWT auth)
- [ ] 3.2 Create `src/app/api/projects/route.ts` (GET, POST)
- [ ] 3.3 Create `src/app/api/projects/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] 3.4 Create `src/app/api/blog/route.ts` (GET, POST)
- [ ] 3.5 Create `src/app/api/blog/[slug]/route.ts` (GET)
- [ ] 3.6 Create `src/app/api/blog/[id]/route.ts` (PATCH, DELETE)
- [ ] 3.7 Create `src/app/api/messages/route.ts` (GET, POST)
- [ ] 3.8 Create `src/app/api/upload/route.ts`

### Phase 4: Authentication (JWT-based)
- [ ] 4.1 Replace express-session with JWT tokens
- [ ] 4.2 Create auth utility functions in `src/lib/auth.ts`
- [ ] 4.3 Update `src/hooks/use-auth.ts` for JWT auth
- [ ] 4.4 Create middleware for auth protection

### Phase 5: Client Updates
- [ ] 5.1 Update `src/lib/queryClient.ts` for Vercel API URLs
- [ ] 5.2 Update `src/hooks/use-projects.ts` for new endpoints
- [ ] 5.3 Update `src/hooks/use-messages.ts` for new endpoints
- [ ] 5.4 Update `.env` with new environment variables

### Phase 6: Cleanup
- [ ] 6.1 Keep `server/` folder for local development reference
- [ ] 6.2 Update `package.json` scripts
- [ ] 6.3 Add Vercel preset to `drizzle.config.ts`

---

## New File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── blog/
│   │   │   ├── route.ts
│   │   │   ├── [slug]/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── messages/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   └── ...
├── lib/
│   ├── db.ts              # Database connection
│   ├── auth.ts            # JWT auth utilities
│   └── ...
└── ...
```

---

## Environment Variables Required

```env
# Database (Vercel Postgres or Neon)
POSTGRES_URL=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Auth
JWT_SECRET=your-super-secret-key
NODE_ENV=production

# Optional: For local dev
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Rollback Plan
If issues arise, keep the Express server as a fallback for local development while using Vercel functions in production.

## Estimated Time
- Phase 1-2: 30 minutes
- Phase 3: 1-2 hours
- Phase 4-5: 1 hour
- Phase 6: 30 minutes

**Total: ~3-4 hours**

