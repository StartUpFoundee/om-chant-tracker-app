
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import { importIdentityFromText, importIdentityFromFile, applyImportedIdentity, mergeImportedIdentity } from "@/lib/user-identity";
import { QrScanner } from "./QrScanner";

interface ImportIdentityFormProps {
  onComplete: () => void;
}

export const ImportIdentityForm = ({ onComplete }: ImportIdentityFormProps) => {
  const [identityCode, setIdentityCode] = useState("");
  const [importMethod, setImportMethod] = useState("replace");
  const [isLoading, setIsLoading] = useState(false);
  const [importTab, setImportTab] = useState("code");
  
  const handleImport = async () => {
    try {
      setIsLoading(true);
      
      if (!identityCode.trim()) {
        toast("Please enter your identity code");
        setIsLoading(false);
        return;
      }
      
      const importedData = importIdentityFromText(identityCode);
      if (!importedData) {
        toast("Invalid identity code", {
          description: "Please check your code and try again"
        });
        setIsLoading(false);
        return;
      }
      
      if (importMethod === "replace") {
        applyImportedIdentity(importedData);
      } else {
        mergeImportedIdentity(importedData);
      }
      
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 1000);
      
    } catch (error) {
      console.error("Import error:", error);
      toast("Failed to import identity", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      const importedData = await importIdentityFromFile(file);
      
      if (!importedData) {
        toast("Invalid identity file");
        setIsLoading(false);
        return;
      }
      
      if (importMethod === "replace") {
        applyImportedIdentity(importedData);
      } else {
        mergeImportedIdentity(importedData);
      }
      
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 1000);
      
    } catch (error) {
      console.error("File import error:", error);
      toast("Failed to import identity file", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      setIsLoading(false);
    }
  };
  
  const handleQrCodeScanned = (data: string) => {
    setIdentityCode(data);
    setImportTab("code");
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={importTab} onValueChange={setImportTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="code" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="identity-code">Your Identity Code</Label>
            <Input
              id="identity-code"
              placeholder="Enter your OM-IDENTITY code"
              value={identityCode}
              onChange={(e) => setIdentityCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste the code that starts with OM-IDENTITY:
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="qr" className="mt-4">
          <div className="flex flex-col items-center">
            <QrScanner onScan={handleQrCodeScanned} />
            <p className="text-xs text-muted-foreground mt-2">
              Scan the QR code from your other device
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="file" className="mt-4">
          <div>
            <Label htmlFor="identity-file">Upload Identity File</Label>
            <Input
              id="identity-file"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select the spiritual journey JSON file
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-3 pt-4">
        <Label>Import Method</Label>
        <RadioGroup
          value={importMethod}
          onValueChange={setImportMethod}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="replace" id="replace" />
            <Label htmlFor="replace">Replace Current Data</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="merge" id="merge" />
            <Label htmlFor="merge">Merge Journeys</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          Replace: Use this on a new device.<br />
          Merge: Combine mantra counts from both devices.
        </p>
      </div>
      
      <Button 
        onClick={handleImport} 
        disabled={isLoading} 
        className="w-full mt-4"
      >
        {isLoading ? "Importing..." : "Import Journey"}
      </Button>
    </div>
  );
};
