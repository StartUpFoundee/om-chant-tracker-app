
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationSetupDialog } from './NotificationSetupDialog';
import { getNotificationPreferences } from '@/lib/notification-system';

export const ReminderIcon = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  
  useEffect(() => {
    const checkNotificationStatus = () => {
      const prefs = getNotificationPreferences();
      
      // Show the icon if:
      // 1. User hasn't made a decision yet (pending)
      // 2. User selected "ask me later" and it's been at least 3 days
      if (prefs.status === 'pending') {
        const lastAsked = prefs.lastAsked || 0;
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
        
        if (!lastAsked || Date.now() - lastAsked > threeDaysInMs) {
          setShouldShow(true);
        }
      }
    };
    
    checkNotificationStatus();
    
    // Check every hour
    const interval = setInterval(checkNotificationStatus, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!shouldShow) {
    return null;
  }
  
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-4 rounded-full shadow-md bg-background hover:bg-muted z-50"
        onClick={() => setDialogOpen(true)}
        title="Setup daily reminders"
      >
        <Bell className="h-5 w-5" />
      </Button>
      
      <NotificationSetupDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  );
};
