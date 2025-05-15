// User identity types and utilities
import { toast } from "@/components/ui/sonner";
import { getMantraStats } from "./mantra-storage";
import { generateQRCode } from "./qr-helper";

// Avatar symbols for spiritual identity
export const spiritualSymbols = [
  { id: 1, name: "Om", symbol: "ॐ" },
  { id: 2, name: "Lotus", symbol: "🪷" },
  { id: 3, name: "Moon", symbol: "☽" },
  { id: 4, name: "Sun", symbol: "☀" },
  { id: 5, name: "Star", symbol: "✧" },
  { id: 6, name: "Wheel", symbol: "☸" },
  { id: 7, name: "Tree", symbol: "🌳" },
  { id: 8, name: "Mountain", symbol: "🏔" },
  { id: 9, name: "Water", symbol: "~" },
  { id: 10, name: "Fire", symbol: "🔥" },
  { id: 11, name: "Sky", symbol: "☁" },
  { id: 12, name: "Peace", symbol: "☮" },
];

// User Identity Interface
export interface UserIdentity {
  spiritualName: string;
  symbolId: number;
  uniqueId: string;
  creationDate: number;
}

// User Identity Data for export/import
export interface UserIdentityExport {
  identity: UserIdentity;
  stats: any; // Mantra stats
  version: string;
  checksum: string;
}

// Generate a unique spiritual ID
export const generateUniqueId = (name: string): string => {
  // Convert name to uppercase and keep only letters
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  const prefix = cleanName.substring(0, 3) || "OM";
  
  // Generate random spiritual words
  const spiritualWords = ["SHANTI", "PREMA", "ANANDA", "DHARMA", "KARMA"];
  const randomWord = spiritualWords[Math.floor(Math.random() * spiritualWords.length)];
  
  // Generate random number (100-999)
  const randomNum = Math.floor(Math.random() * 900) + 100;
  
  // Calculate simple checksum (last digit)
  const sum = (prefix.charCodeAt(0) + randomWord.charCodeAt(0) + randomNum) % 10;
  
  return `${prefix}-${randomWord}-${randomNum}${sum}`;
};

// Store user identity in localStorage
export const saveUserIdentity = (identity: UserIdentity): void => {
  localStorage.setItem('userIdentity', JSON.stringify(identity));
};

// Get user identity from localStorage
export const getUserIdentity = (): UserIdentity | null => {
  const identity = localStorage.getItem('userIdentity');
  return identity ? JSON.parse(identity) : null;
};

// Check if user has already created an identity
export const hasUserIdentity = (): boolean => {
  return localStorage.getItem('userIdentity') !== null;
};

// Update user spiritual name
export const updateSpiritualName = (newName: string): void => {
  const identity = getUserIdentity();
  if (identity) {
    identity.spiritualName = newName;
    saveUserIdentity(identity);
    toast("Your spiritual name has been updated");
  }
};

// Update user symbol
export const updateSpiritualSymbol = (symbolId: number): void => {
  const identity = getUserIdentity();
  if (identity) {
    identity.symbolId = symbolId;
    saveUserIdentity(identity);
    toast("Your spiritual symbol has been updated");
  }
};

// Generate export data package
export const generateExportData = (): UserIdentityExport => {
  const identity = getUserIdentity();
  const stats = getMantraStats();
  
  if (!identity) {
    throw new Error("No user identity found");
  }
  
  // Create simple checksum from identity and stats
  const checksum = calculateChecksum(identity, stats);
  
  return {
    identity,
    stats,
    version: "1.0",
    checksum
  };
};

// Create a simple checksum for verification
const calculateChecksum = (identity: UserIdentity, stats: any): string => {
  const str = `${identity.uniqueId}${identity.creationDate}${stats.totalCount}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 8);
};

// Export identity to text
export const exportIdentityToText = (): string => {
  const exportData = generateExportData();
  return `OM-IDENTITY:${btoa(JSON.stringify(exportData))}`;
};

// Export identity to JSON file
export const exportIdentityToFile = (): void => {
  const exportData = generateExportData();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `spiritual-journey-${exportData.identity.uniqueId}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

// Import identity from text
export const importIdentityFromText = (text: string): UserIdentityExport | null => {
  try {
    if (text.startsWith('OM-IDENTITY:')) {
      const base64 = text.substring(12);
      const json = atob(base64);
      return JSON.parse(json);
    }
    return null;
  } catch (error) {
    console.error("Failed to import identity:", error);
    return null;
  }
};

// Import identity from file
export const importIdentityFromFile = async (file: File): Promise<UserIdentityExport | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        if (data.identity && data.stats && data.checksum) {
          resolve(data);
        } else {
          reject(new Error("Invalid identity file format"));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};

// Apply imported identity data (replace current)
export const applyImportedIdentity = (data: UserIdentityExport): void => {
  // Verify checksum
  const calculatedChecksum = calculateChecksum(data.identity, data.stats);
  if (calculatedChecksum !== data.checksum) {
    throw new Error("Invalid identity data (checksum mismatch)");
  }
  
  // Save identity
  saveUserIdentity(data.identity);
  
  // Save stats (replace all current stats)
  localStorage.setItem('mantraStats', JSON.stringify(data.stats));
  localStorage.setItem('mantraDailyRecords', JSON.stringify(data.stats.dailyRecords || []));
  
  toast("Your spiritual journey has been restored");
};

// Merge imported identity with current data
export const mergeImportedIdentity = (data: UserIdentityExport): void => {
  // Verify checksum
  const calculatedChecksum = calculateChecksum(data.identity, data.stats);
  if (calculatedChecksum !== data.checksum) {
    throw new Error("Invalid identity data (checksum mismatch)");
  }
  
  // Keep current identity but merge stats
  const currentStats = getMantraStats();
  const importedStats = data.stats;
  
  // Merge stats (take the highest values)
  const mergedStats = {
    todayCount: Math.max(currentStats.todayCount, importedStats.todayCount || 0),
    totalCount: currentStats.totalCount + importedStats.totalCount,
    streak: Math.max(currentStats.streak, importedStats.streak || 0),
    lastChantDate: currentStats.lastChantDate,
    achievements: [...new Set([...currentStats.achievements, ...(importedStats.achievements || [])])],
    practiceDays: (currentStats.practiceDays || 0) + (importedStats.practiceDays || 0)
  };
  
  localStorage.setItem('mantraStats', JSON.stringify(mergedStats));
  toast("Your spiritual journeys have been merged");
};

// Reset user identity and journey
export const resetUserIdentity = (): void => {
  localStorage.removeItem('userIdentity');
  localStorage.removeItem('mantraStats');
  localStorage.removeItem('mantraDailyRecords');
  window.location.reload();
};
