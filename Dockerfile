# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias solo para producción y desarrollo
RUN npm ci --omit=optional

# Copia el resto del código fuente
COPY . .

# Compila el proyecto
RUN npm run build

# Prisma: genera cliente
RUN npx prisma generate

# Etapa 2: Producción
FROM node:20-alpine AS production
WORKDIR /app

# Copia solo lo necesario desde la etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.env ./

# Prisma: genera cliente en producción (por si acaso)
RUN npx prisma generate

# Expone el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/main.js"]

# Etapa 3: Desarrollo (opcional)
FROM node:20-alpine AS dev
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
