
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Event, EventFormData, Trainer } from "@/types";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { 
  createEvent, deleteEvent, getEvents, updateEvent, 
  assignStaffToEvent, getEventStaff, removeStaffFromEvent 
} from "@/services/api/events";
import { getTrainers } from "@/services/api/trainers";

const EventsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [currentEventForStaff, setCurrentEventForStaff] = useState<number | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [staffRole, setStaffRole] = useState<string>("Performer");
  
  // Initialize form state
  const emptyFormData: EventFormData = {
    eventname: "",
    eventdate: "",
    location: "",
    description: "",
    clientName: "",
    clientContact: "",
    status: "Upcoming",
    fee: 0,
    eventType: "Wedding"
  };
  
  const [formData, setFormData] = useState<EventFormData>(emptyFormData);
  
  const queryClient = useQueryClient();
  
  // Fetch events data
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });
  
  // Fetch trainers for staff assignment
  const { data: trainers = [] } = useQuery({
    queryKey: ['trainers'],
    queryFn: getTrainers
  });
  
  // Fetch staff for selected event
  const { data: eventStaff = [], refetch: refetchStaff } = useQuery({
    queryKey: ['eventStaff', currentEventForStaff],
    queryFn: () => currentEventForStaff ? getEventStaff(currentEventForStaff) : Promise.resolve([]),
    enabled: !!currentEventForStaff
  });
  
  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event created successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventFormData }) => 
      updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event updated successfully");
      setIsDialogOpen(false);
      setCurrentEvent(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Assign staff mutation
  const assignStaffMutation = useMutation({
    mutationFn: ({ eventId, trainerId, role }: { eventId: number; trainerId: number; role: string }) => 
      assignStaffToEvent(eventId, trainerId, role),
    onSuccess: () => {
      if (currentEventForStaff) {
        refetchStaff();
        toast.success("Staff assigned to event");
        setSelectedTrainer(null);
        setStaffRole("Performer");
      }
    },
    onError: (error) => {
      toast.error(`Failed to assign staff: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Remove staff mutation
  const removeStaffMutation = useMutation({
    mutationFn: ({ eventId, staffId }: { eventId: number; staffId: number }) => 
      removeStaffFromEvent(eventId, staffId),
    onSuccess: () => {
      if (currentEventForStaff) {
        refetchStaff();
        toast.success("Staff removed from event");
      }
    },
    onError: (error) => {
      toast.error(`Failed to remove staff: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentEvent) {
      updateEventMutation.mutate({ id: currentEvent.id, data: formData });
    } else {
      createEventMutation.mutate(formData);
    }
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'fee' ? parseFloat(value) || 0 : value
    }));
  };
  
  // Reset form to default values
  const resetForm = () => {
    setFormData(emptyFormData);
  };
  
  // Open dialog for editing an event
  const openEditDialog = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      clientName: event.clientName,
      clientContact: event.clientContact,
      status: event.status,
      fee: event.fee,
      eventType: event.eventType
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for creating a new event
  const openNewDialog = () => {
    setCurrentEvent(null);
    resetForm();
    setIsDialogOpen(true);
  };
  
  // Open staff dialog for an event
  const openStaffDialog = (eventId: number) => {
    setCurrentEventForStaff(eventId);
    setStaffDialogOpen(true);
  };
  
  // Assign staff to event
  const handleAssignStaff = () => {
    if (currentEventForStaff && selectedTrainer) {
      assignStaffMutation.mutate({ 
        eventId: currentEventForStaff, 
        trainerId: selectedTrainer, 
        role: staffRole 
      });
    }
  };
  
  // Remove staff from event
  const handleRemoveStaff = (staffId: number) => {
    if (currentEventForStaff) {
      removeStaffMutation.mutate({
        eventId: currentEventForStaff,
        staffId
      });
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <DashboardLayout title="Event Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Events</h2>
          <Button onClick={openNewDialog}>Add New Event</Button>
        </div>
        
        <Tabs defaultValue="table" className="w-full">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="cards">Card View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.clientName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{event.fee.toLocaleString()}</TableCell>
                      <TableCell>{event.eventType}</TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openStaffDialog(event.id)}>
                          Staff
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                              deleteEventMutation.mutate(event.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {events.length === 0 && !eventsLoading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No events found. Click "Add New Event" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {eventsLoading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading events...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>{new Date(event.date).toLocaleDateString()} at {event.location}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Client:</p>
                      <p className="text-sm">{event.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fee:</p>
                      <p className="text-sm">₹{event.fee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type:</p>
                      <p className="text-sm">{event.eventType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Description:</p>
                      <p className="text-sm line-clamp-2">{event.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(event)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openStaffDialog(event.id)}>
                      Staff
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
                          deleteEventMutation.mutate(event.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {events.length === 0 && !eventsLoading && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <p>No events found. Click "Add New Event" to create one.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Event Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEvent ? `Edit Event: ${currentEvent.name}` : "Add New Event"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the event.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.eventname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.eventdate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="clientContact">Client Contact</Label>
                  <Input
                    id="clientContact"
                    name="clientContact"
                    value={formData.clientContact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fee">Event Fee (₹)</Label>
                  <Input
                    id="fee"
                    name="fee"
                    type="number"
                    value={formData.fee}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    name="status" 
                    value={formData.status} 
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, status: value }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select 
                  name="eventType" 
                  value={formData.eventType} 
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, eventType: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wedding">Wedding</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Birthday">Birthday</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {currentEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Staff Assignment Dialog */}
      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Staff</DialogTitle>
            <DialogDescription>
              Assign trainers to this event
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="trainer">Select Trainer</Label>
                <Select 
                  value={selectedTrainer?.toString() || ""} 
                  onValueChange={(value) => setSelectedTrainer(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer: Trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id.toString()}>
                        {trainer.name} - {trainer.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={staffRole} onValueChange={setStaffRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Performer">Performer</SelectItem>
                    <SelectItem value="Choreographer">Choreographer</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAssignStaff} 
                disabled={!selectedTrainer || !staffRole}
              >
                Assign to Event
              </Button>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>{staff.trainerName}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveStaff(staff.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {eventStaff.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No staff assigned yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EventsPage;
