import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Layers,
  Layout,
  Users,
  Brain,
  HelpCircle,
} from "lucide-react";

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlanning?: () => void;
}

interface GuideStep {
  stepNumber: string;
  totalSteps: string;
  title: string;
  subtitle: string;
  characterGreeting: string;
  items: Array<{
    id: string;
    iconText?: string;
    title: string;
    description: string;
    tag?: string;
  }>;
  importantNote?: string;
  actionText: string;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
  onStartPlanning,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"guide" | "myths">("guide");

  if (!isOpen) return null;

  const STEPS: GuideStep[] = [
    {
      stepNumber: "01",
      totalSteps: "07",
      title: "Who is an Aasaan Teacher?",
      subtitle: "The pedagogical mindset of a transformative educator.",
      characterGreeting: "A good teacher explains. A great teacher inspires!",
      items: [
        {
          id: "1",
          iconText: "100%",
          title: "Empathy First",
          description: "Understand student backgrounds, emotional readiness, and learning paces before introducing complex concepts.",
        },
        {
          id: "2",
          iconText: "5E",
          title: "Inquiry Over Rote Learning",
          description: "Shift from passive lecturing to active student questioning, hands-on exploration, and real-life examples.",
        },
        {
          id: "3",
          iconText: "Biling",
          title: "Bilingual Bridging (தமிழ் + English)",
          description: "Explain tough scientific and mathematical terms in Tamil first to cement intuitive conceptual grasp.",
        },
        {
          id: "4",
          iconText: "CCE",
          title: "Continuous Assessment",
          description: "Observe learning during the period via quick checks rather than waiting solely for final exam scores.",
        },
      ],
      importantNote:
        "Every child in your classroom has unique brilliance. Consistent structured planning is the master key to unlocking their potential.",
      actionText: "Next: SMART Objectives →",
    },
    {
      stepNumber: "02",
      totalSteps: "07",
      title: "SMART Learning Objectives",
      subtitle: "Bloom's Revised Taxonomy verbs for razor-sharp lesson focus.",
      characterGreeting: "Clear goals lead to effortless classroom achievement!",
      items: [
        {
          id: "b1",
          iconText: "L1",
          title: "Remember & Recall",
          description: "Students define, list, recall, or label key terms without consulting textbooks.",
          tag: "Foundational",
        },
        {
          id: "b2",
          iconText: "L2",
          title: "Understand & Explain",
          description: "Students rephrase concepts in their own words and illustrate with everyday analogies.",
          tag: "Comprehension",
        },
        {
          id: "b3",
          iconText: "L3",
          title: "Apply & Solve",
          description: "Students use formulas, rules, and concepts to solve novel mathematical or scientific problems.",
          tag: "Practical",
        },
        {
          id: "b4",
          iconText: "L4-6",
          title: "Analyze & Create",
          description: "Students compare alternatives, debate outcomes, and formulate their own models or hypotheses.",
          tag: "Higher Order (HOTS)",
        },
      ],
      importantNote:
        "Always write 2 to 3 measurable outcomes starting with: 'By the end of this lesson, students will be able to...'",
      actionText: "Next: Before Class Prep →",
    },
    {
      stepNumber: "03",
      totalSteps: "07",
      title: "Before Class: 5-Minute Prep",
      subtitle: "Simple habits that guarantee a frictionless teaching session.",
      characterGreeting: "5 minutes of prep saves 20 minutes of confusion!",
      items: [
        {
          id: "p1",
          iconText: "Book",
          title: "Check Samacheer / NCERT Textbook Page",
          description: "Review specific illustrations, boxed facts, and end-of-chapter questions beforehand.",
        },
        {
          id: "p2",
          iconText: "Chalk",
          title: "Pre-divide the Blackboard",
          description: "Draw the 3-panel dividing lines before students assemble so the board starts organized.",
        },
        {
          id: "p3",
          iconText: "Sheet",
          title: "Prepare Exit Slips / Worksheets",
          description: "Have 2 short questions ready on slips of paper for the final 5 minutes of class.",
        },
        {
          id: "p4",
          iconText: "Hook",
          title: "Pick an Engaging Hook",
          description: "A 60-second real-world puzzle, demonstration, or intriguing question to spark attention.",
        },
      ],
      importantNote:
        "When teachers enter the room completely organized, classroom discipline issues drop by over 60%.",
      actionText: "Next: During Class Flow →",
    },
    {
      stepNumber: "04",
      totalSteps: "07",
      title: "During Class: 5E Inquiry Cycle",
      subtitle: "The gold-standard lesson flow recognized by NEP 2020.",
      characterGreeting: "Guide students through discovery step-by-step!",
      items: [
        {
          id: "5e1",
          iconText: "5 min",
          title: "1. Engage (கவனம் ஈர்த்தல்)",
          description: "Capture attention with a puzzling question, surprising visual, or real-life paradox.",
        },
        {
          id: "5e2",
          iconText: "10 min",
          title: "2. Explore (ஆராய்ந்து அறிதல்)",
          description: "Students work in pairs with diagrams or apparatus to observe patterns on their own.",
        },
        {
          id: "5e3",
          iconText: "12 min",
          title: "3. Explain (விளக்குதல்)",
          description: "Teacher formally introduces scientific terms, formulas, and clarifies doubts.",
        },
        {
          id: "5e4",
          iconText: "8 min",
          title: "4. Elaborate (விரிவுபடுத்துதல்)",
          description: "Students apply the newfound law to a new practical real-world scenario.",
        },
        {
          id: "5e5",
          iconText: "5 min",
          title: "5. Evaluate (மதிப்பிடுதல்)",
          description: "Quick exit ticket or 3 targeted oral questions to verify understanding.",
        },
      ],
      importantNote:
        "Never spend more than 50% of the period talking yourself — active student participation creates permanent memory.",
      actionText: "Next: Blackboard Architecture →",
    },
    {
      stepNumber: "05",
      totalSteps: "07",
      title: "Blackboard Architecture",
      subtitle: "How to organize the green/black board into 3 functional zones.",
      characterGreeting: "A clean board creates a clean, organized student notebook!",
      items: [
        {
          id: "bb1",
          iconText: "Left",
          title: "Left Panel: Lesson Anchor (25%)",
          description: "Date, Class, Subject, Core Topic, and Essential Vocabulary/Keywords for the day.",
        },
        {
          id: "bb2",
          iconText: "Center",
          title: "Center Panel: Working Space (50%)",
          description: "Core derivations, large annotated diagrams, problem steps, and concept mind-maps.",
        },
        {
          id: "bb3",
          iconText: "Right",
          title: "Right Panel: Reflection & Homework (25%)",
          description: "Summary recap bullets, homework questions, textbook page numbers, and exit question.",
        },
      ],
      importantNote:
        "Avoid wiping the board prematurely. Let students finish copying the complete logical progression before ringing the bell.",
      actionText: "Next: Differentiated Care →",
    },
    {
      stepNumber: "06",
      totalSteps: "07",
      title: "Differentiated Instruction",
      subtitle: "Reaching every learner: slow learners, average, and gifted.",
      characterGreeting: "No child left behind, no child held back!",
      items: [
        {
          id: "di1",
          iconText: "Support",
          title: "Remedial Scaffolding (Slow Learners)",
          description: "Provide step-by-step worked example cards, formula sheets, and peer buddy assistance.",
        },
        {
          id: "di2",
          iconText: "Core",
          title: "Grade-Level Practice (Core Cohort)",
          description: "Standard textbook exercise questions and guided group practice.",
        },
        {
          id: "di3",
          iconText: "Extend",
          title: "HOTS Extension (High Achievers)",
          description: "Challenging multi-concept Olympiad problems, peer mentoring roles, or research mini-tasks.",
        },
      ],
      importantNote:
        "Aasaan automatically generates differentiated extension tasks and scaffolding cues in every lesson plan.",
      actionText: "Next: Myths vs Facts →",
    },
    {
      stepNumber: "07",
      totalSteps: "07",
      title: "Classroom Myths vs Facts",
      subtitle: "Clearing misconceptions to spread effective pedagogy.",
      characterGreeting: "Right pedagogy saves hours and inspires generations!",
      items: [
        {
          id: "mf1",
          iconText: "Myth 1",
          title: "Myth: Strict lecturing covers syllabus fastest.",
          description: "Fact: Students retain under 10% of pure lectures. Interactive 5E activities cut revision time in half.",
        },
        {
          id: "mf2",
          iconText: "Myth 2",
          title: "Myth: Tamil medium students struggle with science.",
          description: "Fact: Conceptual mastery in the mother tongue builds stronger analytical logic for higher education.",
        },
        {
          id: "mf3",
          iconText: "Myth 3",
          title: "Myth: Lesson planning is paperwork just for inspection.",
          description: "Fact: A structured plan is your classroom GPS. It prevents burnout and boosts student enthusiasm.",
        },
        {
          id: "mf4",
          iconText: "Myth 4",
          title: "Myth: You need high-tech equipment to teach well.",
          description: "Fact: A well-organized blackboard, everyday objects, and clear analogies beat expensive gadgets.",
        },
      ],
      importantNote:
        "Share these pedagogical facts with your fellow teachers and school staff to cultivate a supportive academic environment.",
      actionText: "Start Lesson Planning Now →",
    },
  ];

