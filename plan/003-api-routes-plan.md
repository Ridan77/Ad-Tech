# Delivery Workflow Item 3 Plan

## Scope
Implement Next.js API routes for client CRUD using the existing services:
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/clients/:id`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

## Target Files
- `src/app/api/clients/route.ts`
- `src/app/api/clients/[id]/route.ts`
- `src/types/api.ts` (response shape helpers)

## Route Design
1. `GET /api/clients`
- Read optional query params: `name`, `petName`, `petType`
- Call `getClients(filters)`
- Return `200` with `{ data, error: null }`

2. `POST /api/clients`
- Parse JSON body
- Validate with `validateClientPayload`
- On validation failure return `400`
- On success call `createClient`
- Return `201` with created client

3. `PUT /api/clients/:id`
- Validate `id` format via service behavior
- Parse JSON body
- Validate with `validateClientUpdatePayload`
- On validation failure return `400`
- On missing record return `404`
- On success return `200` with updated client

4. `DELETE /api/clients/:id`
- Call `removeClient(id)`
- If nothing deleted return `404`
- If deleted return `200` with success payload

5. `GET /api/clients/:id`
- Validate `id` format via service behavior
- Call `getClientById(id)`
- On missing record return `404`
- On success return `200` with client
## Error Handling
- Use consistent JSON shape:
  - success: `{ data: ..., error: null }`
  - failure: `{ data: null, error: { message, details? } }`
- Handle:
  - invalid JSON body
  - validation errors
  - invalid id
  - unexpected server errors (`500`)

## Step-by-Step
1. Add API response types (`ApiSuccess<T>`, `ApiFailure`)
2. Implement `/api/clients/route.ts` (`GET`, `POST`)
3. Implement `/api/clients/[id]/route.ts` (`GET`, `PUT`, `DELETE`)
4. Add small private helpers in route files to avoid duplicate response logic
5. Test with manual `curl`/REST client:
- create -> list -> get by id -> update -> delete
- invalid payload and invalid id paths

## Acceptance Criteria
- All five endpoints work end-to-end with existing service layer
- Filters are applied in `GET /api/clients`
- Validation errors are clear and deterministic
- Response format is consistent across all handlers
- Lint and typecheck pass
