
const API_BASE_URL = 'http://localhost:5000/api';

// Error handling helper
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Utility function for DELETE requests
export const deleteEntity = async (endpoint: string, id: number) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

// Utility function for UPDATE requests
export const updateEntity = async (endpoint: string, id: number, data: any) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return handleResponse(response);
};

export { API_BASE_URL };
