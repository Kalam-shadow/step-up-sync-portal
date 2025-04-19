
const API_BASE_URL = 'http://localhost:5000/api';

export const loginAdmin = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  return response.json();
};

export const getTrainers = async () => {
  const response = await fetch(`${API_BASE_URL}/trainers`);
  return response.json();
};

export const getBatches = async () => {
  const response = await fetch(`${API_BASE_URL}/batches`);
  return response.json();
};

export const getStudents = async () => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    credentials: 'include',
  });
  return response.json();
};

export const registerStudent = async (studentData: {
  name: string;
  age: number;
  contact_info: string;
  emergency_contact: string;
  batch_id: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  return response.json();
};

