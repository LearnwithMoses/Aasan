import {
  UserProfile,
  SavedLessonPlan,
  LessonPlan,
  LessonPlanRequest,
  StudentWorksheet,
  BlackboardLayout,
  TeacherExplanationScript,
  QuestionPaper,
  InternalAssessmentRubric,
  AcademicSyllabusPlanner,
} from "../types.ts";

const PROFILE_KEY = "teacherplan_user_profile";
const SAVED_PLANS_KEY = "teacherplan_saved_plans";

export function getUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Failed to save user profile to localStorage:", err);
  }
}

export function registerFreeTrial(data: {
  name: string;
  school: string;
  phone: string;
  bloodGroup: string;
  address: string;
}): UserProfile {
  const now = new Date();
  const expires = new Date();
  expires.setDate(now.getDate() + 30); // 30 Days Free Pro

  const profile: UserProfile = {
    name: data.name.trim(),
    school: data.school.trim(),
    phone: data.phone.trim(),
    bloodGroup: data.bloodGroup.trim(),
    address: data.address.trim(),
    registeredAt: now.toISOString(),
    trialExpiresAt: expires.toISOString(),
    isSubscriptionActive: false,
  };

  saveUserProfile(profile);
  return profile;
}

export function activateSubscription(plan: "monthly" | "yearly"): UserProfile {
  const existing = getUserProfile();
  const now = new Date();
  const expires = new Date();
  if (plan === "yearly") {
    expires.setFullYear(now.getFullYear() + 1);
  } else {
    expires.setMonth(now.getMonth() + 1);
  }

  const updated: UserProfile = {
    name: existing?.name || "Educator",
    school: existing?.school || "School",
    phone: existing?.phone || "",
    bloodGroup: existing?.bloodGroup || "",
    address: existing?.address || "",
    registeredAt: existing?.registeredAt || now.toISOString(),
    trialExpiresAt: expires.toISOString(),
    isSubscriptionActive: true,
    subscriptionPlan: plan,
  };

  saveUserProfile(updated);
  return updated;
}

export function isProUser(): boolean {
  const profile = getUserProfile();
  if (!profile) return false;

  if (profile.isSubscriptionActive) return true;

  if (profile.trialExpiresAt) {
    const expiry = new Date(profile.trialExpiresAt).getTime();
    return expiry > Date.now();
  }

  return false;
}

