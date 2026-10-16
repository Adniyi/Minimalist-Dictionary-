import { WordEntry, BookmarkItem, SearchHistoryItem, PronunciationConfig, AdSenseConfig } from '../types';

const STORAGE_KEYS = {
  CACHE_PREFIX: 'lexi_cache_',
  HISTORY: 'lexi_history',
  BOOKMARKS: 'lexi_bookmarks',
  VOICE_CONFIG: 'lexi_voice_config',
  ADSENSE_CONFIG: 'lexi_adsense_config',
  PRIMARY_API: 'lexi_primary_api',
  THEME: 'lexi_theme',
};

export const DEFAULT_VOICE_CONFIG: PronunciationConfig = {
  accent: 'en-US',
  rate: 0.95,
  pitch: 1.0,
  preferNativeRecording: true,
};

export const DEFAULT_ADSENSE_CONFIG: AdSenseConfig = {
  enabled: true,
  client: 'ca-pub-0000000000000000',
  topSlotId: '1234567890',
  sideSlotId: '9876543210',
  bottomSlotId: '5432109876',
  showPlaceholdersInDev: true,
};

export class StorageService {
  // Offline Cache for Definitions
  static cacheWord(entry: WordEntry): void {
    try {
      const key = STORAGE_KEYS.CACHE_PREFIX + entry.word.toLowerCase().trim();
      const payload: WordEntry = {
        ...entry,
        provider: 'offline_cache',
        cachedAt: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // Storage quota or private mode fallback
    }
  }

  static getCachedWord(word: string): WordEntry | null {
    try {
      const key = STORAGE_KEYS.CACHE_PREFIX + word.toLowerCase().trim();
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const data = JSON.parse(raw) as WordEntry;
      return {
        ...data,
        provider: 'offline_cache',
      };
    } catch {
      return null;
    }
  }

  static getAllCachedWords(): string[] {
    try {
      const words: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.CACHE_PREFIX)) {
          words.push(key.replace(STORAGE_KEYS.CACHE_PREFIX, ''));
        }
      }
      return words.sort();
    } catch {
      return [];
    }
  }

  // Search History
  static getHistory(): SearchHistoryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static addHistory(item: Omit<SearchHistoryItem, 'timestamp'>): void {
    try {
      const history = this.getHistory().filter(h => h.word.toLowerCase() !== item.word.toLowerCase());
      const updated: SearchHistoryItem[] = [
        { ...item, timestamp: Date.now() },
        ...history,
      ].slice(0, 40); // Keep last 40 searches
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // ignore
    }
  }

  // Bookmarks
  static getBookmarks(): BookmarkItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static isBookmarked(word: string): boolean {
    const list = this.getBookmarks();
    return list.some(b => b.word.toLowerCase() === word.toLowerCase().trim());
  }

  static toggleBookmark(entry: WordEntry): boolean {
    try {
      const word = entry.word.toLowerCase().trim();
      const list = this.getBookmarks();
      const exists = list.some(b => b.word.toLowerCase() === word);

      let updated: BookmarkItem[];
      if (exists) {
        updated = list.filter(b => b.word.toLowerCase() !== word);
      } else {
        const firstDef = entry.meanings[0]?.definitions[0]?.definition;
        const partOfSpeech = entry.meanings[0]?.partOfSpeech;
        const newItem: BookmarkItem = {
          word: entry.word,
          addedAt: Date.now(),
          phonetic: entry.phonetic,
          partOfSpeech,
          briefDefinition: firstDef,
        };
        updated = [newItem, ...list];
      }

      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  }

  // Voice Settings
  static getVoiceConfig(): PronunciationConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VOICE_CONFIG);
      return raw ? { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(raw) } : DEFAULT_VOICE_CONFIG;
    } catch {
      return DEFAULT_VOICE_CONFIG;
    }
  }

  static saveVoiceConfig(config: PronunciationConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOICE_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }

  // AdSense Settings
  static getAdSenseConfig(): AdSenseConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADSENSE_CONFIG);
      return raw ? { ...DEFAULT_ADSENSE_CONFIG, ...JSON.parse(raw) } : DEFAULT_ADSENSE_CONFIG;
    } catch {
      return DEFAULT_ADSENSE_CONFIG;
    }
  }

  static saveAdSenseConfig(config: AdSenseConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ADSENSE_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }

  // Primary API preference
  static getPrimaryApi(): 'freedictionary' | 'dictionaryapi' {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.PRIMARY_API);
      return val === 'dictionaryapi' ? 'dictionaryapi' : 'freedictionary';
    } catch {
      return 'freedictionary';
    }
  }

  static setPrimaryApi(api: 'freedictionary' | 'dictionaryapi'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIMARY_API, api);
    } catch {
      // ignore
    }
  }

  // Theme preference
  static getTheme(): 'light' | 'dark' {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.THEME);
      if (val === 'light' || val === 'dark') return val;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  }

  static setTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }
}
