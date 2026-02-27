import { ReactNode } from 'react'

export type ClientTableColumnId = 'name' | 'phone' | 'petName' | 'petAge' | 'petType' | 'actions'

export type ClientTableColumnConfig = {
  id: ClientTableColumnId
  header: string
  widthClassName: string
  sortable?: boolean
}

export const clientTableColumns: ClientTableColumnConfig[] = [
  {
    id: 'name',
    header: 'Name',
    widthClassName: 'w-[17%]',
    sortable: true
  },
  {
    id: 'phone',
    header: 'Phone',
    widthClassName: 'w-[17%]'
  },
  {
    id: 'petName',
    header: 'Pet Name',
    widthClassName: 'w-[17%]',
    sortable: true
  },
  {
    id: 'petAge',
    header: 'Pet Age',
    widthClassName: 'w-[12%]'
  },
  {
    id: 'petType',
    header: 'Pet Type',
    widthClassName: 'w-[17%]'
  },
  {
    id: 'actions',
    header: 'Actions',
    widthClassName: 'w-[20%]'
  }
]

export function ClientTableColGroup() {
  return (
    <colgroup>
      {clientTableColumns.map((column) => (
        <col key={column.id} className={column.widthClassName} />
      ))}
    </colgroup>
  )
}

export function isSortableClientColumn(id: ClientTableColumnId): boolean {
  return clientTableColumns.some((column) => column.id === id && column.sortable)
}


