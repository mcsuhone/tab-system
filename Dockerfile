FROM node:20-alpine

WORKDIR /app

# Install pnpm and postgresql-client
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache postgresql-client && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies and add tsx
RUN pnpm install --frozen-lockfile
RUN pnpm add -D tsx

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm build

# Make startup script executable
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]