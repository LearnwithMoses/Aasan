import React, { useState } from "react";
import {
  X,
  Bell,
  Sparkles,
  BookOpen,
  GraduationCap,
  Heart,
  ChevronRight,
  FolderHeart,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTextbooks: () => void;
  onOpenQuestionPapers: () => void;
  onOpenVault: () => void;
  onStartPlanning: () => void;
}

type NotificationCategory = "all" | "lessons" | "textbooks" | "system";

interface NotificationItem {
  id: string;
  category: "lessons" | "textbooks" | "system";
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
  actionType?: "textbooks" | "question_paper" | "vault" | "plan";
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onOpenTextbooks,
  onOpenQuestionPapers,
  onOpenVault,
  onStartPlanning,
}) => {
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");

  if (!isOpen) return null;

  const NOTIFICATIONS: NotificationItem[] = [
    {
      id: "1",
      category: "textbooks",
      title: "Tamil Nadu Samacheer Kalvi PDFs Added",
      message:
        "Official Class 10 Science, Tamil, and Math textbook chapter links are verified and ready for 1-click viewing directly from the TN Textbook Corporation.",
      timeAgo: "10 min ago",
      unread: true,
      actionType: "textbooks",
    },
    {
      id: "2",
      category: "lessons",
      title: "5E Inquiry Model Active in Aasaan Core",
      message:
        "Your lesson plans now automatically scaffold Engage, Explore, Explain, Elaborate, and Evaluate with exact time breakdowns.",
      timeAgo: "1 hour ago",
      unread: true,
      actionType: "plan",
    },
    {
      id: "3",
      category: "system",
      title: "Thank you for inspiring young minds!",
      message:
        "Over 10,000 teachers in Tamil Nadu and India are using Aasaan to build NEP 2020-compliant lesson plans and board blueprints.",
      timeAgo: "3 hours ago",
      unread: true,
    },
    {
      id: "4",
      category: "lessons",
      title: "New Board Question Paper Bank Available",
      message:
        "Class 10 and Class 12 blueprints (20/40/80 Marks) now include 10-year past exam questions categorized by difficulty and Bloom's level.",
      timeAgo: "1 day ago",
      unread: false,
      actionType: "question_paper",
    },
    {
      id: "5",
      category: "system",
      title: "Offline Vault Storage Active",
      message:
        "All your generated plans and worksheets are saved locally in your browser cache — view them even when the school WiFi is down.",
      timeAgo: "2 days ago",
      unread: false,
      actionType: "vault",
    },
    {
      id: "6",
      category: "system",
      title: "Teacher Wellness & Planning Tip",
      message:
        "Dividing your blackboard into 3 functional zones improves student notebook accuracy by 40% and keeps the period organized.",
      timeAgo: "3 days ago",
      unread: false,
    },
  ];

  const filtered = NOTIFICATIONS.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  const handleAction = (item: NotificationItem) => {
    onClose();
    if (item.actionType === "textbooks") onOpenTextbooks();
    else if (item.actionType === "question_paper") onOpenQuestionPapers();
    else if (item.actionType === "vault") onOpenVault();
    else if (item.actionType === "plan") onStartPlanning();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#faf7f7] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header matching Screenshot 6 */}
        <div className="bg-white px-5 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                Notifications
              </h3>
              <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                வகுப்பறை அறிவிப்புகள் &amp; செய்திகள்
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills matching Screenshot 6 (All, Requests, Donor, System) */}
        <div className="bg-white/90 px-4 py-2.5 border-b border-rose-50 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`text-xs font-black px-4 py-1.5 rounded-full transition flex-shrink-0 ${
              activeFilter === "all"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("lessons")}
            className={`text-xs font-black px-4 py-1.5 rounded-full transition flex-shrink-0 flex items-center gap-1 ${
              activeFilter === "lessons"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Lessons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("textbooks")}
            className={`text-xs font-black px-4 py-1.5 rounded-full transition flex-shrink-0 flex items-center gap-1 ${
              activeFilter === "textbooks"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Textbooks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("system")}
            className={`text-xs font-black px-4 py-1.5 rounded-full transition flex-shrink-0 ${
              activeFilter === "system"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            System
          </button>
        </div>

        {/* Notification Cards List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              role={item.actionType ? "button" : undefined}
              tabIndex={item.actionType ? 0 : undefined}
              onClick={() => item.actionType && handleAction(item)}
              className={`bg-white rounded-2xl p-4 border transition-all flex items-start gap-3 text-left relative ${
                item.unread
                  ? "border-rose-200 shadow-xs hover:border-rose-300"
                  : "border-slate-200/80 hover:border-slate-300 opacity-90"
              } ${item.actionType ? "cursor-pointer" : ""}`}
            >
              {/* Unread indicator dot */}
              {item.unread && (
                <span className="w-2 h-2 rounded-full bg-rose-600 absolute top-4 left-2 flex-shrink-0" />
              )}

              {/* Circular Category Icon in pastel box */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-1.5 ${
                  item.category === "lessons"
                    ? "bg-rose-50 text-rose-600"
                    : item.category === "textbooks"
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {item.category === "lessons" ? (
                  <Sparkles className="w-5 h-5" />
                ) : item.category === "textbooks" ? (
                  <BookOpen className="w-5 h-5" />
                ) : (
                  <Heart className="w-5 h-5" />
                )}
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap flex-shrink-0">
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 font-medium leading-relaxed">
                  {item.message}
                </p>
              </div>

              {item.actionType && (
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner matching Screenshot 6 */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3.5 border-t border-rose-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h5 className="text-xs font-black text-slate-900 leading-tight">
                Stay Connected. Transform Classrooms.
              </h5>
              <p className="text-[10px] text-rose-700 font-semibold">
                Every notification brings you closer to effortless pedagogy.
              </p>
            </div>
          </div>
          <span className="text-rose-600 text-[10px] font-bold italic hidden sm:inline">
            Together We Teach ❤️
          </span>
        </div>
      </div>
    </div>
  );
};
