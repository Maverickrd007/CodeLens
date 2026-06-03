const AUTH_STORAGE_KEY = 'codelens.auth';

export function getStoredAuth() {
  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
