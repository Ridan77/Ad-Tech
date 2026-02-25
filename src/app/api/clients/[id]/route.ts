import { NextRequest, NextResponse } from 'next/server'
import { validateClientUpdatePayload } from '@/services/client-validation.service'
import { getClientById, removeClient, updateClient } from '@/services/client.service'
import { ApiFailure, ApiSuccess } from '@/types/api'
import { ClientRecord } from '@/types/client'

type RouteParams = {
  params: Promise<{ id: string }>
}

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}

function isInvalidIdError(error: unknown): boolean {
  return error instanceof Error && error.message.toLowerCase().includes('invalid client id')
}

export async function GET(_request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params
    const client = await getClientById(id)

    if (!client) {
      return failure('Client not found', 404)
    }

    return success<ClientRecord>(client)
  } catch (error) {
    if (isInvalidIdError(error)) {
      return failure('Invalid client id', 400)
    }

    return failure('Failed to fetch client', 500, [getErrorMessage(error)])
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params
    const payload = await request.json()
    const validation = validateClientUpdatePayload(payload)

    if (!validation.ok) {
      return failure('Validation failed', 400, validation.errors)
    }

    const updatedClient = await updateClient(id, validation.data)

    if (!updatedClient) {
      return failure('Client not found', 404)
    }

    return success<ClientRecord>(updatedClient)
  } catch (error) {
    if (error instanceof SyntaxError) {
      return failure('Invalid JSON body', 400)
    }

    if (isInvalidIdError(error)) {
      return failure('Invalid client id', 400)
    }

    return failure('Failed to update client', 500, [getErrorMessage(error)])
  }
}

export async function DELETE(_request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params
    const deleted = await removeClient(id)

    if (!deleted) {
      return failure('Client not found', 404)
    }

    return success<{ deleted: boolean }>({ deleted: true })
  } catch (error) {
    if (isInvalidIdError(error)) {
      return failure('Invalid client id', 400)
    }

    return failure('Failed to delete client', 500, [getErrorMessage(error)])
  }
}
