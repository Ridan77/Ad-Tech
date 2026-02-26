'use client'

import { useClientsQuery } from '@/hooks/use-clients-query'

export default function HomePage() {
  const clientsQuery = useClientsQuery()
  const totalClients = clientsQuery.data?.length || 0

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-8 md:p-16">
      <section className="rounded-2xl bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-brand-700">Pet Clinic Management</h1>
        <p className="mt-3 text-slate-600">React Query integration is active</p>
        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          {clientsQuery.isLoading && <p className="text-sm text-slate-600">Loading clients...</p>}
          {clientsQuery.isError && (
            <p className="text-sm text-danger">
              {(clientsQuery.error as Error)?.message || 'Failed to load clients'}
            </p>
          )}
          {!clientsQuery.isLoading && !clientsQuery.isError && (
            <p className="text-sm text-slate-700">Total clients: {totalClients}</p>
          )}
        </div>
      </section>
    </main>
  )
}
