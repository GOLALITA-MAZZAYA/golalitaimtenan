import { createContext, useContext, useEffect, useState } from "react";

const initialContext = {
  activeTab: "Second",
  setActiveTab: () => {},
};

const TabsContext = createContext(initialContext);

export default function TabsProvider({ children, onTabChange, defaultActiveTab }) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || "Second");

  useEffect(() => {
    onTabChange?.(activeTab);
  }, [activeTab]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
}
