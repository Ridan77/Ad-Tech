'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { getClientById, getClients } from '@/lib/api/clientApi'
import { ClientFilters } from '@/types/client'

export function useClientsQuery(filters: ClientFilters = {}) {
  return useQuery({
    queryKey: queryKeys.clients.list(filters),
    queryFn: () => getClients(filters),
    placeholderData: keepPreviousData
  })
}

export function useClientQuery(id?: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id || ''),
    queryFn: () => getClientById(id || ''),
    enabled: Boolean(id)
  })
}
