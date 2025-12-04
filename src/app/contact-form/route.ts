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

  const SEND_CLIENT_CONFIRMATION_EMAIL = true
  const SEND_INTERNAL_NOTIFICATION_EMAIL = true

  const requiredFields = ['name', 'email', 'message']

  const forbiddenSubstrings = ['http://', 'https://', 'www.', '.com', '.net', '.org', '.io', '.co', '://', 'href=', '<a ', '<script', 'javascript:', 'onclick=', 'onerror=', '.exe', '.zip', '.rar', '.dll', '.bat', '.cmd', '.ps1']

  for (const field of requiredFields) {
    const value = data[field]
    if (typeof value === 'string') {
      for (const substring of forbiddenSubstrings) {
        if (value.includes(substring)) {
          return Response.json(
            { error: `Invalid content` },
            { status: 400, headers: corsHeaders(origin) },
          )
        }
      }
    }
  }

  for (const field of requiredFields) {
    if (!data[field]) {
      return Response.json(
        { error: `Missing required field: ${field}` },
        { status: 400, headers: corsHeaders(origin) },
      )
    }
  }

  const contactForm = await payload.create({
    collection: 'contact-form',
    data
  })

  try {
    if (SEND_CLIENT_CONFIRMATION_EMAIL) {
      await sendContactFormConfirmationEmail(contactForm, payload.sendEmail)
    }
    if (SEND_INTERNAL_NOTIFICATION_EMAIL) {
      await sendContactFormNotificationEmail(contactForm, payload.sendEmail)
    }
  } catch (error) {
    console.error('Error sending contact form emails:', error)
  }

  return Response.json(
    { message: 'Contact request sent' },
    { headers: corsHeaders(origin) },
  )
}
