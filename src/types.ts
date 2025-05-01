
export interface Student {
  id: number;
  name: string;
  age: number;
  contactInfo: string;
  joiningDate: string;
  emergencyContact: string;
  batchId: number;
}

export interface Trainer {
  id: number;
  name: string;
  specialization: string;
  joiningDate: string;
  contactInfo: string;
  bio: string;
}

export interface Batch {
  id: number;
  name: string;
  danceStyle: string;
  ageGroup: string;
  schedule: string;
  duration: number;
  level: string;
  fee: number;
  trainerID: number;
  trainerName: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  studentName: string;
  batchId: number;
  attendanceDate: string;
  status: string; // "Present", "Absent", "Late"
}

export interface Payment {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  paymentDate: string;
  description: string;
  status: string; // "Paid", "Pending", "Failed"
}
