# Dashboard Administración y CMS 

## Documentación de Payload CMS

- [Payload i18n](https://payloadcms.com/docs/configuration/i18n)
- [Payload collections localization](https://payloadcms.com/docs/configuration/localization)
- [Payload CMS locked documents](https://payloadcms.com/docs/admin/locked-documents)

## Configuración del Proyecto

### 1. Variables .env


Copia las variables de entorno de ejemplo:
```shell
cp .env.example .env
```
Remplaza los valores en el archivo `.env` con tus credenciales y configuraciones.

### 2. Instalación de Dependencias

Instala las dependencias del proyecto usando `pnpm`:
```shell
pnpm install
```

### 3. [Docker-compose](docker-compose.yml) para base de datos
```shell
docker compose up -d
```

### 4. Ejecución del Proyecto en Modo Desarrollo

Inicia el servidor de desarrollo:
```shell
pnpm dev
```
> El servidor estará disponible en `http://localhost:3000/`.

### 5. Construcción del Proyecto para Producción

Construye el proyecto para producción:
```shell
pnpm build
```

### 6. Ejecución del Proyecto en Modo Producción

Inicia el servidor en modo producción:
```shell
pnpm start
```