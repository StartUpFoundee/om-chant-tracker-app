
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/theme-provider";
import { getSettings, updateSettings } from "@/lib/mantra-storage";
import { useToast } from "@/hooks/use-toast";
import { AdContainer } from "@/components/AdContainer";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [settings, setSettings] = useState(getSettings());
  
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    
    setSettings(newSettings);
    updateSettings({ [key]: value });
    
    toast({
      title: "Settings Updated",
      description: `${key} has been updated.`,
    });
  };
  
  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: "ॐ नाम जप ॐ - Mantra Counter App",
        text: "Track your daily mantra practice with this beautiful app!",
        url: window.location.origin
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link Copied",
        description: "App link copied to clipboard!",
      });
    }
  };
  
  const handleClearData = () => {
    if (confirm("Are you sure you want to reset all your data? This cannot be undone.")) {
      localStorage.removeItem('mantraStats');
      localStorage.removeItem('mantraDailyRecords');
      
      toast({
        title: "Data Reset",
        description: "All your mantra data has been reset.",
        variant: "destructive"
      });
      
      // Reload the page to refresh the stats
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-md px-4">
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">
          Settings
        </h1>
        
        <AdContainer position="top" />
        
        {/* Appearance Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value) => {
                  setTheme(value as "light" | "dark" | "system");
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select
                value={settings.fontSize}
                onValueChange={(value) => handleSettingChange('fontSize', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Font Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="color-scheme">Color Scheme</Label>
              <Select
                value={settings.colorScheme}
                onValueChange={(value) => handleSettingChange('colorScheme', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Color Scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spiritual-gold">Spiritual Gold</SelectItem>
                  <SelectItem value="sacred-orange">Sacred Orange</SelectItem>
                  <SelectItem value="peaceful-blue">Peaceful Blue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Animations</Label>
              <Switch
                id="animations"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <AdContainer position="middle" />
        
        {/* Sound Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Sound</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">Background Sound</Label>
              <RadioGroup
                value={settings.backgroundSound}
                onValueChange={(value) => handleSettingChange('backgroundSound', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="forest" id="forest" />
                  <Label htmlFor="forest">Forest Ambience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bells" id="bells" />
                  <Label htmlFor="bells">Temple Bells</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="mb-2 block">Completion Chime</Label>
              <RadioGroup
                value={settings.completionChime}
                onValueChange={(value) => handleSettingChange('completionChime', value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bell" id="bell" />
                  <Label htmlFor="bell">Bell</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bowl" id="bowl" />
                  <Label htmlFor="bowl">Singing Bowl</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none-chime" />
                  <Label htmlFor="none-chime">No Sound</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        {/* Language Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Language</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={settings.language}
              onValueChange={(value) => handleSettingChange('language', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hindi" id="hindi" />
                <Label htmlFor="hindi">Hindi</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* App Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">App Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleShareApp}
              className="w-full"
              variant="outline"
            >
              Share App
            </Button>
            
            <Button 
              onClick={handleClearData}
              className="w-full" 
              variant="destructive"
            >
              Reset All Data
            </Button>
          </CardContent>
        </Card>
        
        <AdContainer position="bottom" />
      </div>
      <NavBar />
    </div>
  );
};

export default Settings;
