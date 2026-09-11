import React from "react";
import { BlackboardLayout } from "../types.ts";
import { X, Printer, Layout, Sparkles } from "lucide-react";

interface BlackboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  blackboard: BlackboardLayout | null;
  isLoading: boolean;
}

export const BlackboardModal: React.FC<BlackboardModalProps> = ({
  isOpen,
  onClose,
  blackboard,
  isLoading,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#1b382b] text-white rounded-2xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border-4 border-[#5c3a21] relative my-6 max-h-[90vh] overflow-y-auto font-mono">
        <div className="no-print flex items-center justify-between border-b border-emerald-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold text-white font-sans">
              3-Panel Chalkboard / Smartboard Layout
            </h3>
            <span className="text-[10px] bg-emerald-900 text-emerald-200 font-bold px-2 py-0.5 rounded border border-emerald-700 font-sans">
              Inspection Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isLoading || !blackboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition font-sans"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              Print Board Plan
            </button>
            <button
              onClick={onClose}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-emerald-200 font-sans space-y-3">
            <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-amber-300 rounded-full animate-spin mx-auto" />
            <div className="text-sm font-bold text-white">Structuring Chalkboard Zones...</div>
            <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
              Allocating left info panel, center concept derivation/diagram, and right-hand practice & homework summary.
            </p>
          </div>
        ) : !blackboard ? (
          <div className="py-12 text-center text-emerald-300 font-sans">
            No chalkboard plan generated yet.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Blackboard Banner Title */}
            <div className="text-center border-b border-emerald-700 pb-2.5">
              <span className="text-amber-200 text-xs tracking-widest font-sans uppercase">
                [ Blackboard Center Title ]
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-300 tracking-wider">
                {blackboard.topicHeading}
              </h2>
            </div>

            {/* The 3-Column Chalkboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Left Column */}
              <div className="bg-[#142b21] p-3.5 rounded-lg border border-emerald-800 space-y-2">
                <div className="text-xs font-bold text-amber-200 uppercase tracking-wide border-b border-emerald-800 pb-1 font-sans">
                  Left: {blackboard.leftPanel.title}
                </div>
                <ul className="text-xs text-emerald-100 space-y-1.5 pl-2 leading-relaxed">
                  {blackboard.leftPanel.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Center Column */}
              <div className="bg-[#142b21] p-3.5 rounded-lg border border-emerald-800 space-y-2.5">
                <div className="text-xs font-bold text-yellow-300 uppercase tracking-wide border-b border-emerald-800 pb-1 font-sans">
                  Center: {blackboard.centerPanel.title}
                </div>
                <div className="p-2 bg-emerald-950/60 rounded border border-emerald-800/80 text-[11px] text-amber-100 italic text-center">
                  {blackboard.centerPanel.mainDiagramOrConcept}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-300 mb-1 font-sans">
                    Derivation &amp; Key Steps:
                  </div>
                  <ul className="text-xs text-white space-y-1 pl-1">
                    {blackboard.centerPanel.stepDerivation.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                {blackboard.centerPanel.coreRules.length > 0 && (
                  <div className="pt-1 border-t border-emerald-800">
                    <div className="text-[11px] font-bold text-yellow-200 font-sans mb-1">
                      Boxed Golden Rules:
                    </div>
                    {blackboard.centerPanel.coreRules.map((rule, ri) => (
                      <div key={ri} className="text-xs text-yellow-100 bg-yellow-950/40 p-1.5 rounded border border-yellow-800/50 mb-1">
                        ★ {rule}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="bg-[#142b21] p-3.5 rounded-lg border border-emerald-800 space-y-2.5">
                <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide border-b border-emerald-800 pb-1 font-sans">
                  Right: {blackboard.rightPanel.title}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-300 mb-1 font-sans">
                    Quick Class Board Tasks:
                  </div>
                  <ul className="text-xs text-emerald-100 space-y-1">
                    {blackboard.rightPanel.studentTasks.map((t, ti) => (
                      <li key={ti}>▶ {t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-300 mb-1 font-sans">
                    Lesson Takeaways:
                  </div>
                  <ul className="text-xs text-white space-y-1">
                    {blackboard.rightPanel.summaryPoints.map((sp, si) => (
                      <li key={si}>{sp}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-emerald-800">
                  <div className="text-[11px] font-bold text-amber-300 font-sans">
                    Homework / Practice:
                  </div>
                  <div className="text-xs text-amber-100 mt-0.5">
                    {blackboard.rightPanel.homeworkAssignment}
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Board Tips Footer */}
            {blackboard.teacherBoardTips?.length > 0 && (
              <div className="bg-[#12241c] p-3 rounded-lg border border-emerald-900 text-xs font-sans text-emerald-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Inspection Advice:</strong>{" "}
                  {blackboard.teacherBoardTips.join(" ")}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
