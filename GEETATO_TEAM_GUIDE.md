# Geetato Web — Team Setup & Deployment Guide

This guide is for the Geetato team to take over the project, run it locally, and deploy it to a fresh Vercel account.

---

## 1. The GitHub repository

The project is hosted on GitHub:

**https://github.com/drajiv-stack/geetato-web1**

> Note: the repository was moved from `geetato-web` to `geetato-web1`. Use the new URL above.

### Clone the repository

```bash
git clone https://github.com/drajiv-stack/geetato-web1.git
cd geetato-web1
```

### Verify the project files are there

```bash
ls -la
# You should see: package.json, next.config.ts, src/, public/, README.md, etc.
```

---

## 2. Local development setup

### Install dependencies

The repo has both `package-lock.json` (npm) and `bun.lock` (bun). **Use npm** unless your team prefers Bun.

```bash
npm install
```

### Set up local environment

The repo includes `.env.example`. Copy it to `.env.local`:

```bash
cp .env.example .env.local
```

The default `.env.local` uses a local SQLite file:

```env
TURSO_CONNECTION_URL=file:./local.db
TURSO_AUTH_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Create the local database and seed it

```bash
# Push the Drizzle schema to local.db
npm run db:push

# Seed 63 sample products
npm run seed
```

### Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### What you should see

- Homepage loads with featured products and images
- `/products` page lists all 63 products
- `/api/products-new` returns JSON product data
- Product images load from `/images/products/<slug>.jpg`

---

## 3. Using a fresh Git repository (optional)

If you want to move the code to a **new GitHub account or organization**, follow these steps.

### Create a new empty repository on GitHub

1. Go to https://github.com/new
2. Name it (e.g., `geetato-web`)
3. Do **not** initialize it with README, .gitignore, or license
4. Copy the new repository URL, e.g. `https://github.com/YOUR-ORG/geetato-web.git`

### Push the existing code to the new repo

From inside the cloned project folder:

```bash
# Remove the current origin
 git remote remove origin

# Add the new origin
 git remote add origin https://github.com/YOUR-ORG/geetato-web.git

# Push everything
 git branch -M main
 git push -u origin main
```

### Make sure sensitive files stay out

The `.gitignore` already excludes:

```
.env
.env.local
.env.*.local
.env.*.backup
local.db
local.db-*
```

Never commit real database credentials or `local.db`.

---

## 4. Deploying to a fresh Vercel account

### Step A: Set up the production database (Turso)

Vercel cannot use a local SQLite file. You must use a remote Turso database.

#### Option 1: Fix the existing Turso database

The original Turso database is currently blocked:

> `SQL read operations are forbidden (reads are blocked, do you need to upgrade your plan?)`

You can upgrade the Turso plan to re-enable it. The original credentials are not in the repo for security reasons.

#### Option 2: Create a new Turso database

1. Install the Turso CLI: https://docs.turso.tech/cli
2. Log in:
   ```bash
   turso auth login
   ```
3. Create a database:
   ```bash
   turso db create geetato-db
   ```
4. Get the connection URL:
   ```bash
   turso db show geetato-db
   ```
   Copy the `libsql://...` URL.
5. Create an auth token:
   ```bash
   turso db tokens create geetato-db
   ```
   Copy the token.

### Step B: Push the schema and seed data to Turso

Set the production credentials temporarily in your terminal:

```bash
export TURSO_CONNECTION_URL="libsql://your-db.turso.io"
export TURSO_AUTH_TOKEN="your-auth-token"
```

Then run:

```bash
# Push schema
npx drizzle-kit push

# Seed products
npx tsx -r dotenv/config src/db/seeds/products_user_list.ts

# Optional: seed admin user
npx tsx -r dotenv/config src/db/seeds/admin_user.ts
```

### Step C: Create a new Vercel project

1. Go to https://vercel.com/new
2. Import the GitHub repository
3. Vercel should auto-detect **Next.js**
4. Set the root directory to `/` (repo root)
5. Click **Deploy** (it may fail first time without env vars — that's normal)

### Step D: Add environment variables in Vercel

Go to **Project Settings → Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `TURSO_CONNECTION_URL` | `libsql://your-db.turso.io` | Production, Preview, Development |
| `TURSO_AUTH_TOKEN` | Your Turso token | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Production, Preview, Development |

For Preview environments, you can use `https://preview-url.vercel.app` or the Vercel auto-generated domain.

### Step E: Redeploy

After adding environment variables:

1. Go to **Deployments**
2. Click the latest deployment
3. Click **Redeploy**

Or push a small change to GitHub to trigger a new build.

---

## 5. Important notes for the team

### Build settings

`next.config.ts` has these settings:

```ts
typescript: { ignoreBuildErrors: true },
eslint: { ignoreDuringBuilds: true }
```

This means TypeScript and ESLint errors will **not** block the Vercel build. You should clean these up later, but it helps the project deploy quickly now.

### Package manager

The repo has both `package-lock.json` and `bun.lock`. Vercel uses `npm install` by default because `package-lock.json` exists. If you want to use Bun, delete `package-lock.json` and set the install command to `bun install` in Vercel project settings.

### Product images

All 63 product images are in `public/images/products/` and are named by product slug (e.g., `stevia-cookie-pack.jpg`). The app reads the image path from the `products.image_url` database column.

If you add new products, make sure:
1. The slug matches the image filename
2. The image is placed in `public/images/products/`
3. `products.image_url` is set to `/images/products/<slug>.jpg`

### Database migrations

Schema changes are managed with Drizzle Kit. To update the database schema:

```bash
npx drizzle-kit push
```

Always run this against the correct database (local or Turso) by setting `TURSO_CONNECTION_URL`.

### Admin dashboard

The repo includes admin components in `src/components/admin/` and a dashboard page at `/dashboard`. Access control is based on the email containing the word `admin`.

To create an admin user, use:

```bash
npx tsx -r dotenv/config src/db/seeds/admin_user.ts
```

Edit that file first to set the desired admin email and password.

---

## 6. Quick reference commands

```bash
# Clone
git clone https://github.com/drajiv-stack/geetato-web1.git
cd geetato-web1

# Install
npm install

# Local setup
cp .env.example .env.local
npm run db:push
npm run seed
npm run dev

# Production database setup (set env vars first)
npx drizzle-kit push
npx tsx -r dotenv/config src/db/seeds/products_user_list.ts
```

---

## 7. Support checklist

If something is not working:

- [ ] `npm install` completed without errors
- [ ] `.env.local` exists with correct `TURSO_CONNECTION_URL`
- [ ] `npm run db:push` ran successfully
- [ ] `npm run seed` ran successfully
- [ ] Dev server is running on `http://localhost:3000`
- [ ] Vercel environment variables match the Turso credentials exactly
- [ ] Turso database is on a plan that allows reads/writes

---

## Contact / help

For issues specific to this codebase, check:
- `VERCEL_DEPLOY.md` — focused Vercel deployment notes
- `README.md` — generic Next.js project info

For Vercel issues: https://vercel.com/docs
For Turso issues: https://docs.turso.tech
