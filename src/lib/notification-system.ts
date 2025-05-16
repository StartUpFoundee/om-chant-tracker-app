
// Notification types and interfaces
export type NotificationPermissionStatus = "granted" | "denied" | "pending" | "default";

export interface NotificationPreferences {
  status: NotificationPermissionStatus;
  reminderCount: 1 | 2;
  morningTime?: string; // 24hr format
  eveningTime?: string; // 24hr format
  lastNotified?: number; // timestamp
  lastAsked?: number; // if pending, when we last asked
  messageIndex?: number; // rotate through message templates
  targetCount?: number; // User's target count for mantras
  showDailyPermissionPopup?: boolean; // Whether to show daily permission popup
  lastPermissionPopupDate?: string; // Date when the permission popup was last shown
}

// Default notification messages
const NOTIFICATION_MESSAGES = [
  "Time for your daily mantra practice. ॐ नमः शिवाय",
  "Your soul is calling. Take a moment for your mantra practice.",
  "Peace awaits in the silence of your mantra recitation.",
  "A few moments of mantra practice can transform your entire day.",
  "Remember to connect with your spiritual self through mantra today.",
  "Your daily mantra awaits. Find a quiet moment to practice.",
  "Divine energy flows through the chanting of sacred mantras.",
  "ॐ - The universe is calling you to your daily practice.",
  "Spiritual growth happens one mantra at a time.",
  "Center yourself with your daily mantra practice."
];

// The morning and evening messages are slightly different
const MORNING_MESSAGES = [
  "Begin your day with spiritual intention. Time for your morning mantras.",
  "Let your mantra practice set the tone for a peaceful day.",
  "Greet the sun with the sacred sound of your mantra.",
  "Morning is the perfect time to connect with your higher self through mantras."
];

const EVENING_MESSAGES = [
  "Close your day with the sacred vibrations of your mantra practice.",
  "Before rest, take time to reconnect through mantra chanting.",
  "Evening mantras help release the day's tensions and prepare for peaceful rest.",
  "Complete your spiritual circle with evening mantra practice."
];

// Default preferences
const DEFAULT_PREFERENCES: NotificationPreferences = {
  status: "pending",
  reminderCount: 1,
  morningTime: "07:00",
  eveningTime: "19:00",
  messageIndex: 0,
  showDailyPermissionPopup: true,
  lastPermissionPopupDate: ""
};

// Get notification preferences from localStorage
export const getNotificationPreferences = (): NotificationPreferences => {
  const savedPrefs = localStorage.getItem("notificationPreferences");
  if (savedPrefs) {
    return JSON.parse(savedPrefs);
  }
  return DEFAULT_PREFERENCES;
};

// Save notification preferences to localStorage
export const saveNotificationPreferences = (preferences: Partial<NotificationPreferences>) => {
  const currentPrefs = getNotificationPreferences();
  const updatedPrefs = { ...currentPrefs, ...preferences };
  localStorage.setItem("notificationPreferences", JSON.stringify(updatedPrefs));
  return updatedPrefs;
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<NotificationPermissionStatus> => {
  if (!("Notification" in window)) {
    return "denied";
  }
  
  try {
    const permission = await Notification.requestPermission();
    saveNotificationPreferences({ 
      status: permission as NotificationPermissionStatus,
      lastAsked: Date.now() 
    });
    return permission as NotificationPermissionStatus;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
};

// Check if we should show the daily permission popup
export const shouldShowDailyPermissionPopup = (): boolean => {
  const prefs = getNotificationPreferences();
  
  // If permission already granted or popups are disabled, don't show
  if (prefs.status === "granted" || prefs.showDailyPermissionPopup === false) {
    return false;
  }
  
  // Check if we've already shown the popup today
  const today = new Date().toDateString();
  if (prefs.lastPermissionPopupDate === today) {
    return false;
  }
  
  return prefs.status === "denied" || prefs.status === "pending";
};

// Mark that we've shown the permission popup today
export const markPermissionPopupShown = () => {
  const today = new Date().toDateString();
  saveNotificationPreferences({ lastPermissionPopupDate: today });
};

// Send a test notification
export const sendTestNotification = () => {
  const prefs = getNotificationPreferences();
  
  if (prefs.status !== "granted") {
    return false;
  }
  
  try {
    const notification = new Notification("ॐ नाम जप ॐ", {
      body: "This is a test notification. Your reminders will look like this.",
      icon: "/favicon.ico"
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return true;
  } catch (error) {
    console.error("Error sending test notification:", error);
    return false;
  }
};

// Send an actual reminder notification
export const sendReminderNotification = (isMorning = true) => {
  const prefs = getNotificationPreferences();
  
  if (prefs.status !== "granted") {
    return false;
  }
  
  try {
    // Choose message based on time of day and rotate through options
    let messages = NOTIFICATION_MESSAGES;
    if (isMorning) {
      messages = [...MORNING_MESSAGES, ...NOTIFICATION_MESSAGES];
    } else {
      messages = [...EVENING_MESSAGES, ...NOTIFICATION_MESSAGES];
    }
    
    const messageIndex = (prefs.messageIndex || 0) % messages.length;
    const message = messages[messageIndex];
    
    // Create and send notification
    const notification = new Notification("ॐ नाम जप ॐ", {
      body: message,
      icon: "/favicon.ico"
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    // Update preferences with last notification time and next message index
    saveNotificationPreferences({
      lastNotified: Date.now(),
      messageIndex: messageIndex + 1
    });
    
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

// Check if it's time to send notifications based on user preferences
export const checkNotificationSchedule = () => {
  const prefs = getNotificationPreferences();
  
  if (prefs.status !== "granted") {
    return;
  }
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  // Check morning reminder
  if (prefs.morningTime && currentTime === prefs.morningTime) {
    sendReminderNotification(true);
  }
  
  // Check evening reminder
  if (prefs.reminderCount === 2 && prefs.eveningTime && currentTime === prefs.eveningTime) {
    sendReminderNotification(false);
  }
};

// Format time for display (convert 24h to 12h format)
export const formatTimeForDisplay = (time24h: string): string => {
  const [hours, minutes] = time24h.split(':').map(Number);
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Convert 12h format to 24h format
export const convertTo24HourFormat = (time12h: string): string => {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Initialize notification system
export const initializeNotificationSystem = () => {
  // Check for notifications every minute
  setInterval(() => {
    checkNotificationSchedule();
  }, 60000); // every minute
  
  // Also check on page load
  checkNotificationSchedule();
};
