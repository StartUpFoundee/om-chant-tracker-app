
import { NavBar } from "@/components/NavBar";
import { AdContainer } from "@/components/AdContainer";
import { DailyChallenge } from "@/components/DailyChallenge";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, Award, Trophy } from "lucide-react";

const Challenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState(0);
  
  useEffect(() => {
    // Calculate completed challenges from localStorage
    // This is just a simple implementation
    const challengeStatus = localStorage.getItem('challengeStatus');
    if (challengeStatus) {
      const parsed = JSON.parse(challengeStatus);
      let count = 0;
      
      // Count completed challenges by checking history (simplified)
      // In a real implementation, you'd want to track this more explicitly
      if (parsed.lastCompletedDaily) count++;
      if (parsed.lastCompletedMonthly) count++;
      
      setCompletedChallenges(count);
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-md px-4">
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">
          Spiritual Challenges
        </h1>
        
        <AdContainer position="top" />
        
        {/* Challenge Stats */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <CalendarCheck className="h-8 w-8 text-spiritual-gold mb-2" />
                <span className="text-sm font-medium">Today</span>
                <span className="text-xs text-muted-foreground">Daily Challenge</span>
              </div>
              <div className="flex flex-col items-center">
                <Award className="h-8 w-8 text-spiritual-gold mb-2" />
                <span className="text-sm font-medium">{completedChallenges}</span>
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 text-spiritual-gold mb-2" />
                <span className="text-sm font-medium">Monthly</span>
                <span className="text-xs text-muted-foreground">Special</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Challenge Description */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Complete daily and monthly spiritual challenges to deepen your practice. 
              New challenges appear each day and month, designed to expand your spiritual journey.
            </p>
          </CardContent>
        </Card>
        
        <AdContainer position="middle" />
        
        {/* Daily and Monthly Challenges */}
        <DailyChallenge className="mb-6" />
        
        <AdContainer position="bottom" />
      </div>
      <NavBar />
    </div>
  );
};

export default Challenges;
