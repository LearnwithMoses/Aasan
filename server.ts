import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlan, LessonPlanRequest } from "./src/types.ts";

dotenv.config();

const PORT = 3000;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in the Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();

  // Permissive CORS middleware so external PWA auditors (PWABuilder, Lighthouse) can probe manifest and icons
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      model: "gemini-flash-latest",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Generate Lesson Plan endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const data: Partial<LessonPlanRequest> = req.body || {};

      const curriculum = data.curriculum || "CBSE / NCERT";
      const grade = data.grade || "Class 8";
      const subject = data.subject || "General Science";
      const topic = data.topic || "Introduction to the Topic";
      const duration = Number(data.duration) || 40;
      const classStrength = data.classStrength || "35-40";
      const lessonModel = data.lessonModel || "5E";
      const objectives = data.objectives || "";
      const priorKnowledge = data.priorKnowledge || "";
      const language = data.language || "English";
      const resources = data.resources || "Blackboard, Textbook, Chart/Handouts";
      const differentiation = data.differentiation || "Mixed ability";
      const specialRequirements = data.specialRequirements || "None";

      // If GEMINI_API_KEY is not set, provide a rich, pedagogically realistic fallback plan
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is not set. Providing pedagogical template plan.");
        const fallbackPlan: LessonPlan = createTemplatePlan(data, duration);
        res.json({ plan: fallbackPlan, notice: "Generated using pedagogical blueprint (GEMINI_API_KEY not set)." });
        return;
      }

      const ai = getGeminiClient();

      const prompt = `
Create a comprehensive, highly practical, and rigorous lesson plan for a school teacher.

Class & Curriculum Context:
- Curriculum: ${curriculum}
- Grade / Level: ${grade}
- Subject: ${subject}
- Topic / Chapter: ${topic}
- Duration: ${duration} minutes
- Class Strength: ${classStrength} students
- Instructional Model: ${lessonModel}
- Stated Learning Objectives: ${objectives || "Derive specific, measurable Bloom's taxonomy objectives"}
- Prior Knowledge: ${priorKnowledge || "Standard prerequisite concepts for this grade level"}
- Instruction Language: ${language}
- Available Teaching Aids / Resources: ${resources}
- Student Differentiation Needs: ${differentiation}
- Special Context / Requirements: ${specialRequirements}

Instructions:
1. Ensure the lesson stages in "lesson_flow" exactly follow the selected Instructional Model (${lessonModel}). For example:
   - If 5E: Engage, Explore, Explain, Elaborate, Evaluate.
   - If Gradual Release: Hook/Review, I Do (Direct instruction & modeling), We Do (Guided collaborative practice), You Do (Independent work), Wrap-up.
   - If Inquiry-Based: Question Formulation, Investigation / Data Gathering, Analysis, Conclusion / Sharing.
   - If Direct Instruction: Objective & Anticipatory Set, Input & Modeling, Guided Practice, Independent Practice, Closure.
2. The minutes in "lesson_flow" MUST add up to exactly ${duration} minutes.
3. Every stage must specify clear, actionable "teacher_actions", active "student_actions", and a quick "assessment_check".
4. Provide concrete, differentiated strategies for: Support (struggling students), Core (grade-level target), and Extension (fast-finishers/gifted).
5. Highlight 3-5 real common student misconceptions and how to remedy them during the lesson.
6. Provide specific, practical Teacher Notes and post-lesson Reflection questions.
7. Age-Appropriate Pedagogy:
   - For Foundational / Pre-Primary (Nursery, LKG, UKG): Employ play-based, hands-on, multi-sensory, storytelling, phonics, and concrete manipulative strategies (aligned with early childhood care & NEP foundational stage). Keep teacher actions warm and student actions active.
   - For Primary (Classes 1-5): Focus on concrete-to-representational learning, guided exploration, and interactive vocabulary/concept development.
   - For Middle & Secondary (Classes 6-10): Focus on conceptual inquiry, structured problem-solving, and formative diagnostic checks.
   - For Senior Secondary (Classes 11-12): Emphasize rigorous analytical reasoning, board exam marking criteria, derivations, numerical calculations, and higher-order thinking (HOTS).
8. Language Subject Pedagogy:
   - If the subject is an Indian or classical language subject (such as Tamil, Kannada, Hindi, Malayalam, Telugu, Sanskrit, Bengali, Marathi, Urdu, etc.), structure the lesson flow for authentic language pedagogy:
     * Focus on language skills: LSRW (Listening, Speaking, Reading, Writing).
     * For Grammar (இலக்கணம் / ವ್ಯಾಕರಣ / व्याकरण / വ്യാകരണം / వ్యాకరణం): present explicit grammatical rules, sandhi formulas, parts of speech, and illustrative native sentences.
     * For Poetry (செய்யுள் / ಪದ್ಯ / पद्य / കവിത / పద్యం): include correct reciting rhythm, poetic devices (alankara, thodai, chandas), word-by-word meaning, and moral takeaway (e.g. Thirukkural, Vachana, Dohas).
     * For Prose (உரைநடை / ಗದ್ಯ / गद्य / ഗദ്യം / గద్యം): model expressive reading, vocabulary building, comprehension questions, and student writing.
     * Render the outputs directly in the authentic native script (Tamil script, Kannada script, Devanagari for Hindi/Sanskrit, Malayalam script, Telugu script, etc.).
`;

      let responseText: string | undefined;
      let lastError: unknown;
      let usedModel: string = "gemini-flash-latest";

      // Candidates: try primary recommended flash aliases
      const candidateModels = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction:
                "You are an expert master teacher and curriculum specialist. You generate highly practical, structured lesson plans in valid JSON format with thorough pedagogical clarity, realistic time management, active student engagement, and actionable differentiation.",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Engaging and clear lesson title",
                  },
                  learning_objectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Specific, measurable Bloom's taxonomy objectives (Students will be able to...)",
                  },
                  success_criteria: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "I can statements demonstrating mastery",
                  },
                  prior_knowledge: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Essential prerequisites needed for this lesson",
                  },
                  materials: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Equipment, handouts, teaching aids, and digital tools",
                  },
                  key_explanation: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key concepts, core definitions, and anchor explanations",
                  },
                  lesson_flow: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stage: { type: Type.STRING },
                        minutes: { type: Type.NUMBER },
                        teacher_actions: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        student_actions: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        assessment_check: { type: Type.STRING },
                      },
                      required: [
                        "stage",
                        "minutes",
                        "teacher_actions",
                        "student_actions",
                        "assessment_check",
                      ],
                    },
                  },
                  differentiation: {
                    type: Type.OBJECT,
                    properties: {
                      support: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      core: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      extension: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["support", "core", "extension"],
                  },
                  assessment: {
                    type: Type.OBJECT,
                    properties: {
                      formative: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      exit_ticket: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      homework: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["formative", "exit_ticket", "homework"],
                  },
                  common_misconceptions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  teacher_notes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  reflection: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "title",
                  "learning_objectives",
                  "success_criteria",
                  "prior_knowledge",
                  "materials",
                  "key_explanation",
                  "lesson_flow",
                  "differentiation",
                  "assessment",
                  "common_misconceptions",
                  "teacher_notes",
                  "reflection",
                ],
              },
            },
          });

          responseText = response.text?.trim();
          if (responseText) {
            usedModel = modelName;
            break;
          }
        } catch (callErr: any) {
          lastError = callErr;
          // Continue to next available model without breaking
        }
      }

      if (responseText) {
        const plan: LessonPlan = JSON.parse(responseText);
        plan.aiEngineUsed = data.aiEngine === "chatgpt" ? "Aasaan Master Engine" : "Aasaan Core Engine";
        res.json({ plan, model: usedModel, engine: plan.aiEngineUsed });
        return;
      }

      // If all candidate models encountered transient issues, use pedagogical template
      const fallbackPlan: LessonPlan = createTemplatePlan(data, duration);
      fallbackPlan.aiEngineUsed = data.aiEngine === "chatgpt" ? "Aasaan Master Engine" : "Aasaan Core Engine";
      res.json({
        plan: fallbackPlan,
        notice: "Generated using structured pedagogical template.",
      });
    } catch (err: unknown) {
      console.error("Error generating lesson plan:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate lesson plan";
      res.status(500).json({ error: errorMessage, details: errorMessage });
    }
  });

  // Register 1-Month Free Trial Endpoint
  app.post("/api/register-trial", (req, res) => {
    try {
      const { name, school, phone, bloodGroup, address } = req.body || {};
      if (!name || !phone) {
        res.status(400).json({ error: "Name and phone number are required." });
        return;
      }

      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(now.getDate() + 30);

      // Successfully processed registration
      res.json({
        success: true,
        message: "Congratulations! Your 1-Month Free Teacher Pro pass has been activated.",
        registeredAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        teacher: { name, school, phone, bloodGroup, address },
      });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to register free trial." });
    }
  });

  // Generate Student Worksheet & Exit Slip Endpoint (Pro Facility)
  app.post("/api/generate-worksheet", async (req, res) => {
    try {
      const { plan, formData, schoolName } = req.body || {};
      const topic = formData?.topic || plan?.title || "Classroom Activity";
      const grade = formData?.grade || "Class";
      const subject = formData?.subject || "Subject";
      const curriculum = formData?.curriculum || "General";
      const school = schoolName || "Model Higher Secondary School";

      if (!process.env.GEMINI_API_KEY) {
        // Dynamic template worksheet
        res.json({
          worksheet: createFallbackWorksheet(topic, grade, subject, school),
        });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `
Generate a ready-to-print 1-page classroom Student Worksheet and Exit Ticket based on this lesson:
Topic: ${topic}
Grade: ${grade}
Subject: ${subject}
Board: ${curriculum}
School Name: ${school}
Key Objectives: ${(plan?.learning_objectives || []).join(", ")}
Key Explanation: ${(plan?.key_explanation || []).join(", ")}

Generate in strict JSON format:
- "title": Clean worksheet title
- "schoolName": "${school}"
- "grade": "${grade}"
- "subject": "${subject}"
- "topic": "${topic}"
- "timeAllowed": "15-20 Minutes"
- "totalMarks": 20
- "instructions": 2-3 brief student directions
- "questions": array of 5 graded questions (mix of multiple choice, fill in the blanks, and problem solving/short answer)
- "exitSlipQuestion": 1 reflective question for student to answer before bell rings
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                schoolName: { type: Type.STRING },
                grade: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                timeAllowed: { type: Type.STRING },
                totalMarks: { type: Type.NUMBER },
                instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      type: { type: Type.STRING },
                      marks: { type: Type.NUMBER },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["id", "question", "type", "marks"],
                  },
                },
                exitSlipQuestion: { type: Type.STRING },
              },
              required: ["title", "schoolName", "grade", "subject", "topic", "timeAllowed", "totalMarks", "instructions", "questions", "exitSlipQuestion"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json({ worksheet: parsed });
          return;
        }
      } catch (genErr) {
        // Fallback gracefully
      }

      res.json({
        worksheet: createFallbackWorksheet(topic, grade, subject, school),
      });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to generate worksheet." });
    }
  });

  // Generate Blackboard / Smartboard Organizer (Pro Facility)
  app.post("/api/generate-blackboard", async (req, res) => {
    try {
      const { plan, formData } = req.body || {};
      const topic = formData?.topic || plan?.title || "Topic Discussion";
      const grade = formData?.grade || "Class";
      const subject = formData?.subject || "Subject";

      if (!process.env.GEMINI_API_KEY) {
        res.json({ blackboard: createFallbackBlackboard(topic, grade, subject) });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `
Create an authentic 3-Column School Blackboard / Chalkboard Plan for a teacher to write on the blackboard during class:
Topic: ${topic}
Grade: ${grade}
Subject: ${subject}
Objectives: ${(plan?.learning_objectives || []).join(", ")}
Core concepts: ${(plan?.key_explanation || []).join(", ")}

Generate in JSON:
- "topicHeading": Main chalkboard bold heading
- "leftPanel": { "title": "Date, Grade, Prerequisite Vocabulary", "items": 4-5 items (Date, Class, Subject, Key Vocab words) }
- "centerPanel": { "title": "Core Concept & Diagram / Derivation", "mainDiagramOrConcept": "Description of the visual diagram or anchor layout", "stepDerivation": 3-5 sequential mathematical/scientific bullet steps, "coreRules": 2 essential golden rules }
- "rightPanel": { "title": "Practice Questions, Summary & Homework", "studentTasks": 2 quick classroom board problems, "summaryPoints": 3 takeaway bullets, "homeworkAssignment": "Clear homework problem" }
- "teacherBoardTips": 2 practical tips on chalk colors, spacing, and board zoning
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                topicHeading: { type: Type.STRING },
                leftPanel: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    items: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["title", "items"],
                },
                centerPanel: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    mainDiagramOrConcept: { type: Type.STRING },
                    stepDerivation: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coreRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["title", "mainDiagramOrConcept", "stepDerivation", "coreRules"],
                },
                rightPanel: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    studentTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    summaryPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    homeworkAssignment: { type: Type.STRING },
                  },
                  required: ["title", "studentTasks", "summaryPoints", "homeworkAssignment"],
                },
                teacherBoardTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["topicHeading", "leftPanel", "centerPanel", "rightPanel", "teacherBoardTips"],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json({ blackboard: parsed });
          return;
        }
      } catch (bErr) {
        // Fallback
      }

      res.json({ blackboard: createFallbackBlackboard(topic, grade, subject) });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to generate blackboard plan." });
    }
  });

  // Generate Easy Teacher Explanation Script & Analogy (Pro Facility)
  app.post("/api/generate-script", async (req, res) => {
    try {
      const { plan, formData } = req.body || {};
      const topic = formData?.topic || plan?.title || "Classroom Concept";
      const grade = formData?.grade || "Class";
      const subject = formData?.subject || "Subject";
      const language = formData?.language || "English";
      const objectives = (plan?.learning_objectives || []).join("; ");
      const misconceptions = (plan?.common_misconceptions || []).join("; ");

      if (!process.env.GEMINI_API_KEY) {
        res.json({ script: createFallbackScript(topic, grade, subject, language) });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `
You are a master educator training a school teacher who struggles to explain complex concepts easily to their class.
Provide a complete, spoken-dialogue "Classroom Explanation Script" that breaks down this topic effortlessly:

Topic: ${topic}
Grade: ${grade}
Subject: ${subject}
Language: ${language}
Objectives: ${objectives}
Common Misconceptions: ${misconceptions}

Requirements:
1. "hookAnalogy": An intuitive, relatable real-life Indian analogy (e.g. kitchen cooking, cricket match, sharing sweets, market weighing scale, bus ride, daily routine) that makes the concept click instantly.
2. "classroomSpeakingScript": 4 sequential phases of verbatim, word-for-word teacher speaking lines.
   - For each phase, provide:
     * "phase": e.g. "Step 1: The Hook (2 mins)", "Step 2: Connecting Analogy to Core Concept", "Step 3: Step-by-Step Problem Solving", "Step 4: Checking for Understanding"
     * "teacherSays": Exact conversational speaking lines the teacher should say to the students. (If language is an Indian language like Tamil, Telugu, Kannada, Malayalam, Hindi, etc., write this in that language using its native script or natural bilingual teacher dialogue so the teacher can literally speak it in class!).
     * "actionOrGesture": Practical body language, board gesture, or physical action to accompany the words.
     * "expectedStudentReaction": What the students will say or do in response.
3. "eli5SimplifiedBackup":
   - "simpleExplanation": An ultra-simplified, 2-sentence explanation for when a struggling student says "Teacher, I still don't understand!".
   - "concreteExample": A 1-line everyday example to make it obvious.
4. "checkingQuestions": Array of 3 quick questions the teacher can ask to verify real conceptual understanding (not rote memory), with "whatToLookFor" diagnostic answers.
5. "quickDosAndDonts":
   - "dos": 3 practical classroom tips for this lesson.
   - "donts": 3 common traps or confusing textbook jargon to avoid saying.
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                grade: { type: Type.STRING },
                subject: { type: Type.STRING },
                language: { type: Type.STRING },
                hookAnalogy: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    storyOrMetaphor: { type: Type.STRING },
                    whyItWorks: { type: Type.STRING },
                  },
                  required: ["title", "storyOrMetaphor", "whyItWorks"],
                },
                classroomSpeakingScript: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      teacherSays: { type: Type.STRING },
                      actionOrGesture: { type: Type.STRING },
                      expectedStudentReaction: { type: Type.STRING },
                    },
                    required: ["phase", "teacherSays", "actionOrGesture", "expectedStudentReaction"],
                  },
                },
                eli5SimplifiedBackup: {
                  type: Type.OBJECT,
                  properties: {
                    simpleExplanation: { type: Type.STRING },
                    concreteExample: { type: Type.STRING },
                  },
                  required: ["simpleExplanation", "concreteExample"],
                },
                checkingQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      whatToLookFor: { type: Type.STRING },
                    },
                    required: ["question", "whatToLookFor"],
                  },
                },
                quickDosAndDonts: {
                  type: Type.OBJECT,
                  properties: {
                    dos: { type: Type.ARRAY, items: { type: Type.STRING } },
                    donts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["dos", "donts"],
                },
              },
              required: [
                "topic",
                "grade",
                "subject",
                "language",
                "hookAnalogy",
                "classroomSpeakingScript",
                "eli5SimplifiedBackup",
                "checkingQuestions",
                "quickDosAndDonts",
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          res.json({ script: parsed });
          return;
        }
      } catch (sErr) {
        // Fallback below
      }

      res.json({ script: createFallbackScript(topic, grade, subject, language) });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to generate explanation script." });
    }
  });

  // Generate Question Paper endpoint (PRO Facility)
  app.post("/api/generate-question-paper", async (req, res) => {
    try {
      const { plan, formData, schoolName = "School Examination Board", examType = "slip_test_20", difficulty = "Standard Board Level", includePastBoardQuestions = true } = req.body || {};

      const topic = formData?.topic || plan?.title || "Curriculum Chapter Examination";
      const grade = formData?.grade || "Class 10";
      const subject = formData?.subject || "Core Subject";
      const curriculum = formData?.curriculum || "CBSE / State Board";
      const language = formData?.language || "English";
      const objectives = (plan?.learning_objectives || []).join("; ");

      // Target marks & time based on examType
      let targetMarks = 20;
      let durationMins = 40;
      let examTypeName = "Slip Test / Class Assessment (20 Marks)";
      if (examType === "unit_test_40") {
        targetMarks = 40;
        durationMins = 90;
        examTypeName = "Periodic Assessment / Unit Test (40 Marks)";
      } else if (examType === "term_exam_50") {
        targetMarks = 50;
        durationMins = 120;
        examTypeName = "Mid-Term / Half-Yearly Exam (50 Marks)";
      } else if (examType === "board_model_80") {
        targetMarks = 80;
        durationMins = 180;
        examTypeName = "Annual / Board Model Examination (80 Marks)";
      }

      if (!process.env.GEMINI_API_KEY) {
        res.json({
          paper: createFallbackQuestionPaper(topic, grade, subject, curriculum, language, schoolName, examType, targetMarks, durationMins, examTypeName),
        });
        return;
      }

      const ai = getGeminiClient();
      const prompt = `
You are an expert Chief Board Exam Paper Setter and Evaluator for Indian Boards (CBSE, Tamil Nadu State Board, Karnataka State Board, Kerala SCERT, ICSE).
Generate a complete, high-quality, authentic Indian Examination Question Paper with Teacher's Answer Key and Blueprint.

Topic / Chapter: ${topic}
Grade: ${grade}
Subject: ${subject}
Curriculum: ${curriculum}
Instruction Medium / Language: ${language}
Target Total Marks: ${targetMarks} Marks
Duration: ${durationMins} Minutes
Exam Format: ${examTypeName}
Difficulty Focus: ${difficulty}
Prioritize Past Board Questions: ${includePastBoardQuestions ? "YES (Tag high-yield repeated questions with past exam years)" : "NO"}
Key Chapter Objectives: ${objectives}

Specific Guidelines:
1. Authentic Sections:
   - For STEM & Humanities (Maths, Science, Social, Commerce):
     * Section A: Objective / Multiple Choice Questions (1 Mark each)
     * Section B: Very Short Answer (2 Marks each)
     * Section C: Short Answer (3 Marks each)
     * Section D: Long Answer / Derivation / Problem with internal choice "OR" (4 or 5 Marks)
     * Section E (if 40 or 80 marks): Case Study / Assertion-Reason / Competency-based (4 or 5 Marks)
   - For Language Subjects (Tamil, Kannada, Hindi, Malayalam, Telugu, Sanskrit, etc.):
     * Use authentic native section headings (e.g. Tamil: பகுதி-அ: சரியான விடையைத் தேர்வு செய்க, பகுதி-ஆ: குறுவினா, பகுதி-இ: சிறுவினா, பகுதி-ஈ: நெடுவினா/கட்டுரை).
     * Render the questions and answers in that native script!
2. Answer Key & Step Marking:
   - Provide a complete answer key for each question.
   - For numericals / derivations / grammar, break down step marking (e.g. "Formula: 1 Mark", "Step working: 1.5 Marks", "Final answer: 0.5 Mark").
3. NEP 2020 Cognitive Blueprint:
   - Allocate marks across Remembering, Understanding, Applying, and HOTS/Analyzing that total exactly ${targetMarks} marks.
4. Board Exam Tips:
   - "highScorerKeywords": 3-4 specific scientific, technical, or grammatical terms evaluators look for to award full marks.
   - "commonStudentMistakes": 2-3 traps where students lose 1/2 or 1 mark in board exams.
   - "examinerMarkingAdvice": Practical tip on presentation, underlining, and time management.
`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                schoolName: { type: Type.STRING },
                examTypeName: { type: Type.STRING },
                curriculum: { type: Type.STRING },
                grade: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                language: { type: Type.STRING },
                durationMinutes: { type: Type.INTEGER },
                totalMarks: { type: Type.INTEGER },
                generalInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sectionName: { type: Type.STRING },
                      description: { type: Type.STRING },
                      marksPerQuestion: { type: Type.INTEGER },
                      totalMarks: { type: Type.INTEGER },
                      questions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            qNumber: { type: Type.STRING },
                            questionText: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            internalChoice: { type: Type.STRING },
                            marks: { type: Type.INTEGER },
                            cognitiveDomain: { type: Type.STRING },
                            isPastBoardQuestion: { type: Type.BOOLEAN },
                            pastBoardYears: { type: Type.STRING },
                            answerKey: { type: Type.STRING },
                            stepMarking: { type: Type.ARRAY, items: { type: Type.STRING } },
                          },
                          required: ["qNumber", "questionText", "marks", "cognitiveDomain", "answerKey"],
                        },
                      },
                    },
                    required: ["sectionName", "marksPerQuestion", "totalMarks", "questions"],
                  },
                },
                blueprint: {
                  type: Type.OBJECT,
                  properties: {
                    rememberingMarks: { type: Type.INTEGER },
                    understandingMarks: { type: Type.INTEGER },
                    applyingMarks: { type: Type.INTEGER },
                    analyzingHotsMarks: { type: Type.INTEGER },
                    totalMarks: { type: Type.INTEGER },
                  },
                  required: ["rememberingMarks", "understandingMarks", "applyingMarks", "analyzingHotsMarks", "totalMarks"],
                },
                boardExamTips: {
                  type: Type.OBJECT,
                  properties: {
                    highScorerKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    commonStudentMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    examinerMarkingAdvice: { type: Type.STRING },
                  },
                  required: ["highScorerKeywords", "commonStudentMistakes", "examinerMarkingAdvice"],
                },
              },
              required: [
                "title",
                "schoolName",
                "examTypeName",
                "curriculum",
                "grade",
                "subject",
                "topic",
                "language",
                "durationMinutes",
                "totalMarks",
                "generalInstructions",
                "sections",
                "blueprint",
                "boardExamTips",
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          parsed.id = parsed.id || `qp_${Date.now()}`;
          res.json({ paper: parsed });
          return;
        }
      } catch (qpErr) {
        // Fallback
      }

      res.json({
        paper: createFallbackQuestionPaper(topic, grade, subject, curriculum, language, schoolName, examType, targetMarks, durationMins, examTypeName),
      });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to generate question paper." });
    }
  });

  // Generate Internal Assessment Rubric endpoint (CBSE / State Board 20-Mark Scheme)
  app.post("/api/generate-rubric", async (req, res) => {
    try {
      const {
        plan,
        formData,
        componentType = "subject_enrichment_lab",
      } = req.body || {};

      const topic = formData?.topic || plan?.title || "Core Curriculum Topic";
      const grade = formData?.grade || "Class 10";
      const subject = formData?.subject || "Science";
      const curriculum = formData?.curriculum || "CBSE / NCERT";

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getGeminiClient();
          const prompt = `You are a Senior CBSE Examination Controller and Head Examiner.
Create an authentic 4-Level Internal Assessment & Practical Scoring Rubric for:
Topic / Chapter: ${topic}
Grade: ${grade}
Subject: ${subject}
Curriculum: ${curriculum}
Internal Assessment Component Type: ${componentType} (Options: subject_enrichment_lab, portfolio_notebook, periodic_assessment, asl_oral_listening, project_work).

The rubric must strictly follow CBSE Continuous & Comprehensive Evaluation (CCE) / NEP 2020 guidelines.
Provide:
1. componentTitle (e.g. "Subject Enrichment & Laboratory Practical Assessment (5 Marks)")
2. maxMarks: usually 5 marks per CBSE component (total 20 marks across components).
3. 4 to 5 distinct evaluation criteria with exact marks per criterion totaling maxMarks.
For EACH criterion, write concrete, observable performance descriptors for:
- Exemplary (90-100%): Flawless theoretical and practical mastery, independent initiative.
- Proficient (75-89%): Clear conceptual grasp with minor prompts, standard procedural accuracy.
- Developing (50-74%): Basic factual awareness, requires step-by-step guidance.
- Beginning (<50%): Significant gaps, lacks basic execution or understanding.
4. 3 suggested authentic classroom activities or lab experiments.
5. 4 teacher observation checklist points for the practical logbook / portfolio record.
6. cbseGuidelinesNote explaining regulatory compliance.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              temperature: 0.3,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  grade: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  chapter: { type: Type.STRING },
                  curriculum: { type: Type.STRING },
                  componentType: { type: Type.STRING },
                  componentTitle: { type: Type.STRING },
                  maxMarks: { type: Type.INTEGER },
                  criteria: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        criterionName: { type: Type.STRING },
                        marksAllocated: { type: Type.NUMBER },
                        exemplary: { type: Type.STRING },
                        proficient: { type: Type.STRING },
                        developing: { type: Type.STRING },
                        beginning: { type: Type.STRING },
                      },
                      required: [
                        "criterionName",
                        "marksAllocated",
                        "exemplary",
                        "proficient",
                        "developing",
                        "beginning",
                      ],
                    },
                  },
                  suggestedActivities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  teacherObservationChecklist: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  cbseGuidelinesNote: { type: Type.STRING },
                },
                required: [
                  "grade",
                  "subject",
                  "chapter",
                  "curriculum",
                  "componentType",
                  "componentTitle",
                  "maxMarks",
                  "criteria",
                  "suggestedActivities",
                  "teacherObservationChecklist",
                  "cbseGuidelinesNote",
                ],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            parsed.id = parsed.id || `rubric_${Date.now()}`;
            res.json({ rubric: parsed });
            return;
          }
        } catch (rErr) {
          // Fallback below
        }
      }

      res.json({
        rubric: createFallbackRubric(topic, grade, subject, curriculum, componentType),
      });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to generate assessment rubric." });
    }
  });

  // Generate Annual & Term-Wise Syllabus Distribution Planner
  app.post("/api/generate-syllabus-plan", async (req, res) => {
    try {
      const {
        formData,
        academicYear = "2025-2026",
      } = req.body || {};

      const grade = formData?.grade || "Class 10";
      const subject = formData?.subject || "Science";
      const curriculum = formData?.curriculum || "CBSE / NCERT";

      if (process.env.GEMINI_API_KEY) {
        try {
          const ai = getGeminiClient();
          const prompt = `You are an Academic Director and Curriculum Specialist for Indian Schools (${curriculum}).
Create a comprehensive 30-Week Annual & Term-Wise Syllabus Distribution Plan for:
Grade: ${grade}
Subject: ${subject}
Curriculum: ${curriculum}
Academic Session: ${academicYear}

Structure must include:
- Total instructional periods (~180-210 periods) broken down into Theory Teaching and Revision & Pre-Board Buffer periods.
- Term 1 (40 Marks theory) and Term 2 (40 Marks theory) weightage + 20 Marks Internal Assessment.
- 6 to 8 curriculum units distributed month-by-month (June to February).
- For each unit: unitNumber, unitTitle, array of chapters, term ("Term 1" | "Term 2"), scheduledMonth, suggestedPeriods, theoryMarks, practicalOrInternalMarks, assessmentType (e.g. Periodic Test 1, Half-Yearly, Slip-Test), and 3 keyCompetencies.
- 5 to 6 scheduled exam milestones (PT-1, Half-Yearly, PT-2, Pre-Board 1, Pre-Board 2, Annual Board Exam).
- 4 practical pedagogical guidelines for the subject teacher.`;

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              temperature: 0.3,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  academicYear: { type: Type.STRING },
                  grade: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  curriculum: { type: Type.STRING },
                  totalInstructionalPeriods: { type: Type.INTEGER },
                  theoryPeriods: { type: Type.INTEGER },
                  revisionAndBufferPeriods: { type: Type.INTEGER },
                  term1WeightageMarks: { type: Type.INTEGER },
                  term2WeightageMarks: { type: Type.INTEGER },
                  internalAssessmentTotalMarks: { type: Type.INTEGER },
                  units: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        unitNumber: { type: Type.INTEGER },
                        unitTitle: { type: Type.STRING },
                        chapters: { type: Type.ARRAY, items: { type: Type.STRING } },
                        term: { type: Type.STRING },
                        scheduledMonth: { type: Type.STRING },
                        suggestedPeriods: { type: Type.INTEGER },
                        theoryMarks: { type: Type.INTEGER },
                        practicalOrInternalMarks: { type: Type.INTEGER },
                        assessmentType: { type: Type.STRING },
                        keyCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: [
                        "unitNumber",
                        "unitTitle",
                        "chapters",
                        "term",
                        "scheduledMonth",
                        "suggestedPeriods",
                        "theoryMarks",
                        "practicalOrInternalMarks",
                        "assessmentType",
                        "keyCompetencies",
                      ],
                    },
                  },
                  examMilestones: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        examName: { type: Type.STRING },
                        month: { type: Type.STRING },
                        portionCovered: { type: Type.STRING },
                        weightage: { type: Type.STRING },
                      },
                      required: ["examName", "month", "portionCovered", "weightage"],
                    },
                  },
                  pedagogicalGuidelines: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  "academicYear",
                  "grade",
                  "subject",
                  "curriculum",
                  "totalInstructionalPeriods",
                  "theoryPeriods",
                  "revisionAndBufferPeriods",
                  "term1WeightageMarks",
                  "term2WeightageMarks",
                  "internalAssessmentTotalMarks",
                  "units",
                  "examMilestones",
                  "pedagogicalGuidelines",
                ],
              },
            },
          });

          if (response.text) {
            const parsed = JSON.parse(response.text);
            res.json({ planner: parsed });
            return;
          }
        } catch (sErr) {
          // Fallback below
        }
      }

      res.json({
        planner: createFallbackSyllabusPlanner(grade, subject, curriculum, academicYear),
      });
    } catch (err: unknown) {
      res.status(500).json({ error: "Failed to generate syllabus plan." });
    }
  });

  // Explicit route for Android Digital Asset Links (Trusted Web Activity / TWA)
  app.get("/.well-known/assetlinks.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(path.join(process.cwd(), "public/.well-known/assetlinks.json"));
  });

  // Explicit route for Web App Manifest (supporting both /manifest.webmanifest and /manifest.json for PWABuilder)
  app.get(["/manifest.webmanifest", "/manifest.json"], (_req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    const manifestPath = path.join(process.cwd(), "public/manifest.json");
    res.sendFile(manifestPath);
  });

  // Development vs Production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aasaan Master Pedagogy Suite server listening on http://0.0.0.0:${PORT}`);
  });
}

