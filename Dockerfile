# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl openssl-dev musl-dev

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm ci --omit=optional

# Copia archivos de Prisma primero
COPY prisma ./prisma

# Limpiar cualquier cliente de Prisma existente y generar para el entorno correcto
RUN rm -rf node_modules/.prisma/client || true
RUN rm -rf node_modules/@prisma/client/runtime || true
RUN npx prisma generate --schema=./prisma/schema.prisma

# Verificar que el cliente de Prisma se generó correctamente
RUN ls -la node_modules/.prisma/client/ || echo "Prisma client directory not found"

# Copia el resto del código fuente
COPY . .

# Compila el proyecto
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS production
WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache openssl openssl-dev musl-dev

# Copia solo lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# NO copiar .env - usar variables de entorno de Render
# COPY --from=builder /app/.env ./

# Verificar que el cliente de Prisma esté disponible desde el builder
RUN ls -la node_modules/.prisma/client/ || echo "Prisma client not found, regenerating..."

# Solo regenerar si no existe
RUN [ -d "node_modules/.prisma/client" ] || npx prisma generate --schema=./prisma/schema.prisma

# Hacer ejecutable el script de inicio
RUN chmod +x scripts/start-production.sh

# Expone el puerto
EXPOSE 3000

# Comando por defecto usando el script de inicio
CMD ["./scripts/start-production.sh"]

# Etapa 3: Desarrollo (opcional)
FROM node:20-alpine AS dev
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
