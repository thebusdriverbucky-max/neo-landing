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

## Getting Started

To set up, run, and deploy this project, please refer to our official guides:

1. **First-Step Guide (Start Here):**  
   [https://www.ownyourwebsite.app/help](https://www.ownyourwebsite.app/help) — Read this first to quickly understand how the template works and get it running.

2. **Deployment Guide:**  
   [https://www.ownyourwebsite.app/docs/deploy](https://www.ownyourwebsite.app/docs/deploy) — Step-by-step instructions on deploying your website to production.

3. **Environment Variables Config:**  
   [https://www.ownyourwebsite.app/docs/env](https://www.ownyourwebsite.app/docs/env) — Information on which environment variables are required and how to obtain them.

### Supported toolchain

Use Node.js 22 (the exact tested release is recorded in `.nvmrc`) and npm 10.
Install the committed dependency graph with `npm ci`; keep `package-lock.json`
with the purchased source. The included Template CI workflow installs from the
lockfile, runs tests, TypeScript, and lint, rehearses the production database
build contract on PostgreSQL 16, repeats the safe bootstrap, and rejects
migration/schema drift.

## Database deployment contract

For a new deployment, configure `DATABASE_URL` as the pooled runtime connection
and `DIRECT_URL` as the direct/unpooled connection to the same database, branch,
and schema. `DIRECT_URL` does not point to a second database.

The production `build` command generates Prisma Client, applies the committed
migrations with `prisma migrate deploy`, safely creates the singleton CMS record
when it is missing, and then builds the app. There is no separate manual
production seed step. Repeat deployments do not overwrite content edited by the
owner. The bootstrap can also be run with `npm run db:bootstrap` (or
`npm run db:seed`).

The included business details and legal text are placeholders. Replace and
review them before accepting real booking requests.

The committed baseline migration is for clean databases. If an older deployment
already created its tables with `prisma db push`, do not run the baseline against
that database as if it were empty. Back it up and use a maintainer-reviewed
Prisma baselining procedure after verifying the existing schema.

Use separate Preview and Production databases. Never point Preview at the
Production database, because each deployment applies migrations to the database
configured for that environment.

## Booking and upload security

The public booking route validates and normalizes name, phone, email, date, and
message fields before writing them. User-controlled values are HTML-escaped in
the optional Resend notification. Configure `ADMIN_EMAIL`, `RESEND_API_KEY`, and
`EMAIL_FROM` together to enable those notifications; verify the sender/domain in
Resend before relying on delivery.

The admin upload route accepts JPEG, PNG, and WebP images up to 5 MiB. SVG and
other formats are rejected. Cloudinary credentials are server-only and must not
use a `NEXT_PUBLIC_*` name.

Production must protect `/api/admin/login` and `/api/booking` with either:

- both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; or
- external hosting/WAF rate-limit rules for those exact paths.

When Upstash is configured, the application uses a distributed fixed-window
counter and fails closed on incomplete configuration or provider failure outside
development. Without Upstash, the application assumes the documented external
WAF protection. Header-based identity trusts only Vercel's managed client-IP
header, so non-Vercel hosting must provide an equivalent trusted-proxy contract
or adapt the helper before commercial use. Add CAPTCHA/Turnstile to the booking
form if the site's abuse profile requires stronger bot protection.

Vercel Hobby is suitable for personal, non-commercial demos and previews. Use a
commercially permitted Vercel plan or another suitable host for a production
business site; domain, database, email, storage, and other providers may have
separate costs.

## License Configuration

All configuration values (including `LICENSE_KEY`, `LICENSE_PRODUCT`, or any other license-related keys) will be sent directly to your email address immediately after purchase. Simply paste them into your environment variables when configuring the project!

## Project Structure

- `app/` - Next.js routes and API
- `components/sections/` - Landing page sections
- `components/ui/` - Shared UI components
- `lib/` - Utilities and configurations (Prisma, Cloudinary, License)
- `prisma/` - DB schema and seeding scripts
