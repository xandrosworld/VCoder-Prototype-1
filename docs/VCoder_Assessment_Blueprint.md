# VCoder — Assessment Blueprint (Test Specification)

*Tài liệu khung đo lường cho bài test đầu vào 5 phần · v0.1 · 05/06/2026 · Lead: Đặng Văn Minh*
*Đồng bộ với: Rubric & Scoring Spec v0.2 · ADR-009/010/011 · Data Model v0.2*

---

## 1. Mục đích & cách dùng

Blueprint là **bản đồ độ phủ** của bài test: nó quy định mỗi phần đo trục nào, ở mức Bloom nào, bao nhiêu item, trọng số ra sao — *trước* khi ai viết đề. Đây là tài liệu chuẩn trong assessment design: viết item mà không có blueprint dễ ra test phủ lệch (đo thừa trục này, thiếu trục kia) và 4 người viết đề sẽ không nhất quán.

**Người đọc chính:** người viết item bank, người thiết kế judge prompt, Lead khi kiểm độ phủ.

**Nguyên tắc neo:** test đo *năng lực điều khiển AI có kiểm soát qua artifact quan sát được* (Charter §8). Mỗi phần phải có ít nhất một mức Bloom ≥ Apply (trừ phần kiến thức nền), không chỉ Remember/Understand.

---

## 2. Bản đồ phần × trục (test 30–60′)

Lấy từ Rubric §6, làm chi tiết thêm cột Bloom và evidence.

| Phần | Tên | Trục đo chính | Trục cross-check | Bloom mục tiêu | Cách chấm | Artifact sinh ra |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | MCQ phân loại | A4 (+ chạm A1/A2/A3/A5) | — | Remember → Apply | Tất định (answer_key) | Lựa chọn + lý do (vài câu) |
| P2 | Audit ngắn | A2 | A4 | Analyse → Evaluate | LLM judge + ground-truth | Findings list (bug + severity + reasoning) |
| P3 | Recovery ngắn | A3 | A2 | Analyse → Create | LLM judge + anchor | Recovery note (triage + bước + lý do) |
| P4 | Prompt/Plan | A1 | A4 | Apply → Evaluate | LLM judge + anchor | Plan + prompt có cấu trúc |
| P5 | Mini-viva text | A4, A5 + cross-check toàn bộ | A1/A2/A3 | Evaluate → Create | LLM judge + anchor | Câu trả lời giải thích reasoning |

**Lưu ý về A4 (đã chốt hướng V0):** A4 là trục gate (≥L2) nhưng ở test rút gọn chỉ đo qua P1 MCQ + cross-check P5 — phép đo *nông*. Level A4 từ test đầu vào ghi rõ là **"tham chiếu sơ bộ"**; củng cố bằng Capstone/Gate Exam khi học (R14). Blueprint này không cố sửa giới hạn đó ở V0, chỉ ghi nhận minh bạch.

---

## 3. Ma trận trục × Bloom × trọng số

Trọng số trục lấy từ Rubric §5; cột "nguồn evidence" cho thấy mỗi trục được đo từ đâu (nguyên tắc multi-measure: trục gate nên có ≥2 nguồn).

| Trục | Trọng số | Nguồn evidence chính | Nguồn cross-check | Ngưỡng tốt nghiệp | Số nguồn |
| --- | --- | --- | --- | --- | --- |
| A1 — AI Direction | 25% | P4 Prompt/Plan | P5 Viva | ≥ L2 (gate) | 2 ✓ |
| A2 — Output Evaluation | 25% | P2 Audit | P5 Viva | ≥ L2 (gate) | 2 ✓ |
| A3 — Recovery | 20% | P3 Recovery | P5 Viva | ≥ L1 | 2 ✓ |
| A4 — Eng. Foundations | 20% | P1 MCQ (nông) | P5 Viva | ≥ L2 (gate) | 2 (nông) ⚠ |
| A5 — AI Product Arch | 10% | P5 Viva | P1 scenario | không gate | 2 |

**Cảnh báo độ phủ:** A4 là trục gate nhưng nguồn chính (MCQ) đo kiến thức, không đo hành vi. Đây là điểm yếu validity đã biết — V1 nên thêm micro-task hành vi (viết 1 test / chỉ 1 lỗ hổng) để A4 có ≥1 nguồn work-sample thật.

---

## 4. Phân bổ Bloom theo phần (chống test chỉ đo trí nhớ)

Nguyên tắc: toàn bài phải có trọng tâm ở **Apply trở lên**. MCQ không được toàn Remember.

| Mức Bloom | P1 | P2 | P3 | P4 | P5 | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| Remember/Understand | ~40% câu P1 | — | — | — | — | Chỉ ở P1, kiến thức nền A4 |
| Apply | ~40% câu P1 | mở đầu | mở đầu | trọng tâm | — | P1 có câu tình huống, không chỉ định nghĩa |
| Analyse | ~20% câu P1 | trọng tâm | trọng tâm | — | mở đầu | Phát hiện bug, đọc stack trace |
| Evaluate | — | trọng tâm | — | trọng tâm | trọng tâm | Đánh giá output, chọn chiến lược |
| Create | — | — | đề xuất fix | — | tổng hợp | Recovery note, reasoning |

---

## 5. Blueprint chi tiết từng phần

### P1 — MCQ phân loại (chấm tất định)

