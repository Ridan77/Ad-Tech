import { NextRequest } from 'next/server'
import { validateClientPayload } from '@/services/client-validation.service'
import { GetClients, addClient } from '@/services/client.service'
import { failure, success } from '@/lib/api/route-response'
import { getErrorMessage } from '@/lib/api/route-errors'
import { ClientRecord, PetType } from '@/types/client'

const allowedPetTypes: PetType[] = ['dog', 'cat', 'parrot']

function parsePetType(value: string | null): PetType | undefined {
  if (!value) {
    return undefined
  }

  if (!allowedPetTypes.includes(value as PetType)) {
    return undefined
  }

  return value as PetType
}

function parsePetTypes(values: string[]): PetType[] | null {
  const expanded = values
    .flatMap(value => value.split(','))
    .map(value => value.trim())
    .filter(Boolean)

  const parsed: PetType[] = []

  for (const value of expanded) {
    const petType = parsePetType(value)
    if (!petType) {
      return null
    }
    if (!parsed.includes(petType)) {
      parsed.push(petType)
    }
  }

  return parsed
}

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')?.trim() || undefined
    const petName = request.nextUrl.searchParams.get('petName')?.trim() || undefined
    const petTypeRawValues = request.nextUrl.searchParams.getAll('petType')
    const parsedPetTypes = parsePetTypes(petTypeRawValues)

    if (petTypeRawValues.length > 0 && !parsedPetTypes) {
      return failure('Invalid petType filter', 400, ['petType must be one of: dog, cat, parrot'])
    }

    const clients = await GetClients({
      name,
      petName,
      petTypes: parsedPetTypes || undefined
    })

    return success<ClientRecord[]>(clients)
  } catch (error) {
    return failure('Failed to fetch clients', 500, [getErrorMessage(error)])
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const validation = validateClientPayload(payload)

    if (!validation.ok) {
      return failure('Validation failed', 400, validation.errors)
    }

    const createdClient = await addClient(validation.data)
    return success<ClientRecord>(createdClient, 201)
  } catch (error) {
    if (error instanceof SyntaxError) {
      return failure('Invalid JSON body', 400)
    }

    return failure('Failed to create client', 500, [getErrorMessage(error)])
  }
}
