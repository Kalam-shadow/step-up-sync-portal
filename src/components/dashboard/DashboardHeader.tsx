
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title: string;
  onLogout: () => void;
}

const DashboardHeader = ({ title, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {title}
        </h1>
        <Button variant="outline" onClick={onLogout}>
          Log Out
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
