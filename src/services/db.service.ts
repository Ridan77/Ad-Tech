import { Db, MongoClient } from 'mongodb'

type MongoCache = {
  client: MongoClient | null
  promise: Promise<MongoClient> | null
}

declare global {
  var mongoCache: MongoCache | undefined
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'pet-clinic'

if (!global.mongoCache) {
  global.mongoCache = { client: null, promise: null }
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  if (!global.mongoCache) {
    global.mongoCache = { client: null, promise: null }
  }

  const cache = global.mongoCache

  if (cache.client) {
    return { client: cache.client, db: cache.client.db(dbName) }
  }

  if (!cache.promise) {
    const client = new MongoClient(uri)
    cache.promise = client.connect()
  }

  const connectedClient = await cache.promise
  cache.client = connectedClient

  return { client: connectedClient, db: connectedClient.db(dbName) }
}
