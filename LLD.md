# CodeLens Low-Level Design (LLD)

## 1. Directory Structure

### 1.1 Backend (`/server`)
- `/src/controllers`: Handles HTTP requests (e.g., `authController.js`, `codebasesController.js`, `aiController.js`).
- `/src/middleware`: Express middlewares (e.g., `auth.js` for JWT validation).
- `/src/models`: Mongoose schemas (e.g., `User.js`, `Codebase.js`, `Session.js`).
- `/src/routes`: Express route definitions.
- `/src/services`: Core business logic and external integrations (e.g., `bedrockService.js`, `githubIngestionService.js`, `tokenService.js`).
- `/src/utils`: Helpers and error handling (e.g., `ApiError.js`).

### 1.2 Frontend (`/client`)
- `/src/components`: Reusable UI components (e.g., `FileTree.jsx`, `ChatPanel.jsx`, `UploadPanel.jsx`).
- `/src/contexts`: React Contexts (e.g., `AuthContext.jsx` for global authentication state).
- `/src/pages`: Top-level route components (e.g., `LoginPage.jsx`, `DashboardPage.jsx`).
- `/src/services`: API interaction layer (`api.js`) and token storage wrappers (`authStorage.js`).

## 2. API Contract & Logic

### 2.1 Authentication (`authController.js`)
- `POST /api/auth/register`: Hashes password using bcrypt. Saves new `User`. Issues tokens.
- `POST /api/auth/login`: Verifies password via bcrypt. Issues tokens.
- `POST /api/auth/google`: Verifies Google access token via `https://www.googleapis.com/oauth2/v3/userinfo`. Creates or finds User by email. Issues tokens.

### 2.2 Codebase Processing (`githubIngestionService.js`)
- Uses `octokit.rest.repos.downloadZipballArchive` to avoid GitHub rate limits on individual file fetches.
- Uses `unzipper` to parse the zip stream in memory.
- Ignores binary files, large files (>1MB), and common build directories (`node_modules`, `dist`, `.git`).
- Converts the flat list of files into a nested folder structure suitable for the database schema.

### 2.3 AI Processing (`bedrockService.js`)
- Exposes `createTextResponse`.
- Handles transient AWS errors and rate limits using exponential backoff with jitter (`withRetry`).
- Instantiates `@aws-sdk/client-bedrock-runtime` and sends a `ConverseCommand` to the configured model.

## 3. Database Schema

### 3.1 User (`models/User.js`)
```javascript
{
  name: String,
  email: { type: String, unique: true },
  passwordHash: { type: String, select: false }, // Optional for Google OAuth users
  refreshTokens: [{ tokenHash: String, expiresAt: Date }]
}
```

### 3.2 Codebase (`models/Codebase.js`)
```javascript
{
  owner: ObjectId(User),
  name: String,
  type: { type: String, enum: ['github', 'upload'] },
  sourceUrl: String,
  files: [{
    path: String,
    content: String,
    size: Number,
    isFolder: Boolean,
    children: [{ /* Recursive schema */ }]
  }]
}
```

### 3.3 Session (`models/Session.js`)
```javascript
{
  owner: ObjectId(User),
  title: String,
  codebase: ObjectId(Codebase)
}
```

### 3.4 Message (`models/Message.js`)
```javascript
{
  session: ObjectId(Session),
  role: { type: String, enum: ['user', 'assistant'] },
  content: String
}
```
