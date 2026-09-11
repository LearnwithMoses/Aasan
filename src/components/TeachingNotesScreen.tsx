import React, { useState } from "react";
import { TeachingNote } from "../types.ts";
import {
  Search,
  Plus,
  FileEdit,
  Star,
  Sparkles,
  Calendar,
  Tag,
  Trash2,
  Share2,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

interface TeachingNotesScreenProps {
  notes: TeachingNote[];
  onOpenNewNote: () => void;
  onEditNote: (note: TeachingNote) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const TeachingNotesScreen: React.FC<TeachingNotesScreenProps> = ({
  notes,
  onOpenNewNote,
  onEditNote,
  onDeleteNote,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filterOptions = [
    "All",
    "Favorites",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "English",
    "Psychology",
  ];

  const filtered = notes.filter((note) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.grade.toLowerCase().includes(q) ||
      note.subject.toLowerCase().includes(q) ||
      note.teacherNotes.toLowerCase().includes(q) ||
      note.tags.some((t) => t.toLowerCase().includes(q));

    if (!matchesQuery) return false;

    if (selectedFilter === "All") return true;
    if (selectedFilter === "Favorites") return note.isFavorite;
    if (selectedFilter === "Grade 8") return note.grade.includes("8");
    if (selectedFilter === "Grade 9") return note.grade.includes("9");
    if (selectedFilter === "Grade 10") return note.grade.includes("10");
    if (selectedFilter === "English") return note.subject.toLowerCase().includes("english");
    if (selectedFilter === "Psychology") return note.subject.toLowerCase().includes("psychology");

    return true;
  });

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Teaching Notes</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F28B70]">
              {notes.length} Notes
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Jot down key points, classroom observations &amp; next-class action items
          </p>
        </div>

        <button
          onClick={onOpenNewNote}
          className="px-4 py-2 rounded-2xl bg-[#F28B70] hover:bg-[#e07559] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#F28B70]/20 transition w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Note</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, tags, classroom observations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#F28B70]/20 focus:outline-hidden"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                selectedFilter === filter
                  ? "bg-[#263B80] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Notes List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <FileEdit className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No teaching notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No notes match "${searchQuery}". Try broadening your search.`
              : "Capture your first quick teaching note with key takeaways and follow-ups."}
          </p>
          <button
            onClick={onOpenNewNote}
            className="px-4 py-2 rounded-2xl bg-[#F28B70] text-white text-xs font-bold shadow-xs hover:bg-[#e07559]"
          >
            + Write First Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((note) => (
            <div
              key={note.id}
              onClick={() => onEditNote(note)}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#263B80] text-[10px] font-black uppercase tracking-wide">
                      {note.grade} • {note.subject}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {note.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(note.id);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500 transition"
                      title="Favorite"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          note.isFavorite ? "fill-amber-400 text-amber-500" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete note "${note.title}"?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black text-slate-900 mt-2.5 group-hover:text-[#263B80] transition leading-snug">
                  {note.title}
                </h3>

                {/* Key Points snippet */}
                {note.keyPoints && note.keyPoints.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {note.keyPoints.slice(0, 2).map((kp, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-[#F28B70] font-black">•</span>
                        <span className="line-clamp-1">{kp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Teacher observation snippet */}
                {note.teacherNotes && (
                  <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {note.teacherNotes}
                  </p>
                )}

                {/* Next Class Follow-Up */}
                {note.nextClass && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold text-[11px] uppercase tracking-wide text-amber-800">Next Class:</strong>{" "}
                      <span className="line-clamp-1">{note.nextClass}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags & Action footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[#F28B70] font-bold text-xs group-hover:translate-x-0.5 transition">
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
