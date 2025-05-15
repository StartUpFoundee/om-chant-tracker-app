
import { useLocation, Link } from "react-router-dom";
import { Home, BookOpen, Mic, BarChart2, Award, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const NavBar = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="grid grid-cols-6 max-w-lg mx-auto">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center p-2 text-xs",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home size={20} />
          <span className="mt-1">Home</span>
        </Link>
        
        <Link
          to="/manual"
          className={cn(
            "flex flex-col items-center justify-center p-2 text-xs",
            isActive("/manual") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <BookOpen size={20} />
          <span className="mt-1">Manual</span>
        </Link>
        
        <Link
          to="/audio"
          className={cn(
            "flex flex-col items-center justify-center p-2 text-xs",
            isActive("/audio") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Mic size={20} />
          <span className="mt-1">Audio</span>
        </Link>
        
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center p-2 text-xs",
            isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <BarChart2 size={20} />
          <span className="mt-1">Stats</span>
        </Link>
        
        <Link
          to="/challenges"
          className={cn(
            "flex flex-col items-center justify-center p-2 text-xs",
            isActive("/challenges") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Award size={20} />
          <span className="mt-1">Challenges</span>
        </Link>
        
        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center justify-center p-2 text-xs",
            isActive("/profile") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <User size={20} />
          <span className="mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};
