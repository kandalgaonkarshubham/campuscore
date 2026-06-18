# Campuscore

Student management app — login, CRUD, photo uploads, search/filter, dashboard charts, activity log.

Monorepo: `client/` (React + Vite) and `server/` (Express + Drizzle + Postgres).

## Setup

Needs Node 20+, pnpm, and Postgres running locally.

```bash
pnpm --filter server install
pnpm --filter client install

cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with your database URL. Then:

```bash
cd server
pnpm db:migrate
pnpm db:seed
```

From the repo root:

```bash
pnpm dev
```

- App: http://localhost:5173
- API: http://localhost:5000/api
- Login: `admin` / `admin123` (from seed)

## Env vars

**Server** (`server/.env`):

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Signing secret |
| `COOKIE_NAME` | Default `campuscore_token` |
| `CLIENT_URL` | Frontend origin for CORS |
| `UPLOAD_STORAGE` | `local` (dev) or `vercel-blob` (prod) |
| `BLOB_READ_WRITE_TOKEN` | Required when using vercel-blob |

See `server/.env.example` for the full list.

**Client** (`client/.env`):

| Variable | Notes |
|----------|-------|
| `VITE_API_URL` | e.g. `http://localhost:5000/api` |

## API

Protected routes need the JWT cookie from `POST /api/auth/login`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/students` | List (`page`, `limit`, `search`, `course`, `year`, `gender`) |
| GET | `/api/students/meta` | Filter options |
| POST | `/api/students` | Create (JSON or multipart with `photo`) |
| GET | `/api/students/:id` | Get one |
| PUT | `/api/students/:id` | Update |
| DELETE | `/api/students/:id` | Delete |
| GET | `/api/analytics/overview` | Dashboard stats |
| GET | `/api/activity-logs` | Audit log (`page`, `limit`) |

Photos in dev are served from `/uploads/*` when `UPLOAD_STORAGE=local`.

## Deploying on Vercel

Deploy `client/` and `server/` as two projects.

**Frontend:** root `client`, build `pnpm build`, output `dist`. Set `VITE_API_URL` to your API URL.

**Backend:** root `server`, uses `api/index.ts`. Point `DATABASE_URL` at hosted Postgres, run migrations before first deploy. Set `CLIENT_URL` to the frontend URL.

For photo uploads in production, set `UPLOAD_STORAGE=vercel-blob`, create a Blob store in the Vercel dashboard, and link it to the server project (adds `BLOB_READ_WRITE_TOKEN` automatically). Local disk uploads don't persist on serverless — that's why Blob is needed there.

## Scripts

```bash
pnpm dev                              # both apps
pnpm build                            # build both
pnpm --filter server db:migrate       # run migrations
pnpm --filter server db:seed          # seed admin user
```
