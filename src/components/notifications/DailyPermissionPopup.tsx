
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  requestNotificationPermission,
  shouldShowDailyPermissionPopup,
  markPermissionPopupShown
} from "@/lib/notification-system";
import { toast } from "sonner";

export const DailyPermissionPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if we should show the popup
    const checkAndShowPopup = () => {
      if (shouldShowDailyPermissionPopup()) {
        setOpen(true);
        markPermissionPopupShown();
      }
    };

    // Check when component mounts with a small delay to avoid interrupting initial page load
    const timer = setTimeout(checkAndShowPopup, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePermissionRequest = async (response: string) => {
    if (response === 'yes') {
      const permissionStatus = await requestNotificationPermission();
      
      if (permissionStatus === 'granted') {
        toast.success("Great! You'll now receive daily reminders for your mantra practice.");
      } else {
        toast.error("We couldn't set up notifications. You can try again in settings.");
      }
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
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
            variant="ghost" 
            onClick={() => handlePermissionRequest('no')}
          >
            No, thank you
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
