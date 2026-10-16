import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Copy, Check, Share2, Sparkles, ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { WordEntry } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AudioPlayerButton } from './AudioPlayerButton';
import { StorageService } from '../services/storage';

export interface WordDetailProps {
  entry: WordEntry;
  onSelectWord: (word: string) => void;
  onBookmarkChanged?: () => void;
}

export const WordDetail: React.FC<WordDetailProps> = ({
  entry,
  onSelectWord,
  onBookmarkChanged,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(StorageService.isBookmarked(entry.word));
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Find best available audio URL
  const audioClip = entry.phonetics.find(p => p.audio && p.audio.trim() !== '')?.audio;

  const handleToggleBookmark = () => {
    const updated = StorageService.toggleBookmark(entry);
    setIsBookmarked(updated);
    if (onBookmarkChanged) onBookmarkChanged();
  };

  const handleCopyDefinition = () => {
    const firstMeaning = entry.meanings[0];
    const firstDef = firstMeaning?.definitions[0]?.definition || '';
    const text = `${entry.word} (${firstMeaning?.partOfSpeech || 'definition'}): ${firstDef}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${entry.word} – Definition & Pronunciation`,
      text: `Learn the definition, phonetics, and pronunciation of "${entry.word}".`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const providerBadge = {
    freedictionary: { label: 'FreeDictionary API', variant: 'secondary' as const },
    dictionaryapi: { label: 'DictionaryAPI.dev (Fail-Safe)', variant: 'outline' as const },
    offline_cache: { label: 'Saved Offline Cache', variant: 'success' as const },
    offline_lexicon: { label: 'Offline Vocabulary Lexicon', variant: 'muted' as const },
  }[entry.provider];

  return (
    <article id="word-detail-container" className="space-y-6">
      {/* Word Header & Primary Pronunciation */}
      <header className="pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1
              id="word-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50 capitalize"
            >
              {entry.word}
            </h1>
            {entry.phonetic && (
              <span className="text-base md:text-lg font-mono text-zinc-500 dark:text-zinc-400">
                {entry.phonetic}
              </span>
            )}
          </div>

          {/* Quick Actions (Bookmark, Copy, Share) */}
          <div className="flex items-center gap-1.5">
            <Button
              id="bookmark-word-btn"
              onClick={handleToggleBookmark}
              variant={isBookmarked ? 'default' : 'outline'}
              size="sm"
              title={isBookmarked ? 'Remove from saved words' : 'Save word offline'}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </Button>

            <Button
              id="copy-def-btn"
              onClick={handleCopyDefinition}
              variant="outline"
              size="icon"
              title="Copy definition to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>

            <Button
              id="share-word-btn"
              onClick={handleShare}
              variant="outline"
              size="icon"
              title="Share this word"
            >
              {shared ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Audio pronunciations & Provider badge */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {/* Main Voice Pronunciation Trigger */}
          <AudioPlayerButton
            id="main-voice-button"
            word={entry.word}
            audioUrl={audioClip}
            phoneticText={entry.phonetic || 'Pronounce'}
          />

          {/* Secondary Phonetic Audio Variations if available */}
          {entry.phonetics
            .filter(p => p.audio && p.audio !== audioClip)
            .slice(0, 2)
            .map((p, idx) => (
              <AudioPlayerButton
                key={idx}
                word={entry.word}
                audioUrl={p.audio}
                phoneticText={p.accent || p.text || `Audio ${idx + 2}`}
                size="sm"
              />
            ))}

          {/* Source/Provider Status Badge */}
          <div className="ml-auto flex items-center gap-2">
            <Badge variant={providerBadge.variant} id="provider-badge">
              {providerBadge.label}
            </Badge>
          </div>
        </div>

        {entry.providerNote && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 italic">
            {entry.providerNote}
          </p>
        )}
      </header>

      {/* Meanings & Definitions by Part of Speech */}
      <div className="space-y-8">
        {entry.meanings.map((meaning, mIdx) => (
          <section
            key={mIdx}
            id={`meaning-section-${meaning.partOfSpeech}`}
            className="space-y-4"
          >
            {/* Part of Speech Header */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-mono">
                {meaning.partOfSpeech}
              </span>
              <div className="flex-1 h-px bg-zinc-200/70 dark:bg-zinc-800" />
            </div>

            {/* Definitions List */}
            <ol className="space-y-4 pl-1">
              {meaning.definitions.map((def, dIdx) => (
                <li
                  key={dIdx}
                  id={`def-item-${mIdx}-${dIdx}`}
                  className="flex items-start gap-3 group"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-mono text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5 select-none">
                    {dIdx + 1}.
                  </span>
                  <div className="space-y-2 flex-1">
                    <p className="text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {def.definition}
                    </p>

                    {/* Example sentence */}
                    {def.example && (
                      <blockquote className="pl-3 border-l-2 border-zinc-200 dark:border-zinc-800 text-sm text-zinc-600 dark:text-zinc-400 italic">
                        "{def.example}"
                      </blockquote>
                    )}

                    {/* Definition-specific synonyms */}
                    {def.synonyms && def.synonyms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                        <span className="text-zinc-400 dark:text-zinc-500">Similar:</span>
                        {def.synonyms.slice(0, 5).map((syn, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => onSelectWord(syn)}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                          >
                            {syn}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* Part of Speech Synonyms */}
            {meaning.synonyms && meaning.synonyms.length > 0 && (
              <div className="pt-2 pl-8 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Synonyms:</span>
                {meaning.synonyms.slice(0, 10).map((syn, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectWord(syn)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>{syn}</span>
                    <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            )}

            {/* Antonyms */}
            {meaning.antonyms && meaning.antonyms.length > 0 && (
              <div className="pl-8 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Antonyms:</span>
                {meaning.antonyms.slice(0, 6).map((ant, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectWord(ant)}
                    className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70 border border-rose-200/50 dark:border-rose-900/50 transition-colors cursor-pointer"
                  >
                    {ant}
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Source References */}
      {entry.sourceUrls && entry.sourceUrls.length > 0 && (
        <footer className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sources & Lexical References:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {entry.sourceUrls.map((url, uIdx) => (
              <a
                key={uIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-zinc-800 dark:hover:text-zinc-200 inline-flex items-center gap-1"
              >
                <span>{url.replace('https://', '').split('/')[0]}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
};
