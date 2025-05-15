
// Define challenge types and interfaces
export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  category: "mantra" | "meditation" | "mindfulness" | "devotion";
  targetCount?: number;
  difficulty: 1 | 2 | 3; // 1 = easy, 2 = medium, 3 = hard
}

// The predefined challenges that will rotate algorithmically
const PREDEFINED_CHALLENGES: DailyChallenge[] = [
  {
    id: "om-108",
    title: "Sacred 108",
    description: "Chant Om Namah Shivaya 108 times with full concentration",
    category: "mantra",
    targetCount: 108,
    difficulty: 2,
  },
  {
    id: "morning-mantras",
    title: "Dawn Vibrations",
    description: "Chant any mantra of your choice for 10 minutes at sunrise",
    category: "mantra",
    difficulty: 1,
  },
  {
    id: "silent-meditation",
    title: "Inner Silence",
    description: "Practice 15 minutes of silent meditation focusing on the space between thoughts",
    category: "meditation",
    difficulty: 2,
  },
  {
    id: "gratitude-practice",
    title: "Heart of Gratitude",
    description: "Mentally recite 21 things you're grateful for while chanting",
    category: "mindfulness",
    targetCount: 21,
    difficulty: 1,
  },
  {
    id: "continuous-chanting",
    title: "Unbroken Flow",
    description: "Chant continuously for 20 minutes without interruption",
    category: "mantra",
    difficulty: 2,
  },
  {
    id: "breath-mantra",
    title: "Breath Synchronization",
    description: "Synchronize your breath with 54 repetitions of a short mantra",
    category: "mantra",
    targetCount: 54,
    difficulty: 2,
  },
  {
    id: "visualization-practice",
    title: "Divine Visualization",
    description: "Visualize a deity or spiritual symbol while chanting 27 mantras",
    category: "devotion",
    targetCount: 27,
    difficulty: 1,
  },
  {
    id: "walking-mantra",
    title: "Walking Meditation",
    description: "Recite mantras while walking mindfully for 10 minutes",
    category: "mindfulness",
    difficulty: 1,
  },
  {
    id: "selfless-service",
    title: "Karma Yoga",
    description: "Perform an act of service while mentally reciting a mantra",
    category: "devotion",
    difficulty: 1,
  },
  {
    id: "evening-ritual",
    title: "Twilight Sadhana",
    description: "Create an evening ritual with 108 mantras before sleep",
    category: "mantra",
    targetCount: 108,
    difficulty: 2,
  },
  {
    id: "sound-silence",
    title: "Sound and Silence",
    description: "Alternate between chanting aloud and silent meditation for 15 minutes",
    category: "meditation",
    difficulty: 2,
  },
  {
    id: "intention-setting",
    title: "Sacred Intention",
    description: "Set a specific intention and chant 54 mantras dedicated to it",
    category: "mindfulness",
    targetCount: 54,
    difficulty: 2,
  },
  {
    id: "mantra-writing",
    title: "Written Devotion",
    description: "Write a mantra 11 times while maintaining complete focus",
    category: "devotion",
    targetCount: 11,
    difficulty: 1,
  },
  {
    id: "nature-connection",
    title: "Nature Harmony",
    description: "Practice mantras outdoors near a natural element for 10 minutes",
    category: "mindfulness",
    difficulty: 1,
  },
  {
    id: "deep-focus",
    title: "One-Pointed Focus",
    description: "Chant 51 mantras with complete concentration on each syllable",
    category: "mantra",
    targetCount: 51, 
    difficulty: 3,
  },
  {
    id: "moon-meditation",
    title: "Lunar Reflection",
    description: "Meditate and chant under moonlight for 15 minutes",
    category: "meditation",
    difficulty: 2,
  },
  {
    id: "compassion-mantra",
    title: "Boundless Compassion",
    description: "Recite a compassion mantra while visualizing love spreading to all beings",
    category: "devotion",
    difficulty: 2,
  },
  {
    id: "dawn-chanting",
    title: "Brahma Muhurta",
    description: "Wake before sunrise and complete 108 mantras in the spiritually charged early hours",
    category: "mantra",
    targetCount: 108,
    difficulty: 3,
  },
  {
    id: "mantra-mala",
    title: "Complete Mala",
    description: "Use a mala to complete 108 repetitions with proper technique",
    category: "mantra",
    targetCount: 108,
    difficulty: 2,
  },
  {
    id: "mirror-mantra",
    title: "Mirror Practice",
    description: "Chant while looking into your own eyes in a mirror for 5 minutes",
    category: "mindfulness",
    difficulty: 2,
  },
  {
    id: "group-energy",
    title: "Collective Consciousness",
    description: "Connect energetically with other practitioners by chanting at the same time as others around the world",
    category: "devotion",
    difficulty: 1,
  },
  {
    id: "elemental-mantras",
    title: "Five Elements",
    description: "Dedicate 21 mantras to each of the 5 elements (earth, water, fire, air, ether)",
    category: "devotion",
    targetCount: 105,
    difficulty: 3,
  },
  {
    id: "chakra-focus",
    title: "Energy Centers",
    description: "Chant while focusing on each of your 7 chakras sequentially",
    category: "meditation",
    difficulty: 2,
  },
  {
    id: "food-blessing",
    title: "Blessed Nourishment",
    description: "Chant mantras over your food before eating for the entire day",
    category: "devotion",
    difficulty: 1,
  },
  {
    id: "dream-intention",
    title: "Conscious Dreaming",
    description: "Set an intention to remember your dreams while chanting 27 mantras before sleep",
    category: "meditation",
    targetCount: 27,
    difficulty: 2,
  },
  {
    id: "heart-centered",
    title: "Heart Center",
    description: "Place your hand on your heart while chanting 108 mantras",
    category: "mindfulness",
    targetCount: 108,
    difficulty: 2,
  },
  {
    id: "sound-healing",
    title: "Healing Vibrations",
    description: "Direct mantras as healing energy to any part of your body that needs attention",
    category: "meditation",
    difficulty: 2,
  },
  {
    id: "water-offering",
    title: "Sacred Offering",
    description: "Offer water to the sun while reciting 11 mantras",
    category: "devotion",
    targetCount: 11,
    difficulty: 1,
  },
  {
    id: "digital-detox",
    title: "Sacred Disconnection",
    description: "Turn off all electronics and practice 30 minutes of mantra chanting",
    category: "mindfulness",
    difficulty: 2,
  },
  {
    id: "new-mantra",
    title: "New Vibration",
    description: "Learn and practice a mantra you've never chanted before",
    category: "mantra",
    difficulty: 1,
  }
];

