import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrainers as fetchTrainers, createTrainer as addTrainer, updateTrainer as editTrainer, deleteTrainer } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react";

const TrainersPage = () => {
  const [trainers, setTrainers] = useState([]);
  const [newTrainer, setNewTrainer] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
  });
  const [editTrainerId, setEditTrainerId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
  });

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["trainers"],
    queryFn: fetchTrainers,
  });

  useEffect(() => {
    if (data) {
      setTrainers(data);
    }
  }, [data]);

  const createTrainerMutation = useMutation(addTrainer, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast({
        title: "Success",
        description: "Trainer created successfully",
        variant: "default",
      });
      setNewTrainer({ name: "", email: "", phone: "", expertise: "" }); // Reset form
    },
    onError: (error) => {
      console.error("Error creating trainer:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create trainer",
        variant: "destructive",
      });
    },
  });

  const updateTrainerMutation = useMutation(editTrainer, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast({
        title: "Success",
        description: "Trainer updated successfully",
        variant: "default",
      });
      setEditTrainerId(null); // Exit edit mode
      setEditFormData({ name: "", email: "", phone: "", expertise: "" }); // Reset form
    },
    onError: (error) => {
      console.error("Error updating trainer:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update trainer",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e) => {
    setNewTrainer({ ...newTrainer, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleCreateTrainer = async () => {
    createTrainerMutation.mutate(newTrainer);
  };

  const handleEditTrainer = (trainer) => {
    setEditTrainerId(trainer.id);
    setEditFormData({ ...trainer });
  };

  const handleUpdateTrainer = async () => {
    updateTrainerMutation.mutate(editFormData);
  };

  const handleDeleteTrainer = async (id: number) => {
    try {
      await deleteTrainer(id);
      setTrainers(prevTrainers => prevTrainers.filter(trainer => trainer.id !== id));
      toast({
        title: "Success",
        description: "Trainer deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting trainer:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete trainer",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trainers Management</h1>

      {/* Create Trainer Form */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Trainer</CardTitle>
          <CardDescription>Add a new trainer to the system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" value={newTrainer.name} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" value={newTrainer.email} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" id="phone" name="phone" value={newTrainer.phone} onChange={handleInputChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expertise">Expertise</Label>
            <Input type="text" id="expertise" name="expertise" value={newTrainer.expertise} onChange={handleInputChange} />
          </div>
          <Button onClick={handleCreateTrainer} disabled={createTrainerMutation.isLoading}>
            {createTrainerMutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Trainer"}
          </Button>
        </CardContent>
      </Card>

      {/* Trainers List */}
      <Table>
        <TableCaption>A list of all trainers in your account.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainers.map((trainer) => (
            <TableRow key={trainer.id}>
              <TableCell className="font-medium">{trainer.id}</TableCell>
              <TableCell>
                {editTrainerId === trainer.id ? (
                  <Input type="text" name="name" value={editFormData.name} onChange={handleEditInputChange} />
                ) : (
                  trainer.name
                )}
              </TableCell>
              <TableCell>
                {editTrainerId === trainer.id ? (
                  <Input type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} />
                ) : (
                  trainer.email
                )}
              </TableCell>
              <TableCell>
                {editTrainerId === trainer.id ? (
                  <Input type="tel" name="phone" value={editFormData.phone} onChange={handleEditInputChange} />
                ) : (
                  trainer.phone
                )}
              </TableCell>
              <TableCell>
                {editTrainerId === trainer.id ? (
                  <Input type="text" name="expertise" value={editFormData.expertise} onChange={handleEditInputChange} />
                ) : (
                  trainer.expertise
                )}
              </TableCell>
              <TableCell className="text-right">
                {editTrainerId === trainer.id ? (
                  <>
                    <Button variant="secondary" size="sm" onClick={handleUpdateTrainer} disabled={updateTrainerMutation.isLoading}>
                      {updateTrainerMutation.isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditTrainerId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleEditTrainer(trainer)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteTrainer(trainer.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TrainersPage;
