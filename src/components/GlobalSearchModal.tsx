import React, { useState } from "react";
import {
  SavedLessonPlan,
  TeachingNote,
  ClassroomActivityItem,
  VocabularyWord,
  AssessmentItem,
} from "../types.ts";
import {
  Search,
  X,
  BookOpen,
  FileEdit,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: SavedLessonPlan[];
  notes: TeachingNote[];
  activities: ClassroomActivityItem[];
  vocabulary: VocabularyWord[];
  assessments: AssessmentItem[];
  onSelectLesson: (lesson: SavedLessonPlan) => void;
  onSelectNote: (note: TeachingNote) => void;
  onSelectActivity: (activity: ClassroomActivityItem) => void;
  onSelectWord: (word: VocabularyWord) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  lessons,
  notes,
  activities,
  vocabulary,
  assessments,
  onSelectLesson,
  onSelectNote,
  onSelectActivity,
  onSelectWord,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "lessons" | "notes" | "activities" | "vocab">("all");

  const q = query.trim().toLowerCase();

  const filteredLessons = lessons.filter(
    (l) =>
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.grade.toLowerCase().includes(q) ||
      l.subject.toLowerCase().includes(q) ||
      l.topic.toLowerCase().includes(q)
  );

  const filteredNotes = notes.filter(
    (n) =>
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.grade.toLowerCase().includes(q) ||
      n.subject.toLowerCase().includes(q) ||
      n.teacherNotes.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
  );

  const filteredActivities = activities.filter(
    (a) =>
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.subject.toLowerCase().includes(q) ||
      a.purpose.toLowerCase().includes(q)
  );

  const filteredVocab = vocabulary.filter(
    (v) =>
      !q ||
      v.word.toLowerCase().includes(q) ||
      v.meaning.toLowerCase().includes(q) ||
      v.subject.toLowerCase().includes(q)
  );

  const totalMatches =
    filteredLessons.length + filteredNotes.length + filteredActivities.length + filteredVocab.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons, notes, activities, vocabulary..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-[#263B80]/20 focus:outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
            {[
              { id: "all", label: `All (${totalMatches})` },
              { id: "lessons", label: `Lessons (${filteredLessons.length})` },
              { id: "notes", label: `Notes (${filteredNotes.length})` },
              { id: "activities", label: `Activities (${filteredActivities.length})` },
              { id: "vocab", label: `Vocabulary (${filteredVocab.length})` },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id as any)}
                className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                  activeFilter === chip.id
                    ? "bg-[#263B80] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {totalMatches === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No matching items found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;English&quot;, &quot;Grade 8&quot;, or &quot;Communication&quot;</p>
            </div>
          )}

          {/* Lessons list */}
          {(activeFilter === "all" || activeFilter === "lessons") && filteredLessons.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#263B80]" />
                Lesson Plans
              </div>
              <div className="space-y-2">
                {filteredLessons.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onClose();
                      onSelectLesson(l);
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#263B80] hover:shadow-xs transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#F28B70]">
                        {l.grade} • {l.subject}
                      </div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#263B80] transition">
                        {l.title}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#263B80] transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes list */}
          {(activeFilter === "all" || activeFilter === "notes") && filteredNotes.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileEdit className="w-3.5 h-3.5 text-orange-500" />
                Teaching Notes
              </div>
              <div className="space-y-2">
                {filteredNotes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onClose();
                      onSelectNote(n);
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-orange-400 hover:shadow-xs transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-500">
                        {n.grade} • {n.subject} • {n.date}
                      </div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition">
                        {n.title}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities list */}
          {(activeFilter === "all" || activeFilter === "activities") && filteredActivities.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Classroom Activities
              </div>
              <div className="space-y-2">
                {filteredActivities.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onClose();
                      onSelectActivity(a);
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-emerald-700">
                        {a.category} • {a.duration}
                      </div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {a.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.purpose}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vocabulary list */}
          {(activeFilter === "all" || activeFilter === "vocab") && filteredVocab.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                Vocabulary Words
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredVocab.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onClose();
                      onSelectWord(v);
                    }}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xs transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                        {v.word}
                      </span>
                      <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        {v.wordType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">{v.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
