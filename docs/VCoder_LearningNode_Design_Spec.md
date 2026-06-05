# VCoder — Learning Node Design Specification

*Khung thiết kế node học theo evidence-contract + 5 node mẫu (A1–A5) · v0.1 · 05/06/2026 · Lead: Đặng Văn Minh*
*Đồng bộ với: Charter §8 · Rubric §4–§7 · Data Model (LearningNode/LearningContent/Problem) · Assessment Blueprint · Judge Prompt Spec*

---

## 1. Mục đích & nguyên tắc gốc

Tài liệu này quy định **cách thiết kế một LearningNode** sao cho mỗi node *dẫn tới một artifact quan sát được*, không chỉ truyền đạt kiến thức. Nó biến entity LearningContent (hiện rỗng trong Data Model) thành nội dung có kỷ luật đo lường.

> **Nguyên tắc gốc — Evidence Contract:** một node không "dạy xong" khi học viên *xem hết*, mà khi học viên *tạo ra được artifact chứng minh năng lực ở đúng trục × level*.

Lấy từ Charter §8 ("đo quá trình, không chỉ sản phẩm") và backward design của CBE: bắt đầu từ năng lực đích cần chứng minh, làm ngược về hoạt động.

**Bất biến chống lệch chuẩn (chống R5):** checkpoint của node là một mini-assessment — nó BẮT BUỘC dùng lại anchor (Rubric §4), judge prompt khuôn (Judge Prompt Spec) và cách chấm y như bài test. Node KHÔNG được tự chế cách chấm riêng. Một chuẩn đo duy nhất xuyên test và learning path.

---

## 2. Cấu trúc một node — 7 trường bắt buộc (Evidence Contract)

Mỗi LearningNode phải khai báo đủ 7 trường. Đây là backward design: trường 1–2 định nghĩa đích, 3–7 là đường tới đích.

| # | Trường | Nội dung | Map Data Model |
| --- | --- | --- | --- |
| 1 | **target_axis × level** | Node này đưa học viên tới trục nào, level nào | LearningNode (axis, level) |
| 2 | **target_evidence** | Artifact học viên phải tạo ra (prompt/plan/findings/recovery note/test…) | → Problem.artifact_type |
| 3 | **scoring_method** | Cách chấm artifact đó — tham chiếu judge prompt nào / answer_key | → Problem.scoring + Judge Prompt Spec |
| 4 | **anchor_ref** | Anchor L0–L2(+) của trục (nhúng từ Rubric §4) | Rubric §4 |
| 5 | **learn_content** | Liều kiến thức tối thiểu để học viên đủ sức tạo artifact (worked example + link ngoài) | LearningContent |
| 6 | **practice_activity** | Hoạt động deliberate practice (gồm productive failure) trước checkpoint | LearningContent |
| 7 | **checkpoint** | Mini-assessment sinh artifact → chấm → pass (≥ngưỡng) mới mở node kế | Problem + NodeProgress |

**Quy tắc vàng:** nếu một node không điền được trường 2 (target_evidence) bằng một artifact cụ thể, thì node đó **không hợp lệ** — nó chỉ là bài đọc, không phải learning node. Loại hoặc gộp vào node khác.

---

## 3. Sáu bước trong một node (mô hình tương tác)

Áp khung tương tác đã đề xuất với mentor (deliberate practice → scenario săn-evidence), trật tự cố định:

1. **Worked example** — học viên xem chuyên gia làm đúng (liều kiến thức tối thiểu, trường 5).
2. **Predict-next-step** — trước khi lộ bước kế của worked example, hỏi "bước tiếp theo là gì?" *(bằng chứng ngoài: dự đoán bước kế cải thiện học rõ rệt)*.
3. **Deliberate practice** — học viên tự làm task tương tự, có feedback tức thì (LLM judge nhẹ).
4. **Productive failure** — cho gặp một lỗi/AI-hallucination có chủ đích, để học viên tự phát hiện rồi đối chiếu *(bằng chứng ngoài: sai có chủ đích trước khi sửa giúp nhớ lâu hơn)*.
5. **Checkpoint scenario** — thử thách thực chiến sinh artifact thật (trường 7) → LLM judge chấm theo anchor.
6. **Feedback + gate** — pass (≥ngưỡng 80%, ADR-007) → mở node kế; chưa pass → feedback chỉ ra criterion thiếu, cho làm lại.

**Lưu ý cost (R13):** bước 3 dùng judge nhẹ/MCQ; chỉ bước 5 (checkpoint) gọi judge đầy đủ. Không phải mọi tương tác đều tốn token chấm.

---

## 4. Phân tầng node (chống quá tải chấm & học viên)

Không phải node nào cũng cần checkpoint artifact đầy đủ:

