import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { AudioService, PlaybackState } from '../services/audioPronunciation';
import { StorageService } from '../services/storage';
import { PronunciationConfig } from '../types';

export interface AudioPlayerButtonProps {
  id?: string;
  word: string;
  audioUrl?: string;
  phoneticText?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  id,
  word,
  audioUrl,
  phoneticText,
  className,
  size = 'default',
}) => {
  const [playback, setPlayback] = useState<PlaybackState>({ isPlaying: false });
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<PronunciationConfig>(StorageService.getVoiceConfig());

  useEffect(() => {
    const unsubscribe = AudioService.subscribe((state) => {
      setPlayback(state);
    });
    return () => unsubscribe();
  }, []);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playback.isPlaying) {
      AudioService.stop();
    } else {
      AudioService.playWord(word, audioUrl, config);
    }
  };

  const updateConfig = (newConfig: Partial<PronunciationConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    StorageService.saveVoiceConfig(updated);
  };

  const accents: Array<{ code: 'en-US' | 'en-GB' | 'en-AU' | 'en-IN'; label: string; flag: string }> = [
    { code: 'en-US', label: 'American (US)', flag: '🇺🇸' },
    { code: 'en-GB', label: 'British (UK)', flag: '🇬🇧' },
    { code: 'en-AU', label: 'Australian (AU)', flag: '🇦🇺' },
    { code: 'en-IN', label: 'Indian (IN)', flag: '🇮🇳' },
  ];

  const speeds = [
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1.0x' },
    { value: 1.25, label: '1.25x' },
  ];

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Button
        id={id || `play-audio-${word}`}
        onClick={handlePlay}
        variant={playback.isPlaying ? 'default' : 'secondary'}
        size={size}
        className={className}
        title={
          audioUrl && config.preferNativeRecording
            ? `Play native recording of "${word}"`
            : `Listen to voice pronunciation of "${word}" (Offline speech synthesis)`
        }
      >
        {playback.isPlaying ? (
          <div className="flex items-center gap-1.5 text-inherit">
            <span className="flex items-center gap-0.5 h-4">
              <span className="w-1 h-2 bg-current animate-pulse rounded-full" />
              <span className="w-1 h-4 bg-current animate-pulse delay-75 rounded-full" />
              <span className="w-1 h-3 bg-current animate-pulse delay-150 rounded-full" />
            </span>
            <span className="text-xs font-medium">Playing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-zinc-700 dark:text-zinc-200 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">
              {phoneticText ? phoneticText : 'Listen'}
            </span>
            {audioUrl && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Native audio clip available" />
            )}
          </div>
        )}
      </Button>

      {/* Pronunciation options button */}
      <button
        id={`voice-options-${word}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowSettings(!showSettings);
        }}
        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        title="Voice pronunciation settings (accent & speed)"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
      </button>

      {/* Popover Settings */}
      {showSettings && (
        <div
          className="absolute left-0 top-full mt-2 z-40 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-3 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800 font-medium text-zinc-900 dark:text-zinc-100">
            <span>Pronunciation Options</span>
            <span className="text-[10px] text-zinc-400">Offline speech engine</span>
          </div>

          {/* Accent choice */}
          <div className="space-y-1.5">
            <label className="text-zinc-500 dark:text-zinc-400 font-medium">Accent / Dialect</label>
            <div className="grid grid-cols-2 gap-1">
              {accents.map((acc) => (
                <button
                  key={acc.code}
                  type="button"
                  onClick={() => updateConfig({ accent: acc.code })}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-left transition-colors ${
                    config.accent === acc.code
                      ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span>{acc.flag}</span>
                  <span className="truncate">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Playback speed */}
          <div className="space-y-1.5">
            <label className="text-zinc-500 dark:text-zinc-400 font-medium">Speed</label>
            <div className="flex items-center gap-1.5">
              {speeds.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => updateConfig({ rate: s.value })}
                  className={`flex-1 py-1 rounded text-center transition-colors ${
                    config.rate === s.value
                      ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Native recording preference if audio URL exists */}
          {audioUrl && (
            <label className="flex items-center gap-2 pt-1 text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={config.preferNativeRecording}
                onChange={(e) => updateConfig({ preferNativeRecording: e.target.checked })}
                className="rounded border-zinc-300 text-zinc-900"
              />
              <span>Prefer native human audio clip</span>
            </label>
          )}

          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