function createTemplatePlan(data: Partial<LessonPlanRequest>, duration: number): LessonPlan {
  const topic = data.topic || "Key Concepts & Problem Solving";
  const subject = data.subject || "Subject Study";
  const grade = data.grade || "Middle School";
  const model = data.lessonModel || "5E";

  const stages: { stage: string; minutes: number; teacher: string[]; student: string[]; check: string }[] = [];
  if (model === "5E") {
    const m1 = Math.round(duration * 0.15);
    const m2 = Math.round(duration * 0.3);
    const m3 = Math.round(duration * 0.25);
    const m4 = Math.round(duration * 0.2);
    const m5 = duration - (m1 + m2 + m3 + m4);

    stages.push(
      {
        stage: "Engage",
        minutes: m1,
        teacher: [
          `Pose an intriguing real-world starter question related to ${topic}.`,
          "Display visual stimulus on the board and elicit initial student conjectures.",
          "Write key student vocabulary on the anchor chart.",
        ],
        student: [
          "Participate in think-pair-share around the introductory prompt.",
          "Note initial observations and share prior encounters with the concept.",
        ],
        check: "Quick thumbs up/down and random call to gauge baseline readiness.",
      },
      {
        stage: "Explore",
        minutes: m2,
        teacher: [
          "Distribute guided inquiry activity sheets and assign peer roles.",
          "Circulate among groups, asking probing questions rather than giving immediate answers.",
          "Identify pairs with varied solution pathways to highlight later.",
        ],
        student: [
          "Collaborate in pairs/trios to test scenarios and manipulate examples.",
          "Record observations, patterns, and anomalies in their notebooks.",
        ],
        check: "Observation of group discussions using a formative checklist.",
      },
      {
        stage: "Explain",
        minutes: m3,
        teacher: [
          "Facilitate a student-led debrief using selected work samples.",
          "Formally introduce formal academic terminology and core principles.",
          "Model standard notation and address emerging misconceptions explicitly.",
        ],
        student: [
          "Present findings to the class and justify their reasoning.",
          "Record synthesized definitions and standard steps into study notes.",
        ],
        check: "Cold-call questioning and mini-whiteboard check on core definitions.",
      },
      {
        stage: "Elaborate",
        minutes: m4,
        teacher: [
          "Present a non-routine transfer problem with a subtle twist.",
          "Provide tiered scaffolding prompts for differentiated support.",
        ],
        student: [
          "Apply the newly learned concept to solve the transfer challenge.",
          "Compare methods with a peer and articulate trade-offs.",
        ],
        check: "Peer assessment rubric and targeted teacher check-ins.",
      },
      {
        stage: "Evaluate",
        minutes: m5,
        teacher: [
          "Administer a 3-question exit ticket targeting core mastery.",
          "Summarize the key takeaway and preview tomorrow's extension.",
        ],
        student: [
          "Complete the individual exit ticket silently.",
          "Perform self-rating against the lesson success criteria.",
        ],
        check: "Collection of individual exit tickets for post-lesson diagnosis.",
      }
    );
  } else {
    // Gradual Release / Direct Instruction
    const m1 = Math.round(duration * 0.15);
    const m2 = Math.round(duration * 0.3);
    const m3 = Math.round(duration * 0.3);
    const m4 = duration - (m1 + m2 + m3);

    stages.push(
      {
        stage: "Hook & Direct Modeling (I Do)",
        minutes: m1 + m2,
        teacher: [
          `Hook students with a compelling scenario highlighting ${topic}.`,
          "Explicitly model step-by-step problem solving on the board with think-aloud narration.",
          "Highlight common pitfalls and annotate key steps visually.",
        ],
        student: [
          "Actively listen and take structured dual-column Cornell notes.",
          "Identify and repeat back the crucial procedural steps.",
        ],
        check: "Choral responses and quick targeted concept checks.",
      },
      {
        stage: "Guided Collaborative Practice (We Do)",
        minutes: m3,
        teacher: [
          "Guide the class through a second scaffolded problem together.",
          "Prompt students to dictate each step before executing it.",
          "Address partial errors constructively in real time.",
        ],
        student: [
          "Work through the problem with a desk partner.",
          "Display answers simultaneously on mini-whiteboards.",
        ],
        check: "100% participation whiteboard check and targeted spot-checking.",
      },
      {
        stage: "Independent Application & Closure (You Do)",
        minutes: m4,
        teacher: [
          "Release students to tackle independent practice sets.",
          "Pull a small group of 4-5 students for intensive reteaching.",
          "Wrap up with synthesis and exit verification.",
        ],
        student: [
          "Complete independent assignment problems with increasing difficulty.",
          "Submit exit ticket upon completion.",
        ],
        check: "Analysis of exit ticket accuracy against success criteria.",
      }
    );
  }

  return {
    title: `${topic} - Comprehensive Lesson Plan (${grade} ${subject})`,
    learning_objectives: [
      `Define and explain the fundamental concepts of ${topic} accurately in their own words.`,
      `Apply step-by-step problem-solving methods to solve standard and non-routine problems related to ${topic}.`,
      `Critically evaluate sample solutions, identifying errors and justifying correct methodology.`,
    ],
    success_criteria: [
      `I can state the core definition and key formula/rule for ${topic}.`,
      `I can solve at least 3 practice problems independently with correct steps.`,
      `I can explain to a partner why a common incorrect approach fails.`,
    ],
    prior_knowledge: [
      `Prerequisite foundational terminology and arithmetic/algebraic manipulation.`,
      `Basic understanding of preceding unit concepts in ${subject}.`,
    ],
    materials: [
      "Whiteboard / Blackboard and multi-color markers",
      "Student notebooks and printed guided inquiry worksheets",
      "Mini-whiteboards with dry-erase markers for active participation",
      data.resources || "Textbook and reference charts",
    ],
    key_explanation: [
      `Core Principle: ${topic} relies on clear systematic reasoning and balanced operations.`,
      "Anchor Model: Always identify the known quantities, unknown variables, and operative constraints before computing.",
      "Verification Step: Always substitute or check the obtained solution back into the original condition.",
    ],
    lesson_flow: stages.map((s) => ({
      stage: s.stage,
      minutes: s.minutes,
      teacher_actions: s.teacher,
      student_actions: s.student,
      assessment_check: s.check,
    })),
    differentiation: {
      support: [
        "Provide step-by-step worked example reference cards with color-coded cues.",
        "Pair with a supportive peer mentor during guided practice.",
        "Reduce computation complexity while retaining the conceptual reasoning step.",
      ],
      core: [
        "Complete the standard problem set within the allocated timeframe.",
        "Explain solution rationale in written sentences in notebook.",
      ],
      extension: [
        "Solve open-ended challenge problems requiring multi-step synthesis.",
        "Create their own word problems with solutions and answer keys.",
      ],
    },
    assessment: {
      formative: [
        "Continuous circulation during pair work with an observational rubric.",
        "Mini-whiteboard cold checks requiring instant student response.",
        "Targeted questioning focusing on 'why' rather than just 'what'.",
      ],
      exit_ticket: [
        `Question 1: Define the primary rule of ${topic} in one sentence.`,
        `Question 2: Solve one core problem showing all necessary working steps.`,
        `Question 3: Identify the error in a deliberate faulty solution example.`,
      ],
      homework: [
        "Complete textbook review exercises (odd-numbered questions 1-9).",
        "Write a 3-sentence summary of the main concept in their study journal.",
      ],
    },
    common_misconceptions: [
      "Over-generalizing rules without checking boundary conditions.",
      "Skipping the verification/checking step once a raw answer is reached.",
      "Confusing similar mathematical or scientific terminology under pressure.",
    ],
    teacher_notes: [
      "Keep pacing brisk during the introductory phase to protect time for independent practice.",
      "Ensure quiet transitions between individual reflection and paired collaboration.",
      "Praise precision in mathematical/scientific vocabulary throughout the period.",
    ],
    reflection: [
      "Did the majority of students achieve the exit ticket threshold (80%+ mastery)?",
      "Which stage took longer than estimated, and how can the transition be tightened next time?",
      "Which specific misconceptions require a 5-minute warm-up review in tomorrow's lesson?",
    ],
  };
}

