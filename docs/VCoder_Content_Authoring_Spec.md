**VCoder**

Nền tảng AI-Ready Developer

CONTENT AUTHORING SPECIFICATION

Đặc tả Soạn Nội dung (Item Bank, Learning Content, Ground-truth, Rubric Config)

*Nội dung được soạn và lưu như thế nào — schema từng loại item, ground-truth, và ánh xạ về Data Model*

| **Hạng mục**    | **Nội dung**                                                                 |
|-----------------|------------------------------------------------------------------------------|
| Phiên bản       | 0.1 (Draft)                                                                  |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                                              |
| Ngày            | 05/06/2026                                                                   |
| Trạng thái      | Đang soạn — chờ review                                                       |
| Đồng bộ với     | Data Model v0.2 · Rubric v0.2 · Assessment Blueprint v0.1 · Ground-truth Spec v0.1 · Judge Prompt Spec v0.1 · LearningNode Design Spec v0.1 · ADR-009/010/011 |

---

## 1. Mục đích & cách dùng tài liệu

Tài liệu này là **hợp đồng soạn nội dung** cho VCoder: nó quy định *chính xác cấu trúc JSON* của mọi nội dung mà hệ thống cần — đề test (P1–P5), nội dung bài học, đề checkpoint/Capstone/Gate Exam, ground-truth gold label, và cấu hình rubric. Nó trả lời câu hỏi: "Một người viết đề ngồi xuống soạn một item thì phải điền những trường gì, theo schema nào, để backend seed và validate được?"

**Phân biệt rõ ba tài liệu liên quan:**
- **Data Model (file 08)** = *storage-model*: bảng, cột, kiểu, quan hệ. Trả lời "dữ liệu lưu ở đâu".
- **Tài liệu này** = *write-model / authoring contract*: cấu trúc bên trong các cột JSONB (`payload`, `answer_key`, `ground_truth`, `body`). Trả lời "nội dung cột đó có hình gì".
- **Assessment Blueprint / Rubric / Judge Prompt Spec** = *design intent*: item này đo trục nào, ở Bloom nào, chấm theo anchor nào. Trả lời "vì sao item trông như vậy".

**Người đọc chính:** người viết item bank, người gán ground-truth, dev backend (viết Pydantic model + seed), QA (viết validation test).

**Nguyên tắc gốc của tài liệu (theo quyết định hội đồng 05/06):**
> **Đơn giản ở số lượng và ở storage; kỷ luật ở schema và ở contract.** Một bảng `Problem` polymorphic, ít item (một lát cắt dọc đủ demo), JSONB linh hoạt — nhưng mỗi cột JSONB có schema Pydantic versioned bắt buộc, mọi item artifact bắt buộc kèm ground-truth, và enum chừa sẵn đường mở rộng V1. Mở rộng về sau là *thêm* (row / optional field / enum value / module), không phải *sửa* (migrate / đổi contract / refactor).

---

## 2. Nguyên tắc soạn nội dung (đọc trước khi viết item)

1. **Mọi item neo về 5 trục canonical.** Trục là `1..5` (A1 AI Direction, A2 Output Evaluation, A3 Recovery & Debug, A4 Engineering Foundations, A5 AI Product Architecture). Không tự đặt tên/số khác (Rubric §2, chống R5).
2. **Mọi item khai báo design intent.** Mỗi item bắt buộc có `axis`, `target_level`, `bloom`, `difficulty`. Item artifact thêm `judge_rubric_ref` (trỏ anchor trong rubric). Item rời design intent = item không hợp lệ.
3. **Quy tắc vàng cho item artifact (P2–P5, checkpoint artifact):** một item artifact **không hợp lệ** nếu thiếu `ground_truth` (gold label) hoặc `judge_rubric_ref`. Đề mà không có chuẩn để judge bám và để validate judge thì vô nghĩa (Ground-truth Spec §1, Judge Prompt Spec §2). Đây là phản chiếu "quy tắc vàng" của LearningNode Spec: node thiếu `target_evidence` thì không phải learning node.
4. **MCQ chấm tất định, artifact chấm bằng LLM judge.** P1 + mọi Gate Exam/Capstone-MCQ bắt buộc có `answer_key` (ADR-009, ADR-011). P2–P5 + checkpoint artifact bắt buộc có `ground_truth` + `judge_rubric_ref`.
5. **Một chuẩn đo duy nhất xuyên test và learning path.** Checkpoint của learning node BẮT BUỘC tái dùng anchor (Rubric §4) + judge prompt khuôn (Judge Prompt Spec) y như bài test. Node KHÔNG tự chế cách chấm (LearningNode Spec §1, chống R5).
6. **Ngưỡng pass = 80% cho mọi bài** (ADR-007), là tham số trong rubric config, không hardcode rải rác.
7. **Nội dung thật, không "lorem ipsum".** Seed V0 dùng nội dung thật, dễ hiểu trong 2 phút khi demo (Charter §8, Project Plan "Done").
8. **Mỗi cột JSONB mang `schema_version`** (seam mở rộng — xem §12). Cho phép đổi cấu trúc nội dung ở V1 mà không vỡ data V0.

---

## 3. Enum canonical (nguồn: Data Model §6 — KHÔNG tự thêm giá trị khi chưa được Lead duyệt)

| Enum | Giá trị hợp lệ V0 | Ghi chú mở rộng |
| --- | --- | --- |
| `axis` | `1, 2, 3, 4, 5` | Cố định (canonical) |
| `level` | `L0, L1, L2, L3, L4` | Cố định (canonical) |
| `part_type` | `mcq, audit, recovery, prompt_plan, viva` | Cho phần của test đầu vào |
| `problem_type` | `mcq, audit, recovery, capstone, gate` | Phân loại đề trong item bank |
| `scoring_method` | `deterministic, llm_judge` | `deterministic` cho MCQ; `llm_judge` cho artifact |
| `content_type` | `markdown, video_url, external_link` | Cho LearningContent |
| `readiness` | `foundation_needed, developing, ai_ready, advanced` | Tính theo công thức Rubric §5.2 |
| `node_status` | `locked, available, in_progress, completed` | Tiến độ node (không phải nội dung) |
| `difficulty` | `1, 2, 3, 4, 5` | Để rút đề giữ phân bố độ khó |

