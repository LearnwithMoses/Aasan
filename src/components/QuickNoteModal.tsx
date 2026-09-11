import React, { useState, useEffect, useRef } from "react";
import { TeachingNote } from "../types.ts";
import {
  X,
  Check,
  Tag,
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Star,
  FileEdit,
} from "lucide-react";

interface QuickNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (note: Partial<TeachingNote> & { title: string }) => void;
  initialData?: Partial<TeachingNote>;
}

export const QuickNoteModal: React.FC<QuickNoteModalProps> = ({
  isOpen,
  onClose,
  onSaveNote,
  initialData,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialData?.title || "");
  const [grade, setGrade] = useState(initialData?.grade || "Grade 8");
  const [subject, setSubject] = useState(initialData?.subject || "English");
  const [topic, setTopic] = useState(initialData?.topic || "");
  const [keyPoints, setKeyPoints] = useState<string[]>(
    initialData?.keyPoints && initialData.keyPoints.length > 0
      ? initialData.keyPoints
      : [""]
  );
  const [teacherNotes, setTeacherNotes] = useState(initialData?.teacherNotes || "");
  const [nextClass, setNextClass] = useState(initialData?.nextClass || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    initialData?.tags && initialData.tags.length > 0
      ? initialData.tags
      : ["Classroom", "Pedagogy"]
  );
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const isInitialMount = useRef(true);

  // Auto-save debouncer
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!title.trim() && !teacherNotes.trim()) return;

    setSaveStatus("saving");
    const timer = setTimeout(() => {
      onSaveNote({
        id: initialData?.id,
        title: title.trim() || `${grade} ${subject} Note`,
        grade,
        subject,
        topic,
        keyPoints: keyPoints.filter((kp) => kp.trim().length > 0),
        teacherNotes,
        nextClass,
        tags,
        isFavorite,
      });
      setSaveStatus("saved");
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, grade, subject, topic, keyPoints, teacherNotes, nextClass, tags, isFavorite]);

  const handleAddKeyPoint = () => {
    setKeyPoints([...keyPoints, ""]);
  };

  const handleUpdateKeyPoint = (index: number, val: string) => {
    const updated = [...keyPoints];
    updated[index] = val;
    setKeyPoints(updated);
  };

  const handleRemoveKeyPoint = (index: number) => {
    const updated = keyPoints.filter((_, i) => i !== index);
    setKeyPoints(updated.length > 0 ? updated : [""]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote({
      id: initialData?.id,
      title: title.trim() || `${grade} ${subject} Note`,
      grade,
      subject,
      topic,
      keyPoints: keyPoints.filter((kp) => kp.trim().length > 0),
      teacherNotes,
      nextClass,
      tags,
      isFavorite,
    });
    setSaveStatus("saved");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F28B70] flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {initialData?.id ? "Edit Teaching Note" : "Quick Teaching Note"}
                </h3>
                {saveStatus === "saving" && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                    Saving...
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Saved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Organize key points, observations &amp; next class follow-up
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition ${
                isFavorite
                  ? "text-amber-500 bg-amber-50"
                  : "text-slate-400 hover:text-amber-500 hover:bg-slate-100"
              }`}
              title="Favorite Note"
            >
              <Star className={`w-5 h-5 ${isFavorite ? "fill-amber-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleManualSave} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Note Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Note Title / Classroom Session
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Communication Barriers & Role Play Observations"
              className="w-full text-sm font-semibold p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#263B80]/20"
              required
            />
          </div>

          {/* Grade & Subject Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade / Class</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="English">English</option>
                <option value="Psychology">Psychology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="General">General / Homeroom</option>
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Unit</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Communication Skills, Parts of Speech"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          {/* Section 19: Key Points */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Points Delivered
              </label>
              <button
                type="button"
                onClick={handleAddKeyPoint}
                className="text-[11px] font-bold text-[#263B80] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Point
              </button>
            </div>
            <div className="space-y-2">
              {keyPoints.map((kp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={kp}
                    onChange={(e) => handleUpdateKeyPoint(idx, e.target.value)}
                    placeholder="Enter main takeaway or concept..."
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                  />
                  {keyPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyPoint(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Observations & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Classroom Notes &amp; Observations
            </label>
            <textarea
              rows={3}
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="What happened during class? Student engagement, questions asked, common misconceptions..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#263B80]/20"
            />
          </div>

          {/* Next Class Follow-Up */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F28B70]" />
              Next Class Follow-Up
            </label>
            <textarea
              rows={2}
              value={nextClass}
              onChange={(e) => setNextClass(e.target.value)}
              placeholder="What to follow up on next period? Homework checking, specific students to review with..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-amber-50/40"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#263B80] text-white text-xs font-bold hover:bg-[#1e2e65] shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Done &amp; Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
