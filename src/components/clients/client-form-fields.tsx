'use client'

import { MenuItem, TextField } from '@mui/material'
import { PetType } from '@/types/client'

export type ClientFormValues = {
  name: string
  phone: string
  petName: string
  petBirthDate: string
  petType: PetType
  notes: string
}

type ClientFormFieldsProps = {
  values: ClientFormValues
  errors: Partial<Record<keyof ClientFormValues, string>>
  onFieldChange: (field: keyof ClientFormValues, value: string) => void
  disabled?: boolean
}

const petTypes: PetType[] = ['dog', 'cat', 'parrot']

export function ClientFormFields({ values, errors, onFieldChange, disabled }: ClientFormFieldsProps) {
  return (
    <div className='grid grid-cols-1 gap-4'>
      <TextField
        label='Name'
        value={values.name}
        onChange={event => onFieldChange('name', event.target.value)}
        disabled={disabled}
        error={Boolean(errors.name)}
        helperText={errors.name}
        fullWidth
      />

      <TextField
        label='Phone'
        value={values.phone}
        onChange={event => onFieldChange('phone', event.target.value)}
        disabled={disabled}
        error={Boolean(errors.phone)}
        helperText={errors.phone}
        fullWidth
      />

      <TextField
        label='Pet Name'
        value={values.petName}
        onChange={event => onFieldChange('petName', event.target.value)}
        disabled={disabled}
        error={Boolean(errors.petName)}
        helperText={errors.petName}
        fullWidth
      />

      <TextField
        label='Pet Birth Date'
        type='date'
        value={values.petBirthDate}
        onChange={event => onFieldChange('petBirthDate', event.target.value)}
        disabled={disabled}
        error={Boolean(errors.petBirthDate)}
        helperText={errors.petBirthDate}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField
        select
        label='Pet Type'
        value={values.petType}
        onChange={event => onFieldChange('petType', event.target.value)}
        disabled={disabled}
        error={Boolean(errors.petType)}
        helperText={errors.petType}
        fullWidth
      >
        {petTypes.map(type => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label='Notes'
        value={values.notes}
        onChange={event => onFieldChange('notes', event.target.value)}
        disabled={disabled}
        rows={3}
        multiline
        fullWidth
      />
    </div>
  )
}
