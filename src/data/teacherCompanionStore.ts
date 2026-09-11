import {
  ScheduledClass,
  TeachingNote,
  ClassroomActivityItem,
  VocabularyWord,
  AssessmentItem,
  TeacherClassRoster,
  StudentObservationItem,
  TeachingReminder,
  TeacherResourceItem,
  SavedLessonPlan,
} from "../types.ts";

const CLASSES_KEY = "aasan_today_classes";
const NOTES_KEY = "aasan_teaching_notes";
const ACTIVITIES_KEY = "aasan_classroom_activities";
const VOCABULARY_KEY = "aasan_vocabulary";
const ASSESSMENTS_KEY = "aasan_assessments";
const ROSTERS_KEY = "aasan_class_rosters";
const OBSERVATIONS_KEY = "aasan_observations";
const REMINDERS_KEY = "aasan_reminders";

// Initial Demo Seed for Moses (Grade 8, Grade 9, Grade 10)
export const SEED_SCHEDULED_CLASSES: ScheduledClass[] = [
  {
    id: "cls-1",
    time: "08:30 AM",
    endTime: "09:15 AM",
    grade: "Grade 8",
    section: "Section A",
    subject: "English",
    topic: "Communication Skills & Active Listening",
    duration: 45,
    status: "in_progress",
    room: "Room 204",
    lessonPlanId: "seed-lp-1",
    notes: "Distribute the sender-receiver diagram before the paired role play.",
    reflection: {
      rating: "excellent",
      whatWorked: "The paired telephone role-play activity had 100% participation.",
      whatToChange: "Allow 5 more minutes for student debrief at the end.",
      studentFollowUps: "Review voice modulation with Rahul and Priya.",
    },
  },
  {
    id: "cls-2",
    time: "10:15 AM",
    endTime: "10:55 AM",
    grade: "Grade 9",
    section: "Section B",
    subject: "English",
    topic: "Parts of Speech & Syntactic Nuance",
    duration: 40,
    status: "upcoming",
    room: "Room 108",
    lessonPlanId: "seed-lp-2",
    notes: "Review yesterday's exit ticket on adverbs vs adjectives.",
  },
  {
    id: "cls-3",
    time: "01:00 PM",
    endTime: "01:45 PM",
    grade: "Grade 10",
    section: "Section A",
    subject: "Psychology",
    topic: "Emotional Intelligence & Self-Regulation",
    duration: 45,
    status: "upcoming",
    room: "Audio-Visual Lab",
    lessonPlanId: "seed-lp-3",
    notes: "Set up the amygdala hijack scenario cards on each workbench.",
  },
  {
    id: "cls-4",
    time: "02:15 PM",
    endTime: "02:55 PM",
    grade: "Grade 8",
    section: "Section C",
    subject: "English",
    topic: "Persuasive Writing & Rhetorical Devices",
    duration: 40,
    status: "upcoming",
    room: "Room 206",
  },
];

export const SEED_TEACHING_NOTES: TeachingNote[] = [
  {
    id: "note-1",
    title: "Grade 8 – English: Communication Barriers & Feedback Loops",
    grade: "Grade 8",
    subject: "English",
    topic: "Communication Skills",
    date: "11 Sep 2026",
    keyPoints: [
      "Communication is a cyclic process: Sender → Encoding → Message → Channel → Receiver → Decoding → Feedback.",
      "Noise (psychological, physiological, environmental) can distort any part of the channel.",
      "Feedback is what verifies mutual understanding and closes the loop.",
    ],
    teacherNotes:
      "Students were highly engaged during the broken telephone and role-play activity. Section A grasped encoding/decoding faster through visual board gestures.",
    nextClass:
      "Transition from interpersonal communication to written rhetorical clarity. Bring 4 sample email excerpts with deliberate tone misunderstandings.",
    tags: ["Pedagogy", "Role-play", "Communication", "Grade 8"],
    isFavorite: true,
    updatedAt: "Just now",
  },
  {
    id: "note-2",
    title: "Grade 9 – Parts of Speech: Identifying Ambiguous Words",
    grade: "Grade 9",
    subject: "English",
    topic: "Parts of Speech",
    date: "10 Sep 2026",
    keyPoints: [
      "A word's part of speech depends strictly on its syntactic function in context (e.g., 'fast' as adjective, adverb, noun, or verb).",
      "Transitive vs Intransitive verb boundary check: does it take a direct object?",
    ],
    teacherNotes:
      "Common misconception: students tried memorizing dictionary definitions instead of testing word position and question tests ('how', 'when', 'what').",
    nextClass:
      "Run a 5-minute board speed drill: 10 sentences with multi-functional words like 'run', 'light', 'down'.",
    tags: ["Grammar", "Syntax", "Grade 9"],
    isFavorite: false,
    updatedAt: "Yesterday",
  },
  {
    id: "note-3",
    title: "Grade 10 – Psychology: Emotional Intelligence Case Studies",
    grade: "Grade 10",
    subject: "Psychology",
    topic: "Emotional Intelligence",
    date: "09 Sep 2026",
    keyPoints: [
      "Goleman's 5 domains: Self-awareness, Self-regulation, Motivation, Empathy, Social skills.",
      "Cognitive reappraisal vs emotional suppression: physiological stress impact.",
    ],
    teacherNotes:
      "Socratic questioning prompted mature reflections. Keep peer discussion pairs randomized so quieter students feel safe sharing perspectives.",
    nextClass:
      "Provide real-world conflict resolution scenarios for small group simulation.",
    tags: ["Psychology", "SEL", "Case Study", "Grade 10"],
    isFavorite: true,
    updatedAt: "2 days ago",
  },
];

