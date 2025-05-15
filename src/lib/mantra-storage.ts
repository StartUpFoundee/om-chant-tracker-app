export interface MantraStats {
  todayCount: number;
  totalCount: number;
  streak: number;
  lastChantDate: string;
  achievements: string[];
  practiceDays?: number; // Total days of practice
}

export interface DailyRecord {
  date: string;
  count: number;
}

// Format date as YYYY-MM-DD
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Initialize stats if not exists
const initStats = (): MantraStats => {
  return {
    todayCount: 0,
    totalCount: 0,
    streak: 0,
    lastChantDate: getTodayDateString(),
    achievements: [],
    practiceDays: 0
  };
};

// Get stats from localStorage
export const getMantraStats = (): MantraStats => {
  const stats = localStorage.getItem('mantraStats');
  if (!stats) {
    const initialStats = initStats();
    localStorage.setItem('mantraStats', JSON.stringify(initialStats));
    return initialStats;
  }
  
  const parsedStats: MantraStats = JSON.parse(stats);
  
  // Check for day change to reset todayCount
  const today = getTodayDateString();
  if (parsedStats.lastChantDate !== today) {
    // Check if the last chant was yesterday to maintain streak
    const lastDate = new Date(parsedStats.lastChantDate);
    const todayDate = new Date(today);
    
    const timeDiff = todayDate.getTime() - lastDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff === 1) {
      // Last chant was yesterday, maintain streak
    } else if (daysDiff > 1) {
      // Streak broken
      parsedStats.streak = 0;
    }
    
    // Reset today's count
    parsedStats.todayCount = 0;
    parsedStats.lastChantDate = today;
    localStorage.setItem('mantraStats', JSON.stringify(parsedStats));
  }
  
  // Calculate practice days if not present
  if (parsedStats.practiceDays === undefined) {
    const dailyRecords = getDailyRecords();
    parsedStats.practiceDays = dailyRecords.length;
    localStorage.setItem('mantraStats', JSON.stringify(parsedStats));
  }
  
  return parsedStats;
};

// Import the milestone functions
import { updateMilestoneProgress } from './spiritual-journey';

// Update mantra count
export const updateMantraCount = (count: number = 1): MantraStats => {
  const stats = getMantraStats();
  
  const today = getTodayDateString();
  if (stats.lastChantDate !== today) {
    stats.lastChantDate = today;
    stats.todayCount = 0;
    stats.streak += 1;
  }
  
  stats.todayCount += count;
  stats.totalCount += count;
  
  // Update daily records
  const dailyRecords: DailyRecord[] = getDailyRecords();
  const todayRecord = dailyRecords.find(record => record.date === today);
  
  if (todayRecord) {
    todayRecord.count += count;
  } else {
    dailyRecords.push({
      date: today,
      count: count
    });
    
    // Increment practice days when we have a new day
    stats.practiceDays = (stats.practiceDays || 0) + 1;
  }
  
  // Only keep records for the last 30 days
  const filteredRecords = dailyRecords.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 30);
  
  localStorage.setItem('mantraDailyRecords', JSON.stringify(filteredRecords));
  localStorage.setItem('mantraStats', JSON.stringify(stats));
  
  // Check for achievements
  const achievements = checkAchievements(stats);
  
  // Update milestone progress
  updateMilestoneProgress({
    totalCount: stats.totalCount,
    streak: stats.streak,
    practiceDays: stats.practiceDays
  });
  
  return stats;
};

// Get daily records
export const getDailyRecords = (): DailyRecord[] => {
  const records = localStorage.getItem('mantraDailyRecords');
  return records ? JSON.parse(records) : [];
};

// Check for achievements
const checkAchievements = (stats: MantraStats) => {
  const achievements = [];
  
  // Total count achievements
  if (stats.totalCount >= 108 && !stats.achievements.includes('108_TOTAL')) {
    achievements.push('108_TOTAL');
  }
  
  if (stats.totalCount >= 1008 && !stats.achievements.includes('1008_TOTAL')) {
    achievements.push('1008_TOTAL');
  }
  
  if (stats.totalCount >= 10008 && !stats.achievements.includes('10008_TOTAL')) {
    achievements.push('10008_TOTAL');
  }
  
  // Streak achievements
  if (stats.streak >= 7 && !stats.achievements.includes('7_DAYS_STREAK')) {
    achievements.push('7_DAYS_STREAK');
  }
  
  if (stats.streak >= 21 && !stats.achievements.includes('21_DAYS_STREAK')) {
    achievements.push('21_DAYS_STREAK');
  }
  
  if (stats.streak >= 108 && !stats.achievements.includes('108_DAYS_STREAK')) {
    achievements.push('108_DAYS_STREAK');
  }
  
  if (achievements.length > 0) {
    stats.achievements = [...stats.achievements, ...achievements];
    localStorage.setItem('mantraStats', JSON.stringify(stats));
    
    // Return new achievements for notification
    return achievements;
  }
  
  return [];
};

// Get settings
export const getSettings = () => {
  const settings = localStorage.getItem('mantraSettings');
  return settings ? JSON.parse(settings) : {
    theme: 'light',
    colorScheme: 'spiritual-gold',
    backgroundSound: 'none',
    completionChime: 'bell',
    language: 'english',
    fontSize: 'medium',
    animationsEnabled: true
  };
};

// Update settings
export const updateSettings = (newSettings: any) => {
  localStorage.setItem('mantraSettings', JSON.stringify({
    ...getSettings(),
    ...newSettings
  }));
};

// Get daily mantra/quote
export const getDailyContent = () => {
  const mantras = [
    {
      text: "ॐ नमः शिवाय",
      translation: "Om Namah Shivaya - I bow to Shiva",
      meaning: "This mantra is dedicated to Lord Shiva and signifies the unity of individual consciousness with the supreme consciousness."
    },
    {
      text: "ॐ गं गणपतये नमः",
      translation: "Om Gam Ganapataye Namaha",
      meaning: "This mantra is dedicated to Lord Ganesha, the remover of obstacles and patron of arts and sciences."
    },
    {
      text: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे, हरे राम हरे राम, राम राम हरे हरे",
      translation: "Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare",
      meaning: "This mantra invokes the energy of divine love and devotion."
    },
    {
      text: "ॐ मणि पद्मे हूँ",
      translation: "Om Mani Padme Hum",
      meaning: "The jewel in the lotus; this mantra embodies the compassion of all Buddhas."
    },
    {
      text: "ॐ श्री गुरुभ्यो नमः",
      translation: "Om Sri Gurubhyo Namaha",
      meaning: "I offer my respectful obeisances unto the spiritual masters."
    }
  ];

  const quotes = [
    "Silence is the language of God, all else is poor translation.",
    "When you repeat the name of God, it creates a sacred vibration in your being.",
    "Mantras are like spiritual passwords; they help us access higher states of consciousness.",
    "Your breath is the bridge between your body and mind - use it to carry the divine name.",
    "In the repetition of a mantra, you find the eternal in the moment.",
    "Chanting is a way of getting in touch with yourself; it's an exploration of your spiritual heart.",
    "When mind, breath, and mantra become one, that is true meditation."
  ];

  // Use date as seed for pseudo-random selection
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const seed = dateString.split('-').reduce((a, b) => a + parseInt(b), 0);
  
  const mantraIndex = seed % mantras.length;
  const quoteIndex = (seed * 13) % quotes.length; // Different formula for quotes
  
  return {
    mantra: mantras[mantraIndex],
    quote: quotes[quoteIndex]
  };
};