**Quy ước kỹ thuật (đồng bộ Data Model + API Contract):** field JSON dùng `snake_case`; ID là UUID v4; thời gian ISO-8601 UTC. Enum trong JSONB lưu dạng **string** (không phải native PostgreSQL enum) để V1 thêm giá trị mới chỉ cần cập nhật Pydantic `Literal`, không phải migration (seam §12.2).

---

## 4. Ma trận loại item × field bắt buộc (TRA CỨU TRƯỚC KHI SOẠN)

Đây là bảng chống FM3 (seed sai field). `Problem` là một bảng polymorphic; mỗi loại bắt buộc một tập field khác nhau. ✓ = bắt buộc · ○ = optional · — = không dùng (nên để null).

| Field (trong Problem) | P1 / Gate / Capstone-MCQ (`mcq`) | P2 Audit (`audit`) | P3 Recovery (`recovery`) | P4 Prompt/Plan | P5 Viva | Capstone artifact |
| --- | --- | --- | --- | --- | --- | --- |
| `part_type` | `mcq` | `audit` | `recovery` | `prompt_plan` | `viva` | (nullable) |
| `problem_type` | `mcq`/`gate`/`capstone` | `audit` | `recovery` | `audit`* | `audit`* | `capstone` |
| `axis` | ✓ | `2` | `3` | `1` | `4,5` (multi) | ✓ |
| `difficulty` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `payload` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `answer_key` | ✓ | ✓ (bug_set) | — | — | — | — |
| `ground_truth` | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| `judge_rubric_ref` | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| `scoring_method` (AxisScore) | `deterministic` | `llm_judge` | `llm_judge` | `llm_judge` | `llm_judge` | `llm_judge` |

*Lưu ý:* `part_type` chỉ áp cho item thuộc **test đầu vào**; item thuộc node/Gate Exam để `part_type = null` và dùng `problem_type`. `problem_type` của P2/P3/P4/P5 trong item bank hiện tận dụng giá trị gần nhất (`audit`/`recovery`); nếu Lead muốn giá trị `problem_type` riêng cho `prompt_plan`/`viva`, đó là một thay đổi enum nhỏ — ghi nhận ở §12 (Open question O1), KHÔNG tự thêm.

**CHECK constraint đề xuất (tầng ứng dụng + DB):**
- Nếu `problem_type = mcq | gate` ⇒ `answer_key IS NOT NULL`.
- Nếu `part_type IN (audit, recovery, prompt_plan, viva)` HOẶC `problem_type = capstone` ⇒ `ground_truth IS NOT NULL AND judge_rubric_ref IS NOT NULL`.
- `axis ∈ 1..5`; `difficulty ∈ 1..5`.
- Đúng một trong hai (`node_id`, `exam_id`) khác null đối với đề thuộc node hoặc Gate Exam; đề thuộc test đầu vào để cả hai null (gắn qua Assessment.part_answers).

---

## 5. Template P1 — MCQ phân loại (chấm tất định)

**Design intent (Blueprint §5 P1, Rubric §6):** đo A4 ~50% (test/security/git/secret) + 1–2 câu tình huống mỗi trục A1/A2/A3/A5. ≥40% câu ở mức Apply/Analyse (tình huống), không toàn định nghĩa. Mỗi đáp án sai (distractor) phải phản ánh một hiểu lầm thật.

**`payload` schema:**
```json
{
  "schema_version": "p1-mcq-v0.1",
  "stem": "Bạn nhận một PR do AI sinh, thêm endpoint đăng nhập. Việc ĐẦU TIÊN nên làm là gì?",
  "code_block": null,
  "code_lang": null,
  "options": [
    { "key": "A", "text": "Merge ngay vì test xanh" },
    { "key": "B", "text": "Đọc diff, soi xử lý auth & input trước khi merge" },
    { "key": "C", "text": "Chạy lại prompt cho AI tự review" },
    { "key": "D", "text": "Hỏi AI 'code này có an toàn không?' rồi tin câu trả lời" }
  ],
  "shuffle_options": true
}
```
- `code_block` (nullable): đoạn code đính kèm khi câu hỏi tình huống cần (FE render dạng block theo `code_lang`).
- `shuffle_options`: FE có thể xáo thứ tự hiển thị; `answer_key` luôn neo theo `key`, không theo vị trí.

**`answer_key` schema:**
```json
{
  "schema_version": "p1-key-v0.1",
  "correct_keys": ["B"],
  "multi_select": false,
  "distractor_rationale": {
    "A": "Test xanh không đảm bảo an toàn auth — đây là L0 accept-all",
    "C": "Giao review lại cho AI là vòng lặp tin AI mù — không phải Output Evaluation",
    "D": "Tin câu trả lời tự khẳng định của AI là L0"
  },
  "axis_touch": { "primary": 4, "secondary": [2] },
  "explain_required": false
}
```
- `correct_keys`: chấm tất định bằng so khớp tập hợp với lựa chọn học viên.
- `multi_select`: nếu `true`, đúng = trùng *toàn bộ* tập correct_keys (không thừa, không thiếu).
- `distractor_rationale`: bắt buộc cho mọi distractor (Blueprint §8 checklist).
- `explain_required`: nếu `true`, câu này yêu cầu học viên viết vài câu lý do → phần lý do đẩy sang P5-style cross-check (không tính vào điểm tất định, chỉ làm evidence A4/A5).

**Ví dụ điền đầy đủ — xem §13.1.**

---

