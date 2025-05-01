
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TabNavigation from "@/components/dashboard/TabNavigation";
import DashboardHome from "./DashboardHome";
import StudentsPage from "./StudentsPage";
import TrainersPage from "./TrainersPage";
import BatchesPage from "./BatchesPage";
import AttendancePage from "./AttendancePage";
import PaymentsPage from "./PaymentsPage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const dashboardTabs = [
    { value: "dashboard", label: "Overview", content: <DashboardHome /> },
    { value: "students", label: "Students", content: <StudentsPage /> },
    { value: "trainers", label: "Trainers", content: <TrainersPage /> },
    { value: "batches", label: "Batches", content: <BatchesPage /> },
    { value: "attendance", label: "Attendance", content: <AttendancePage /> },
    { value: "payments", label: "Payments", content: <PaymentsPage /> },
  ];

  return (
    <DashboardLayout title="Dance School Management">
      <TabNavigation 
        tabs={dashboardTabs} 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
