import type { GateExam } from "../types/domain";

export const gateExam: GateExam = {
  id: "gate-l1-to-l2",
  level: "L1",
  focusAxes: [1, 2, 3, 4],
  numberOfQuestions: 10,
  passThreshold: 80,
  difficultyDistribution: { 2: 3, 3: 5, 4: 2 },
  questions: [
    {
      id: "gate-1",
      stem: "Which prompt gives an AI coding agent the clearest safe scope?",
      axis: 1,
      difficulty: 2,
      options: [
        { key: "A", text: "Build the feature however you think is best." },
        { key: "B", text: "Inspect export service, propose a plan first, change only export files, exclude secrets, add tests." },
        { key: "C", text: "Make it production ready and fast." },
        { key: "D", text: "Rewrite the app around this feature." }
      ],
      correctKey: "B",
      rationale: "The prompt has context, plan-first control, constraints, and tests."
    },
    {
      id: "gate-2",
      stem: "Which issue should block a generated login PR?",
      axis: 2,
      difficulty: 3,
      options: [
        { key: "A", text: "Hardcoded token returned after plaintext password comparison." },
        { key: "B", text: "A comment is missing." },
        { key: "C", text: "The variable name is short." },
        { key: "D", text: "The file is longer than expected." }
      ],
      correctKey: "A",
      rationale: "This is a severe auth/security failure."
    },
    {
      id: "gate-3",
      stem: "A generated SQL query uses template strings with request input. What is the best fix?",
      axis: 4,
      difficulty: 3,
      options: [
        { key: "A", text: "Escape only double quotes." },
        { key: "B", text: "Use a parameterized query and validate input shape." },
        { key: "C", text: "Ask AI if the input is safe." },
        { key: "D", text: "Hide the endpoint behind a button." }
      ],
      correctKey: "B",
      rationale: "Parameterization and validation address injection risk."
    },
    {
      id: "gate-4",
      stem: "What is the best first step after an AI-generated commit breaks the build?",
      axis: 3,
      difficulty: 2,
      options: [
        { key: "A", text: "Read the stack trace and identify the first failing project frame." },
        { key: "B", text: "Apply more AI fixes until it passes." },
        { key: "C", text: "Delete tests." },
        { key: "D", text: "Merge and fix later." }
      ],
      correctKey: "A",
      rationale: "Recovery starts with triage."
    },
    {
      id: "gate-5",
      stem: "When reviewing AI-generated code, which decision note is strongest?",
      axis: 2,
      difficulty: 4,
      options: [
        { key: "A", text: "Looks good." },
        { key: "B", text: "Reject until auth ownership and SQL injection tests pass; current diff exposes cross-user data." },
        { key: "C", text: "AI said it is safe." },
        { key: "D", text: "Merge because the demo needs it." }
      ],
      correctKey: "B",
      rationale: "It ties decision to evidence and tests."
    },
    {
      id: "gate-6",
      stem: "Which test should be written before accepting an export-data endpoint?",
      axis: 4,
      difficulty: 3,
      options: [
        { key: "A", text: "Valid user can export their own data and another user's data returns 403." },
        { key: "B", text: "Button is blue." },
        { key: "C", text: "AI can explain the endpoint." },
        { key: "D", text: "The function has a comment." }
      ],
      correctKey: "A",
      rationale: "The test proves ownership and the happy path."
    },
    {
      id: "gate-7",
      stem: "Which item belongs in a recovery note?",
      axis: 3,
      difficulty: 3,
      options: [
        { key: "A", text: "The model name only." },
        { key: "B", text: "Triage, suspected commit, rollback/fix-forward choice, and regression test." },
        { key: "C", text: "A screenshot of the homepage." },
        { key: "D", text: "A request for AI to try anything." }
      ],
      correctKey: "B",
      rationale: "It captures recovery discipline."
    },
    {
      id: "gate-8",
      stem: "What should be off-limits in a prompt to an agent fixing a UI bug?",
      axis: 5,
      difficulty: 4,
      options: [
        { key: "A", text: ".env files, production secrets, billing routes, and unrelated auth code." },
        { key: "B", text: "All tests." },
        { key: "C", text: "The component being fixed." },
        { key: "D", text: "The style guide." }
      ],
      correctKey: "A",
      rationale: "Tool and scope boundaries reduce agent risk."
    },
    {
      id: "gate-9",
      stem: "Which statement best describes AI-Ready threshold?",
      axis: 4,
      difficulty: 2,
      options: [
        { key: "A", text: "Average score only." },
        { key: "B", text: "A1>=L2, A2>=L2, A3>=L1, A4>=L2; A5 measured but not a gate." },
        { key: "C", text: "A5 is the only required axis." },
        { key: "D", text: "Passing one MCQ is enough." }
      ],
      correctKey: "B",
      rationale: "This is the canonical readiness rule."
    },
    {
      id: "gate-10",
      stem: "A model-generated answer includes a fake API key in source code. What should happen?",
      axis: 4,
      difficulty: 3,
      options: [
        { key: "A", text: "Merge because fake keys are harmless." },
        { key: "B", text: "Block merge, remove the secret, rotate if real, and add secret scanning or review checks." },
        { key: "C", text: "Hide it in a comment." },
        { key: "D", text: "Ask users not to look at the repository." }
      ],
      correctKey: "B",
      rationale: "Secret handling is a blocking engineering foundation issue."
    }
  ]
};
