import { NextRequest, NextResponse } from 'next/server'
import { validateClientPayload } from '@/services/client-validation.service'
import { GetClients, addClient } from '@/services/client.service'
import { ApiFailure, ApiSuccess } from '@/types/api'
import { ClientRecord, PetType } from '@/types/client'

const allowedPetTypes: PetType[] = ['dog', 'cat', 'parrot']

function success<TData>(data: TData, status = 200) {
  const body: ApiSuccess<TData> = { data, error: null }
  return NextResponse.json(body, { status })
}

function failure(message: string, status: number, details?: string[]) {
  const body: ApiFailure = {
    data: null,
    error: { message, details }
  }
  return NextResponse.json(body, { status })
}

function parsePetType(value: string | null): PetType | undefined {
  if (!value) {
    return undefined
  }

  if (!allowedPetTypes.includes(value as PetType)) {
    return undefined
  }

  return value as PetType
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
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
