# Guía de Despliegue con Docker - AutoCareService

Este proyecto está configurado para ser desplegado usando Docker y Docker Compose. Esta guía te ayudará a construir y ejecutar la aplicación en contenedores.

## Requisitos Previos

- Docker instalado (versión 20.10 o superior)
- Docker Compose instalado (versión 2.0 o superior)

Para verificar que tienes Docker instalado, ejecuta:
```bash
docker --version
docker-compose --version
```

## Estructura del Proyecto

El proyecto está compuesto por tres servicios principales:

1. **Frontend**: Aplicación React con Vite servida por Nginx
2. **Backend**: API REST con Node.js y Express
3. **Base de Datos**: MySQL 8.0

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos MySQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=autocarservice
MYSQL_USER=autocareuser
MYSQL_PASSWORD=autocarepass

# Backend
PORT=3000
DB_HOST=db
DB_USER=autocareuser
DB_PASSWORD=autocarepass
DB_NAME=autocarservice

# JWT Secret (IMPORTANTE: Cambiar en producción)
JWT_SECRET=your-secret-key-change-in-production
```

**Nota**: En producción, asegúrate de usar contraseñas seguras y un JWT_SECRET robusto.

### 2. Configuración del Frontend

El frontend necesita conocer la URL del backend. En el archivo `docker-compose.yml`, el frontend está configurado para usar un proxy de Nginx que redirige las peticiones al backend automáticamente.

Si se necesitas configurar manualmente, crea un archivo `.env` en la carpeta del frontend con:

```env
VITE_API_URL=http://localhost:3000
```

Sin embargo, con la configuración de Nginx incluida, esto no es necesario ya que el proxy maneja las rutas automáticamente.

## Construcción y Ejecución

### Opción 1: Construir y Ejecutar con Docker Compose (Recomendado)

1. **Construir las imágenes y levantar los contenedores:**
   ```bash
   docker-compose up --build
   ```

2. **Ejecutar en segundo plano:**
   ```bash
   docker-compose up -d --build
   ```

3. **Ver los logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Detener los contenedores:**
   ```bash
   docker-compose down
   ```

5. **Detener y eliminar volúmenes (incluyendo la base de datos):**
   ```bash
   docker-compose down -v
   ```

### Opción 2: Construir y Ejecutar Manualmente

#### Backend

```bash
cd "pnc-proyecto-final-grupo-14-s01/AutoCarService - Backend"
docker build -t autocare-backend .
docker run -p 3000:3000 --env-file ../../.env autocare-backend
```

#### Frontend

```bash
cd "pnc-proyecto-final-frontend-grupo-14-s01/AutoCare"
docker build -t autocare-frontend .
docker run -p 80:80 autocare-frontend
```

## Acceso a la Aplicación

Una vez que los contenedores estén en ejecución:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Base de Datos MySQL**: localhost:3307 (puerto 3307 para evitar conflicto con MySQL local)

## Usuario Administrador por Defecto

El sistema incluye un usuario administrador creado automáticamente al inicializar la base de datos:

- **Email:** `admin@autocare.com`
- **Contraseña:** `admin123`
- **Rol:** Administrador

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer inicio de sesión por seguridad.

Para más información sobre la gestión de usuarios administradores, consulta `pnc-proyecto-final-grupo-14-s01/ADMIN_SETUP.md`.

## Inicialización de la Base de Datos

El archivo SQL `AutoCarService.sql` se ejecutará automáticamente al crear el contenedor de la base de datos por primera vez, gracias a la configuración en `docker-compose.yml` que monta el archivo en `/docker-entrypoint-initdb.d/`.

Este script incluye:
- Creación de todas las tablas necesarias
- Inserción de roles (cliente, mecánico, admin)
- **Creación automática del usuario administrador por defecto** (`admin@autocare.com` / `admin123`)

Si necesitas ejecutar migraciones adicionales, puedes hacerlo de dos formas:

1. **Desde el contenedor:**
   ```bash
   docker exec -i autocare-db mysql -u autocareuser -pautocarepass autocarservice < ruta/al/archivo.sql
   ```

2. **Copiando el archivo al contenedor:**
   ```bash
   docker cp archivo.sql autocare-db:/tmp/
   docker exec autocare-db mysql -u autocareuser -pautocarepass autocarservice < /tmp/archivo.sql
   ```

## Volúmenes y Persistencia de Datos

Los datos de MySQL se almacenan en un volumen de Docker llamado `mysql_data`, lo que significa que los datos persistirán incluso si detienes y eliminas los contenedores (a menos que uses `docker-compose down -v`).

Las imágenes subidas al backend se almacenan en el volumen montado en `./pnc-proyecto-final-grupo-14-s01/AutoCarService - Backend/imagenes`.

## Solución de Problemas

### Los contenedores no inician

1. Verifica que los puertos 80, 3000 y 3306 no estén en uso:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :80
   netstat -ano | findstr :3000
   netstat -ano | findstr :3306
   ```

