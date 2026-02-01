# Stromboli TypeScript SDK - Makefile
# All commands run inside Podman containers

IMAGE_NAME := stromboli-ts-dev
CONTAINER_NAME := stromboli-ts
WORKDIR := /app

# Build the development container
.PHONY: build-image
build-image:
	podman build -t $(IMAGE_NAME) -f Containerfile .

# Run a command inside the container (with dependency install)
define run_in_container
	podman run --rm -v $(PWD):$(WORKDIR):Z -w $(WORKDIR) $(IMAGE_NAME) /bin/bash -c "bun install --frozen-lockfile 2>/dev/null || bun install && $(1)"
endef

# Development
.PHONY: dev
dev: build-image
	$(call run_in_container,bun run --watch src/index.ts)

.PHONY: shell
shell: build-image
	podman run --rm -it -v $(PWD):$(WORKDIR):Z -w $(WORKDIR) $(IMAGE_NAME) /bin/bash

# Code Quality
.PHONY: lint
lint: build-image
	$(call run_in_container,bun run lint)

.PHONY: lint-fix
lint-fix: build-image
	$(call run_in_container,bun run lint:fix)

.PHONY: format
format: build-image
	$(call run_in_container,bun run format)

.PHONY: typecheck
typecheck: build-image
	$(call run_in_container,bun run typecheck)

# Testing
.PHONY: test
test: build-image
	$(call run_in_container,bun run test)

.PHONY: test-watch
test-watch: build-image
	podman run --rm -it -v $(PWD):$(WORKDIR):Z -w $(WORKDIR) $(IMAGE_NAME) /bin/bash -c "bun install && bun test --watch tests/unit/"

.PHONY: test-coverage
test-coverage: build-image
	$(call run_in_container,bun run test:coverage)

# E2E tests with Prism mock server
.PHONY: test-e2e
test-e2e: build-image
	@echo "🛑 Stopping any existing Prism server..."
	@podman stop stromboli-prism 2>/dev/null || true
	@sleep 1
	@echo "🚀 Starting Prism mock server..."
	@podman run -d --name stromboli-prism --replace \
		--network host \
		-v $(PWD)/src/generated/openapi.json:/openapi.json:Z \
		docker.io/stoplight/prism:4 mock -h 0.0.0.0 -p 4010 /openapi.json
	@echo "⏳ Waiting for Prism to be ready..."
	@sleep 5
	@curl -s http://localhost:4010/health > /dev/null 2>&1 || sleep 3
	@echo "🧪 Running E2E tests..."
	-podman run --rm --network host -v $(PWD):/app:Z -w /app stromboli-ts-dev /bin/bash -c "bun install --frozen-lockfile 2>/dev/null || bun install && STROMBOLI_URL=http://localhost:4010 bun test tests/e2e/"
	@echo "🛑 Stopping Prism server..."
	@podman stop stromboli-prism 2>/dev/null || true

# Build & Generate
.PHONY: build
build: build-image
	$(call run_in_container,bun run build)

.PHONY: generate
generate: build-image
	$(call run_in_container,bun run generate)

# Install dependencies (inside container)
.PHONY: install
install: build-image
	$(call run_in_container,echo 'Dependencies installed')

# Clean
.PHONY: clean
clean:
	rm -rf dist coverage node_modules bun.lockb

.PHONY: clean-image
clean-image:
	podman rmi $(IMAGE_NAME) 2>/dev/null || true

# Documentation
.PHONY: docs
docs:
	@echo "📚 Installing docs dependencies..."
	@podman run --rm -v $(PWD)/docs:/app:Z -w /app docker.io/oven/bun:1 bun install
	@echo "🚀 Starting docs dev server..."
	@podman run --rm -it -v $(PWD)/docs:/app:Z -w /app -p 3000:3000 docker.io/oven/bun:1 bun run dev

.PHONY: docs-build
docs-build:
	@echo "📚 Installing docs dependencies..."
	@podman run --rm -v $(PWD)/docs:/app:Z -w /app docker.io/oven/bun:1 bun install
	@echo "🔨 Building docs..."
	@podman run --rm -v $(PWD)/docs:/app:Z -w /app docker.io/oven/bun:1 bun run build

# Help
.PHONY: help
help:
	@echo "Stromboli TypeScript SDK - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Run in watch mode"
	@echo "  make shell        - Open container shell"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint         - Check lint + format"
	@echo "  make lint-fix     - Auto-fix lint issues"
	@echo "  make format       - Format code"
	@echo "  make typecheck    - Run TypeScript type checking"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run unit tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make test-coverage - Run tests with coverage"
	@echo "  make test-e2e     - Run E2E tests"
	@echo ""
	@echo "Build & Generate:"
	@echo "  make build        - Build for production"
	@echo "  make generate     - Regenerate from OpenAPI"
	@echo "  make install      - Install dependencies"
	@echo ""
	@echo "Documentation:"
	@echo "  make docs         - Run docs dev server"
	@echo "  make docs-build   - Build docs for production"
	@echo ""
	@echo "Clean:"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make clean-image  - Remove container image"

.DEFAULT_GOAL := help
