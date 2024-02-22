# Music Project

Este proyecto es una aplicación web para gestionar y compartir música. Permite a los usuarios subir sus propias canciones, crear y administrar categorías, así como interactuar con otras personas a través de la plataforma.

## Backend

El backend de la aplicación está realizado con Node.js, Express, MongoDB y Mongoose. Utiliza diversas librerías para funcionalidades específicas:

- **CORS**: Para permitir peticiones desde diferentes orígenes.
- **JWT**: Para generar tokens de autenticación.
- **Passport**: Para las autenticaciones.
- **Multer**: Para la subida de archivos, en este caso, canciones.
- **Cloudinary**: Para guardar las canciones en su servidor.
- **bcryptjs**: Para la encriptación de las contraseñas.
- **Nodemailer**: Para los envíos de los mails de recuperación de password.

### Rutas de la API

- **Subir una canción**:
  - Método: `POST`
  - Ruta: `/`
  - Parámetros: `audio` (archivo)
  - Middleware: `authenticateAdmin`
  - Controlador: `createAudio`

- **Eliminar una canción**:
  - Método: `DELETE`
  - Ruta: `/:id`
  - Parámetros: `id` (identificador de la canción)
  - Controlador: `delAudio`

- **Traer todos los audios**:
  - Método: `GET`
  - Ruta: `/`
  - Controlador: `getAllAudios`

- **Modificar los datos de una canción**:
  - Método: `PUT`
  - Ruta: `/:id`
  - Parámetros: `id` (identificador de la canción)
  - Middleware: `authenticateAdmin`
  - Controlador: `updateAudio`

- **Crear una categoría**:
  - Método: `POST`
  - Ruta: `/category`
  - Controlador: `createCategory`

- **Traer todas las categorías**:
  - Método: `GET`
  - Ruta: `/categories`
  - Controlador: `getAllCategories`

- **Actualizar una categoría**:
  - Método: `PUT`
  - Ruta: `/category/:id`
  - Parámetros: `id` (identificador de la categoría)
  - Controlador: `updateCategory`

- **Eliminar una categoría**:
  - Método: `DELETE`
  - Ruta: `/category/:id`
  - Parámetros: `id` (identificador de la categoría)
  - Middleware: `authenticateAdmin`
  - Controlador: `deleteCategory`

- **Traer todos los usuarios**:
  - Método: `GET`
  - Ruta: `/usuarios`
  - Middleware: `authenticateAdmin`
  - Controlador: `getAllUsers`

- **Traer un usuario por id**:
  - Método: `GET`
  - Ruta: `/usuario/:id`
  - Parámetros: `id` (identificador del usuario)
  - Controlador: `getUserById`

- **Eliminar un usuario**:
  - Método: `DELETE`
  - Ruta: `/usuario/:id`
  - Parámetros: `id` (identificador del usuario)
  - Middleware: `authenticateAdmin`
  - Controlador: `deleteUser`

- **Actualizar los datos de un usuario**:
  - Método: `PUT`
  - Ruta: `/usuario/:id`
  - Parámetros: `id` (identificador del usuario)
  - Middleware: `authenticateUser`
  - Controlador: `userUpdate`

- **Registrar un usuario**:
  - Método: `POST`
  - Ruta: `/registrar`
  - Middleware: `authenticateAdmin`
  - Controlador: `register`

- **Generar el login del usuario**:
  - Método: `POST`
  - Ruta: `/login`
  - Controlador: `login`

- **Cambiar de rol el usuario**:
  - Método: `PUT`
  - Ruta: `/admin/:id`
  - Parámetros: `id` (identificador del usuario)
  - Middleware: `authenticateAdmin`
  - Controlador: `changeToAdmin`

- **Desactivar una cuenta de usuario**:
  - Método: `PUT`
  - Ruta: `/desactivar/usuario/:id`
  - Parámetros: `id` (identificador del usuario)
  - Middleware: `authenticateAdmin`
  - Controlador: `userDisabled`

- **Recuperar el password de una cuenta**:
  - Método: `POST`
  - Ruta: `/usuario/recuperar`
  - Controlador: `recoverPass`

- **Resetear el password de la cuenta a recuperar**:
  - Método: `PUT`
  - Ruta: `/usuario/reset/:id/:token`
  - Parámetros: `id` (identificador del usuario), `token` (token de recuperación)
  - Controlador: `resetPass`

- **Agregar una canción a un usuario**:
  - Método: `POST`
  - Ruta: `/usuario/audios/:id`
  - Parámetros: `id` (identificador del usuario)
  - Middleware: `authenticateAdmin`
  - Controlador: `addAudios`

- **Quitar una canción de la colección del usuario**:
  - Método: `PUT`
  - Ruta: `/usuario/audios/:id`
  - Parámetros: `id` (identificador del usuario)
  - Middleware: `authenticateAdmin`
  - Controlador: `deleteAudio`

## Frontend

El frontend de la aplicación está realizado con [React](https://reactjs.org/) y utiliza [Context] para el manejo del estado. Se recomienda revisar el código fuente para más detalles sobre la implementación.

## Instalación

1. Clonar el repositorio Backend: `git clone https://github.com/pablopaul01/MusicProject-Back.git`
2. Instalar las dependencias del backend: `npm install`

1. Clonar el repositorio Frontend: `git clone https://github.com/pablopaul01/MusicProject-Front.git`
3. Instalar las dependencias del frontend: `npm install`

## Configuración

1. Renombrar el archivo `EXAMPLE.env` como `.env` en el directorio raíz del proyecto.
2. Configurar las variables de entorno en el archivo `.env` en el directorio raíz del proyecto con tus propios datos. Ejemplo:

   ```plaintext
   PORT=3000
   MONGODB_URI=mongodb://localhost/music-project
   JWT_SECRET=secreto
   CLOUDINARY_CLOUD_NAME=cloud_name
   CLOUDINARY_API_KEY=api_key
   CLOUDINARY_API_SECRET=api_secret

1. Iniciar el servidor: `npm start`
2. Iniciar el cliente: `npm start`

¡Listo! La aplicación estará disponible en http://localhost:3000/.