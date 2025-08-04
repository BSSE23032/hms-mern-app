import { getItemWithExpiry } from "./localStorageWithExpiry";

export default async function authFetch(url, options = {}) {
  const token = getItemWithExpiry('token');
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': options.headers?.['Content-Type'] || 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    alert('Session expired, please log in again');
    localStorage.clear();
    window.location.href = '/signin';
  }

  return response;
}
