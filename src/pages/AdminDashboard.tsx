
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Mock components for the admin dashboard sections
// In a real app, these would be separate components

const StudentManagement = () => (
  <Card>
    <CardHeader>
      <CardTitle>Student Management</CardTitle>
      <CardDescription>View and manage all registered students</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Student data would be displayed here</p>
        <p className="mt-4 text-sm text-gray-400">This would connect to the MySQL database</p>
      </div>
    </CardContent>
  </Card>
);

const TrainerManagement = () => (
  <Card>
    <CardHeader>
      <CardTitle>Trainer Management</CardTitle>
      <CardDescription>Add, update, or delete trainer profiles</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Trainer data would be displayed here</p>
        <p className="mt-4 text-sm text-gray-400">This would connect to the MySQL database</p>
      </div>
    </CardContent>
  </Card>
);

const CourseSchedule = () => (
  <Card>
    <CardHeader>
      <CardTitle>Course Schedule</CardTitle>
      <CardDescription>Manage class schedules and trainer assignments</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Course schedule data would be displayed here</p>
        <p className="mt-4 text-sm text-gray-400">This would connect to the MySQL database</p>
      </div>
    </CardContent>
  </Card>
);

const AttendanceTracking = () => (
  <Card>
    <CardHeader>
      <CardTitle>Attendance Tracking</CardTitle>
      <CardDescription>Mark and view student attendance</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Attendance data would be displayed here</p>
        <p className="mt-4 text-sm text-gray-400">This would connect to the MySQL database</p>
      </div>
    </CardContent>
  </Card>
);

const PaymentHandling = () => (
  <Card>
    <CardHeader>
      <CardTitle>Payment Handling</CardTitle>
      <CardDescription>View and update payment status</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Payment data would be displayed here</p>
        <p className="mt-4 text-sm text-gray-400">This would connect to the MySQL database</p>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  
  // In a real app, we would check authentication here
  // For now, we'll just mock it
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    navigate("/admin");
    return null;
  }
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Step Up Dance Admin
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="space-y-4">
            <StudentManagement />
          </TabsContent>
          
          <TabsContent value="trainers" className="space-y-4">
            <TrainerManagement />
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <CourseSchedule />
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <AttendanceTracking />
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-4">
            <PaymentHandling />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
