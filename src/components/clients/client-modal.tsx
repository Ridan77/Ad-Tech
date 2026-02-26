'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { ClientRecord, PetType } from '@/types/client'
import { ClientFormFields, ClientFormValues } from '@/components/clients/client-form-fields'

type ClientModalProps = {
  mode: 'add' | 'edit'
  isOpen: boolean
  client: ClientRecord | null
  isSubmitting: boolean
  submitError?: string | null
  onClose: () => void
  onSubmit: (values: ClientFormValues) => Promise<void>
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
  submitError,
  onClose,
  onSubmit
}: ClientModalProps) {
  const [values, setValues] = useState<ClientFormValues>(defaultValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({})

  const modalTitle = useMemo(() => (mode === 'add' ? 'Add patient' : 'Edit patient'), [mode])

  useEffect(() => {
    if (isOpen) {
      setValues(toValues(client))
      setErrors({})
    }
  }, [client, isOpen])

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

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>{modalTitle}</DialogTitle>
      <form onSubmit={onFormSubmit}>
        <DialogContent dividers>
          <div className='grid gap-4'>
            <ClientFormFields
              values={values}
              errors={errors}
              onFieldChange={onFieldChange}
              disabled={isSubmitting}
            />
            {submitError && <Alert severity='error'>{submitError}</Alert>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting} variant='outlined'>
            Close
          </Button>
          <Button type='submit' disabled={isSubmitting} variant='contained'>
            {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
