# Automotive SPA

Aplicación SPA automotriz construida con React, TypeScript y Vite, usando WordPress como CMS headless para administrar el inventario de vehículos y exponer la información mediante la REST API.

## Tecnologías principales

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- WordPress REST API
- WordPress como backend headless

## Repositorios

Frontend:

https://github.com/aburtocampos/automotive-spa

Backend WordPress:

https://github.com/aburtocampos/automtive-spa-backend

## Requisitos previos

Antes de ejecutar el proyecto en local se necesita:

- Node.js instalado
- npm
- Git
- Acceso a una instancia de WordPress que exponga la REST API utilizada por el proyecto

## Instalación local

Clonar el repositorio:

```bash
git clone https://github.com/aburtocampos/automotive-spa.git
```

Entrar al directorio del proyecto:

```bash
cd automotive-spa
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_WORDPRESS_API_URL=https://pellas.aburto.dev/wp-json/wp/v2
```

La variable `VITE_WORDPRESS_API_URL` define la URL base de la WordPress REST API utilizada para obtener vehículos, medios y taxonomías.

El archivo `.env` no debe subirse al repositorio.

## Ejecutar el proyecto en desarrollo

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una URL local, normalmente:

```text
http://localhost:5173
```

Abrir esa dirección en el navegador.

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo con Vite.

### Build de producción

```bash
npm run build
```

Ejecuta TypeScript y genera la versión optimizada del proyecto dentro del directorio:

```text
dist/
```

### Vista previa del build

```bash
npm run preview
```

Sirve localmente el contenido generado en `dist/` para revisar el build de producción.

### Lint

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Arquitectura

El proyecto separa frontend y backend.

```text
WordPress
   ↓
WordPress REST API
   ↓
React + TypeScript SPA
   ↓
Usuario
```

WordPress se utiliza para administrar:

- Vehículos
- Imágenes
- Videos
- Marcas
- Tipos de vehículo
- Transmisiones
- Tipos de combustible
- Solicitudes de cotización y prueba de manejo

React se encarga de:

- Catálogo de vehículos
- Búsqueda
- Filtros
- Ordenamiento
- Navegación SPA
- Página de detalle
- Galería
- Interacciones de la interfaz
- Formulario de cotización
- Formulario de prueba de manejo
- Estados de carga, error y resultados vacíos

TanStack Query se utiliza para manejar el server state y reutilizar datos obtenidos de WordPress durante la navegación de la SPA.

## Rutas principales

```text
/
```

Muestra el catálogo de vehículos.

```text
/vehicles
```

Muestra el catálogo de vehículos.

```text
/vehicles/:slug
```

Muestra el detalle de un vehículo usando el slug publicado en WordPress.

## WordPress REST API

El frontend obtiene los vehículos desde:

```text
/wp-json/wp/v2/vehicles
```

También consume endpoints de WordPress para medios y taxonomías.

Ejemplos:

```text
/wp-json/wp/v2/media/:id
/wp-json/wp/v2/vehicle-brands
/wp-json/wp/v2/vehicle-types
/wp-json/wp/v2/vehicle-transmissions
/wp-json/wp/v2/vehicle-fuel-types
```

## Formulario de solicitudes

Las solicitudes de cotización y prueba de manejo se envían desde React hacia un endpoint REST personalizado de WordPress:

```text
POST /wp-json/automotive/v1/inquiries
```

WordPress valida y sanitiza los datos recibidos y utiliza `wp_mail()` para enviar la solicitud por correo electrónico.

El frontend no contiene credenciales administrativas de WordPress.

## Backend

El backend utilizado para esta aplicación está disponible en:

https://github.com/aburtocampos/automtive-spa-backend

La implementación de WordPress registra el Custom Post Type de vehículos, taxonomías, campos adicionales, galería y el endpoint utilizado por el formulario.

## Build para producción

Antes de realizar un deploy se recomienda comprobar que el proyecto compila correctamente:

```bash
npm run build
```

Si el comando finaliza correctamente, Vite generará:

```text
dist/
```

## Deploy del frontend en Vercel

El frontend puede publicarse directamente desde GitHub usando Vercel.

### 1. Subir los últimos cambios a GitHub

```bash
git add .
git commit -m "docs: add project setup and deployment instructions"
git push origin main
```

### 2. Importar el repositorio en Vercel

En Vercel:

1. Crear un nuevo proyecto.
2. Seleccionar **Import Git Repository**.
3. Elegir:

```text
aburtocampos/automotive-spa
```

Vercel debería detectar automáticamente que el proyecto utiliza Vite.

### 3. Configuración del build

Usar:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4. Configurar la variable de entorno

En:

```text
Project Settings → Environment Variables
```

agregar:

```text
VITE_WORDPRESS_API_URL
```

con el valor:

```text
https://pellas.aburto.dev/wp-json/wp/v2
```

La variable debe estar disponible al menos para el entorno de **Production**.

### 5. Realizar el deploy

Después de guardar la configuración, ejecutar el deploy.

Vercel instalará las dependencias, ejecutará:

```bash
npm run build
```

y publicará el contenido generado por Vite.

## Deploys posteriores

Cuando el proyecto de Vercel está conectado con GitHub, cada nuevo push a la rama configurada puede generar automáticamente un nuevo deployment.

Flujo normal:

```bash
git add .
git commit -m "feat: describe change"
git push origin main
```

Vercel detectará el nuevo commit y ejecutará un nuevo build.

## Consideraciones para producción

Esta implementación utiliza WordPress como backend headless y una SPA de React como frontend.

Para una versión de producción con un inventario considerablemente mayor se podrían implementar:

- Paginación y filtros del lado del servidor
- Optimización de las consultas de medios de WordPress
- REST fields personalizados para reducir requests
- Rate limiting adicional para formularios públicos
- SMTP dedicado para mejorar la entrega de correos
- SSR, SSG o prerendering para mejorar SEO
- Optimización avanzada de imágenes y videos
- Tests automatizados

## Decisiones técnicas

Se utilizó WordPress como CMS headless para mantener una interfaz administrativa conocida y separar la gestión de contenido de la experiencia frontend.

React y TypeScript controlan la experiencia de usuario y la lógica de la SPA, mientras WordPress administra y publica los datos mediante REST.

Las clasificaciones reutilizables como marca, tipo, transmisión y combustible se modelaron como taxonomías de WordPress.

Los atributos propios del vehículo, como año, precio, galería y video, se manejan como información asociada al vehículo.

TanStack Query permite separar el estado remoto del estado local de la interfaz y reduce solicitudes redundantes durante la navegación.

## Autor

Ramon Aburto

https://aburto.dev