| Loại node | Checkpoint | Khi nào dùng |
| --- | --- | --- |
| **Learn node** (nhẹ) | MCQ retrieval / predict-next-step | Kiến thức nền (đặc biệt A4); ôn spaced |
| **Checkpoint node** (có gate) | Artifact + LLM judge đầy đủ | Node trọng tâm mỗi trục — sinh evidence thật |
| **Capstone node** | Artifact lớn + judge + cross-check | Đóng một learning node lớn (Rubric: ≥80%) |

**Kỷ luật:** giữ tỷ lệ checkpoint/Capstone node đủ cao — nếu lạm dụng learn node nhẹ, path trượt về "đo trí nhớ", phản triết lý sản phẩm.

---

## 5. NĂM NODE MẪU (A1–A5)

Mỗi node mẫu điền đủ 7 trường. Node A1/A2/A3 nối thẳng vào judge prompt đã có; A4/A5 thiết kế checkpoint *mạnh hơn test* để củng cố (A4 đo nông ở test; A5 không gate ở test).

---

### 5.1 NODE MẪU — Axis 1 (AI Direction), nhắm L2

| Trường | Nội dung |
| --- | --- |
| **target** | A1 × L2 (scoped prompt, plan-first, CLAUDE.md) |
| **target_evidence** | Một plan + prompt có cấu trúc cho task được giao |
| **scoring_method** | Judge Prompt Spec §6 (P4 khuôn) — criteria c1–c5, map level luật cứng |
| **anchor_ref** | Rubric §4.1: L1 = có context nhưng task lớn, thiếu acceptance; L2 = scoped + constrained + plan-first |
| **learn_content** | Worked example: chuyên gia nhận task mơ hồ → viết plan → prompt có context/constraints/acceptance. Link: Anthropic prompting guide |
| **practice_activity** | Học viên scope một task nhỏ; **productive failure:** cho xem một prompt "accept-all" thất bại, học viên chỉ ra vì sao thiếu acceptance criteria |
| **checkpoint** | Scenario: "Bạn cần thêm tính năng X vào app. Viết plan + prompt giao cho AI." → judge P4 chấm → ≥L2 pass |

---

### 5.2 NODE MẪU — Axis 2 (Output Evaluation), nhắm L2

| Trường | Nội dung |
| --- | --- |
| **target** | A2 × L2 (bắt security phổ biến, nhận lỗi logic, reasoning rõ) |
| **target_evidence** | Findings list (vị trí + loại + severity + reasoning) |
| **scoring_method** | Judge Prompt Spec §5 (P2 Audit) + bug set chuẩn |
| **anchor_ref** | Rubric §4.2: L1 = bắt lỗi syntax; L2 = bắt security + lỗi logic + reasoning |
| **learn_content** | Worked example: chuyên gia đọc diff AI sinh, phát hiện secret hardcode + SQLi, giải thích vì sao |
| **practice_activity** | **Productive failure:** đưa code "trông ổn" có lỗ hổng ẩn; học viên tự audit *trước*, rồi đối chiếu bug set — thấy mình bỏ sót gì |
| **checkpoint** | Scenario săn-evidence: một PR AI sinh có 3–5 bug cài sẵn (gồm 1 honeypot) → học viên audit → judge P2 chấm theo bug set → ≥L2 pass |

---

### 5.3 NODE MẪU — Axis 3 (Recovery), nhắm L2

| Trường | Nội dung |
| --- | --- |
| **target** | A3 × L2 (đọc stack trace trước, biết rollback/checkpoint, bước an toàn) |
| **target_evidence** | Recovery note (triage + bước phục hồi + lý do rollback/fix) |
| **scoring_method** | Judge Prompt Spec §7 (P3 khuôn) — criteria: đọc trace trước / rollback / bước an toàn / triage |
| **anchor_ref** | Rubric §4.3: L1 = paste error vào AI thử đề xuất đầu; L2 = đọc trace trước + rollback + bước an toàn |
| **learn_content** | Worked example: chuyên gia gặp repo hỏng sau khi AI sửa bậy → đọc stack trace → git bisect → rollback có chủ đích |
| **practice_activity** | **Productive failure:** đưa một "fix nhanh" sai (làm hỏng thêm); học viên nhận ra vì sao rollback an toàn hơn vá vội |
| **checkpoint** | Scenario: repo ở trạng thái lỗi + stack trace → học viên viết recovery note → judge P3 chấm → ≥L2 pass |

---

### 5.4 NODE MẪU — Axis 4 (Eng. Foundations), nhắm L2 — *củng cố mạnh hơn test*

