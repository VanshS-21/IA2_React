# State management choice

ShelfLife uses local component state for server data and forms, plus one React Context for authentication. Each page owns the data it displays through the small generic `useAsync` hook, so the catalog owns its filters and page, the issue screen owns its selected member and book, and member history owns its return action. Those values are not needed across distant screens, so introducing a global store would add indirection without a real sharing benefit.

`AuthContext` holds the token and librarian identity because those are genuinely global, change rarely, and are needed by route protection and the navigation shell. The initial value is read synchronously from local storage, preventing a flash redirect at startup.

Redux and Zustand were rejected as overkill for five screens. TanStack Query/React Query was considered as the natural next step if cache sharing, background refetching, mutation invalidation, or offline behavior become important. `useAsync` deliberately returns data, loading, error, and reload in a familiar shape to make that migration straightforward. The trade-off today is simple: navigation back to a page refetches its data instead of reading a client cache.
