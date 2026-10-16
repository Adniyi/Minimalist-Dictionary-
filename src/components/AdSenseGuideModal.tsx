import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, DollarSign, FileText, Code2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { StorageService } from '../services/storage';
import { AdSenseConfig } from '../types';

export interface AdSenseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: (config: AdSenseConfig) => void;
}

export const AdSenseGuideModal: React.FC<AdSenseGuideModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'config'>('instructions');
  const [config, setConfig] = useState<AdSenseConfig>(StorageService.getAdSenseConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveAdSenseConfig(config);
    if (onConfigUpdated) onConfigUpdated(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const snippetScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.client || 'ca-pub-XXXXXXXXXXXXXXXX'}"
  crossorigin="anonymous"></script>`;

  const snippetAdsTxt = `google.com, ${config.client?.replace('ca-', '') || 'pub-XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`;

  return (
    <div
      id="adsense-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="adsense-modal-container"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-6 text-zinc-900 dark:text-zinc-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Google AdSense Setup Guide</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Step-by-step instructions to monetize this dictionary app
              </p>
            </div>
          </div>
          <button
            id="close-adsense-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-4 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-xs font-medium">
          <button
            id="tab-instructions-btn"
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'instructions'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Detailed Instructions
          </button>
          <button
            id="tab-config-btn"
            type="button"
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Slot ID Configuration
          </button>
        </div>

        {activeTab === 'instructions' ? (
          <div className="mt-5 space-y-6 text-sm text-zinc-700 dark:text-zinc-300">
            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">1</span>
                <span>Sign Up for Google AdSense & Add Your Site</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8">
                Visit{' '}
                <a
                  href="https://www.google.com/adsense/start/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-1"
                >
                  google.com/adsense/start <ExternalLink className="w-3 h-3" />
                </a>{' '}
                with your Google Account. Click <strong>Sites &gt; Add Site</strong>, and input your deployed website domain URL (e.g. your custom domain or Cloud Run deployment URL).
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">2</span>
                <span>Connect Your Site with the AdSense Code Tag</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8">
                Google provides an AdSense script snippet containing your unique Publisher ID (formatted as <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px]">ca-pub-XXXXXXXXXXXXXXXX</code>). This script is placed inside the <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px]">&lt;head&gt;</code> tag of <code className="font-mono text-[11px]">index.html</code>.
              </p>
              <div className="relative ml-8 rounded-lg bg-zinc-950 p-3 text-xs text-zinc-200 font-mono">
                <pre className="overflow-x-auto">{snippetScript}</pre>
                <button
                  onClick={() => handleCopy(snippetScript, 1)}
                  className="absolute top-2.5 right-2.5 p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="Copy code"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">3</span>
                <span>Configure the ads.txt File</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8">
                Google checks for an <code className="font-mono text-[11px]">ads.txt</code> file in your domain root to protect your advertising inventory. We have pre-created <code className="font-mono text-[11px]">/public/ads.txt</code> for you. Update the pub ID with your actual ID:
              </p>
              <div className="relative ml-8 rounded-lg bg-zinc-950 p-3 text-xs text-zinc-200 font-mono">
                <pre>{snippetAdsTxt}</pre>
                <button
                  onClick={() => handleCopy(snippetAdsTxt, 2)}
                  className="absolute top-2.5 right-2.5 p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="Copy ads.txt format"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold">4</span>
                <span>Create Display Ad Units & Enter Slot IDs</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8">
                In AdSense, go to <strong>Ads &gt; By ad unit &gt; Display ads</strong>. Create:
                <br />• <strong>Leaderboard Ad</strong> (Horizontal / Responsive) for top of page
                <br />• <strong>Square / Rectangle Ad</strong> (300×250) for the sidebar
                <br />Paste the generated slot IDs in the <em>Slot ID Configuration</em> tab above!
              </p>
            </div>

            {/* Step 5 */}
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>AdSense Policy & Quality Tips for Approval</span>
              </div>
              <ul className="list-disc list-inside text-xs text-emerald-900 dark:text-emerald-200/90 mt-1.5 space-y-1 pl-1">
                <li>Ensure your site has unique value: this dictionary provides curated offline vocabulary, phonetics, audio playback, and failover search.</li>
                <li>Never click on your own ads or encourage users to click ads.</li>
                <li>Maintain reasonable ad density: our slots are non-intrusive and adhere strictly to Google Better Ads Standards.</li>
              </ul>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveConfig} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                AdSense Publisher Client ID (e.g. ca-pub-1234567890123456)
              </label>
              <Input
                id="adsense-client-input"
                value={config.client}
                onChange={e => setConfig({ ...config, client: e.target.value })}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Top Leaderboard Slot ID
                </label>
                <Input
                  id="adsense-top-slot-input"
                  value={config.topSlotId}
                  onChange={e => setConfig({ ...config, topSlotId: e.target.value })}
                  placeholder="e.g. 1234567890"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Sidebar Rectangle Slot ID
                </label>
                <Input
                  id="adsense-side-slot-input"
                  value={config.sideSlotId}
                  onChange={e => setConfig({ ...config, sideSlotId: e.target.value })}
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
                />
                <span>Enable Ad Containers on Page</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button id="save-adsense-config-btn" type="submit" size="sm">
                {savedSuccess ? 'Settings Saved!' : 'Save AdSense Settings'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
