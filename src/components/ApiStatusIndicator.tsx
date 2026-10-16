import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck, RefreshCw, ChevronDown, Check, Server } from 'lucide-react';
import { StorageService } from '../services/storage';

export interface ApiStatusIndicatorProps {
  lastProvider?: string;
  failedProviders?: string[];
  isOffline: boolean;
  onPrimaryApiChanged?: (api: 'freedictionary' | 'dictionaryapi') => void;
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({
  lastProvider,
  failedProviders = [],
  isOffline,
  onPrimaryApiChanged,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [primaryApi, setPrimaryApi] = useState<'freedictionary' | 'dictionaryapi'>(StorageService.getPrimaryApi());

  const handleSelectPrimary = (api: 'freedictionary' | 'dictionaryapi') => {
    setPrimaryApi(api);
    StorageService.setPrimaryApi(api);
    if (onPrimaryApiChanged) onPrimaryApiChanged(api);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="api-status-dropdown-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
      >
        <span className="flex items-center gap-1.5">
          {isOffline ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode</span>
            </span>
          ) : failedProviders.length > 0 ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fail-Safe Active</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>APIs Active</span>
            </span>
          )}
        </span>
        <ChevronDown className="w-3 h-3 text-zinc-400" />
      </button>

      {isOpen && (
        <div
          id="api-status-popover"
          className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-3 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100">
            <span>Fail-Safe Engine Status</span>
            <span className="text-[10px] font-normal text-zinc-400">Dual redundancy</span>
          </div>

          <div className="space-y-2">
            {/* Primary API 1: FreeDictionary */}
            <div className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">FreeDictionary API</span>
                  {primaryApi === 'freedictionary' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">freedictionaryapi.com/api/v1</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1" title="Active & Responsive" />
            </div>

            {/* Fallback API 2: DictionaryAPI.dev */}
            <div className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">DictionaryAPI.dev</span>
                  {primaryApi === 'dictionaryapi' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">api.dictionaryapi.dev/api/v2</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" title="Fail-Safe Standby" />
            </div>

            {/* Offline Engine */}
            <div className="flex items-start justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="font-medium text-zinc-800 dark:text-zinc-200">Local Offline Engine</div>
                <p className="text-[11px] text-zinc-500">IndexedDB + Pre-cached Lexicon</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1" title="Always Available" />
            </div>
          </div>

          {/* Primary toggle */}
          <div className="pt-1 space-y-1">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Set Preferred Primary API:</span>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => handleSelectPrimary('freedictionary')}
                className={`p-1.5 rounded text-center transition-colors ${
                  primaryApi === 'freedictionary'
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                FreeDictionary
              </button>
              <button
                type="button"
                onClick={() => handleSelectPrimary('dictionaryapi')}
                className={`p-1.5 rounded text-center transition-colors ${
                  primaryApi === 'dictionaryapi'
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                DictionaryAPI.dev
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
            If the primary API encounters timeouts or errors, requests instantly failover to the secondary endpoint automatically.
          </div>
        </div>
      )}
    </div>
  );
};
