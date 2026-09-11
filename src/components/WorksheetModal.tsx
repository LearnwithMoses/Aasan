import React from "react";
import { StudentWorksheet } from "../types.ts";
import { Printer, X, FileText, Check } from "lucide-react";

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  worksheet: StudentWorksheet | null;
  isLoading: boolean;
}

export const WorksheetModal: React.FC<WorksheetModalProps> = ({
  isOpen,
  onClose,
  worksheet,
  isLoading,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-6 max-h-[90vh] overflow-y-auto">
        <div className="no-print flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Student Worksheet &amp; Exit Ticket</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
              Print-Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isLoading || !worksheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#101827] text-white hover:bg-slate-800 transition"
            >
              <Printer className="w-3.5 h-3.5 text-[#d9ad57]" />
              Print Worksheet
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <div className="w-10 h-10 border-2 border-[#101827]/20 border-t-[#101827] rounded-full animate-spin mx-auto" />
            <div className="text-sm font-bold text-slate-700">Generating 1-Page Student Worksheet...</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Drafting graded practice questions, concept checks, and exit ticket matching your lesson objectives.
            </p>
          </div>
        ) : !worksheet ? (
          <div className="py-12 text-center text-slate-500">
            No worksheet available. Please try generating again.
          </div>
        ) : (
          <div className="printable-worksheet text-slate-900 font-serif">
            {/* Header for student work */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
              <h2 className="text-lg font-bold uppercase tracking-wide text-slate-900">
                {worksheet.schoolName}
              </h2>
              <div className="text-sm font-semibold text-slate-700 mt-0.5">
                {worksheet.title}
              </div>
              <div className="text-xs text-slate-500 font-sans mt-1">
                Class: {worksheet.grade} | Subject: {worksheet.subject} | Time: {worksheet.timeAllowed} | Max Marks: {worksheet.totalMarks}
              </div>
            </div>

            {/* Student metadata fields */}
            <div className="grid grid-cols-3 gap-2 text-xs font-sans border border-slate-300 p-2.5 rounded-lg mb-4 bg-slate-50/50">
              <div>
                <strong>Student Name:</strong> ______________________
              </div>
              <div>
                <strong>Roll / ID No:</strong> ____________
              </div>
              <div>
                <strong>Date:</strong> ________________
              </div>
            </div>

            {/* Instructions */}
            {worksheet.instructions?.length > 0 && (
              <div className="text-[11px] font-sans text-slate-600 mb-4 bg-slate-100/60 p-2 rounded">
                <strong>General Instructions:</strong>
                <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                  {worksheet.instructions.map((ins, i) => (
                    <li key={i}>{ins}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Questions list */}
            <div className="space-y-4 mb-6">
              {worksheet.questions?.map((q, idx) => (
                <div key={q.id || idx} className="text-xs font-sans pb-3 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-slate-900">
                      <strong>Q{idx + 1}.</strong> {q.question}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">
                      [{q.marks} Mark{q.marks > 1 ? "s" : ""}]
                    </span>
                  </div>

                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 pl-4">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-400 inline-block" />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty answer lines for print */}
                  {q.type !== "multiple_choice" && (
                    <div className="mt-3 space-y-2 pl-2">
                      <div className="border-b border-dashed border-slate-300 h-4" />
                      <div className="border-b border-dashed border-slate-300 h-4" />
                      {q.marks >= 4 && (
                        <div className="border-b border-dashed border-slate-300 h-4" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Exit Ticket / Slip */}
            <div className="border-2 border-dashed border-slate-400 rounded-xl p-3.5 bg-amber-50/40 text-xs font-sans">
              <div className="flex items-center justify-between font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                <span>✂ 5-Minute Student Exit Ticket (Tear-Off or Complete Before Bell)</span>
                <span className="text-amber-800">Mandatory Check</span>
              </div>
              <p className="text-slate-800 mb-2">{worksheet.exitSlipQuestion}</p>
              <div className="space-y-2">
                <div className="border-b border-slate-300 h-4" />
                <div className="border-b border-slate-300 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