- **Số item (V0 demo):** 8–12 câu. **(V1):** 20–25 câu rút từ item bank.
- **Phân bổ trục:** A4 ~50% (test/security/git/secret); A1/A2/A3/A5 mỗi trục 1–2 câu tình huống.
- **Mỗi item khai báo:** trục, level nhắm, Bloom, answer_key, distractor rationale (vì sao mỗi đáp án sai phản ánh hiểu lầm gì).
- **Yêu cầu chất lượng:** ≥40% câu ở mức Apply/Analyse (tình huống), không toàn định nghĩa. Distractor phải là hiểu lầm thật, không phải đáp án rõ ràng vô lý.

### P2 — Audit ngắn (LLM judge + ground-truth) — *đo A2*

- **Đầu vào học viên:** một đoạn code/diff AI sinh ra, có cài sẵn N lỗi đã biết (bug set).
- **Bug set (V0):** 3–5 lỗi/đề, gồm tối thiểu: 1 security (secret hardcode / SQLi), 1 logic, 1 bẫy "AI tự tin nhưng sai".
- **Artifact yêu cầu:** findings list — mỗi finding gồm *vị trí + loại lỗi + mức độ + vì sao*.
- **Level map:** L0 không phát hiện; L1 bắt lỗi syntax rõ; L2 bắt security phổ biến + nhận lỗi logic + reasoning rõ (Rubric §4.2).
- **Ground-truth cần:** danh sách bug chuẩn + severity (để so findings).

### P3 — Recovery ngắn (LLM judge + anchor) — *đo A3*

- **Đầu vào:** một stack trace / repo ở trạng thái lỗi (do AI gây ra).
- **Artifact yêu cầu:** recovery note — triage (đọc gì trước), bước phục hồi, lý do chọn rollback/fix.
- **Level map:** L0 restart/bỏ cuộc; L1 paste error vào AI thử đề xuất đầu; L2 đọc stack trace trước + biết rollback/checkpoint + nêu bước an toàn (Rubric §4.3).

### P4 — Prompt/Plan (LLM judge + anchor) — *đo A1*

- **Đầu vào:** một yêu cầu task mơ hồ vừa phải (cần học viên tự scope).
- **Artifact yêu cầu:** plan trước + prompt có cấu trúc (context, constraints, acceptance criteria).
- **Level map:** L0 prompt 1–2 turn không scope; L1 có iteration, thêm context cơ bản nhưng task còn lớn; L2 scoped + constrained + plan-first + dạng CLAUDE.md (Rubric §4.1).

### P5 — Mini-viva text (LLM judge + anchor) — *đo A4, A5 + cross-check*

- **Đầu vào:** 2–3 câu hỏi mở yêu cầu giải thích reasoning về chính bài làm P2–P4 + 1 scenario A5 (architecture).
- **Artifact yêu cầu:** câu trả lời giải thích — *vì sao* làm vậy, không phải làm lại.
- **Vai trò kép:** đo A5 (architecture) + cross-check A1/A2/A3/A4 (học viên có thật sự hiểu bài mình làm không, chống gaming nhẹ).
- **Cảnh báo tải:** P5 gánh nhiều trục — V1 nên tách câu rõ ràng theo trục, tránh một câu trả lời mơ hồ phải suy ra nhiều level.

---

## 6. Tiêu chí "loại trực tiếp" (red flags)

Từ Rubric §5.2 — ghi riêng, KHÔNG trừ vào điểm trục:

| Red flag | Phát hiện ở | Cơ chế |
| --- | --- | --- |
| Lộ secret thật | P2/P4 | Scan tất định (regex/trufflehog) là chính, LLM bổ trợ (R15) |
| Không giải thích được | P5 | Viva trống/sai hoàn toàn |
| Không nhận lỗi auth/data | P2 | Bỏ sót lỗi nghiêm trọng trong bug set |
| Không biết rollback | P3 | Recovery note không có chiến lược an toàn |

**Fairness (cần policy riêng):** red flag → đẩy review người (V1), không tự động loại ở chế độ tự động hoàn toàn. Học viên giỏi nhưng diễn đạt kém ở viva không nên bị loại oan.

---

## 7. Độ phủ V0 vs V1 (tầm nhìn)

| Hạng mục | V0 Demo | V1 Pilot | V2+ |
| --- | --- | --- | --- |
| Số item/phần | 1–3 (đủ demo) | đủ rút ngẫu nhiên | item bank đầy đủ |
| A4 đo | nông (MCQ) | + micro-task hành vi | work-sample đầy đủ |
| Bloom phủ | Apply–Evaluate | + Create | đủ 6 mức |
| Cross-check P5 | gộp | tách theo trục | + viva video |

---

## 8. Checklist kiểm độ phủ (Lead dùng trước khi chốt item bank)

- [ ] Mỗi trục gate (A1, A2, A4) có ≥2 nguồn evidence?
- [ ] Toàn bài có ≥1 phần đo Apply/Analyse/Evaluate/Create cho mỗi trục chính?
- [ ] P1 không quá 50% câu ở mức Remember?
- [ ] Mỗi MCQ item có distractor rationale (chống đoán mò)?
- [ ] Mỗi phần artifact có ground-truth hoặc anchor tương ứng?
- [ ] Giới hạn A4 đo nông được ghi rõ trên Profile?
- [ ] Red flag tách khỏi điểm trục, có đường review?

---

*Nhãn căn cứ: cấu trúc 5 phần & trọng số & anchors từ tài liệu VCoder (Rubric §4–§6, ADR-009); nguyên tắc Bloom phủ Apply+, multi-measure cho trục gate, distractor rationale từ chuẩn assessment design bên ngoài; phần độ phủ V0/V1 và checklist là đề xuất thiết kế, cần validate khi viết item thật.*
