
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { MantraCounter } from "@/components/MantraCounter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { AdContainer } from "@/components/AdContainer";

const Manual = () => {
  const [targetCount, setTargetCount] = useState<number>(108);
  const [customCount, setCustomCount] = useState<string>("108");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  const handleCustomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCount(e.target.value);
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTargetCount(value);
    }
  };
  
  const handleToggleChange = (value: string) => {
    if (!value) return;
    
    if (value === "custom") {
      const customValue = parseInt(customCount);
      if (!isNaN(customValue) && customValue > 0) {
        setTargetCount(customValue);
      }
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        setTargetCount(numValue);
        setCustomCount(value);
      }
    }
  };
  
  const handleCompletion = () => {
    setIsCompleted(true);
  };
  
  const handleReset = () => {
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-md px-4">
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">
          Manual Counter
        </h1>
        
        <AdContainer position="top" />
        
        {!isCompleted ? (
          <>
            {/* Target Selection */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Select your target count:
              </p>
              <div className="flex flex-col space-y-4">
                <ToggleGroup type="single" variant="outline" onValueChange={handleToggleChange}>
                  <ToggleGroupItem value="108" className="flex-1">108</ToggleGroupItem>
                  <ToggleGroupItem value="1008" className="flex-1">1008</ToggleGroupItem>
                  <ToggleGroupItem value="custom" className="flex-1">Custom</ToggleGroupItem>
                </ToggleGroup>
                
                <div className="flex space-x-2">
                  <Input 
                    type="number"
                    placeholder="Enter custom count" 
                    value={customCount}
                    onChange={handleCustomCountChange}
                    min="1"
                  />
                  <Button onClick={() => handleToggleChange("custom")}>Set</Button>
                </div>
              </div>
            </div>
            
            <AdContainer position="middle" />
            
            {/* Counter */}
            <MantraCounter 
              target={targetCount} 
              onComplete={handleCompletion}
            />
          </>
        ) : (
          <div className="text-center py-8 space-y-6">
            <div className="om-symbol text-6xl text-spiritual-gold animate-pulse-gentle">
              ॐ
            </div>
            <h2 className="text-2xl font-bold">Practice Complete</h2>
            <p className="text-muted-foreground">
              You've completed your {targetCount} mantra repetitions.
              May this practice bring you peace and clarity.
            </p>
            <Button onClick={handleReset}>Start New Session</Button>
          </div>
        )}
        
        <AdContainer position="bottom" />
      </div>
      <NavBar />
    </div>
  );
};

export default Manual;
