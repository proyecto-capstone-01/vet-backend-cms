import { BaseInterno } from '@/email/templates/interno/BaseInterno'

import React from 'react'

interface SolicitudContactoRecibidaProps {
  name: string
  email: string
  message: string
  contactPreference: 'email' | 'phone'
  dashboardURL: string
}

export const SolicitudContactoRecibida: React.FC<SolicitudContactoRecibidaProps> = ({
  name,
  email,
  message,
  contactPreference,
  dashboardURL,
}) => {
  return (
    <BaseInterno>
      <h2 style={{ color: '#333333' }}>Nueva solicitud de contacto recibida</h2>
      <p style={{ color: '#555555' }}>
        Se ha recibido una nueva solicitud de contacto con los siguientes detalles:
      </p>
      <ul style={{ color: '#555555' }}>
        <li><strong>Nombre:</strong> {name}</li>
        <li><strong>Email:</strong> {email}</li>
        <li>
          <strong>Preferencia de contacto:</strong>{' '}
          {contactPreference === 'email' ? 'Vía email' : 'Vía teléfono'}
        </li>
      </ul>
      <h3 style={{ color: '#333333' }}>Mensaje:</h3>
      <p style={{ color: '#555555', fontStyle: 'italic' }}>"{message}"</p>
      <p style={{ color: '#555555' }}>
        Puedes gestionar esta solicitud en el siguiente enlace:
      </p>
      <p>
        <a href={dashboardURL} style={{ color: '#1a73e8' }}>Ir al panel de administración</a>
      </p>
      <p style={{ color: '#555555' }}>Saludos cordiales,<br />El sistema de notificaciones</p>
    </BaseInterno>
  )
}