# AI Summit Mapper

A session browser and exhibitor directory for the India AI Impact Summit 2026. Built to make it easier to find sessions, filter by date/venue/topic, and look up exhibitor booth locations.

## Stack

- Next.js 16 with App Router
- React 19
- Tailwind CSS 4
- shadcn/ui + Radix UI + Base UI
- Phosphor Icons
- TypeScript

## Setup

```bash
bun install
bun run dev
```

Open http://localhost:3000.

## Features

- Browse all summit sessions with filters for date, venue, time slot, and tags
- Search sessions by title or speaker name
- View exhibitor listings with booth and hall numbers
- Filter exhibitors by category (startups, government, academia, corporate, etc.)
- Past/upcoming session awareness

## Data

Session and exhibitor data lives in `/data/` as JSON files scraped from the official summit site. The types backing this data are in `/lib/types.ts`.

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run start` | Serve production build |
| `bun lint` | Run Oxlint |
