import React from "react";
import {
  Sparkles,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Layout,
  FolderHeart,
  Heart,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileText,
  Lightbulb,
  Smartphone,
  Download,
} from "lucide-react";

interface AasaanDashboardHeroProps {
  onStartLessonPlanning: () => void;
  onOpenTextbooks: () => void;
  onOpenQuestionPapers: () => void;
  onOpenWorksheets: () => void;
  onOpenVault: () => void;
  onOpenTeacherGuide: () => void;
  onOpenAndroidPublish?: () => void;
}

export const AasaanDashboardHero: React.FC<AasaanDashboardHeroProps> = ({
  onStartLessonPlanning,
  onOpenTextbooks,
  onOpenQuestionPapers,
  onOpenWorksheets,
  onOpenVault,
  onOpenTeacherGuide,
  onOpenAndroidPublish,
}) => {
  return (
    <div className="w-full space-y-5 select-none no-print">
      {/* Motivational Banner / Quote with script accent */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white p-5 sm:p-7 shadow-lg shadow-rose-200">
        {/* Soft decorative background circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-32 h-32 rounded-full bg-rose-400/20 blur-lg pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>ஆசான் ஆசிரியர் தளம் • Sovereign Pedagogy</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight mb-2">
            Teach with Joy, Plan with Precision.
          </h2>

          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-medium mb-4">
            India's most loved pedagogical assistant for school teachers. Create structured 5E lesson plans,
            browse official Tamil Nadu Samacheer &amp; NCERT textbooks, and craft board exam question papers in seconds.
          </p>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onStartLessonPlanning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-rose-700 text-xs font-black shadow-md hover:bg-rose-50 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Start Planning Now</span>
              <ChevronRight className="w-3.5 h-3.5 text-rose-600" />
            </button>

            <button
              type="button"
              onClick={onOpenTextbooks}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition border border-white/30"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-200" />
              <span>Browse Govt PDFs</span>
            </button>

            {onOpenAndroidPublish && (
              <button
                type="button"
                onClick={onOpenAndroidPublish}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-200 text-xs font-bold transition border border-emerald-400/40 shadow-xs"
                title="Download Android APK (.apk) file or install app"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
                <span>Get APK / App (செயலி)</span>
              </button>
            )}
          </div>
        </div>

        {/* Handcrafted calligraphy slogan badge */}
        <div className="hidden md:block absolute right-6 top-6 text-right opacity-90 pointer-events-none">
          <span className="text-amber-200 text-xs italic block font-semibold">
            "A lesson today,
          </span>
          <span className="text-white text-xs italic block font-semibold">
            A brighter tomorrow"
          </span>
          <Heart className="w-4 h-4 text-rose-200 inline-block mt-1 fill-rose-200" />
        </div>
      </div>

      {/* Primary Choice Cards — "Are you a Donor or Receiver?" Style */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-[0_8px_30px_rgba(225,29,72,0.06)]">
        <div className="text-center mb-5">
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            What would you like to create today?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            இன்று நீங்கள் தயாரிக்க விரும்பும் வகுப்பறைப் பணி
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Card 1: Lesson Plan Generator */}
          <div
            role="button"
            tabIndex={0}
            onClick={onStartLessonPlanning}
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-rose-50/30 to-white border border-rose-200/80 hover:border-rose-400 shadow-xs hover:shadow-md transition-all duration-300 text-left cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                  Lesson Plan Studio
                </h4>
                <p className="text-[11.5px] font-bold text-rose-600/90 mt-0.5">
                  பாடத் திட்டம் தயாரிப்பு
                </p>
                <p className="text-[11px] text-slate-500 leading-snug mt-1 font-medium max-w-xs">
                  5E Model, Bloom's Taxonomy, NEP 2020 &amp; Class Activities.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:bg-rose-700 transition flex-shrink-0 ml-2">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Textbook Chapters & PDFs */}
          <div
            role="button"
            tabIndex={0}
            onClick={onOpenTextbooks}
            className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-indigo-50/30 to-white border border-indigo-200/80 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all duration-300 text-left cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Textbooks &amp; Govt PDFs
                </h4>
                <p className="text-[11.5px] font-bold text-indigo-600/90 mt-0.5">
                  பாடப் புத்தகங்கள் &amp; PDFs
                </p>
                <p className="text-[11px] text-slate-500 leading-snug mt-1 font-medium max-w-xs">
                  Full Samacheer Kalvi &amp; NCERT syllabus with 1-click book PDFs.
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition flex-shrink-0 ml-2">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Heartbeat / Teacher line */}
        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent w-1/4" />
          <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Together for Better Learning • ஒரு நல்ல ஆசிரியர், ஆயிரம் தலைமுறைகள்</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent w-1/4" />
        </div>
      </div>

      {/* 3 Square Feature Action Cards (Screenshot 2: Update Profile, Eligibility, Donation History) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Item 1: Question Paper Generator */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenQuestionPapers}
          className="group bg-white rounded-2xl p-4 border border-rose-100/90 shadow-xs hover:shadow-md hover:border-purple-300 transition cursor-pointer text-left flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-700 transition">
              Board Question Papers
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Past 10-year board questions, 20/40/80-mark blueprints &amp; answer keys.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              Blueprint + PYQ
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:bg-rose-700 transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Item 2: Classroom Blackboard & Worksheets */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenWorksheets}
          className="group bg-white rounded-2xl p-4 border border-rose-100/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer text-left flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <Layout className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition">
              Blackboard &amp; Worksheets
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              3-zone chalkboard layout &amp; printable 2-page student practice sheets.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Ready to Print
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:bg-rose-700 transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Item 3: Saved Teacher Vault */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenVault}
          className="group bg-white rounded-2xl p-4 border border-rose-100/90 shadow-xs hover:shadow-md hover:border-rose-300 transition cursor-pointer text-left flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition">
              <FolderHeart className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-black text-slate-900 group-hover:text-rose-700 transition">
              My Teacher Vault
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Offline-ready archive of your saved lesson plans, rubrics &amp; Word exports.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              Offline Secure
            </span>
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center group-hover:bg-rose-700 transition">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Community Testimonial Card (Arvind style from Screenshot 2) */}
      <div className="bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 rounded-3xl p-5 border border-rose-200/70 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-rose-200 flex-shrink-0">
          ஆ
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full mb-1">
            <span>Teacher Voice • ஆசிரியர் பகிர்வு</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 italic leading-relaxed">
            "Aasaan saved me 6 hours every week on Samacheer syllabus mapping. The 5E inquiry activities and 3-column blackboard plans make classroom delivery effortless!"
          </p>
          <p className="text-[11px] text-slate-500 font-bold mt-1">
            — Selvi Meenakshi S., B.T. Assistant (Science), Madurai, Tamil Nadu
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenTeacherGuide}
          className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50 transition shadow-2xs"
        >
          View Guide →
        </button>
      </div>

      {/* "Why Aasaan?" 4-Card Value Grid (Like "Why Donate Blood?" in Screenshot 2) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-1">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Why Teachers Choose Aasaan?
            </h3>
            <p className="text-xs text-slate-500">
              A small act of preparation. A life-changing impact on children.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTeacherGuide}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold underline"
          >
            Explore 01-07 Pedagogy Guide →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2 font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-black text-slate-800">Saves 8+ Hours</h5>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              Rigorous 40-min plans in 15 seconds.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-black text-slate-800">Samacheer &amp; NEP</h5>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              Aligned with Tamil Nadu &amp; CBSE syllabi.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-black text-slate-800">100% Bilingual</h5>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              Teach in English, Tamil, or Bilingual.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-black text-slate-800">Full Pedagogy</h5>
            <p className="text-[10.5px] text-slate-500 mt-0.5 leading-tight">
              5E Cycle, Blackboard, CCE Rubrics.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Red Banner (Screenshot 2: "You Can Donate. Be the Reason for Someone's Tomorrow") */}
      <div
        role="button"
        tabIndex={0}
        onClick={onStartLessonPlanning}
        className="w-full rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white p-4 sm:p-4.5 shadow-md shadow-rose-200 flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight leading-none">
              Empower Your Classroom Today.
            </h4>
            <p className="text-xs text-rose-100 font-medium mt-1">
              Be the inspiration your students remember forever.
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white text-rose-700 flex items-center justify-center shadow-sm flex-shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
