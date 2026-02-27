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

function getPetAge(birthDate: Date): string {
  const now = new Date()
  let years = now.getFullYear() - birthDate.getFullYear()
  let months = now.getMonth() - birthDate.getMonth()

  if (now.getDate() < birthDate.getDate()) {
    months -= 1
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  if (years < 0) {
    return '0.0'
  }

  return `${years}.${months}`
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
              <IconButton
                size='small'
                onClick={() => onEdit(row.original)}
                aria-label='edit'
                className='action-hover'
              >
                <EditOutlinedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={() => onDelete(row.original)}
                aria-label='delete'
                color='error'
                className='action-hover'
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
    return (
      <p className='surface-card motion-fade-in p-8 text-sm text-slate-600'>
        Loading patients...
      </p>
    )
  }

  if (isError) {
    return (
      <p className='motion-fade-in rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-danger'>
        {errorMessage || 'Failed to load clients'}
      </p>
    )
  }

  if (clients.length === 0) {
    return (
      <p className='surface-card motion-fade-in p-8 text-sm text-slate-600'>
        No patients found
      </p>
    )
  }

  return (
    <>
      <div className='surface-card motion-fade-in hidden overflow-hidden md:block'>
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
              <tr key={row.id} className='motion-fade-up border-t border-slate-200 hover:bg-slate-50/60'>
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

      <div className='grid gap-3 md:hidden [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]'>
        {clients.map(client => (
          <div key={client.id} className='surface-card motion-fade-up p-4'>
            <div className='  grid grid-cols-[68px,1fr,36px] items-end gap-x-3 gap-y-1'>
              {[
                ['Name', client.name],
                ['Phone', client.phone],
                ['Pet', client.petName],
                ['Age', getPetAge(client.petBirthDate)],
                ['Type', client.petType]
              ].map(([label, value], index) => (
                <div key={label} className='contents w-254px'>
                  <span className='text-[10px] font-medium  tracking-wide text-slate-500'>
                    {label}
                  </span>
                  <span className='text-sm text-slate-800 capitalize'>{value}</span>
                  {index === 0 && (
                    <div className='row-span-5 h-full flex flex-col justify-center gap-1'>
                      <Tooltip title='Edit'>
                        <IconButton
                          size='small'
                          onClick={() => onEdit(client)}
                          aria-label='edit'
                          className='action-hover'
                        >
                          <EditOutlinedIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Delete'>
                        <IconButton
                          size='small'
                          onClick={() => onDelete(client)}
                          aria-label='delete'
                          color='error'
                          className='action-hover'
                        >
                          <DeleteOutlineIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
