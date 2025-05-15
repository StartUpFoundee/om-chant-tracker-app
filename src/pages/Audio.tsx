
import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { MantraCounter } from "@/components/MantraCounter";
import { Mic, MicOff, ArrowLeft } from "lucide-react";
import { AdContainer } from "@/components/AdContainer";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Audio = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [targetCount, setTargetCount] = useState<number>(108);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
  const [lastSpeechTimestamp, setLastSpeechTimestamp] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  // Check for speech recognition support
  useEffect(() => {
    const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setSpeechRecognitionSupported(supported);
    
    // Setup recognition instance
    if (supported) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const now = Date.now();
          const pauseDuration = now - lastSpeechTimestamp;
          
          // Update the last speech timestamp
          setLastSpeechTimestamp(now);
          
          // If last speech was more than 500ms ago, count as a new mantra
          if (pauseDuration >= 500 && lastSpeechTimestamp !== 0) {
            console.log("Mantra detected, incrementing count");
            setCount(prevCount => {
              const newCount = prevCount + 1;
              // Check if we've reached the target
              if (newCount === targetCount) {
                toast.success(`You've completed ${targetCount} mantras!`);
              }
              return newCount;
            });
          }
        };
        
        recognitionRef.current.onerror = (event: Event) => {
          console.error("Speech recognition error", event);
          toast.error("Speech recognition error. Please try again.");
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            // If still listening but recognition ended, restart it
            recognitionRef.current?.start();
          }
        };
      }
    }
    
    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isListening]);
  
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setLastSpeechTimestamp(0); // Reset the timestamp
      if (recognitionRef.current) {
        recognitionRef.current.start();
        toast.info("Listening for mantras. Speak clearly with pauses between mantras.");
      }
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-lg px-4">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-auto"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center mx-auto">
            Audio Counter
          </h1>
          <div className="mr-auto w-9"></div>
        </div>
        
        <AdContainer position="top" />
        
        {!speechRecognitionSupported ? (
          <div className="text-center py-8 bg-card rounded-lg shadow-sm p-4">
            <h2 className="text-xl font-medium mb-4">Speech Recognition Not Available</h2>
            <p className="text-muted-foreground mb-6">
              Your browser doesn't support speech recognition.
              Please try using Chrome or Edge for this feature.
            </p>
            <Button onClick={() => navigate("/")}>Go Back</Button>
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
              target={targetCount}
              overrideCount={count}
              className="mt-4"
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
