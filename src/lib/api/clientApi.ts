import { ApiResponse } from '@/types/api'
import { ClientFilters, ClientInput, ClientRecord, PetType } from '@/types/client'

type ClientResponsePayload = Omit<ClientRecord, 'petBirthDate' | 'createdAt' | 'updatedAt'> & {
  petBirthDate: string
  createdAt: string
  updatedAt: string
}

type ClientCreateInput = Omit<ClientInput, 'petBirthDate'> & {
  petBirthDate: string
}

type ClientUpdateInput = Partial<Omit<ClientInput, 'petBirthDate'>> & {
  petBirthDate?: string
}

function buildQueryString(filters: ClientFilters): string {
  const params = new URLSearchParams()

  if (filters.name) {
    params.set('name', filters.name)
  }
  if (filters.petName) {
    params.set('petName', filters.petName)
  }
  if (filters.petType) {
    params.set('petType', filters.petType)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

function normalizePetType(value: string): PetType {
  if (value === 'dog' || value === 'cat' || value === 'parrot') {
    return value
  }

  throw new Error(`Invalid pet type in response: ${value}`)
}

function toClientRecord(payload: ClientResponsePayload): ClientRecord {
  return {
    id: payload.id,
    name: payload.name,
    phone: payload.phone,
    petName: payload.petName,
    petBirthDate: new Date(payload.petBirthDate),
    petType: normalizePetType(payload.petType),
    notes: payload.notes,
    createdAt: new Date(payload.createdAt),
    updatedAt: new Date(payload.updatedAt)
  }
}

function serializeClientInput(input: ClientCreateInput | ClientUpdateInput) {
  return JSON.stringify(input)
}

async function unwrapResponse<TData>(response: Response): Promise<TData> {
  const json = (await response.json()) as ApiResponse<TData>

  if (!response.ok || json.error) {
    const details = json.error?.details?.join(', ')
    const suffix = details ? ` (${details})` : ''
    throw new Error(`${json.error?.message || 'Request failed'}${suffix}`)
  }

  return json.data
}

export async function getClients(filters: ClientFilters = {}): Promise<ClientRecord[]> {
  const query = buildQueryString(filters)
  const response = await fetch(`/api/clients${query}`, {
    method: 'GET'
  })
  const data = await unwrapResponse<ClientResponsePayload[]>(response)
  return data.map(toClientRecord)
}

export async function getClientById(id: string): Promise<ClientRecord> {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'GET'
  })
  const data = await unwrapResponse<ClientResponsePayload>(response)
  return toClientRecord(data)
}

export async function createClient(payload: ClientCreateInput): Promise<ClientRecord> {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: serializeClientInput(payload)
  })
  const data = await unwrapResponse<ClientResponsePayload>(response)
  return toClientRecord(data)
}

export async function updateClient(
  id: string,
  payload: ClientUpdateInput
): Promise<ClientRecord> {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: serializeClientInput(payload)
  })
  const data = await unwrapResponse<ClientResponsePayload>(response)
  return toClientRecord(data)
}

export async function deleteClient(id: string): Promise<{ deleted: boolean }> {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'DELETE'
  })
  return unwrapResponse<{ deleted: boolean }>(response)
}

export type { ClientCreateInput, ClientUpdateInput }