export function getProDaysRemaining(): number {
  const profile = getUserProfile();
  if (!profile || !profile.trialExpiresAt) return 0;
  const diff = new Date(profile.trialExpiresAt).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Saved Plans Library ("My Lesson Vault")
export function getSavedPlans(): SavedLessonPlan[] {
  try {
    const raw = localStorage.getItem(SAVED_PLANS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePlanToVault(
  plan: LessonPlan,
  formData: LessonPlanRequest,
  worksheet?: StudentWorksheet,
  blackboard?: BlackboardLayout,
  script?: TeacherExplanationScript,
  questionPaper?: QuestionPaper,
  rubric?: InternalAssessmentRubric,
  syllabusPlanner?: AcademicSyllabusPlanner
): SavedLessonPlan {
  const list = getSavedPlans();
  const id = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const item: SavedLessonPlan = {
    id,
    savedAt: new Date().toISOString(),
    title: plan.title,
    grade: formData.grade || "Class",
    subject: formData.subject || "Subject",
    topic: formData.topic || "Topic",
    curriculum: formData.curriculum || "General",
    plan,
    formData,
    worksheet,
    blackboard,
    script,
    questionPaper,
    rubric,
    syllabusPlanner,
  };

  const updated = [item, ...list];
  try {
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save plan to vault:", err);
  }
  return item;
}

export function deleteSavedPlan(id: string): void {
  const list = getSavedPlans();
  const updated = list.filter((p) => p.id !== id);
  try {
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete plan from vault:", err);
  }
}

export function toggleFavoritePlan(id: string): void {
  const list = getSavedPlans();
  const updated = list.map((p) =>
    p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
  );
  try {
    localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to toggle favorite plan:", err);
  }
}

// Export Lesson Plan as Microsoft Word (.doc)
export function exportToWordDoc(plan: LessonPlan, formData: LessonPlanRequest): void {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${plan.title}</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; line-height: 1.5; color: #111827; }
        h1 { font-family: Georgia, serif; font-size: 24pt; color: #0f172a; margin-bottom: 4pt; }
        .meta { font-size: 10pt; color: #475569; margin-bottom: 18pt; border-bottom: 2pt solid #0f172a; padding-bottom: 6pt; }
        h2 { font-size: 14pt; color: #1e293b; margin-top: 14pt; margin-bottom: 4pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 3pt; }
        h3 { font-size: 11pt; color: #334155; margin-top: 8pt; margin-bottom: 2pt; font-weight: bold; }
        ul { margin-top: 3pt; margin-bottom: 8pt; padding-left: 20pt; }
        li { margin-bottom: 3pt; font-size: 10.5pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 8pt; margin-bottom: 12pt; }
        th, td { border: 1px solid #94a3b8; padding: 6pt 8pt; font-size: 10pt; text-align: left; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .stage-col { font-weight: bold; background-color: #f8fafc; }
        .highlight { background-color: #fef3c7; padding: 2pt 4pt; border-radius: 2pt; }
      </style>
    </head>
    <body>
      <h1>${plan.title}</h1>
      <div class='meta'>
        <strong>Curriculum:</strong> ${formData.curriculum || "General"} |
        <strong>Class:</strong> ${formData.grade} |
        <strong>Subject:</strong> ${formData.subject} |
        <strong>Duration:</strong> ${formData.duration} Minutes |
        <strong>Model:</strong> ${formData.lessonModel}
      </div>

      <h2>1. Learning Objectives (Bloom's Taxonomy)</h2>
      <ul>
        ${plan.learning_objectives.map((o) => `<li>${o}</li>`).join("")}
      </ul>

      <h2>2. Success Criteria</h2>
      <ul>
        ${plan.success_criteria.map((c) => `<li>${c}</li>`).join("")}
      </ul>

      <h2>3. Prior Knowledge & Teaching Aids</h2>
      <h3>Essential Prerequisites</h3>
      <ul>
        ${plan.prior_knowledge.map((p) => `<li>${p}</li>`).join("")}
      </ul>
      <h3>Teaching Aids & Materials</h3>
      <ul>
        ${plan.materials.map((m) => `<li>${m}</li>`).join("")}
      </ul>

      <h2>4. Key Explanations & Core Concepts</h2>
      <ul>
        ${plan.key_explanation.map((k) => `<li>${k}</li>`).join("")}
      </ul>

      <h2>5. Detailed Lesson Flow (${formData.duration} Minutes)</h2>
      <table>
        <thead>
          <tr>
            <th style='width: 20%;'>Stage & Time</th>
            <th style='width: 35%;'>Teacher Actions & Scaffolding</th>
            <th style='width: 30%;'>Student Actions & Engagement</th>
            <th style='width: 15%;'>Assessment Check</th>
          </tr>
        </thead>
        <tbody>
          ${plan.lesson_flow
            .map(
              (s) => `
            <tr>
              <td class='stage-col'><strong>${s.stage}</strong><br>(${s.minutes} mins)</td>
              <td>${s.teacher_actions.map((t) => `• ${t}`).join("<br>")}</td>
              <td>${s.student_actions.map((sa) => `• ${sa}`).join("<br>")}</td>
              <td>${s.assessment_check}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h2>6. Differentiated Learning Strategies</h2>
      <p><strong>Support (Struggling Learners):</strong></p>
      <ul>${plan.differentiation.support.map((s) => `<li>${s}</li>`).join("")}</ul>
      <p><strong>Core (Grade-Level Mastery):</strong></p>
      <ul>${plan.differentiation.core.map((c) => `<li>${c}</li>`).join("")}</ul>
      <p><strong>Extension (High Achievers / Gifted):</strong></p>
      <ul>${plan.differentiation.extension.map((e) => `<li>${e}</li>`).join("")}</ul>

      <h2>7. Assessment & Evaluation</h2>
      <p><strong>Formative Ongoing Checks:</strong></p>
      <ul>${plan.assessment.formative.map((f) => `<li>${f}</li>`).join("")}</ul>
      <p><strong>5-Minute Exit Ticket:</strong></p>
      <ul>${plan.assessment.exit_ticket.map((et) => `<li>${et}</li>`).join("")}</ul>
      <p><strong>Homework / Independent Practice:</strong></p>
      <ul>${plan.assessment.homework.map((h) => `<li>${h}</li>`).join("")}</ul>

      <h2>8. Common Student Misconceptions & Remedies</h2>
      <ul>
        ${plan.common_misconceptions.map((m) => `<li>${m}</li>`).join("")}
      </ul>

      <h2>9. Teacher Practical Notes & Post-Lesson Reflection</h2>
      <h3>Teacher Notes for Delivery</h3>
      <ul>
        ${plan.teacher_notes.map((n) => `<li>${n}</li>`).join("")}
      </ul>
      <h3>Post-Lesson Reflective Questions</h3>
      <ul>
        ${plan.reflection.map((r) => `<li>${r}</li>`).join("")}
      </ul>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], {
    type: "application/msword",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = (plan.title || "Lesson_Plan").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.download = `${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Question Paper & Marking Scheme as Microsoft Word (.doc)
export function exportQuestionPaperToWordDoc(paper: QuestionPaper, includeAnswerKey: boolean = false): void {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${paper.title}</title>
      <style>
        body { font-family: 'Times New Roman', Calibri, Arial, sans-serif; line-height: 1.4; color: #000; margin: 20pt; }
        .school-header { text-align: center; border-bottom: 2pt double #000; padding-bottom: 8pt; margin-bottom: 12pt; }
        .school-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 3pt; }
        .exam-title { font-size: 13pt; font-weight: bold; margin-bottom: 4pt; }
        .meta-table { width: 100%; border: none; margin-bottom: 8pt; }
        .meta-table td { border: none; padding: 2pt 4pt; font-size: 10.5pt; }
        .instructions { font-size: 9.5pt; font-style: italic; margin-bottom: 12pt; border-bottom: 1px solid #ccc; padding-bottom: 6pt; }
        .section-header { font-size: 12pt; font-weight: bold; text-align: center; background-color: #f1f5f9; padding: 4pt; margin-top: 14pt; margin-bottom: 6pt; border: 1px solid #94a3b8; }
        .question-row { margin-bottom: 8pt; font-size: 11pt; page-break-inside: avoid; }
        .q-num { font-weight: bold; display: inline-block; width: 25pt; }
        .marks-badge { float: right; font-weight: bold; font-size: 10pt; }
        .options { margin-left: 25pt; margin-top: 3pt; margin-bottom: 4pt; }
        .option-item { margin-bottom: 2pt; }
        .internal-or { text-align: center; font-weight: bold; font-size: 10pt; margin: 4pt 0; color: #475569; }
        .answer-key-box { background-color: #f0fdf4; border: 1px dashed #16a34a; padding: 6pt 8pt; margin-top: 4pt; margin-left: 25pt; font-size: 9.5pt; color: #14532d; }
        .blueprint-table { width: 100%; border-collapse: collapse; margin-top: 14pt; font-size: 9.5pt; }
        .blueprint-table th, .blueprint-table td { border: 1px solid #000; padding: 4pt 6pt; text-align: center; }
        .blueprint-table th { background-color: #f8fafc; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class='school-header'>
        <div class='school-name'>${paper.schoolName || "SCHOOL EXAMINATION"}</div>
        <div class='exam-title'>${paper.examTypeName || "Periodic Assessment"}</div>
        <table class='meta-table'>
          <tr>
            <td><strong>Class & Section:</strong> ${paper.grade}</td>
            <td><strong>Subject:</strong> ${paper.subject}</td>
            <td style='text-align: right;'><strong>Total Marks:</strong> ${paper.totalMarks}</td>
          </tr>
          <tr>
            <td><strong>Topic / Portion:</strong> ${paper.topic}</td>
            <td><strong>Curriculum:</strong> ${paper.curriculum}</td>
            <td style='text-align: right;'><strong>Duration:</strong> ${paper.durationMinutes} Mins</td>
          </tr>
          <tr>
            <td colspan='3' style='padding-top: 6pt;'><strong>Student Name:</strong> ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; <strong>Roll No:</strong> __________</td>
          </tr>
        </table>
      </div>

      <div class='instructions'>
        <strong>General Instructions:</strong><br>
        ${paper.generalInstructions.map((ins, idx) => `${idx + 1}. ${ins}`).join("<br>")}
      </div>

      ${paper.sections
        .map(
          (sec) => `
        <div class='section-header'>${sec.sectionName}</div>
        ${sec.description ? `<p style='text-align: center; font-size: 9.5pt; font-style: italic; margin-top: 2pt; margin-bottom: 8pt;'>(${sec.description})</p>` : ""}
        
        ${sec.questions
          .map(
            (q) => `
          <div class='question-row'>
            <span class='marks-badge'>[${q.marks} Mark${q.marks > 1 ? "s" : ""}]</span>
            <span class='q-num'>${q.qNumber}.</span>
            ${q.isPastBoardQuestion ? `<span style='font-size: 8.5pt; background: #e0f2fe; color: #0369a1; padding: 1pt 4pt; border-radius: 2pt; font-weight: bold; margin-right: 4pt;'>★ PAST BOARD (${q.pastBoardYears || "Repeated"})</span>` : ""}
            <span>${q.questionText}</span>

            ${
              q.options && q.options.length > 0
                ? `<div class='options'>
                    ${q.options.map((opt) => `<div class='option-item'>${opt}</div>`).join("")}
                  </div>`
                : ""
            }

            ${
              q.internalChoice
                ? `<div class='internal-or'>--- OR ---</div>
                   <div style='margin-left: 25pt;'>${q.internalChoice}</div>`
                : ""
            }

            ${
              includeAnswerKey && q.answerKey
                ? `<div class='answer-key-box'>
                    <strong>[Teacher's Model Answer / Key]:</strong> ${q.answerKey}<br>
                    ${q.stepMarking ? `<strong>Step Marking:</strong> ${q.stepMarking.join(" | ")}` : ""}
                  </div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      `
        )
        .join("")}

      ${
        paper.blueprint
          ? `
        <br clear='all'>
        <div style='page-break-before: always;'>
          <h3 style='text-align: center;'>NEP 2020 Cognitive Weightage Blueprint</h3>
          <table class='blueprint-table'>
            <thead>
              <tr>
                <th>Cognitive Domain</th>
                <th>Marks Allocated</th>
                <th>Percentage Weightage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style='text-align: left;'>1. Remembering (Factual & Definitions)</td>
                <td>${paper.blueprint.rememberingMarks} Marks</td>
                <td>${Math.round((paper.blueprint.rememberingMarks / paper.totalMarks) * 100)}%</td>
              </tr>
              <tr>
                <td style='text-align: left;'>2. Understanding (Conceptual & Explanations)</td>
                <td>${paper.blueprint.understandingMarks} Marks</td>
                <td>${Math.round((paper.blueprint.understandingMarks / paper.totalMarks) * 100)}%</td>
              </tr>
              <tr>
                <td style='text-align: left;'>3. Applying (Problem Solving & Numerical)</td>
                <td>${paper.blueprint.applyingMarks} Marks</td>
                <td>${Math.round((paper.blueprint.applyingMarks / paper.totalMarks) * 100)}%</td>
              </tr>
              <tr>
                <td style='text-align: left;'>4. Analyzing / HOTS (Higher Order Thinking)</td>
                <td>${paper.blueprint.analyzingHotsMarks} Marks</td>
                <td>${Math.round((paper.blueprint.analyzingHotsMarks / paper.totalMarks) * 100)}%</td>
              </tr>
              <tr style='font-weight: bold; background-color: #f1f5f9;'>
                <td style='text-align: left;'>Total Board Weightage</td>
                <td>${paper.totalMarks} Marks</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
          : ""
      }
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], {
    type: "application/msword",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = (paper.title || "Question_Paper").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.download = `${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Internal Assessment Rubric as Word (.doc)
export function exportRubricToWordDoc(rubric: InternalAssessmentRubric): void {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${rubric.componentTitle}</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; color: #1e293b; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
        h1 { font-size: 16pt; margin: 0 0 5px 0; color: #0f172a; }
        .meta { font-size: 10pt; color: #475569; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; font-size: 10pt; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; vertical-align: top; }
        th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
        .criteria-col { width: 20%; font-weight: bold; background-color: #f8fafc; }
        .level-col { width: 20%; font-size: 9.5pt; }
        .box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class='header'>
        <h1>${rubric.componentTitle}</h1>
        <div class='meta'>
          <strong>Subject:</strong> ${rubric.subject} &nbsp;|&nbsp;
          <strong>Grade:</strong> ${rubric.grade} &nbsp;|&nbsp;
          <strong>Chapter:</strong> ${rubric.chapter} &nbsp;|&nbsp;
          <strong>Curriculum:</strong> ${rubric.curriculum} &nbsp;|&nbsp;
          <strong>Max Marks:</strong> ${rubric.maxMarks} Marks
        </div>
      </div>

      <h3>Continuous & Comprehensive Evaluation (CCE / NEP 2020) Scoring Rubric</h3>
      <table>
        <thead>
          <tr>
            <th class='criteria-col'>Evaluation Criterion</th>
            <th>Exemplary (90-100%)</th>
            <th>Proficient (75-89%)</th>
            <th>Developing (50-74%)</th>
            <th>Beginning (&lt;50%)</th>
          </tr>
        </thead>
        <tbody>
          ${rubric.criteria
            .map(
              (c) => `
            <tr>
              <td class='criteria-col'>${c.criterionName}<br><span style='color:#64748b; font-weight:normal;'>(${c.marksAllocated} Marks)</span></td>
              <td class='level-col'>${c.exemplary}</td>
              <td class='level-col'>${c.proficient}</td>
              <td class='level-col'>${c.developing}</td>
              <td class='level-col'>${c.beginning}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div class='box'>
        <h4>Recommended Authentic Classroom Activities</h4>
        <ul>
          ${rubric.suggestedActivities.map((act) => `<li>${act}</li>`).join("")}
        </ul>

        <h4 style='margin-top: 12px;'>Teacher Observation & Portfolio Checklist</h4>
        <ul>
          ${rubric.teacherObservationChecklist.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div style='margin-top: 40px; display: flex; justify-content: space-between;'>
        <div><strong>Subject Teacher Signature:</strong> ______________________</div>
        <div style='text-align: right;'><strong>Principal / Academic Coordinator:</strong> ______________________</div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = (rubric.componentTitle || "Internal_Assessment_Rubric").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.download = `${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Yearly & Term-Wise Syllabus Plan as Word (.doc)
export function exportSyllabusPlannerToWordDoc(planner: AcademicSyllabusPlanner): void {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${planner.subject} - Annual Syllabus Distribution Plan</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; color: #1e293b; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
        h1 { font-size: 16pt; margin: 0 0 5px 0; color: #0f172a; }
        .meta { font-size: 10pt; color: #475569; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; font-size: 9.5pt; }
        th, td { border: 1px solid #cbd5e1; padding: 7px 9px; vertical-align: top; }
        th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; }
        .summary-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 15px; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class='header'>
        <h1>Annual Syllabus &amp; Instructional Period Distribution Plan</h1>
        <div class='meta'>
          <strong>Subject:</strong> ${planner.subject} &nbsp;|&nbsp;
          <strong>Grade:</strong> ${planner.grade} &nbsp;|&nbsp;
          <strong>Board:</strong> ${planner.curriculum} &nbsp;|&nbsp;
          <strong>Academic Session:</strong> ${planner.academicYear}
        </div>
      </div>

      <div class='summary-box'>
        <strong>Instructional Overview:</strong> Total Periods: ${planner.totalInstructionalPeriods} &nbsp;|&nbsp;
        Theory Teaching: ${planner.theoryPeriods} Periods &nbsp;|&nbsp;
        Revision &amp; Pre-Board Buffers: ${planner.revisionAndBufferPeriods} Periods &nbsp;|&nbsp;
        Term 1 Weightage: ${planner.term1WeightageMarks}M &nbsp;|&nbsp;
        Term 2 Weightage: ${planner.term2WeightageMarks}M &nbsp;|&nbsp;
        Internal Assessment: ${planner.internalAssessmentTotalMarks}M
      </div>

      <h3>Unit-Wise &amp; Term-Wise Distribution Table</h3>
      <table>
        <thead>
          <tr>
            <th style='width: 7%;'>Unit</th>
            <th style='width: 25%;'>Unit Title &amp; Chapters</th>
            <th style='width: 8%;'>Term</th>
            <th style='width: 10%;'>Month</th>
            <th style='width: 10%;'>Periods</th>
            <th style='width: 12%;'>Marks (Th + Int)</th>
            <th style='width: 28%;'>Key Competencies &amp; Scheduled Assessment</th>
          </tr>
        </thead>
        <tbody>
          ${planner.units
            .map(
              (u) => `
            <tr>
              <td style='text-align: center; font-weight: bold;'>${u.unitNumber}</td>
              <td><strong>${u.unitTitle}</strong><br><span style='color: #475569; font-size: 9pt;'>${u.chapters.join(", ")}</span></td>
              <td style='text-align: center;'>${u.term}</td>
              <td>${u.scheduledMonth}</td>
              <td style='text-align: center;'>${u.suggestedPeriods} Periods</td>
              <td style='text-align: center;'>${u.theoryMarks}M Th + ${u.practicalOrInternalMarks}M Int</td>
              <td><strong>${u.assessmentType}</strong><br><span style='font-size: 8.5pt; color: #334155;'>${u.keyCompetencies.join("; ")}</span></td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h3>Scheduled Examination Milestones &amp; Portions</h3>
      <table>
        <thead>
          <tr>
            <th>Examination / Milestone</th>
            <th>Tentative Month</th>
            <th>Portion Covered</th>
            <th>Weightage</th>
          </tr>
        </thead>
        <tbody>
          ${planner.examMilestones
            .map(
              (m) => `
            <tr>
              <td><strong>${m.examName}</strong></td>
              <td>${m.month}</td>
              <td>${m.portionCovered}</td>
              <td>${m.weightage}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <div style='margin-top: 40px; display: flex; justify-content: space-between;'>
        <div><strong>Prepared by Subject Teacher:</strong> ______________________</div>
        <div style='text-align: right;'><strong>HOD / Principal Approval:</strong> ______________________</div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = `${planner.grade}_${planner.subject}_Syllabus_Plan`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  a.download = `${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
