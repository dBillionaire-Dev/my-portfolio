# Quick Start Guide - Next.js 16 Portfolio

## 🚀 Get Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Configure Environment
Create `.env.local` in root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3️⃣ Start Development
```bash
# Terminal 1: Backend (if not already running)
cd server
npm run dev

# Terminal 2: Frontend
npm run dev
```

Then open: **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page /
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # React Query provider
│   ├── blog/              # Blog routes
│   ├── projects/          # Projects route
│   ├── contact/           # Contact route
│   ├── auth/              # Login route
│   ├── admin/             # Dashboard route
│   └── api/               # API routes (optional)
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── Navigation.tsx     # Header
│   ├── Footer.tsx         # Footer
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
└── styles/                # CSS
```

---

## 🔑 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run lint` | Check code style |
| `npm run check` | TypeScript type check |

---

## 🌐 Routes

| URL | File | Purpose |
|-----|------|---------|
| `/` | `app/page.tsx` | Home page |
| `/projects` | `app/projects/page.tsx` | Projects gallery |
| `/blog` | `app/blog/page.tsx` | Blog list |
| `/blog/:slug` | `app/blog/[slug]/page.tsx` | Blog post |
| `/contact` | `app/contact/page.tsx` | Contact form |
| `/auth` | `app/auth/page.tsx` | Login |
| `/admin` | `app/admin/page.tsx` | Dashboard |

---

## 🔌 API Endpoints

All API calls go to backend at `NEXT_PUBLIC_API_URL` (default: localhost:5000)

```typescript
// Example: Using apiRequest
import { apiRequest } from "@/lib/queryClient";

const response = await apiRequest("GET", "/api/projects");
const data = await response.json();
```

---

## 📦 Key Dependencies

- **next** - Framework
- **react** & **react-dom** - UI library
- **@tanstack/react-query** - Server state management
- **tailwindcss** - CSS framework
- **shadcn/ui** - Component library
- **framer-motion** - Animations
- **zod** - Schema validation

---

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **CSS Variables** - Dark mode support in root CSS
- **Custom Components** - shadcn/ui components in `src/components/ui/`

---

## ✨ Key Features

✅ **Full TypeScript Support**
- Strict mode enabled
- Type-safe routing

✅ **Server-Side Rendering**
- Automatic code splitting
- Better SEO
- Faster initial load

✅ **Client-Side Features**
- React hooks on demand
- Smooth animations
- Form validation

✅ **Development Experience**
- Hot module replacement
- Fast refresh
- Clear error messages

---

## 🐛 Debugging

### Dev Tools
```bash
# Open VS Code debugger (F5)
# Set breakpoints in .tsx files
# Use browser DevTools (F12)
```

### Console Logging
```tsx
'use client';
console.log('This runs in browser');
```

### Network Requests
- Open browser DevTools → Network tab
- Check CORS headers if API fails

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import project at vercel.com
3. Auto-detects Next.js
4. Done! 🎉

### Option 2: Self-Hosted
```bash
npm run build
npm start
```

Set environment variable:
```
NEXT_PUBLIC_API_URL=https://your-api.com
```

---

## ❓ FAQs

**Q: Why is my page not showing?**
A: Make sure you created the file in the correct location:
- `src/app/page.tsx` for home
- `src/app/blog/page.tsx` for /blog

**Q: API calls not working?**
A: 
1. Check backend is running
2. Verify `.env.local` has correct URL
3. Check browser console for CORS errors

**Q: Port 3000 in use?**
A: 
```bash
npm run dev -- -p 3001  # Use port 3001
```

**Q: How to add a new page?**
A: Create a folder in `src/app/` with a `page.tsx` file:
```
src/app/new-page/page.tsx → /new-page
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## 🎯 Next Steps

1. ✅ Run `npm run dev`
2. ✅ Visit http://localhost:3000
3. ✅ Test all pages and features
4. ✅ Make your first change!

**Happy coding! 🚀**