function createFallbackWorksheet(topic: string, grade: string, subject: string, schoolName: string) {
  return {
    title: `${topic} - Concept Mastery Worksheet`,
    schoolName,
    grade,
    subject,
    topic,
    timeAllowed: "20 Minutes",
    totalMarks: 20,
    instructions: [
      "Read each question carefully before answering.",
      "Show neat calculation steps where applicable.",
      "Complete the Exit Slip individually before submitting.",
    ],
    questions: [
      {
        id: "q1",
        question: `Define the primary concept of '${topic}' and state its key characteristics in 2 sentences.`,
        type: "short_answer",
        marks: 3,
      },
      {
        id: "q2",
        question: `Fill in the blanks: In ${subject}, when examining ${topic}, the fundamental principle states that ___________ happens as a result of ___________.`,
        type: "fill_in_blank",
        marks: 3,
      },
      {
        id: "q3",
        question: `Which of the following statements is TRUE regarding ${topic}?`,
        type: "multiple_choice",
        marks: 3,
        options: [
          `Option A: It applies exclusively under controlled standard conditions.`,
          `Option B: It remains constant irrespective of external variable changes.`,
          `Option C: It can be derived directly using the fundamental laws of ${subject}.`,
          `Option D: None of the above.`,
        ],
      },
      {
        id: "q4",
        question: `Solve the following application challenge: Calculate and justify the expected outcome when applying the principles of ${topic} to a real-world scenario.`,
        type: "problem_solving",
        marks: 6,
      },
      {
        id: "q5",
        question: `Differentiate between the standard expected behavior and the most common conceptual misconception in ${topic}.`,
        type: "short_answer",
        marks: 5,
      },
    ],
    exitSlipQuestion: `In your own words: What was the single most important concept you learned today about ${topic}, and what is one question you still have?`,
  };
}

