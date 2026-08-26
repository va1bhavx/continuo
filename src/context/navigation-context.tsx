import { createContext, useContext, useState } from "react";

interface NavigationContextProps {
  view: "links" | "history" | "settings" | "main" | "about" | "privacy" | "terms" | "feedback";
  setView: (view: NavigationContextProps["view"]) => void;
}

const NavigationContext = createContext<NavigationContextProps>({
  view: "main",
  setView: () => {},
});

export default function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [view, setView] = useState<NavigationContextProps["view"]>("main");
  return (
    <NavigationContext.Provider value={{ view, setView }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }

  return context;
}
