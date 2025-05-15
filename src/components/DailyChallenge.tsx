
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTodayChallenge, getMonthlyChallenge, isDailyChallengeCompleted, isMonthlyCompleted, completeDailyChallenge, completeMonthlyChallenge } from "@/lib/daily-challenges";
import { toast } from "@/components/ui/use-toast";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyChallengeProps {
  className?: string;
  onlyDaily?: boolean;
}

export function DailyChallenge({ className, onlyDaily = false }: DailyChallengeProps) {
  const [dailyChallenge, setDailyChallenge] = useState(getTodayChallenge());
  const [monthlyChallenge, setMonthlyChallenge] = useState(getMonthlyChallenge());
  const [isDailyDone, setIsDailyDone] = useState(isDailyChallengeCompleted());
  const [isMonthlyDone, setIsMonthlyDone] = useState(isMonthlyCompleted());
  
  // Refresh challenges on date change
  useEffect(() => {
    setDailyChallenge(getTodayChallenge());
    setMonthlyChallenge(getMonthlyChallenge());
    setIsDailyDone(isDailyChallengeCompleted());
    setIsMonthlyDone(isMonthlyCompleted());
    
    // Update when window gains focus (in case date changed)
    const handleFocus = () => {
      setDailyChallenge(getTodayChallenge());
      setMonthlyChallenge(getMonthlyChallenge());
      setIsDailyDone(isDailyChallengeCompleted());
      setIsMonthlyDone(isMonthlyCompleted());
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  const handleCompleteDaily = () => {
    completeDailyChallenge();
    setIsDailyDone(true);
    toast({
      title: "Challenge completed!",
      description: "Great job completing today's spiritual challenge.",
    });
  };
  
  const handleCompleteMonthly = () => {
    completeMonthlyChallenge();
    setIsMonthlyDone(true);
    toast({
      title: "Monthly challenge completed!",
      description: "You've completed this month's special challenge!",
    });
  };
  
  // Helper to render difficulty indicators
  const renderDifficulty = (level: 1 | 2 | 3) => {
    return (
      <div className="flex items-center">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className={cn(
              "w-2 h-2 rounded-full mx-0.5",
              i < level ? "bg-spiritual-gold" : "bg-muted"
            )}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Daily Challenge */}
      <Card className={cn("transition-all", isDailyDone && "opacity-75")}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Today's Challenge</CardTitle>
            <Badge variant={dailyChallenge.category === "mantra" ? "default" : "outline"} className="capitalize">
              {dailyChallenge.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium text-lg mb-1">{dailyChallenge.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{dailyChallenge.description}</p>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="mr-1">Difficulty:</span>
              {renderDifficulty(dailyChallenge.difficulty)}
            </div>
            
            {dailyChallenge.targetCount && (
              <span>Target: {dailyChallenge.targetCount} repetitions</span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCompleteDaily} 
            disabled={isDailyDone}
            className="w-full"
            variant={isDailyDone ? "outline" : "default"}
          >
            {isDailyDone ? (
              <span className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2" /> 
                Completed
              </span>
            ) : "Mark as Complete"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Monthly Challenge */}
      {!onlyDaily && (
        <Card className={cn("border-spiritual-gold/30 bg-muted/50", isMonthlyDone && "opacity-75")}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Monthly Challenge</CardTitle>
              <Badge variant="secondary" className="capitalize">
                {new Date().toLocaleString('default', { month: 'long' })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-lg mb-1">{monthlyChallenge.title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{monthlyChallenge.description}</p>
            
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <span className="mr-1">Difficulty:</span>
                {renderDifficulty(monthlyChallenge.difficulty)}
              </div>
              
              {monthlyChallenge.targetCount && (
                <span>Target: {monthlyChallenge.targetCount} repetitions</span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCompleteMonthly} 
              disabled={isMonthlyDone}
              className="w-full"
              variant={isMonthlyDone ? "outline" : "secondary"}
            >
              {isMonthlyDone ? (
                <span className="flex items-center">
                  <CalendarCheck className="h-4 w-4 mr-2" /> 
                  Completed
                </span>
              ) : "Mark as Complete"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
