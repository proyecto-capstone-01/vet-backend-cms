'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
    Home,
    BarChart3,
    CalendarDays,
    Users,
    Dog,
    Package,
    LayoutDashboard,
    Image as ImageIcon,
    Newspaper,
    ShoppingBag,
    Stethoscope,
    HelpCircle,
} from 'lucide-react'

export default function ManualDeUsuario() {
    return (
        <div className="max-w-screen-xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-primary">
                Manual de Usuario — Sistema de Gestión Clínica Veterinaria
            </h1>

            <p className="text-center mb-12">
                Este manual tiene como objetivo orientar a los nuevos colaboradores de la clínica en el uso
                del sistema de gestión. Aquí encontrarás una descripción clara de cada módulo, su propósito
                y las principales acciones que puedes realizar.
            </p>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Home className="w-5 h-5 text-primary" />
                        <CardTitle>Inicio (Home)</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        La página principal del sistema muestra una visión general de la actividad diaria de la
                        clínica. Desde aquí puedes acceder a un resumen estadístico, revisar las horas agendadas
                        del día y confirmar citas con los clientes.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <CardTitle>Analítica</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Presenta informes visuales sobre el rendimiento de la clínica. Incluye gráficos y
                        estadísticas de pacientes atendidos, tratamientos realizados, y evolución mensual. Ideal
                        para la toma de decisiones y monitoreo del desempeño.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <CardTitle>Horas</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Permite gestionar las citas veterinarias. Puedes programar nuevas horas, ver las
                        confirmadas y modificar o eliminar citas. Es esencial mantener esta sección actualizada
                        para evitar solapamientos de atención.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <CardTitle>Clientes</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Aquí se registran los propietarios de las mascotas. Puedes agregar nuevos clientes,
                        actualizar su información de contacto y consultar el historial de atención de sus
                        mascotas.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Dog className="w-5 h-5 text-primary" />
                        <CardTitle>Mascotas</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Contiene la ficha clínica de cada mascota, con detalles sobre su historial médico,
                        vacunaciones, diagnósticos y tratamientos. Esta información es fundamental para ofrecer
                        una atención personalizada y segura.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        <CardTitle>Inventario</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Permite controlar los productos y medicamentos disponibles en la clínica. Puedes
                        verificar existencias, registrar nuevas entradas o salidas de stock, y evitar quiebres
                        de insumos.
                    </CardContent>
                </Card>

                <Separator className="my-8" />

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                        <CardTitle>CMS (Gestión de Contenido)</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Desde este módulo se puede actualizar la información visible en el sitio web de la
                        clínica, como textos, imágenes y secciones. Facilita la comunicación con los clientes en
                        línea.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <CardTitle>Contenido Multimedia</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Aquí se gestiona el material visual de la clínica, incluyendo fotografías, videos y
                        documentos informativos. Mantén este apartado ordenado para asegurar una imagen
                        profesional y actualizada.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Newspaper className="w-5 h-5 text-primary" />
                        <CardTitle>Publicaciones del Blog</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Permite crear, editar y publicar artículos en el blog de la clínica. Es una herramienta
                        útil para compartir noticias, consejos veterinarios y mantener la relación con los
                        clientes.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <CardTitle>Productos</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Gestiona los productos que ofrece la clínica, como alimentos, suplementos o accesorios.
                        Puedes registrar precios, disponibilidad y actualizar la información para mantener el
                        catálogo al día.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        <CardTitle>Profesionales</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Contiene los perfiles de los veterinarios y especialistas. Permite agregar sus datos,
                        especialidades y horarios de atención, facilitando la asignación de citas.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary" />
                        <CardTitle>Preguntas Frecuentes</CardTitle>
                    </CardHeader>
                    <CardContent className="leading-relaxed">
                        Ofrece un listado de las preguntas más comunes de los clientes junto con sus respuestas.
                        Mantener esta sección actualizada ayuda a reducir consultas repetitivas y mejorar la
                        experiencia del usuario.
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
