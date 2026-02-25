# Delivery Workflow Item 2 Plan

## Scope
Implement:
1. MongoDB connection layer
2. `Client` persistence layer aligned to spec (without Mongoose)
3. Request validation helpers (without Zod)

## Target Files
- `src/services/db.service.ts`
- `src/services/client.service.ts`
- `src/services/client-validation.service.ts`
- `src/types/client.ts`
- `.env.example`

## Step-by-Step
1. Define TypeScript domain types
- Add `PetType = 'dog' | 'cat' | 'parrot'`
- Add `Client`/`ClientInput` interfaces:
  - `name`, `phone`, `petName`, `petBirthDate`, `petType`
  - optional `notes`

2. Add Mongo connection utility in `src/lib/db.ts`
- Read `MONGODB_URI` from env
- Cache connection in global scope to avoid hot-reload reconnect storms
- Export `connectToDatabase()` from `src/services/db.service.ts`
- Throw explicit error if URI is missing

3. Create client service with MongoDB native driver in `src/services/client.service.ts`
- Use `mongodb` package (`MongoClient`, `ObjectId`)
- Collection: `clients`
- Document fields:
  - `name: string` required, trimmed
  - `phone: string` required, trimmed
  - `petName: string` required, trimmed
  - `petBirthDate: Date` required
  - `petType: 'dog' | 'cat' | 'parrot'` required
  - `notes?: string`
  - `createdAt: Date`
  - `updatedAt: Date`
- Export pure service functions:
  - `listClients(filters)`
  - `createClient(input)`
  - `updateClient(id, input)`
  - `removeClient(id)`

4. Add validation helpers in `src/services/client-validation.service.ts`
- `validateClientPayload(payload)` for create
- `validateClientUpdatePayload(payload)` for update
- Rules:
  - required fields present for create
  - strings must be non-empty after trim
  - `petBirthDate` must be valid date
  - `petType` must be one of `dog|cat|parrot`
- Return normalized data + error list shape:
  - `{ ok: true, data }`
  - `{ ok: false, errors: string[] }`

5. Add `.env.example`
- `MONGODB_URI=`
- optional `MONGODB_DB=pet-clinic`

## Acceptance Criteria
- Data shape matches `System-Spec.jpg`
- DB utility can be imported by API routes without duplicate connection issues
- Invalid payloads are rejected by helper functions before DB writes
- No `any` types used
- Service layer follows repo convention (`src/services/*.service.ts`)

## Notes
- This item does not include API route handlers yet (that is Delivery Workflow item 3)
- Keep implementation TypeScript-only and aligned with current lint/format rules
