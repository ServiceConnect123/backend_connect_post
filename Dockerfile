# Dockerfile optimizado para Render
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl openssl-dev musl-dev

# Copiar archivos de configuración
COPY package*.json ./

# Copiar archivos de Prisma primero
COPY prisma ./prisma

# Instalar todas las dependencias (incluyendo devDependencies para el build)
# El postinstall script generará Prisma automáticamente
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Limpiar devDependencies para reducir el tamaño
RUN npm prune --production

# Regenerar cliente de Prisma después de limpiar dependencias
RUN npx prisma generate

# Exponer el puerto que usa Render (puede variar, Render lo asigna automáticamente)
EXPOSE $PORT

# Configurar variables de entorno por defecto
ENV NODE_ENV=production

# Comando de inicio directo (sin prestart ya que ya está compilado)
CMD ["node", "dist/src/main.js"]
