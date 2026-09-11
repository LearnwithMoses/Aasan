import React from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/usePWAInstall.ts";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="aasaan-offline-pill"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-amber-600/95 text-white px-3.5 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-xs border border-amber-400/50 animate-bounce"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>ஆஃப்லைன் முறை (Offline Mode) — Saved lesson plans and vault remain accessible.</span>
    </div>
  );
};
