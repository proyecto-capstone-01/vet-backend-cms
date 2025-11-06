import { ConfirmacionSolicitudContacto } from '@/email/templates/cliente/ConfirmacionSolicitudContacto'
import React from 'react'
import { render } from '@react-email/render'

export async function sendContactFormConfirmationEmail(contactForm: {
  name: string
  email: string
  message: string
  contactPreference: string
}, sendEmail: (options: { to: string; subject: string; replyTo: string; html: string }) => Promise<any>) {
  const html = await render(
    React.createElement(ConfirmacionSolicitudContacto, {
      name: contactForm.name,
      message: contactForm.message,
      contactPreference: contactForm.contactPreference as 'email' | 'phone',
    }),
  )
  const emailResponse = await sendEmail({
    to: contactForm.email,
    subject: 'Se ha recibido tu solicitud de contacto',
    replyTo: process.env.REPLY_EMAIL || 'no-reply@example.com',
    html,
  })

  console.log('Email response:', emailResponse)

  return emailResponse
}