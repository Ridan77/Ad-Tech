'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ClientCreateInput,
  ClientUpdateInput,
  createClient,
  deleteClient,
  updateClient
} from '@/lib/api/clientApi'
import { queryKeys } from '@/constants/query-keys'
import { ClientRecord } from '@/types/client'

type UpdateMutationVariables = {
  id: string
  payload: ClientUpdateInput
}

export function useClientMutations() {
  const queryClient = useQueryClient()

  const createClientMutation = useMutation({
    mutationFn: (payload: ClientCreateInput) => createClient(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    }
  })

  const updateClientMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateMutationVariables) => updateClient(id, payload),
    onSuccess: async (updatedClient: ClientRecord) => {
      queryClient.setQueryData(queryKeys.clients.detail(updatedClient.id), updatedClient)
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    }
  })

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    }
  })

  return {
    createClientMutation,
    updateClientMutation,
    deleteClientMutation
  }
}
