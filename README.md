# CodeLens

CodeLens is an AI-powered codebase assistant that lets developers upload a GitHub repository or local code folder and interact with it via natural language. Users can ask questions about the architecture, generate test cases, write documentation drafts, and identify bugs seamlessly.

https://codelens-sigma.vercel.app

## Architecture

The project follows a standard client-server monorepo architecture:

- **Client**: A React application built with Tailwind CSS, utilizing Vite for fast builds and hot reloading.
- **Server**: A Node.js API powered by Express, providing REST endpoints.
- **Database**: MongoDB for storing users, active sessions, and chat history.
- **Auth**: JWT-based authentication (access and refresh tokens).
- **AI Core**: Deep integration with the OpenAI API for chunking files, context injection, and returning structural responses based on detailed prompt templates.

## Prerequisites

- Node.js (v18+)
- MongoDB (running locally or via MongoDB Atlas)
- Git (for repository ingestion features)
- Docker & Docker Compose (optional, for local development containerization)

## Environment Variables

Both the server and client need specific environment variables to function correctly. See `.env.example` in their respective directories.

### Server (`server/.env`)
- `NODE_ENV` - `development` or `production`
- `PORT` - Port for the server (default `5000`)
- `CLIENT_ORIGIN` - CORS origin (default `http://localhost:5173`)
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Secret for signing access tokens
- `JWT_ACCESS_EXPIRES_IN` - Expiration time (e.g. `15m`)
- `OPENAI_API_KEY` - Your OpenAI API Key
- `GITHUB_TOKEN` - (Optional) Fine-grained or classic personal access token to ingest private GitHub repos

### Client (`client/.env`)
- `VITE_API_BASE_URL` - Backend API URL (default `http://localhost:5000`)

## Setup & Running Locally

1. **Install Dependencies**
   From the root folder, install dependencies for both server and client (if using a root `package.json` setup) or navigate to both directories:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Start the Development Servers**
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

3. **Using Docker Compose (Alternative)**
   If you prefer running MongoDB and the services via Docker:
   ```bash
   docker-compose up --build
   ```

## Development Workflow

This project was built incrementally across multiple branches and commits to simulate a real-world development lifecycle. See the Git commit history for detailed milestone PRs.