function createFallbackBlackboard(topic: string, grade: string, subject: string) {
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return {
    topicHeading: `${topic.toUpperCase()}`,
    leftPanel: {
      title: "Class Info & Prerequisite Terms",
      items: [
        `Date: ${dateStr} | Period: 3`,
        `Class & Section: ${grade}`,
        `Subject: ${subject}`,
        `Prerequisite Terms:`,
        `• Core definitions from previous class`,
        `• Notation & standard SI units`,
        `• Essential formula review`,
      ],
    },
    centerPanel: {
      title: "Core Concept & Derivation / Diagram",
      mainDiagramOrConcept: `[Central Labeled Diagram: ${topic} schematic showing active components, directional vectors, and equilibrium lines]`,
      stepDerivation: [
        `Step 1: State initial conditions and governing law.`,
        `Step 2: Resolve vectors/components into parallel and perpendicular elements.`,
        `Step 3: Apply algebraic balance equations.`,
        `Step 4: Conclude with the final standard formula / law statement.`,
      ],
      coreRules: [
        `Rule 1: Always verify units and dimensions before equating.`,
        `Rule 2: Emphasize standard boundary approximations (e.g. ideal conditions).`,
      ],
    },
    rightPanel: {
      title: "Student Tasks, Summary & Homework",
      studentTasks: [
        `Task 1: Solve practice question #2 on your mini slates.`,
        `Task 2: Discuss with desk partner: which factor influences rate of change?`,
      ],
      summaryPoints: [
        `• Key takeaway 1: Proportionality relationships established.`,
        `• Key takeaway 2: Common sign/notation pitfalls avoided.`,
        `• Key takeaway 3: Formula applies directly to board examinations.`,
      ],
      homeworkAssignment: `Textbook exercises Chapter review questions 1, 4, 7 & 9 in study notebook.`,
    },
    teacherBoardTips: [
      `Use yellow/colored chalk or highlighter for the final boxed formula in the center panel.`,
      `Keep the Left Panel intact for the whole 40 minutes so inspecting coordinators see date, period, and subject objectives.`,
    ],
  };
}

