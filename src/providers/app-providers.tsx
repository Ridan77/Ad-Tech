'use client'

import { ReactNode, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type AppProvidersProps = {
  children: ReactNode
}

const appTheme = createTheme({
  typography: {
    fontFamily: "'Segoe UI', 'Arial', sans-serif",
    fontSize: 14
  },
  shape: {
    borderRadius: 10
  }
})

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000
          }
        }
      })
  )

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
