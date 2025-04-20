
# 📦 Coordinadora Frontend

**Proyecto:** Gestión de Envíos y Rutas Logísticas  
**Versión:** 3.0  
**Elaborado para:** Prueba Técnica Fullstack - Coordinadora

## 🛠 Tecnologías utilizadas

- **Framework:** React 18
- **Arquitectura:** Microfrontends (Webpack Module Federation)
- **Estado global:** Redux Toolkit
- **UI:** TailwindCSS
- **Ruteo:** React Router
- **Autenticación:** JWT (manejo en Context API + localStorage)
- **Pruebas:** Jest + React Testing Library
- **Construcción y Bundling:** Vite + Webpack Module Federation

## 📋 Descripción del Proyecto

Este frontend permite:

- Registro y autenticación de usuarios.
- Creación de órdenes de envío.
- Asignación de rutas a transportistas (modo administrador).
- Seguimiento de órdenes en tiempo real (WebSocket o Polling).
- Visualización de reportes de desempeño logístico con tablas y gráficos interactivos.

Todo construido bajo una arquitectura limpia, enfocada en escalabilidad y separación de responsabilidades.

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/coordinadora_frontend.git
cd coordinadora_frontend
```

### 2. Instalación de dependencias

```bash
npm install
```

### 3. Variables de entorno

Crear un archivo `.env` en la raíz con el siguiente contenido:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

Ajusta los valores si tu backend corre en otro puerto o dominio.

### 4. Levantar el entorno de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`.

## 🧪 Ejecución de Pruebas

Para correr las pruebas unitarias:

```bash
npm run test
```

Las pruebas están implementadas usando Jest y React Testing Library, cubriendo componentes clave como formularios, autenticación y visualización de órdenes.

## 🧱 Estructura de carpetas principal

```plaintext
/src
 ├── api/            # Endpoints y configuración de Axios
 ├── components/     # Componentes UI reutilizables
 ├── contexts/       # Context API para autenticación
 ├── features/       # Microfrontends: órdenes, rutas, reportes, etc.
 ├── hooks/          # Custom hooks
 ├── pages/          # Páginas principales
 ├── redux/          # Slice de Redux Toolkit para estado global
 ├── router/         # Configuración de React Router
 ├── services/       # Lógica de WebSocket y servicios API
 ├── utils/          # Utilidades generales
 └── styles/         # Estilos globales Tailwind
```

## 🧩 Microfrontend

Este proyecto está configurado como un microfrontend utilizando **Webpack Module Federation**. Puede ser cargado como un módulo remoto (`remoteEntry.js`) para ser consumido por un contenedor principal en arquitecturas a mayor escala.

## 🔒 Seguridad

- **JWT:** El token de autenticación se guarda en `localStorage`.
- **Protección de rutas:** Las rutas están protegidas utilizando guards que validan el token antes de renderizar componentes privados.
- **Roles:** Validación de roles (usuario vs administrador) en base al JWT decodificado.

## 📈 Funcionalidades principales

### Usuario

- Registro de cuenta y autenticación segura.
- Creación de nuevas órdenes de envío.
- Seguimiento en tiempo real del estado de sus envíos.
- Visualización de su historial de órdenes.

### Administrador

- Visualización y asignación de rutas a envíos.
- Gestión de transportistas.
- Consulta de métricas de desempeño (tiempo promedio de entrega, envíos completados, etc.)

## 🚀 Scripts disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Iniciar entorno de desarrollo |
| `npm run build` | Crear build optimizado para producción |
| `npm run preview` | Previsualizar build |

## 📝 Historias de Usuario Implementadas

- **HU1:** Registro y autenticación de usuarios.
- **HU2:** Creación de órdenes de envío.
- **HU3:** Asignación de rutas a los envíos (modo administrador).
- **HU4:** Seguimiento en tiempo real del estado de envíos.
- **HU5:** Consulta de reportes logísticos avanzados.

## 📹 Video de Demostración

[Enlace privado a video explicativo aquí]  
*(El video debe mostrar al candidato explicando y demostrando la solución en máximo 10 minutos, apareciendo en un recuadro tipo tutorial.)*
