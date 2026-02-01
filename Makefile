# Stromboli TypeScript SDK - Makefile
# All commands run inside Podman containers

IMAGE_NAME := stromboli-ts-dev
CONTAINER_NAME := stromboli-ts
WORKDIR := /app

# Build the development container
.PHONY: build-image
build-image:
	podman build -t $(IMAGE_NAME) -f Containerfile .

# Run a command inside the container
define run_in_container
	podman run --rm -v $(PWD):$(WORKDIR):Z -w $(WORKDIR) $(IMAGE_NAME) $(1)
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
	$(call run_in_container,bun test)

.PHONY: test-watch
test-watch: build-image
	podman run --rm -it -v $(PWD):$(WORKDIR):Z -w $(WORKDIR) $(IMAGE_NAME) bun test --watch

.PHONY: test-coverage
test-coverage: build-image
	$(call run_in_container,bun test --coverage)

.PHONY: test-e2e
test-e2e: build-image
	$(call run_in_container,bun test tests/e2e/)

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
	$(call run_in_container,bun install)

# Clean
.PHONY: clean
clean:
	rm -rf dist coverage node_modules

.PHONY: clean-image
clean-image:
	podman rmi $(IMAGE_NAME) 2>/dev/null || true

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
	@echo "Clean:"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make clean-image  - Remove container image"

.DEFAULT_GOAL := help
