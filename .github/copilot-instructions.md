# Citizens' Atlas - AI Agent Instructions

## Project Overview
Next.js 14 (App Router) CMS for mapping environmental false solutions. Hybrid architecture with **automatic Supabase/localStorage fallback** for seamless dev-to-prod migration.

## Critical Architecture Patterns

### 1. **Hybrid Data Layer** (Most Important)
**Pattern**: `src/lib/services/data-service.ts` wraps `supabase-service.ts` with localStorage fallback
- **ALWAYS** import from `data-service.ts`, NEVER directly from `supabase-service.ts`
- Data service auto-detects Supabase configuration at runtime
- Authenticated vs public data handled automatically based on `localStorage.getItem('atlas-auth-token')`
- Example: `getProjects()` returns ALL for authenticated users, only published for public

```typescript
// ✅ CORRECT
import * as DataService from '@/lib/services/data-service'
const projects = await DataService.getProjects()

// ❌ WRONG - bypasses fallback logic
import { getProjects } from '@/lib/services/supabase-service'
```

### 2. **Authentication State Management**
**Singleton Pattern**: `src/lib/supabase/client.ts` maintains single Supabase instance
- Session stored in localStorage as `atlas-auth-token` (PKCE flow)
- User profile cached in `atlas-user-profile` for instant restoration
- `AuthContext` prevents race conditions with `fetchingProfile` ref
- **Auth flow**: Login → Supabase session → Profile fetch from `profiles` table → Cache to localStorage

### 3. **Role-Based Permissions**
**Hook**: `useRolePermissions(userRole)` returns permission object
- Roles: `super-admin` | `admin` | `contributor`
- Permissions stored in `DEFAULT_PERMISSIONS` array, overridable via localStorage `custom_permissions`
- Contributors can create drafts, admins can publish, super-admins manage team
- Check permissions: `hasPermission(user?.role, 'Batch Upload')`

### 4. **Draft/Published Workflow**
**Status Field**: All content types have `status: 'draft' | 'published'`
- Contributors create as `draft` (requires approval)
- Admins/super-admins create as `published` (auto-approved)
- Filter logic in `data-service.ts` shows drafts only to authenticated users
- Example in `ArticleForm.tsx` line 296:
  ```typescript
  status: (userRole === 'admin' || userRole === 'super-admin') ? 'published' : 'draft'
  ```

### 5. **Algolia Search Integration**
**Indexing**: `src/lib/algolia/indexing.ts` provides sync functions
- Separate indices: `projects`, `news`, `publications`, `videos`
- Transform functions add `objectID`, `_geoloc` (for map), `_tags`
- Index operations require admin API key (server-side only)
- Client search uses `searchClient` from `src/lib/algolia/client.ts`

## Development Commands
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run type-check   # TypeScript validation (no-emit)
npm run lint         # ESLint check
```

## File Path Aliases
```typescript
@/*           → src/*
@/components/* → src/components/*
@/lib/*       → src/lib/*
@/types/*     → src/types/*
```

## Environment Variables
**Required for Supabase**:
- `NEXT_PUBLIC_SUPABASE_URL` (client-side)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (client-side)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side API routes only)

**Email (Resend)**:
- `RESEND_API_KEY` (for invite emails in `app/api/admin/invite/route.ts`)

**Algolia Search**:
- `NEXT_PUBLIC_ALGOLIA_APP_ID`
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` (client search)
- `ALGOLIA_ADMIN_KEY` (server indexing)

## Database Schema Conventions
**Supabase Tables**: `projects`, `news`, `publications`, `videos`, `profiles`
- All content tables have: `id` (BIGSERIAL), `status`, `submittedBy`, `submittedAt`
- Profiles table drives user roles: `id`, `email`, `role`, `full_name`, `avatar_url`
- Schema in `supabase/schema.sql` (camelCase in quotes for Postgres)
- **Critical**: Use direct REST API calls with Bearer token (see `supabase-service.ts`) due to auth token pattern

## Common Pitfalls

1. **Never call Supabase service directly** - Always through data-service wrapper
2. **localStorage checks** - Always guard with `typeof window !== 'undefined'`
3. **Auth token format** - Stored as full session object, extract `access_token` for API calls
4. **Status filtering** - Public endpoints filter `status === 'published'`, admin gets all
5. **Next.js caching** - `generateBuildId` forces invalidation in `next.config.js`
6. **Date parsing** - Always validate dates before formatting. Use `src/lib/utils/dateUtils.ts` helpers:
   ```typescript
   import { formatDate } from '@/lib/utils/dateUtils'
   formatDate(project.submittedAt) // Returns 'N/A' if invalid
   ```

## UI Component Library
**shadcn/ui** (Radix primitives + Tailwind):
- Components in `src/components/ui/`
- Import with: `import { Button } from '@/components/ui/button'`
- Customize in `src/lib/utils.ts` via `cn()` helper
- Form patterns use native state, not form libraries

## Feature Organization
```
src/components/features/
├── admin/          # Admin dashboard components (tables, forms, analytics)
├── articles/       # Article display components
├── map/            # MapLibre GL interactive map
└── projects/       # Project-specific features
```

## API Routes Pattern
**App Router**: `app/api/[feature]/route.ts` export GET/POST
- Auth check: Extract Bearer token from Authorization header or use service role key
- Email invites: `/api/admin/invite` uses Resend
- Password setting: `/api/auth/set-password` uses Supabase Admin client

## When Editing Data Services
1. Update `supabase-service.ts` for Supabase logic
2. Update `data-service.ts` fallback wrapper (match signatures)
3. Update Algolia indexing in `algolia/indexing.ts` if searchable
4. Consider auth vs public data access patterns

## Key Files Reference
- Auth context: `src/contexts/AuthContext.tsx`
- Data layer: `src/lib/services/data-service.ts`
- Types: `src/types/types.ts`
- Admin dashboard: `app/admin/page.tsx` + `src/components/features/admin/AdminDashboard.tsx`
- Map view: `src/components/features/map/MapView.tsx`
