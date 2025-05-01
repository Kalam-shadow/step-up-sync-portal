import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Batch, Trainer } from "@/types"; // Ensure Trainer type is defined
import { getBatches, createBatch, deleteEntity, updateBatch, getTrainers } from "@/services/api";
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
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";

const BatchesPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Use react-hook-form
  const form = useForm({
    defaultValues: {
      name: "",
      danceStyle: "",
      ageGroup: "",
      schedule: "",
      duration: 60,
      level: "Beginner",
      fee: 0,
      trainerID: 0, // Use trainerName instead of trainerId
    },
  });

  // Fetch trainers for the dropdown
  const {
    data: trainers = [],
    isLoading: isTrainersLoading,
    isError: isTrainersError,
  } = useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers,
  });

  // Reset form when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setEditingBatch(null);
    }
    setIsAddDialogOpen(open);
  };

  // Prefill form when editing
  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    form.setValue("name", batch.name);
    form.setValue("danceStyle", batch.danceStyle);
    form.setValue("ageGroup", batch.ageGroup);
    form.setValue("schedule", batch.schedule);
    form.setValue("duration", batch.duration);
    form.setValue("level", batch.level);
    form.setValue("fee", batch.fee);
    form.setValue("trainerID", batch.trainerID); // Prefill trainerName
    setIsAddDialogOpen(true);
  };

  // Get all batches
  const {
    data: batches = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["batches"],
    queryFn: getBatches,
  });

  // Add/update batch mutation
  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (editingBatch) {
        // Call updateBatch if editingBatch is set
        return updateBatch(editingBatch.id, {
          name: data.name,
          danceStyle: data.danceStyle,
          ageGroup: data.ageGroup,
          schedule: data.schedule,
          duration: data.duration,
          level: data.level,
          fee: data.fee,
          trainerID: data.trainerID, // Use trainerName
        });
      } else {
        // Call createBatch if adding a new batch
        return createBatch({
          name: data.name,
          danceStyle: data.danceStyle,
          ageGroup: data.ageGroup, 
          schedule: data.schedule,
          duration: data.duration,
          level: data.level,
          fee: data.fee,
          trainerID: data.trainerID, // Use trainerName
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast({
        title: `Batch ${editingBatch ? "updated" : "added"} successfully`,
        variant: "default",
      });
      setIsAddDialogOpen(false);
      form.reset();
      setEditingBatch(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingBatch ? "update" : "add"} batch: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete batch mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEntity("batches", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      toast({
        title: "Batch deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete batch: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  if (isLoading || isTrainersLoading)
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (isError || isTrainersError)
    return <div className="p-8 text-red-500">Error loading data!</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Batches</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingBatch ? "Edit" : "Add"} Batch</DialogTitle>
              <DialogDescription>
                {editingBatch ? "Update batch details" : "Enter batch information below"}
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
                        <Input placeholder="Morning Batch" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="danceStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dance Style</FormLabel>
                      <FormControl>
                        <Input placeholder="Hip Hop, Ballet, etc." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Group</FormLabel>
                      <FormControl>
                        <Input placeholder="Kids, Adults, Teens" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon-Wed 6-7 PM" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={30} 
                            max={180} 
                            step={15} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fee ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            step={10} 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          {...field}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trainerID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trainer</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          {...field}
                        >
                          <option value="">Select Trainer</option>
                          {trainers.map((trainer: Trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                              {trainer.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingBatch ? "Update" : "Add"} Batch
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
              <TableHead>Dance Style</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Fee ($)</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No batches found</TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.danceStyle}</TableCell>
                  <TableCell>{batch.ageGroup}</TableCell>
                  <TableCell>{batch.schedule}</TableCell>
                  <TableCell>{batch.level}</TableCell>
                  <TableCell>${batch.fee}</TableCell>
                  <TableCell>{batch.trainerName || "None"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditBatch(batch)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => deleteMutation.mutate(batch.id)}
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

export default BatchesPage;
