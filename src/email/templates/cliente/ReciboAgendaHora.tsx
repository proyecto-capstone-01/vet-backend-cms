import { BaseCliente } from '@/email/templates/cliente/BaseCliente'

interface ConfirmacionAgendaHoraProps {
  name: string
  appointmentDate: string
  appointmentTime: string
  serviceType: string
}

export const ConfirmacionAgendaHora: React.FC<ConfirmacionAgendaHoraProps> = ({
  name,
  appointmentDate,
  appointmentTime,
  serviceType,
}) => {
  return (
    <BaseCliente>
      <h2 style={{ color: '#333333' }}>¡Hola {name}!</h2>
      <p style={{ color: '#555555' }}>
        Gracias por agendar una hora con nosotros. Aquí tienes los detalles de tu cita:
      </p>
      <ul style={{ color: '#555555' }}>
        <li><strong>Fecha:</strong> {appointmentDate}</li>
        <li><strong>Hora:</strong> {appointmentTime}</li>
        <li><strong>Tipo de Servicio:</strong> {serviceType}</li>
      </ul>
      <p style={{ color: '#555555' }}>
        Si necesitas hacer algún cambio o tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo.
      </p>
      <p style={{ color: '#555555' }}>¡Esperamos verte pronto!</p>
      <p style={{ color: '#555555' }}>Saludos cordiales,<br />El equipo de Atención al Cliente</p>
    </BaseCliente>
  )
}