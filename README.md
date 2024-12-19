# Tab System

A modern web application designed to help organizations manage member balances and product purchases. The system allows members to track their balances, make purchases, and administrators to manage products and user accounts.

## Description

Tab System is a full-stack web application built with Next.js that provides:

- Member balance tracking
- Product management with categories (beverages, snacks, etc.)
- Admin dashboard for user and product management
- Secure authentication system
- Real-time balance updates
- Responsive UI for both desktop and mobile use

## Installation

### Prerequisites

- Ubuntu system
- Node.js 20 or higher
- PNPM package manager
- PostgreSQL 16
- Docker and Docker Compose (for production deployment)

### Development Setup

1. Install PNPM if not already installed:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

2. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd tab-system
pnpm install
```

3. Set up environment variables:

```bash
cp .env.sample .env
```

Set environment variables in `.env` file

4. Start the development database:

```bash
docker compose -f docker-compose-db.yml up -d
```

5. Initialize the database:

```bash
pnpm db:generate
pnpm db:migrate
```

6. Start the development server:

```bash
pnpm dev
```

### Production Deployment

1. Ensure Docker and Docker Compose are installed on your Ubuntu system

2. Configure environment variables in `.env`

3. Start the application:

```bash
docker compose up -d
```

The application will be available at `http://localhost:3000`

## Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **Shadcn UI** - Component library based on Radix UI
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **Next.js 14** - Server-side framework
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Database
- **Jose** - Authentication
- **bcrypt** - Password hashing

### Development Tools

- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Docker** - Containerization
- **pnpm** - Package management

### Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Admin/User)
- Environment variable management
- Secure HTTP-only cookies

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'feat: add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is proprietary and confidential.
