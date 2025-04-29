import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student } from "@/types";
import { getStudents, registerStudent, deleteEntity } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useBatches } from "@/hooks/useBatches";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

const StudentsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      age: 0,
      contactInfo: "",
      emergencyContact: "",
      batchId: 1,
    },
  });

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setEditingStudent(null);
    }
    setIsAddDialogOpen(open);
  };

  // Prefill form when editing
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    form.setValue("name", student.name);
    form.setValue("age", student.age);
    form.setValue("contactInfo", student.contactInfo);
    form.setValue("emergencyContact", student.emergencyContact);
    form.setValue("batchId", student.batchId);
    setIsAddDialogOpen(true);
  };

  // Get all students
  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  // Get batches for dropdown
  const { data: batches = [] } = useBatches();

  // Add/update student mutation
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return registerStudent({
        name: data.name,
        age: Number(data.age),
        contactInfo: data.contactInfo,
        emergencyContact: data.emergencyContact,
        batch_id: Number(data.batchId)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: `Student ${editingStudent ? "updated" : "added"} successfully`,
        variant: "default",
      });
      setIsAddDialogOpen(false);
      form.reset();
      setEditingStudent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingStudent ? "update" : "add"} student: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEntity("students", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Student deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete student: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (isError) return <div className="p-8 text-red-500">Error loading students!</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Students</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit" : "Add"} Student</DialogTitle>
              <DialogDescription>
                {editingStudent ? "Update student details" : "Enter student information below"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} max={80} placeholder="Age" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone or Email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Emergency contact" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="batchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        >
                          {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {batch.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingStudent ? "Update" : "Add"} Student
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Emergency Contact</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No students found</TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{student.contactInfo}</TableCell>
                  <TableCell>{student.emergencyContact}</TableCell>
                  <TableCell>{student.joiningDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => deleteMutation.mutate(student.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentsPage;