## 6. Template P2 — Audit ngắn (LLM judge + ground-truth) — *đo A2*

**Design intent (Blueprint §5 P2, Rubric §4.2):** học viên đọc một đoạn code/diff do AI sinh, có cài sẵn 3–5 lỗi đã biết (≥1 security, ≥1 logic, ≥1 bẫy "AI tự tin nhưng sai"). Artifact = findings list: mỗi finding gồm *vị trí + loại + mức độ + vì sao*. Level: L0 không phát hiện; L1 bắt lỗi syntax rõ; L2 bắt security phổ biến + nhận lỗi logic + reasoning rõ.

**`payload` schema:**
```json
{
  "schema_version": "p2-audit-v0.1",
  "scenario": "Đoạn code dưới đây do AI sinh cho API đăng nhập. Hãy audit và liệt kê các lỗi bạn tìm thấy.",
  "code_block": "def login(req):\n    user = db.query(f\"SELECT * FROM users WHERE name='{req.name}'\")\n    if user.password == req.password:\n        token = 'sk-live-9f8a...hardcoded'\n        return {'token': token}\n",
  "code_lang": "python",
  "answer_template": {
    "instruction": "Mỗi finding điền: location (dòng/hàm), type, severity, why.",
    "fields": ["location", "type", "severity", "why"],
    "min_findings": 3
  }
}
```

**`answer_key` schema (bug_set — danh sách bug chuẩn + honeypot):** (Ground-truth Spec §3.4)
```json
{
  "schema_version": "p2-bugset-v0.1",
  "bugs": [
    { "id": "b1", "type": "security",  "severity": "critical", "location": "line 2", "desc": "SQL injection qua f-string" },
    { "id": "b2", "type": "security",  "severity": "critical", "location": "line 4", "desc": "Secret hardcode (sk-live-...)" },
    { "id": "b3", "type": "logic",     "severity": "major",    "location": "line 3", "desc": "So sánh password plaintext, không hash" }
  ],
  "honeypot": [
    { "id": "h1", "type": "subtle_auth", "severity": "critical", "desc": "Không kiểm user tồn tại trước khi đọc .password → có thể NoneType" }
  ],
  "scoring_hint": {
    "L0": "không tìm thấy bug nào hoặc chỉ bug cosmetic",
    "L1": "tìm ≥1 bug rõ ràng (vd hardcode) nhưng bỏ sót security nghiêm trọng",
    "L2": "tìm cả SQLi + secret + nhận lỗi logic, reasoning rõ; bắt honeypot là tín hiệu mạnh"
  }
}
```
> `bug_set` lưu trong `answer_key` (đề audit "tất định một phần": có danh sách bug đã biết) NHƯNG việc *chấm level* vẫn do LLM judge so findings ↔ bug_set + anchor → vì vậy P2 đồng thời cần `ground_truth` (gold label trên các bài làm mẫu). Đây là loại item phức tạp nhất, mang cả hai.

**`ground_truth` schema (gold label — chuẩn validate LLM judge):** (Ground-truth Spec §3.3)
```json
{
  "schema_version": "gt-v0.1",
  "rubric_version": "v0.2",
  "gold_samples": [
    {
      "gold_label_id": "GT-P2-001",
      "zone": "clear_pass",
      "student_artifact": "F1: line2 SQL injection, critical, cần parameterize. F2: line4 lộ secret, critical. F3: line3 so sánh plaintext, nên hash.",
      "gold_level": "L2",
      "gold_criteria": [
        { "name": "phát hiện security phổ biến", "met": true,  "note": "bắt cả SQLi + secret" },
        { "name": "nhận lỗi logic",              "met": true,  "note": "bắt plaintext compare" },
        { "name": "reasoning rõ",                "met": true,  "note": "nêu cách sửa" }
      ],
      "gold_evidence": [ { "quote": "line2 SQL injection", "where": "finding 1" } ],
      "gold_red_flags": [],
      "annotator_1": "Minh / L2",
      "annotator_2": "Mentor / L2",
      "inter_annotator_agree": "khớp",
      "resolution_note": ""
    },
    {
      "gold_label_id": "GT-P2-002",
      "zone": "clear_fail",
      "student_artifact": "Code trông ổn, chạy được, có trả token.",
      "gold_level": "L0",
      "gold_criteria": [ { "name": "phát hiện security phổ biến", "met": false, "note": "không thấy bug nào" } ],
      "gold_evidence": [],
      "gold_red_flags": [ { "type": "missed_critical_security", "note": "bỏ qua SQLi + secret" } ],
      "annotator_1": "Minh / L0",
      "annotator_2": "Mentor / L0",
      "inter_annotator_agree": "khớp",
      "resolution_note": ""
    },
    {
      "gold_label_id": "GT-P2-003",
      "zone": "borderline",
      "student_artifact": "Thấy secret hardcode (critical). Còn lại trông ổn.",
      "gold_level": "L1",
      "gold_criteria": [
        { "name": "phát hiện security phổ biến", "met": true,  "note": "bắt secret nhưng sót SQLi" },
        { "name": "nhận lỗi logic",              "met": false, "note": "bỏ qua plaintext" }
      ],
      "gold_evidence": [ { "quote": "secret hardcode", "where": "finding 1" } ],
      "gold_red_flags": [],
      "annotator_1": "Minh / L1",
      "annotator_2": "Mentor / L2",
      "inter_annotator_agree": "lệch 1 mức",
      "resolution_note": "Chốt L1: bắt 1/2 security nghiêm trọng, chưa đạt anchor L2 'bắt security phổ biến'"
    }
  ]
}
```

**`judge_rubric_ref`:** `"rubric://axis-2/anchors#L0-L2"` — trỏ tới ô anchor Axis 2 (Rubric §4.2) mà judge prompt nhúng nguyên văn (Judge Prompt Spec §2 nguyên tắc anchor-driven).

