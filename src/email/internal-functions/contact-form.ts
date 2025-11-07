import { SolicitudContactoRecibida } from '@/email/templates/interno/SolicitudContactoRecibida'
import React from 'react'
import { render } from '@react-email/render'

export async function sendContactFormNotificationEmail(contactForm: {
  name: string
  email: string
  message: string
  contactPreference: string
}, sendEmail: (options: { to: string; subject: string; html: string }) => Promise<any>) {
  const dashboardURL = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/solicitudes-contacto`

  const html = await render(
    React.createElement(SolicitudContactoRecibida, {
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      contactPreference: contactForm.contactPreference as 'email' | 'phone',
      dashboardURL,
    }),
  )

  const internalNotificationEmail = process.env.INTERNAL_EMAIL || ''

  const emailResponse = await sendEmail({
    to: internalNotificationEmail,
    subject: 'Nueva solicitud de contacto recibida',
    html,
  })

  console.log('Email response:', emailResponse)

  return emailResponse
}