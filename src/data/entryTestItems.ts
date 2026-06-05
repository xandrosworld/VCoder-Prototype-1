import type { ArtifactScenario, MCQQuestion } from "../types/domain";

export const p1Questions: MCQQuestion[] = [
  {
    id: "p1-1",
    stem: "AI generated a login endpoint and all CI tests pass. What should you do first before accepting the PR?",
    axis: 2,
    difficulty: 2,
    options: [
      { key: "A", text: "Merge because green CI proves the change is safe." },
      { key: "B", text: "Read the diff and inspect auth, input validation, secrets, and failure paths." },
      { key: "C", text: "Ask the AI if the code is secure and accept its answer." },
      { key: "D", text: "Only check formatting because AI usually handles logic correctly." }
    ],
    correctKey: "B",
    rationale: "CI green is useful but not sufficient for AI-generated auth code."
  },
  {
    id: "p1-2",
    stem: "Which code pattern is the strongest SQL injection warning?",
    axis: 4,
    difficulty: 3,
    codeBlock: "query = f\"SELECT * FROM users WHERE email = '{email}'\"",
    options: [
      { key: "A", text: "String interpolation inside a SQL query." },
      { key: "B", text: "A variable named email." },
      { key: "C", text: "Returning a list of users." },
      { key: "D", text: "Using a database table named users." }
    ],
    correctKey: "A",
    rationale: "Untrusted input interpolated into SQL should be parameterized."
  },
  {
    id: "p1-3",
    stem: "A coding agent asks for permission to read `.env` while fixing a UI bug. What is the safest response?",
    axis: 5,
    difficulty: 3,
    options: [
      { key: "A", text: "Allow it because agents need full context." },
      { key: "B", text: "Deny and provide a sanitized config contract instead." },
      { key: "C", text: "Paste the secrets manually into the prompt." },
      { key: "D", text: "Let it read the file but ask it not to leak secrets." }
    ],
    correctKey: "B",
    rationale: "Tool boundaries should prevent unnecessary secret access."
  },
  {
    id: "p1-4",
    stem: "When should tests be written before accepting AI-generated code?",
    axis: 4,
    difficulty: 2,
    options: [
      { key: "A", text: "Only after users report a bug." },
      { key: "B", text: "Before accepting behavior changes, edge cases, and security-sensitive code." },
      { key: "C", text: "Never, because AI can write tests after implementation." },
      { key: "D", text: "Only for frontend styling changes." }
    ],
    correctKey: "B",
    rationale: "Tests are evidence before accepting behavior from AI."
  },
  {
    id: "p1-5",
    stem: "A prompt says: 'Build export data feature.' What is the best improvement?",
    axis: 1,
    difficulty: 2,
    options: [
      { key: "A", text: "Add context, scope, constraints, acceptance criteria, and off-limits data." },
      { key: "B", text: "Ask AI to make it production-ready." },
      { key: "C", text: "Ask AI to do whatever it thinks is best." },
      { key: "D", text: "Remove details to avoid biasing the model." }
    ],
    correctKey: "A",
    rationale: "Scoped prompts reduce ambiguity and unsafe agent behavior."
  },
  {
    id: "p1-6",
    stem: "After accepting AI changes, the app crashes with a stack trace. What is the best first recovery behavior?",
    axis: 3,
    difficulty: 2,
    options: [
      { key: "A", text: "Paste the whole repo into AI and keep applying fixes." },
      { key: "B", text: "Read the stack trace, identify the failing line, and compare recent AI commits." },
      { key: "C", text: "Restart the machine." },
      { key: "D", text: "Delete the feature branch immediately." }
    ],
    correctKey: "B",
    rationale: "Recovery starts with triage and a known-good baseline."
  },
  {
    id: "p1-7",
    stem: "Which finding is severe enough to block accepting an AI-generated login PR?",
    axis: 2,
    difficulty: 4,
    options: [
      { key: "A", text: "A variable could be renamed." },
      { key: "B", text: "The endpoint compares plaintext passwords and returns a hardcoded token." },
      { key: "C", text: "The function is 20 lines long." },
      { key: "D", text: "The code uses single quotes." }
    ],
    correctKey: "B",
    rationale: "Auth flaws and hardcoded secrets are blocker-level issues."
  },
  {
    id: "p1-8",
    stem: "What is the right accept/reject decision when AI adds a payment export endpoint without authorization checks?",
    axis: 2,
    difficulty: 4,
    options: [
      { key: "A", text: "Accept and create a follow-up task." },
      { key: "B", text: "Reject or ask for revision before merge, with tests proving unauthorized access is blocked." },
      { key: "C", text: "Accept because the endpoint is internal." },
      { key: "D", text: "Hide the route in the UI." }
    ],
    correctKey: "B",
    rationale: "Authorization is not a cosmetic follow-up."
  }
];

export const p2AuditScenario: ArtifactScenario = {
  id: "p2-login-audit",
  title: "P2 Code Audit: AI generated a login API",
  partType: "audit",
  axis: 2,
  difficulty: 4,
  scenario: "AI generated a login API. Audit it before accepting the PR.",
  codeBlock: `def login(request, db):
    email = request.json["email"]
    password = request.json["password"]
    user = db.query(f"SELECT * FROM users WHERE email = '{email}'").first()
    if user.password == password:
        token = "sk-live-demo-hardcoded-token"
        return {"token": token, "user_id": user.id}
    return {"error": "invalid credentials"}, 401`,
  answerFields: ["location", "type", "severity", "why", "proposed_fix"],
  rubricRef: "rubric://axis-2/anchors#L0-L2"
};

export const p3RecoveryScenario: ArtifactScenario = {
  id: "p3-recovery",
  title: "P3 Recovery / Debug",
  partType: "recovery",
  axis: 3,
  difficulty: 3,
  scenario: "After accepting AI-generated changes, the checkout service fails in production-like staging.",
  stackTrace: `TypeError: Cannot read properties of undefined (reading 'map')
    at buildExportRows (src/features/export/buildExportRows.ts:42:21)
    at handleExportRequest (src/routes/export.ts:87:14)
    at async Router.dispatch`,
  answerFields: ["triage", "recovery_steps", "rollback_or_fix_forward", "rationale"],
  rubricRef: "rubric://axis-3/anchors#L0-L2"
};

export const p4PromptPlanScenario: ArtifactScenario = {
  id: "p4-prompt-plan",
  title: "P4 Prompt / Plan",
  partType: "prompt_plan",
  axis: 1,
  difficulty: 3,
  scenario: "The product request is intentionally vague.",
  taskBrief: "Thêm tính năng cho người dùng xuất dữ liệu của họ.",
  answerFields: ["plan", "scoped_prompt", "constraints", "acceptance_criteria", "off_limits"],
  rubricRef: "rubric://axis-1/anchors#L0-L2"
};

export const p5VivaQuestions: Array<{ id: string; axis: 4 | 5; prompt: string }> = [
  {
    id: "p5-1",
    axis: 4,
    prompt: "Explain SQL injection in P2. Why is string interpolation dangerous and how should it be fixed?"
  },
  {
    id: "p5-2",
    axis: 4,
    prompt: "When should you write tests before accepting AI-generated code?"
  },
  {
    id: "p5-3",
    axis: 5,
    prompt: "Where should guardrails live for an AI agent that calls external tools?"
  }
];
