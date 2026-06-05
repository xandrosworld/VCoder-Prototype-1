import type { Lab } from "../types/domain";

export const labs: Lab[] = [
  {
    id: "lab-prompt-plan",
    nodeId: "node-1",
    title: "Prompt / Plan Checkpoint: Export User Data",
    type: "prompt_plan_lab",
    scenario: "A product manager asks: 'Thêm tính năng cho người dùng xuất dữ liệu của họ.'",
    instructions: "Write a plan and scoped prompt that controls the AI agent before implementation.",
    answerFields: ["plan", "scoped_prompt", "constraints", "acceptance_criteria", "off_limits"],
    rubricPreview: ["Plan before code", "Scoped prompt", "Context included", "Acceptance criteria", "Security constraints"],
    targetEvidence: "Prompt includes user-owned data boundary, no secrets, and tests for unauthorized access.",
    strongSample: "Plan: clarify export scope, implement CSV for authenticated user's own profile/orders only, add 403 tests. Prompt: inspect existing export service, propose plan first, do not touch billing/admin, exclude secrets and internal IDs, done when tests cover own data and cross-user denial.",
    weakSample: "Ask AI: add export data feature quickly and make it production ready."
  },
  {
    id: "lab-audit-review",
    nodeId: "node-2",
    title: "Audit Lab: Login PR Review",
    type: "audit_lab",
    scenario: "AI generated a login API using interpolated SQL, plaintext password comparison, and a hardcoded token.",
    instructions: "List findings with location, type, severity, why, and proposed fix. End with accept/revise/reject.",
    answerFields: ["location", "type", "severity", "why", "proposed_fix", "decision"],
    rubricPreview: ["Find SQL injection", "Find hardcoded secret", "Find plaintext password comparison", "Catch missing user check", "Decision explains why"],
    targetEvidence: "At least three security/logic findings and a reject/revise decision.",
    strongSample: "Line 4 SQLi critical: f-string with email, use parameterized query. Line 5 missing user check, can crash and leak behavior. Line 5 plaintext password compare, use password_hash verify. Line 6 hardcoded sk token critical, use signed token config. Decision: reject until fixed and tests added.",
    weakSample: "Looks okay, maybe rename variables. I would merge after asking AI if it is safe."
  },
  {
    id: "lab-recovery-stacktrace",
    nodeId: "node-3",
    title: "Recovery Lab: Broken Export Build",
    type: "recovery_lab",
    scenario: "After accepting generated export changes, staging crashes on `rows.map` because `rows` is undefined.",
    instructions: "Write triage, recovery steps, rollback/fix-forward decision, and rationale.",
    answerFields: ["triage", "recovery_steps", "rollback_or_fix_forward", "rationale"],
    rubricPreview: ["Reads stack trace first", "Inspects recent AI diff", "Names known-good checkpoint", "Chooses rollback or narrow fix", "Adds a regression test"],
    targetEvidence: "Recovery note with safe rollback or fix-forward reasoning.",
    strongSample: "Triage: first project frame is buildExportRows line 42; rows undefined after AI changed repository return. Inspect last three AI commits. Fix-forward if only missing default: return [] and add regression test. Rollback if diff also changed auth/export semantics. I choose rollback to last green commit then reapply narrow patch with test.",
    weakSample: "Paste the stack trace into AI and accept the next fix. Restart if it still fails."
  },
  {
    id: "lab-tests-before-ai",
    nodeId: "node-4",
    title: "MCQ Checkpoint: Tests before Accepting AI Code",
    type: "mcq_checkpoint",
    scenario: "You need to decide which tests must exist before accepting generated code.",
    instructions: "Choose the strongest test plan for a user data export endpoint.",
    answerFields: ["selected_option", "why"],
    rubricPreview: ["Negative path covered", "Authorization covered", "Behavior tested before acceptance", "No reliance on AI self-review"],
    targetEvidence: "Test plan covers own data, cross-user denial, and invalid input.",
    strongSample: "Tests first: valid user exports own data; another user's data returns 403; malformed format returns 400; secrets/internal fields are excluded.",
    weakSample: "Run the app manually and ask AI to write tests after it builds the endpoint."
  },
  {
    id: "lab-secrets-auth",
    nodeId: "node-5",
    title: "Audit Lab: Secrets and Input Validation",
    type: "audit_lab",
    scenario: "A generated PR adds a token to source code and uses request parameters directly in a query.",
    instructions: "Block merge and describe the minimum secure revision.",
    answerFields: ["finding", "severity", "fix", "test"],
    rubricPreview: ["Secret removed", "Query parameterized", "Ownership check added", "Negative test included"],
    targetEvidence: "Security block note with concrete fixes.",
    strongSample: "Reject. Remove token from source, rotate it, parameterize query, validate input, check resource ownership server-side, add tests for injected input and cross-user access.",
    weakSample: "Move the token into a different file and merge because this is only a demo."
  },
  {
    id: "lab-agent-guardrails",
    nodeId: "node-6",
    title: "Prompt/Plan Lab: Agent Tool Guardrails",
    type: "prompt_plan_lab",
    scenario: "An AI coding agent can search the repo, edit files, call a ticket API, and send Slack messages.",
    instructions: "Design tool boundaries, approvals, redaction, and observability.",
    answerFields: ["allowed_tools", "approval_required", "blocked_data", "logging", "human_override"],
    rubricPreview: ["Tool permissions explicit", "Secrets blocked", "External calls gated", "Audit log named", "Human override included"],
    targetEvidence: "Guardrail policy for external tool calls.",
    strongSample: "Allow read-only repo search. Require approval for file writes and ticket updates. Block `.env`, tokens, personal data. Slack sending requires human review. Log prompts/tool calls/blocked attempts with secret redaction and rollback link.",
    weakSample: "Give all tools to the agent because it needs autonomy, then review the final result."
  }
];
