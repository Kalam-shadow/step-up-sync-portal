
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

interface TabNavigationProps {
  tabs: TabItem[];
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

const TabNavigation = ({ tabs, defaultValue, onValueChange }: TabNavigationProps) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className="space-y-6">
      <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabNavigation;
