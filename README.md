# Authorship Attributor — Web UI

A Next.js frontend for building an author corpus and attributing documents of
disputed authorship. It is the companion web client to the stylometry API at
[EphemSpirit/authorship_attributor](https://github.com/EphemSpirit/authorship_attributor),
which does the actual writing-style analysis.

## What it does

1. **Manage authors** — create, view, edit, and delete authors in the database.
2. **Add a known document** — upload a document with one or more author names.
   Authors are created if they don't exist, and the document is added to the
   corpus used for attribution.
3. **Attribute a disputed document** — upload a document of unknown or disputed
   authorship and get back the 5 most likely author candidates, each with a
   confidence score.

## Status

Early scaffolding. The landing page (`app/page.tsx`) describes the intended
workflow; the author-management and upload screens are still being built.

## Getting started

Requires Node.js 18.18+ (Next.js 16).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You also need the API running. See its README for setup; by default it serves on
[http://localhost:8000](http://localhost:8000) with Swagger docs at `/docs`.

## Configuration

Point the UI at the API with an environment variable in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Scripts

| Command         | Description                        |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Run ESLint                        |

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript

## Related

- API / analysis backend: [EphemSpirit/authorship_attributor](https://github.com/EphemSpirit/authorship_attributor)
  — FastAPI + SQLAlchemy + PostgreSQL, NLTK-based stylometry. Relevant endpoints:
  - `POST /authors`, `GET /authors`
  - `GET /authors/{author_id}/style-profile`
  - `POST /documents/upload-known`
  - `POST /documents/upload-disputed`