function createFallbackScript(topic: string, grade: string, subject: string, language: string) {
  const isTamil = language.toLowerCase().includes("tamil");
  const isHindi = language.toLowerCase().includes("hindi");
  const isTelugu = language.toLowerCase().includes("telugu");
  const isKannada = language.toLowerCase().includes("kannada");
  const isMalayalam = language.toLowerCase().includes("malayalam");

  return {
    topic,
    grade,
    subject,
    language,
    hookAnalogy: {
      title: `The Everyday Life Connection: Making '${topic}' Click Instantly`,
      storyOrMetaphor: `Imagine you are holding a physical vegetable scale at a local market or watching two friends on a park see-saw. If you add 200 grams to one side, what happens? The scale immediately tips! To restore balance, you MUST add the exact same 200 grams to the other side. This simple rule of balance is the secret heart of ${topic} in ${subject}!`,
      whyItWorks: `Students can immediately visualize a balance scale or see-saw in their mind, eliminating abstract anxiety before looking at formulas or textbook lines.`,
    },
    classroomSpeakingScript: [
      {
        phase: "Step 1: The Curiosity Hook (First 2 Minutes)",
        teacherSays: isTamil
          ? `"வணக்கம் மாணவர்களே! எல்லாரும் 2 நிமிடம் புத்தகத்தை மூடி வைங்க. என் கைகளைப் பாருங்க. நான் ஒரு தராசு போல நிற்கிறேன். இடது பக்கத்தில் 2 சாக்லேட் போட்டால் சமமாக இருக்க என்ன செய்யணும்? சொல்லுங்க பார்ப்போம்! இதே சமநிலை விதி தான் '${topic}'!"`
          : isHindi
          ? `"नमस्ते बच्चों! बस 2 मिनट के लिए अपनी किताबें बंद रखें। मेरे हाथों को देखिए, यह एक तराजू की तरह हैं। अगर मैं एक तरफ 2 टॉफियां डालता हूँ, तो तराजू को बराबर रखने के लिए दूसरी तरफ क्या करना होगा? बिल्कुल, यही संतुलन '${topic}' का असली राज है!"`
          : isTelugu
          ? `"నమస్కారం విద్యార్థులారా! 2 నిమిషాలు పుస్తకాలు మూయండి. నా చేతులను చూడండి - ఇవి ఒక త్రాసులా ఉన్నాయి. ఒక వైపు 2 చాక్లెట్లు వేస్తే, సమంగా ఉండాలంటే ఇంకోవైపు ఏం చేయాలి? సరిగ్గా ఇదే బ్యాలెన్స్ '${topic}' సూత్రం!"`
          : isKannada
          ? `"ನಮಸ್ಕಾರ ವಿದ್ಯಾರ್ಥಿಗಳೇ! 2 ನಿಮಿಷ ಪುಸ್ತಕಗಳನ್ನು ಮುಚ್ಚಿಡಿ. ನನ್ನ ಕೈಗಳನ್ನು ನೋಡಿ - ಇವು ತಕ್ಕಡಿಯಂತೆ ಇವೆ. ಒಂದು ಬದಿಯಲ್ಲಿ ತೂಕ ಹೆಚ್ಚಾದರೆ ಸಮತೋಲನ ಮಾಡಲು ಇನ್ನೊಂದು ಬದಿಯಲ್ಲಿ ಏನು ಮಾಡಬೇಕು? ಇದೇ '${topic}' ಮೂಲ ತತ್ವ!"`
          : isMalayalam
          ? `"നമസ്കാരം കുട്ടികളെ! 2 മിനിറ്റ് പുസ്തകം അടച്ചു വയ്ക്കൂ. എന്റെ കൈകൾ ശ്രദ്ധിക്കൂ. ഇതൊരു ത്രാസ് പോലെയാണ്. ഒരു വശത്ത് ഭാരം കൂടുമ്പോൾ തുല്യത നിലനിർത്താൻ എന്തു ചെയ്യണം? ഇതാണ് '${topic}' എന്ന പാഠത്തിന്റെ അടിസ്ഥാന തത്വം!"`
          : `"Good morning class! Keep your textbooks closed for just two minutes. Look at my hands. Imagine I am holding a weighing balance. If I add 2 units to the left side, what MUST I do to the right side to keep it completely level? Exactly! That exact principle of balance is the entire secret of ${topic}!"`,
        actionOrGesture: "Hold both hands flat at chest level mimicking a balanced weighing scale, tilting one side playfully to illustrate the point.",
        expectedStudentReaction: "Smiles, engaged eye contact, and an immediate chorus of students shouting the balancing answer.",
      },
      {
        phase: "Step 2: Connecting the Story to the Board (5 Minutes)",
        teacherSays: `"Brilliant! In ${subject}, we never panic because we have this golden balance rule. Whatever operation we perform, we do it fairly to both sides. Let's write our single golden rule on the blackboard right in the center."`,
        actionOrGesture: "Turn smoothly to the blackboard, write the core rule inside a big clear box, and underline the operative keywords.",
        expectedStudentReaction: "Students open their notebooks in an organized manner and copy down the anchor rule with focus.",
      },
      {
        phase: "Step 3: Teacher Think-Aloud Problem Walkthrough",
        teacherSays: `"Now, put your pens down and watch me do this first problem. I am going to think out loud. My brain asks: 'What is given to me? What is hiding? How do I isolate it without disturbing the balance?' Watch step one..."`,
        actionOrGesture: "Tap forehead lightly to demonstrate thinking aloud. Write step 1 with deliberate, measured pace so everyone follows.",
        expectedStudentReaction: "Students watch silently and nod as each step connects directly back to the balance analogy.",
      },
      {
        phase: "Step 4: Safe Diagnostic Check Before Practice",
        teacherSays: `"Before anyone starts the practice questions, show me on your fingers against your chest: 1 finger if you want me to do one more example, 2 fingers if you understand 50%, or 3 fingers if you're ready to solve one on your own right now!"`,
        actionOrGesture: "Demonstrate showing fingers against chest (keeps it private so students aren't shy or peer-pressured). Scan the room.",
        expectedStudentReaction: "Honest instant feedback across the entire class, allowing you to quickly spot anyone needing quick 1-on-1 help.",
      },
    ],
    eli5SimplifiedBackup: {
      simpleExplanation: `If a student says "Teacher, I still don't understand": Tell them: '${topic} is just like sharing snacks fairly between two best friends: whatever you give or take from one, you must do the exact same to the other so nobody cries.'`,
      concreteExample: `Like a see-saw with two equal kids: if one child picks up a school bag, the other child must pick up the same bag to keep playing happily.`,
    },
    checkingQuestions: [
      {
        question: `If someone changes one side of the problem but forgets the other side, what goes wrong?`,
        whatToLookFor: `Student should explain that equality/balance is broken, not just memorized 'because it's the rule'.`,
      },
      {
        question: `How can you prove to yourself that your final solution is 100% correct before turning in your exam?`,
        whatToLookFor: `Student explains substituting or verifying the answer back into the original condition.`,
      },
      {
        question: `In one sentence, how would you explain this lesson to your younger sibling tonight?`,
        whatToLookFor: `A simple, natural language explanation using their own words without rote jargon.`,
      },
    ],
    quickDosAndDonts: {
      dos: [
        "Give students 5 to 7 seconds of 'wait time' after asking a question before accepting an answer.",
        "Model 'think-aloud' mistakes intentionally (e.g. 'Wait, did I forget to balance this side?') so students learn how to self-correct.",
        "Praise students for explaining the 'Why' behind their steps rather than only the final number.",
      ],
      donts: [
        "Don't start the period by reading dry textbook definitions or formal statements verbatim.",
        "Don't call only on the students sitting in the front benches who raise their hands first.",
        "Never say 'This is so easy, why don't you get it?'—instead use the see-saw analogy.",
      ],
    },
  };
}

