
// Types for spiritual journey milestones
export interface Milestone {
  id: string;
  title: string;
  description: string;
  requiredCount?: number;
  requiredStreak?: number;
  requiredDays?: number;
  isAchieved: boolean;
  progress: number;
}

// Predefined spiritual journey milestones
export const JOURNEY_MILESTONES: Omit<Milestone, 'isAchieved' | 'progress'>[] = [
  {
    id: 'FIRST_STEP',
    title: 'First Step',
    description: 'Begin your spiritual journey with your first mantra',
    requiredCount: 1,
  },
  {
    id: 'DAILY_PRACTICE',
    title: 'Daily Practice',
    description: 'Complete 7 consecutive days of mantra chanting',
    requiredStreak: 7,
  },
  {
    id: 'HABIT_FORMATION',
    title: 'Habit Formation',
    description: 'Maintain your practice for 21 consecutive days',
    requiredStreak: 21,
  },
  {
    id: 'SACRED_108',
    title: 'Sacred 108',
    description: 'Complete 108 mantras in your spiritual journey',
    requiredCount: 108,
  },
  {
    id: 'SPIRITUAL_DEDICATION',
    title: 'Spiritual Dedication',
    description: 'Reach 1,008 total mantras in your practice',
    requiredCount: 1008,
  },
  {
    id: 'DEEP_DEVOTION',
    title: 'Deep Devotion',
    description: 'Achieve 10,008 mantras in your lifetime practice',
    requiredCount: 10008,
  },
  {
    id: 'MONTHLY_DEVOTEE',
    title: 'Monthly Devotee',
    description: 'Practice mantra chanting for 30 consecutive days',
    requiredStreak: 30,
  },
  {
    id: 'SPIRITUAL_MASTER',
    title: 'Spiritual Master',
    description: 'Complete 108 days of consecutive practice',
    requiredStreak: 108,
  },
  {
    id: 'ENLIGHTENMENT_PATH',
    title: 'Enlightenment Path',
    description: 'Practice for 365 days, creating a foundation for enlightenment',
    requiredDays: 365, // Not necessarily consecutive
  }
];

// Get user's journey milestones
export const getUserJourneyMilestones = (): Milestone[] => {
  const milestoneData = localStorage.getItem('mantraJourneyMilestones');
  let milestones: Milestone[];
  
  if (!milestoneData) {
    // Initialize milestones if they don't exist yet
    milestones = JOURNEY_MILESTONES.map(milestone => ({
      ...milestone,
      isAchieved: false,
      progress: 0
    }));
    localStorage.setItem('mantraJourneyMilestones', JSON.stringify(milestones));
  } else {
    milestones = JSON.parse(milestoneData);
    
    // Check if we need to add new milestones that weren't previously defined
    const currentMilestoneIds = milestones.map(m => m.id);
    const newMilestones = JOURNEY_MILESTONES
      .filter(m => !currentMilestoneIds.includes(m.id))
      .map(m => ({
        ...m,
        isAchieved: false,
        progress: 0
      }));
    
    if (newMilestones.length > 0) {
      milestones = [...milestones, ...newMilestones];
      localStorage.setItem('mantraJourneyMilestones', JSON.stringify(milestones));
    }
  }
  
  return milestones;
};

// Update milestone progress based on current stats
export const updateMilestoneProgress = (stats: { 
  totalCount: number; 
  streak: number; 
  practiceDays?: number; // Total days with practice, not necessarily consecutive
}): { 
  milestones: Milestone[]; 
  newlyAchieved: Milestone[] 
} => {
  const milestones = getUserJourneyMilestones();
  const newlyAchieved: Milestone[] = [];
  
  // Get total practice days (approximated if not provided)
  const practiceDays = stats.practiceDays || Math.min(stats.totalCount / 10, stats.streak);
  
  const updatedMilestones = milestones.map(milestone => {
    let progress = 0;
    let isAchieved = milestone.isAchieved;
    
    // Calculate progress based on milestone type
    if (milestone.requiredCount) {
      progress = Math.min((stats.totalCount / milestone.requiredCount) * 100, 100);
      
      if (!isAchieved && stats.totalCount >= milestone.requiredCount) {
        isAchieved = true;
        newlyAchieved.push({...milestone, isAchieved, progress});
      }
    }
    else if (milestone.requiredStreak) {
      progress = Math.min((stats.streak / milestone.requiredStreak) * 100, 100);
      
      if (!isAchieved && stats.streak >= milestone.requiredStreak) {
        isAchieved = true;
        newlyAchieved.push({...milestone, isAchieved, progress});
      }
    }
    else if (milestone.requiredDays) {
      progress = Math.min((practiceDays / milestone.requiredDays) * 100, 100);
      
      if (!isAchieved && practiceDays >= milestone.requiredDays) {
        isAchieved = true;
        newlyAchieved.push({...milestone, isAchieved, progress});
      }
    }
    
    return {
      ...milestone,
      isAchieved,
      progress: Math.round(progress)
    };
  });
  
  // Save updated milestones to localStorage
  localStorage.setItem('mantraJourneyMilestones', JSON.stringify(updatedMilestones));
  
  return {
    milestones: updatedMilestones,
    newlyAchieved
  };
};

// Get the next milestone to display to the user
export const getNextMilestone = (): Milestone | null => {
  const milestones = getUserJourneyMilestones();
  
  // Find the first non-achieved milestone with the highest progress
  const unachievedMilestones = milestones
    .filter(m => !m.isAchieved)
    .sort((a, b) => b.progress - a.progress);
  
  return unachievedMilestones.length > 0 ? unachievedMilestones[0] : null;
};

// Calculate the total number of practice days from daily records
export const calculateTotalPracticeDays = (): number => {
  const dailyRecords = localStorage.getItem('mantraDailyRecords');
  if (!dailyRecords) return 0;
  
  const records = JSON.parse(dailyRecords);
  return records.length;
};
