# Next.js 16 Migration Guide

This portfolio project has been successfully migrated from React + Vite to **Next.js 16** with TypeScript.

## Key Changes

### Project Structure
```
my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page  
│   │   ├── providers.tsx       # Query client provider
│   │   ├── blog/
│   │   │   ├── page.tsx        # Blog list
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Blog post detail
│   │   ├── projects/
│   │   │   └── page.tsx        # Projects page
│   │   ├── contact/
│   │   │   └── page.tsx        # Contact form
│   │   ├── auth/
│   │   │   └── page.tsx        # Login page
│   │   ├── admin/
│   │   │   └── page.tsx        # Admin dashboard
│   │   ├── not-found.tsx       # 404 page
│   │   └── api/                # API routes (optional)
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Navigation.tsx      # Updated for Next.js Link
│   │   ├── Footer.tsx          # Updated for Next.js Link
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and helpers
│   └── styles/                 # Global CSS
├── public/                     # Static assets
├── next.config.ts             # Next.js config
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── package.json               # Updated with Next.js
└── .env.local                 # Environment variables
```

### Migration Changes

#### 1. **Routing System**
- ❌ Removed: `wouter` library
- ✅ Added: Next.js App Router (file-based routing)
- Links now use `next/link` instead of `wouter.Link`
- Dynamic routes use `[slug]` folder naming

#### 2. **Client vs Server Components**
- Pages using React hooks marked with `'use client'` directive
- Server components by default (better performance)
- Layout and static content can be server-rendered

#### 3. **Build System**
- ❌ Removed: Vite configuration
- ✅ Added: Next.js (built on Turbopack for faster builds)
- Updated build commands in `package.json`

#### 4. **Navigation Updates**
```tsx
// Before (wouter)
import { Link } from "wouter";
<Link href="/projects">
  <a>Projects</a>
</Link>

// After (Next.js)
import Link from "next/link";
<Link href="/projects">
  Projects
</Link>
```

#### 5. **Page Routing**
```
Pages are now defined by folder structure:
- src/app/page.tsx → / (home)
- src/app/projects/page.tsx → /projects
- src/app/blog/page.tsx → /blog
- src/app/blog/[slug]/page.tsx → /blog/:slug
- src/app/contact/page.tsx → /contact
- src/app/auth/page.tsx → /auth
- src/app/admin/page.tsx → /admin
```

#### 6. **Environment Variables**
- Create `.env.local` with `NEXT_PUBLIC_API_URL`
- Access via `process.env.NEXT_PUBLIC_API_URL`

#### 7. **TypeScript Configuration**
- Updated `tsconfig.json` for Next.js
- Paths configured for `@/` and `@shared/` imports

## Installation & Running

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Set Environment Variables
Create/update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Development Server
```bash
npm run dev
# Server runs on http://localhost:3000
```

### 4. Production Build
```bash
npm run build
npm start
```

## Package.json Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Next.js, port 3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run check` | Type check with TypeScript |

## Backend Integration

The project still connects to the Express backend at:
- **Development**: `http://localhost:5000` (configurable via `.env.local`)
- **Production**: Update `NEXT_PUBLIC_API_URL` environment variable

The backend server runs separately:
```bash
# In your backend directory
npm run dev  # or your backend's dev command
```

## API Routes (Optional)

If you want to move backend logic into Next.js, create files in `src/app/api/`:
```tsx
// src/app/api/projects/route.ts
export async function GET() {
  return Response.json({ /* data */ });
}
```

## Removed Dependencies

- `vite` - Bundler
- `wouter` - Client-side router
- `@vitejs/plugin-react` - Vite React plugin
- `@replit/vite-plugin-runtime-error-modal` - Replit dev tool

## Added Dependencies

- `next` - Next.js framework
- `@types/react` - React types (updated)
- `@types/react-dom` - React DOM types (updated)

## Important Notes

1. **Public Assets**: Place all static files in the `public/` folder (logo, avatar, etc.)
2. **TypeScript**: Full TypeScript support with strict mode enabled
3. **Tailwind CSS**: CSS Framework configured and ready to use
4. **API Requests**: Use the `apiRequest` utility from `src/lib/queryClient.ts`
5. **Environment Variables**: Only `NEXT_PUBLIC_*` variables are exposed to the browser

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### API Connection Issues
- Ensure backend server is running on `http://localhost:5000`
- Check `.env.local` for correct `NEXT_PUBLIC_API_URL`
- Check browser console for CORS errors

### TypeScript Errors
```bash
npm run check  # Run type checker
```

## Next Steps

1. Test all pages and functionality
2. Update CI/CD pipelines if using any
3. Deploy to hosting platform (Vercel recommended for Next.js)
4. Consider migrating backend API routes to Next.js if desired

## Support

For Next.js documentation: https://nextjs.org/docs
