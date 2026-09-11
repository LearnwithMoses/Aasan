import React from "react";
import {
  Home,
  BookOpen,
  FileEdit,
  FolderArchive,
  Grid,
} from "lucide-react";

export type AppNavTab = "home" | "lessons" | "notes" | "resources" | "more";

interface BottomNavBarProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  savedPlansCount?: number;
  notesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedPlansCount = 0,
  notesCount = 0,
}) => {
  const tabs = [
    {
      id: "home" as AppNavTab,
      label: "Home",
      icon: Home,
    },
    {
      id: "lessons" as AppNavTab,
      label: "Lessons",
      icon: BookOpen,
      count: savedPlansCount > 0 ? savedPlansCount : undefined,
    },
    {
      id: "notes" as AppNavTab,
      label: "Notes",
      icon: FileEdit,
      count: notesCount > 0 ? notesCount : undefined,
    },
    {
      id: "resources" as AppNavTab,
      label: "Resources",
      icon: FolderArchive,
    },
    {
      id: "more" as AppNavTab,
      label: "More",
      icon: Grid,
    },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(38,59,128,0.06)] px-2 py-1.5 no-print"
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
                      ? "text-[#263B80] scale-110 stroke-[2.5]"
                      : "text-slate-400 group-hover:text-slate-600 stroke-[1.8]"
                  }`}
                />
                {tab.count !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#F28B70] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                    {tab.count}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 tracking-tight leading-none transition-colors ${
                  isActive ? "text-[#263B80] font-bold" : "text-slate-500 font-medium"
                }`}
              >
                {tab.label}
              </span>

              {/* Reference image inspired active bottom bar indicator */}
              <div className="h-1 w-6 mt-1 flex justify-center">
                {isActive ? (
                  <div className="h-1 w-5 bg-[#263B80] rounded-full transition-all duration-300" />
                ) : (
                  <div className="h-1 w-5 bg-transparent rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
