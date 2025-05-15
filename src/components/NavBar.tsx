
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { CalendarCheck, Home, Settings, BarChart2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const links = [
    {
      href: "/",
      label: "Home",
      icon: <Home className="w-5 h-5" />
    },
    {
      href: "/manual",
      label: "Manual",
      icon: <span className="text-lg">🕮</span>
    },
    {
      href: "/audio",
      label: "Audio",
      icon: <Mic className="w-5 h-5" />
    },
    {
      href: "/challenges",
      label: "Challenges",
      icon: <CalendarCheck className="w-5 h-5" />
    },
    {
      href: "/dashboard",
      label: "Stats",
      icon: <BarChart2 className="w-5 h-5" />
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border z-50">
      <div className="container px-4 max-w-md mx-auto">
        <div className="flex justify-between">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 hover:text-spiritual-gold transition-colors",
                currentPath === link.href 
                  ? "text-spiritual-gold" 
                  : "text-muted-foreground"
              )}
            >
              <span className="flex items-center justify-center h-6">
                {link.icon}
              </span>
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
