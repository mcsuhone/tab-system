FROM node:20-alpine

WORKDIR /app

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies and add tsx
RUN pnpm install --frozen-lockfile
RUN pnpm add -D tsx

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

EXPOSE 3000

ENTRYPOINT pnpm tsx db/migrate.ts && pnpm start 