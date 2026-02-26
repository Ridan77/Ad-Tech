# Delivery Workflow Item 4 Plan

## Scope
Integrate TanStack React Query into the app for:
- fetching clients list
- fetching single client by id
- create/update/delete mutations
- cache invalidation and optimistic UI-safe refresh

## Target Files
- `src/providers/query-provider.tsx`
- `src/app/layout.tsx` (wrap app with provider)
- `src/lib/api/clientApi.ts`
- `src/hooks/use-clients-query.ts`
- `src/hooks/use-client-mutations.ts`
- `src/constants/query-keys.ts`

## API Client Layer
Create typed fetch wrappers in `src/lib/api/clientApi.ts`:
- `getClients(filters?)`
- `getClientById(id)`
- `createClient(payload)`
- `updateClient(id, payload)`
- `deleteClient(id)`

Requirements:
- handle non-2xx responses
- throw meaningful errors from `{ error.message, error.details }`
- return typed `data` only (unwrap API envelope)

## Query Keys
Add centralized keys in `src/constants/query-keys.ts`:
- `clients.all`
- `clients.list(filters)`
- `clients.detail(id)`

## Hooks
1. `useClientsQuery(filters)`
- uses `getClients`
- query key includes filters
- keep previous data during filter changes

2. `useClientQuery(id)`
- enabled only when `id` exists
- uses `getClientById`

3. `useClientMutations()`
- `createClientMutation`
- `updateClientMutation`
- `deleteClientMutation`
- on success: invalidate `clients.all`
- optional: update `clients.detail(id)` cache directly on update

## Provider Setup
1. Add `QueryClient` in `src/providers/query-provider.tsx`
2. Configure default options:
- `retry: 1`
- `refetchOnWindowFocus: false`
- `staleTime: 30_000`
3. Wrap app in `layout.tsx`

## Step-by-Step
1. Install dependencies:
- `@tanstack/react-query`
- `@tanstack/react-query-devtools` (dev only, optional)
2. Add query provider and wire in app layout
3. Build typed API client functions
4. Add query key constants
5. Implement hooks for list/detail/mutations
6. Run lint + typecheck
7. (Optional) enable React Query Devtools in development

## Acceptance Criteria
- App has a single QueryClientProvider at root
- Client list and single-client queries use React Query hooks
- Mutations invalidate and refresh relevant caches
- Error states propagate from API cleanly
- Lint and typecheck pass

## Notes
- UI wiring to table/modal components is item 5
- For now, hooks can be validated with minimal usage in `page.tsx`
- Show minimal information temporarily in UI (loading/error/total count only)

## Status
- Implemented in code
- Lint passes
- Typecheck passes (after `next typegen` + installed packages)
