import { SxProps, Theme } from '@mui/material'

export const compactFieldSx: SxProps<Theme> = {
  '& .MuiInputBase-root': {
    minHeight: 34,
    fontSize: 13
  },
  '& .MuiInputLabel-root': {
    fontSize: 12
  }
}

export const subtleOutlineButtonSx: SxProps<Theme> = {
  color: '#475569',
  borderColor: '#cbd5e1',
  '&:hover': {
    borderColor: '#94a3b8',
    backgroundColor: '#f8fafc'
  }
}

export const getSortButtonSx = (active: boolean): SxProps<Theme> => ({
  justifyContent: 'space-between',
  color: active ? '#1f2937' : '#64748b',
  borderColor: '#cbd5e1',
  textTransform: 'none',
  height: 35
})

export const dialogTransitionDuration = {
  enter: 180,
  exit: 120
}
