import { ClientInput, PetType } from '@/types/client'

type ValidationSuccess<TData> = {
  ok: true
  data: TData
}

type ValidationFailure = {
  ok: false
  errors: string[]
}

export type ValidationResult<TData> = ValidationSuccess<TData> | ValidationFailure

const allowedPetTypes: PetType[] = ['dog', 'cat', 'parrot']
const allowedUpdateKeys = ['name', 'phone', 'petName', 'petBirthDate', 'petType', 'notes'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readRequiredString(value: unknown, fieldName: string, errors: string[]): string {
  if (typeof value !== 'string') {
    errors.push(`${fieldName} is required`)
    return ''
  }

  const trimmed = value.trim()
  if (!trimmed) {
    errors.push(`${fieldName} is required`)
  }
  return trimmed
}

function readOptionalString(value: unknown, fieldName: string, errors: string[]): string | undefined {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`)
    return undefined
  }

  const trimmed = value.trim()
  return trimmed || undefined
}

function readPetType(value: unknown, errors: string[]): PetType | null {
  if (typeof value !== 'string') {
    errors.push('petType is required')
    return null
  }

  if (!allowedPetTypes.includes(value as PetType)) {
    errors.push('petType must be one of: dog, cat, parrot')
    return null
  }

  return value as PetType
}

function readDate(value: unknown, fieldName: string, errors: string[]): Date | null {
  if (!(typeof value === 'string' || value instanceof Date)) {
    errors.push(`${fieldName} is required`)
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`${fieldName} must be a valid date`)
    return null
  }

  return parsed
}

export function validateClientPayload(payload: unknown): ValidationResult<ClientInput> {
  if (!isRecord(payload)) {
    return { ok: false, errors: ['Payload must be an object'] }
  }

  const errors: string[] = []
  const name = readRequiredString(payload.name, 'name', errors)
  const phone = readRequiredString(payload.phone, 'phone', errors)
  const petName = readRequiredString(payload.petName, 'petName', errors)
  const petBirthDate = readDate(payload.petBirthDate, 'petBirthDate', errors)
  const petType = readPetType(payload.petType, errors)
  const notes = readOptionalString(payload.notes, 'notes', errors)

  if (errors.length > 0 || !petBirthDate || !petType) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      petName,
      petBirthDate,
      petType,
      notes
    }
  }
}

export function validateClientUpdatePayload(payload: unknown): ValidationResult<Partial<ClientInput>> {
  if (!isRecord(payload)) {
    return { ok: false, errors: ['Payload must be an object'] }
  }

  const errors: string[] = []
  const keys = Object.keys(payload)

  if (keys.length === 0) {
    return { ok: false, errors: ['At least one field must be provided for update'] }
  }

  for (const key of keys) {
    if (!allowedUpdateKeys.includes(key as (typeof allowedUpdateKeys)[number])) {
      errors.push(`Unknown field: ${key}`)
    }
  }

  const data: Partial<ClientInput> = {}

  if (payload.name !== undefined) {
    const name = readRequiredString(payload.name, 'name', errors)
    if (name) data.name = name
  }

  if (payload.phone !== undefined) {
    const phone = readRequiredString(payload.phone, 'phone', errors)
    if (phone) data.phone = phone
  }

  if (payload.petName !== undefined) {
    const petName = readRequiredString(payload.petName, 'petName', errors)
    if (petName) data.petName = petName
  }

  if (payload.petBirthDate !== undefined) {
    const petBirthDate = readDate(payload.petBirthDate, 'petBirthDate', errors)
    if (petBirthDate) data.petBirthDate = petBirthDate
  }

  if (payload.petType !== undefined) {
    const petType = readPetType(payload.petType, errors)
    if (petType) data.petType = petType
  }

  if (payload.notes !== undefined) {
    const notes = readOptionalString(payload.notes, 'notes', errors)
    data.notes = notes
  }

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, errors: ['No valid fields were provided for update'] }
  }

  return { ok: true, data }
}
