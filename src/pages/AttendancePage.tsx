
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Attendance, Student } from "@/types";
import { getAttendance, getStudents, markAttendance } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { format } from "date-fns";
import { useBatches } from "@/hooks/useBatches";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Check, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const AttendancePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Format today's date for API
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Use react-hook-form
  const form = useForm({
    defaultValues: {
      studentId: 0,
      date: formattedDate,
      status: "Present",
    },
  });

  // Get all batches for dropdown
  const { data: batches = [] } = useBatches();

  // Get all students for dropdown
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // Get attendance records
  const {
    data: attendance = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["attendance", selectedBatchId, formattedDate],
    queryFn: () => getAttendance(selectedBatchId as number, formattedDate),
    enabled: !!selectedBatchId,
  });

  // Mark attendance mutation
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return markAttendance({
        student_id: data.studentId,
        date: data.date,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", selectedBatchId, formattedDate] });
      toast({
        title: "Attendance marked successfully",
        variant: "default",
      });
      setIsAddDialogOpen(false);
      form.reset({
        studentId: 0,
        date: formattedDate,
        status: "Present",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark attendance: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!data.studentId) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  });

  // Filter students by selected batch
  const filteredStudents = students.filter(student => 
    selectedBatchId ? student.batchId === selectedBatchId : true
  );

  // Get attendance status for a student
  const getAttendanceStatus = (studentId: number): string => {
    const record = attendance.find(a => a.studentId === studentId);
    return record ? record.status : "Not Marked";
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
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (selectedBatchId && date) {
                    refetch();
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2 mt-6"
              disabled={!selectedBatchId}
            >
              <Plus size={16} />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark Student Attendance</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={field.value || ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          <option value="">Select a student</option>
                          {filteredStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? field.value : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate || undefined}
                              onSelect={(date) => {
                                const formattedSelectedDate = date ? format(date, 'yyyy-MM-dd') : '';
                                field.onChange(formattedSelectedDate);
                                setSelectedDate(date);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          {...field}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Attendance
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}
      {isError && <div className="p-8 text-red-500">Error loading attendance records!</div>}
      
      {selectedBatchId && !isLoading && (
        <div className="rounded-md border mt-6">
          <div className="bg-muted/50 p-4">
            <h3 className="text-lg font-medium">
              Attendance for {batches.find(b => b.id === selectedBatchId)?.name || 'Selected Batch'} 
              {selectedDate && ` on ${format(selectedDate, 'MMM dd, yyyy')}`}
            </h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">No students in this batch</TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAttendanceStatus(student.id) === "Present" && (
                          <div className="flex items-center text-green-600">
                            <Check size={18} className="mr-1" /> Present
                          </div>
                        )}
                        {getAttendanceStatus(student.id) === "Absent" && (
                          <div className="text-red-600">Absent</div>
                        )}
                        {getAttendanceStatus(student.id) === "Late" && (
                          <div className="text-amber-600">Late</div>
                        )}
                        {getAttendanceStatus(student.id) === "Not Marked" && (
                          <div className="text-gray-400">Not marked</div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