export const SEED_ACTIVITIES: ClassroomActivityItem[] = [
  {
    id: "act-1",
    title: "The Silent Telephone & Feedback Breakdown",
    category: "Role Plays",
    purpose: "Demonstrate how message distortion occurs without direct bidirectional feedback.",
    grade: "Grade 8 - 10",
    subject: "English / Communication",
    duration: "15 min",
    materials: "Index cards with 3-sentence descriptive prompts",
    grouping: "Small Groups",
    instructions: [
      "Form rows of 6 students facing the chalkboard.",
      "Show the last student a prompt on an index card for 10 seconds.",
      "The student taps the peer in front and whispers the message once without repeating.",
      "The front student writes the received message on the chalkboard.",
      "Debrief: Compare the original prompt vs final board sentence to identify where semantic noise occurred.",
    ],
    learningOutcome:
      "Students recognize the critical necessity of feedback and clarity in oral communication.",
    isFavorite: true,
  },
  {
    id: "act-2",
    title: "Fishbowl Debate on Social Media & Empathy",
    category: "Debates",
    purpose: "Cultivate active listening, respectful disagreement, and analytical defense.",
    grade: "Grade 9 - 10",
    subject: "Psychology / English",
    duration: "20 min",
    materials: "Timer, proposition rubric sheet",
    grouping: "Whole Class",
    instructions: [
      "Place 4 chairs in an inner circle (the fishbowl) and remaining chairs in outer ring.",
      "3 students take affirmative/negative positions, 1 chair remains empty for guest speakers from the outer circle.",
      "Outer circle students must take structured observation notes on arguments made.",
      "Anyone from the outer ring can sit in the empty chair to offer a 60-second counterpoint.",
    ],
    learningOutcome:
      "Students practice structured argumentation and cognitive empathy while observing debate dynamics.",
    isFavorite: true,
  },
  {
    id: "act-3",
    title: "Grammar Detective: The Ambiguous Sentence Hunt",
    category: "Group Activities",
    purpose: "Spot structural ambiguity and syntax errors in real-world news headlines.",
    grade: "Grade 8 - 9",
    subject: "English",
    duration: "15 min",
    materials: "Projector slide with 5 humorous ambiguous headlines",
    grouping: "Pairs",
    instructions: [
      "Present real headlines like 'Kids Make Nutritious Snacks' or 'Stolen Painting Found by Tree'.",
      "Pairs diagram both possible interpretations (syntax parse tree).",
      "Rewrite the sentences to eliminate ambiguity using precise modifiers.",
    ],
    learningOutcome:
      "Students master the syntactic placement of modifier clauses and part-of-speech dependencies.",
    isFavorite: false,
  },
  {
    id: "act-4",
    title: "Emotional Thermometer & Mindful Reframe",
    category: "Icebreakers",
    purpose: "Check classroom emotional temperature and build self-regulation capacity.",
    grade: "Grade 6 - 12",
    subject: "Psychology / Homeroom",
    duration: "8 min",
    materials: "Color-coded sticky notes (Green, Yellow, Blue, Red)",
    grouping: "Individual",
    instructions: [
      "Students quietly choose a sticky note reflecting their current energy and emotional state.",
      "Write one sentence reframing a morning frustration into a controllable micro-goal.",
      "Voluntary sharing on the classroom mood board.",
    ],
    learningOutcome:
      "Develops meta-cognitive awareness and creates a safe, focused classroom climate.",
    isFavorite: true,
  },
  {
    id: "act-5",
    title: "3-2-1 Exit Ticket Speed Summary",
    category: "Revision",
    purpose: "Formative check to gauge individual student mastery before the bell rings.",
    grade: "All Grades",
    subject: "Any Subject",
    duration: "5 min",
    materials: "Quarter-sheet paper slips",
    grouping: "Individual",
    instructions: [
      "3 things I learned with clarity today.",
      "2 questions or connections I still have.",
      "1 key vocabulary word I can define in my own words.",
      "Hand in at the classroom door as the exit pass.",
    ],
    learningOutcome:
      "Immediate formative assessment data informing the teacher's next lesson plan.",
    isFavorite: true,
  },
];