**Ví dụ điền đầy đủ — xem §13.2.**

---

## 7. Template P3 — Recovery ngắn (LLM judge + anchor) — *đo A3*

**Design intent (Blueprint §5 P3, Rubric §4.3):** đầu vào là một stack trace / repo ở trạng thái lỗi do AI gây ra. Artifact = recovery note: triage (đọc gì trước) + bước phục hồi + lý do chọn rollback/fix. Level: L0 restart/bỏ cuộc; L1 paste error vào AI thử đề xuất đầu; L2 đọc stack trace trước + biết rollback/checkpoint + nêu bước an toàn.

**`payload` schema:**
```json
{
  "schema_version": "p3-recovery-v0.1",
  "scenario": "Sau khi accept một loạt thay đổi do AI đề xuất, app crash. Dưới đây là stack trace. Viết recovery note.",
  "stack_trace": "Traceback (most recent call last):\n  File 'app.py', line 42, in checkout\n    total = cart.sum() * (1 - discount)\nTypeError: unsupported operand type(s) for *: 'NoneType' and 'float'",
  "repo_state_note": "3 commit gần nhất đều do AI sinh; chưa tạo checkpoint trước khi accept.",
  "answer_template": {
    "instruction": "Điền: triage (đọc/kiểm gì trước), recovery_steps (các bước), rationale (vì sao chọn rollback hay fix).",
    "fields": ["triage", "recovery_steps", "rationale"]
  }
}
```

**`ground_truth` schema:** dùng chung `gt-v0.1` (như §6), với `gold_criteria` neo anchor A3:
```json
{
  "schema_version": "gt-v0.1",
  "rubric_version": "v0.2",
  "gold_samples": [
    {
      "gold_label_id": "GT-P3-001",
      "zone": "clear_pass",
      "student_artifact": "Triage: đọc stack trace → discount là None. Kiểm 3 commit AI gần nhất. Bước: git revert tới commit ổn cuối, hoặc khởi tạo discount=0 mặc định; thêm guard. Rollback an toàn vì chưa có checkpoint.",
      "gold_level": "L2",
      "gold_criteria": [
        { "name": "đọc stack trace trước", "met": true },
        { "name": "biết rollback/checkpoint", "met": true },
        { "name": "nêu bước an toàn", "met": true }
      ],
      "gold_evidence": [ { "quote": "git revert tới commit ổn cuối", "where": "recovery_steps" } ],
      "gold_red_flags": [],
      "annotator_1": "Minh / L2",
      "annotator_2": "Mentor / L2",
      "inter_annotator_agree": "khớp"
    }
  ]
}
```
> Bộ gold đầy đủ phải phủ 3 vùng (≥30% clear_pass / ≥30% clear_fail / ~40% borderline) + ≥1 red flag — Ground-truth Spec §3.2. Ví dụ trên rút gọn 1 mẫu cho ngắn gọn.

**`judge_rubric_ref`:** `"rubric://axis-3/anchors#L0-L2"`. **Red flag liên quan:** "không biết rollback" (Blueprint §6).

---

## 8. Template P4 — Prompt/Plan (LLM judge + anchor) — *đo A1*

**Design intent (Blueprint §5 P4, Rubric §4.1, Judge Prompt Spec §6):** đầu vào là một yêu cầu task mơ hồ vừa phải (học viên phải tự scope). Artifact = plan trước + prompt có cấu trúc (context, constraints, acceptance criteria). Level theo criteria c1–c5, map level bằng luật cứng (Judge Prompt Spec §6): L0 prompt 1–2 turn không scope; L1 có iteration/context nhưng task còn lớn, thiếu acceptance; L2 scoped + constrained + plan-first + dạng CLAUDE.md.

**`payload` schema:**
```json
{
  "schema_version": "p4-promptplan-v0.1",
  "task_brief": "Sếp nói: 'Thêm tính năng cho người dùng xuất dữ liệu của họ.' Hãy viết plan + prompt bạn sẽ giao cho AI.",
  "ambiguity_note": "Đề cố ý mơ hồ: không nói định dạng, phạm vi dữ liệu, ràng buộc bảo mật.",
  "answer_template": {
    "instruction": "Điền: plan (các bước/scope), prompt (prompt có cấu trúc giao cho AI).",
    "fields": ["plan", "prompt"]
  }
}
```

**`ground_truth` schema (gt-v0.1) với criteria theo Judge Prompt Spec §6:**
```json
{
  "schema_version": "gt-v0.1",
  "rubric_version": "v0.2",
  "judge_criteria_def": [
    { "id": "c1", "name": "có plan trước khi prompt" },
    { "id": "c2", "name": "prompt scoped (task đủ nhỏ, rõ ranh giới)" },
    { "id": "c3", "name": "có context (file/ràng buộc/đầu vào)" },
    { "id": "c4", "name": "có acceptance criteria / định nghĩa done" },
    { "id": "c5", "name": "nêu constraints (bảo mật, off-limits, định dạng)" }
  ],
  "level_map_rule": "c1&c2&c3&c4&c5 → L2; (c1|c3) nhưng !c4 hoặc !c2 → L1; !c1&!c2 → L0",
  "gold_samples": [
    {
      "gold_label_id": "GT-P4-001",
      "zone": "clear_pass",
      "student_artifact": "Plan: 1) làm rõ dữ liệu nào, 2) chọn CSV+JSON, 3) chỉ dữ liệu của chính user (auth). Prompt: 'Trong file export.py, thêm hàm export_user_data(user_id) trả CSV; chỉ data thuộc user_id; không gồm field nhạy cảm; done khi có test cho user hợp lệ và user khác bị 403.'",
      "gold_level": "L2",
      "gold_criteria": [
        { "id": "c1", "met": true }, { "id": "c2", "met": true }, { "id": "c3", "met": true },
        { "id": "c4", "met": true }, { "id": "c5", "met": true }
      ],
      "gold_evidence": [ { "quote": "done khi có test cho user hợp lệ và user khác bị 403", "where": "prompt" } ],
      "annotator_1": "Minh / L2",
      "annotator_2": "Mentor / L2",
      "inter_annotator_agree": "khớp"
    }
  ]
}
```
> `judge_criteria_def` + `level_map_rule` cho phép judge hỏi criteria rời rạc (met/not met) rồi map level bằng *luật cứng*, KHÔNG để LLM tự suy level cuối (Judge Prompt Spec §6, nguyên tắc 2 & checklist). Đây là điểm khác biệt then chốt giữa P4 và P2/P3.

