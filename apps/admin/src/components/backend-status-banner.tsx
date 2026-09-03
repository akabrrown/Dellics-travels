"use client";

import React, { useEffect, useState } from "react";
import {
  WifiOff,
  RefreshCw,
  Terminal,
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import {
  subscribeBackendStatus,
  checkBackendHealth,
  getBackendOnlineStatus,
} from "@/lib/api";
import { ADMIN_CONFIG } from "@/lib/config";

export function BackendStatusBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [reconnectedMessage, setReconnectedMessage] = useState<boolean>(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(getBackendOnlineStatus());

    const unsubscribe = subscribeBackendStatus((online) => {
      setIsOnline(online);
      if (online) {
        setDismissed(false);
      }
    });

    // Background periodic health probe (every 20 seconds)
    const interval = setInterval(async () => {
      if (!getBackendOnlineStatus()) {
        const healthy = await checkBackendHealth();
        if (healthy) {
          setReconnectedMessage(true);
          window.dispatchEvent(new CustomEvent("dellics:refresh-data"));
          setTimeout(() => setReconnectedMessage(false), 4000);
        }
      }
    }, 20000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleManualRetry = async () => {
    setChecking(true);
    try {
      const healthy = await checkBackendHealth();
      if (healthy) {
        setReconnectedMessage(true);
        window.dispatchEvent(new CustomEvent("dellics:refresh-data"));
        setTimeout(() => setReconnectedMessage(false), 4000);
      }
    } finally {
      setChecking(false);
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("pnpm --filter api start:dev");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (reconnectedMessage) {
    return (
      <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs transition-all duration-300">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Live Dellics API backend connected successfully at {ADMIN_CONFIG.apiUrl}. Syncing live records...</span>
        </div>
      </div>
    );
  }

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-[#F4740D] text-white px-4 py-2.5 text-xs shadow-sm transition-all duration-300 border-b border-amber-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <div className="flex items-center gap-2">
            <WifiOff className="size-3.5 shrink-0" />
            <span className="font-bold">Offline Demo Mode</span>
            <span className="text-amber-100 hidden sm:inline">
              — API backend offline at <code className="bg-amber-700/60 px-1.5 py-0.5 rounded font-mono text-[11px]">{ADMIN_CONFIG.apiUrl}</code>. Displaying simulated travel records.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={handleManualRetry}
            disabled={checking}
            className="px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`size-3 ${checking ? "animate-spin" : ""}`} />
            <span>{checking ? "Checking..." : "Retry Connection"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Terminal className="size-3" />
            <span>How to Start</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded-md hover:bg-white/20 text-amber-100 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
          <div className="space-y-0.5">
            <p className="font-semibold text-white">To connect live database records and process live bookings:</p>
            <p className="text-amber-100">
              Open a new terminal window in your workspace root and start the NestJS API server on port 3000:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-slate-900 text-amber-200 px-2.5 py-1 rounded font-mono text-xs shadow-inner">
              pnpm --filter api start:dev
            </code>
            <button
              type="button"
              onClick={handleCopyCommand}
              className="p-1.5 rounded bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Copy Command"
            >
              {copied ? <Check className="size-3 text-emerald-300" /> : <Copy className="size-3" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
