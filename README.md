# ShelfLife

A library circulation platform built for the ShelfLife assessment. It includes an Express/MongoDB API, a React/TypeScript client, automated concurrency tests, and a scale design write-up.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Run `npm run install:all`.
3. Run `npm run seed --prefix backend`.
4. In two terminals run `npm run dev:backend` and `npm run dev:frontend`.

The frontend is available at `http://localhost:5173`. Use `librarian@shelflife.test` / `Passw0rd!`.

See the package READMEs for API and client detail, and `docs/` for the system-design submission.