**`judge_rubric_ref`:** `"rubric://axis-1/anchors#L0-L2"`.

---

## 9. Template P5 — Mini-viva text (LLM judge + anchor) — *đo A4, A5 + cross-check*

**Design intent (Blueprint §5 P5, §5 cảnh báo tải):** 2–3 câu hỏi mở yêu cầu giải thích *reasoning* về chính bài làm P2–P4 + 1 scenario A5 (architecture). Vai trò kép: đo A5 + cross-check A1/A2/A3/A4 (học viên có thật hiểu bài mình làm không — chống gaming nhẹ). **Bắt buộc tách câu theo trục** để tránh một câu trả lời mơ hồ phải suy nhiều level.

**`payload` schema:**
```json
{
  "schema_version": "p5-viva-v0.1",
  "questions": [
    { "qid": "q1", "axis": 4, "kind": "cross_check", "prompt": "Ở P2 bạn nói line 2 có SQL injection. Giải thích vì sao f-string gây ra nó và cách sửa." },
    { "qid": "q2", "axis": 4, "kind": "foundation",  "prompt": "Khi nào bạn viết test trước khi accept code AI? Vì sao?" },
    { "qid": "q3", "axis": 5, "kind": "architecture", "prompt": "Nếu app này cần thêm một AI agent gọi tool ngoài, bạn lo nhất rủi ro gì và đặt guardrail ở đâu?" }
  ],
  "answer_template": { "instruction": "Trả lời từng câu theo qid.", "fields": ["qid", "answer"] }
}
```
> `kind = cross_check` → câu này dùng để đối chiếu với bài làm P2–P4 (phát hiện "làm được nhưng không giải thích được" → red flag "không giải thích được"). `axis` trên từng câu cho phép map evidence về đúng trục (A4 hoặc A5), tránh trộn.

**`ground_truth` schema (gt-v0.1) — gán theo từng câu:**
```json
{
  "schema_version": "gt-v0.1",
  "rubric_version": "v0.2",
  "gold_samples": [
    {
      "gold_label_id": "GT-P5-001",
      "zone": "clear_pass",
      "per_question": [
        { "qid": "q1", "axis": 4, "gold_level": "L2", "note": "giải thích đúng cơ chế + cách parameterize" },
        { "qid": "q3", "axis": 5, "gold_level": "L1", "note": "nhận ra rủi ro tool ngoài nhưng guardrail còn mơ hồ" }
      ],
      "cross_check_result": "consistent",
      "gold_red_flags": [],
      "annotator_1": "Minh",
      "annotator_2": "Mentor",
      "inter_annotator_agree": "khớp"
    }
  ]
}
```
> **A5 ít có ground-truth cứng** → dựa mạnh vào `confidence`/`abstain` của judge: câu A5 mơ hồ đẩy review (LearningNode Spec §5 lưu ý; Judge Prompt Spec §6 P5). `cross_check_result ∈ {consistent, inconsistent}`: `inconsistent` (làm được P2 nhưng q1 giải thích sai) → red flag "không giải thích được", hạ readiness.

**`judge_rubric_ref`:** `"rubric://axis-4,5/anchors"` (đa trục — judge xử từng câu theo `axis` của nó).

---

## 10. LearningNode & LearningContent (7 trường evidence-contract → field DB)

**Design intent (LearningNode Design Spec §2):** mỗi node phải *dẫn tới một artifact quan sát được*. 7 trường evidence-contract ánh xạ vào Data Model như sau:

| # | Trường evidence-contract | Lưu ở | Field |
| --- | --- | --- | --- |
| 1 | target_axis × level | `LearningNode` | `primary_axis`, `level` |
| 2 | target_evidence (artifact phải tạo) | `Problem` (checkpoint) | `payload.target_evidence` |
| 3 | scoring_method | `Problem` + Judge Prompt Spec | `judge_rubric_ref` / `answer_key` |
| 4 | anchor_ref | trỏ Rubric §4 | `Problem.judge_rubric_ref` |
| 5 | learn_content | `LearningContent` | `body` (markdown/link) |
| 6 | practice_activity | `LearningContent` | `body` (lesson kiểu practice) |
| 7 | checkpoint | `Problem` + `NodeProgress` | đề checkpoint + `capstone_passed` |

**`LearningContent.body` schema (theo `content_type`):**
```json
// content_type = markdown
{ "schema_version": "lc-md-v0.1", "markdown": "# Scoped prompting\n\nWorked example: ...\n\n## Predict next step\n..." }

// content_type = external_link
{ "schema_version": "lc-link-v0.1", "url": "https://docs.anthropic.com/.../prompt-engineering", "title": "Anthropic prompting guide", "note": "Đọc phần 'be clear and direct'" }

// content_type = video_url
{ "schema_version": "lc-video-v0.1", "url": "https://...", "title": "...", "duration_sec": 480 }
```

**Phân tầng node (LearningNode Spec §4) — quyết định checkpoint loại nào:**
- **Learn node (nhẹ):** checkpoint = MCQ retrieval / predict-next-step → `Problem(problem_type=mcq)` + `answer_key`.
- **Checkpoint node (có gate):** checkpoint = artifact + LLM judge đầy đủ → `Problem(problem_type=audit|recovery|...)` + `ground_truth` + `judge_rubric_ref`.
- **Capstone node:** artifact lớn + judge + cross-check → `Problem(problem_type=capstone)`.

