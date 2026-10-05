# ShelfLife web app

Run `npm install`, copy `.env.example` to `.env`, and use `npm run dev`. `npm run build` type-checks and creates the production bundle; `npm run lint` checks the source.

Set `VITE_API_URL` to the API base URL. Set `VITE_USE_MOCK=true` to run a fully interactive in-memory demo without MongoDB; it accepts `librarian@shelflife.test` / `Passw0rd!`.

Routes: `/login`, catalog `/`, `/issue`, `/members`, and `/members/:id/history`. The application keeps API functions, models, authentication context, generic common components, and page workflows separate. See `../docs/state-management-note.md` for the state-management rationale.
