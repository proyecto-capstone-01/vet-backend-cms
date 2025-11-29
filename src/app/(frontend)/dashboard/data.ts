export const ejemplo = [
  {
    id: "cita-001",
    nombre: "Firulais",
    tipo: "Perro",
    servicio: "Baño y Corte",
    fecha: new Date().toISOString(), // hoy
    hora: "11:30",
    total: 25000,
    estado: "Pendiente",
    dueño: {
      nombre: "Carlos Muñoz",
      rut: "12.345.678-9",
      telefono: "+56 9 9876 5432",
      email: "carlos.munoz@example.com"
    },
    servicios: [
      { nombre: "Baño Completo", precio: 15000 },
      { nombre: "Corte de Pelo", precio: 10000 },
    ]
  },
  {
    id: "cita-002",
    nombre: "Mishi",
    tipo: "Gato",
    servicio: "Vacuna anual",
    fecha: new Date().toISOString(), // hoy
    hora: "15:00",
    total: 18000,
    estado: "Completado",
    dueño: {
      nombre: "Fernanda Rojas",
      rut: "17.222.111-4",
      telefono: "+56 9 1234 5678",
      email: "fernanda.rojas@example.com"
    },
    servicios: [
      { nombre: "Vacuna Triple Felina", precio: 12000 },
      { nombre: "Control general", precio: 6000 },
    ]
  },
  {
    id: "cita-003",
    nombre: "Toby",
    tipo: "Perro",
    servicio: "Control Médico",
    fecha: new Date().toISOString(), // hoy
    hora: "09:00",
    total: 20000,
    estado: "Cancelado",
    dueño: {
      nombre: "Ana Díaz ",
      rut: "21.765.123-3",
      telefono: "+56 9 8765 1234",
      email: "ana.diaz@example.com"
    },
    servicios: [
      { nombre: "Consulta General", precio: 20000 },
    ]
  }
]
