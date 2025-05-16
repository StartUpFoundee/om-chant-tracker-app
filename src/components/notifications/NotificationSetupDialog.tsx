
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { 
  requestNotificationPermission, 
  saveNotificationPreferences, 
  getNotificationPreferences,
  sendTestNotification,
  NotificationPreferences
} from "@/lib/notification-system";

interface NotificationSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationSetupDialog = ({ 
  open, 
  onOpenChange 
}: NotificationSetupDialogProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    getNotificationPreferences()
  );
  const [step, setStep] = useState<'intro' | 'configure' | 'complete'>(
    preferences.status === 'granted' ? 'configure' : 'intro'
  );

  // Handle permission request
  const handlePermissionRequest = async (response: string) => {
    if (response === 'yes') {
      const permissionStatus = await requestNotificationPermission();
      
      if (permissionStatus === 'granted') {
        setPreferences(prev => ({...prev, status: 'granted'}));
        setStep('configure');
      } else if (permissionStatus === 'denied') {
        toast.error("Notification permission denied. You can enable it later in your browser settings.");
        saveNotificationPreferences({ status: 'denied', lastAsked: Date.now() });
        onOpenChange(false);
      } else {
        // Handle "pending" or "default" state
        saveNotificationPreferences({ status: 'pending', lastAsked: Date.now() });
        onOpenChange(false);
      }
    } else if (response === 'later') {
      saveNotificationPreferences({ status: 'pending', lastAsked: Date.now() });
      onOpenChange(false);
    } else {
      // User said no
      saveNotificationPreferences({ status: 'denied', lastAsked: Date.now() });
      onOpenChange(false);
    }
  };

  // Handle reminder count change
  const handleReminderCountChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      reminderCount: value === '2' ? 2 : 1
    }));
  };

  // Handle time changes
  const handleTimeChange = (timeType: 'morningTime' | 'eveningTime', time: string) => {
    setPreferences(prev => ({
      ...prev,
      [timeType]: time
    }));
  };

  // Save preferences
  const savePreferences = () => {
    saveNotificationPreferences(preferences);
    toast.success("Notification preferences saved successfully!");
    setStep('complete');
  };

  // Test notification
  const handleTestNotification = () => {
    if (sendTestNotification()) {
      toast.success("Test notification sent!");
    } else {
      toast.error("Failed to send test notification. Please check browser permissions.");
    }
  };

  // Complete setup
  const completeSetup = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Daily Practice Reminders</DialogTitle>
              <DialogDescription className="text-center">
                Would you like to receive gentle reminders for your spiritual practice?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center my-6">
              <div className="bg-muted p-4 rounded-lg shadow-inner">
                <div className="flex items-center gap-3 bg-background p-3 rounded border">
                  <div className="h-8 w-8 rounded-full bg-spiritual-gold flex items-center justify-center text-background font-bold">
                    ॐ
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">ॐ नाम जप ॐ</h4>
                    <p className="text-xs text-muted-foreground">Time for your daily mantra practice</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center gap-2 flex-wrap">
              <Button 
                variant="default" 
                onClick={() => handlePermissionRequest('yes')}
              >
                Yes, remind me daily
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handlePermissionRequest('later')}
              >
                Ask me later
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handlePermissionRequest('no')}
              >
                No, thank you
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'configure' && (
          <>
            <DialogHeader>
              <DialogTitle>Customize Your Reminders</DialogTitle>
              <DialogDescription>
                Set up daily reminders for your spiritual practice
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>How many reminders would you like per day?</Label>
                <RadioGroup 
                  value={preferences.reminderCount.toString()} 
                  onValueChange={handleReminderCountChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="r1" />
                    <Label htmlFor="r1">One reminder per day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="r2" />
                    <Label htmlFor="r2">Morning and evening reminders</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="morningTime">
                  {preferences.reminderCount === 1 ? "Reminder time" : "Morning reminder time"}
                </Label>
                <Input 
                  id="morningTime" 
                  type="time"
                  min="04:00" 
                  max="11:59" 
                  value={preferences.morningTime || "07:00"}
                  onChange={(e) => handleTimeChange('morningTime', e.target.value)}
                />
              </div>

              {preferences.reminderCount === 2 && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="eveningTime">Evening reminder time</Label>
                  <Input 
                    id="eveningTime" 
                    type="time"
                    min="12:00" 
                    max="22:00" 
                    value={preferences.eveningTime || "19:00"}
                    onChange={(e) => handleTimeChange('eveningTime', e.target.value)} 
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handleTestNotification}>
                  Test notification
                </Button>
                <Button onClick={savePreferences}>
                  Save preferences
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'complete' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Setup Complete!</DialogTitle>
              <DialogDescription className="text-center">
                Your reminders have been scheduled. You'll receive notifications at your chosen times.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center my-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white">
                  ✓
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={completeSetup} className="w-full">
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
