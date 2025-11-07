import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { sendContactFormNotificationEmail } from '@/email/internal-functions/contact-form'
import { sendContactFormConfirmationEmail } from '@/email/client-functions/contact-form'


const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? '',
  'http://localhost:3000',
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

export const POST = async (request: Request) => {
  const origin = request.headers.get('origin') ?? ''
  const payload = await getPayload({ config: configPromise })
  const data = await request.json()

  const contactForm = await payload.create({
    collection: 'contact-form',
    data,
  })

  const emailClientResponse = await sendContactFormConfirmationEmail(contactForm, payload.sendEmail)

  const emailInternalResponse = await sendContactFormNotificationEmail(contactForm, payload.sendEmail)

  console.log('---')
  console.log('c:', contactForm)

  return Response.json(
    { message: 'Contact request sent' },
    { headers: corsHeaders(origin) },
  )
}



