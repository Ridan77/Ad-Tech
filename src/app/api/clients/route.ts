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

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')?.trim() || undefined
    const petName = request.nextUrl.searchParams.get('petName')?.trim() || undefined
    const petTypeRaw = request.nextUrl.searchParams.get('petType')?.trim() || null

    if (petTypeRaw && !parsePetType(petTypeRaw)) {
      return failure('Invalid petType filter', 400, ['petType must be one of: dog, cat, parrot'])
    }

    const clients = await GetClients({
      name,
      petName,
      petType: parsePetType(petTypeRaw)
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
