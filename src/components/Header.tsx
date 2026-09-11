import React from "react";
import {
  Sparkles,
  Printer,
  FolderHeart,
  Gift,
  GraduationCap,
  Info,
  BookOpen,
  Folder,
  FolderOpen,
  Bell,
  Heart,
  Settings,
  Lightbulb,
} from "lucide-react";
import { UserProfile } from "../types.ts";
import { AasaanLogo } from "./AasaanLogo.tsx";
import { PWAInstallButton } from "./PWAInstallButton.tsx";

interface HeaderProps {
  onLoadPreset?: (id: string) => void;
  hasPlan?: boolean;
  onPrint?: () => void;
  isPro: boolean;
  proDaysRemaining: number;
  userProfile: UserProfile | null;
  savedPlansCount: number;
  onOpenVault: () => void;
  onOpenUpgrade: () => void;
  onOpenRegistration: () => void;
  onOpenQuestionPaper: () => void;
  onOpenBrandModal?: () => void;
  onOpenAndroidPublish?: () => void;
  onOpenTextbookDrawer?: () => void;
  onOpenNotifications?: () => void;
  onOpenTeacherGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasPlan,
  onPrint,
  isPro,
  proDaysRemaining,
  userProfile,
  savedPlansCount,
  onOpenVault,
  onOpenUpgrade,
  onOpenRegistration,
  onOpenQuestionPaper,
  onOpenBrandModal,
  onOpenAndroidPublish,
  onOpenTextbookDrawer,
  onOpenNotifications,
  onOpenTeacherGuide,
}) => {
  return (
    <header className="bg-[#0f172a] text-white px-4 sm:px-6 py-3 border-b border-slate-800/80 transition-all shadow-md sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Settings / Profile button matching Blood Bridge top bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenBrandModal}
            className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 shadow-xs transition"
            title="Settings & Aasaan Heritage / ஆசான் மரபு"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Centered Brand Logo */}
          <AasaanLogo
            size="md"
            showTagline={false}
            interactive={true}
            onClick={onOpenBrandModal}
          />

          {/* Pro Status Pill */}
          {isPro ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-[#d9ad57]" />
              <span>Pro Active ({proDaysRemaining}d left)</span>
            </span>
          ) : (
            <button
              onClick={onOpenRegistration}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/30 transition"
            >
              <Gift className="w-3 h-3 text-emerald-400" />
              <span>1st Month Free</span>
            </button>
          )}
        </div>

        {/* Center / Motto matching Blood Bridge handwritten slogan */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-rose-200/90 italic font-semibold">
          <span>"A lesson today, A brighter tomorrow"</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block ml-0.5" />
        </div>

        {/* Right Actions matching Screenshot */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell matching Screenshot 6 */}
          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 shadow-xs transition"
              title="Classroom & Curriculum Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
            </button>
          )}

          {/* Teacher Pedagogy Guide (01..07) */}
          {onOpenTeacherGuide && (
            <button
              type="button"
              onClick={onOpenTeacherGuide}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-700/40 transition shadow-2xs"
              title="Step-by-step teacher guide, 5E steps & pedagogy myths"
            >
              <Lightbulb className="w-3.5 h-3.5 text-rose-400" />
              <span>01-07 Guide</span>
            </button>
          )}

          {/* Master Textbooks & Materials Folder (Classes 1-12) Button */}
          {onOpenTextbookDrawer && (
            <button
              onClick={onOpenTextbookDrawer}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/50 transition shadow-2xs"
              title="பாடநூல் பெட்டகம் • All Textbooks, Guides & Materials Folder (Classes 1 to 12)"
            >
              <Folder className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>பாடநூல் பெட்டகம் (1-12)</span>
            </button>
          )}

          {/* Question Paper Generator Button */}
          <button
            onClick={onOpenQuestionPaper}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-700/50 transition shadow-2xs"
            title="Open Question Paper Generator & Past 10-Year Board Questions"
          >
            <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
            <span>Question Papers</span>
            <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.2 rounded font-extrabold">
              PRO
            </span>
          </button>

          {/* Android App & Publish Button */}
          <PWAInstallButton onOpenAndroidPublish={onOpenAndroidPublish} variant="header" />

          {/* Vault Button */}
          <button
            onClick={onOpenVault}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Open saved lesson plans vault"
          >
            <FolderHeart className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden lg:inline">My Vault</span>
            {savedPlansCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-extrabold">
                {savedPlansCount}
              </span>
            )}
          </button>

          {/* Print / PDF Button */}
          {hasPlan && onPrint && (
            <button
              onClick={onPrint}
              id="header-print-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition"
              title="Print or export current lesson plan"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          )}

          {/* Upgrade / Pricing Button */}
          {!isPro ? (
            <button
              onClick={onOpenUpgrade}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>₹50/mo</span>
            </button>
          ) : (
            <button
              onClick={onOpenUpgrade}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d9ad57]" />
              <span>Subscribed</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
