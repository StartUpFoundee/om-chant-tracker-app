
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMantraStats, getDailyRecords, getDailyContent } from "@/lib/mantra-storage";
import { AdContainer } from "@/components/AdContainer";

const Dashboard = () => {
  const [stats, setStats] = useState(getMantraStats());
  const [dailyRecords, setDailyRecords] = useState(getDailyRecords());
  const [quote, setQuote] = useState(getDailyContent().quote);
  
  // Get badges based on achievements
  const getBadges = () => {
    const badges = [];
    
    if (stats.achievements.includes('108_TOTAL')) {
      badges.push({ title: 'Beginner', description: 'Completed 108 mantras' });
    }
    
    if (stats.achievements.includes('1008_TOTAL')) {
      badges.push({ title: 'Dedicated', description: 'Completed 1008 mantras' });
    }
    
    if (stats.achievements.includes('10008_TOTAL')) {
      badges.push({ title: 'Master', description: 'Completed 10,008 mantras' });
    }
    
    if (stats.achievements.includes('7_DAYS_STREAK')) {
      badges.push({ title: 'Weekly Practice', description: '7 day streak' });
    }
    
    if (stats.achievements.includes('21_DAYS_STREAK')) {
      badges.push({ title: 'Habit Formed', description: '21 day streak' });
    }
    
    if (stats.achievements.includes('108_DAYS_STREAK')) {
      badges.push({ title: 'Devoted', description: '108 day streak' });
    }
    
    // If no achievements yet, show a default badge
    if (badges.length === 0) {
      badges.push({ title: 'Seeker', description: 'Started the spiritual journey' });
    }
    
    return badges;
  };
  
  // Get next achievement
  const getNextAchievement = () => {
    if (!stats.achievements.includes('108_TOTAL')) {
      const progress = (stats.totalCount / 108) * 100;
      return { 
        title: 'Beginner', 
        required: 108,
        current: stats.totalCount,
        progress: Math.min(progress, 100)
      };
    }
    
    if (!stats.achievements.includes('1008_TOTAL')) {
      const progress = (stats.totalCount / 1008) * 100;
      return { 
        title: 'Dedicated', 
        required: 1008,
        current: stats.totalCount,
        progress: Math.min(progress, 100)
      };
    }
    
    if (!stats.achievements.includes('10008_TOTAL')) {
      const progress = (stats.totalCount / 10008) * 100;
      return { 
        title: 'Master', 
        required: 10008,
        current: stats.totalCount,
        progress: Math.min(progress, 100)
      };
    }
    
    if (!stats.achievements.includes('7_DAYS_STREAK')) {
      const progress = (stats.streak / 7) * 100;
      return { 
        title: 'Weekly Practice', 
        required: 7,
        current: stats.streak,
        progress: Math.min(progress, 100)
      };
    }
    
    if (!stats.achievements.includes('21_DAYS_STREAK')) {
      const progress = (stats.streak / 21) * 100;
      return { 
        title: 'Habit Formed', 
        required: 21,
        current: stats.streak,
        progress: Math.min(progress, 100)
      };
    }
    
    if (!stats.achievements.includes('108_DAYS_STREAK')) {
      const progress = (stats.streak / 108) * 100;
      return { 
        title: 'Devoted', 
        required: 108,
        current: stats.streak,
        progress: Math.min(progress, 100)
      };
    }
    
    return { 
      title: 'Enlightened', 
      required: 1,
      current: 1,
      progress: 100 
    };
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const recordsMap = new Map();
    
    // Create a map for quick lookup
    dailyRecords.forEach(record => {
      recordsMap.set(record.date, record.count);
    });
    
    // Add days from previous month to start on right weekday
    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        count: 0
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date,
        isCurrentMonth: true,
        count: recordsMap.get(dateString) || 0,
        isToday: i === today.getDate()
      });
    }
    
    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        count: 0
      });
    }
    
    return days;
  };
  
  const nextAchievement = getNextAchievement();
  const badges = getBadges();
  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-md px-4">
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">
          Spiritual Dashboard
        </h1>
        
        <AdContainer position="top" />
        
        {/* Quote of the Day */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quote of the Day</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="italic text-muted-foreground">
              "{quote}"
            </blockquote>
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {badge.title}
                </Badge>
              ))}
            </div>
            
            {/* Next Achievement Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span>Next achievement: {nextAchievement.title}</span>
                <span>{nextAchievement.current}/{nextAchievement.required}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-spiritual-gold"
                  style={{ width: `${nextAchievement.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <AdContainer position="middle" />
        
        {/* Calendar View */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Practice Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center text-xs rounded-sm ${
                    day.isCurrentMonth 
                      ? day.count > 0
                        ? 'bg-spiritual-gold/20 font-medium'
                        : 'bg-secondary'
                      : 'bg-muted text-muted-foreground/50'
                  } ${
                    day.isToday ? 'ring-2 ring-spiritual-gold' : ''
                  }`}
                >
                  <span>{day.date.getDate()}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-spiritual-gold/20 mr-1 rounded-sm"></div>
                <span>Practiced</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary mr-1 rounded-sm"></div>
                <span>No Practice</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Today's Total:</span>
                <span className="font-medium">{stats.todayCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Lifetime Total:</span>
                <span className="font-medium">{stats.totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="font-medium">{stats.streak} days</span>
              </div>
              <div className="flex justify-between">
                <span>Last 7 Days Average:</span>
                <span className="font-medium">
                  {dailyRecords
                    .slice(0, 7)
                    .reduce((sum, record) => sum + record.count, 0) / Math.min(7, dailyRecords.length) || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <AdContainer position="bottom" />
      </div>
      <NavBar />
    </div>
  );
};

export default Dashboard;
