# BackConnectPost Docker Makefile - Render Optimized
# 
# Usage:
# 1. Set your Docker Personal Access Token: export DOCKER_PASSWORD=your_token_here
# 2. Run: make docker-login
# 3. Build and push: make build && make push
# 4. For Render deployment: make render-build
#
# Variables
DOCKER_USER=williams2022
IMAGE_NAME=$(DOCKER_USER)/backconnectpost
TAG=latest
CONTAINER_NAME=backconnectpost
PORT=3000

# Docker login (requires DOCKER_PASSWORD environment variable)
docker-login:
	@echo "Logging in to Docker Hub..."
	@docker login -u $(DOCKER_USER) --password-stdin <<< "$$DOCKER_PASSWORD"

# Build de la imagen optimizada para Render
build:
	@echo "Building Render-optimized image..."
	docker build -t $(IMAGE_NAME):$(TAG) .

# Build específico para Render (sin cache para deployment limpio)
render-build:
	@echo "Building for Render deployment (no cache)..."
	docker build --no-cache -t $(IMAGE_NAME):$(TAG) .

# Correr el contenedor en modo producción
run:
	@echo "Running production container..."
	docker run --rm -it -p $(PORT):$(PORT) --env-file .env --name $(CONTAINER_NAME) \
		-e PORT=$(PORT) $(IMAGE_NAME):$(TAG)

# Correr en modo desarrollo (usando npm run start:dev)
run-dev:
	@echo "Running development container..."
	docker run --rm -it -p $(PORT):$(PORT) --env-file .env \
		-v $$(pwd)/src:/app/src -v $$(pwd)/prisma:/app/prisma \
		--name $(CONTAINER_NAME)-dev \
		-e NODE_ENV=development \
		$(IMAGE_NAME):$(TAG) npm run start:dev

# Push a Docker Hub
push:
	@echo "Pushing to Docker Hub..."
	docker push $(IMAGE_NAME):$(TAG)

# Build and push for Render deployment
deploy-render: render-build push
	@echo "✅ Image built and pushed for Render deployment"
	@echo "📝 Use this image in Render: $(IMAGE_NAME):$(TAG)"

# Test local build matches Render environment
test-render-local:
	@echo "Testing Render-like environment locally..."
	docker run --rm -it -p $(PORT):$(PORT) \
		-e NODE_ENV=production \
		-e PORT=$(PORT) \
		--env-file .env \
		--name $(CONTAINER_NAME)-test \
		$(IMAGE_NAME):$(TAG)

# Prisma: migraciones
prisma-migrate:
	@echo "Running Prisma migrations..."
	docker run --rm -v $$(pwd):/app -w /app --env-file .env node:20-alpine sh -c \
		"npm install @prisma/client prisma && npx prisma migrate deploy"

# Prisma: generar cliente
prisma-generate:
	@echo "Generating Prisma client..."
	docker run --rm -v $$(pwd):/app -w /app node:20-alpine sh -c \
		"npm install @prisma/client prisma && npx prisma generate"

# Seed location data
seed-locations:
	@echo "Seeding location data..."
	docker run --rm -v $$(pwd):/app -w /app --env-file .env node:20-alpine sh -c \
		"npm install @prisma/client prisma && node scripts/seed-locations.js"

# Complete database setup for Render
setup-db: prisma-migrate prisma-generate seed-locations
	@echo "✅ Database setup complete"

# Limpiar contenedores parados
clean:
	@echo "Cleaning up stopped containers..."
	docker container prune -f
	docker image prune -f

# Show logs from running container
logs:
	docker logs -f $(CONTAINER_NAME)

# Stop running containers
stop:
	@echo "Stopping containers..."
	-docker stop $(CONTAINER_NAME) $(CONTAINER_NAME)-dev $(CONTAINER_NAME)-test
	-docker rm $(CONTAINER_NAME) $(CONTAINER_NAME)-dev $(CONTAINER_NAME)-test

# Verify deployment readiness
verify-render:
	@echo "Verifying Render deployment readiness..."
	@./scripts/verify-render-deployment.sh

# Complete workflow for Render deployment
render-deploy-workflow: verify-render clean render-build push
	@echo ""
	@echo "🚀 Render Deployment Workflow Complete!"
	@echo "📋 Next steps:"
	@echo "   1. Update your Render service to use: $(IMAGE_NAME):$(TAG)"
	@echo "   2. Ensure environment variables are set in Render"
	@echo "   3. Run database setup if needed: make setup-db"
	@echo ""

# Help command
help:
	@echo "BackConnectPost Makefile - Render Optimized"
	@echo ""
	@echo "Available commands:"
	@echo "  build                 - Build Docker image"
	@echo "  render-build         - Build for Render (no cache)"
	@echo "  run                  - Run in production mode"
	@echo "  run-dev              - Run in development mode"
	@echo "  push                 - Push to Docker Hub"
	@echo "  deploy-render        - Build and push for Render"
	@echo "  verify-render        - Verify deployment readiness"
	@echo "  test-render-local    - Test Render environment locally"
	@echo "  prisma-migrate       - Run database migrations"
	@echo "  prisma-generate      - Generate Prisma client"
	@echo "  seed-locations       - Seed location data"
	@echo "  setup-db             - Complete database setup"
	@echo "  render-deploy-workflow - Complete Render deployment"
	@echo "  clean                - Clean up containers and images"
	@echo "  logs                 - Show container logs"
	@echo "  stop                 - Stop all containers"
	@echo "  help                 - Show this help message"