export const SEED_VOCABULARY: VocabularyWord[] = [
  {
    id: "voc-1",
    word: "Articulation",
    pronunciation: "/ɑːrˌtɪk.jəˈleɪ.ʃən/",
    wordType: "Noun",
    meaning: "The clear and distinct formation or pronunciation of spoken words; or the clear expression of an idea in speech or writing.",
    exampleSentence: "Her clear articulation allowed even the students in the back row to follow the complex explanation effortlessly.",
    synonyms: ["Enunciation", "Pronunciation", "Expression", "Clarity"],
    antonyms: ["Mumbling", "Inarticulateness", "Distortion"],
    subject: "English",
    topic: "Communication Skills",
    grade: "Grade 8",
    isFavorite: true,
  },
  {
    id: "voc-2",
    word: "Empathy",
    pronunciation: "/ˈem.pə.θi/",
    wordType: "Noun",
    meaning: "The capacity to understand, share, and resonate with the feelings and perspective of another person.",
    exampleSentence: "Demonstrating cognitive empathy during class discussions helped resolving conflicting student viewpoints peacefully.",
    synonyms: ["Compassion", "Sensitivity", "Understanding", "Insight"],
    antonyms: ["Apathy", "Indifference", "Callousness"],
    subject: "Psychology",
    topic: "Emotional Intelligence",
    grade: "Grade 10",
    isFavorite: true,
  },
  {
    id: "voc-3",
    word: "Syntax",
    pronunciation: "/ˈsɪn.tæks/",
    wordType: "Noun",
    meaning: "The arrangement of words and phrases to create well-formed sentences in a language.",
    exampleSentence: "By altering the syntax of the opening line, the poet created a sense of suspense and anticipation.",
    synonyms: ["Grammar", "Word order", "Sentence structure"],
    antonyms: ["Disorder", "Solecism"],
    subject: "English",
    topic: "Parts of Speech & Grammar",
    grade: "Grade 9",
    isFavorite: false,
  },
  {
    id: "voc-4",
    word: "Resilience",
    pronunciation: "/rɪˈzɪl.jəns/",
    wordType: "Noun",
    meaning: "The capacity to recover quickly from difficulties; toughness and mental elasticity.",
    exampleSentence: "Academic resilience allows students to view constructive criticism not as failure, but as a stepping stone to mastery.",
    synonyms: ["Fortitude", "Grit", "Endurance", "Buoyancy"],
    antonyms: ["Fragility", "Vulnerability", "Helplessness"],
    subject: "Psychology",
    topic: "Self-Regulation",
    grade: "Grade 10",
    isFavorite: true,
  },
  {
    id: "voc-5",
    word: "Rhetoric",
    pronunciation: "/ˈret.ər.ɪk/",
    wordType: "Noun",
    meaning: "The art of effective or persuasive speaking or writing, especially the use of figures of speech and composition techniques.",
    exampleSentence: "The teacher guided the class to analyze the orator's rhetoric, uncovering how metaphors swayed the audience.",
    synonyms: ["Oratory", "Eloquence", "Persuasion"],
    antonyms: ["Inarticulacy"],
    subject: "English",
    topic: "Public Speaking",
    grade: "Grade 9",
    isFavorite: false,
  },
];

