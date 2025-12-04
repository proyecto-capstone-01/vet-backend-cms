import { BaseCliente } from '@/email/templates/cliente/BaseCliente'

interface ConfirmacionAgendaHoraProps {
  name: string
  startDate: Date
  endDate: Date
  serviceType: string
}

// ConfirmacionAgendaHora component to confirm appointment booking
export const ConfirmacionAgendaHora: React.FC<ConfirmacionAgendaHoraProps> = ({
  name,
  startDate,
  endDate,
  serviceType,
}) => {
  return (
    <BaseCliente>
      <h2 style={{ color: '#333333' }}>¡Hola {name}!</h2>
      <p style={{ color: '#555555' }}>Tu hora ha sido confirmada con los siguientes detalles:</p>
      <ul style={{ color: '#555555' }}>
        <li>
          <strong>Fecha:</strong> {startDate.toLocaleDateString('es-CL')}
        </li>
        <li>
          <strong>Hora:</strong> {startDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} -{' '}
          {endDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
        </li>
        <li>
          <strong>Tipo de Servicio:</strong> {serviceType}
        </li>
      </ul>
      <p style={{ color: '#555555' }}>
        Si necesitas hacer algún cambio, cancelar tu hora o tienes alguna pregunta, no dudes en contactarnos
        respondiendo a este correo, o a nuestro Whatsapp +0000. {/* TODO: Change number */}
      </p>
      <p style={{ color: '#555555' }}>¡Esperamos verte pronto!</p>
      <p style={{ color: '#555555' }}>
        Saludos cordiales,
        <br />
        El equipo de Atención al Cliente
      </p>
    </BaseCliente>
  )
}
