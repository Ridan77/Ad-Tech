# Pet Clinic Management App Plan

## 1) Goal
Build an interview-ready Pet Clinic client management app with:
- Next.js (App Router + API routes)
- MongoDB
- Tailwind CSS only
- Single page UI with one modal that supports both Add and Edit flows
- Responsive design for mobile and desktop
- Clean, modular TypeScript code

## 2) Proposed Stack
- Framework: Next.js 14+ (TypeScript, App Router)
- Data: MongoDB Atlas + MongoDB native driver
- State/API caching: TanStack React Query
- Table: TanStack React Table
- UI: MUI (Modal/Dialog, Buttons, Inputs, Icons)
- Styling: Tailwind CSS with design tokens in `tailwind.config.ts`

Note: MUI is included as requested in the task brief.

## 3) MVP Scope (aligned to task)
- Single route `/`
- Header + clients table/list
- Search/filter clients by:
  - `Name` (text)
  - `Pet Name` (text)
  - `Pet Type` (select)
- Add client button -> opens modal in Add mode
- Edit action per row -> opens same modal in Edit mode
- Delete action (from edit modal and/or row action) to remove patient from DB
- Form fields validated client-side and server-side (without adding Zod unless needed later)
- Toasts for success/failure
- Loading/empty/error states

## 4) Data Model (initial)
Collection: `clients`
- `_id: ObjectId`
- `name: string`
- `phone: string`
- `petName: string`
- `petBirthDate: Date`
- `petType: 'dog' | 'cat' | 'parrot'`
- `notes?: string`
- `createdAt: Date`
- `updatedAt: Date`

Derived (not stored):
- `petAge: number` calculated from `petBirthDate` for table display

## 5) API Contract (Next.js API routes)
- `GET /api/clients` -> list clients (supports optional query params: `name`, `petName`, `petType`)
- `POST /api/clients` -> create client
- `PUT /api/clients/:id` -> update client
- `DELETE /api/clients/:id` -> delete client

All handlers:
- Validate payload with clear server-side checks
- Return consistent JSON shape `{ data, error }`
- Return proper HTTP status codes

## 6) UI/UX Direction
- One-page dashboard feel (clean clinic theme)
- Reusable components:
  - `ClientTable`
  - `ClientModalForm` (mode: add | edit)
  - `ClientFilters` (`name`, `petName`, `petType`)
  - `EmptyState`
  - `ConfirmDeleteDialog`
- Tailwind tokens in config:
  - brand colors
  - semantic colors (success/warn/error)
  - radius/shadow scale
- Animation:
  - modal enter/exit
  - subtle list row hover + loading skeleton

## 7) Folder Structure
- `app/page.tsx`
- `app/api/clients/route.ts`
- `app/api/clients/[id]/route.ts`
- `components/*`
- `services/db.service.ts`
- `services/client.service.ts`
- `services/client-validation.service.ts`
- `lib/api/clientApi.ts`
- `hooks/useClients.ts`
- `types/client.ts`

## 8) Delivery Workflow
1. Bootstrap project + Tailwind + lint/format config - DONE
2. Mongo connection + model + request validation helpers - DONE (mongodb package install pending due offline npm cache mode)
3. API routes - DONE
4. React Query integration - DONE (typecheck pending until TanStack packages are installed)
5. Table + modal UI - DONE
6. Responsive polish + animation
7. QA pass + seed data
8. README + screenshots + architecture notes
9. Deploy (Vercel) + MongoDB Atlas env vars
10. Submit GitHub + live link

## 9) Quality Checklist
- TypeScript everywhere
- Reusable components/functions
- No duplicated API/form logic
- Error boundaries and robust error handling
- Accessibility basics:
  - labeled inputs
  - keyboard modal behavior
  - focus trap

## 10) Risks and Mitigations
- Risk: unclear required fields from system spec
  - Mitigation: resolved from `.codex/System-Spec.jpg` and locked schema/filters above
- Risk: deployment env issues with Mongo URI
  - Mitigation: add `.env.example` and deployment notes
- Risk: scope creep on design
  - Mitigation: MVP first, polish second

## Questions (please answer before implementation)
1. Do you want to use **Next.js** (recommended) or **Remix**? yes -> **Next.js selected**
2. Should we include **Delete** in the UI/API, or keep only Add/Edit? -> **Include Delete** (shown in spec)
3. Do you have the spec file as `System Spec.svg`/`System spec.jpg` in this repo? If yes, where exactly? you have to read it and change model accordingly. is under /.codex/System-Spec.jpg -> **read and applied**
4. Do you want me to prioritize:
   - A) fastest delivery
   - B) best visual polish
   - C) strongest architecture/tests c -> **C selected**
5. Is **Vercel + MongoDB Atlas** acceptable for deployment? yes -> **yes**

## Locked Decisions
- Framework: Next.js
- Priority: strongest architecture/tests
- Spec source: `.codex/System-Spec.jpg`
- CRUD: include delete
- Deployment target: Vercel + MongoDB Atlas
