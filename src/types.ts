export type AIEngine = "gemini" | "chatgpt";

export interface LessonPlanRequest {
  curriculum: string;
  grade: string;
  subject: string;
  topic: string;
  duration: number | string;
  classStrength: string;
  lessonModel: string;
  objectives: string;
  priorKnowledge: string;
  language: string;
  resources: string;
  differentiation: string;
  specialRequirements: string;
  aiEngine?: AIEngine;
}

export interface LessonFlowStage {
  stage: string;
  minutes: number | string;
  teacher_actions: string[];
  student_actions: string[];
  assessment_check: string;
}

export interface LessonPlanDifferentiation {
  support: string[];
  core: string[];
  extension: string[];
}

export interface LessonPlanAssessment {
  formative: string[];
  exit_ticket: string[];
  homework: string[];
}

export interface LessonPlan {
  title: string;
  learning_objectives: string[];
  success_criteria: string[];
  prior_knowledge: string[];
  materials: string[];
  key_explanation: string[];
  lesson_flow: LessonFlowStage[];
  differentiation: LessonPlanDifferentiation;
  assessment: LessonPlanAssessment;
  common_misconceptions: string[];
  teacher_notes: string[];
  reflection: string[];
  aiEngineUsed?: string;
}

export interface UserProfile {
  name: string;
  school: string;
  phone: string;
  bloodGroup: string;
  address: string;
  registeredAt: string;
  trialExpiresAt: string;
  isSubscriptionActive?: boolean;
  subscriptionPlan?: "monthly" | "yearly";
}

export interface WorksheetItem {
  id: string;
  question: string;
  type: "short_answer" | "fill_in_blank" | "problem_solving" | "multiple_choice";
  marks: number;
  spaceLines?: number;
  options?: string[];
}

export interface StudentWorksheet {
  title: string;
  schoolName: string;
  grade: string;
  subject: string;
  topic: string;
  timeAllowed: string;
  totalMarks: number;
  instructions: string[];
  questions: WorksheetItem[];
  exitSlipQuestion: string;
}

export interface BlackboardLayout {
  topicHeading: string;
  leftPanel: {
    title: string;
    items: string[];
  };
  centerPanel: {
    title: string;
    mainDiagramOrConcept: string;
    stepDerivation: string[];
    coreRules: string[];
  };
  rightPanel: {
    title: string;
    studentTasks: string[];
    summaryPoints: string[];
    homeworkAssignment: string;
  };
  teacherBoardTips: string[];
}

export interface TeacherExplanationScript {
  topic: string;
  grade: string;
  subject: string;
  language: string;
  hookAnalogy: {
    title: string;
    storyOrMetaphor: string;
    whyItWorks: string;
  };
  classroomSpeakingScript: Array<{
    phase: string;
    teacherSays: string;
    actionOrGesture: string;
    expectedStudentReaction: string;
  }>;
  eli5SimplifiedBackup: {
    simpleExplanation: string;
    concreteExample: string;
  };
  checkingQuestions: Array<{
    question: string;
    whatToLookFor: string;
  }>;
  quickDosAndDonts: {
    dos: string[];
    donts: string[];
  };
}

export interface QuestionPaperSection {
  sectionName: string;
  description?: string;
  marksPerQuestion: number;
  totalMarks: number;
  questions: Array<{
    qNumber: string | number;
    questionText: string;
    options?: string[];
    internalChoice?: string;
    marks: number;
    cognitiveDomain?: "Remembering" | "Understanding" | "Applying" | "HOTS/Analyzing";
    isPastBoardQuestion?: boolean;
    pastBoardYears?: string;
    answerKey?: string;
    stepMarking?: string[];
  }>;
}

export interface QuestionPaperBlueprint {
  rememberingMarks: number;
  understandingMarks: number;
  applyingMarks: number;
  analyzingHotsMarks: number;
  totalMarks: number;
}

export interface QuestionPaper {
  id: string;
  title: string;
  schoolName: string;
  examType: "slip_test_20" | "unit_test_40" | "term_exam_50" | "board_model_80";
  examTypeName: string;
  curriculum: string;
  grade: string;
  subject: string;
  topic: string;
  language: string;
  durationMinutes: number;
  totalMarks: number;
  generalInstructions: string[];
  sections: QuestionPaperSection[];
  blueprint?: QuestionPaperBlueprint;
  boardExamTips?: {
    highScorerKeywords: string[];
    commonStudentMistakes: string[];
    examinerMarkingAdvice: string;
  };
}

export interface PastBoardQuestionItem {
  id: string;
  subject: string;
  grade: string;
  curriculum: string;
  topic: string;
  yearRepeated: string;
  frequency: "Repeated 3+ Times (Very High)" | "High Probability" | "Sure-Shot 5-Marker";
  marks: number;
  question: string;
  expectedKeywords: string[];
  markingTrap: string;
  sampleAnswerSnippet: string;
  category?: "Board PYQ" | "Competitive Foundation (NEET/JEE/CUET)" | "Assertion-Reason" | "Case-Based";
}

