import { ClientFilters } from '@/types/client'

export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    list: (filters: ClientFilters) => ['clients', 'list', filters] as const,
    detail: (id: string) => ['clients', 'detail', id] as const
  }
}
