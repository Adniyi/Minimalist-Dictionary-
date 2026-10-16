import { PronunciationConfig } from '../types';
import { StorageService } from './storage';

export interface PlaybackState {
  isPlaying: boolean;
  type?: 'recording' | 'speech_synthesis';
  error?: string;
}

type PlaybackListener = (state: PlaybackState) => void;

class AudioPronunciationManager {
  private currentAudio: HTMLAudioElement | null = null;
  private listeners: Set<PlaybackListener> = new Set();
  private isPlaying = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
    }
    return this.availableVoices;
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener({ isPlaying: this.isPlaying });
    return () => this.listeners.delete(listener);
  }

  private notify(state: PlaybackState) {
    this.isPlaying = state.isPlaying;
    this.listeners.forEach(fn => fn(state));
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify({ isPlaying: false });
  }

  /**
   * Play pronunciation using audio clip URL if available, or speech synthesis
   */
  public async playWord(
    word: string,
    audioUrl?: string,
    customConfig?: Partial<PronunciationConfig>
  ): Promise<void> {
    this.stop();

    const config: PronunciationConfig = {
      ...StorageService.getVoiceConfig(),
      ...customConfig,
    };

    // If audio URL is provided and user prefers native recordings
    if (audioUrl && config.preferNativeRecording) {
      try {
        this.notify({ isPlaying: true, type: 'recording' });
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onended = () => {
          this.currentAudio = null;
          this.notify({ isPlaying: false });
        };

        audio.onerror = () => {
          this.currentAudio = null;
          // Fallback to speech synthesis if audio file failed to load
          this.speakText(word, config);
        };

        await audio.play();
        return;
      } catch {
        // Fallback to speech synthesis
        this.speakText(word, config);
        return;
      }
    }

    // Fallback or explicit Speech Synthesis
    this.speakText(word, config);
  }

  /**
   * Browser Speech Synthesis for offline or synthesized pronunciation
   */
  private speakText(text: string, config: PronunciationConfig) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.notify({ isPlaying: false, error: 'Speech synthesis is not supported on this browser.' });
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = config.rate || 1.0;
      utterance.pitch = config.pitch || 1.0;
      utterance.lang = config.accent || 'en-US';

      // Attempt to pick a matching high quality English voice
      const voices = this.getVoices();
      const matchedVoice = voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith(config.accent.toLowerCase()))
        || voices.find(v => v.lang.startsWith('en'));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      this.notify({ isPlaying: true, type: 'speech_synthesis' });

      utterance.onend = () => {
        this.notify({ isPlaying: false });
      };

      utterance.onerror = (e) => {
        // 'canceled' is normal if user clicked again
        if (e.error !== 'canceled') {
          this.notify({ isPlaying: false, error: e.error });
        } else {
          this.notify({ isPlaying: false });
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Speech synthesis failed';
      this.notify({ isPlaying: false, error: errMsg });
    }
  }
}

export const AudioService = new AudioPronunciationManager();