function createFallbackQuestionPaper(
  topic: string,
  grade: string,
  subject: string,
  curriculum: string,
  language: string,
  schoolName: string,
  examType: string,
  totalMarks: number,
  durationMinutes: number,
  examTypeName: string
) {
  const isTamil = language.toLowerCase().includes("tamil");
  const isKannada = language.toLowerCase().includes("kannada");
  const isHindi = language.toLowerCase().includes("hindi");
  const isMalayalam = language.toLowerCase().includes("malayalam");

  const remembering = Math.round(totalMarks * 0.25);
  const understanding = Math.round(totalMarks * 0.35);
  const applying = Math.round(totalMarks * 0.25);
  const analyzingHots = totalMarks - (remembering + understanding + applying);

  if (isTamil) {
    return {
      id: `qp_${Date.now()}`,
      title: `${topic} - தேர்வு வினாத்தாள் (${grade})`,
      schoolName: schoolName || "தமிழ்நாடு அரசு / மெட்ரிகுலேஷன் மேல்நிலைப் பள்ளி",
      examTypeName,
      curriculum,
      grade,
      subject,
      topic,
      language,
      durationMinutes,
      totalMarks,
      generalInstructions: [
        "அனைத்து வினாக்களுக்கும் விடையளிக்க வேண்டும்.",
        "வினா எண் மற்றும் உட்பிரிவுகளைத் தெளிவாகக் குறிப்பிடவும்.",
        "எழுத்துப்பிழையின்றித் தெளிவான கையெழுத்துடன் எழுதவும்.",
      ],
      sections: [
        {
          sectionName: "பகுதி - அ: சரியான விடையைத் தேர்ந்தெடுத்து எழுதுக",
          description: "அனைத்து வினாக்களுக்கும் விடையளிக்க (வினா ஒவ்வொன்றிற்கும் 1 மதிப்பெண்).",
          marksPerQuestion: 1,
          totalMarks: 5,
          questions: [
            {
              qNumber: "1",
              questionText: `'${topic}' என்பதன் அடிப்படையான பொருள் யாது?`,
              options: [
                "அ) அடிப்படை விதி மற்றும் தத்துவம்",
                "ஆ) பயன்பாட்டுக் கூறுகள்",
                "இ) நடைமுறை அனுபவம்",
                "ஈ) மேற்கூறிய அனைத்தும்",
              ],
              marks: 1,
              cognitiveDomain: "Remembering",
              answerKey: "சரியான விடை: ஈ) மேற்கூறிய அனைத்தும்.",
              stepMarking: ["சரியான குறியீட்டுடன் விடை எழுதினால்: 1 மதிப்பெண்"],
            },
            {
              qNumber: "2",
              questionText: `'${topic}' தொடர்பான சரியான இலக்கண/கருத்தியல் கூற்றினைக் கண்டறிக:`,
              options: [
                "அ) அனைத்துச் சூழலிலும் பொதுவானது",
                "ஆ) வரையறைக்குட்பட்டது",
                "இ) காலத்தால் மாறுபடாதது",
                "ஈ) தகுந்த சான்றுகளோடு இயங்குவது",
              ],
              marks: 1,
              cognitiveDomain: "Understanding",
              isPastBoardQuestion: true,
              pastBoardYears: "TN SSLC 2023, 2021",
              answerKey: "சரியான விடை: அ) அனைத்துச் சூழலிலும் பொதுவானது.",
              stepMarking: ["சரியான விடைக்கு: 1 மதிப்பெண்"],
            },
            {
              qNumber: "3",
              questionText: "பொருத்தமான சொல்லைக் கொண்டு நிரப்புக: '_____ விழுப்பம் தரலான் உயிரினும் ஓம்பப்படும்.'",
              options: ["அ) கல்வி", "ஆ) ஒழுக்கம்", "இ) அறிவு", "ஈ) வாய்மை"],
              marks: 1,
              cognitiveDomain: "Remembering",
              answerKey: "சரியான விடை: ஆ) ஒழுக்கம்.",
              stepMarking: ["சரியான விடை: 1 மதிப்பெண்"],
            },
          ],
        },
        {
          sectionName: "பகுதி - ஆ: குறுவினாக்கள் (2 மதிப்பெண்கள்)",
          description: "சுருக்கமான விடையளிக்க (வினா ஒவ்வொன்றிற்கும் 2 மதிப்பெண்கள்).",
          marksPerQuestion: 2,
          totalMarks: 6,
          questions: [
            {
              qNumber: "4",
              questionText: `'${topic}' - இதன் முக்கியத்துவம் குறித்து இரண்டு வரிகளில் விவரிக்க.`,
              marks: 2,
              cognitiveDomain: "Understanding",
              answerKey: "கருத்துச் சுருக்கம் மற்றும் இலக்கண விளக்கம் தெளிவாக அமைய வேண்டும்.",
              stepMarking: ["வரையறை / விளக்கம்: 1 மதிப்பெண்", "எடுத்துக்காட்டு / சான்று: 1 மதிப்பெண்"],
            },
            {
              qNumber: "5",
              questionText: "தகுந்த சான்று தந்து விளக்குக: அன்றாட வாழ்வில் இதன் பயன் யாது?",
              marks: 2,
              cognitiveDomain: "Applying",
              isPastBoardQuestion: true,
              pastBoardYears: "TN SSLC 2022",
              answerKey: "வாழ்வியல் பயன்பாட்டைச் சான்றுடன் தொடர்புபடுத்திக் கூறுதல்.",
              stepMarking: ["சான்று: 1 மதிப்பெண்", "விளக்கம்: 1 மதிப்பெண்"],
            },
          ],
        },
        {
          sectionName: "பகுதி - இ: சிறுவினா மற்றும் நெடுவினா (கட்டுரை வினா)",
          description: "விரிவான விடையளிக்க.",
          marksPerQuestion: 5,
          totalMarks: totalMarks - 11 > 0 ? totalMarks - 11 : 9,
          questions: [
            {
              qNumber: "6",
              questionText: `'${topic}' குறித்துத் திருவள்ளுவர் அல்லது பாடப்பகுதி தரும் கருத்துக்களைத் தொகுத்து ஒரு பக்க அளவில் கட்டுரை வரைக.`,
              internalChoice: "(அல்லது) மேற்கண்ட கருத்தினை இன்றைய நவீன சமுதாயச் சூழலோடு ஒப்பிட்டு உங்கள் சொந்த நடையில் விவரிக்க.",
              marks: 5,
              cognitiveDomain: "HOTS/Analyzing",
              isPastBoardQuestion: true,
              pastBoardYears: "TN SSLC 2024 (Sure-Shot 5-Marker)",
              answerKey: "முன்னுரை, பொருளுரை, சான்றுகள், இன்றைய சூழல் தொடர்பு, முடிவுரை என்ற வடிவில் அமைய வேண்டும்.",
              stepMarking: [
                "முன்னுரை & வரையறை: 1 மதிப்பெண்",
                "உட்தலைப்புகள் மற்றும் சான்றுகள்: 2.5 மதிப்பெண்கள்",
                "முடிவுரை & நடைத்தூய்மை: 1.5 மதிப்பெண்கள்",
              ],
            },
          ],
        },
      ],
      blueprint: {
        rememberingMarks: remembering,
        understandingMarks: understanding,
        applyingMarks: applying,
        analyzingHotsMarks: analyzingHots,
        totalMarks,
      },
      boardExamTips: {
        highScorerKeywords: ["சீர் பிரித்தல்", "பரிமேலழகர் உரை நுட்பம்", "யாப்பிலக்கண அமைதி", "சான்று தொடர்பு"],
        commonStudentMistakes: [
          "குறளைச் சீர் பிரிக்காமல் ஒரே வரியாக எழுதுவது.",
          "விதி எழுதாமல் உதாரணம் மட்டும் தருவது.",
        ],
        examinerMarkingAdvice: "முக்கிய சொற்களை நீல மையிலும், தலைப்புகளைக் கருப்பு மையிலும் அடிக்கோடிட்டு எழுதினால் அரசுத் தேர்வு திருத்துநர்கள் முழு மதிப்பெண்களை வழங்குவர்.",
      },
    };
  }

  // Standard Subject (Math, Science, Social, English, etc.)
  return {
    id: `qp_${Date.now()}`,
    title: `${topic} - Periodic Examination (${grade})`,
    schoolName: schoolName || "St. Joseph's Model Secondary School",
    examTypeName,
    curriculum,
    grade,
    subject,
    topic,
    language,
    durationMinutes,
    totalMarks,
    generalInstructions: [
      "All questions are compulsory. Internal choices are provided in Section D.",
      "Section A comprises Objective / Multiple Choice Questions (1 Mark each).",
      "Section B comprises Very Short Answer questions (2 Marks each).",
      "Section C comprises Short Answer questions (3 Marks each).",
      "Section D comprises Long Answer / High Order Thinking questions (5 Marks each).",
      "Draw neat and labeled diagrams wherever necessary.",
    ],
    sections: [
      {
        sectionName: "Section A: Objective Type & MCQs (1 Mark Each)",
        description: "Choose the correct option or provide concise one-line answers.",
        marksPerQuestion: 1,
        totalMarks: 5,
        questions: [
          {
            qNumber: "1",
            questionText: `Which of the following is the fundamental governing principle or standard equation for '${topic}'?`,
            options: [
              "A) Direct proportionality under standard equilibrium conditions",
              "B) Invariant constant independent of external system variables",
              "C) Derived algebraic function obeying boundary constraints",
              "D) All of the above",
            ],
            marks: 1,
            cognitiveDomain: "Remembering",
            answerKey: "Correct Answer: D) All of the above.",
            stepMarking: ["Correct option letter and statement: 1 Mark"],
          },
          {
            qNumber: "2",
            questionText: `Assertion (A): '${topic}' principles are universally applied in standard analysis.\nReason (R): It maintains conservation and balance between initial and final states.`,
            options: [
              "A) Both A and R are true and R is the correct explanation of A.",
              "B) Both A and R are true but R is not the correct explanation of A.",
              "C) A is true but R is false.",
              "D) A is false but R is true.",
            ],
            marks: 1,
            cognitiveDomain: "Understanding",
            isPastBoardQuestion: true,
            pastBoardYears: "CBSE 2024, 2022",
            answerKey: "Correct Answer: A) Both A and R are true and R is the correct explanation of A.",
            stepMarking: ["Accurate identification of relationship: 1 Mark"],
          },
          {
            qNumber: "3",
            questionText: `State the standard SI unit or defining criterion used when measuring quantities associated with ${topic}.`,
            marks: 1,
            cognitiveDomain: "Remembering",
            answerKey: "Standard SI unit / Definition correctly stated with correct symbol and dimensions.",
            stepMarking: ["Exact unit name and symbol: 1 Mark"],
          },
        ],
      },
      {
        sectionName: "Section B: Very Short Answer Questions (2 Marks Each)",
        description: "Answer in 30-50 words. Show intermediate steps where numerical.",
        marksPerQuestion: 2,
        totalMarks: 6,
        questions: [
          {
            qNumber: "4",
            questionText: `Differentiate between the ideal theoretical behavior and observed practical limitations in '${topic}'.`,
            marks: 2,
            cognitiveDomain: "Understanding",
            isPastBoardQuestion: true,
            pastBoardYears: "CBSE 2023",
            answerKey: "Point 1: Ideal conditions assume zero friction / complete conservation (1 Mark). Point 2: Real systems have boundary dissipation (1 Mark).",
            stepMarking: ["Two distinct points of contrast: 1 + 1 = 2 Marks"],
          },
          {
            qNumber: "5",
            questionText: `Calculate the resultant outcome when applying the core formula of '${topic}' to a standard test case.`,
            marks: 2,
            cognitiveDomain: "Applying",
            answerKey: "Formula stated: 0.5 Mark; Substitution of values: 1 Mark; Final answer with correct units: 0.5 Mark.",
            stepMarking: ["Formula: 0.5 Mark", "Calculation: 1.0 Mark", "Units: 0.5 Mark"],
          },
        ],
      },
      {
        sectionName: "Section C: Short Answer Questions (3 Marks Each)",
        description: "Answer in 50-80 words. Include formulas, labeled sketches, or reasoning.",
        marksPerQuestion: 3,
        totalMarks: 4,
        questions: [
          {
            qNumber: "6",
            questionText: `Explain why a common student misconception regarding '${topic}' fails when tested under edge conditions. Justify with a counter-example.`,
            marks: 3,
            cognitiveDomain: "Applying",
            isPastBoardQuestion: true,
            pastBoardYears: "Board 2024, 2021",
            answerKey: "Identification of erroneous assumption (1 Mark), Mathematical / Conceptual proof (1.5 Marks), Concluding rule (0.5 Mark).",
            stepMarking: ["Misconception named: 1 Mark", "Proof: 1.5 Marks", "Rule: 0.5 Mark"],
          },
        ],
      },
      {
        sectionName: "Section D: Long Answer / High Order Thinking (5 Marks Each)",
        description: "Detailed step-by-step derivation or comprehensive problem with internal choice.",
        marksPerQuestion: 5,
        totalMarks: 5,
        questions: [
          {
            qNumber: "7",
            questionText: `Derive the standard expression for '${topic}' from first principles. Draw a neat labeled schematic diagram showing all components and vectors.`,
            internalChoice: `(OR) Analyze a real-world engineering / practical scenario governed by '${topic}'. Calculate the efficiency, identify sources of error, and propose two corrective optimizations.`,
            marks: 5,
            cognitiveDomain: "HOTS/Analyzing",
            isPastBoardQuestion: true,
            pastBoardYears: "CBSE 2024, 2022, 2019 (Sure-Shot 5-Marker)",
            answerKey: "Neat diagram (1.5 Marks), Step-by-step derivation steps (2.5 Marks), Final highlighted box formula and unit analysis (1 Mark).",
            stepMarking: [
              "Labeled Diagram: 1.5 Marks",
              "Mathematical / Deductive derivation: 2.5 Marks",
              "Final Boxed Statement & Units: 1.0 Mark",
            ],
          },
        ],
      },
    ],
    blueprint: {
      rememberingMarks: remembering,
      understandingMarks: understanding,
      applyingMarks: applying,
      analyzingHotsMarks: analyzingHots,
      totalMarks,
    },
    boardExamTips: {
      highScorerKeywords: [
        "Conservation Law",
        "Equilibrium Boundary Condition",
        "Direct Proportionality Ratio",
        "Step Verification with SI Units",
      ],
      commonStudentMistakes: [
        "Forgetting to write standard SI units in the final numerical answer (loses 0.5 Mark).",
        "Drawing circuit/ray diagrams without directional arrows (loses 1 full Mark).",
        "Omitting the initial condition or formula statement before plugging numbers.",
      ],
      examinerMarkingAdvice: "Board evaluators scan for the boxed final answer and underline keywords. Always box the final answer and write intermediate equations on separate lines.",
    },
  };
}

