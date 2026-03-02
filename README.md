# Neo Landing Template

A modern, animated landing page template with an integrated CMS for content management.

## Features

- 🚀 **Next.js 15 (App Router)**
- 🎨 **Tailwind CSS** for styling
- ✨ **Framer Motion** for smooth animations
- 📝 **Prisma ORM** for database management
- 🔐 **Admin Panel** for editing content without code changes
- ☁️ **Cloudinary** for image uploads
- 🔑 **License System** for license verification

## Prerequisites

- Node.js 18+
- PostgreSQL (or any other DB supported by Prisma)
- Cloudinary account (for image uploads)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd landing-template/neo-landing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the required fields:
   ```bash
   cp .env.example .env
   ```

## Environment Variables (.env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your PostgreSQL database URL |
| `ADMIN_PASSWORD` | Password for the admin panel |
| `JWT_SECRET` | Secret key for admin authorization |
| `CLOUDINARY_*` | Your Cloudinary account credentials |
| `LICENSE_KEY` | Your license key |
| `LICENSE_SERVER_URL` | URL of the license server |
| `LICENSE_PRODUCT` | Product identifier (default: `neo-landing`) |

## Database Setup and Seeding

1. Apply Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

2. Run the seed script to create initial content:
   ```bash
   npx prisma db seed
   ```

## Running the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.
The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

- `app/` - Next.js routes and API
- `components/sections/` - Landing page sections
- `components/ui/` - Shared UI components
- `lib/` - Utilities and configurations (Prisma, Cloudinary, License)
- `prisma/` - DB schema and seeding scripts
