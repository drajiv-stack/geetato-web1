# Deploying Geetato Web to Vercel

This guide covers how to move from local development to a live Vercel deployment.

## Quick answer: will the current repo work on Vercel?

**Not directly.** The current setup uses a local SQLite file (`local.db`) for development. Vercel's serverless functions cannot read or write a persistent local file database, so you must switch back to a remote Turso database for production.

## What the Geetato team needs to do

### 1. Set up / restore the Turso database

The original Turso credentials are backed up in `.env.turso.backup` (gitignored, kept locally). The database those credentials point to is currently blocked because the plan limits reads:

> `SQL read operations are forbidden (reads are blocked, do you need to upgrade your plan?)`

Options:
- **Upgrade the existing Turso plan** and reuse the database.
- **Create a new Turso database** and update the credentials.

### 2. Push the schema and seed data to Turso

Once you have working Turso credentials, run:

```bash
# Set production credentials temporarily
export TURSO_CONNECTION_URL="libsql://...turso.io"
export TURSO_AUTH_TOKEN="..."

# Push the Drizzle schema
npx drizzle-kit push

# Seed products and admin user
npx tsx -r dotenv/config src/db/seeds/products_user_list.ts
npx tsx -r dotenv/config src/db/seeds/admin_user.ts
```

> Do **not** commit the real credentials. They belong only in Vercel's environment variables.

### 3. Configure Vercel environment variables

In the Vercel project dashboard, add these **Production** environment variables:

| Name | Value |
|------|-------|
| `TURSO_CONNECTION_URL` | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | Your Turso auth token |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` (or custom domain) |

Also add the same values to **Preview** and **Development** environments if you want preview deploys to work.

### 4. Deploy on Vercel

1. Import the GitHub repo in the Vercel dashboard.
2. Use the default Next.js framework preset.
3. Set the root directory to the repo root (`/`).
4. Add the environment variables from step 3.
5. Deploy.

### 5. Notes for the team

- `package.json` already includes `drizzle-kit` for schema pushes.
- The app now fetches product images from the `products.image_url` column instead of calling `/api/product-images` for every product. This is much faster and avoids extra DB round-trips.
- `next.config.ts` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true`, so TypeScript/ESLint issues won't block the build. You may want to clean those up later.
- There are both `bun.lock` and `package-lock.json` in the repo. Vercel defaults to `npm install` when `package-lock.json` exists, which is fine. If you prefer Bun, delete `package-lock.json` and configure `bun install` in Vercel.

## Local development (for reference)

For team members running the project locally:

```bash
cd geetato-web
npm install

# Create/recreate local SQLite DB
npm run db:push

# Seed products
npm run seed

# Start dev server
npm run dev
```

The local server will run at http://localhost:3000.
