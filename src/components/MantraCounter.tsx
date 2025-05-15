import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getMantraStats, updateMantraCount } from "@/lib/mantra-storage";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Award } from "lucide-react";
import { updateMilestoneProgress } from "@/lib/spiritual-journey";

interface MantraCounterProps {
  autoIncrement?: boolean;
  target?: number;
  onComplete?: () => void;
  className?: string;
}

export function MantraCounter({
  autoIncrement = false,
  target = 108,
  onComplete,
  className
}: MantraCounterProps) {
  const [count, setCount] = useState(0);
  const [mantraStats, setMantraStats] = useState(getMantraStats());
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const counterRef = useRef<HTMLDivElement>(null);
  const { toast: uiToast } = useToast();
  
  // Update stats on component mount
  useEffect(() => {
    setMantraStats(getMantraStats());
  }, []);
  
  // Handle target completion
  useEffect(() => {
    if (count >= target && target > 0) {
      const playCompletionSound = () => {
        const audio = new Audio('/bell-sound.mp3');
        audio.play();
      };
      
      try {
        playCompletionSound();
      } catch (error) {
        console.error("Could not play completion sound");
      }
      
      uiToast({
        title: "Practice Complete",
        description: `You've completed ${target} mantras!`,
      });
      
      onComplete?.();
    }
  }, [count, target, onComplete, uiToast]);

  // Vibration effect on increment
  const vibrateOnIncrement = () => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(20);
      } catch (error) {
        console.error("Vibration not supported");
      }
    }
  };
  
  // Add ripple effect
  const addRipple = (x: number, y: number) => {
    const id = Date.now();
    setRipples(prev => [...prev, { id, x, y }]);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 700);
  };
  
  // Handle counter increment
  const incrementCounter = (event?: React.MouseEvent) => {
    if (count >= target && target > 0) return;
    
    setCount(prev => prev + 1);
    const newStats = updateMantraCount(1);
    setMantraStats(newStats);
    vibrateOnIncrement();
    
    // Add ripple effect at click position
    if (event && counterRef.current) {
      const rect = counterRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      addRipple(x, y);
    } else {
      // If no event (auto-increment), ripple from center
      addRipple(50, 50);
    }
    
    // Check for milestone achievements
    const { newlyAchieved } = updateMilestoneProgress({
      totalCount: newStats.totalCount,
      streak: newStats.streak,
      practiceDays: newStats.practiceDays
    });
    
    // Show milestone notifications
    if (newlyAchieved.length > 0) {
      const milestone = newlyAchieved[0]; // Show the first new milestone
      toast((
        <div className="flex items-start gap-3">
          <Award className="h-6 w-6 text-spiritual-gold flex-shrink-0" />
          <div>
            <h3 className="font-medium">New Milestone Achieved</h3>
            <p className="text-sm text-muted-foreground">{milestone.title}: {milestone.description}</p>
          </div>
        </div>
      ), {
        duration: 5000
      });
    }
    
    // Show milestone notifications
    if ([27, 54, 81, 108, 1008].includes(count + 1)) {
      uiToast({
        title: "Milestone reached",
        description: `${count + 1} mantras completed!`,
      });
    }
  };
  
  // Auto-increment for audio mode
  useEffect(() => {
    if (!autoIncrement) return;
    
    let intervalId: number;
    
    if (autoIncrement && count < target) {
      // This is just a demo - would be replaced by actual audio detection
      intervalId = window.setInterval(() => {
        incrementCounter();
      }, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoIncrement, count, target]);
  
  // Calculate progress percentage
  const progressPercent = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Progress display */}
      <div className="mb-4 text-center">
        <span className="text-lg font-medium">
          {count} / {target}
        </span>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-spiritual-gold transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground mt-1">
          {progressPercent.toFixed(0)}% complete
        </span>
      </div>
      
      {/* Counter button */}
      <div
        ref={counterRef}
        className="ripple-container w-64 h-64 relative rounded-full"
      >
        <Button
          onClick={incrementCounter}
          className="w-full h-full rounded-full bg-spiritual-gold text-foreground hover:bg-spiritual-gold/90 flex flex-col items-center justify-center"
          disabled={count >= target && target > 0}
        >
          <span className="om-symbol text-6xl">ॐ</span>
          <span className="text-3xl font-bold mt-2">{count}</span>
        </Button>
        
        {/* Ripples */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple animate-ripple"
            style={{ 
              left: `${ripple.x}%`, 
              top: `${ripple.y}%` 
            }}
          />
        ))}
      </div>
      
      {/* Stats summary */}
      <div className="mt-8 text-center">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span>Today's Total:</span>
            <span className="font-medium">{mantraStats.todayCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Lifetime Total:</span>
            <span className="font-medium">{mantraStats.totalCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Streak:</span>
            <span className="font-medium">{mantraStats.streak} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
