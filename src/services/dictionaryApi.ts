import { WordEntry, MeaningGroup, PhoneticItem, LookupResult, ApiProvider } from '../types';
import { OFFLINE_LEXICON } from '../data/offlineLexicon';
import { StorageService } from './storage';

const TIMEOUT_MS = 3500;

interface FreeDictSense {
  definition?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

interface FreeDictEntry {
  partOfSpeech?: string;
  pronunciations?: Array<{
    type?: string;
    text?: string;
    tags?: string[];
  }>;
  senses?: FreeDictSense[];
  synonyms?: string[];
  antonyms?: string[];
}

interface FreeDictResponse {
  word: string;
  entries?: FreeDictEntry[];
}

interface DictApiPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

interface DictApiDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface DictApiMeaning {
  partOfSpeech: string;
  definitions: DictApiDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

interface DictApiResponseItem {
  word: string;
  phonetic?: string;
  phonetics?: DictApiPhonetic[];
  meanings?: DictApiMeaning[];
  sourceUrls?: string[];
}

/**
 * Normalizes FreeDictionary API response (https://freedictionaryapi.com/api/v1/entries/en/{word})
 */
function normalizeFreeDict(data: FreeDictResponse, requestedWord: string): WordEntry {
  const word = data.word || requestedWord;
  const phonetics: PhoneticItem[] = [];
  const meaningsMap = new Map<string, MeaningGroup>();

  if (data.entries && Array.isArray(data.entries)) {
    data.entries.forEach(entry => {
      const pos = (entry.partOfSpeech || 'general').toLowerCase();

      // Collect pronunciations
      if (entry.pronunciations) {
        entry.pronunciations.forEach(p => {
          if (p.text) {
            const accent = p.tags && p.tags.length > 0 ? p.tags.join(', ') : 'IPA';
            if (!phonetics.some(existing => existing.text === p.text)) {
              phonetics.push({
                text: p.text,
                accent,
              });
            }
          }
        });
      }

      // Group senses into meanings by part of speech
      if (!meaningsMap.has(pos)) {
        meaningsMap.set(pos, {
          partOfSpeech: pos,
          definitions: [],
          synonyms: entry.synonyms ? [...entry.synonyms] : [],
          antonyms: entry.antonyms ? [...entry.antonyms] : [],
        });
      }

      const group = meaningsMap.get(pos)!;

      if (entry.senses && Array.isArray(entry.senses)) {
        entry.senses.forEach(sense => {
          if (sense.definition) {
            group.definitions.push({
              definition: sense.definition,
              example: sense.examples && sense.examples[0] ? sense.examples[0] : undefined,
              synonyms: sense.synonyms || [],
              antonyms: sense.antonyms || [],
            });

            if (sense.synonyms) {
              group.synonyms.push(...sense.synonyms);
            }
            if (sense.antonyms) {
              group.antonyms.push(...sense.antonyms);
            }
          }
        });
      }
    });
  }

  // Deduplicate synonyms & antonyms
  meaningsMap.forEach(group => {
    group.synonyms = Array.from(new Set(group.synonyms)).slice(0, 15);
    group.antonyms = Array.from(new Set(group.antonyms)).slice(0, 15);
  });

  const primaryPhonetic = phonetics[0]?.text;

  return {
    word,
    phonetic: primaryPhonetic,
    phonetics,
    meanings: Array.from(meaningsMap.values()),
    sourceUrls: ['https://freedictionaryapi.com', `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`],
    provider: 'freedictionary',
    providerNote: 'Retrieved via FreeDictionary API',
  };
}

/**
 * Normalizes DictionaryAPI.dev response (https://api.dictionaryapi.dev/api/v2/entries/en/{word})
 */
function normalizeDictApiDev(data: DictApiResponseItem[], requestedWord: string): WordEntry {
  const item = data[0];
  if (!item) {
    throw new Error('No definition entries returned');
  }

  const word = item.word || requestedWord;
  const phonetics: PhoneticItem[] = [];

  if (item.phonetics && Array.isArray(item.phonetics)) {
    item.phonetics.forEach(p => {
      if (p.text || p.audio) {
        let accent = 'IPA';
        if (p.audio) {
          if (p.audio.includes('-us.mp3') || p.audio.includes('/en/us/')) accent = 'US Audio';
          else if (p.audio.includes('-uk.mp3') || p.audio.includes('/en/uk/')) accent = 'UK Audio';
          else if (p.audio.includes('-au.mp3') || p.audio.includes('/en/au/')) accent = 'AU Audio';
          else accent = 'Audio';
        }
        phonetics.push({
          text: p.text,
          audio: p.audio && p.audio.trim() !== '' ? p.audio : undefined,
          sourceUrl: p.sourceUrl,
          accent,
        });
      }
    });
  }

  const meanings: MeaningGroup[] = (item.meanings || []).map(m => ({
    partOfSpeech: m.partOfSpeech || 'general',
    definitions: (m.definitions || []).map(d => ({
      definition: d.definition,
      example: d.example,
      synonyms: d.synonyms || [],
      antonyms: d.antonyms || [],
    })),
    synonyms: m.synonyms || [],
    antonyms: m.antonyms || [],
  }));

  return {
    word,
    phonetic: item.phonetic || phonetics[0]?.text,
    phonetics,
    meanings,
    sourceUrls: item.sourceUrls || [`https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`],
    provider: 'dictionaryapi',
    providerNote: 'Retrieved via DictionaryAPI.dev',
  };
}

/**
 * Fetch from FreeDictionary API with timeout
 */
async function fetchFromFreeDict(word: string): Promise<WordEntry> {
  const url = `https://freedictionaryapi.com/api/v1/entries/en/${encodeURIComponent(word)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`FreeDictionary API error HTTP ${response.status}`);
    }

    const json = await response.json();
    return normalizeFreeDict(json, word);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch from DictionaryAPI.dev with timeout
 */
async function fetchFromDictApiDev(word: string): Promise<WordEntry> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`DictionaryAPI.dev error HTTP ${response.status}`);
    }

    const json = await response.json();
    return normalizeDictApiDev(json, word);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Lookup Word with Automatic Fail-Safe, Offline Storage Caching, and Preloaded Lexicon
 */
export async function lookupWord(rawWord: string): Promise<LookupResult> {
  const cleanWord = rawWord.trim().toLowerCase();
  const startTime = performance.now();
  const isBrowserOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  if (!cleanWord) {
    return {
      error: 'Please enter a word to search.',
      provider: 'offline_lexicon',
      failedProviders: [],
      isOffline: isBrowserOffline,
      tookMs: 0,
    };
  }

  // 1. If currently offline, skip network requests directly to local cache or offline lexicon
  if (isBrowserOffline) {
    const cached = StorageService.getCachedWord(cleanWord);
    if (cached) {
      return {
        data: cached,
        provider: 'offline_cache',
        failedProviders: ['Network Offline'],
        isOffline: true,
        tookMs: Math.round(performance.now() - startTime),
      };
    }

    const lexiconMatch = OFFLINE_LEXICON[cleanWord];
    if (lexiconMatch) {
      return {
        data: lexiconMatch,
        provider: 'offline_lexicon',
        failedProviders: ['Network Offline'],
        isOffline: true,
        tookMs: Math.round(performance.now() - startTime),
      };
    }

    return {
      error: `You are currently offline, and "${cleanWord}" has not been cached yet. Try browsing your saved words or connect to the internet.`,
      provider: 'offline_lexicon',
      failedProviders: ['Network Offline'],
      isOffline: true,
      tookMs: Math.round(performance.now() - startTime),
    };
  }

  // 2. Decide order of APIs based on user settings or default preference
  const primaryChoice = StorageService.getPrimaryApi();
  const primaryApiName = primaryChoice === 'freedictionary' ? 'FreeDictionary API' : 'DictionaryAPI.dev';
  const fallbackApiName = primaryChoice === 'freedictionary' ? 'DictionaryAPI.dev' : 'FreeDictionary API';

  const primaryFn = primaryChoice === 'freedictionary' ? fetchFromFreeDict : fetchFromDictApiDev;
  const fallbackFn = primaryChoice === 'freedictionary' ? fetchFromDictApiDev : fetchFromFreeDict;

  const failedProviders: string[] = [];

  // Attempt Primary API
  try {
    const result = await primaryFn(cleanWord);
    // Cache result immediately for offline lookup!
    StorageService.cacheWord(result);
    return {
      data: result,
      provider: result.provider,
      failedProviders: [],
      isOffline: false,
      tookMs: Math.round(performance.now() - startTime),
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    failedProviders.push(`${primaryApiName} (${errMsg.includes('aborted') ? 'Timeout' : errMsg})`);
  }

  // Fail-Safe: Attempt Secondary / Fallback API
  try {
    const fallbackResult = await fallbackFn(cleanWord);
    fallbackResult.providerNote = `Fail-safe activated: Sourced via ${fallbackApiName} after ${primaryApiName} failed.`;
    // Cache result immediately for offline lookup!
    StorageService.cacheWord(fallbackResult);

    return {
      data: fallbackResult,
      provider: fallbackResult.provider,
      failedProviders,
      isOffline: false,
      tookMs: Math.round(performance.now() - startTime),
    };
  } catch (fallbackErr: unknown) {
    const fallbackErrMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
    failedProviders.push(`${fallbackApiName} (${fallbackErrMsg.includes('aborted') ? 'Timeout' : fallbackErrMsg})`);
  }

  // 3. If both online APIs failed, check local offline cache
  const localCached = StorageService.getCachedWord(cleanWord);
  if (localCached) {
    localCached.providerNote = 'Both online APIs were unreachable. Loaded from local offline cache.';
    return {
      data: localCached,
      provider: 'offline_cache',
      failedProviders,
      isOffline: false,
      tookMs: Math.round(performance.now() - startTime),
    };
  }

  // 4. Check pre-loaded curated offline lexicon
  const offlineMatch = OFFLINE_LEXICON[cleanWord];
  if (offlineMatch) {
    const copy = { ...offlineMatch };
    copy.providerNote = 'Both online APIs were unreachable. Sourced from built-in offline vocabulary.';
    return {
      data: copy,
      provider: 'offline_lexicon',
      failedProviders,
      isOffline: false,
      tookMs: Math.round(performance.now() - startTime),
    };
  }

  // 5. Neither API nor offline cache found the word
  return {
    error: `No definitions found for "${cleanWord}". Check the spelling or try searching for another term.`,
    provider: 'freedictionary',
    failedProviders,
    isOffline: false,
    tookMs: Math.round(performance.now() - startTime),
  };
}
