
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import AdminSidebar from "./AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title = "Step Up Dance Admin" }: DashboardLayoutProps) => {
  const navigate = useNavigate();

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <SidebarInset className="transition-all duration-300">
          <DashboardHeader title={title} onLogout={handleLogout} />
          <main className="container mx-auto py-8 px-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