function createFallbackRubric(
  topic: string,
  grade: string,
  subject: string,
  curriculum: string,
  componentType: string
) {
  let componentTitle = "Subject Enrichment & Laboratory Practical Assessment (5 Marks)";
  let maxMarks = 5;

  if (componentType === "portfolio_notebook") {
    componentTitle = "Portfolio, Notebook Maintenance & Classroom Engagement (5 Marks)";
  } else if (componentType === "periodic_assessment") {
    componentTitle = "Periodic Assessment, Quizzes & Slip Tests (5 Marks)";
  } else if (componentType === "asl_oral_listening") {
    componentTitle = "Assessment of Speaking & Listening (ASL) & Communication (5 Marks)";
  } else if (componentType === "project_work") {
    componentTitle = "Interdisciplinary Project Work & Experiential Research (5 Marks)";
  }

  return {
    id: `rubric_${Date.now()}`,
    grade: grade || "Class 10",
    subject: subject || "Core Subject",
    chapter: topic || "Curriculum Chapter",
    curriculum: curriculum || "CBSE / State Board",
    componentType: componentType || "subject_enrichment_lab",
    componentTitle,
    maxMarks,
    criteria: [
      {
        criterionName: "1. Conceptual Understanding & Planning",
        marksAllocated: 1.5,
        exemplary: "Flawlessly articulates theoretical foundation and designs appropriate methodical steps with zero hesitation.",
        proficient: "Demonstrates clear conceptual grasp with minor prompts; plans systematic procedural workflow.",
        developing: "Basic factual awareness; requires step-by-step guidance to structure experiment or portfolio.",
        beginning: "Struggles to recall core principles; lacks clear direction or prerequisite preparation.",
      },
      {
        criterionName: "2. Execution, Precision & Data Collection",
        marksAllocated: 1.5,
        exemplary: "Carries out procedure with extreme precision, follows all safety rules, and records flawless raw data/notes.",
        proficient: "Executes method accurately with acceptable precision; records neat, legible observations.",
        developing: "Minor lapses in measurement, units, or record-keeping; requires periodic intervention.",
        beginning: "Significant procedural errors or careless data manipulation; incomplete entries.",
      },
      {
        criterionName: "3. Analysis, Critical Thinking & Interpretation",
        marksAllocated: 1.0,
        exemplary: "Insightfully interprets graphs/data, calculates error margins, and relates outcomes to real-world applications.",
        proficient: "Correctly derives conclusions from evidence with standard mathematical/reasoning accuracy.",
        developing: "Mechanical calculation without deeper analytical synthesis; misses subtle anomalies.",
        beginning: "Inability to deduce meaningful conclusions from collected data or observations.",
      },
      {
        criterionName: "4. Viva Voce & Viva Defense / Articulation",
        marksAllocated: 1.0,
        exemplary: "Confidently and accurately answers challenging inquiry questions, justifying reasoning with technical terms.",
        proficient: "Answers core questions satisfactorily using appropriate subject vocabulary.",
        developing: "Hesitant responses; relies heavily on surface recall rather than conceptual reasoning.",
        beginning: "Unable to answer basic diagnostic or verification questions about their own submission.",
      },
    ],
    suggestedActivities: [
      `Hands-on investigation / simulation experiment on '${topic}' using school lab apparatus or digital kits.`,
      `Comprehensive student portfolio with annotated diagrams, real-life case connections, and reflective summaries.`,
      `Peer-evaluated interactive viva voce station simulating board assessment standards.`,
    ],
    teacherObservationChecklist: [
      "Student independently verifies apparatus zero error or prerequisite calibration before starting.",
      "Student maintains original, un-overwritten observations in the authentic laboratory / practical logbook.",
      "Student adheres to laboratory safety, equipment stewardship, and cooperative group ethics.",
      "Calculations exhibit clear step marking with correct SI units and percentage discrepancy analysis.",
    ],
    cbseGuidelinesNote:
      "Aligned with CBSE Assessment of Practical Work & Subject Enrichment guidelines (Circular No. Acad-05/2024). Schools must preserve student practical portfolios and rubrics for spot verification by CBSE external observers.",
  };
}

