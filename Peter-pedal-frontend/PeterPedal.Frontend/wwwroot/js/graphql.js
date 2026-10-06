import { API_BASE_URL } from './config.js';

// GraphQL is just an HTTP POST with { query, variables }.
// Errors come back with HTTP 200 in an "errors" array, so we check for them ourselves.
export async function gql(query, variables = {}) {
  const response = await fetch(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors.map((e) => e.message).join(' '));
  }
  return result.data;
}
