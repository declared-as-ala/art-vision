# Deploying Art Vision to Vercel (production)

The app uses **Turso (libSQL)** for the database and **Vercel Blob** for uploaded
files. Locally nothing changes — it still uses the `dev.db` SQLite file and
`public/uploads`. The same code switches to the hosted services in production
based on environment variables.

---

## 1. Create the database (Turso)

```bash
# Install the CLI: https://docs.turso.tech/cli/installation
turso auth login
turso db create art-vision
turso db show art-vision --url          # -> TURSO_DATABASE_URL  (libsql://...)
turso db tokens create art-vision       # -> TURSO_AUTH_TOKEN
```

## 2. Create the file storage (Vercel Blob)

In the Vercel dashboard → your project → **Storage → Create → Blob**, then link
it to the project. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically.

## 3. Set environment variables (Vercel → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://art-vision-<org>.turso.io` |
| `TURSO_AUTH_TOKEN` | the token from step 1 |
| `JWT_SECRET` | a long random string (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_APP_URL` | your production domain, e.g. `https://art-visions.fr` |
| `BLOB_READ_WRITE_TOKEN` | added automatically when you link the Blob store |
| `AI_API_KEY` *(optional)* | enables AI for the slogan/bio/caption tools |

## 4. Deploy

Push to the connected Git repo (or `vercel --prod`). The build runs:

```
prisma generate  →  tsx scripts/db-deploy.ts  →  next build
```

`db-deploy`:
1. **Provisions the Turso schema** (creates any missing tables/indexes).
2. **Seeds initial content only if the database is empty** (first deploy).
   On later deploys it detects existing data and **skips seeding**, so your
   admin edits are never overwritten.

After the first deploy, log in at `/admin/login` (default seed user
`admin@artvision.fr` / `admin123` — **change the password immediately**).

---

## Updating the schema later

`db-deploy` creates missing tables but does **not** ALTER existing ones. After
changing `prisma/schema.prisma` and deploying, apply column changes once against
Turso. The simplest way:

```bash
# point your shell at the production DB, then push the schema
turso db shell art-vision < <(npx prisma migrate diff \
  --from-url "$TURSO_DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --script)
```

(or use `turso db shell art-vision` and paste the ALTER statements.)

## Re-seeding manually (optional)

To (re)load the starter content against any DB:

```bash
# with TURSO_* env set in your shell to target production, or unset for local:
npm run db:seed:all
```

> ⚠️ Re-seeding upserts services/blog content and **will overwrite** matching
> rows. Only do this intentionally.

---

## Local development is unchanged

```bash
npm install
npm run dev          # uses file:./dev.db and public/uploads
```

No Turso/Blob needed locally.
