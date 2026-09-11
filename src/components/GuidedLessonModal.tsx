import React, { useState } from "react";
import {
  LessonPlan,
  LessonPlanRequest,
  SavedLessonPlan,
} from "../types.ts";
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Users,
  Clock,
  Target,
  FileText,
  Lightbulb,
  CheckCircle2,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
} from "lucide-react";

interface GuidedLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (savedPlan: SavedLessonPlan) => void;
  onTriggerAIGenerate?: (form: LessonPlanRequest) => void;
}

const TEACHING_METHODS = [
  { id: "Discussion", label: "Guided Discussion", icon: "💬", desc: "Interactive student-led inquiry" },
  { id: "Role Play", label: "Role Play / Simulation", icon: "🎭", desc: "Embodied experiential learning" },
  { id: "Group Activity", label: "Collaborative Group", icon: "👥", desc: "Peer problem-solving & tasks" },
  { id: "Demonstration", label: "Visual Demonstration", icon: "🔬", desc: "Teacher modeling and experiment" },
  { id: "Lecture", label: "Direct Instruction", icon: "🗣️", desc: "Structured conceptual breakdown" },
  { id: "Debate", label: "Classroom Debate", icon: "⚖️", desc: "Analytical counter-argumentation" },
  { id: "Q&A", label: "Socratic Q&A Drill", icon: "❓", desc: "Rapid formative checking" },
  { id: "Problem Solving", label: "Guided Problem Solving", icon: "🧩", desc: "Worked examples & scaffolding" },
];

