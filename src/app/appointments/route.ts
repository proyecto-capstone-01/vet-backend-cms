import { getPayload } from 'payload'
import configPromise from '@payload-config'
// import {   } from '@/email/client-functions/appointments'

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? '',
  'http://localhost:3000',
  'http://localhost:4321',
]

function corsHeaders(origin: string) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '*'
  return new Headers({
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') ?? ''
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}


export const GET = async (request: Request) => {

  const params = new URL(request.url).searchParams
  const id = params.get('id')

  return Response.json({
    message: 'todo',
  })
}

export const POST = async (request: Request) => {
  const origin = request.headers.get('origin') ?? ''
  const payload = await getPayload({ config: configPromise })
  const data = await request.json()

  const ownerData = {
    rut: cleanRut(data.rut),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phone
  }

  const owner = await payload.create({
    collection: 'owners',
    data: {
      ...ownerData,
    },
  })

  const petData = {
    owner: owner.id,
    name: data.petName,
    species: data.petType,
    sex: data.petSex,
    age: data.age || null,
    weight: data.weight || null,
  }

  const pet = await payload.create({
    collection: 'pets',
    data: {
      ...petData,
    },
  })

  const dataAppointment = {
    date: data.fecha,
    time: data.hora,
    services: data.servicios,
    comment: data.comentario || null,
  }

  // const appointment = await payload.create({
  //   collection: 'appointments',
  //   data: {
  //     ...data.appointment,
  //     pet: pet.id,
  //   },
  // })

  return Response.json(
    { message: 'todo' },
    { headers: corsHeaders(origin) }
  )
}

const cleanRut = (rut: string) => {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
}