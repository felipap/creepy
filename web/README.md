# tracker/web

A server that collects tracking locations from the mobile app.

## Development

This is a simple Next.js app.

```bash
pnpm install
pnpm run dev
```

The app will be available at `http://localhost:3000`.

### Authentication

The app requires authentication to access the protected locations page. Create a `.env.local` file in the `web/` directory with:

```
WEBSITE_SECRET=your-secure-password-here
```

Replace `your-secure-password-here` with your desired password. This password will be required to access the `/protected` page.

### Database

The app uses Drizzle:

```
pnpm drizzle-kit push
pnpm drizzle-kit generate:pg
```

## Deployment

You can deploy this entire repo to Vercel.

For deployment, make sure to set the `WEBSITE_SECRET` environment variable in your Vercel project settings.
