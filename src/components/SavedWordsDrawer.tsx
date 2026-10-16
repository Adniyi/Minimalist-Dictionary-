import React, { useState, useEffect } from 'react';
import { Bookmark, History, Trash2, X, ArrowRight, HardDriveDownload, Volume2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { BookmarkItem, SearchHistoryItem } from '../types';
import { Button } from './ui/Button';
import { AudioService } from '../services/audioPronunciation';

export interface SavedWordsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWord: (word: string) => void;
}

export const SavedWordsDrawer: React.FC<SavedWordsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectWord,
}) => {
  const [tab, setTab] = useState<'bookmarks' | 'history' | 'cache'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [cachedWords, setCachedWords] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setBookmarks(StorageService.getBookmarks());
      setHistory(StorageService.getHistory());
      setCachedWords(StorageService.getAllCachedWords());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearHistory = () => {
    StorageService.clearHistory();
    setHistory([]);
  };

  const handlePlayWord = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    AudioService.playWord(word);
  };

  return (
    <div
      id="saved-words-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="saved-words-panel"
        className="w-full max-w-md h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            <h2 className="font-semibold text-base">Offline Lexicon & Saved Words</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 p-2 gap-1 bg-zinc-100 dark:bg-zinc-800/60 mx-4 mt-3 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('bookmarks')}
            className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'bookmarks'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({bookmarks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'history'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Recent ({history.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('cache')}
            className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'cache'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Offline ({cachedWords.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {tab === 'bookmarks' && (
            <>
              {bookmarks.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 text-xs space-y-2">
                  <Bookmark className="w-8 h-8 mx-auto opacity-40" />
                  <p>No saved words yet.</p>
                  <p className="text-[11px]">Click "Save" on any word to keep it in your permanent offline bookmarks.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((b) => (
                    <div
                      key={b.word}
                      onClick={() => {
                        onSelectWord(b.word);
                        onClose();
                      }}
                      className="flex items-start justify-between p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors group"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm capitalize text-zinc-900 dark:text-zinc-100">
                            {b.word}
                          </span>
                          {b.phonetic && (
                            <span className="text-xs font-mono text-zinc-400">
                              {b.phonetic}
                            </span>
                          )}
                          {b.partOfSpeech && (
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                              {b.partOfSpeech}
                            </span>
                          )}
                        </div>
                        {b.briefDefinition && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {b.briefDefinition}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handlePlayWord(e, b.word)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        title="Pronounce"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'history' && (
            <>
              {history.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 text-xs space-y-2">
                  <History className="w-8 h-8 mx-auto opacity-40" />
                  <p>No recent search history.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-1 text-xs text-zinc-400">
                    <span>Recent Searches</span>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear history</span>
                    </button>
                  </div>
                  {history.map((h, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        onSelectWord(h.word);
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="capitalize font-medium text-zinc-800 dark:text-zinc-200">{h.word}</span>
                        {h.phonetic && <span className="text-xs font-mono text-zinc-400">{h.phonetic}</span>}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'cache' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Automatic Offline Cache</p>
                <p>
                  Every word you search is stored locally on this device. You can look up these {cachedWords.length} words even if you are completely offline with no network connection.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {cachedWords.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => {
                      onSelectWord(word);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors capitalize"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