export const SEED_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "ass-1",
    title: "Slip Test: Elements of Communication & Feedback",
    type: "quiz",
    typeName: "Slip Test (Formative)",
    grade: "Grade 8",
    subject: "English",
    topic: "Communication Skills",
    marks: 20,
    durationMinutes: 20,
    date: "12 Sep 2026",
    questionsCount: 5,
    instructions: [
      "All questions are compulsory.",
      "Diagram the communication process in Section B.",
      "Provide concrete examples for psychological noise.",
    ],
    isFavorite: true,
  },
  {
    id: "ass-2",
    title: "Diagnostic MCQ: Parts of Speech & Sentence Syntactics",
    type: "mcq",
    typeName: "Diagnostic MCQ",
    grade: "Grade 9",
    subject: "English",
    topic: "Parts of Speech",
    marks: 15,
    durationMinutes: 15,
    date: "15 Sep 2026",
    questionsCount: 15,
    instructions: [
      "Select the best option for the underlined word in each sentence.",
      "Each correct answer carries 1 mark. No negative marking.",
    ],
    isFavorite: false,
  },
  {
    id: "ass-3",
    title: "Case Analysis: Emotional Self-Regulation in Crisis",
    type: "short_answer",
    typeName: "Case Study & Short Answer",
    grade: "Grade 10",
    subject: "Psychology",
    topic: "Emotional Intelligence",
    marks: 25,
    durationMinutes: 30,
    date: "18 Sep 2026",
    questionsCount: 4,
    instructions: [
      "Read the classroom conflict narrative carefully.",
      "Apply Daniel Goleman's 5 domains to evaluate the protagonists' choices.",
    ],
    isFavorite: true,
  },
];

export const SEED_CLASS_ROSTERS: TeacherClassRoster[] = [
  {
    id: "roster-1",
    grade: "Grade 8",
    section: "Section A",
    subject: "English",
    room: "Room 204",
    studentCount: 38,
    students: [
      { id: "s1", name: "Rahul Sharma", rollNumber: "8A-01", grade: "Grade 8", section: "A", attendanceRate: "96%", notes: "Excellent public speaker; needs support on written punctuation." },
      { id: "s2", name: "Priya Nair", rollNumber: "8A-02", grade: "Grade 8", section: "A", attendanceRate: "98%", notes: "High comprehension; thrives in peer debate activities." },
      { id: "s3", name: "Ananya Krishnan", rollNumber: "8A-03", grade: "Grade 8", section: "A", attendanceRate: "94%", notes: "Creative writing strength; quiet during open floor Q&A." },
      { id: "s4", name: "Mohammed Farooq", rollNumber: "8A-04", grade: "Grade 8", section: "A", attendanceRate: "92%", notes: "Energetic participant; benefits from structured turn-taking cards." },
      { id: "s5", name: "Kavita Reddy", rollNumber: "8A-05", grade: "Grade 8", section: "A", attendanceRate: "100%", notes: "Meticulous notebook; always helps peer review groups." },
    ],
  },
  {
    id: "roster-2",
    grade: "Grade 9",
    section: "Section B",
    subject: "English",
    room: "Room 108",
    studentCount: 36,
    students: [
      { id: "s6", name: "Arjun Verma", rollNumber: "9B-01", grade: "Grade 9", section: "B", attendanceRate: "95%", notes: "Strong grammar analysis; enthusiastic about vocabulary quizzes." },
      { id: "s7", name: "Divya Sundaram", rollNumber: "9B-02", grade: "Grade 9", section: "B", attendanceRate: "97%", notes: "Exceptional vocabulary articulation; assisted with fishbowl debate." },
      { id: "s8", name: "Rohan Joseph", rollNumber: "9B-03", grade: "Grade 9", section: "B", attendanceRate: "91%", notes: "Needs reinforcement on identifying transitive vs intransitive verbs." },
    ],
  },
  {
    id: "roster-3",
    grade: "Grade 10",
    section: "Section A",
    subject: "Psychology",
    room: "Audio-Visual Lab",
    studentCount: 32,
    students: [
      { id: "s9", name: "Tanvi Saxena", rollNumber: "10A-01", grade: "Grade 10", section: "A", attendanceRate: "98%", notes: "Deep analytical insight into emotional regulation case studies." },
      { id: "s10", name: "Aditya Bhatt", rollNumber: "10A-02", grade: "Grade 10", section: "A", attendanceRate: "94%", notes: "Active contributor during cognitive reframing discussions." },
    ],
  },
];

