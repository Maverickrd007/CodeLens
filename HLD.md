# CodeLens High-Level Design (HLD)

## 1. System Architecture
CodeLens is a modern web application employing a client-server architecture. 

### 1.1 Frontend (Client)
- **Framework**: React (using Vite as the build tool).
- **Styling**: Tailwind CSS for responsive and dynamic UI styling (glassmorphism design).
- **State Management**: React Context (e.g., AuthContext) and local component state.
- **Routing**: React Router DOM.
- **Hosting**: Deployed on Vercel.

### 1.2 Backend (Server)
- **Framework**: Node.js with Express.
- **Database**: MongoDB (Mongoose ORM).
- **AI Integration**: AWS Bedrock Runtime Client (using standard models like amazon.nova-lite-v1:0).
- **GitHub Integration**: Octokit REST API for downloading public repositories.
- **Hosting**: Deployed on Render.

## 2. Core Flows

### 2.1 Authentication Flow
1. User logs in via Email/Password or Google OAuth on the client.
2. Backend authenticates and issues a short-lived JWT Access Token and a hashed Refresh Token stored in MongoDB.
3. Client stores tokens securely and attaches the Access Token to API requests as a Bearer token.

### 2.2 Codebase Ingestion Flow
1. User provides a GitHub URL.
2. Frontend sends URL to `POST /codebases/github`.
3. Backend uses `octokit.rest.repos.downloadZipballArchive` to fetch the repo archive into memory.
4. Backend parses the zip, filters out unnecessary binary/build files, and persists the raw code structure in MongoDB linked to the user's account.

### 2.3 AI Chat Flow
1. User asks a question on the dashboard.
2. Frontend sends question, current codebase ID, and (optionally) specific selected files to `POST /ai/ask`.
3. Backend fetches the codebase context from MongoDB.
4. Backend constructs a robust prompt detailing the file tree and code contents.
5. Prompt is sent to AWS Bedrock.
6. Bedrock response is parsed, stored as a Message in the Session, and returned to the frontend.

## 3. Data Storage (MongoDB)
- **Users**: Stores credentials and refresh token hashes.
- **Codebases**: Stores metadata (name, type) and the full file tree structure including file contents.
- **Sessions**: Chat sessions linking a User to a specific Codebase.
- **Messages**: Individual prompts and AI responses within a Session.
