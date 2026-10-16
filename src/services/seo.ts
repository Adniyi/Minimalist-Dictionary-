import { WordEntry } from '../types';

export class SeoService {
  private static setMetaTag(selector: string, content: string): void {
    if (typeof document === 'undefined') return;
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (el) {
      el.setAttribute('content', content);
    }
  }

  private static setLinkTag(rel: string, href: string): void {
    if (typeof document === 'undefined') return;
    let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (el) {
      el.setAttribute('href', href);
    }
  }

  /**
   * Dynamically update meta tags and SEO description for looked-up words
   */
  static updateWordSeo(entry: WordEntry): void {
    if (typeof document === 'undefined') return;

    const wordCapitalized = entry.word.charAt(0).toUpperCase() + entry.word.slice(1);
    const phoneticStr = entry.phonetic ? ` [${entry.phonetic}]` : '';
    const firstMeaning = entry.meanings[0];
    const partOfSpeech = firstMeaning?.partOfSpeech ? `(${firstMeaning.partOfSpeech})` : '';
    const definition = firstMeaning?.definitions[0]?.definition || '';

    // Clean description between 120 and 160 characters for optimal Google search snippet
    const rawDesc = `Definition of ${entry.word}${phoneticStr} ${partOfSpeech}: ${definition}. Free offline dictionary lookup, human voice audio, phonetic transcription, and synonyms.`;
    const snippetDesc = rawDesc.length > 158 ? rawDesc.slice(0, 155).trim() + '...' : rawDesc;

    // 1. Title
    const pageTitle = `${wordCapitalized} – Meaning, Definition & Voice Pronunciation | Minimalist Offline Dictionary`;
    document.title = pageTitle;

    // 2. Primary Meta Tags
    this.setMetaTag('meta[name="title"]', pageTitle);
    this.setMetaTag('meta[name="description"]', snippetDesc);

    // 3. OpenGraph Social Cards
    this.setMetaTag('meta[property="og:title"]', pageTitle);
    this.setMetaTag('meta[property="og:description"]', snippetDesc);

    // 4. Twitter / X Cards
    this.setMetaTag('meta[name="twitter:title"]', pageTitle);
    this.setMetaTag('meta[name="twitter:description"]', snippetDesc);

    // 5. Canonical URL
    if (typeof window !== 'undefined') {
      const canonicalUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(entry.word)}`;
      this.setLinkTag('canonical', canonicalUrl);
      this.setMetaTag('meta[property="og:url"]', canonicalUrl);
    }
  }

  /**
   * Reset to default home page SEO tags
   */
  static resetToDefault(): void {
    if (typeof document === 'undefined') return;

    const defaultTitle = 'Minimalist Offline Dictionary – Free English Definitions, IPA & Voice Audio';
    const defaultDesc = 'Fast, minimalist English dictionary with offline lookup, dual fail-safe APIs, voice pronunciation, IPA phonetics, examples, and synonyms. Free, clean & ad-friendly.';

    document.title = defaultTitle;
    this.setMetaTag('meta[name="title"]', defaultTitle);
    this.setMetaTag('meta[name="description"]', defaultDesc);
    this.setMetaTag('meta[property="og:title"]', defaultTitle);
    this.setMetaTag('meta[property="og:description"]', defaultDesc);
    this.setMetaTag('meta[name="twitter:title"]', defaultTitle);
    this.setMetaTag('meta[name="twitter:description"]', defaultDesc);

    if (typeof window !== 'undefined') {
      const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
      this.setLinkTag('canonical', canonicalUrl);
      this.setMetaTag('meta[property="og:url"]', canonicalUrl);
    }
  }
}
