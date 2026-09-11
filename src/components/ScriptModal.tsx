import React, { useState } from "react";
import { TeacherExplanationScript } from "../types.ts";
import {
  X,
  Printer,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  BookOpen,
  UserCheck,
} from "lucide-react";

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: TeacherExplanationScript | null;
  isLoading: boolean;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({
  isOpen,
  onClose,
  script,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyFull = () => {
    if (!script) return;
    const text = `
=== CLASSROOM EXPLANATION SCRIPT ===
Topic: ${script.topic} (${script.grade} - ${script.subject})
Language: ${script.language}

[1. REAL-LIFE HOOK ANALOGY]
${script.hookAnalogy.title}
Story / Metaphor:
${script.hookAnalogy.storyOrMetaphor}

Why It Works:
${script.hookAnalogy.whyItWorks}

[2. WHAT TO SAY IN CLASS (WORD-FOR-WORD SCRIPT)]
${script.classroomSpeakingScript
  .map(
    (s, i) => `
${s.phase}
TEACHER SAYS: "${s.teacherSays}"
ACTION / GESTURE: ${s.actionOrGesture}
STUDENT REACTION: ${s.expectedStudentReaction}
`
  )
  .join("\n")}

[3. IF A STUDENT SAYS: "TEACHER, I STILL DON'T GET IT!"]
Simple Explanation: ${script.eli5SimplifiedBackup.simpleExplanation}
Concrete Example: ${script.eli5SimplifiedBackup.concreteExample}

[4. 30-SECOND CHECK QUESTIONS]
${script.checkingQuestions
  .map(
    (q, i) => `Q${i + 1}: ${q.question}\nLook for: ${q.whatToLookFor}\n`
  )
  .join("\n")}

[5. TEACHER DO'S & DON'TS]
DO:
${script.quickDosAndDonts.dos.map((d) => "• " + d).join("\n")}
DON'T:
${script.quickDosAndDonts.donts.map((d) => "• " + d).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="no-print bg-[#101827] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d9ad57]/20 border border-[#d9ad57]/40 flex items-center justify-center text-[#d9ad57]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  Classroom Explanation Script
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d9ad57] text-[#101827]">
                  PRO FACILITY
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Word-for-word teacher speaking lines, intuitive analogies &amp; easy concept breakdown for Indian classrooms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {script && !isLoading && (
              <>
                <button
                  type="button"
                  onClick={handleCopyFull}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  title="Copy full script to clipboard"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied!" : "Copy Script"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Guide</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto bg-[#fafbfe]">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 animate-pulse">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Composing Your Classroom Explanation Script...
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Designing everyday Indian analogies, word-for-word spoken dialogue, gesture cues, and simplified backup explanations...
              </p>
            </div>
          ) : script ? (
            <div className="space-y-6 text-slate-800">
              {/* Top Meta Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Concept to Explain
                  </span>
                  <h4 className="text-base font-bold text-[#101827]">
                    {script.topic}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                    <span className="font-medium">{script.grade}</span>
                    <span>•</span>
                    <span className="font-medium">{script.subject}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Language: {script.language}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 hidden sm:block">
                  <span className="block font-medium text-slate-700">Classroom Delivery Coach</span>
                  <span>Speak with warmth &amp; confidence</span>
                </div>
              </div>

              {/* SECTION 1: Everyday Life Hook Analogy */}
              <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h5 className="text-sm font-bold uppercase tracking-wider">
                    1. The Everyday Life Connection (The Hook Story)
                  </h5>
                </div>
                <h6 className="text-base font-bold text-slate-900 mb-2">
                  {script.hookAnalogy.title}
                </h6>
                <div className="bg-white/90 border border-amber-200 rounded-xl p-3.5 text-sm text-slate-800 leading-relaxed font-serif italic mb-3">
                  "{script.hookAnalogy.storyOrMetaphor}"
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-100/50 p-2.5 rounded-lg border border-amber-200/60">
                  <UserCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Why this works with Indian students: </strong>
                    {script.hookAnalogy.whyItWorks}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Verbatim Classroom Speaking Script */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      2. What to Say in Class (Word-for-Word Speaking Script)
                    </h5>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Follow step-by-step
                  </span>
                </div>

                <div className="space-y-4">
                  {script.classroomSpeakingScript.map((step, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
                          {step.phase}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Step {idx + 1} of {script.classroomSpeakingScript.length}
                        </span>
                      </div>

                      {/* What Teacher Says */}
                      <div className="my-2.5 bg-white border-l-4 border-indigo-500 rounded-r-xl p-3 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                          🎙️ Say this to the students:
                        </span>
                        <p className="text-sm text-slate-900 font-medium leading-relaxed">
                          {step.teacherSays}
                        </p>
                      </div>

                      {/* Gestures & Student Reaction */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs">
                        <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-2.5 text-amber-950">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800 mb-0.5">
                            ✋ Physical Action / Board Gesture:
                          </span>
                          <span>{step.actionOrGesture}</span>
                        </div>
                        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-lg p-2.5 text-emerald-950">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-emerald-800 mb-0.5">
                            👀 Expected Student Reaction:
                          </span>
                          <span>{step.expectedStudentReaction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: When a child says "Teacher, I still don't get it" (ELI5) */}
              <div className="bg-gradient-to-r from-purple-50 via-white to-pink-50 border-2 border-purple-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-purple-950 mb-2">
                  <BookOpen className="w-5 h-5 text-purple-700" />
                  <h5 className="text-sm font-bold uppercase tracking-wider">
                    3. If a Student Says: "Teacher, I Still Don't Understand!"
                  </h5>
                </div>
                <p className="text-xs text-purple-800 mb-3">
                  Don't repeat the textbook definition louder. Use this instant ultra-simplified breakdown instead:
                </p>

                <div className="space-y-2.5">
                  <div className="bg-white border border-purple-200 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      💡 Ultra-Simple 20-Second Explanation:
                    </span>
                    <p className="text-sm text-slate-900 font-medium">
                      {script.eli5SimplifiedBackup.simpleExplanation}
                    </p>
                  </div>
                  <div className="bg-white border border-purple-200 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      🍎 Concrete Physical Example:
                    </span>
                    <p className="text-xs text-slate-800">
                      {script.eli5SimplifiedBackup.concreteExample}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: 30-Second Concept Checking Questions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 mb-3">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <h5 className="text-sm font-bold uppercase tracking-wider">
                    4. Fast Diagnostic Checking Questions (Ask Before Bell Rings)
                  </h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {script.checkingQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-3.5 bg-blue-50/30 flex flex-col justify-between"
                    >
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mb-2">
                          Ask Question #{idx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-900 leading-snug mb-2">
                          "{q.question}"
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-blue-100/80 text-[11px] text-blue-900 bg-white p-2 rounded-lg border border-blue-100">
                        <strong className="block text-[10px] text-blue-700 uppercase">
                          Target Answer to Look For:
                        </strong>
                        <span>{q.whatToLookFor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Practical Teacher Do's & Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Classroom Best Practices (DO's)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    {script.quickDosAndDonts.dos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Common Traps to Avoid (DON'Ts)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-950">
                    {script.quickDosAndDonts.donts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="no-print bg-white p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Tip: Keep this printed guide beside your lesson plan book during class for effortless delivery.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
