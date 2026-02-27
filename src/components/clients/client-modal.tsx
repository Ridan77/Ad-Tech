'use client'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material'
import { ClientRecord, PetType } from '@/types/client'
import { ClientFormFields, ClientFormValues } from '@/components/clients/client-form-fields'
import { dialogTransitionDuration, subtleOutlineButtonSx } from '@/lib/styles/mui'

type ClientModalProps = {
  mode: 'add' | 'edit'
  isOpen: boolean
  client: ClientRecord | null
  isSubmitting: boolean
  isDeleting?: boolean
  submitError?: string | null
  deleteError?: string | null
  startInDeleteConfirm?: boolean
  onClose: () => void
  onSubmit: (values: ClientFormValues) => Promise<void>
  onDelete?: () => Promise<void>
}

const defaultValues: ClientFormValues = {
  name: '',
  phone: '',
  petName: '',
  petBirthDate: '',
  petType: 'dog',
  notes: ''
}

function toDateInputValue(value: Date): string {
  return value.toISOString().slice(0, 10)
}

function toValues(client: ClientRecord | null): ClientFormValues {
  if (!client) {
    return defaultValues
  }

  return {
    name: client.name,
    phone: client.phone,
    petName: client.petName,
    petBirthDate: toDateInputValue(client.petBirthDate),
    petType: client.petType,
    notes: client.notes || ''
  }
}

function validate(values: ClientFormValues) {
  const errors: Partial<Record<keyof ClientFormValues, string>> = {}

  if (!values.name.trim()) errors.name = 'Name is required'
  if (!values.phone.trim()) errors.phone = 'Phone is required'
  if (!values.petName.trim()) errors.petName = 'Pet name is required'
  if (!values.petBirthDate) errors.petBirthDate = 'Pet birth date is required'
  if (!['dog', 'cat', 'parrot'].includes(values.petType)) {
    errors.petType = 'Pet type must be one of: dog, cat, parrot'
  }

  return errors
}

export function ClientModal({
  mode,
  isOpen,
  client,
  isSubmitting,
  isDeleting = false,
  submitError,
  deleteError,
  startInDeleteConfirm = false,
  onClose,
  onSubmit,
  onDelete
}: ClientModalProps) {
  const [values, setValues] = useState<ClientFormValues>(defaultValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({})
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const modalTitle = useMemo(() => (mode === 'add' ? 'Add patient' : 'Edit patient'), [mode])
  const isBusy = isSubmitting || isDeleting
  const canDelete = mode === 'edit' && Boolean(client) && Boolean(onDelete)

  useEffect(() => {
    if (isOpen) {
      setValues(toValues(client))
      setErrors({})
      setIsConfirmingDelete(mode === 'edit' && startInDeleteConfirm)
    }
  }, [client, isOpen, mode, startInDeleteConfirm])

  const onFieldChange = (field: keyof ClientFormValues, value: string) => {
    const nextValue = field === 'petType' ? (value as PetType) : value
    setValues(prev => ({
      ...prev,
      [field]: nextValue
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    await onSubmit(values)
  }

  const onDeleteClick = async () => {
    if (!canDelete || !onDelete) {
      return
    }

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    await onDelete()
  }

  const onModalClose = () => {
    if (isBusy) {
      return
    }

    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onModalClose}
      fullWidth
      maxWidth='sm'
      transitionDuration={dialogTransitionDuration}
      PaperProps={{ className: 'motion-fade-in' }}
    >
      <DialogTitle>
        <div className='flex items-center justify-between gap-3'>
          <span>{modalTitle}</span>
          {canDelete && (
            <IconButton
              onClick={onDeleteClick}
              disabled={isBusy}
              aria-label={isConfirmingDelete ? 'confirm delete patient' : 'delete patient'}
              color='error'
              size='small'
            >
              <DeleteOutlineIcon fontSize='small' />
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <form onSubmit={onFormSubmit}>
        <DialogContent dividers>
          <div className='grid gap-4'>
            {isConfirmingDelete && canDelete && (
              <Alert severity='warning'>
                Click the delete icon again to permanently remove this patient.
              </Alert>
            )}
            <ClientFormFields
              values={values}
              errors={errors}
              onFieldChange={onFieldChange}
              disabled={isBusy}
            />
            {submitError && <Alert severity='error'>{submitError}</Alert>}
            {deleteError && <Alert severity='error'>{deleteError}</Alert>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onModalClose} disabled={isBusy} variant='outlined' sx={subtleOutlineButtonSx}>
            Close
          </Button>
          <Button type='submit' disabled={isBusy} variant='contained'>
            {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
