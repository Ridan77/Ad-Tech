'use client'

import { Button } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { ClientFilters, ClientRecord } from '@/types/client'
import { useClientsQuery } from '@/hooks/use-clients-query'
import { useClientMutations } from '@/hooks/use-client-mutations'
import { ClientFiltersPanel } from '@/components/clients/client-filters'
import { ClientTable } from '@/components/clients/client-table'
import { ClientModal } from '@/components/clients/client-modal'
import { ClientFormValues } from '@/components/clients/client-form-fields'
import { DeleteClientDialog } from '@/components/clients/delete-client-dialog'

type ModalState = {
  mode: 'add' | 'edit'
  isOpen: boolean
  client: ClientRecord | null
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

function normalizeFilters(filters: ClientFilters): ClientFilters {
  return {
    name: filters.name?.trim() || undefined,
    petName: filters.petName?.trim() || undefined,
    petTypes: filters.petTypes && filters.petTypes.length > 0 ? filters.petTypes : undefined
  }
}

export function ClientsPage() {
  const [filters, setFilters] = useState<ClientFilters>({})
  const [debouncedFilters, setDebouncedFilters] = useState<ClientFilters>({})
  const [modalState, setModalState] = useState<ModalState>({
    mode: 'add',
    isOpen: false,
    client: null
  })
  const [deleteTarget, setDeleteTarget] = useState<ClientRecord | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { createClientMutation, updateClientMutation, deleteClientMutation } = useClientMutations()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedFilters(normalizeFilters(filters))
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [filters])

  const clientsQuery = useClientsQuery(debouncedFilters)
  const clients = useMemo(() => clientsQuery.data || [], [clientsQuery.data])

  const onOpenAddModal = () => {
    setSubmitError(null)
    setModalState({
      mode: 'add',
      isOpen: true,
      client: null
    })
  }

  const onOpenEditModal = (client: ClientRecord) => {
    setSubmitError(null)
    setModalState({
      mode: 'edit',
      isOpen: true,
      client
    })
  }

  const onCloseModal = () => {
    if (createClientMutation.isPending || updateClientMutation.isPending) {
      return
    }
    setModalState(prev => ({ ...prev, isOpen: false }))
    setSubmitError(null)
  }

  const onOpenDeleteDialog = (client: ClientRecord) => {
    setDeleteError(null)
    setDeleteTarget(client)
  }

  const onCloseDeleteDialog = () => {
    if (deleteClientMutation.isPending) {
      return
    }
    setDeleteTarget(null)
    setDeleteError(null)
  }

  const onSubmitModal = async (values: ClientFormValues) => {
    setSubmitError(null)

    try {
      if (modalState.mode === 'add') {
        await createClientMutation.mutateAsync({
          name: values.name.trim(),
          phone: values.phone.trim(),
          petName: values.petName.trim(),
          petBirthDate: values.petBirthDate,
          petType: values.petType,
          notes: values.notes.trim() || undefined
        })
      } else {
        if (!modalState.client) {
          throw new Error('Missing selected client')
        }

        await updateClientMutation.mutateAsync({
          id: modalState.client.id,
          payload: {
            name: values.name.trim(),
            phone: values.phone.trim(),
            petName: values.petName.trim(),
            petBirthDate: values.petBirthDate,
            petType: values.petType,
            notes: values.notes.trim() || undefined
          }
        })
      }

      setModalState(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    }
  }

  const onConfirmDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setDeleteError(null)
    try {
      await deleteClientMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch (error) {
      setDeleteError(getErrorMessage(error))
    }
  }

  const onClearFilters = () => {
    setFilters({})
  }

  return (
    <main className='mx-auto min-h-screen max-w-6xl p-4 md:p-8'>
      <section className='grid gap-4 md:gap-5'>
        <div className='surface-card motion-fade-up flex flex-col gap-3 p-4 shadow-soft md:flex-row md:items-center md:justify-between md:p-6'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight text-brand-700'>Pet Clinic Management</h1>
            <p className='mt-1 text-sm text-slate-600'>Manage clinic patients in one place</p>
          </div>
          <Button type='button' onClick={onOpenAddModal} variant='contained'>
            + Add patient
          </Button>
        </div>

        <ClientFiltersPanel value={filters} onChange={setFilters} onClear={onClearFilters} />

        <ClientTable
          clients={clients}
          isLoading={clientsQuery.isLoading}
          isError={clientsQuery.isError}
          errorMessage={clientsQuery.isError ? getErrorMessage(clientsQuery.error) : undefined}
          onEdit={onOpenEditModal}
          onDelete={onOpenDeleteDialog}
        />
      </section>

      <ClientModal
        mode={modalState.mode}
        isOpen={modalState.isOpen}
        client={modalState.client}
        isSubmitting={createClientMutation.isPending || updateClientMutation.isPending}
        submitError={submitError}
        onClose={onCloseModal}
        onSubmit={onSubmitModal}
      />

      <DeleteClientDialog
        isOpen={Boolean(deleteTarget)}
        isDeleting={deleteClientMutation.isPending}
        submitError={deleteError}
        clientName={deleteTarget?.name}
        onCancel={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </main>
  )
}
