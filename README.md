# WorkBuddy - Sistema de Gestión Empresarial

WorkBuddy es una aplicación web completa para la gestión de inventario, clientes y órdenes de una empresa. Proporciona una interfaz intuitiva y moderna para administrar todos los aspectos del negocio.

## Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- React Hot Toast
- Heroicons

### Backend
- Node.js
- Express
- MongoDB
- JWT para autenticación
- Cloudinary para almacenamiento de imágenes

## Estructura del Proyecto

```
WorkBuddy-backend/
├── backend/                # API REST con Node.js y Express
│   ├── src/
│   │   ├── config/         # Configuración de la aplicación
│   │   ├── controllers/    # Controladores para cada entidad
│   │   ├── models/         # Modelos de datos (MongoDB)
│   │   ├── routes/         # Rutas de la API
│   │   └── middleware/     # Middleware personalizado
│   └── index.js            # Punto de entrada de la API
│
├── frontend/               # Aplicación React con Vite
│   ├── src/
│   │   ├── assets/         # Imágenes y recursos estáticos
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Contextos de React (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Componentes de layout
│   │   ├── utils/          # Utilidades y funciones auxiliares
│   │   └── views/          # Componentes de página
│   ├── index.html          # Archivo HTML principal
│   └── vite.config.js      # Configuración de Vite
│
└── README.md               # Documentación del proyecto
```

## Características Principales

- **Autenticación y Autorización**: Sistema de login seguro con JWT
- **Gestión de Usuarios**: CRUD completo para administrar clientes
- **Gestión de Inventario**: CRUD completo para administrar productos con imágenes
- **Gestión de Órdenes**: CRUD completo para administrar órdenes de compra
- **Interfaz Responsive**: Diseño adaptable a dispositivos móviles, tablets y escritorio
- **Validación de Formularios**: Validación en el cliente con mensajes de error claros
- **Notificaciones**: Sistema de notificaciones con toasts para informar al usuario

## Instalación y Ejecución

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- Cuenta en Cloudinary (para almacenamiento de imágenes)

### Configuración del Backend

1. Navega al directorio del backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del directorio backend con las siguientes variables:
```
PORT=5000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Inicia el servidor:
```bash
node index.js
```

### Configuración del Frontend

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Para construir la aplicación para producción:
```bash
npm run build
```

## Uso de la Aplicación

1. Accede a la aplicación en `http://localhost:5173`
2. Inicia sesión con las credenciales proporcionadas
3. Navega por el dashboard para acceder a las diferentes funcionalidades

## Equipo de Trabajo

- Steven Morales - Desarrollador Full Stack

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.
