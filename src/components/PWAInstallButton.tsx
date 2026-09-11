import React from "react";
import { Smartphone, Download, Check } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall.ts";

interface PWAInstallButtonProps {
  onOpenAndroidPublish?: () => void;
  className?: string;
  variant?: "header" | "footer" | "banner";
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenAndroidPublish,
  className = "",
  variant = "header",
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();

  const handleClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed && onOpenAndroidPublish) {
        onOpenAndroidPublish();
      }
    } else if (onOpenAndroidPublish) {
      onOpenAndroidPublish();
    }
  };

  if (isInstalled) {
    return (
      <button
        onClick={onOpenAndroidPublish}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-700/40 hover:bg-emerald-900/50 transition ${className}`}
        title="Aasaan Android App is Active • View Publish & TWA Settings"
      >
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline font-semibold">Android App Active</span>
      </button>
    );
  }

  if (variant === "header") {
    return (
      <button
        id="aasaan-header-android-btn"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 transition shadow-xs ${className}`}
        title="Install Aasaan Android App or View Play Store TWA Package"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
        <span>{isAndroid ? "Android APK" : "APK / App"}</span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-sm ${className}`}
      >
        <Download className="w-3 h-3 stroke-[2.5]" />
        <span>{isInstallable ? "Install Android App" : "Android Publish Hub"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onOpenAndroidPublish}
      className={`inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-bold transition ${className}`}
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>Android Publish &amp; App</span>
    </button>
  );
};
