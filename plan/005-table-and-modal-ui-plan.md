# Delivery Workflow Item 5 Plan

## Scope
Build the main single-page UI with:
- clients table/list
- filters
- one modal component with two modes (`add` and `edit`)
- delete action
- full wiring to React Query hooks

## Target Files
- `src/components/clients/clients-page.tsx`
- `src/components/clients/client-filters.tsx`
- `src/components/clients/client-table.tsx`
- `src/components/clients/client-modal.tsx`
- `src/components/clients/delete-client-dialog.tsx`
- `src/components/clients/client-form-fields.tsx`
- `src/app/page.tsx` (compose page)

## UI Structure
1. Page shell (`clients-page.tsx`)
- title + top action bar
- `Add patient` button
- filter section
- table section

2. Filters (`client-filters.tsx`)
- `name` text input
- `petName` text input
- `petType` select (`dog|cat|parrot`)
- clear filters action
- debounced text filters (250-400ms)

3. Table (`client-table.tsx`)
- columns: `Name`, `Phone`, `Pet Name`, `Pet Age`, `Pet Type`, `Actions`
- row actions: edit icon button, delete icon button
- computed `Pet Age` from `petBirthDate`
- states: loading, empty, error

4. Modal (`client-modal.tsx`)
- single reusable modal:
  - mode `add` -> create flow
  - mode `edit` -> update flow (prefill fields)
- fields:
  - `name`, `phone`, `petName`, `petBirthDate`, `petType`, `notes`
- submit/close actions
- inline validation messages

5. Delete dialog (`delete-client-dialog.tsx`)
- confirm delete before mutation
- disables while mutation is pending

## Data/Hook Wiring
- list: `useClientsQuery(filters)`
- create/update/delete: `useClientMutations()`
- optional detail fetch for edit mode: `useClientQuery(id)` if needed
- after mutations rely on existing invalidation from item 4

## Interaction Rules
- Add flow:
  - open empty modal
  - submit -> create mutation
  - on success close + reset form
- Edit flow:
  - open modal with selected row data
  - submit -> update mutation
  - on success close
- Delete flow:
  - open confirm dialog
  - confirm -> delete mutation
  - on success close

## Styling/Responsiveness
- Tailwind-only styling, generic spacing (`p-4`, `p-8`, `p-16`)
- Desktop: table layout
- Mobile: stacked row cards fallback
- Keep current minimal style direction for now, polish in item 6

## Step-by-Step
1. Create component folder and component skeletons
2. Implement filter state + debounce
3. Build table with loading/empty/error states
4. Build modal and form state handling for add/edit
5. Build delete confirm dialog
6. Wire mutations + pending/error feedback
7. Replace temporary `page.tsx` with final composed UI
8. Run lint + typecheck

## Acceptance Criteria
- Single page includes functional table + filters + add/edit modal
- CRUD works from UI against existing API
- One modal component supports both add and edit modes
- Delete confirmation works and updates list
- Mobile and desktop layouts are usable
- Lint and typecheck pass

## Status
- Implemented in code
- Lint passes
- Typecheck passes
