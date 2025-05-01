
import { API_BASE_URL, handleResponse } from './base';

// Authentication
export const loginAdmin = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const logoutAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(response);
};
