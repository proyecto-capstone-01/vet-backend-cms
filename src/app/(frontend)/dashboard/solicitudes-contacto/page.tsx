"use client"

import * as React from "react"
import { GenericDataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy } from "lucide-react"

interface Contact {
  id: number
  nombre: string
  email: string
  mensaje: string
  estado: "Sin responder" | "Respondido" | "Spam"
}

const contactosIniciales: Contact[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "fggfdgS@gmail.com",
    mensaje: "Hola, me interesa reservar una hora para mi perro.",
    estado: "Sin responder",
  },
  {
    id: 2,
    nombre: "María López",
    email: "maria.lopez@example.com",
    mensaje: "¿Tienen servicio de urgencias?",
    estado: "Sin responder",
  },
  {
    id: 3,
    nombre: "Carlos Sánchez",
    email: "carlos.sanchez@example.com",
    mensaje: "Quiero saber más sobre sus servicios.",
    estado: "Sin responder",
  },
]

export default function ContactosPage() {
  const [contactos, setContactos] = React.useState<Contact[]>(contactosIniciales)
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<"todos" | "sin responder" | "respondido" | "spam">("todos")
  const [copied, setCopied] = React.useState(false)

  const filteredContacts = contactos.filter((c) =>
    filter === "todos" ? true : c.estado.toLowerCase() === filter
  )

  const handleOpenDialog = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
    setCopied(false)
  }

  const handleMarkAs = (nuevoEstado: "respondido" | "spam") => {
    if (!selectedContact) return
    setContactos((prev) =>
      prev.map((c) =>
        c.id === selectedContact.id ? { ...c, estado: nuevoEstado } : c
      )
    )
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    if (!selectedContact) return
    setContactos((prev) => prev.filter((c) => c.id !== selectedContact.id))
    setIsDialogOpen(false)
  }

  const handleCopyEmail = async () => {
    if (selectedContact?.email) {
      await navigator.clipboard.writeText(selectedContact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mensaje",
      header: "Mensaje",
      cell: ({ row }) => (
        <span className="line-clamp-1 text-muted-foreground">
          {row.original.mensaje}
        </span>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.original.estado
        const color =
          estado === "Respondido"
            ? "text-green-600"
            : estado === "Spam"
            ? "text-red-600"
            : "text-yellow-600"
        return <span className={color}>{estado}</span>
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenDialog(row.original)}
        >
          Ver detalles
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Contactos</h2>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="sin responder">Sin responder</SelectItem>
            <SelectItem value="respondido">Respondido</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <GenericDataTable
        columns={columns}
        data={filteredContacts}
        enableSearch
        enableColumnVisibility
      />

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del contacto</DialogTitle>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-2">
              <p>
                <strong>Nombre:</strong> {selectedContact.nombre}
              </p>

              <p className="flex items-center gap-2">
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${selectedContact.email}?subject=Respuesta%20a%20tu%20consulta&body=Hola%20${selectedContact.nombre},%0A%0AGracias%20por%20contactarnos.%20Responderemos%20tu%20mensaje%20pronto.`}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedContact.email}
                </a>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyEmail}
                  title="Copiar correo"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {copied && (
                  <span className="text-xs text-green-600">¡Copiado!</span>
                )}
              </p>

              <p>
                <strong>Mensaje:</strong>
              </p>
              <p className="border p-2 rounded-md bg-muted">
                {selectedContact.mensaje}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                <span className="capitalize">{selectedContact.estado}</span>
              </p>
            </div>
          )}

          <DialogFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => handleMarkAs("respondido")}>
              Marcar como respondido
            </Button>
            <Button variant="destructive" onClick={() => handleMarkAs("spam")}>
              Marcar como spam
            </Button>
            <Button variant="ghost" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}