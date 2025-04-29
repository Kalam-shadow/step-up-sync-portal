
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import StudentsPage from "./StudentsPage";
import TrainersPage from "./TrainersPage";
import BatchesPage from "./BatchesPage";
import AttendancePage from "./AttendancePage";
import PaymentsPage from "./PaymentsPage";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check if user is logged in
  useEffect(() => {
    if (!localStorage.getItem("isLoggedIn")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-10">
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
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="batches">Batches</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <DashboardHome />
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <StudentsPage />
          </TabsContent>

          <TabsContent value="trainers" className="space-y-4">
            <TrainersPage />
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            <BatchesPage />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <AttendancePage />
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <PaymentsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
