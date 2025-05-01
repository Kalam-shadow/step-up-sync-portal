
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { LayoutDashboard, Calendar, BarChart2, PanelLeftClose, PanelLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-4 flex items-center justify-between">
          <h2 className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent transition-opacity duration-300 ${state === "collapsed" ? "opacity-0" : "opacity-100"}`}>
            Step Up Dance
          </h2>
          <SidebarTrigger>
            {state === "expanded" ? (
              <PanelLeftClose size={18} className="text-purple-600" />
            ) : (
              <PanelLeft size={18} className="text-purple-600" />
            )}
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/overview")} tooltip="Overview">
              <Link to="/admin/overview" className="hover:bg-purple-50">
                <BarChart2 className="text-purple-600" />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/dashboard")} tooltip="Dance School">
              <Link to="/admin/dashboard" className="hover:bg-purple-50">
                <LayoutDashboard className="text-purple-600" />
                <span>Dance School</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/admin/events")} tooltip="Events">
              <Link to="/admin/events" className="hover:bg-purple-50">
                <Calendar className="text-purple-600" />
                <span>Events</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className={`px-4 py-4 transition-opacity duration-300 ${state === "collapsed" ? "opacity-0" : "opacity-100"}`}>
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
            <p className="text-xs text-purple-800 font-medium">Step Up Dance</p>
            <p className="text-xs text-gray-600">Making every step count</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            © 2025 Step Up Dance
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