**Quy tắc node hợp lệ (LearningNode Spec §7 checklist, áp khi soạn):** điền đủ 7 trường; trường 2 là artifact cụ thể (không phải "hiểu về X"); checkpoint tái dùng anchor + judge prompt khuôn (không tự chế chấm); ngưỡng pass = 80%.

---

## 11. Checkpoint / Capstone / Gate Exam item

### 11.1 Checkpoint & Capstone item
Tái dùng template P1–P5 ở §5–§9 tùy artifact cần đo, chỉ khác cách gắn:
- Gắn `node_id` (không gắn `exam_id`); `part_type = null`; dùng `problem_type ∈ {mcq, audit, recovery, capstone}`.
- Capstone đóng node: `problem_type = capstone`, bắt buộc `ground_truth` + `judge_rubric_ref`, ngưỡng 80%.
- Checkpoint nhẹ: `problem_type = mcq` + `answer_key`.

### 11.2 Gate Exam item (ADR-011 — MCQ thật, ngưỡng 80%)
Gate Exam rút N câu MCQ từ item bank của level, giữ phân bố độ khó, khác giữa các lần (chống học vẹt — Data Model `GateExamAttempt.question_ids`).

**Item Gate Exam = item P1-style** (`payload` p1-mcq-v0.1 + `answer_key` p1-key-v0.1), nhưng:
- Gắn `exam_id` (không gắn `node_id`); `problem_type = gate`; `part_type = null`.
- Mỗi item có `difficulty 1..5` để engine rút giữ phân bố.

**Cấu hình một LevelGateExam (lưu ở entity LevelGateExam, không phải Problem):**
```json
{
  "level": "L1",
  "focus_axes": [1, 2, 4],
  "num_questions": 10,
  "pass_threshold": 0.8,
  "difficulty_distribution": { "1": 2, "2": 3, "3": 3, "4": 1, "5": 1 }
}
```
- `num_questions`, `difficulty_distribution`, `cooldown` là các "magic number" gating — **Needs Lead Decision** (xem §12 Open question O2). Spec này đề xuất giá trị mẫu; Lead chốt trước khi seed.

---

## 12. Future-proofing seams & những gì KHÔNG làm ở V0

Phần này hiện thực hoá yêu cầu "dễ mở rộng" của Lead theo nguyên tắc hội đồng: **mở rộng = đặt seam (chỗ cắm rẻ), không build sẵn implementation (đồ đã cắm, đắt).**

### 12.1 Bốn seam chừa sẵn ở V0 (chi phí ~1 field/quy ước mỗi cái)
1. **`schema_version` trong mọi cột JSONB** (`payload`, `answer_key`, `ground_truth`, `body`). V1 đổi cấu trúc nội dung → tăng version, parser route theo version, data V0 không vỡ.
2. **Enum lưu dạng string + Pydantic `Literal`** (không native PG enum). V1 thêm `problem_type`/`part_type` mới → cập nhật `Literal`, không migration.
3. **`judge_prompt_version` + `model_version` pin sẵn** (Data Model AxisScore đã có). V1 thêm self-consistency multi-run / recalibrate → chỉ thêm row AxisScore version mới, lịch sử chấm có sẵn.
4. **`ground_truth` versioned + tách khỏi học viên** (ADR-010). V1 mở rộng ground-truth 20–30 bài/phần → INSERT thêm gold_samples, không đụng V0.

### 12.2 Explicitly NOT in V0 (chống FM1 — scope creep đội lốt foresight)
Những thứ sau **không** được tạo bảng/field "để dành" ở V0. Chúng là *module/implementation* V1+ thêm vào mà KHÔNG yêu cầu sửa data V0 (nhờ modular monolith + projection):
- Skill-tree branching cho LearningNode (LearningNode Spec §6 — có thể sinh ADR mới ở V1).
- Telemetry tables / anti-gaming / honeypot làm-bài (ADR-009: V0 chỉ chấm artifact).
- Self-consistency multi-run; human-in-the-loop review queue cho confidence thấp.
- Percentile engine từ cohort thật; viva video platform.
- Problem bank 20–30 item/phần (V0 chỉ thin slice — §4 Blueprint §7).
- A4 work-sample micro-task (V0 đo A4 nông qua MCQ — Blueprint §3 cảnh báo).