export const SEED_OBSERVATIONS: StudentObservationItem[] = [
  {
    id: "obs-1",
    studentName: "Rahul Sharma",
    grade: "Grade 8",
    section: "Section A",
    date: "11 Sep 2026",
    subject: "English",
    observation: "Demonstrated remarkable confidence during the telephone feedback role play.",
    participationLevel: "Active",
    strength: "Spoken clarity and spontaneous problem-solving.",
    areaForImprovement: "Pacing; tends to speak quickly when enthusiastic.",
    followUpAction: "Give role of session summarizer in next class to practice steady cadence.",
  },
  {
    id: "obs-2",
    studentName: "Ananya Krishnan",
    grade: "Grade 8",
    section: "Section A",
    date: "10 Sep 2026",
    subject: "English",
    observation: "Turned in a brilliantly nuanced written reflection on non-verbal body language.",
    participationLevel: "Moderate",
    strength: "Reflective written expression and empathy.",
    areaForImprovement: "Speaking up in larger whole-class circles.",
    followUpAction: "Pair with Priya in small group discussion before calling on pair.",
  },
  {
    id: "obs-3",
    studentName: "Rohan Joseph",
    grade: "Grade 9",
    section: "Section B",
    date: "09 Sep 2026",
    subject: "English",
    observation: "Struggled with the verb transitivity test in today's speed drill.",
    participationLevel: "Moderate",
    strength: "Persistence and willingness to ask clarifying questions.",
    areaForImprovement: "Distinguishing direct objects from prepositional adverbs.",
    followUpAction: "Provide 3-step question test cheat sheet during tomorrow's revision.",
  },
];

export const SEED_REMINDERS: TeachingReminder[] = [
  {
    id: "rem-1",
    title: "Print Grade 8 Communication Role Play prompt cards",
    dueTime: "Before 08:30 AM",
    priority: "urgent",
    completed: false,
    category: "lesson",
  },
  {
    id: "rem-2",
    title: "Grade 9 Parts of Speech Diagnostic MCQ answer keys",
    dueTime: "By 12:30 PM",
    priority: "normal",
    completed: false,
    category: "assessment",
  },
  {
    id: "rem-3",
    title: "Prepare AV Lab projector for Grade 10 Psychology case study",
    dueTime: "Before 01:00 PM",
    priority: "normal",
    completed: true,
    category: "lesson",
  },
  {
    id: "rem-4",
    title: "Follow up with Rahul's parents on speech competition nomination",
    dueTime: "Tomorrow 04:00 PM",
    priority: "normal",
    completed: false,
    category: "student",
  },
];

// Data Access Helpers with LocalStorage Persistence
export function getScheduledClasses(): ScheduledClass[] {
  try {
    const raw = localStorage.getItem(CLASSES_KEY);
    if (!raw) {
      localStorage.setItem(CLASSES_KEY, JSON.stringify(SEED_SCHEDULED_CLASSES));
      return SEED_SCHEDULED_CLASSES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_SCHEDULED_CLASSES;
  }
}

export function saveScheduledClasses(classes: ScheduledClass[]): void {
  try {
    localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
  } catch (err) {
    console.error("Failed to save scheduled classes:", err);
  }
}

export function saveScheduledClass(singleClass: ScheduledClass): ScheduledClass[] {
  const list = getScheduledClasses();
  const index = list.findIndex((c) => c.id === singleClass.id);
  let updated: ScheduledClass[];
  if (index >= 0) {
    updated = [...list];
    updated[index] = singleClass;
  } else {
    updated = [singleClass, ...list];
  }
  saveScheduledClasses(updated);
  return updated;
}

export const toggleFavoriteNote = toggleNoteFavorite;
export const getTeacherRosters = getClassRosters;
export const toggleReminderCompleted = toggleReminderComplete;

export function updateClassStatus(id: string, status: ScheduledClass["status"]): ScheduledClass[] {
  const list = getScheduledClasses();
  const updated = list.map((c) => (c.id === id ? { ...c, status } : c));
  saveScheduledClasses(updated);
  return updated;
}

export function updateClassReflection(
  id: string,
  reflection: NonNullable<ScheduledClass["reflection"]>
): ScheduledClass[] {
  const list = getScheduledClasses();
  const updated = list.map((c) => (c.id === id ? { ...c, reflection, status: "completed" as const } : c));
  saveScheduledClasses(updated);
  return updated;
}

export function getTeachingNotes(): TeachingNote[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) {
      localStorage.setItem(NOTES_KEY, JSON.stringify(SEED_TEACHING_NOTES));
      return SEED_TEACHING_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TEACHING_NOTES;
  }
}

