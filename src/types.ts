
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

export interface BulkAttendanceEntry {
  studentId: number;
  status: string;
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

// Additional types for form submissions
export interface TrainerFormData {
  name: string;
  specialization: string;
  contactInfo: string;
  bio: string;
  joiningDate: string;
}

// New interfaces for Event Management
export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  clientName: string;
  clientContact: string;
  status: string; // "Upcoming", "Completed", "Cancelled"
  fee: number;
  eventType: string; // "Wedding", "Corporate", "Competition", etc.
}

export interface EventStaff {
  id: number;
  eventId: number;
  trainerId: number;
  trainerName: string;
  role: string; // "Lead", "Support", "Choreographer", etc.
  confirmed: boolean;
}

export interface EventFormData {
  eventname: string;
  eventdate: string;
  location: string;
  description: string;
  clientName: string;
  clientContact: string;
  status: string;
  fee: number;
  eventType: string;
}
