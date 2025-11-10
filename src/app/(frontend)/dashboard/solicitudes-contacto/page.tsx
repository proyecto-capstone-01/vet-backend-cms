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
import { Copy, Trash2 } from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  message: string
  contactPreference: "email" | "phone"
  spam: boolean
  answered: boolean
  createdAt: string
}

export default function ContactosPage() {
  const [contactos, setContactos] = React.useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<"todos" | "respondido" | "spam" | "sin-responder">("todos")
  const [copied, setCopied] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/contact-form?limit=1000")
      if (!res.ok) throw new Error("Error al cargar contactos")
      const data = await res.json()
      setContactos(data.docs || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchContacts()
  }, [])

  const filteredContacts = contactos.filter((c) => {
    if (filter === "todos") return true
    if (filter === "spam") return c.spam
    if (filter === "respondido") return c.answered
    if (filter === "sin-responder") return !c.answered && !c.spam
    return true
  })

  const handleOpenDialog = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
    setCopied(false)
  }

  const handleMarkAs = async (field: "answered" | "spam", value: boolean) => {
    if (!selectedContact) return
    try {
      const res = await fetch(`/api/contact-form/${selectedContact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
      if (!res.ok) throw new Error("Error al actualizar")
      setSelectedContact(null)
      setIsDialogOpen(false)
      await fetchContacts()
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedContact) return
    try {
      const res = await fetch(`/api/contact-form/${selectedContact.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar")
      setSelectedContact(null)
      setIsDialogOpen(false)
      await fetchContacts()
    } catch (error) {
      console.error("Error:", error)
    }
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
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
    },
    {
      accessorKey: "message",
      header: "Mensaje",
      cell: ({ row }) => (
        <span className="line-clamp-1 text-muted-foreground">
          {row.original.message}
        </span>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const { spam, answered } = row.original
        let text = "Sin responder"
        let color = "text-yellow-600"
        
        if (spam) {
          text = "Spam"
          color = "text-red-600"
        } else if (answered) {
          text = "Respondido"
          color = "text-green-600"
        }
        return <span className={color}>{text}</span>
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
        <h2 className="text-lg font-semibold">Solicitudes de Contacto</h2>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="sin-responder">Sin responder</SelectItem>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Contacto</DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Nombre</p>
                <p>{selectedContact.name}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Respuesta%20a%20tu%20consulta&body=Hola%20${selectedContact.name},%0A%0AGracias%20por%20contactarnos.%20Responderemos%20tu%20mensaje%20pronto.`}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyEmail}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? "Copiado" : "Copiar"}
                </Button>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Teléfono</p>
                <p>{selectedContact.phone}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Preferencia de contacto</p>
                <p className="capitalize">{selectedContact.contactPreference === "email" ? "Correo electrónico" : "Teléfono"}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Mensaje</p>
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Acciones</p>
                <div className="flex gap-2">
                  {!selectedContact.answered && !selectedContact.spam && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleMarkAs("answered", true)}
                    >
                      Marcar como respondido
                    </Button>
                  )}
                  
                  {!selectedContact.spam && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleMarkAs("spam", true)}
                    >
                      Marcar como spam
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}