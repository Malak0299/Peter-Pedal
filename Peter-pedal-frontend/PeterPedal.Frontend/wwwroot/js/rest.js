import { API_BASE_URL } from './config.js';

// Sends one HTTP request to the REST API and returns the JSON body (null for 204 No Content).
async function request(method, path, body) {
  const options = { method, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  const response = await fetch(API_BASE_URL + path, options);
  if (!response.ok) {
    // ASP.NET Core sends errors as ProblemDetails JSON: { title, status, errors? }
    const problem = await response.json().catch(() => ({}));
    const messages = problem.errors ? Object.values(problem.errors).flat() : [problem.title];
    throw new Error(messages.join(' ') || `${response.status} ${response.statusText}`);
  }
  return response.status === 204 ? null : response.json();
}

export const get = (path) => request('GET', path);
export const post = (path, body) => request('POST', path, body);
export const put = (path, body) => request('PUT', path, body);
export const del = (path) => request('DELETE', path);
