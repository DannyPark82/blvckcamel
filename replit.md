# BLVCKCAMEL - Luxury Furniture E-Commerce

## Overview

BLVCKCAMEL is a luxury furniture e-commerce web application with a dark, minimalist aesthetic. It showcases premium leather and fabric sofa products with a monochrome black design theme. The app features a product catalog with category filtering, individual product detail pages, a client-side shopping cart with a slide-out drawer, and a responsive design optimized for both desktop and mobile.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: React Context (cart state) + TanStack React Query (server state/data fetching)
- **Styling**: Tailwind CSS with CSS custom properties for theming, using a dark luxury theme with sharp corners (0px border radius)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Animations**: Framer Motion for scroll-reveal animations and smooth transitions
- **Fonts**: Oswald (display/headings) and DM Sans (body text)
- **Build Tool**: Vite with React plugin

The frontend lives in `client/src/` with path aliases: `@/` maps to `client/src/`, `@shared/` maps to `shared/`.

### Backend
- **Runtime**: Node.js with TypeScript (tsx for dev, esbuild for production)
- **Framework**: Express 5
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Route Definitions**: Shared route definitions in `shared/routes.ts` with Zod schemas for request/response validation, used by both client and server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Connection**: `pg` Pool via `DATABASE_URL` environment variable
- **Schema**: Defined in `shared/schema.ts` using Drizzle's `pgTable`, with Zod schemas auto-generated via `drizzle-zod`
- **Storage Layer**: `server/storage.ts` implements an `IStorage` interface with `DatabaseStorage` class, providing a clean abstraction over database operations

### Data Model
- **Products table**: `id` (serial PK), `name`, `description`, `price` (integer, stored in cents), `category` (text: 'leather' or 'fabric'), `image` (URL), `material`, `isNew` (boolean)
- The database is seeded on startup if the products table is empty (see `seedDatabase()` in `server/routes.ts`)

### API Endpoints
- `GET /api/products` — List all products, optional `?category=` query param for filtering
- `GET /api/products/:id` — Get a single product by ID

### Build & Development
- **Dev**: `npm run dev` runs tsx with Vite dev server (HMR via middleware mode)
- **Build**: `npm run build` runs a custom script that builds the client with Vite and the server with esbuild into `dist/`
- **Production**: `npm start` serves the built app from `dist/`
- **DB Migrations**: `npm run db:push` uses drizzle-kit to push schema changes

### Key Architectural Decisions
1. **Shared schema and routes**: The `shared/` directory contains both the database schema and API route definitions, ensuring type safety across the full stack. The client imports types and Zod schemas directly from shared code.
2. **Storage interface pattern**: The `IStorage` interface in `server/storage.ts` abstracts database access, making it straightforward to swap implementations if needed.
3. **Client-side cart**: Shopping cart is managed entirely in React Context (no server persistence), keeping the architecture simple for a catalog-focused app.
4. **Prices in cents**: All monetary values are stored as integers (cents) to avoid floating-point issues, formatted on display using `Intl.NumberFormat`.

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Required for the app to run.
- **Unsplash**: Product images are loaded from Unsplash URLs (external image hosting, no local assets).
- **Google Fonts**: Oswald and DM Sans fonts loaded from Google Fonts CDN.
- **No authentication**: The app currently has no auth system — it's a public-facing product catalog.
- **No payment processing**: Cart exists client-side only; no checkout or payment integration is implemented.