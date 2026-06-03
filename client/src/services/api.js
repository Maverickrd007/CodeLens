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

export async function login(credentials) {
  return postJson('/auth/login', credentials);
}

export async function register(details) {
  return postJson('/auth/register', details);
}