2. Revisa los logs:
   ```bash
   docker-compose logs
   ```

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Verifica la configuración de CORS en el backend (debe permitir el origen del frontend)

3. Revisa los logs del frontend:
   ```bash
   docker-compose logs frontend
   ```

### Problemas con la base de datos

1. Verifica que el contenedor de la base de datos esté saludable:
   ```bash
   docker-compose ps db
   ```

2. Revisa los logs de la base de datos:
   ```bash
   docker-compose logs db
   ```

3. Si necesitas reiniciar la base de datos desde cero:
   ```bash
   docker-compose down -v
   docker-compose up -d db
   ```

4. **Nota sobre el puerto MySQL:** El puerto está configurado en 3307 (en lugar de 3306) para evitar conflictos con instancias locales de MySQL. Si necesitas usar el puerto 3306, detén tu MySQL local o cambia el puerto en `docker-compose.yml`.

## Comandos Útiles

```bash
# Ver el estado de los contenedores
docker-compose ps

# Ver los logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir un servicio específico
docker-compose up -d --build backend

# Acceder al shell del contenedor del backend
docker exec -it autocare-backend sh

# Acceder a MySQL desde el contenedor
docker exec -it autocare-db mysql -u autocareuser -pautocarepass autocarservice

# Acceder a MySQL como root (para administración)
docker exec -it autocare-db mysql -u root -prootpassword autocarservice

# Limpiar todo (contenedores, imágenes, volúmenes)
docker-compose down -v --rmi all
```

## Producción

Para desplegar en producción, considera:

1. **Cambiar todas las contraseñas** en el archivo `.env`
2. **Usar un JWT_SECRET seguro** y único
3. **Configurar HTTPS** usando un reverse proxy (como Traefik o Nginx)
4. **Configurar backups** regulares de la base de datos
5. **Usar variables de entorno** del sistema en lugar de archivos `.env`
6. **Configurar límites de recursos** en `docker-compose.yml`:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

## Archivos de Despliegue Incluidos

- `docker-compose.yml`: Orquestación de todos los servicios
- `pnc-proyecto-final-grupo-14-s01/AutoCarService - Backend/Dockerfile`: Imagen del backend
- `pnc-proyecto-final-frontend-grupo-14-s01/AutoCare/Dockerfile`: Imagen del frontend
- `pnc-proyecto-final-frontend-grupo-14-s01/AutoCare/nginx.conf`: Configuración de Nginx para el frontend
- `pnc-proyecto-final-grupo-14-s01/AutoCarService.sql`: Script de inicialización de la base de datos
- `pnc-proyecto-final-grupo-14-s01/create_admin_user.sql`: Script para crear/actualizar usuario admin
- `pnc-proyecto-final-grupo-14-s01/ADMIN_SETUP.md`: Documentación sobre gestión de usuarios administradores
- `.dockerignore`: Archivos excluidos de las imágenes (en cada servicio)

## Inicio Rápido

1. **Construir y levantar los servicios:**
   ```bash
   docker-compose up -d --build
   ```

2. **Esperar a que la base de datos esté lista** (puede tardar unos segundos)

3. **Acceder a la aplicación:**
   - Frontend: http://localhost
   - Inicia sesión con el usuario administrador:
     - Email: `admin@autocare.com`
     - Contraseña: `admin123`

4. **Cambiar la contraseña del administrador** después del primer inicio de sesión

## Soporte

Si encuentras problemas, revisa los logs de los contenedores y verifica que todas las variables de entorno estén configuradas correctamente.

Para más información sobre:
- **Gestión de usuarios administradores:** Consulta `pnc-proyecto-final-grupo-14-s01/ADMIN_SETUP.md`
- **Problemas comunes:** Revisa la sección "Solución de Problemas" más arriba

