import React from "react";
import { X, FolderOpen, BookOpen } from "lucide-react";
import { TextbooksFolderExplorer } from "./TextbooksFolderExplorer.tsx";

interface TextbooksFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBoardId?: string;
  initialClassLevel?: number;
  onSelectMaterialForLesson?: (
    curriculum: string,
    grade: string,
    subject: string,
    topic: string,
    resources?: string
  ) => void;
  onOpenQuestionPaper?: () => void;
}

export const TextbooksFolderModal: React.FC<TextbooksFolderModalProps> = ({
  isOpen,
  onClose,
  initialBoardId = "tn-state-board",
  initialClassLevel = 10,
  onSelectMaterialForLesson,
  onOpenQuestionPaper,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#0f172a] text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  பாடநூல் பெட்டகம் • Master Textbooks &amp; Materials Folder
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  Classes 1 - 12
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tamil Nadu State Board, CBSE/NCERT, ICSE &amp; State Boards • Textbooks, Solutions, Worksheets &amp; Model Question Papers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable Explorer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <TextbooksFolderExplorer
            initialBoardId={initialBoardId}
            initialClassLevel={initialClassLevel}
            onSelectMaterialForLesson={(curriculum, grade, subject, topic, resources) => {
              if (onSelectMaterialForLesson) {
                onSelectMaterialForLesson(curriculum, grade, subject, topic, resources);
              }
              onClose();
            }}
            onOpenQuestionPaper={() => {
              if (onOpenQuestionPaper) onOpenQuestionPaper();
              onClose();
            }}
            embedded={false}
          />
        </div>
      </div>
    </div>
  );
};
