"use client"

import { GenericDataTable } from "@/components/DataTable"
import data from "./data.json"

export default function DashboardPage() {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completado":
        return <div className="border w-fit px-2 py-1"><span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>Completado</div>
      case "Cancelado":
        return <div className="border w-fit px-2 py-1"><span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>Cancelado</div>
      default:
        return <div className="border w-fit px-2 py-1"><span className="inline-block w-2 h-2 bg-amber-400 rounded-full mr-1"></span>Pendiente</div>
    }}

  const columns = [
    {
      header: "Mascota",
      accessorKey: "nombre",
    },
    {
      header: "Tipo",
      accessorKey: "tipo",
    },
    {
      header: "Servicio",
      accessorKey: "servicio",
    },
    {
      header: "Fecha",
      accessorKey: "fecha",
    },
    {
      header: "Hora",
      accessorKey: "hora",
    },
    {
      header: "Estado",
      accessorKey: "estado",
      cell: ({ row }: any) => getStatusBadge(row.original.estado),
    },
    {
      header: "Dueño",
      accessorKey: "dueño",
    },
  ]

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 py-6 px-4 md:px-6">
      <GenericDataTable columns={columns} data={data} pageSizeOptions={[5, 10, 20]} title="Horas para hoy" />
    </div>
  )
}