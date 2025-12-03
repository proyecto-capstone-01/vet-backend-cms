import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription, CardAction
} from '@/components/ui/card'
import { getPayload } from 'payload'
import config from '@payload-config'
import { IframeSheet } from '@/components/IframeSheet'
import Link from 'next/link'
import { IconLink } from '@tabler/icons-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



/*
"id": 29,

    "owner": {
        "id": 37,
        "firstName": "rvne tija",
        "lastName": "winurevqty",
        "rut": "41112223",
        "email": "nm2ct9cnw7865tn47c@m4c97827n4v9.com",
        "phoneNumber": "578146578923",
        "address": null,
        "nameRutCombination": "rvne tija winurevqty - 41112223",
        "updatedAt": "2025-12-02T23:38:49.065Z",
        "createdAt": "2025-12-02T23:38:49.064Z"
    },
    "name": "Snop",
    "microchipNumber": null,
    "species": "dog",
    "dateOfBirth": null,
    "sex": "male",
    "color": null,
    "breed": null,
    "weight": null,
    "height": null,
    "notes": null,
    "photos": [],
    "updatedAt": "2025-12-02T23:38:49.084Z",
    "createdAt": "2025-12-02T23:38:49.084Z"

}
 */
export default async function PetHistoryPage({ params }: { params: { id: string } }) {
  const petId = params.id
  if (!petId) return <div className="p-6">ID de mascota no proporcionado.</div>

  const petIdNumber = parseInt(petId, 10)
  if (isNaN(petIdNumber)) return <div className="p-6">ID de mascota inválido.</div>

  const payload = await getPayload({ config })

  const pet = await payload.findByID({
    collection: 'pets',
    id: petIdNumber,
    depth: 2,
  })

  const appointments = await payload.find({
    collection: 'appointments',
    where: {
      pet: {
        equals: pet.id,
      },
    },
    depth: 2,
    limit: 50,
  })


  return (
    <div className="p-6 space-y-6">

      <div >

        <div className="space-y-4 flex flex-row gap-8">
          <div className="w-1/2">
            <Card className="w-full mb-4">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {pet.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  {pet.species === 'dog' ? 'Perro' : pet.species === 'cat' ? 'Gato' : 'N/A'}
                </CardDescription>
                <CardAction>
                  <IframeSheet
                    src={`/admin/collections/pets/${pet.id}`}
                    buttonText="Editar Mascota"
                    title="Editar Mascota"
                    width="100%"
                    height="100%"
                    buttonVariant="outline"
                  />
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>Sexo:
                  <span className="font-semibold ml-1">
                    {pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Hembra' : 'N/A'}
                  </span>
                </div>
                <div>Raza:
                  <span className="font-semibold ml-1">
                    {pet.breed ?? 'N/A'}
                  </span>
                </div>
                <div>Color:
                  <span className="font-semibold ml-1">
                    {pet.color ?? 'N/A'}
                  </span>
                  </div>
                <div>Peso:
                  <span className="font-semibold ml-1">
                    {pet.weight ? `${pet.weight} kg` : 'N/A'}
                  </span>
                  </div>
                <div>Altura:
                  <span className="font-semibold ml-1">
                    {pet.height ? `${pet.height} cm` : 'N/A'}
                  </span>
                  </div>
              </CardContent>
              <CardFooter>
                <div>
                  Dueño:
                  <Link
                    href={`/dashboard/clientes/${pet.owner ? (pet.owner as any).id : ''}`}
                    className="font-semibold ml-1 underline"
                  >
                    {pet.owner ? `${(pet.owner as any).firstName} ${(pet.owner as any).lastName}` : 'N/A'}
                    <IconLink className="inline-block ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div>
            photos
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Historial de {pet.name}</CardTitle>
            <CardDescription>
              Citas agendadas anteriormente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.totalDocs === 0 && (
              <p>No se encontraron citas para esta mascota.</p>
            )}
            {appointments.totalDocs > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Comentario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.docs.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-sm">
                        {appointment.services && appointment.services.length > 0
                          ? appointment.services.map((service: any) => service.title).join(', ')
                          : 'N/A'}
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