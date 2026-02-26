'use client'

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type DeleteClientDialogProps = {
  isOpen: boolean
  isDeleting: boolean
  submitError?: string | null
  clientName?: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function DeleteClientDialog({
  isOpen,
  isDeleting,
  submitError,
  clientName,
  onCancel,
  onConfirm
}: DeleteClientDialogProps) {
  const onDelete = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={isOpen} onClose={onCancel} fullWidth maxWidth='xs'>
      <DialogTitle>Delete patient</DialogTitle>
      <DialogContent dividers>
        <p className='text-sm text-slate-700'>
          Are you sure you want to delete {clientName ? `"${clientName}"` : 'this patient'}?
        </p>
        {submitError && (
          <div className='mt-4'>
            <Alert severity='error'>{submitError}</Alert>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isDeleting} variant='outlined'>
          Cancel
        </Button>
        <Button onClick={onDelete} disabled={isDeleting} color='error' variant='contained'>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