### 12.3 Open questions (Needs Lead Decision — KHÔNG tự quyết)
- **O1:** Có thêm giá trị `problem_type` riêng cho `prompt_plan` và `viva` không? Hiện tận dụng `audit`/`recovery`. Nếu thêm → thay đổi enum nhỏ (string, không migration nhờ seam 12.2) nhưng vẫn là quyết định canonical → Lead chốt.
- **O2:** Chốt các magic number gating: `num_questions` mỗi Gate Exam, `difficulty_distribution`, thời gian `cooldown` sau khi fail, `confidence` threshold để judge abstain, ngưỡng "lệch ground-truth lớn → gắn cờ". (Đã nêu ở Build-Readiness Review — Must-fix #5.)

---

## 13. Ví dụ điền đầy đủ (copy thẳng thành seed)

### 13.1 Ví dụ P1 MCQ hoàn chỉnh (một row Problem)
```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "node_id": null,
  "exam_id": null,
  "part_type": "mcq",
  "problem_type": "mcq",
  "axis": 4,
  "difficulty": 2,
  "payload": {
    "schema_version": "p1-mcq-v0.1",
    "stem": "Trước khi accept một PR do AI sinh có thay đổi xử lý đăng nhập, việc quan trọng nhất là gì?",
    "code_block": null, "code_lang": null,
    "options": [
      { "key": "A", "text": "Merge ngay nếu CI xanh" },
      { "key": "B", "text": "Đọc diff phần auth & input, kiểm secret và injection" },
      { "key": "C", "text": "Nhờ AI tự đánh giá lại độ an toàn" },
      { "key": "D", "text": "Chỉ kiểm xem app còn chạy không" }
    ],
    "shuffle_options": true
  },
  "answer_key": {
    "schema_version": "p1-key-v0.1",
    "correct_keys": ["B"], "multi_select": false,
    "distractor_rationale": {
      "A": "CI xanh không bảo chứng an toàn — L0 accept-all",
      "C": "Tin AI tự review là vòng lặp tin AI mù",
      "D": "Chạy được ≠ an toàn"
    },
    "axis_touch": { "primary": 4, "secondary": [2] },
    "explain_required": false
  },
  "ground_truth": null,
  "judge_rubric_ref": null
}
```

### 13.2 Ví dụ P2 Audit hoàn chỉnh (một row Problem)
Gộp `payload` (§6) + `answer_key` bug_set (§6) + `ground_truth` 3 vùng (§6) + `judge_rubric_ref = "rubric://axis-2/anchors#L0-L2"`, gắn `axis=2, difficulty=3, part_type="audit", problem_type="audit", node_id=null, exam_id=null`. (Nội dung JSON đã trình bày đầy đủ ở §6 — đây là item mẫu phức tạp nhất, dùng làm khuôn nhân bản cho P3/P4/P5.)

---

## 14. Validation & ánh xạ Data Model (cho dev + QA)

### 14.1 Pydantic-over-JSONB (kỷ luật ở application layer)
Mỗi `schema_version` tương ứng một Pydantic model. Backend validate `payload`/`answer_key`/`ground_truth`/`body` trước khi ghi DB và sau khi đọc seed. Discriminator = `part_type`/`problem_type`.

```python
from typing import Literal, Optional
from pydantic import BaseModel, model_validator

class MCQOption(BaseModel):
    key: str
    text: str

class P1Payload(BaseModel):
    schema_version: Literal["p1-mcq-v0.1"]
    stem: str
    code_block: Optional[str] = None
    code_lang: Optional[str] = None
    options: list[MCQOption]
    shuffle_options: bool = True

class P1AnswerKey(BaseModel):
    schema_version: Literal["p1-key-v0.1"]
    correct_keys: list[str]
    multi_select: bool = False
    distractor_rationale: dict[str, str]
    axis_touch: dict
    explain_required: bool = False

class ProblemSeed(BaseModel):
    id: str
    node_id: Optional[str] = None
    exam_id: Optional[str] = None
    part_type: Optional[Literal["mcq","audit","recovery","prompt_plan","viva"]] = None
    problem_type: Literal["mcq","audit","recovery","capstone","gate"]
    axis: int                      # 1..5
    difficulty: int                # 1..5
    payload: dict
    answer_key: Optional[dict] = None
    ground_truth: Optional[dict] = None
    judge_rubric_ref: Optional[str] = None

    @model_validator(mode="after")
    def check_required_by_type(self):
        if self.problem_type in ("mcq", "gate"):
            assert self.answer_key is not None, "MCQ/gate cần answer_key"
        artifact = self.part_type in ("audit","recovery","prompt_plan","viva") \
                   or self.problem_type == "capstone"
        if artifact:
            assert self.ground_truth is not None, "artifact cần ground_truth"
            assert self.judge_rubric_ref is not None, "artifact cần judge_rubric_ref"
        assert 1 <= self.axis <= 5 and 1 <= self.difficulty <= 5
        assert not (self.node_id and self.exam_id), "không gắn cả node_id lẫn exam_id"
        return self
```

### 14.2 Ánh xạ về Data Model (file 08)
| Spec section | Lưu vào bảng | Cột |
| --- | --- | --- |
| §5–§9, §11, §13 (item) | `Problem` | `payload`, `answer_key`, `ground_truth`, `judge_rubric_ref`, `axis`, `difficulty`, `part_type`, `problem_type`, `node_id`/`exam_id` |
| §10 (node) | `LearningNode` | `title`, `level`, `primary_axis` |
| §10 (content) | `LearningContent` | `order`, `content_type`, `body` |
| §11.2 (gate cfg) | `LevelGateExam` | `level`, `focus_axes`, `num_questions`, `pass_threshold` |
| §15 (rubric) | YAML trong Git (ADR-001) | trọng số, ngưỡng→level, anchor, `judge_prompt_version` |

### 14.3 QA — validation test bắt buộc (Test Plan đồng bộ)
- 1 schema-validation test mỗi `part_type` (seed JSON parse qua Pydantic không lỗi).
- CI chặn merge nếu bất kỳ seed item nào sai schema hoặc thiếu field bắt buộc (§4 ma trận).
- TC-02 (determinism MCQ): `answer_key.correct_keys` của P1 khớp 100% với chấm tay.
- Ground-truth phủ 3 vùng + ≥1 red flag mỗi phần artifact (Ground-truth Spec §9 checklist).

---

## 15. rubric.yaml — cấu trúc cấu hình chấm (tách khỏi content — ADR-001)

Rubric (trọng số trục, ngưỡng score→level, anchor text, version) ở YAML trong Git, KHÔNG ở DB. Nội dung đề ở DB; cách chấm ở YAML (Rubric §9, ADR-010 — tách biệt rõ).

```yaml
rubric_version: v0.2
judge_prompt_version: jp-v0.2
model_version: claude-sonnet-4-6
pass_threshold: 0.8            # ADR-007, mọi bài

axis_weights:                 # Rubric §5
  1: 0.25
  2: 0.25
  3: 0.20
  4: 0.20
  5: 0.10

graduation_thresholds:        # readiness (Rubric §5.2) — A5 không gate
  1: L2
  2: L2
  3: L1
  4: L2

score_to_level:               # ánh xạ điểm trục 0–100 → level (giá trị mẫu, Lead calibrate)
  L0: [0, 20]
  L1: [21, 45]
  L2: [46, 70]
  L3: [71, 88]
  L4: [89, 100]

anchors:                      # nhúng nguyên văn vào judge prompt (Rubric §4, giữ nguyên)
  axis-2:
    L0: "Tin output AI mặc định; không đọc diff; không phát hiện bug"
    L1: "Đọc diff cơ bản; bắt lỗi syntax"
    L2: "Bắt security phổ biến (secret, SQLi); nhận lỗi logic; ghi reasoning"

confidence_abstain_threshold: 0.6   # < ngưỡng → abstain → review (V1)  [O2 — Lead chốt]
```
> `score_to_level` và `confidence_abstain_threshold` là **giá trị mẫu cần calibrate** trên ground-truth (Judge Prompt Spec §9). KHÔNG tin con số agreement cho tới khi calibrate (Ground-truth Spec §7 honesty playbook).

---

## 16. Seed manifest V0 (thin vertical slice — theo dõi đường găng)

Danh sách nội dung tối thiểu đủ demo full luồng, kèm owner. Số lượng theo quyết định hội đồng (V0 đơn giản đủ demo).

| Loại | Số lượng V0 | Ca biên bắt buộc gồm | Owner |
| --- | --- | --- | --- |
| P1 MCQ (intake) | 6–8 câu | ≥1 câu `explain_required` (chạm A4/A5) | Lead |
| P2 Audit | 1 đề + bug_set | bug_set có ≥1 honeypot | Lead |
| P3 Recovery | 1 đề | — | Lead |
| P4 Prompt/Plan | 1 đề | — | Lead |
| P5 Viva | 2–3 câu | tách câu theo trục (A4 + A5) | Lead |
| Ground-truth | 3–5 bài/phần artifact | phủ 3 vùng + ≥1 red flag | Lead + mentor |
| LearningNode | 3 node (đủ 1 level) | ≥1 checkpoint artifact (không chỉ MCQ) | TV3 |
| LearningContent | mỗi node 1–2 lesson | nội dung thật, demo 2′ | TV3 |
| LevelGateExam | 1 level | item bank 10–15 MCQ để rút N câu | Lead + TV3 |
| Learner seed | ~10 | ≥1 red flag, ≥1 trục "chưa chấm được", ≥1 gate-fail | seed owner |

**Đường găng:** ground-truth + item bank là đầu vào của Scoring Engine (Project Plan §6). Seed sớm; Scoring skeleton + mock LLM cho F2/F4/F5 build song song.

---

## 17. Checklist trước khi chốt một item (người viết đề dùng)

**Mọi item:**
- [ ] Khai đủ `axis` (1–5), `target_level`, `bloom`, `difficulty` (1–5)?
- [ ] `payload.schema_version` đúng?
- [ ] Đúng tổ hợp `part_type`/`problem_type` theo ma trận §4?
- [ ] Gắn đúng một trong `node_id`/`exam_id` (hoặc cả hai null nếu thuộc test đầu vào)?

**Item MCQ (P1/Gate/checkpoint nhẹ):**
- [ ] Có `answer_key.correct_keys`?
- [ ] Mọi distractor có `distractor_rationale` (hiểu lầm thật, không vô lý)?
- [ ] ≥40% câu ở mức Apply/Analyse (Blueprint §8)?

**Item artifact (P2–P5/capstone):**
- [ ] Có `ground_truth` (gold label) + `judge_rubric_ref`? (quy tắc vàng §2.3)
- [ ] Ground-truth phủ 3 vùng + ≥1 red flag? (≥2 người gán độc lập, đồng thuận ≥70%)
- [ ] `judge_rubric_ref` trỏ đúng anchor trục đang đo?
- [ ] (P4) có `judge_criteria_def` + `level_map_rule` (luật cứng, không để LLM tự suy level)?
- [ ] (P5) câu tách theo trục, có `kind=cross_check` để đối chiếu P2–P4?

**Learning node:**
- [ ] Đủ 7 trường evidence-contract? Trường 2 là artifact cụ thể?
- [ ] Checkpoint tái dùng anchor + judge prompt khuôn (không tự chế chấm)?
- [ ] Ngưỡng pass = 80%?

---

## 18. Lịch sử phiên bản

| **Phiên bản** | **Ngày** | **Người sửa** | **Mô tả thay đổi** |
| --- | --- | --- | --- |
| 0.1 | 05/06/2026 | Team Gamma | Khởi tạo. Ma trận field × loại item; template P1–P5 + ground-truth schema; LearningNode/Content; Gate Exam item; 4 future-proofing seams + "NOT in V0"; Pydantic-over-JSONB + ánh xạ Data Model; rubric.yaml; seed manifest thin-slice. Đồng bộ Data Model v0.2, Rubric v0.2, Blueprint v0.1, Ground-truth Spec v0.1, Judge Prompt Spec v0.1, LearningNode Spec v0.1, ADR-009/010/011. |

---

*Nhãn căn cứ: enum/quan hệ/cột từ Data Model v0.2; trục/level/anchor/trọng số/công thức từ Rubric v0.2 (§2–§7); cấu trúc test 5 phần + Bloom + level-map từ Assessment Blueprint v0.1; schema gold label + phân bố 3 vùng + honesty playbook từ Ground-truth Spec v0.1; schema output judge + criteria rời rạc + level-map luật cứng + abstain từ Judge Prompt Spec v0.1; 7 trường evidence-contract + phân tầng node từ LearningNode Design Spec v0.1; quyết định "một bảng Problem polymorphic + thin vertical slice + 4 seam" theo Council 05/06/2026. Các giá trị score_to_level, confidence threshold, magic number gating là MẪU — bắt buộc calibrate/Lead chốt trước khi dùng (O2). Schema từng item là đề xuất v0.1, cần validate khi seed nội dung thật.*
