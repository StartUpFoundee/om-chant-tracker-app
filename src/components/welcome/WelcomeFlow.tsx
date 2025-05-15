
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OmAnimation } from "@/components/OmAnimation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { spiritualSymbols, generateUniqueId, saveUserIdentity, hasUserIdentity } from "@/lib/user-identity";
import { ImportIdentityForm } from "./ImportIdentityForm";
import { toast } from "@/components/ui/sonner";

export const WelcomeFlow = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [spiritualName, setSpiritualName] = useState<string>("");
  const [selectedSymbol, setSelectedSymbol] = useState<number>(1);
  const [uniqueId, setUniqueId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("new");
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already has identity, redirect to home
    if (hasUserIdentity() && currentStep === 0) {
      navigate("/");
    }
  }, [navigate]);
  
  const handleNext = () => {
    if (currentStep === 0) {
      // Validate spiritual name
      if (!spiritualName.trim()) {
        toast("Please enter your spiritual name");
        return;
      }
      setCurrentStep(1);
    }
    else if (currentStep === 1) {
      setCurrentStep(2);
      // Generate unique ID based on name
      const generatedId = generateUniqueId(spiritualName);
      setUniqueId(generatedId);
    }
    else if (currentStep === 2) {
      // Save user identity
      const userIdentity = {
        spiritualName,
        symbolId: selectedSymbol,
        uniqueId,
        creationDate: Date.now()
      };
      saveUserIdentity(userIdentity);
      toast("Your spiritual journey has begun!");
      navigate("/");
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSymbolSelect = (id: number) => {
    setSelectedSymbol(id);
  };
  
  const handleImportComplete = () => {
    toast("Your spiritual journey has been restored!");
    navigate("/");
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-background">
      <OmAnimation size="lg" withParticles={true} />
      
      <Card className="w-full max-w-md mt-6 overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {currentStep === 0 && activeTab === "new" && "Welcome to Your Spiritual Journey"}
            {currentStep === 0 && activeTab === "existing" && "Continue Your Journey"}
            {currentStep === 1 && "Choose Your Symbol"}
            {currentStep === 2 && "Your Spiritual Identity"}
          </CardTitle>
          <CardDescription>
            {currentStep === 0 && activeTab === "new" && "Begin your path of spiritual practice"}
            {currentStep === 0 && activeTab === "existing" && "Import your existing practice"}
            {currentStep === 1 && "Select a symbol that represents your spiritual path"}
            {currentStep === 2 && "Your unique spiritual identity has been created"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 py-4">
          {currentStep === 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new">New Journey</TabsTrigger>
                <TabsTrigger value="existing">Continue Journey</TabsTrigger>
              </TabsList>
              
              <TabsContent value="new" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="spiritual-name" className="block text-sm font-medium mb-1">
                      Your Spiritual Name
                    </label>
                    <Input
                      id="spiritual-name"
                      placeholder="Enter a name that represents your spiritual self"
                      value={spiritualName}
                      onChange={(e) => setSpiritualName(e.target.value)}
                      maxLength={30}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This name will represent you on your spiritual journey
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="existing" className="mt-4">
                <ImportIdentityForm onComplete={handleImportComplete} />
              </TabsContent>
            </Tabs>
          )}
          
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-center mb-4">
                Choose a symbol that resonates with your spiritual journey
              </p>
              
              <div className="grid grid-cols-4 gap-2">
                {spiritualSymbols.map((symbol) => (
                  <Button
                    key={symbol.id}
                    variant={selectedSymbol === symbol.id ? "default" : "outline"}
                    className="h-16 text-2xl"
                    onClick={() => handleSymbolSelect(symbol.id)}
                  >
                    {symbol.symbol}
                  </Button>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-2">
                Selected: {spiritualSymbols.find(s => s.id === selectedSymbol)?.name}
              </p>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-4xl">
                  {spiritualSymbols.find(s => s.id === selectedSymbol)?.symbol}
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Spiritual Name</p>
                  <p className="text-lg">{spiritualName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Unique Identity Code</p>
                  <p className="text-lg font-mono">{uniqueId}</p>
                </div>
                
                <div className="bg-muted p-3 rounded-md text-sm mt-4">
                  <p>Please save your unique identity code to continue your spiritual journey on other devices.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {(currentStep > 0 && activeTab === "new") && (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          )}
          {(currentStep === 0 && activeTab === "new") && (
            <Button variant="outline" onClick={() => navigate("/")}>Skip</Button>
          )}
          {activeTab === "new" && (
            <Button onClick={handleNext}>
              {currentStep < 2 ? "Continue" : "Begin Journey"}
            </Button>
          )}
          {(activeTab !== "new" && currentStep === 0) && (
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomeFlow;
