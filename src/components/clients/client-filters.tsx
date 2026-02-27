'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import {
  Button,
  ButtonBase,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { useMemo } from 'react'
import {
  ClientTableColGroup,
  ClientTableColumnId,
  clientTableColumns,
  isSortableClientColumn
} from '@/components/clients/client-table-config'
import { compactFieldSx, getSortButtonSx, subtleOutlineButtonSx } from '@/lib/styles/mui'
import { ClientFilters, ClientSortBy, ClientSortDirection, PetType } from '@/types/client'

type ClientFiltersProps = {
  value: ClientFilters
  onChange: (value: ClientFilters) => void
  onClear: () => void
  sortBy: ClientSortBy
  sortDirection: ClientSortDirection
  onSortToggle: (column: 'name' | 'petName') => void
}

const petTypeOptions: PetType[] = ['dog', 'cat', 'parrot']

function SortIcon({ active, direction }: { active: boolean; direction: ClientSortDirection }) {
  if (!active) {
    return <UnfoldMoreIcon sx={{ fontSize: 16 }} />
  }

  return direction === 'asc' ? (
    <ArrowDropUpIcon sx={{ fontSize: 18 }} />
  ) : (
    <ArrowDropDownIcon sx={{ fontSize: 18 }} />
  )
}

export function ClientFiltersPanel({
  value,
  onChange,
  onClear,
  sortBy,
  sortDirection,
  onSortToggle
}: ClientFiltersProps) {
  const onNameChange = (name: string) => onChange({ ...value, name })
  const onPetNameChange = (petName: string) => onChange({ ...value, petName })
  const onPetTypesChange = (petTypes: PetType[]) =>
    onChange({ ...value, petTypes: petTypes.length > 0 ? petTypes : undefined })

  const columns = useMemo<ColumnDef<ClientFilters>[]>(
    () =>
      clientTableColumns.map((column) => {
        if (column.id === 'name' || column.id === 'petName') {
          return {
            id: column.id,
            accessorKey: column.id,
            header: column.header
          }
        }

        return {
          id: column.id,
          header: column.header
        }
      }),
    []
  )

  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const firstHeaderGroup = table.getHeaderGroups()[0]
  const renderNameField = () => (
    <TextField
      size="small"
      label="Search Client"
      value={value.name || ''}
      onChange={(event) => onNameChange(event.target.value)}
      sx={compactFieldSx}
      fullWidth
    />
  )

  const renderPetNameField = () => (
    <TextField
      size="small"
      label="Search Pet"
      value={value.petName || ''}
      onChange={(event) => onPetNameChange(event.target.value)}
      sx={compactFieldSx}
      fullWidth
    />
  )

  const renderPetTypeField = (labelId: string, emptyLabel: string) => (
    <FormControl size="small" fullWidth sx={compactFieldSx}>
      <InputLabel id={labelId}>Pet Type</InputLabel>
      <Select
        labelId={labelId}
        label="Pet Type"
        multiple
        value={value.petTypes || []}
        onChange={(event) => onPetTypesChange(event.target.value as PetType[])}
        renderValue={(selected) =>
          (selected as string[]).length === 0 ? emptyLabel : (selected as string[]).join(', ')
        }
      >
        {petTypeOptions.map((type) => (
          <MenuItem key={type} value={type}>
            <Checkbox checked={(value.petTypes || []).includes(type)} size="small" />
            <ListItemText primary={type} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const renderClearButton = () => (
    <Button
      type="button"
      onClick={onClear}
      variant="outlined"
      size="small"
      sx={subtleOutlineButtonSx}
    >
      Clear
    </Button>
  )

  const renderSortButton = (column: 'name' | 'petName', label: string) => (
    <Button
      type="button"
      onClick={() => onSortToggle(column)}
      variant="outlined"
      size="small"
      sx={getSortButtonSx(sortBy === column)}
    >
      {label}
      <SortIcon active={sortBy === column} direction={sortDirection} />
    </Button>
  )

  return (
    <div className="surface-card motion-fade-in overflow-hidden">
      <div className="hidden md:block">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <ClientTableColGroup />
          <thead className="text-slate-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50/80">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-xs font-semibold  tracking-wide text-slate-600"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        {isSortableClientColumn(header.id as ClientTableColumnId) && (
                          <ButtonBase
                            onClick={() => onSortToggle(header.id as 'name' | 'petName')}
                            className="group flex items-center gap-1 rounded px-1 py-0.5 text-left"
                          >
                            <span>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </span>
                            <span className="text-slate-500 group-hover:text-slate-700">
                              <SortIcon active={sortBy === header.id} direction={sortDirection} />
                            </span>
                          </ButtonBase>
                        )}
                        {!isSortableClientColumn(header.id as ClientTableColumnId) && (
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
            {firstHeaderGroup && (
              <tr className="border-t border-slate-200 bg-white">
                {firstHeaderGroup.headers.map((header) => {
                  if (header.id === 'name') {
                    return (
                      <th key={header.id} className="px-4 py-2">
                        {renderNameField()}
                      </th>
                    )
                  }

                  if (header.id === 'petName') {
                    return (
                      <th key={header.id} className="px-4 py-2">
                        {renderPetNameField()}
                      </th>
                    )
                  }

                  if (header.id === 'petType') {
                    return (
                      <th key={header.id} className="px-4 py-2">
                        {renderPetTypeField('desktop-pet-type-label', 'All')}
                      </th>
                    )
                  }

                  if (header.id === 'actions') {
                    return (
                      <th key={header.id} className="px-4 py-2">
                        {renderClearButton()}
                      </th>
                    )
                  }

                  return <th key={header.id} className="px-4 py-2" />
                })}
              </tr>
            )}
          </thead>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 md:hidden">
        <div className="grid gap-2">
          {renderSortButton('name', 'Sort by client')}
          {renderSortButton('petName', 'Sort by pet')}
        </div>

        <div className="grid gap-2">
          {renderNameField()}
          {renderPetNameField()}
          <div className="grid grid-cols-2 gap-2">
            {renderPetTypeField('mobile-pet-type-label', 'All types')}
            {renderClearButton()}
          </div>
        </div>
      </div>
    </div>
  )
}
