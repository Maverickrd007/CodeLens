# CodeLens Product Requirements Document (PRD)

## 1. Product Overview
**CodeLens** is an AI-powered repository analysis and exploration tool. It enables developers to seamlessly ingest entire codebases (either via local upload or GitHub URL) and interact with an AI assistant to understand, debug, and query the architecture and logic of the code.

## 2. Target Audience
- Software Engineers onboarding onto new projects.
- Technical Leads reviewing architectural patterns.
- Developers looking to quickly debug or understand legacy codebases.

## 3. Key Features
### 3.1 Authentication & Authorization
- **Email/Password Login**: Users can register and authenticate using standard email and password credentials.
- **Google OAuth Login**: Users can sign in seamlessly using their Google accounts.
- **JWT Session Management**: Secure access and refresh token rotation.

### 3.2 Codebase Ingestion
- **Local Upload**: Users can upload a zipped codebase or select multiple files from their local machine.
- **GitHub Ingestion**: Users can provide a public GitHub repository URL to be automatically fetched and processed.

### 3.3 AI Chat & Context
- **Chat Interface**: An interactive messaging interface to ask the AI questions.
- **Context Awareness**: The AI answers questions using the specific codebase that the user has selected.
- **File-Level Focus**: Users can select specific files from a file tree explorer to focus the AI's attention on a specific component or function.

### 3.4 Dashboard & History
- **Recent Sessions**: Users can view and resume past chat sessions.
- **Recent Codebases**: Users can quickly access previously analyzed codebases.

## 4. Non-Functional Requirements
- **Performance**: Codebase ingestion for standard repositories should complete within a few seconds.
- **Reliability**: The system must elegantly handle rate limits (e.g., GitHub API) and transient AI provider errors.
- **Security**: Uploaded code and tokens must be stored securely. Only authenticated users can access their uploaded codebases and chat sessions.

## 5. Future Roadmap
- Support for private GitHub repositories via OAuth integration.
- Multi-user collaboration on the same codebase session.
- AI-driven automated code review and refactoring suggestions.
