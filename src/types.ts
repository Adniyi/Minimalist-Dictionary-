export type ApiProvider = 'freedictionary' | 'dictionaryapi' | 'offline_cache' | 'offline_lexicon';

export interface PhoneticItem {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  accent?: string;
}

export interface DefinitionItem {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface MeaningGroup {
  partOfSpeech: string;
  definitions: DefinitionItem[];
  synonyms: string[];
  antonyms: string[];
}

export interface WordEntry {
  word: string;
  phonetic?: string;
  phonetics: PhoneticItem[];
  meanings: MeaningGroup[];
  sourceUrls?: string[];
  provider: ApiProvider;
  providerNote?: string;
  cachedAt?: number;
  origin?: string;
}

export interface LookupResult {
  data?: WordEntry;
  error?: string;
  provider: ApiProvider;
  failedProviders: string[];
  isOffline: boolean;
  tookMs: number;
}

export interface SearchHistoryItem {
  word: string;
  timestamp: number;
  provider: ApiProvider;
  phonetic?: string;
  briefDefinition?: string;
}

export interface BookmarkItem {
  word: string;
  addedAt: number;
  phonetic?: string;
  partOfSpeech?: string;
  briefDefinition?: string;
}

export interface PronunciationConfig {
  accent: 'en-US' | 'en-GB' | 'en-AU' | 'en-IN';
  rate: number; // 0.8, 1.0, 1.2
  pitch: number;
  preferNativeRecording: boolean;
}

export interface AdSenseConfig {
  enabled: boolean;
  client: string; // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  topSlotId: string;
  sideSlotId: string;
  bottomSlotId: string;
  showPlaceholdersInDev: boolean;
}