export function saveTeachingNote(note: Partial<TeachingNote> & { title: string }): TeachingNote {
  const list = getTeachingNotes();
  const id = note.id || `note_${Date.now()}`;
  const now = "Just now";

  const completeNote: TeachingNote = {
    id,
    title: note.title,
    grade: note.grade || "Grade 8",
    subject: note.subject || "English",
    topic: note.topic || "Teaching Reflections",
    date: note.date || new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    keyPoints: note.keyPoints || [],
    teacherNotes: note.teacherNotes || "",
    nextClass: note.nextClass || "",
    tags: note.tags || ["Classroom"],
    isFavorite: note.isFavorite ?? false,
    updatedAt: now,
  };

  const existingIndex = list.findIndex((n) => n.id === id);
  let updated: TeachingNote[];
  if (existingIndex >= 0) {
    updated = [...list];
    updated[existingIndex] = completeNote;
  } else {
    updated = [completeNote, ...list];
  }

  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save teaching note:", err);
  }
  return completeNote;
}

export function deleteTeachingNote(id: string): TeachingNote[] {
  const list = getTeachingNotes();
  const updated = list.filter((n) => n.id !== id);
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete note:", err);
  }
  return updated;
}

export function toggleNoteFavorite(id: string): TeachingNote[] {
  const list = getTeachingNotes();
  const updated = list.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
  }
  return updated;
}

export function getClassroomActivities(): ClassroomActivityItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(SEED_ACTIVITIES));
      return SEED_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ACTIVITIES;
  }
}

export function saveClassroomActivity(activity: ClassroomActivityItem): ClassroomActivityItem[] {
  const list = getClassroomActivities();
  const existing = list.findIndex((a) => a.id === activity.id);
  let updated: ClassroomActivityItem[];
  if (existing >= 0) {
    updated = [...list];
    updated[existing] = activity;
  } else {
    updated = [activity, ...list];
  }
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save activity:", err);
  }
  return updated;
}

export function getVocabularyWords(): VocabularyWord[] {
  try {
    const raw = localStorage.getItem(VOCABULARY_KEY);
    if (!raw) {
      localStorage.setItem(VOCABULARY_KEY, JSON.stringify(SEED_VOCABULARY));
      return SEED_VOCABULARY;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_VOCABULARY;
  }
}

export function saveVocabularyWord(word: VocabularyWord): VocabularyWord[] {
  const list = getVocabularyWords();
  const existing = list.findIndex((w) => w.id === word.id);
  let updated: VocabularyWord[];
  if (existing >= 0) {
    updated = [...list];
    updated[existing] = word;
  } else {
    updated = [word, ...list];
  }
  try {
    localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save word:", err);
  }
  return updated;
}

export function getAssessments(): AssessmentItem[] {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY);
    if (!raw) {
      localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(SEED_ASSESSMENTS));
      return SEED_ASSESSMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ASSESSMENTS;
  }
}

export function saveAssessment(assessment: AssessmentItem): AssessmentItem[] {
  const list = getAssessments();
  const existing = list.findIndex((a) => a.id === assessment.id);
  let updated: AssessmentItem[];
  if (existing >= 0) {
    updated = [...list];
    updated[existing] = assessment;
  } else {
    updated = [assessment, ...list];
  }
  try {
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save assessment:", err);
  }
  return updated;
}

export function getClassRosters(): TeacherClassRoster[] {
  try {
    const raw = localStorage.getItem(ROSTERS_KEY);
    if (!raw) {
      localStorage.setItem(ROSTERS_KEY, JSON.stringify(SEED_CLASS_ROSTERS));
      return SEED_CLASS_ROSTERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_CLASS_ROSTERS;
  }
}

export function getStudentObservations(): StudentObservationItem[] {
  try {
    const raw = localStorage.getItem(OBSERVATIONS_KEY);
    if (!raw) {
      localStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(SEED_OBSERVATIONS));
      return SEED_OBSERVATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_OBSERVATIONS;
  }
}

export function saveStudentObservation(obs: StudentObservationItem): StudentObservationItem[] {
  const list = getStudentObservations();
  const existing = list.findIndex((o) => o.id === obs.id);
  let updated: StudentObservationItem[];
  if (existing >= 0) {
    updated = [...list];
    updated[existing] = obs;
  } else {
    updated = [obs, ...list];
  }
  try {
    localStorage.setItem(OBSERVATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save observation:", err);
  }
  return updated;
}

export function getTeachingReminders(): TeachingReminder[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(SEED_REMINDERS));
      return SEED_REMINDERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_REMINDERS;
  }
}

export function toggleReminderComplete(id: string): TeachingReminder[] {
  const list = getTeachingReminders();
  const updated = list.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to toggle reminder:", err);
  }
  return updated;
}
