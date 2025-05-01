
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttendance, getStudents } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useBatches } from "@/hooks/useBatches";
import { useBulkAttendance } from "@/hooks/useBulkAttendance";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import BulkAttendanceTable from "@/components/attendance/BulkAttendanceTable";

const AttendancePage = () => {
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Format today's date for API
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Get all batches for dropdown
  const { data: batches = [] } = useBatches();

  // Get all students for attendance table
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // Get attendance records
  const {
    data: attendance = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["attendance", selectedBatchId, formattedDate],
    queryFn: () => getAttendance(selectedBatchId as number, formattedDate),
    enabled: !!selectedBatchId && !!formattedDate,
  });

  // Use our bulk attendance hook
  const { submitBulkAttendance, isSubmitting } = useBulkAttendance(formattedDate);

  // Filter students by selected batch
  const filteredStudents = students.filter(student => 
    selectedBatchId ? student.batchId === selectedBatchId : true
  );

  const handleSubmitAttendance = (attendanceData: {studentId: number, status: string}[]) => {
    submitBulkAttendance(attendanceData);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Attendance Tracking</h2>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64 space-y-2">
          <label className="text-sm font-medium">Select Batch</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedBatchId || ""}
            onChange={(e) => setSelectedBatchId(Number(e.target.value))}
          >
            <option value="">Select a batch</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-64 space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}
      {isError && <div className="p-8 text-red-500">Error loading attendance records!</div>}
      
      {selectedBatchId && !isLoading && (
        <div className="mt-6">
          <BulkAttendanceTable 
            students={filteredStudents}
            date={formattedDate}
            existingAttendance={attendance}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmitAttendance}
          />
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
