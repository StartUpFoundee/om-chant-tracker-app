
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { OmAnimation } from "@/components/OmAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { AdContainer } from "@/components/AdContainer";
import { useEffect, useState } from "react";
import { getMantraStats, getDailyContent } from "@/lib/mantra-storage";
import { MilestoneBanner } from "@/components/MilestoneBanner";
import { MilestoneModal } from "@/components/MilestoneModal";
import { DailyChallenge } from "@/components/DailyChallenge";

const Index = () => {
  const [stats, setStats] = useState(getMantraStats());
  const [dailyContent, setDailyContent] = useState(getDailyContent());
  const [showMilestones, setShowMilestones] = useState(false);
  
  // Update stats on mount
  useEffect(() => {
    setStats(getMantraStats());
    setDailyContent(getDailyContent());
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-lg px-4">
        <AdContainer position="top" />
        
        {/* Header with Om Symbol */}
        <header className="flex flex-col items-center justify-center mt-8 mb-6">
          <OmAnimation size="lg" withParticles={true} />
          <h1 className="text-3xl font-bold mt-2 text-center">ॐ नाम जप ॐ</h1>
          <p className="text-center text-muted-foreground mt-2 px-6">
            The repetition of divine names brings tranquility to the troubled mind
          </p>
        </header>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-spiritual-gold">{stats.todayCount}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-spiritual-gold">{stats.totalCount}</div>
            <div className="text-xs text-muted-foreground">Lifetime</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-spiritual-gold">{stats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>
        
        {/* Daily Challenge */}
        <DailyChallenge className="mb-6" onlyDaily={true} />
        
        {/* Milestone Banner */}
        <MilestoneBanner 
          className="mb-6" 
          onMilestoneClick={() => setShowMilestones(true)} 
        />
        
        <AdContainer position="middle" />
        
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/manual" className="block">
            <Card className="h-48 hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-5xl mb-4">🕮</div>
                <h2 className="text-xl font-medium mb-2">Manual / मैन्युअल</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Count mantras manually with clicks
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/audio" className="block">
            <Card className="h-48 hover:shadow-md transition-all duration-300 hover:scale-105">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-5xl mb-4">
                  <Mic className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-medium mb-2">Audio / ऑडियो द्वारा</h2>
                <p className="text-sm text-muted-foreground text-center">
                  Count mantras via voice recognition
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        {/* Daily Mantra */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Today's Mantra</h3>
            <p className="text-2xl font-sanskrit mb-2">{dailyContent.mantra.text}</p>
            <p className="text-sm italic mb-2">{dailyContent.mantra.translation}</p>
            <p className="text-xs text-muted-foreground">{dailyContent.mantra.meaning}</p>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(dailyContent.mantra.text);
                }}
              >
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Daily Mantra",
                      text: `${dailyContent.mantra.text}\n${dailyContent.mantra.translation}`,
                      url: window.location.href
                    });
                  }
                }}
              >
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <AdContainer position="bottom" />
      </div>
      
      <MilestoneModal 
        open={showMilestones}
        onOpenChange={setShowMilestones}
      />
      
      <NavBar />
    </div>
  );
};

export default Index;
