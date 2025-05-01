
import { API_BASE_URL, handleResponse } from './base';
import { Student } from '@/types';

// Students
export const getStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching students: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API did not return an array for students", data);
      return [];
    }
    
    return data.map((student: any) => ({
      id: student.StudentID,
      name: student.Name,
      age: student.Age,
      contactInfo: student.ContactInfo,
      joiningDate: student.JoiningDate,
      emergencyContact: student.EmergencyContact,
      batchId: student.BatchID,
    }));
  } catch (error) {
    console.error("Error in getStudents:", error);
    return [];
  }
};

export const registerStudent = async (studentData: {
  name: string;
  age: number;
  contact_info?: string;
  contactInfo?: string;
  emergency_contact?: string;
  emergencyContact?: string;
  batch_id: number;
}) => {
  // Transform the data to ensure correct field names for the API
  const apiData = {
    name: studentData.name,
    age: studentData.age,
    contact_info: studentData.contact_info || studentData.contactInfo || "",
    emergency_contact: studentData.emergency_contact || studentData.emergencyContact || "",
    batch_id: studentData.batch_id
  };

  const response = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiData),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateStudent = async (studentId: number, studentData: {
  name: string;
  age: number;
  contact_info?: string;
  emergency_contact?: string;
  batch_id: number;
}): Promise<void> => {
  const apiData = {
    name: studentData.name,
    age: studentData.age,
    contact_info: studentData.contact_info || "",
    emergency_contact: studentData.emergency_contact || "",
    batch_id: studentData.batch_id,
  };

  const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiData),
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
};
