import React, { useState } from "react";
import {
  Smartphone,
  Download,
  Copy,
  Check,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Terminal,
  X,
  FileCode,
  Flame,
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall.ts";
import { AasaanLogo } from "./AasaanLogo.tsx";

interface AndroidPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidPublishModal: React.FC<AndroidPublishModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<"apk" | "install" | "playstore" | "manifest">("apk");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://aasaan.app";
  const manifestUrl = `${currentOrigin}/manifest.webmanifest`;
  const pwaBuilderApkUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentOrigin)}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const bubblewrapSnippet = `# 1. Install Google official Android TWA CLI
npm install -g @bubblewrap/cli

# 2. Initialize Android Project from Aasaan Manifest
bubblewrap init --manifest="${manifestUrl}"

# 3. Build signed Android App Bundle (.aab) & APK for Google Play
bubblewrap build`;

  const downloadManifest = () => {
    const manifestContent = {
      id: "/",
      name: "Aasaan (ஆசான்) — Master Pedagogy Suite",
      short_name: "Aasaan",
      description: "ஆசான் (Aasaan) — Sovereign Tamil and Indian pedagogical suite for school educators. Features Samacheer Kalvi and national board blueprints, question paper banks, CCE assessment rubrics, and 30-week syllabus planners.",
      theme_color: "#0f172a",
      background_color: "#0f172a",
      display: "standalone",
      orientation: "portrait-primary",
      start_url: "/",
      scope: "/",
      categories: ["education", "productivity"],
      lang: "ta-IN",
      dir: "ltr",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/pwa-maskable-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    };

    const blob = new Blob([JSON.stringify(manifestContent, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.webmanifest";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="android-publish-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="android-publish-modal-card"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#0b1329] via-[#151c38] to-[#1e1b4b] p-5 sm:p-6 border-b border-slate-800">
          <button
            id="close-android-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  ஆசான் Android &amp; Publish Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready to Publish
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Install as a native Android app or publish to Google Play Store via Trusted Web Activity (TWA)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-b border-slate-800 -mb-5 sm:-mb-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("apk")}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition border-b-2 whitespace-nowrap ${
                activeTab === "apk"
                  ? "border-rose-500 text-rose-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>APK கோப்பு (.apk File)</span>
            </button>
            <button
              onClick={() => setActiveTab("install")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition border-b-2 whitespace-nowrap ${
                activeTab === "install"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android-ல் நிறுவுக (Instant Install)</span>
            </button>
            <button
              onClick={() => setActiveTab("playstore")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition border-b-2 whitespace-nowrap ${
                activeTab === "playstore"
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Play Store / TWA</span>
            </button>
            <button
              onClick={() => setActiveTab("manifest")}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition border-b-2 whitespace-nowrap ${
                activeTab === "manifest"
                  ? "border-purple-400 text-purple-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Manifest</span>
            </button>
          </div>
        </div>

        {/* Tab 0: Direct APK Download & Sideloading */}
        {activeTab === "apk" && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Direct 1-Click APK Generator Card */}
            <div className="bg-gradient-to-r from-rose-950/40 via-red-950/30 to-slate-900 border border-rose-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg shadow-rose-950/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30 flex-shrink-0">
                    <Download className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">
                        ஆசான் APK கோப்பு பதிவிறக்கம் (Download APK)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        1-Click
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Use Microsoft / Google's official open-source <strong>PWABuilder Android Package Engine</strong> to generate and download a signed <code className="text-rose-300 font-mono">aasaan-release.apk</code> package for any Android phone.
                    </p>
                  </div>
                </div>

                <a
                  href={pwaBuilderApkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate &amp; Download APK</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Direct Download Icon PNG for PWABuilder */}
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center p-1.5 flex-shrink-0">
                  <img src="/pwa-512x512.png" alt="Aasan App Icon" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-xs sm:text-sm">Official App Icon (512×512 PNG)</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-semibold">Ready for Upload</span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">
                    If PWABuilder asks <span className="text-amber-300 font-medium">"Upload at least one icon PNG"</span>, click here to download the file and upload it.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="/pwa-512x512.png"
                  download="aasan-icon-512x512.png"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 512×512 PNG</span>
                </a>
                <a
                  href="/pwa-192x192.png"
                  download="aasan-icon-192x192.png"
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>192×192</span>
                </a>
              </div>
            </div>

            {/* Step-by-Step APK Sideloading Guide */}
            <div className="bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
              <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-400" />
                <span>How to Install the APK on your Android Phone (Sideloading):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">1</span>
                    <span>Download APK</span>
                  </div>
                  <p className="text-slate-400 text-[11.5px] leading-relaxed">
                    Click "Generate &amp; Download APK" above or in PWABuilder, click <strong>"Package for Android"</strong> to download the <code className="text-slate-300">.apk</code> file.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">2</span>
                    <span>Allow Unknown Apps</span>
                  </div>
                  <p className="text-slate-400 text-[11.5px] leading-relaxed">
                    Tap the downloaded file. When prompted, tap <strong>Settings</strong> and enable <strong>"Allow from this source"</strong> (Chrome / Files).
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">3</span>
                    <span>Tap Install</span>
                  </div>
                  <p className="text-slate-400 text-[11.5px] leading-relaxed">
                    Tap <strong>"Install"</strong>. Android will verify the package and add Aasaan to your app drawer with native high performance.
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                    <span>Instant Alternative (No File Transfer)</span>
                  </div>
                  <p className="text-slate-400 text-[11.5px] leading-relaxed">
                    Open this link on your phone in Chrome, tap <strong>"Install App"</strong> in the top bar to install immediately without downloading an APK file!
                  </p>
                </div>
              </div>
            </div>

            {/* Package Metadata */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Package Name:</span>
                <code className="text-emerald-400 font-mono font-bold">com.aasaan.pedagogy.studio</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">App Version:</span>
                <span className="text-slate-200 font-semibold">2.4.0 (Tamil &amp; National Edition)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Min Android:</span>
                <span className="text-slate-200 font-semibold">Android 8.0+ (Oreo, Pie, 10, 11, 12, 13, 14, 15)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Instant Android Install */}
        {activeTab === "install" && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Status Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                  <AasaanLogo size="sm" showTagline={false} interactive={false} />
                </div>
                <div>
                  <div className="font-bold text-slate-100 text-sm">ஆசான் (Aasaan) Android App</div>
                  <div className="text-xs text-slate-400">
                    Package: <code className="text-emerald-400">com.aasaan.pedagogy.studio</code>
                  </div>
                </div>
              </div>

              {isInstalled ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ஏற்கனவே நிறுவப்பட்டுள்ளது (Installed)</span>
                </div>
              ) : isInstallable ? (
                <button
                  id="direct-install-android-btn"
                  onClick={install}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Android-ல் நிறுவுக (Install Now)</span>
                </button>
              ) : (
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span>Use Chrome menu → <strong>"Add to Home screen"</strong></span>
                </div>
              )}
            </div>

            {/* Android Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3.5">
                <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>முழுத்திரை அனுபவம்</span>
                </div>
                <p className="text-[12px] text-slate-300 mt-1 leading-relaxed">
                  Standalone mode with zero browser address bar, running identically to a native Play Store app.
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3.5">
                <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  <span>ஆஃப்லைன் பாடத்திட்டம்</span>
                </div>
                <p className="text-[12px] text-slate-300 mt-1 leading-relaxed">
                  Saved plans, blueprints, and question templates cached locally for remote village classrooms.
                </p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3.5">
                <div className="text-purple-400 text-xs font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>பகிர்வு &amp; அச்சிடுதல்</span>
                </div>
                <p className="text-[12px] text-slate-300 mt-1 leading-relaxed">
                  Direct Android Print &amp; PDF generation formatted for standard A4 question paper sheets.
                </p>
              </div>
            </div>

            {/* Manual Android Instructions */}
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>How to install on any Android phone (Chrome / Brave / Edge):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                <li>Open this web application in Google Chrome on your Android device.</li>
                <li>Tap the <strong>three dots (⋮)</strong> in the top right corner.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>The golden Aasaan crest icon will appear on your app launcher with native launch performance!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: Google Play Store / TWA (Trusted Web Activity) */}
        {activeTab === "playstore" && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Google Play Console Ready (Trusted Web Activity)</span>
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                  TWA Spec 2.0
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aasaan is fully compliant with Google Play Store guidelines for Trusted Web Activities. You can package it into an <strong>Android App Bundle (.aab)</strong> and publish to Google Play Store using either Google's official Bubblewrap CLI or PWABuilder.
              </p>
            </div>

            {/* Method A: 1-Click PWA Builder */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Method 1: One-Click Android Package via PWABuilder (Fastest)</span>
                </div>
              </div>
              <p className="text-[12px] text-slate-400 mb-3">
                Visit PWABuilder with this live URL to auto-generate a signed Android APK / AAB package ready to upload to Google Play Console:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentOrigin}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 flex-1 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(currentOrigin, "origin")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-semibold text-white transition flex items-center gap-1"
                >
                  {copiedText === "origin" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
                <a
                  href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentOrigin)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <span>Open PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Download PNG for PWABuilder prompt */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 text-[11.5px]">If PWABuilder asks you to upload an icon PNG:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="/pwa-512x512.png"
                    download="aasan-icon-512x512.png"
                    className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download 512×512 PNG</span>
                  </a>
                  <a
                    href="/pwa-192x192.png"
                    download="aasan-icon-192x192.png"
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>192×192</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Method B: Bubblewrap CLI */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Method 2: Google Official Bubblewrap CLI</span>
                </div>
                <button
                  onClick={() => copyToClipboard(bubblewrapSnippet, "bubblewrap")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[11px] font-semibold text-slate-200 transition flex items-center gap-1"
                >
                  {copiedText === "bubblewrap" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Commands</span>
                </button>
              </div>
              <pre className="bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                {bubblewrapSnippet}
              </pre>
            </div>

            {/* Method C: GitHub Actions Automated APK Build */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Method 3: Automated GitHub Actions APK Build</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                  Pre-configured
                </span>
              </div>
              <p className="text-[12px] text-slate-300 leading-relaxed">
                A complete GitHub Actions workflow (<code className="text-blue-300">.github/workflows/build-apk.yml</code>) is pre-installed in this project. When you export this repository to GitHub, it automatically spins up an Android virtual machine, compiles the APK, and attaches the downloadable <code className="text-emerald-400 font-mono">aasan-release-apk.zip</code> to your GitHub Actions run!
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Manifest & Verification */}
        {activeTab === "manifest" && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Web App Manifest &amp; Digital Asset Links</span>
              </h3>
              <button
                onClick={downloadManifest}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Manifest</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Android Package ID:</div>
                <code className="text-emerald-400 font-mono text-sm font-bold">com.aasaan.pedagogy.studio</code>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Live Manifest URL:</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-amber-300 font-mono text-[11px] break-all">{manifestUrl}</code>
                  <button
                    onClick={() => copyToClipboard(manifestUrl, "manifest-url")}
                    className="p-1 hover:text-white text-slate-400"
                  >
                    {copiedText === "manifest-url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Digital Asset Links Status:</div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configured in <code>/.well-known/assetlinks.json</code></span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Android Icon Specifications:</div>
                <ul className="text-slate-300 list-disc list-inside space-y-1 text-[11px]">
                  <li><code>/pwa-192x192.png</code>: Standard 192px home screen launcher icon.</li>
                  <li><code>/pwa-512x512.png</code>: High-DPI 512px splash screen &amp; Play Store icon.</li>
                  <li><code>/pwa-maskable-512x512.png</code>: Adaptive maskable icon with 15% safe-zone margin.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            ஆசான் • Designed for Tamil &amp; Indian educators on mobile &amp; desktop.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            மூடுக (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
