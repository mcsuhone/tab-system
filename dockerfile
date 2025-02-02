FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN apk add --no-cache postgresql-client && \
    npm install -g pnpm

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