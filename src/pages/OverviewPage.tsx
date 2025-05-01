
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Batch, Event, Student } from "@/types";
import { getBatches } from "@/services/api/batches";
import { getEvents } from "@/services/api/events";
import { getStudents } from "@/services/api/students";

const OverviewPage = () => {
  // Fetch data for both dance school and events
  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: getBatches
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents
  });
  
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents
  });

  // Calculate statistics
  const totalStudents = students.length;
  const totalBatches = batches.length;
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => event.status === "Upcoming").length;
  
  // Get batch data for visualization
  const batchesByDanceStyle = batches.reduce((acc: Record<string, number>, batch: Batch) => {
    acc[batch.danceStyle] = (acc[batch.danceStyle] || 0) + 1;
    return acc;
  }, {});

  const batchData = Object.entries(batchesByDanceStyle).map(([name, value]) => ({
    name,
    value,
  }));

  // Get event data for visualization
  const eventsByType = events.reduce((acc: Record<string, number>, event: Event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});

  const eventData = Object.entries(eventsByType).map(([name, value]) => ({
    name,
    value,
  }));

  // For pie chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <DashboardLayout title="Step Up Dance - Overview">
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBatches}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="school" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="school">Dance School</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <TabsContent value="school" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Dance Styles Distribution</CardTitle>
                <CardDescription>Breakdown of batches by dance style</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={batchData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {batchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Types Distribution</CardTitle>
                <CardDescription>Breakdown of events by type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={eventData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Number of Events" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OverviewPage;
