import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Calendar, BarChart2, Menu, X } from "lucide-react";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Manage sidebar state locally
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev); // Toggle sidebar state

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Overview", path: "/admin/overview", icon: <BarChart2 size={24} /> },
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={24} /> },
    { name: "Events", path: "/admin/events", icon: <Calendar size={24} /> },
  ];

  return (
    <div
      className={`transition-all duration-300 bg-white shadow-md ${
        isCollapsed ? "w-16" : "w-64"
      } h-screen flex flex-col`}
    >
      {/* Sidebar Header */}
      <SidebarHeader>
        <div
          className={`flex items-center justify-between ${
            isCollapsed ? "flex-col items-center" : "px-4 py-4"
          }`}
        >
          {!isCollapsed && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Tango
            </h2>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md hover:bg-purple-100 focus:outline-none ${
              isCollapsed ? "mt-2" : ""
            }`}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.path)}
                tooltip={isCollapsed ? item.name : undefined}
              >
                <Link
                  to={item.path}
                  className={`hover:bg-purple-50 flex items-center ${
                    isCollapsed ? "justify-center" : "gap-2 px-4"
                  } py-2`}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="flex-shrink-0">
        <div
          className={`px-4 py-4 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
            <p className="text-xs text-purple-800 font-medium">Step Up Dance</p>
            <p className="text-xs text-gray-600">Making every step count</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">© 2025 Step Up Dance</div>
        </div>
      </SidebarFooter>
    </div>
  );
};

export default AdminSidebar;
