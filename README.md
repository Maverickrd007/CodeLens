# CodeLens

CodeLens is an AI-powered codebase assistant that helps developers explore uploaded repositories with natural-language questions, architecture summaries, generated tests, documentation drafts, and bug suggestions.

## Current Scope

This repository is being built incrementally as a portfolio capstone using feature branches, focused commits, and pull request milestones. Phase 1 establishes the monorepo shape, shared tooling, and the first API health check.

## Tech Stack

- Frontend: React and Tailwind CSS
- Backend: Node.js and Express
- Database: MongoDB
- Auth: JWT access and refresh tokens
- File ingestion: Multer for uploads, GitHub repository ingestion, and code parsing utilities
- AI layer: OpenAI API with structured prompts

## Repository Layout

```text
codelens/
  client/   Web application
  server/   Express API
```

## Getting Started

```bash
npm install
npm run lint
npm run dev:server
```

The API starts on `http://localhost:5000` by default. Visit `GET /health` to verify the server is running.

## Development Workflow

Each feature phase is developed on its own branch and merged through a pull request. Commits stay small enough to show how the project evolved over time.
