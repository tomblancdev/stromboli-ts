FROM docker.io/oven/bun:1

WORKDIR /app

# Install Biome globally
RUN bun add -g @biomejs/biome

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy source
COPY . .

CMD ["bun", "test"]
