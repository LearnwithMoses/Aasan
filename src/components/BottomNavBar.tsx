import React from "react";
import { Home, SlidersHorizontal, BookOpen, FolderHeart, Lightbulb } from "lucide-react";

export type AppNavTab = "home" | "form" | "textbooks" | "vault" | "guide";

interface BottomNavBarProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  savedPlansCount: number;
  hasPlan: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedPlansCount,
  hasPlan,
}) => {
  const tabs = [
    {
      id: "home" as AppNavTab,
      label: "Home",
      subLabel: "முகப்பு",
      icon: Home,
    },
    {
      id: "form" as AppNavTab,
      label: hasPlan ? "Plan" : "Generator",
      subLabel: "திட்டமிடு",
      icon: SlidersHorizontal,
      badge: hasPlan ? "Ready" : undefined,
    },
    {
      id: "textbooks" as AppNavTab,
      label: "Textbooks",
      subLabel: "பாடங்கள்",
      icon: BookOpen,
    },
    {
      id: "vault" as AppNavTab,
      label: "Vault",
      subLabel: "பெட்டகம்",
      icon: FolderHeart,
      count: savedPlansCount > 0 ? savedPlansCount : undefined,
    },
    {
      id: "guide" as AppNavTab,
      label: "Guide",
      subLabel: "வழிகாட்டி",
      icon: Lightbulb,
    },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-4px_20px_rgba(225,29,72,0.08)] px-2 py-1.5 no-print"
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-1 px-1 transition-all relative group"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? "text-rose-600 scale-110"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                {tab.count !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="absolute -top-1 -right-3 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded-full border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-bold mt-1 tracking-tight leading-none ${
                  isActive ? "text-rose-600 font-extrabold" : "text-slate-500"
                }`}
              >
                {tab.label}
              </span>

              {/* Blood Bridge inspired active bottom bar indicator */}
              <div className="h-1 w-6 mt-1 flex justify-center">
                {isActive && (
                  <div className="h-1 w-5 bg-rose-600 rounded-full transition-all duration-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