| Trường | Nội dung |
| --- | --- |
| **target** | A4 × L2 (unit test, secret mgmt, git hygiene) |
| **target_evidence** | **Work-sample thật: 1 file unit test viết cho hàm cho sẵn + 1 finding secret** (KHÔNG chỉ MCQ) |
| **scoring_method** | Tất định một phần (chạy test có xanh không) + judge cho chất lượng test (cover edge case?) + secret scanner tất định |
| **anchor_ref** | Rubric §4.4 (Source of Truth, bản đầy đủ) — L2 = viết được test có ý nghĩa, biết quản secret |
| **learn_content** | Worked example: chuyên gia viết unit test cover happy path + edge case; tách secret ra env var |
| **practice_activity** | **Productive failure:** đưa test "giả" (assert True) trông pass nhưng vô dụng; học viên nhận ra vì sao không cover gì |
| **checkpoint** | Scenario: cho 1 hàm có bug ẩn + secret hardcode → học viên viết test bắt được bug + chỉ ra secret → chạy test + scan + judge → pass |

> **Ghi chú thiết kế quan trọng:** đây là chỗ learning path *trả nợ* cho điểm yếu A4 đo nông ở test đầu vào (R14). Test chỉ MCQ; node này đòi work-sample thật. Đúng hướng "chấp nhận đo nông ở test, củng cố bằng Capstone" đã chốt. Nhà tuyển dụng hỏi "A4 đo bằng gì?" → câu trả lời mạnh nằm ở đây, không ở test.

---

### 5.5 NODE MẪU — Axis 5 (AI Product Architecture), nhắm L2 — *đo thật dù test không gate*

| Trường | Nội dung |
| --- | --- |
| **target** | A5 × L2 (hiểu MCP stack, human-in-the-loop, eval cơ bản) |
| **target_evidence** | Decision memo / architecture note: chọn stack cho một bài toán + giải thích trade-off + guardrail |
| **scoring_method** | Judge theo anchor A5 + cross-check reasoning (không có ground-truth cứng — dùng anchor + confidence/abstain mạnh) |
| **anchor_ref** | Rubric §4.5 (SoT) — L2 = hiểu thành phần, nêu được trade-off cơ bản |
| **learn_content** | Worked example: chuyên gia thiết kế một workflow agent đơn giản, đặt human-in-the-loop ở đâu, vì sao |
| **practice_activity** | **Productive failure:** đưa một kiến trúc "thiếu guardrail" gây lỗi; học viên chỉ ra rủi ro |
| **checkpoint** | Scenario: "Thiết kế stack cho feature X, nêu trade-off + chỗ cần human review" → judge A5 chấm → đạt/chưa (không gate tốt nghiệp nhưng vẫn ghi level) |

> **Ghi chú:** A5 không gate tốt nghiệp (Rubric §5), nhưng learning path vẫn đo thật để Profile có dữ liệu A5 chính xác hơn test viva đơn lẻ. Vì A5 ít có ground-truth cứng, dựa mạnh vào confidence/abstain — bài mơ hồ đẩy review.

---

## 6. Tích hợp test-gated & skill-tree (tầm nhìn)

| | V0 | V1 | V2+ |
| --- | --- | --- | --- |
| Tiến trình | Linear: 1–2 node mẫu nối tiếp | Skill-tree: mỗi trục 1 nhánh, Profile route vào nhánh yếu | Adaptive: độ khó tự điều chỉnh |
| A4 củng cố | node mẫu §5.4 | đủ node A4 work-sample | + telemetry quá trình |
| Spaced retrieval | không | learn node A4 lặp lại giãn cách | adaptive scheduling |
| Checkpoint chấm | dùng judge P2/P4 | đủ 5 trục, calibrated | tối ưu theo dữ liệu |

**Kiểm Data Model (cần làm):** LearningNode hiện = 1 trục + 1 level — đỡ được linear (V0) tốt; skill-tree branching (V1) cần kiểm xem quan hệ mở-khoá đa nhánh có cần thêm trường/bảng không → có thể sinh ADR mới. Đây là việc "cần validate" tôi đã nêu với mentor.

---

## 7. Checklist trước khi chốt một node

- [ ] Điền đủ 7 trường evidence-contract?
- [ ] Trường 2 (target_evidence) là artifact cụ thể, không phải "hiểu về X"?
- [ ] Checkpoint dùng lại anchor + judge prompt khuôn (không tự chế chấm)?
- [ ] Có đủ 6 bước tương tác, gồm productive failure?
- [ ] Phân tầng đúng (learn / checkpoint / capstone)?
- [ ] Nếu là node A4 → có work-sample thật, không chỉ MCQ?
- [ ] Bước practice (nhẹ) tách khỏi checkpoint (đầy đủ) để tiết kiệm token?
- [ ] Ngưỡng pass khớp 80% (ADR-007)?

---

*Nhãn căn cứ: nguyên tắc evidence-contract & backward design & test-gated từ tài liệu VCoder (Charter §8, Rubric, ADR-007) + chuẩn CBE bên ngoài; 6 bước tương tác (worked example, predict-next-step, deliberate practice, productive failure) từ nghiên cứu học tập 2025–2026; 5 node mẫu là đề xuất thiết kế, cần validate khi build nội dung thật; checkpoint A4/A5 cố ý mạnh hơn test để củng cố — phản ánh hướng "đo nông ở test, củng cố bằng Capstone" đã chốt.*