function createFallbackSyllabusPlanner(
  grade: string,
  subject: string,
  curriculum: string,
  academicYear: string = "2025-2026"
) {
  const isClass10 = (grade || "").includes("10");
  const isClass12 = (grade || "").includes("12");

  return {
    academicYear,
    grade: grade || "Class 10",
    subject: subject || "Core Subject",
    curriculum: curriculum || "CBSE / State Board",
    totalInstructionalPeriods: 195,
    theoryPeriods: 145,
    revisionAndBufferPeriods: 50,
    term1WeightageMarks: 40,
    term2WeightageMarks: 40,
    internalAssessmentTotalMarks: 20,
    units: [
      {
        unitNumber: 1,
        unitTitle: "Unit 1: Foundational Principles & Core Concepts",
        chapters: ["Chapter 1: Introductory Foundations", "Chapter 2: Governing Laws & Properties"],
        term: "Term 1" as const,
        scheduledMonth: "June - July",
        suggestedPeriods: 28,
        theoryMarks: 12,
        practicalOrInternalMarks: 3,
        assessmentType: "Periodic Test 1 (20 Marks)",
        keyCompetencies: [
          "Conceptual definitions & terminology",
          "Foundational mathematical & deductive derivations",
          "Hands-on introductory verification activity",
        ],
      },
      {
        unitNumber: 2,
        unitTitle: "Unit 2: System Interactions & Mechanisms",
        chapters: ["Chapter 3: Reaction Mechanics & Structure", "Chapter 4: Energy & Transformations"],
        term: "Term 1" as const,
        scheduledMonth: "July - August",
        suggestedPeriods: 32,
        theoryMarks: 14,
        practicalOrInternalMarks: 4,
        assessmentType: "Classroom Slip-Test & Lab Practical Record",
        keyCompetencies: [
          "Multi-step problem solving",
          "Scientific / schematic diagram modeling",
          "Experimental error evaluation",
        ],
      },
      {
        unitNumber: 3,
        unitTitle: "Unit 3: Mid-Term Synthesis & Applications",
        chapters: ["Chapter 5: Dynamics & Real-World Phenomena"],
        term: "Term 1" as const,
        scheduledMonth: "September",
        suggestedPeriods: 25,
        theoryMarks: 14,
        practicalOrInternalMarks: 3,
        assessmentType: "Half-Yearly Examination (80 Marks)",
        keyCompetencies: [
          "Cross-chapter conceptual linkage",
          "Comprehensive case-based questions (NEP 2020)",
          "Term 1 consolidated portfolio review",
        ],
      },
      {
        unitNumber: 4,
        unitTitle: "Unit 4: Advanced Principles & Analytical Structures",
        chapters: ["Chapter 6: Extended Theories & Laws", "Chapter 7: Quantitative Analysis"],
        term: "Term 2" as const,
        scheduledMonth: "October - November",
        suggestedPeriods: 35,
        theoryMarks: 16,
        practicalOrInternalMarks: 4,
        assessmentType: "Periodic Test 2 (20 Marks)",
        keyCompetencies: [
          "Higher Order Thinking Skills (HOTS)",
          "Analytical graphical deductions",
          "Subject enrichment project submission",
        ],
      },
      {
        unitNumber: 5,
        unitTitle: "Unit 5: Frontier Applications & Interdisciplinary Studies",
        chapters: ["Chapter 8: Modern Applications & Sustainability", "Chapter 9: Case Studies & Technology"],
        term: "Term 2" as const,
        scheduledMonth: "November - December",
        suggestedPeriods: 30,
        theoryMarks: 14,
        practicalOrInternalMarks: 3,
        assessmentType: "Multiple Assessment Quiz & Viva Voce",
        keyCompetencies: [
          "Environmental / technological contextualization",
          "Assertion-Reason & Competency practice",
          "Final submission of practical records",
        ],
      },
      {
        unitNumber: 6,
        unitTitle: "Unit 6: Board Exam Intensive Revision & Pre-Board Drills",
        chapters: ["Complete Syllabus Mock Drill", "Past 10 Years Question Paper Solvers", "Remedial Clinic"],
        term: "Term 2" as const,
        scheduledMonth: "January - February",
        suggestedPeriods: 45,
        theoryMarks: 80,
        practicalOrInternalMarks: 20,
        assessmentType: isClass10 || isClass12 ? "Pre-Board I & II + Final Board Exam" : "Annual Summative Examination",
        keyCompetencies: [
          "Time management under 3-hour exam pressure",
          "Step-marking mastery and handwriting neatness",
          "Formula sheets & last-minute flashcard drills",
        ],
      },
    ],
    examMilestones: [
      {
        examName: "Periodic Test 1 (PT-1)",
        month: "Late July",
        portionCovered: "Units 1 & 2 (Initial 25% of syllabus)",
        weightage: "20 Marks (Converted to 5 Marks in final internal)",
      },
      {
        examName: "Mid-Term / Half-Yearly Examination",
        month: "Mid-September",
        portionCovered: "Units 1, 2 & 3 (Full Term 1 syllabus - 50%)",
        weightage: "80 Marks / 40 Marks",
      },
      {
        examName: "Periodic Test 2 (PT-2)",
        month: "Late November",
        portionCovered: "Units 4 & 5 (Term 2 syllabus)",
        weightage: "20 Marks (Converted to 5 Marks in final internal)",
      },
      {
        examName: "Pre-Board Examination 1",
        month: "Early January",
        portionCovered: "100% Complete Annual Syllabus",
        weightage: "80 Marks (Rigorous board paper simulation)",
      },
      {
        examName: "Pre-Board Examination 2 / Remedial Mock",
        month: "Late January / Early February",
        portionCovered: "100% Complete Annual Syllabus",
        weightage: "80 Marks (Focus on high-frequency questions & weak topics)",
      },
      {
        examName: isClass10 || isClass12 ? "All India Senior/Secondary Board Exam (AISSE / AISSCE)" : "Annual Summative Assessment",
        month: "Late February - March",
        portionCovered: "100% Prescribed Board Curriculum",
        weightage: "80 Marks Theory + 20 Marks Internal Assessment",
      },
    ],
    pedagogicalGuidelines: [
      "Allocate 2 buffer periods after each major unit test to review common student errors and re-teach problematic questions.",
      "Conduct at least 1 hands-on or digital simulation activity every alternate week to satisfy NEP 2020 experiential mandates.",
      "Schedule peer-tutoring sessions pairing students scoring above 80% with peers needing conceptual reinforcement.",
      "Ensure student practical notebooks are signed and stamped weekly to avoid last-minute rush during external inspections.",
    ],
  };
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
