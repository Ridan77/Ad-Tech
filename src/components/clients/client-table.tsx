'use client'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { IconButton, Tooltip } from '@mui/material'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { ClientRecord } from '@/types/client'

type ClientTableProps = {
  clients: ClientRecord[]
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onEdit: (client: ClientRecord) => void
  onDelete: (client: ClientRecord) => void
}

function getPetAge(birthDate: Date): number {
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  const hasHadBirthday =
    monthDiff > 0 || (monthDiff === 0 && now.getDate() >= birthDate.getDate())

  if (!hasHadBirthday) {
    age -= 1
  }

  return Math.max(age, 0)
}

export function ClientTable({
  clients,
  isLoading,
  isError,
  errorMessage,
  onEdit,
  onDelete
}: ClientTableProps) {
  const columns = useMemo<ColumnDef<ClientRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name'
      },
      {
        accessorKey: 'phone',
        header: 'Phone'
      },
      {
        accessorKey: 'petName',
        header: 'Pet Name'
      },
      {
        id: 'petAge',
        header: 'Pet Age',
        cell: ({ row }) => getPetAge(row.original.petBirthDate)
      },
      {
        accessorKey: 'petType',
        header: 'Pet Type',
        cell: ({ row }) => <span className='capitalize'>{row.original.petType}</span>
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => onEdit(row.original)} aria-label='edit'>
                <EditOutlinedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={() => onDelete(row.original)}
                aria-label='delete'
                color='error'
              >
                <DeleteOutlineIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    ],
    [onDelete, onEdit]
  )

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  if (isLoading) {
    return <p className='rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600'>Loading...</p>
  }

  if (isError) {
    return (
      <p className='rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-danger'>
        {errorMessage || 'Failed to load clients'}
      </p>
    )
  }

  if (clients.length === 0) {
    return <p className='rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600'>No patients found</p>
  }

  return (
    <>
      <div className='hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block'>
        <table className='w-full table-fixed text-left text-sm'>
          <colgroup>
            <col className='w-[17%]' />
            <col className='w-[17%]' />
            <col className='w-[17%]' />
            <col className='w-[12%]' />
            <col className='w-[17%]' />
            <col className='w-[20%]' />
          </colgroup>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className='border-t border-slate-200'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className='px-4 py-3'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='grid gap-3 md:hidden'>
        {clients.map(client => (
          <div key={client.id} className='rounded-2xl border border-slate-200 bg-white p-4'>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <span className='text-slate-500'>Name</span>
              <span>{client.name}</span>
              <span className='text-slate-500'>Phone</span>
              <span>{client.phone}</span>
              <span className='text-slate-500'>Pet Name</span>
              <span>{client.petName}</span>
              <span className='text-slate-500'>Pet Age</span>
              <span>{getPetAge(client.petBirthDate)}</span>
              <span className='text-slate-500'>Pet Type</span>
              <span className='capitalize'>{client.petType}</span>
            </div>
            <div className='mt-4 flex items-center gap-1'>
              <Tooltip title='Edit'>
                <IconButton size='small' onClick={() => onEdit(client)} aria-label='edit'>
                  <EditOutlinedIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton
                  size='small'
                  onClick={() => onDelete(client)}
                  aria-label='delete'
                  color='error'
                >
                  <DeleteOutlineIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
