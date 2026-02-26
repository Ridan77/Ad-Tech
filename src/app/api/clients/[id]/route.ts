import { NextRequest } from 'next/server'
import { validateClientUpdatePayload } from '@/services/client-validation.service'
import { getClientById, removeClient, updateClient } from '@/services/client.service'
import { failure, success } from '@/lib/api/route-response'
import { getErrorMessage, isInvalidIdError } from '@/lib/api/route-errors'
import { ClientRecord } from '@/types/client'

type RouteParams = {
  params: Promise<{ id: string }>
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
