
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Milestone, getNextMilestone } from "@/lib/spiritual-journey";
import { cn } from "@/lib/utils";

interface MilestoneBannerProps {
  className?: string;
  onMilestoneClick?: () => void;
}

export function MilestoneBanner({ className, onMilestoneClick }: MilestoneBannerProps) {
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null);
  
  useEffect(() => {
    // Set the next milestone
    setNextMilestone(getNextMilestone());
    
    // Update milestone when window gains focus (in case it changed)
    const handleFocus = () => {
      setNextMilestone(getNextMilestone());
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  if (!nextMilestone) {
    return null;
  }
  
  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow duration-300",
        className
      )}
      onClick={onMilestoneClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Next milestone:</span>
            <span className="text-sm text-spiritual-gold font-semibold">{nextMilestone.title}</span>
          </div>
          
          <p className="text-xs text-muted-foreground">{nextMilestone.description}</p>
          
          <div className="mt-2">
            <Progress 
              value={nextMilestone.progress} 
              className="h-1.5" 
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">{nextMilestone.progress}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
