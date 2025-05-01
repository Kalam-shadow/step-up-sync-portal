
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event, EventStaff, EventFormData, Trainer } from "@/types";
import { getEvents, createEvent, updateEvent, deleteEvent, getEventStaff, assignStaffToEvent, removeStaffFromEvent, getTrainers } from "@/services/api";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Edit, Calendar, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("Performer");
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);

  const form = useForm<EventFormData>({
    defaultValues: {
      name: "",
      date: "",
      location: "",
      description: "",
      clientName: "",
      clientContact: "",
      status: "Upcoming",
      fee: 0,
      eventType: "Performance",
    },
  });

  // Reset form when dialog closes
  const handleEventDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setEditingEvent(null);
    }
    setIsEventDialogOpen(open);
  };

  // Prefill form when editing
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    form.setValue("name", event.name);
    form.setValue("date", event.date);
    form.setValue("location", event.location);
    form.setValue("description", event.description);
    form.setValue("clientName", event.clientName);
    form.setValue("clientContact", event.clientContact);
    form.setValue("status", event.status);
    form.setValue("fee", event.fee);
    form.setValue("eventType", event.eventType);
    setIsEventDialogOpen(true);
  };

  // Open staff dialog
  const handleManageStaff = (event: Event) => {
    setSelectedEvent(event);
    setIsStaffDialogOpen(true);
  };

  // Get all events
  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  // Get all trainers for staff assignment
  const {
    data: trainers = [],
    isLoading: trainersLoading,
  } = useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainers,
  });

  // Get staff for selected event
  const {
    data: eventStaff = [],
    isLoading: staffLoading,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["eventStaff", selectedEvent?.id],
    queryFn: () => selectedEvent ? getEventStaff(selectedEvent.id) : Promise.resolve([]),
    enabled: !!selectedEvent,
  });

  // Add/update event mutation
  const eventMutation = useMutation({
    mutationFn: (data: EventFormData) => {
      if (editingEvent) {
        return updateEvent(editingEvent.id, data);
      } else {
        return createEvent(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: `Event ${editingEvent ? "updated" : "created"} successfully`,
        variant: "default",
      });
      setIsEventDialogOpen(false);
      form.reset();
      setEditingEvent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? "update" : "create"} event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Event deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Assign staff mutation
  const assignStaffMutation = useMutation({
    mutationFn: ({ eventId, trainerId, role }: { eventId: number; trainerId: number; role: string }) => 
      assignStaffToEvent(eventId, trainerId, role),
    onSuccess: () => {
      if (selectedEvent) {
        queryClient.invalidateQueries({ queryKey: ["eventStaff", selectedEvent.id] });
        toast({
          title: "Staff assigned successfully",
          variant: "default",
        });
        setSelectedTrainerId(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to assign staff: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Remove staff mutation
  const removeStaffMutation = useMutation({
    mutationFn: ({ eventId, staffId }: { eventId: number; staffId: number }) => 
      removeStaffFromEvent(eventId, staffId),
    onSuccess: () => {
      if (selectedEvent) {
        queryClient.invalidateQueries({ queryKey: ["eventStaff", selectedEvent.id] });
        toast({
          title: "Staff removed successfully",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to remove staff: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    eventMutation.mutate(data);
  });

  const handleAssignStaff = () => {
    if (selectedEvent && selectedTrainerId) {
      assignStaffMutation.mutate({
        eventId: selectedEvent.id,
        trainerId: selectedTrainerId,
        role: selectedRole,
      });
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (eventsLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (eventsError) return <div className="p-8 text-red-500">Error loading events!</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Event Management</h2>
        <Dialog open={isEventDialogOpen} onOpenChange={handleEventDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit" : "Add"} Event</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update event details" : "Enter event information below"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Annual Dance Show" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City Theater" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Performance">Performance</SelectItem>
                            <SelectItem value="Wedding">Wedding</SelectItem>
                            <SelectItem value="Corporate">Corporate Event</SelectItem>
                            <SelectItem value="Competition">Competition</SelectItem>
                            <SelectItem value="Workshop">Workshop</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Event details and requirements" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Email or Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fee</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? 0 : parseFloat(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={eventMutation.isPending}>
                    {eventMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingEvent ? "Update" : "Create"} Event
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No events found</TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.eventType}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleManageStaff(event)}
                          >
                            <Users size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => deleteEventMutation.mutate(event.id)}
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
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length === 0 ? (
              <div className="text-center col-span-full py-8">No events found</div>
            ) : (
              events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{event.name}</span>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{event.eventType}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-purple-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Location:</span> {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-purple-500" />
                      <span>{event.clientName || "No client specified"}</span>
                    </div>
                    <p className="text-sm line-clamp-2">{event.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleManageStaff(event)}
                    >
                      <Users size={16} className="mr-2" />
                      Manage Staff
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => deleteEventMutation.mutate(event.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Staff Management Dialog */}
      <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Event Staff</DialogTitle>
            <DialogDescription>
              {selectedEvent ? `Assign dancers to "${selectedEvent.name}"` : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormLabel>Trainer</FormLabel>
                <Select onValueChange={(value) => setSelectedTrainerId(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id.toString()}>
                        {trainer.name} - {trainer.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/3">
                <FormLabel>Role</FormLabel>
                <Select defaultValue={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Performer">Performer</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Choreographer">Choreographer</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAssignStaff}
                disabled={!selectedTrainerId || assignStaffMutation.isPending}
              >
                {assignStaffMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign
              </Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        <Loader2 className="mx-auto animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : eventStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">No staff assigned to this event</TableCell>
                    </TableRow>
                  ) : (
                    eventStaff.map((staff) => {
                      const trainer = trainers.find(t => t.id === staff.trainerId);
                      return (
                        <TableRow key={staff.id}>
                          <TableCell>{staff.trainerName}</TableCell>
                          <TableCell>{staff.role}</TableCell>
                          <TableCell>{trainer?.specialization || "Unknown"}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500"
                              onClick={() => removeStaffMutation.mutate({ 
                                eventId: staff.eventId, 
                                staffId: staff.id 
                              })}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;
