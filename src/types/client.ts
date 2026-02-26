export type PetType = 'dog' | 'cat' | 'parrot'

export interface ClientInput {
  name: string
  phone: string
  petName: string
  petBirthDate: Date
  petType: PetType
  notes?: string
}

export interface ClientRecord extends ClientInput {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface ClientFilters {
  name?: string
  petName?: string
  petTypes?: PetType[]
}

export type ClientSortBy = 'name' | 'petName' | null
export type ClientSortDirection = 'asc' | 'desc'
