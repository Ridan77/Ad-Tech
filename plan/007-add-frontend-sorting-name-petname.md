# Add Frontend Sorting for Name/Pet Name

## Goal
Add client-side sorting for:
- `Name`
- `Pet Name`

UI target:
- Header labels with sort indicator icon beside sortable columns, like your sketch:
  - `Name` + icon
  - `Phone`
  - `Pet Name` + icon

Sorting should be done in the frontend (no backend API sorting required).

## Scope
- Keep current filtering logic as-is
- Add sorting state in UI layer
- Apply sorting to table data before rendering
- Show clear visual active sort state in header
- Keep mobile layout behavior consistent

## Target Files
- `src/components/clients/client-filters.tsx` (header UI with sort controls)
- `src/components/clients/clients-page.tsx` (sorting state + sorted data flow)
- `src/components/clients/client-table.tsx` (consume already-sorted rows)
- `src/types/client.ts` (optional sorting types if needed)

## Proposed Sorting Model
- `sortBy`: `'name' | 'petName' | null`
- `sortDirection`: `'asc' | 'desc'`

Click behavior:
1. first click on column -> `asc`
2. second click -> `desc`
3. third click -> clear sorting (`null`)

## UI Behavior
- `Name` header clickable with icon
- `Pet Name` header clickable with icon
- `Phone` stays static (not sortable)
- active sorted column icon should visibly indicate asc/desc
- non-active sortable column icon should be neutral

## Implementation Steps
1. Add sorting state in `clients-page.tsx`
2. Derive `sortedClients` from queried clients using `useMemo`
3. Pass sorting state + handlers to `client-filters.tsx`
4. Render clickable sortable headers matching sketch
5. Keep table component simple (render rows as passed)
6. Run lint + typecheck

## Acceptance Criteria
- Sorting works on `Name` and `Pet Name`
- Sort toggles `asc -> desc -> none`
- UI resembles provided sketch
- No API changes required
- Lint/typecheck pass

## Questions (please answer before implementation)
1. Should sorting be case-insensitive? (recommended: yes) no
2. When values are equal, keep original order (stable sort) or add secondary sort by `Name`? keep
3. Default on load: no sorting, or default `Name asc`? name asc

## Status
- Implemented in code
- Lint passes
- Typecheck passes
