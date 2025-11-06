import { BaseCliente } from '@/email/templates/cliente/BaseCliente'

interface ConfirmacionSolicitudContactoProps {
  name: string
  message: string
  contactPreference: 'email' | 'phone'
}

export const ConfirmacionSolicitudContacto: React.FC<ConfirmacionSolicitudContactoProps> = ({
  name,
  message,
  contactPreference,
}) => {
  return (
    <BaseCliente>
      <h2 style={{ color: '#333333' }}>¡Gracias por contactarnos, {name}!</h2>
      <p style={{ color: '#555555' }}>
        Hemos recibido tu solicitud de contacto y nos pondremos en
        <strong>
          {contactPreference === 'email'
            ? ' contacto contigo vía email '
            : ' contacto contigo vía teléfono '}
        </strong>
        lo antes posible.
      </p>
      <h3 style={{ color: '#333333' }}>Tu mensaje:</h3>
      <p style={{ color: '#555555', fontStyle: 'italic' }}>"{message}"</p>
      <p style={{ color: '#555555' }}>
        Mientras tanto, si tienes alguna otra consulta, no dudes en responder a este correo.
      </p>
      <p style={{ color: '#555555' }}>¡Que tengas un excelente día!</p>
      <p style={{ color: '#555555' }}>Saludos cordiales,<br />El equipo de Atención al Cliente</p>
    </BaseCliente>
  )
}