export interface InternalAssessmentRubric {
  id: string;
  subject: string;
  grade: string;
  chapter: string;
  curriculum: string;
  componentType: "subject_enrichment_lab" | "portfolio_notebook" | "periodic_assessment" | "asl_oral_listening";
  componentTitle: string;
  maxMarks: number;
  criteria: Array<{
    criterionName: string;
    marksAllocated: number;
    exemplary: string; // 90-100%
    proficient: string; // 75-89%
    developing: string; // 50-74%
    beginning: string; // <50%
  }>;
  suggestedActivities: string[];
  teacherObservationChecklist: string[];
  cbsePortfolioGuidelines?: string;
}

export interface SyllabusPlanUnit {
  unitNumber: number;
  unitTitle: string;
  chapters: string[];
  term: "Term 1" | "Term 2";
  suggestedPeriods: number;
  theoryMarks: number;
  practicalOrInternalMarks: number;
  scheduledMonth: string;
  assessmentType: "Slip Test 1" | "Periodic Assessment 1" | "Mid-Term Exam" | "Periodic Assessment 2" | "Pre-Board / Annual";
  pedagogicalFocus: string;
  keyCompetencies: string[];
}

export interface AcademicSyllabusPlanner {
  id: string;
  grade: string;
  subject: string;
  curriculum: string;
  academicYear: string;
  totalInstructionalPeriods: number;
  theoryPeriods: number;
  revisionAndBufferPeriods: number;
  term1WeightageMarks: number;
  term2WeightageMarks: number;
  internalAssessmentTotalMarks: number;
  units: SyllabusPlanUnit[];
  examMilestones: Array<{
    examName: string;
    month: string;
    portionCovered: string;
    weightage: string;
  }>;
  teacherYearlyGuidelines: string[];
}

export interface SavedLessonPlan {
  id: string;
  savedAt: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  curriculum: string;
  plan: LessonPlan;
  formData: LessonPlanRequest;
  worksheet?: StudentWorksheet;
  blackboard?: BlackboardLayout;
  script?: TeacherExplanationScript;
  questionPaper?: QuestionPaper;
  rubric?: InternalAssessmentRubric;
  syllabusPlanner?: AcademicSyllabusPlanner;
  status?: "Ready" | "Draft" | "In Progress" | "Archived";
  isFavorite?: boolean;
}

export type ClassStatus = "upcoming" | "in_progress" | "completed";

export interface ScheduledClass {
  id: string;
  time: string;
  endTime?: string;
  grade: string;
  section: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  status: ClassStatus;
  room?: string;
  lessonPlanId?: string;
  notes?: string;
  reflection?: {
    rating: "excellent" | "good" | "average" | "needs_work";
    whatWorked: string;
    whatToChange: string;
    studentFollowUps: string;
  };
}

export interface TeachingNote {
  id: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  date: string;
  keyPoints: string[];
  teacherNotes: string;
  nextClass: string;
  tags: string[];
  isFavorite: boolean;
  updatedAt: string;
}

export type ActivityCategory =
  | "Icebreakers"
  | "Group Activities"
  | "Speaking Activities"
  | "Writing Activities"
  | "Reading Activities"
  | "Critical Thinking"
  | "Debates"
  | "Role Plays"
  | "Games"
  | "Revision"
  | "Assessment Activities";

export interface ClassroomActivityItem {
  id: string;
  title: string;
  category: ActivityCategory;
  purpose: string;
  grade: string;
  subject: string;
  duration: string;
  materials: string;
  grouping: "Individual" | "Pairs" | "Small Groups" | "Whole Class";
  instructions: string[];
  learningOutcome: string;
  isFavorite: boolean;
}

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation: string;
  wordType: string;
  meaning: string;
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  subject: string;
  topic: string;
  grade: string;
  isFavorite: boolean;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: "quiz" | "mcq" | "short_answer" | "exit_ticket" | "assignment" | "oral" | "observation";
  typeName: string;
  grade: string;
  subject: string;
  topic: string;
  marks: number;
  durationMinutes: number;
  date: string;
  questionsCount: number;
  instructions: string[];
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  section: string;
  attendanceRate?: string;
  notes?: string;
}

export interface TeacherClassRoster {
  id: string;
  grade: string;
  section: string;
  subject: string;
  room: string;
  studentCount: number;
  students: StudentRecord[];
}

export interface StudentObservationItem {
  id: string;
  studentName: string;
  grade: string;
  section: string;
  date: string;
  subject: string;
  observation: string;
  participationLevel: "Active" | "Moderate" | "Needs Encouragement";
  strength: string;
  areaForImprovement: string;
  followUpAction: string;
}

export interface TeachingReminder {
  id: string;
  title: string;
  dueTime: string;
  priority: "normal" | "urgent";
  completed: boolean;
  category: "lesson" | "assessment" | "admin" | "student";
}

export interface TeacherResourceItem {
  id: string;
  title: string;
  type: "lesson_plan" | "worksheet" | "activity" | "assessment" | "vocabulary" | "textbook" | "document";
  typeName: string;
  category: string;
  subject: string;
  grade: string;
  topic: string;
  date: string;
  tags: string[];
  isFavorite: boolean;
  fileUrl?: string;
  contentPreview?: string;
}

