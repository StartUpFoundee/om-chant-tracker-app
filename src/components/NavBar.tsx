
import { Link, useLocation } from "react-router-dom";
import { Home, Mic, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/manual", label: "Manual", icon: () => <span className="text-xl">🕮</span> },
    { path: "/audio", label: "Audio", icon: Mic },
    { path: "/dashboard", label: "Stats", icon: () => <span className="text-xl">📊</span> },
    { path: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-10 sm:top-0 sm:bottom-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full rounded-md transition-colors",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
