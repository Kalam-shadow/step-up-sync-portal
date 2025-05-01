
import React, { useState } from "react";
import { Student, Attendance } from "@/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface BulkAttendanceTableProps {
  students: Student[];
  date: string;
  existingAttendance: Attendance[];
  isSubmitting: boolean;
  onSubmit: (attendanceData: {studentId: number, status: string}[]) => void;
}

const BulkAttendanceTable = ({ 
  students, 
  date, 
  existingAttendance, 
  isSubmitting, 
  onSubmit 
}: BulkAttendanceTableProps) => {
  // Initialize attendance states based on existing data
  const [attendanceStates, setAttendanceStates] = useState<{[key: number]: string}>(() => {
    const initialStates: {[key: number]: string} = {};
    
    // Set initial states from existing attendance records
    students.forEach(student => {
      const record = existingAttendance.find(a => a.studentId === student.id);
      initialStates[student.id] = record?.status || "Absent";
    });
    
    return initialStates;
  });

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceStates(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = () => {
    const attendanceData = students.map(student => ({
      studentId: student.id,
      status: attendanceStates[student.id] || "Absent"
    }));
    
    onSubmit(attendanceData);
  };

  const formattedDate = date ? format(new Date(date), 'MMMM dd, yyyy') : '';

  if (students.length === 0) {
    return <p className="text-center py-4">No students found in this batch.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attendance for {formattedDate}</h3>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save All Attendance
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="text-center">Present</TableHead>
              <TableHead className="text-center">Late</TableHead>
              <TableHead className="text-center">Absent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={attendanceStates[student.id] === "Present"}
                      onCheckedChange={() => handleStatusChange(student.id, "Present")}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={attendanceStates[student.id] === "Late"}
                      onCheckedChange={() => handleStatusChange(student.id, "Late")}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Checkbox 
                      checked={attendanceStates[student.id] === "Absent"}
                      onCheckedChange={() => handleStatusChange(student.id, "Absent")}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BulkAttendanceTable;
