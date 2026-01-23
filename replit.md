# Portfolio Web Application

## Overview

A full-stack portfolio website built with React, Express, and PostgreSQL. The application features a modern, dark-themed design for showcasing projects, blog posts, and handling contact messages. It includes an admin dashboard for content management with session-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI animations
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for input/output validation
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Session Storage**: PostgreSQL via connect-pg-simple

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` defines all database tables (users, projects, messages, blogPosts)
- **Migrations**: Drizzle Kit with `db:push` command

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for production bundling
- **Development**: tsx for TypeScript execution without compilation
- **Build Output**: `dist/` directory with compiled backend and `dist/public/` for frontend assets

### Project Structure
```
client/           # React frontend
  src/
    components/   # Reusable UI components
    pages/        # Route-level page components
    hooks/        # Custom React hooks for data fetching
    lib/          # Utilities and query client config
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  auth.ts         # Authentication setup
shared/           # Shared types and schemas
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod schemas
```

### Key Design Decisions
- **Monorepo Structure**: Client, server, and shared code in single repository for type safety across stack
- **Type-Safe API**: Route definitions in `shared/routes.ts` ensure frontend and backend stay in sync
- **Dark Mode Default**: CSS variables in `index.css` configured for dark theme
- **Session Authentication**: Cookies with `credentials: include` for authenticated requests

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### UI Component Libraries
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Headless UI components for dialogs, menus, forms
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Development server with HMR
- **Drizzle Kit**: Database migration tooling
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner for Replit environment

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption (defaults to fallback in development)