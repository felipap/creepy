# tracker/web

A server that collects tracking locations from the mobile app.

## Development

This is a simple Next.js app.

```bash
pnpm install
pnpm run dev
```

The app will be available at `http://localhost:3000`.

### Database

The app uses Drizzle:

```
pnpm drizzle-kit push
pnpm drizzle-kit generate:pg
```

## Deployment

You can deploy this entire repo to Vercel.
