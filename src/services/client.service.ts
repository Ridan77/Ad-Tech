import { Collection, Filter, ObjectId, WithId } from 'mongodb'
import { connectToDatabase } from '@/services/db.service'
import { ClientFilters, ClientInput, ClientRecord } from '@/types/client'

type ClientDocument = Omit<ClientRecord, 'id'>

async function getClientsCollection(): Promise<Collection<ClientDocument>> {
  try {
    const { db } = await connectToDatabase()
    return db.collection<ClientDocument>('clients')
  } catch (error) {
    throw new Error(`Database connection failed: ${getErrorMessage(error)}`)
  }
}

function toClientRecord(document: WithId<ClientDocument>): ClientRecord {
  return {
    id: document._id.toHexString(),
    name: document.name,
    phone: document.phone,
    petName: document.petName,
    petBirthDate: document.petBirthDate,
    petType: document.petType,
    notes: document.notes,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt
  }
}

function buildFilters(filters: ClientFilters): Filter<ClientDocument> {
  const query: Filter<ClientDocument> = {}

  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' }
  }

  if (filters.petName) {
    query.petName = { $regex: filters.petName, $options: 'i' }
  }

  if (filters.petType) {
    query.petType = filters.petType
  }

  return query
}

function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) {
    return null
  }

  return new ObjectId(id)
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}

export async function GetClients(filters: ClientFilters = {}): Promise<ClientRecord[]> {
  try {
    const collection = await getClientsCollection()
    const query = buildFilters(filters)
    const docs = await collection.find(query).sort({ createdAt: -1 }).toArray()
    return docs.map(toClientRecord)
  } catch (error) {
    throw new Error(`Failed to list clients: ${getErrorMessage(error)}`)
  }
}

export async function getClientById(id: string): Promise<ClientRecord | null> {
  const objectId = parseObjectId(id)
  if (!objectId) {
    throw new Error('Invalid client id')
  }

  try {
    const collection = await getClientsCollection()
    const client = await collection.findOne({ _id: objectId })

    if (!client) {
      return null
    }

    return toClientRecord(client)
  } catch (error) {
    throw new Error(`Failed to get client by id: ${getErrorMessage(error)}`)
  }
}

export async function addClient(input: ClientInput): Promise<ClientRecord> {
  try {
    const collection = await getClientsCollection()
    const now = new Date()

    const result = await collection.insertOne({
      name: input.name,
      phone: input.phone,
      petName: input.petName,
      petBirthDate: input.petBirthDate,
      petType: input.petType,
      notes: input.notes,
      createdAt: now,
      updatedAt: now
    })

    const saved = await collection.findOne({ _id: result.insertedId })
    if (!saved) {
      throw new Error('Failed to load created client')
    }

    return toClientRecord(saved)
  } catch (error) {
    throw new Error(`Failed to add client: ${getErrorMessage(error)}`)
  }
}

export async function updateClient(
  id: string,
  input: Partial<ClientInput>
): Promise<ClientRecord | null> {
  const objectId = parseObjectId(id)
  if (!objectId) {
    throw new Error('Invalid client id')
  }

  try {
    const collection = await getClientsCollection()
    const updatePayload: Partial<ClientDocument> = {
      ...input,
      updatedAt: new Date()
    }

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updatePayload },
      { returnDocument: 'after' }
    )

    if (!result) {
      return null
    }

    return toClientRecord(result)
  } catch (error) {
    throw new Error(`Failed to update client: ${getErrorMessage(error)}`)
  }
}

export async function removeClient(id: string): Promise<boolean> {
  const objectId = parseObjectId(id)
  if (!objectId) {
    throw new Error('Invalid client id')
  }

  try {
    const collection = await getClientsCollection()
    const result = await collection.deleteOne({ _id: objectId })
    return result.deletedCount === 1
  } catch (error) {
    throw new Error(`Failed to remove client: ${getErrorMessage(error)}`)
  }
}
