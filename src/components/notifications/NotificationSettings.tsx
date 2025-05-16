
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  getNotificationPreferences, 
  saveNotificationPreferences,
  requestNotificationPermission,
  sendTestNotification,
  NotificationPermissionStatus
} from "@/lib/notification-system";

export const NotificationSettings = () => {
  const [preferences, setPreferences] = useState(getNotificationPreferences());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>(
    preferences.status
  );
  
  // Toggle notifications on/off
  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && permissionStatus !== "granted") {
      const newStatus = await requestNotificationPermission();
      setPermissionStatus(newStatus);
      
      if (newStatus !== "granted") {
        toast.error("Notification permission is required to enable reminders");
        return;
      }
    }
    
    const updatedPrefs = saveNotificationPreferences({
      status: enabled ? "granted" : "denied"
    });
    
    setPreferences(updatedPrefs);
    toast.success(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  // Handle reminder count change
  const handleReminderCountChange = (value: string) => {
    const reminderCount = value === "2" ? 2 : 1;
    const updatedPrefs = saveNotificationPreferences({ reminderCount });
    setPreferences(updatedPrefs);
  };
  
  // Handle time changes
  const handleTimeChange = (type: 'morningTime' | 'eveningTime', value: string) => {
    const updatedPrefs = saveNotificationPreferences({ [type]: value });
    setPreferences(updatedPrefs);
  };
  
  // Handle test notification
  const handleTestNotification = () => {
    if (sendTestNotification()) {
      toast.success("Test notification sent!");
    } else {
      toast.error("Failed to send test notification. Please check permissions.");
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Notification Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-enabled">Enable Daily Reminders</Label>
          <Switch
            id="notifications-enabled"
            checked={preferences.status === "granted"}
            onCheckedChange={handleToggleNotifications}
          />
        </div>
        
        {preferences.status === "granted" && (
          <>
            <div className="flex flex-col gap-2 pt-2">
              <Label>Reminder Frequency</Label>
              <RadioGroup
                value={preferences.reminderCount.toString()}
                onValueChange={handleReminderCountChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="r1" />
                  <Label htmlFor="r1">Once daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="r2" />
                  <Label htmlFor="r2">Morning and evening</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="morningTime">
                {preferences.reminderCount === 1 ? "Reminder time" : "Morning reminder time"}
              </Label>
              <Input
                type="time"
                id="morningTime"
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
                  type="time"
                  id="eveningTime"
                  min="12:00"
                  max="22:00"
                  value={preferences.eveningTime || "19:00"}
                  onChange={(e) => handleTimeChange('eveningTime', e.target.value)}
                />
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleTestNotification}
              className="w-full"
            >
              Send Test Notification
            </Button>
          </>
        )}
        
        {preferences.status === "denied" && (
          <p className="text-sm text-muted-foreground">
            Notifications are currently disabled. Enable them in your browser settings
            or use the toggle above to request permission again.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
