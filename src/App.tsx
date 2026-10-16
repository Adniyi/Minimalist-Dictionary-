import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  Sparkles,
  Sun,
  Moon,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  HardDriveDownload,
  Share2,
  Volume2,
} from 'lucide-react';
import { WordEntry, LookupResult } from './types';
import { lookupWord } from './services/dictionaryApi';
import { StorageService } from './services/storage';
import { POPULAR_WORDS, OFFLINE_LEXICON } from './data/offlineLexicon';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';
import { WordDetail } from './components/WordDetail';
import { AdBanner } from './components/AdBanner';
import { AdSenseGuideModal } from './components/AdSenseGuideModal';
import { SavedWordsDrawer } from './components/SavedWordsDrawer';
import { ApiStatusIndicator } from './components/ApiStatusIndicator';
import { AudioService } from './services/audioPronunciation';
import { SeoService } from './services/seo';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEntry, setCurrentEntry] = useState<WordEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [failedProviders, setFailedProviders] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAdSenseModalOpen, setIsAdSenseModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getTheme());

  const searchInputRef = useRef<HTMLInputElement>(null);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    StorageService.setTheme(newTheme);
    const root = document.documentElement;
    const body = document.body;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  };

  // Sync online/offline state & initial theme
  useEffect(() => {
    // Apply saved or system theme immediately
    applyTheme(StorageService.getTheme());

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync saved words count
    setSavedCount(StorageService.getBookmarks().length);

    // Check URL parameters for ?q=word
    const params = new URLSearchParams(window.location.search);
    const queryWord = params.get('q');
    if (queryWord) {
      setSearchQuery(queryWord);
      executeSearch(queryWord);
    } else {
      // Default initial word for an immediate rich experience
      executeSearch('serendipity');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut listener (/ or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === 'Escape') {
        setIsSavedDrawerOpen(false);
        setIsAdSenseModalOpen(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeSearch = async (wordToSearch: string) => {
    const term = wordToSearch.trim();
    if (!term) return;

    setIsLoading(true);
    setSearchError(null);
    setFailedProviders([]);

    try {
      const result: LookupResult = await lookupWord(term);

      if (result.error || !result.data) {
        setSearchError(result.error || `No definition found for "${term}".`);
        setCurrentEntry(null);
        setFailedProviders(result.failedProviders);
      } else {
        setCurrentEntry(result.data);
        setFailedProviders(result.failedProviders);

        // Record in search history
        StorageService.addHistory({
          word: result.data.word,
          provider: result.data.provider,
          phonetic: result.data.phonetic,
          briefDefinition: result.data.meanings[0]?.definitions[0]?.definition,
        });

        // Update URL and dynamic SEO Meta Tags (Title, Description, OpenGraph, Twitter, Canonical)
        const url = new URL(window.location.href);
        url.searchParams.set('q', result.data.word);
        window.history.replaceState({}, '', url.toString());

        SeoService.updateWordSeo(result.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lookup failed';
      setSearchError(msg);
      setCurrentEntry(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };

  const handleSelectPopularWord = (word: string) => {
    setSearchQuery(word);
    executeSearch(word);
  };

  const handleBookmarkChanged = () => {
    setSavedCount(StorageService.getBookmarks().length);
  };

  // Word of the day based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const wotdKey = POPULAR_WORDS[dayOfYear % POPULAR_WORDS.length];
  const wotdEntry = OFFLINE_LEXICON[wotdKey] || OFFLINE_LEXICON['serendipity'];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      {/* Top Notification Bar for Offline state */}
      {isOffline && (
        <div
          id="offline-banner"
          className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>You are currently offline. Lookups are seamlessly served from your local offline lexicon and cached entries.</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <header
        id="app-header"
        className="sticky top-0 z-30 w-full border-b border-zinc-200/70 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleSelectPopularWord('serendipity')}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight block leading-tight">
                Minimalist Dictionary
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block -mt-0.5 font-sans">
                Offline Lookup & Voice
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2">
            {/* Failover / Health indicator */}
            <ApiStatusIndicator
              failedProviders={failedProviders}
              isOffline={isOffline}
              onPrimaryApiChanged={() => {
                if (currentEntry) executeSearch(currentEntry.word);
              }}
            />

            {/* Saved Words Drawer Button */}
            <Button
              id="open-saved-words-btn"
              variant="outline"
              size="sm"
              onClick={() => setIsSavedDrawerOpen(true)}
              className="gap-1.5"
              title="View offline saved words and search history"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[10px] font-mono font-medium">
                  {savedCount}
                </span>
              )}
            </Button>

            {/* AdSense Guide Button */}
            <Button
              id="open-adsense-guide-btn"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdSenseModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              title="Google AdSense Setup Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AdSense Setup</span>
            </Button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* TOP AD CONTAINER (Leaderboard 728x90) */}
        <AdBanner
          id="top-leaderboard-ad"
          slotType="leaderboard"
          onOpenGuide={() => setIsAdSenseModalOpen(true)}
          className="mb-6"
        />

        {/* Minimalist Search Area */}
        <section id="search-section" className="max-w-2xl mx-auto space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              id="search-input"
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search any word (e.g. serendipity, ephemeral, petrichor)..."
              leftIcon={<Search className="w-4 h-4" />}
              rightElement={
                <div className="flex items-center gap-1">
                  {searchQuery && (
                    <button
                      id="clear-search-btn"
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      className="px-2 py-1 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900">
                    /
                  </kbd>
                </div>
              }
            />
          </form>

          {/* Curated Vocabulary Quick Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs text-zinc-500 dark:text-zinc-400">
            <span className="shrink-0 text-[11px] font-medium text-zinc-400">Discover:</span>
            {POPULAR_WORDS.slice(0, 8).map(word => (
              <button
                key={word}
                type="button"
                onClick={() => handleSelectPopularWord(word)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  currentEntry?.word.toLowerCase() === word
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                    : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
        </section>

        {/* Content Layout: Main Definition + Responsive Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Main Column: Word Definitions */}
          <div className="lg:col-span-8 space-y-6">
            {isLoading ? (
              // Minimal Skeleton Loader
              <div id="loading-skeleton" className="space-y-6 animate-pulse">
                <div className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-6 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                  <div className="h-6 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                </div>
              </div>
            ) : searchError ? (
              // Error State with helpful fail-safe suggestions
              <div
                id="search-error-card"
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Word Not Found
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                    {searchError}
                  </p>
                </div>

                {failedProviders.length > 0 && (
                  <div className="text-xs font-mono text-zinc-400 max-w-sm mx-auto p-2 rounded bg-zinc-50 dark:bg-zinc-800/50">
                    Attempted fail-safes: {failedProviders.join(' → ')}
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs text-zinc-500 mb-2">Try searching one of these curated offline entries:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_WORDS.slice(0, 5).map(w => (
                      <Button
                        key={w}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSelectPopularWord(w)}
                      >
                        {w}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : currentEntry ? (
              // Rich Word Presentation
              <WordDetail
                entry={currentEntry}
                onSelectWord={handleSelectPopularWord}
                onBookmarkChanged={handleBookmarkChanged}
              />
            ) : null}

            {/* IN-FEED MID-CONTENT AD */}
            <AdBanner
              id="mid-content-ad"
              slotType="in-feed"
              onOpenGuide={() => setIsAdSenseModalOpen(true)}
              className="mt-8"
            />
          </div>

          {/* Right Rail Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* SIDEBAR AD CONTAINER (Rectangle 300x250) */}
            <AdBanner
              id="sidebar-rectangle-ad"
              slotType="rectangle"
              onOpenGuide={() => setIsAdSenseModalOpen(true)}
            />

            {/* Daily Word of the Day Card */}
            <Card id="wotd-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                      Word of the Day
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Offline Ready</span>
                </div>
                <CardTitle className="pt-2 capitalize text-xl">
                  {wotdEntry.word}
                </CardTitle>
                <div className="text-xs font-mono text-zinc-500">
                  {wotdEntry.phonetic}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {wotdEntry.meanings[0]?.definitions[0]?.definition}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => AudioService.playWord(wotdEntry.word)}
                    className="gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Pronounce</span>
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleSelectPopularWord(wotdEntry.word)}
                    className="text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full definition</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Offline Architecture Specs Card */}
            <Card id="architecture-info-card">
              <CardHeader>
                <CardTitle className="text-sm">Architecture & Resilience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Dual API Failover:</strong> Queries FreeDictionary API first, then seamlessly switches to DictionaryAPI.dev if unreachable or slow.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>Offline Lexicon:</strong> Pre-loaded dictionary data and local storage cache ensure definitions and speech pronunciation work with 0% network.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>
                    <strong>AdSense Monetization:</strong> Responsive display ad slots compliant with Google Better Ads Standards.
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer id="app-footer" className="mt-12 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Minimalist Offline Dictionary
            </span>
            <span>•</span>
            <span>Free definitions, IPA phonetics & voice audio</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAdSenseModalOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              AdSense Setup
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSavedDrawerOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              Saved Words ({savedCount})
            </button>
            <span>•</span>
            <a
              href="https://freedictionaryapi.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              FreeDictionary API
            </a>
          </div>
        </div>
      </footer>

      {/* Saved Words Drawer */}
      <SavedWordsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onSelectWord={handleSelectPopularWord}
      />

      {/* Google AdSense Guide Modal */}
      <AdSenseGuideModal
        isOpen={isAdSenseModalOpen}
        onClose={() => setIsAdSenseModalOpen(false)}
      />
    </div>
  );
}