// Monthly special challenges
export interface MonthlyChallenge extends DailyChallenge {
  month: number; // 0-11 (January-December)
}

const MONTHLY_CHALLENGES: MonthlyChallenge[] = [
  {
    id: "january-new-beginnings",
    title: "New Year Intentions",
    description: "Set your spiritual intentions for the year with 108 mantras",
    category: "mindfulness",
    targetCount: 108,
    difficulty: 2,
    month: 0 // January
  },
  {
    id: "february-devotion",
    title: "Month of Devotion",
    description: "Practice bhakti (devotion) through 21 consecutive days of heartfelt chanting",
    category: "devotion",
    difficulty: 3,
    month: 1 // February
  },
  {
    id: "march-equinox",
    title: "Balance of Light",
    description: "Celebrate the equinox with balancing mantras for 31 minutes",
    category: "meditation",
    difficulty: 2,
    month: 2 // March
  },
  {
    id: "april-renewal",
    title: "Spring Renewal",
    description: "Purify your energy with 108 cleansing mantras",
    category: "mantra",
    targetCount: 108,
    difficulty: 2,
    month: 3 // April
  },
  {
    id: "may-abundance",
    title: "Flowering Abundance",
    description: "Practice abundance mantras while visualizing your life in full bloom",
    category: "mindfulness",
    difficulty: 1,
    month: 4 // May
  },
  {
    id: "june-light",
    title: "Solstice Light",
    description: "Honor the longest day with 108 sun salutations and mantras",
    category: "devotion",
    targetCount: 108,
    difficulty: 3,
    month: 5 // June
  },
  {
    id: "july-guru",
    title: "Guru Purnima",
    description: "Honor your teachers and guides with gratitude mantras",
    category: "devotion",
    difficulty: 1,
    month: 6 // July
  },
  {
    id: "august-discipline",
    title: "Tapas - Spiritual Heat",
    description: "Build spiritual discipline with 31 days of consistent practice",
    category: "mantra",
    difficulty: 3,
    month: 7 // August
  },
  {
    id: "september-harvest",
    title: "Spiritual Harvest",
    description: "Reflect on your spiritual growth with gratitude mantras",
    category: "mindfulness",
    difficulty: 1,
    month: 8 // September
  },
  {
    id: "october-inner-light",
    title: "Inner Lamp",
    description: "Illuminate your inner darkness with mantras of light",
    category: "meditation",
    difficulty: 2,
    month: 9 // October
  },
  {
    id: "november-ancestral",
    title: "Ancestral Honoring",
    description: "Chant mantras dedicated to your ancestors and lineage",
    category: "devotion",
    difficulty: 2,
    month: 10 // November
  },
  {
    id: "december-silence",
    title: "Sacred Silence",
    description: "Alternate between mantra chanting and periods of complete silence",
    category: "meditation",
    difficulty: 2,
    month: 11 // December
  }
];

// Get today's challenge based on the current date
export const getTodayChallenge = (): DailyChallenge => {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const year = today.getFullYear();
  
  // Use combination of day of year and year as seed to select challenge
  // This ensures same challenge on same date each year
  const seed = dayOfYear + (year * 365);
  const index = seed % PREDEFINED_CHALLENGES.length;
  
  return PREDEFINED_CHALLENGES[index];
};

// Get monthly challenge based on current month
export const getMonthlyChallenge = (): MonthlyChallenge => {
  const currentMonth = new Date().getMonth();
  return MONTHLY_CHALLENGES[currentMonth];
};

// Helper function to get day of year (0-365)
const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Local storage for challenge completion status
interface ChallengeStatus {
  lastCompletedDaily?: string; // YYYY-MM-DD format
  lastCompletedMonthly?: string; // YYYY-MM format
}

// Check if today's challenge is completed
export const isDailyChallengeCompleted = (): boolean => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const status = getChallengeStatus();
  return status.lastCompletedDaily === today;
};

// Check if current month's challenge is completed
export const isMonthlyCompleted = (): boolean => {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const status = getChallengeStatus();
  return status.lastCompletedMonthly === currentMonth;
};

// Mark today's challenge as completed
export const completeDailyChallenge = (): void => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const status = getChallengeStatus();
  status.lastCompletedDaily = today;
  localStorage.setItem('challengeStatus', JSON.stringify(status));
};

// Mark monthly challenge as completed
export const completeMonthlyChallenge = (): void => {
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const status = getChallengeStatus();
  status.lastCompletedMonthly = currentMonth;
  localStorage.setItem('challengeStatus', JSON.stringify(status));
};

// Get current challenge status
export const getChallengeStatus = (): ChallengeStatus => {
  const status = localStorage.getItem('challengeStatus');
  return status ? JSON.parse(status) : {};
};
