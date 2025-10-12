# Variables
DOCKER_USER=williams2022
IMAGE_NAME=$(DOCKER_USER)/backconnectpost
TAG=latest
CONTAINER_NAME=backconnectpost
PORT=3000

# Docker login (usa tu token personal)
docker-login:
	docker login -u williams2022 --password-stdin <<< "$$DOCKER_PASSWORD"

# Build de la imagen
build:
	docker build -t $(IMAGE_NAME):$(TAG) .

# Correr el contenedor en modo producción
run:
	docker run --rm -it -p $(PORT):3000 --env-file .env --name $(CONTAINER_NAME) $(IMAGE_NAME):$(TAG)

# Correr en modo desarrollo (hot reload)
run-dev:
	docker build --target dev -t $(IMAGE_NAME):dev .
	docker run --rm -it -p $(PORT):3000 --env-file .env -v $$(pwd):/app --name $(CONTAINER_NAME)-dev $(IMAGE_NAME):dev

# Push a Docker Hub
push:
	docker push $(IMAGE_NAME):$(TAG)

# Prisma: migraciones
prisma-migrate:
	docker run --rm -v $$(pwd):/app -w /app --env-file .env node:20-alpine npx prisma migrate deploy

# Prisma: generar cliente
prisma-generate:
	docker run --rm -v $$(pwd):/app -w /app node:20-alpine npx prisma generate

# Limpiar contenedores parados
clean:
	docker container prune -f
