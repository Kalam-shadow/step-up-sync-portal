import { Attendance, Batch, Payment, Student, Trainer } from "@/types";

const API_BASE_URL = 'http://localhost:5000/api';

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
  return response.json();
};

// Trainers
export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await fetch(`${API_BASE_URL}/trainers`, {
    credentials: 'include', // Include cookies for authentication
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
  });
  return response.json();
};

// Batches
export const getBatches = async (): Promise<Batch[]> => {
  const response = await fetch(`${API_BASE_URL}/batches`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Error fetching batches: ${response.status}`);
  }

  const data = await response.json();
  return data.map((batch: any) => ({
    id: batch.BatchID,
    name: batch.BatchName,
    danceStyle: batch.DanceStyle,
    ageGroup: batch.AgeGroup,
    schedule: batch.Schedule,
    duration: batch.Duration,
    level: batch.Level,
    fee: batch.Fee,
  }));
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
  });
  return response.json();
};

// Students
export const getStudents = async (): Promise<Student[]> => {
  const response = await fetch(`${API_BASE_URL}/students`, {
    credentials: 'include', // Include cookies for authentication
  });

  if (!response.ok) {
    throw new Error(`Error fetching students: ${response.status}`);
  }

  const data = await response.json();
  return data.map((student: any) => ({
    id: student.StudentID,
    name: student.Name,
    age: student.Age,
    contactInfo: student.ContactInfo,
    joiningDate: student.JoiningDate,
    emergencyContact: student.EmergencyContact,
    batchId: student.BatchID,
  }));
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

// Attendance
export const getAttendance = async (batchId: number, date?: string): Promise<Attendance[]> => {
  if (!batchId) {
    throw new Error("Batch ID is required to fetch attendance.");
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
  return data.map((record: any) => ({
    id: record.AttendanceID,
    studentName: record.StudentName,
    batchId: record.BatchID,
    attendanceDate: record.AttendanceDate,
    status: record.Status,
  }));
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
  });
  return response.json();
};

// Payments
export const getPayments = async (): Promise<Payment[]> => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Error fetching payments: ${response.status}`);
  }

  const data = await response.json();
  return data.map((payment: any) => ({
    id: payment.PaymentID,
    studentName: payment.StudentName,
    amount: payment.Amount,
    paymentDate: payment.PaymentDate,
    description: payment.Description,
    status: payment.Status,
  }));
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
  });
  return response.json();
};

// Utility function for DELETE requests
export const deleteEntity = async (endpoint: string, id: number) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};