  const currentStep = STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
      if (onStartPlanning) onStartPlanning();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-[#faf7f7] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header matching Blood Bridge Screen Style */}
        <div className="bg-white px-5 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-black text-sm">
              ஆ
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                AASAAN PEDAGOGY GUIDE
              </h3>
              <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                ஆசிரியர் பயிற்சி &amp; வழிகாட்டி
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              {currentStep.stepNumber} / {currentStep.totalSteps}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Carousel / Index Pills */}
        <div className="bg-white/80 px-4 py-2 border-b border-rose-50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {STEPS.map((step, idx) => (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => setCurrentStepIndex(idx)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition flex-shrink-0 flex items-center gap-1 ${
                currentStepIndex === idx
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <span>{step.stepNumber}</span>
              <span className="hidden sm:inline">
                {step.title.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Scrollable Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Step Title Header with Mascot / Character Card */}
          <div className="flex items-start justify-between gap-3 bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
            <div>
              <span className="text-xs font-extrabold text-rose-600 block mb-0.5">
                STEP {currentStep.stepNumber} OF {currentStep.totalSteps}
              </span>
              <h2 className="text-lg font-black text-slate-900 leading-snug">
                {currentStep.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>

            {/* Teacher Mascot Badge */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col items-center justify-center shadow-md shadow-rose-200 flex-shrink-0 text-center">
              <span className="text-xs font-black">ஆசான்</span>
              <span className="text-[8px] opacity-90">Guide</span>
            </div>
          </div>

          {/* Friendly Mascot Speech Bubble */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 rounded-xl p-3 text-xs text-slate-700 font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>"{currentStep.characterGreeting}"</span>
          </div>

          {/* List of items matching Blood Bridge rounded cards style */}
          <div className="space-y-2.5">
            {currentStep.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-rose-100/80 shadow-2xs hover:shadow-xs transition flex items-start gap-3.5"
              >
                {/* Number / Icon Badge on the left */}
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-extrabold text-xs flex-shrink-0">
                  {item.iconText || `0${idx + 1}`}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-black text-slate-900">
                      {item.title}
                    </h4>
                    {item.tag && (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 self-center" />
              </div>
            ))}
          </div>

          {/* Important Notice Box matching Screenshot 3 & 4 */}
          {currentStep.importantNote && (
            <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-950">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0 text-xs">
                i
              </div>
              <div>
                <strong className="font-black block text-amber-900 text-xs mb-0.5">
                  Important Pedagogical Note:
                </strong>
                <p className="text-[11.5px] text-amber-900/90 leading-relaxed font-medium">
                  {currentStep.importantNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar matching Screenshot 3 & 4 */}
        <div className="bg-white p-4 border-t border-rose-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Step Progress Dots */}
          <div className="flex items-center gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStepIndex === i
                    ? "w-5 bg-rose-600"
                    : "w-1.5 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Big Crimson Primary Action Button */}
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-600 text-white shadow-md shadow-rose-200 transition flex items-center gap-1.5 active:scale-95"
          >
            <span>{currentStep.actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
