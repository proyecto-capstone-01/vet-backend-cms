"use client"

import { useState } from "react"
import { GenericDataTable } from "@/components/DataTable"
import { Badge } from "@/components/ui/badge"

const initialProducts = [
  { id: 1, name: "Producto A", description: "Descripción a este es un producto tipo A", price: 12000, stock: 12, category: "categoria a" },
  { id: 2, name: "Producto B", description: "Descripción B", price: 8500, stock: 3  },
  { id: 3, name: "Producto C", description: "Descripción C", price: 4500, stock: 0 },
  { id: 4, name: "Producto D", description: "Descripción D", price: 15000, stock: 25 },
  { id: 5, name: "Producto E", description: "Descripción E", price: 7000, stock: 7 },
  { id: 6, name: "Producto F", description: "Descripción F", price: 3000, stock: 1 },
  { id: 7, name: "Producto G", description: "Descripción G", price: 22000, stock: 15 },
  { id: 8, name: "Producto H", description: "Descripción H", price: 9500, stock: 0 },
  { id: 9, name: "Producto I", description: "Descripción I", price: 11000, stock: 4 },
  { id: 10, name: "Producto J", description: "Descripción J", price: 5000, stock: 9 },
]

export default function InventarioPage() {
  const [products] = useState(initialProducts)

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <div className="border w-fit px-2 py-1"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>Agotado</div>
    if (stock <= 5) return <div className="border w-fit px-2 py-1"><span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>Pocas unidades</div>
    return <div className="border w-fit px-2 py-1"><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>En Stock</div>
  }

  const getCategoryBadge = (category: string) => {
    return <Badge variant="secondary" className="rounded-full">{category}</Badge>
  }

  const columns = [
    {
      header: "Nombre",
      accessorKey: "nombre",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">{row.original.description}</div>
        </div>
      ),
    },
    {
      header: "Precio",
      accessorKey: "precio",
      cell: ({ row }: any) =>
        row.original.price.toLocaleString("es-CL", { style: "currency", currency: "CLP" }),
    },
    {
      header: "Cantidad",
      accessorKey: "stock",
    },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: ({ row }: any) => getStockBadge(row.original.stock),
    },
    {
      header: "Categoria",
      accessorKey: "categoria",
      cell: ({ row }: any) => getCategoryBadge(row.original.category)
    }
  ]

  return (
    <div className="p-6">
      <GenericDataTable columns={columns} data={products} pageSizeOptions={[5, 10, 20]} title="Productos" />
    </div>
  )
}