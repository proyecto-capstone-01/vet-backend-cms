import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,

  CardDescription, CardAction
} from '@/components/ui/card'
import { getPayload } from 'payload'
import config from '@payload-config'
import { IframeSheet } from '@/components/IframeSheet'
import { formatRUT } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconLink } from '@tabler/icons-react'
import Link from 'next/link'



export default async function ClientHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) return <div className="p-6">ID de mascota no proporcionado.</div>

  const petIdNumber = parseInt(id, 10)
  if (isNaN(petIdNumber)) return <div className="p-6">ID de mascota inválido.</div>

  const payload = await getPayload({ config })

  const owner = await payload.findByID({
    collection: 'owners',
    id: petIdNumber,
    depth: 2,
  })

  const pets = await payload.find({
    collection: 'pets',
    where: {
      owner: {
        equals: owner.id,
      },
    },
    depth: 1,
    limit: 50,
  })

  const appointments = await payload.find({
    collection: 'appointments',
    where: {
      pet: {
        in: pets.docs.map((pet) => pet.id),
      },
    },
    depth: 2,
    limit: 50,
  })


  return (
    <div className="p-6 space-y-6">

      <div >

        <div className="space-y-4 flex flex-row gap-6">
          <div className="w-full">
            <Card className="w-full mb-4">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {owner.firstName} {owner.lastName}
                </CardTitle>
                <CardDescription className="text-lg">
                  {formatRUT(owner.rut)}
                </CardDescription>
                <CardAction>
                  <IframeSheet
                    src={`/admin/collections/owners/${owner.id}`}
                    buttonText="Editar Cliente"
                    title="Editar Cliente"
                    width="100%"
                    height="100%"
                    buttonVariant="outline"
                  />
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className='space-y-2'>
                    <div>Teléfono:
                      <span className="font-semibold ml-1">
                        {owner.phoneNumber ?? 'N/A'}
                      </span>
                    </div>
                    <div>Correo Electrónico:
                      <span className="font-semibold ml-1">
                        {owner.email ?? 'N/A'}
                      </span>
                    </div>
                    <div>Dirección:
                      <span className="font-semibold ml-1">
                        {owner.address ?? 'N/A'}
                      </span>
                    </div>
                    <div>
                      Registrado el:
                      <span className="font-semibold ml-1">
                        {new Date(owner.createdAt).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mascota</TableHead>
                          <TableHead>Especie</TableHead>
                          <TableHead>Link</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pets.totalDocs === 0 && (
                          <TableRow>
                            <TableCell colSpan={2}>
                              No se encontraron mascotas para este cliente.
                            </TableCell>
                          </TableRow>
                        )}
                        {pets.totalDocs > 0 && pets.docs.map((pet) => (
                          <TableRow key={pet.id}>
                            <TableCell>{pet.name}</TableCell>
                            <TableCell>
                              {pet.species === 'dog' ? 'Perro' :
                              pet.species === 'cat' ? 'Gato' : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/dashboard/mascotas/${pet.id}`}
                                className="dark:text-blue-500 text-blue-600 hover:underline flex items-center gap-1"
                              >
                                Ver Detalles <IconLink size={16} />
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Historial de citas</CardTitle>
            <CardDescription>
              Citas agendadas anteriormente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.totalDocs === 0 && (
              <p>No se encontraron citas para este cliente.</p>
            )}
            {appointments.totalDocs > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Comentario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.docs.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString('es-CL')}
                      </TableCell>
                      <TableCell>
                        {appointment.pet ? (appointment.pet as any).name : 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-sm">
                        {appointment.services && appointment.services.length > 0
                          ? appointment.services.map((service: any) => service.title).join(', ')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {appointment.status === 'pending' ? 'Pendiente' :
                          appointment.status === 'completed' ? 'Completada' :
                            appointment.status === 'canceled' ? 'Cancelada' :
                              appointment.status === 'confirmed' ? 'Confirmada' : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {appointment.comment ?? 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  )
}