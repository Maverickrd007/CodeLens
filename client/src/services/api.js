const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'Request failed.');
  }

  return payload;
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return parseResponse(response);
}

async function authorizedRequest(path, { token, method = 'GET', body, headers = {} }) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body,
  });

  return parseResponse(response);
}

export async function login(credentials) {
  return postJson('/auth/login', credentials);
}

export async function googleLogin(token) {
  return postJson('/auth/google', { token });
}

export async function register(details) {
  return postJson('/auth/register', details);
}

export async function uploadCodebase({ token, archive, files }) {
  const formData = new FormData();

  if (archive) {
    formData.append('archive', archive);
  } else {
    files.forEach((file) => {
      formData.append('files', file, file.webkitRelativePath || file.name);
    });
  }

  return authorizedRequest('/codebases/upload', {
    token,
    method: 'POST',
    body: formData,
  });
}

export async function ingestGithubCodebase({ token, repositoryUrl }) {
  return authorizedRequest('/codebases/github', {
    token,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ repositoryUrl }),
  });
}

export async function askCodebase({ token, task, question, codebase, selectedFilePath }) {
  return authorizedRequest('/ai/ask', {
    token,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task,
      question,
      codebase,
      selectedFilePath,
    }),
  });
}

export async function fetchSessions({ token }) {
  return authorizedRequest('/sessions', { token });
}

export async function createSession({ token, title }) {
  return authorizedRequest('/sessions', {
    token,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export async function fetchSession({ token, sessionId }) {
  return authorizedRequest(`/sessions/${sessionId}`, { token });
}

export async function updateSession({ token, sessionId, title }) {
  return authorizedRequest(`/sessions/${sessionId}`, {
    token,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export async function deleteSession({ token, sessionId }) {
  return authorizedRequest(`/sessions/${sessionId}`, {
    token,
    method: 'DELETE',
  });
}

export async function addMessageToSession({ token, sessionId, message }) {
  return authorizedRequest(`/sessions/${sessionId}/messages`, {
    token,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}