export const GuidedLessonModal: React.FC<GuidedLessonModalProps> = ({
  isOpen,
  onClose,
  onSavePlan,
  onTriggerAIGenerate,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);

  // Step 1: Basic Info
  const [grade, setGrade] = useState("Grade 8");
  const [subject, setSubject] = useState("English");
  const [topic, setTopic] = useState("");
  const [curriculum, setCurriculum] = useState("CBSE / NCERT");
  const [duration, setDuration] = useState("45");
  const [classStrength, setClassStrength] = useState("38");

  // Step 2: Learning Objectives
  const [objectives, setObjectives] = useState<string[]>([
    "Understand the core elements and stages of the communication loop.",
    "Identify common causes of semantic and psychological message noise.",
  ]);

  // Step 3: Teaching Content
  const [keyPoints, setKeyPoints] = useState<string[]>([
    "Communication cycle: Sender, Encoding, Message, Medium, Receiver, Decoding, Feedback.",
  ]);
  const [explanation, setExplanation] = useState(
    "Guide students through the sender-receiver diagram with real-world conversational examples."
  );

  // Step 4: Teaching Method
  const [selectedMethods, setSelectedMethods] = useState<string[]>(["Role Play", "Guided Discussion"]);

  // Step 5: Activities
  const [activityName, setActivityName] = useState("Paired Telephone Role Play");
  const [activityGrouping, setActivityGrouping] = useState("Pairs");
  const [activityDuration, setActivityDuration] = useState("15 min");
  const [activityInstructions, setActivityInstructions] = useState(
    "Pairs whisper a structured prompt; compare original vs interpreted message to analyze feedback necessity."
  );

  // Step 6: Assessment
  const [assessmentType, setAssessmentType] = useState("Exit Ticket");
  const [assessmentPrompt, setAssessmentPrompt] = useState(
    "List 2 communication barriers you observed during the role play and how feedback solved them."
  );

  // Step 7: Homework & Follow-up
  const [homework, setHomework] = useState(
    "Write a 100-word paragraph detailing how non-verbal cues (eye contact, posture) affect message reception."
  );

  // Step 8: Teacher Reflection Prompts
  const [materials, setMaterials] = useState(
    "Chalkboard diagram, prompt index cards, student notebooks"
  );
  const [differentiationSupport, setDifferentiationSupport] = useState(
    "Provide sentence starters and keyword word-bank cards for English language learners."
  );

  const toggleMethod = (methodId: string) => {
    if (selectedMethods.includes(methodId)) {
      setSelectedMethods(selectedMethods.filter((m) => m !== methodId));
    } else {
      setSelectedMethods([...selectedMethods, methodId]);
    }
  };

  const handleAddObjective = () => setObjectives([...objectives, ""]);
  const handleUpdateObjective = (i: number, val: string) => {
    const updated = [...objectives];
    updated[i] = val;
    setObjectives(updated);
  };
  const handleRemoveObjective = (i: number) => {
    setObjectives(objectives.filter((_, idx) => idx !== i));
  };

  const handleAddKeyPoint = () => setKeyPoints([...keyPoints, ""]);
  const handleUpdateKeyPoint = (i: number, val: string) => {
    const updated = [...keyPoints];
    updated[i] = val;
    setKeyPoints(updated);
  };
  const handleRemoveKeyPoint = (i: number) => {
    setKeyPoints(keyPoints.filter((_, idx) => idx !== i));
  };

  const constructLessonPlan = (status: "Ready" | "Draft"): SavedLessonPlan => {
    const id = `lp_${Date.now()}`;
    const cleanObjectives = objectives.filter((o) => o.trim().length > 0);
    const cleanKeyPoints = keyPoints.filter((k) => k.trim().length > 0);

    const planData: LessonPlan = {
      title: topic.trim() || `${grade} ${subject} Lesson`,
      learning_objectives: cleanObjectives.length > 0 ? cleanObjectives : ["Master core chapter competencies."],
      success_criteria: [
        "Students can define the core terminology in their own words.",
        "Students participate actively in the classroom task and assessment.",
      ],
      prior_knowledge: ["Foundational concepts from previous unit."],
      materials: materials.split(",").map((m) => m.trim()).filter(Boolean),
      key_explanation: cleanKeyPoints.length > 0 ? cleanKeyPoints : [explanation],
      lesson_flow: [
        {
          stage: "1. Hook & Introduction",
          minutes: 5,
          teacher_actions: ["Introduce learning objective", "Connect to prior real-world experience"],
          student_actions: ["Listen attentively", "Answer opening inquiry question"],
          assessment_check: "Diagnostic thumbs up/down check",
        },
        {
          stage: `2. Direct Concept Delivery (${selectedMethods.join(", ")})`,
          minutes: 15,
          teacher_actions: [explanation],
          student_actions: ["Note down key terms", "Ask clarifying questions"],
          assessment_check: "Targeted Socratic questioning",
        },
        {
          stage: `3. ${activityName} (${activityGrouping})`,
          minutes: 15,
          teacher_actions: ["Facilitate pairs", "Circulate and provide scaffolding"],
          student_actions: [activityInstructions],
          assessment_check: "Observation of student interaction",
        },
        {
          stage: `4. Closure & Assessment (${assessmentType})`,
          minutes: 10,
          teacher_actions: ["Administer exit check", "Summarize core takeaway"],
          student_actions: [assessmentPrompt, "Complete written check"],
          assessment_check: "Exit ticket review",
        },
      ],
      differentiation: {
        support: [differentiationSupport],
        core: ["Standard guided worksheet and pair interaction."],
        extension: ["Analyze multi-layered real-world case scenarios."],
      },
      assessment: {
        formative: [`Observation during ${activityName}`],
        exit_ticket: [assessmentPrompt],
        homework: [homework],
      },
      common_misconceptions: [
        "Confusing message sending with successful message comprehension without feedback.",
      ],
      teacher_notes: [
        `Methods selected: ${selectedMethods.join(", ")}`,
        `Grouping: ${activityGrouping}`,
      ],
      reflection: [
        "Evaluate student pace and engagement during group activity.",
      ],
    };

    const formRequest: LessonPlanRequest = {
      curriculum,
      grade,
      subject,
      topic: topic.trim() || `${grade} ${subject}`,
      duration: parseInt(duration) || 45,
      classStrength,
      lessonModel: selectedMethods.join(", ") || "5E",
      objectives: cleanObjectives.join("; "),
      priorKnowledge: "Standard prerequisites",
      language: "English",
      resources: materials,
      differentiation: differentiationSupport,
      specialRequirements: homework,
      aiEngine: "gemini",
    };

    return {
      id,
      savedAt: new Date().toISOString(),
      title: planData.title,
      grade,
      subject,
      topic: topic.trim() || `${grade} ${subject}`,
      curriculum,
      plan: planData,
      formData: formRequest,
      status,
      isFavorite: false,
    };
  };

  const handleFinish = (status: "Ready" | "Draft") => {
    const saved = constructLessonPlan(status);
    onSavePlan(saved);
    onClose();
  };

  const handleAIHelp = () => {
    if (!topic.trim()) {
      alert("Please enter a Topic in Step 1 first.");
      setStep(1);
      return;
    }
    const formReq: LessonPlanRequest = {
      curriculum,
      grade,
      subject,
      topic,
      duration: parseInt(duration) || 45,
      classStrength,
      lessonModel: selectedMethods[0] || "5E",
      objectives: objectives.join("; "),
      priorKnowledge: "",
      language: "English",
      resources: materials,
      differentiation: differentiationSupport,
      specialRequirements: homework,
      aiEngine: "gemini",
    };
    onClose();
    if (onTriggerAIGenerate) onTriggerAIGenerate(formReq);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Stepper Header inspired by Blood Bridge 01/07 design */}
        <div className="bg-[#263B80] text-white p-5 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F28B70] text-white text-[11px] font-extrabold tracking-wider">
                STEP 0{step} / 08
              </span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-xs text-rose-100 font-medium">
                {step === 1 && "Basic Info"}
                {step === 2 && "Learning Objectives"}
                {step === 3 && "Teaching Content"}
                {step === 4 && "Teaching Methods"}
                {step === 5 && "Classroom Activities"}
                {step === 6 && "Assessment & Checks"}
                {step === 7 && "Homework & Follow-up"}
                {step === 8 && "Materials & Final Review"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAIHelp}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs transition"
                title="Instant AI Generation"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Auto-Complete</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mt-2">
            {step === 1 && "Lesson Details & Context"}
            {step === 2 && "What will students know or be able to do?"}
            {step === 3 && "Core Content & Key Explanations"}
            {step === 4 && "Choose Pedagogical Methods"}
            {step === 5 && "Classroom Activities & Student Tasks"}
            {step === 6 && "Checks for Understanding"}
            {step === 7 && "Homework & Real-World Application"}
            {step === 8 && "Materials, Differentiation & Final Save"}
          </h2>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#F28B70] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-700">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Topic / Chapter Title *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Communication Skills, Linear Equations, Photosynthesis"
                  className="w-full text-sm font-semibold p-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#263B80]/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grade</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Curriculum</label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="CBSE / NCERT">CBSE / NCERT</option>
                    <option value="Tamil Nadu Samacheer">TN Samacheer</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="Cambridge / IB">Cambridge / IB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Strength (Students)</label>
                  <input
                    type="text"
                    value={classStrength}
                    onChange={(e) => setClassStrength(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  State clear, measurable objectives using action verbs (Understand, Analyze, Solve, Demonstrate).
                </p>
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="text-xs font-bold text-[#263B80] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Objective
                </button>
              </div>

              <div className="space-y-2">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#263B80] text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleUpdateObjective(i, e.target.value)}
                      placeholder="e.g. Students will be able to..."
                      className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200"
                    />
                    {objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(i)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Key Points &amp; Definitions
                  </label>
                  <button
                    type="button"
                    onClick={handleAddKeyPoint}
                    className="text-xs font-bold text-[#263B80] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Point
                  </button>
                </div>
                <div className="space-y-2">
                  {keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                        •
                      </span>
                      <input
                        type="text"
                        value={kp}
                        onChange={(e) => handleUpdateKeyPoint(i, e.target.value)}
                        placeholder="Key rule, formula, or concept definition..."
                        className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                      />
                      {keyPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyPoint(i)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teacher Explanation &amp; Analogies
                </label>
                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="How will you introduce the concept? Which real-world metaphor will hook the students?"
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Select one or more teaching methodologies to shape today&apos;s pedagogical structure:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {TEACHING_METHODS.map((method) => {
                  const isSelected = selectedMethods.includes(method.id);
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => toggleMethod(method.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-blue-50/70 border-[#263B80] ring-2 ring-[#263B80]/15"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-900">{method.label}</div>
                          {isSelected && <Check className="w-4 h-4 text-[#263B80]" />}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{method.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Activity Name</label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="e.g. Fishbowl Debate, Paired Role Play, Think-Pair-Share"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grouping</label>
                  <select
                    value={activityGrouping}
                    onChange={(e) => setActivityGrouping(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Pairs">Pairs (Think-Pair-Share)</option>
                    <option value="Small Groups">Small Groups (3-4 students)</option>
                    <option value="Whole Class">Whole Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Activity Duration</label>
                  <input
                    type="text"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                    placeholder="e.g. 15 min"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Activity Instructions &amp; Student Task
                </label>
                <textarea
                  rows={3}
                  value={activityInstructions}
                  onChange={(e) => setActivityInstructions(e.target.value)}
                  placeholder="Step-by-step what students will do..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200"
                />
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Strategy</label>
                <select
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  <option value="Exit Ticket">Exit Ticket (5 min check)</option>
                  <option value="Short Answer Question">Short Answer Question</option>
                  <option value="MCQ Speed Quiz">MCQ Speed Quiz (3 questions)</option>
                  <option value="Peer Review / Rubric">Peer Review Rubric</option>
                  <option value="Teacher Observation">Teacher Observation Checklist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assessment Question / Prompt
                </label>
                <textarea
                  rows={3}
                  value={assessmentPrompt}
                  onChange={(e) => setAssessmentPrompt(e.target.value)}
                  placeholder="What prompt will verify individual mastery before leaving class?"
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200"
                />
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Homework &amp; Practice
                </label>
                <textarea
                  rows={3}
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  placeholder="Assignments, textbook exercises, or observational tasks..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200"
                />
              </div>
            </div>
          )}

          {/* STEP 8 */}
          {step === 8 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materials &amp; Teaching Resources
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g. Chalkboard, textbook Chapter 2, activity cards, projector"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Differentiation &amp; Student Support
                </label>
                <textarea
                  rows={2}
                  value={differentiationSupport}
                  onChange={(e) => setDifferentiationSupport(e.target.value)}
                  placeholder="Scaffolding for struggling learners and extension for advanced students..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {/* Summary box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm">{topic || "Untitled Lesson"}</div>
                <div>{grade} • {subject} • {duration} Minutes</div>
                <div><strong>Methods:</strong> {selectedMethods.join(", ")}</div>
                <div><strong>Activity:</strong> {activityName} ({activityGrouping})</div>
                <div><strong>Assessment:</strong> {assessmentType}</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleFinish("Draft")}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white shadow-xs"
            >
              Save Draft
            </button>

            {step < 8 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-xl bg-[#263B80] text-white text-xs font-bold hover:bg-[#1e2e65] shadow-xs flex items-center gap-1"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish("Ready")}
                className="px-5 py-2 rounded-xl bg-[#F28B70] hover:bg-[#e07559] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; Mark Ready</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
