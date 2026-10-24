// The admin token is kept in the browser (FR-026 style persistence for the session).
const TOKEN_KEY = 'adminToken';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
