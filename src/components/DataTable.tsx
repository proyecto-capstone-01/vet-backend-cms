'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconChevronDown,
  IconSearch,
} from '@tabler/icons-react'
import { Input } from '@/components/ui/input'

interface GenericDataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  pageSizeOptions?: number[]
  enableRowSelection?: boolean
  enableColumnVisibility?: boolean
  title?: string
  enableSearch?: boolean // Nuevo prop (por defecto: true)
}

export function GenericDataTable<TData>({
  columns,
  data,
  pageSizeOptions = [10, 20, 30, 40, 50],
  enableRowSelection = true,
  enableColumnVisibility = true,
  title,
  enableSearch = true,
}: GenericDataTableProps<TData>) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [globalFilter, setGlobalFilter] = React.useState('')

  // Filtrado global — busca en todas las columnas visibles
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data
    const search = globalFilter.toLowerCase()
    return data.filter((row: any) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(search)),
    )
  }, [data, globalFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:px-6">
        <div className="flex items-center gap-2">
          {title && <h2 className="font-semibold text-lg">{title}</h2>}
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-between">
          {enableSearch && (
            <div className="relative">
              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-56 md:w-64"
              />
            </div>
          )}

          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" >
                  <IconLayoutColumns className="mr-1 h-4 w-4" />
                  <span className="hidden lg:inline">Columnas</span>
                  <IconChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllLeafColumns()
                  .filter((col) => col.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(v) => column.toggleVisibility(v)}
                      className="capitalize"
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="max-w-xs overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                      {typeof flexRender(cell.column.columnDef.cell, cell.getContext()) ===
                      'string' ? (
                        <span className="truncate block">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-24">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground text-sm hidden lg:block">
          Mostrando{' '}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredData.length,
          )}{' '}
          de {filteredData.length}
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-2">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Filas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((ps) => (
                  <SelectItem key={ps} value={`${ps}`}>
                    {ps}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft />
            </Button>
            <span className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
