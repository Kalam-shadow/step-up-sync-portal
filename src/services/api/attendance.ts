
import { API_BASE_URL, handleResponse } from './base';
import { Attendance } from '@/types';

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
