
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { MantraCounter } from "@/components/MantraCounter";
import { Mic, MicOff } from "lucide-react";
import { AdContainer } from "@/components/AdContainer";

const Audio = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [targetCount, setTargetCount] = useState<number>(108);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
  
  // Check for speech recognition support
  useEffect(() => {
    const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setSpeechRecognitionSupported(supported);
  }, []);
  
  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-md px-4">
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">
          Audio Counter
        </h1>
        
        <AdContainer position="top" />
        
        {!speechRecognitionSupported ? (
          <div className="text-center py-8 bg-card rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-medium mb-4">Speech Recognition Not Available</h2>
            <p className="text-muted-foreground mb-6">
              Your browser doesn't support speech recognition.
              Please try using Chrome or Edge for this feature.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <Button 
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="flex items-center space-x-2"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
            </div>
            
            <AdContainer position="middle" />
            
            {/* Audio visualization (simplified) */}
            {isListening && (
              <div className="mb-8 flex justify-center">
                <div className="flex items-end h-20 space-x-1">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const height = 20 + Math.random() * 60;
                    return (
                      <div 
                        key={i} 
                        className="w-2 bg-spiritual-gold rounded-full"
                        style={{ 
                          height: `${height}%`,
                          animationDelay: `${i * 0.1}s`,
                          animation: 'pulse-gentle 0.5s ease-in-out infinite'
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            
            <MantraCounter 
              autoIncrement={isListening} 
              target={targetCount}
            />
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Speak your mantra clearly with a brief pause between repetitions.</p>
              <p className="mt-2">The counter will increment automatically as you chant.</p>
            </div>
          </>
        )}
        
        <AdContainer position="bottom" />
      </div>
      <NavBar />
    </div>
  );
};

export default Audio;
