import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { StorageService } from '../services/storage';

export interface AdBannerProps {
  id?: string;
  slotType: 'leaderboard' | 'rectangle' | 'in-feed';
  slotId?: string;
  className?: string;
  onOpenGuide?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  id,
  slotType,
  slotId,
  className,
  onOpenGuide,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState(StorageService.getAdSenseConfig());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setConfig(StorageService.getAdSenseConfig());
  }, []);

  useEffect(() => {
    // If real AdSense script is injected and client ID is configured
    if (config.enabled && config.client && !config.client.includes('0000000000') && typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle;
        if (adsbygoogle) {
          adsbygoogle.push({});
          setIsLoaded(true);
        }
      } catch {
        // Safe catch for adblockers or script errors
      }
    }
  }, [config]);

  if (!config.enabled) {
    return null;
  }

  const isRealAdConfigured = config.client && !config.client.includes('0000000000') && slotId && slotId !== '1234567890';

  const dimensions = {
    leaderboard: 'min-h-[90px] w-full max-w-[728px]',
    rectangle: 'min-h-[250px] w-full max-w-[336px]',
    'in-feed': 'min-h-[100px] w-full',
  }[slotType];

  return (
    <aside
      id={id || `ad-container-${slotType}`}
      aria-label="Advertisement"
      className={cn('my-4 flex flex-col items-center justify-center overflow-hidden', className)}
    >
      <div className="w-full flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 uppercase px-1 pb-1">
        <span>Advertisement • Ads by Google</span>
        {onOpenGuide && (
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            title="How to configure Google AdSense"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Setup AdSense</span>
          </button>
        )}
      </div>

      <div
        ref={adRef}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 p-3 text-center transition-colors',
          dimensions
        )}
      >
        {isRealAdConfigured ? (
          // Real Google AdSense Unit
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: slotType === 'rectangle' ? '250px' : '90px' }}
            data-ad-client={config.client}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          // Minimalist AdSense Simulation & Slot Placeholder
          <div className="flex flex-col items-center justify-center p-2 text-zinc-500 dark:text-zinc-400 space-y-1.5 max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                AdSense Space: {slotType.toUpperCase()}
              </span>
              <span className="text-[11px] text-zinc-400">
                {slotType === 'leaderboard' ? '728×90' : slotType === 'rectangle' ? '300×250 / 336×280' : 'Responsive In-Feed'}
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Google AdSense display ad container ready for publisher monetization.
            </p>

            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 hover:underline font-medium pt-1"
              >
                <span>View AdSense Setup Guide</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
