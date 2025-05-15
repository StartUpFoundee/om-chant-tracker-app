
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { getUserIdentity, exportIdentityToText, exportIdentityToFile, spiritualSymbols, resetUserIdentity } from "@/lib/user-identity";
import { getMantraStats } from "@/lib/mantra-storage";
import { generateQRCode } from "@/lib/qr-helper";
import { Copy, Download, QrCode } from "lucide-react";

export const UserProfile = () => {
  const [identity, setIdentity] = useState(getUserIdentity());
  const [stats, setStats] = useState(getMantraStats());
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [exportCode, setExportCode] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  useEffect(() => {
    // Update stats whenever profile is viewed
    setStats(getMantraStats());
    setIdentity(getUserIdentity());
  }, []);
  
  const handleGenerateQRCode = async () => {
    try {
      const exportText = exportIdentityToText();
      setExportCode(exportText);
      const qrCode = await generateQRCode(exportText);
      setQrCodeData(qrCode);
      setQrCodeOpen(true);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      toast("Failed to generate QR code");
    }
  };
  
  const handleCopyCode = () => {
    const exportText = exportIdentityToText();
    navigator.clipboard.writeText(exportText);
    toast("Identity code copied to clipboard");
  };
  
  const handleDownloadIdentity = () => {
    exportIdentityToFile();
    toast("Identity file downloaded");
  };
  
  const handleResetIdentity = () => {
    setResetDialogOpen(false);
    resetUserIdentity();
    toast("Your spiritual journey has been reset");
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  if (!identity) {
    return null;
  }
  
  const userSymbol = spiritualSymbols.find(s => s.id === identity.symbolId) || spiritualSymbols[0];
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Spiritual Profile</span>
            <span className="text-2xl">{userSymbol.symbol}</span>
          </CardTitle>
          <CardDescription>Your unique spiritual identity</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-3xl">
              {userSymbol.symbol}
            </div>
            
            <div>
              <h3 className="font-medium text-lg">{identity.spiritualName}</h3>
              <p className="text-sm text-muted-foreground">
                Journey began on {formatDate(identity.creationDate)}
              </p>
            </div>
          </div>
          
          <div className="pt-2 space-y-3">
            <div>
              <p className="text-sm font-medium">Unique Identity Code</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">{identity.uniqueId}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Spiritual Statistics</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Total Mantras</p>
                  <p className="font-medium">{stats.totalCount.toLocaleString()}</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                  <p className="font-medium">{stats.streak} days</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Practice Days</p>
                  <p className="font-medium">{stats.practiceDays || 0} days</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Achievements</p>
                  <p className="font-medium">{stats.achievements.length}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex space-x-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleCopyCode}>
              <Copy className="h-4 w-4 mr-1" /> Copy Code
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleGenerateQRCode}>
              <QrCode className="h-4 w-4 mr-1" /> QR Code
            </Button>
          </div>
          
          <div className="flex space-x-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handleDownloadIdentity}>
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1" 
              onClick={() => setResetDialogOpen(true)}
            >
              Reset Journey
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* QR Code Dialog */}
      <Dialog open={qrCodeOpen} onOpenChange={setQrCodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Spiritual Identity QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code from another device to continue your journey
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            {qrCodeData && (
              <img 
                src={qrCodeData} 
                alt="QR Code" 
                className="w-64 h-64 border rounded"
              />
            )}
            <p className="text-xs text-muted-foreground mt-4 text-center">
              This QR code contains your spiritual identity and progress
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setQrCodeOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Your Spiritual Journey?</DialogTitle>
            <DialogDescription>
              This will permanently delete all your mantra counts and achievements. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleResetIdentity}>Reset Journey</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
