const API = 'http://localhost:4000/api';

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}
export default apiFetch;
