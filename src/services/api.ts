
import { Attendance, Batch, Payment, Student, Trainer } from "@/types";

const API_BASE_URL = 'http://localhost:5000/api';

// Error handling helper
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

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

// Trainers
export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await fetch(`${API_BASE_URL}/trainers`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Error fetching trainers: ${response.status}`);
  }

  const data = await response.json();
  return data.map((trainer: any) => ({
    id: trainer.TrainerID,
    name: trainer.Name,
    specialization: trainer.Specialization,
    joiningDate: trainer.JoiningDate,
    contactInfo: trainer.ContactInfo,
    bio: trainer.Bio,
  }));
};

export const registerTrainer = async (trainerData: {
  name: string;
  expertise: string;
  contact_info: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/trainers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trainerData),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Batches
export const getBatches = async (): Promise<Batch[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/batches`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching batches: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we always have an array
    if (!Array.isArray(data)) {
      console.error("API did not return an array for batches", data);
      return [];
    }
    
    return data.map((batch: any) => ({
      id: batch.BatchID,
      name: batch.BatchName,
      danceStyle: batch.DanceStyle || "",
      ageGroup: batch.AgeGroup || "",
      schedule: batch.Schedule || "",
      duration: batch.Duration || 60,
      level: batch.Level || "Beginner",
      fee: batch.Fee || 0,
    }));
  } catch (error) {
    console.error("Error in getBatches:", error);
    return [];
  }
};

export const createBatch = async (batchData: {
  name: string;
  schedule: string;
  trainer_id: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/batches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchData),
    credentials: 'include',
  });
  return handleResponse(response);
};

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

// Attendance
export const getAttendance = async (batchId: number, date?: string): Promise<Attendance[]> => {
  try {
    if (!batchId) {
      console.warn("Batch ID is required to fetch attendance.");
      return [];
    }

    const url = new URL(`${API_BASE_URL}/attendance`);
    url.searchParams.append("batch_id", batchId.toString());
    if (date) {
      url.searchParams.append("date", date);
    }

    const response = await fetch(url.toString(), {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching attendance: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API did not return an array for attendance", data);
      return [];
    }
    
    return data.map((record: any) => ({
      id: record.AttendanceID,
      studentId: record.StudentID,
      studentName: record.StudentName,
      batchId: record.BatchID,
      attendanceDate: record.AttendanceDate,
      status: record.Status,
    }));
  } catch (error) {
    console.error("Error in getAttendance:", error);
    return [];
  }
};

export const markAttendance = async (attendanceData: {
  student_id: number;
  date: string;
  status: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(attendanceData),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Payments
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error fetching payments: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("API did not return an array for payments", data);
      return [];
    }
    
    return data.map((payment: any) => ({
      id: payment.PaymentID,
      studentId: payment.StudentID,
      studentName: payment.StudentName,
      amount: payment.Amount,
      paymentDate: payment.PaymentDate,
      description: payment.Description,
      status: payment.Status,
    }));
  } catch (error) {
    console.error("Error in getPayments:", error);
    return [];
  }
};

export const recordPayment = async (paymentData: {
  student_id: number;
  amount: number;
  date: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
    credentials: 'include',
  });
  return handleResponse(response);
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
