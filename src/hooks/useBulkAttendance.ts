
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { markAttendance } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useBulkAttendance = (selectedDate: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: async (attendanceData: { studentId: number, status: string }[]) => {
      setIsSubmitting(true);
      
      // Process attendance submissions sequentially
      const results = [];
      for (const entry of attendanceData) {
        const result = await markAttendance({
          student_id: entry.studentId,
          date: selectedDate,
          status: entry.status
        });
        results.push(result);
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast({
        title: "Attendance saved successfully",
        variant: "default",
      });
      setIsSubmitting(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to save attendance: ${error.message}`,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  const submitBulkAttendance = (attendanceData: { studentId: number, status: string }[]) => {
    mutation.mutate(attendanceData);
  };

  return {
    submitBulkAttendance,
    isSubmitting: isSubmitting || mutation.isPending
  };
};
