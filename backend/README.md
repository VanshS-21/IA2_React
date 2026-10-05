# ShelfLife API

## Setup

Requires Node 18+ and MongoDB. Copy `.env.example` to `.env`, set a Mongo connection string and a long `JWT_SECRET`, then run `npm install`, `npm run seed`, and `npm run dev`. Use `npm start` for production and `npm test` for the concurrency suite.

The seed librarian is `librarian@shelflife.test` / `Passw0rd!`.

`src/models` defines persistence and indexes; `validators` owns Zod request schemas; `middleware` owns auth, request IDs, logging, validation, and response errors; `controllers` contains endpoint orchestration; and `routes` maps the public API. `scripts/seed.js` creates the demonstration data and `tests/` proves the stock invariant.

| Method | Path | Auth | Result |
|---|---|---|---|
| POST | `/api/auth/login` | No | JWT login |
| GET/POST | `/api/books` | GET public, POST JWT | Catalog/query or create |
| GET | `/api/books/genres` | No | Genres |
| GET/POST | `/api/members` | JWT | Members/query or create |
| POST | `/api/borrow` | JWT | Issue a book |
| POST | `/api/borrow/return/:borrowId` | JWT | Return a book |
| GET | `/api/members/:id/history` | JWT | Full member history |
| GET | `/api/health` | No | Liveness |

All endpoints use `{ success, data, meta? }` or `{ success: false, error }`. Common errors are 400 validation, 401 authentication, 404 missing resource, and 409 duplicate/no copies/double return. See `requests/curl.sh` and `../docs/postman/ShelfLife.postman_collection.json` for complete requests.

## Concurrency decision

Two librarians clicking issue on the last copy can both read one available copy and pass a normal `if` check. That read-then-write flow is not atomic. ShelfLife instead runs `findOneAndUpdate({ _id, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } })`, so MongoDB admits exactly one request. If the later loan record write fails, compensation restores stock. The schema’s minimum and active-loan partial unique index provide further protection. Transactions are optional on a replica set; atomic update plus compensation works on standalone MongoDB.

## Design notes

Routes delegate to small controllers; Zod validates inputs; the error handler owns the response envelope. Status is derived as overdue while reading and persisted opportunistically when history is read. In production, a cron/worker should mark overdues independently.
