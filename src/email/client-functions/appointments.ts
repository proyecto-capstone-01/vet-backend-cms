import { ConfirmacionAgendaHora } from '@/email/templates/cliente/ConfirmacionAgendaHora'
import React from 'react'
import { render } from '@react-email/render'
import { CalendarEvent, generateCalendarEvent } from '@/lib/calendar-event-generator'

export async function sendAppointmentConfirmationEmail(appointmentForm: {
  name: string
  email: string
  startDate: Date
  endDate: Date
  serviceType: string
  message: string
  appointmentId: string
}, sendEmail: (options: { to: string; subject: string; replyTo: string; html: string; attachments?: [{ filename: string, content: any }] }) => Promise<any>) {

  const event: CalendarEvent = {
    title: `Cita de ${appointmentForm.serviceType}`,
    description: `Cita programada para el servicio de ${appointmentForm.serviceType}.`,
    startDate: appointmentForm.startDate,
    endDate: appointmentForm.endDate,
    organizer: {
      name: 'Atención al Cliente',
      email: process.env.REPLY_EMAIL || ''
    },
    attendees: [
      {
        name: appointmentForm.name,
        email: appointmentForm.email,
        rsvp: true
      }
    ],
    alarm: {
      action: 'DISPLAY',
      minutesBefore: 30
    }
  }

  const icsBuffer = Buffer.from(generateCalendarEvent(event), 'utf-8')

  const filename = `Cita_${appointmentForm.appointmentId}.ics`

  const html = await render(
    React.createElement(ConfirmacionAgendaHora, {
      name: appointmentForm.name,
      startDate: appointmentForm.startDate,
      endDate: appointmentForm.endDate,
      serviceType: appointmentForm.serviceType,
    }),
  )
  const emailResponse = await sendEmail({
    to: appointmentForm.email,
    subject: 'Se ha recibido tu solicitud de contacto',
    replyTo: process.env.REPLY_EMAIL || 'no-reply@example.com',
    html,
    attachments: [{ filename, content: icsBuffer }]
  })

  console.log('Email response:', emailResponse)

  return emailResponse
}