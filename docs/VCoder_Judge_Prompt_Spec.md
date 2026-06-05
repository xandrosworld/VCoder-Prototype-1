# VCoder — Judge Prompt Specification

*Khung & prompt mẫu cho LLM-as-judge chấm artifact P2–P5 · v0.1 · 05/06/2026 · Lead: Đặng Văn Minh*
*Đồng bộ với: Rubric §7 · TDD §5.1 (Scoring Engine, LLM Judge) · ADR-009 · Risk Register R11/R15*

---

## 1. Mục đích & cảnh báo

Tài liệu này đặc tả *cách viết prompt* cho LLM judge chấm các phần artifact (P2 Audit, P3 Recovery, P4 Prompt/Plan, P5 Viva), kèm 2 prompt mẫu hoàn chỉnh (P2, P4). Rubric §7 cho *nguyên tắc*; tài liệu này cho *bản dựng thật*.

> **Cảnh báo bắt buộc đọc:** prompt judge dưới đây là **v0 — giả thuyết về "tốt nghĩa là gì"**, KHÔNG phải bản chốt. Chất lượng prompt judge là yếu tố quyết định agreement cao hay thấp. Mọi prompt ở đây BẮT BUỘC qua vòng calibrate với ground-truth set thật (xem Ground-truth Spec §5) rồi mới dùng. Đừng tin con số agreement cho tới khi đã calibrate.

---

## 2. Bảy nguyên tắc thiết kế judge prompt

Tổng hợp Rubric §7 + bằng chứng bên ngoài 2025–2026:

1. **Anchor-driven** — nhúng nguyên văn behavioral anchors (Rubric §4) của trục đang chấm vào prompt; judge chọn level *khớp nhất* + trích evidence.
2. **Tiêu chí rời rạc, không hỏi điểm** — hỏi từng criterion *met/not met* (nhị phân), KHÔNG hỏi "bài này mấy điểm". *(Bằng chứng ngoài: scoring nhị phân/thô đáng tin hơn thang điểm tinh — LLM khó hiệu chỉnh phân biệt tinh nhất quán.)*
3. **Structured output bắt buộc** — trả JSON theo schema cố định; parser từ chối output sai schema, retry temp=0 một lần.
4. **Evidence bắt buộc** — mỗi level kết luận phải kèm ≥1 trích dẫn từ bài làm; không evidence → không được gán level cao.
5. **Không suy diễn có lợi** — thiếu evidence → gán level thấp + cờ "thiếu bằng chứng", KHÔNG đoán có lợi cho học viên.
6. **Confidence + abstain** — judge tự lượng định độ chắc; confidence thấp → đẩy review (trust-or-escalate).
7. **Determinism kiểm soát** — temperature=0; lưu model_version + judge_prompt_version để chấm lại & audit.

**Chống bias (bằng chứng ngoài):** vì judge có agreeableness bias (xu hướng cho qua), prompt phải *yêu cầu rõ* tìm bằng chứng cho cả "không đạt", và liệt kê hành vi L0/L1 để judge nhận ra bài yếu — không mặc định bài nào cũng khá.

---

## 3. Schema output chung (mọi phần)

Từ Rubric §7.3, làm đầy đủ:

```json
{
  "axis": 2,
  "level": "L1",
  "criteria": [
    { "name": "phát hiện lỗi security phổ biến", "met": false,
      "note": "không nhắc tới secret hardcode ở dòng 12" }
  ],
  "evidence": [
    { "quote": "<trích đúng từ bài làm>", "where": "finding #2" }
  ],
  "red_flags": [
    { "type": "missed_critical_security", "note": "bỏ sót lỗ hổng auth" }
  ],
  "confidence": 0.62,
  "abstain": false,
  "judge_prompt_version": "p2-audit-v0.1",
  "model_version": "claude-sonnet-4-6"
}
```

**Bất biến chấm (Rubric §7.3):** (1) level chỉ trong L0–L4, không tự chế; (2) level phải có ≥1 evidence trích từ bài làm; (3) red_flag ghi riêng, không trừ điểm trục; (4) confidence < ngưỡng → abstain=true → hàng đợi review.

---

## 4. Cấu trúc prompt chuẩn (khuôn cho mọi phần)

Mỗi judge prompt gồm 7 khối, theo thứ tự:

```
[1] ROLE        — bạn là examiner chấm năng lực <trục>, theo rubric cho sẵn
[2] TASK        — chấm artifact của học viên, chọn level khớp nhất + trích evidence
[3] ANCHORS     — nhúng nguyên văn behavioral anchors L0–L2(+) của trục
[4] RULES       — 7 nguyên tắc §2 dạng mệnh lệnh (rời rạc, evidence bắt buộc, không suy diễn có lợi...)
[5] INPUT       — đề + ground-truth/bug set (nếu có) + bài làm học viên
[6] OUTPUT_SPEC — schema JSON §3, nhấn mạnh "chỉ JSON, không lời dẫn"
[7] SELF_CHECK  — trước khi trả: đã trích evidence cho mỗi criterion chưa? có suy diễn có lợi không?
```

---

## 5. PROMPT MẪU 1 — P2 Audit (đo A2)

````
[ROLE]
Bạn là examiner đánh giá năng lực "AI Output Evaluation & Critical Review" (Axis 2)
của một học viên lập trình. Bạn chấm theo rubric behavioral anchors cho sẵn, KHÔNG
theo cảm tính. Bạn nghiêm khắc: chỉ gán level cao khi có bằng chứng rõ trong bài làm.

[TASK]
Học viên được giao một đoạn code/diff do AI sinh, có chứa lỗi cài sẵn. Nhiệm vụ của
học viên: tìm và báo cáo các lỗi (findings). Bạn đánh giá chất lượng audit đó và gán
level A2 (L0–L2) khớp nhất.

[ANCHORS — Axis 2, nhúng nguyên văn từ Rubric §4.2]
- L0: Tin output AI mặc định; không đọc diff; không phát hiện bug.
- L1: Đọc diff cơ bản; bắt lỗi syntax rõ ràng; bug report có lỗi rõ.
- L2: Bắt security phổ biến (secret, SQLi); nhận lỗi logic; ghi reasoning rõ;
      findings phủ phần lớn bug set.

[RULES]
1. Chấm theo TIÊU CHÍ RỜI RẠC: với mỗi criterion dưới, kết luận met=true/false.
   KHÔNG cho điểm số. Level suy ra từ tổ hợp criteria.
   - c1: có đọc & hiểu code (không chỉ đoán)
   - c2: bắt được lỗi syntax/rõ ràng
   - c3: bắt được ≥1 lỗi security trong bug set
   - c4: nhận ra lỗi logic
   - c5: có reasoning giải thích vì sao là lỗi (không chỉ liệt kê)
2. MỖI criterion met=true PHẢI kèm 1 trích dẫn từ bài làm học viên (evidence).
   Không trích được → met=false.
3. KHÔNG suy diễn có lợi: nếu học viên không nhắc tới một lỗi, coi như KHÔNG phát hiện,
   dù bạn nghĩ "chắc họ biết".
4. Đối chiếu với BUG SET cho sẵn: tính bao nhiêu bug trong set được học viên bắt.
5. RED FLAG (ghi riêng, không trừ điểm): nếu bỏ sót lỗi security mức critical trong
   bug set → red_flag "missed_critical_security".
6. Nếu bài quá ngắn/mơ hồ khiến bạn không chắc → confidence thấp + abstain=true.

[INPUT]
<đề audit>
<bug_set: danh sách lỗi đã biết + severity>
<bài làm học viên: findings list>

[OUTPUT_SPEC]
Trả về DUY NHẤT một object JSON theo schema (axis, level, criteria[], evidence[],
red_flags[], confidence, abstain, judge_prompt_version, model_version).
KHÔNG kèm lời dẫn, markdown, hay giải thích ngoài JSON.

[SELF_CHECK trước khi trả]
- Mỗi criterion met=true đã có evidence trích dẫn chưa?
- Có đang cho học viên điểm vì "chắc họ hiểu" mà bài không thể hiện không? (nếu có, sửa)
- Đã đối chiếu findings với từng bug trong bug_set chưa?
- Level gán có khớp anchor không, hay đang nương tay?
````

**Map criteria → level (luật cứng, ngoài LLM):**
- c1=false → L0
- c1=true, c2=true, (c3=false hoặc c4=false) → L1
- c1=true, c2=true, c3=true, c4=true, c5=true → L2

---

## 6. PROMPT MẪU 2 — P4 Prompt/Plan (đo A1)

````
[ROLE]
Bạn là examiner đánh giá năng lực "AI Direction & Context Engineering" (Axis 1).
Bạn chấm cách học viên ĐIỀU KHIỂN AI: scope task, lập kế hoạch, viết prompt có cấu trúc.
Bạn nghiêm khắc và chỉ gán level cao khi bài làm thể hiện rõ hành vi tương ứng.

[TASK]
Học viên nhận một yêu cầu task mơ hồ vừa phải, phải tự scope rồi viết plan + prompt
để giao cho AI. Bạn đánh giá plan + prompt đó và gán level A1 (L0–L2).

[ANCHORS — Axis 1, nhúng nguyên văn từ Rubric §4.1]
- L0: Câu hỏi đơn giản, không context, accept-all; prompt 1–2 turn, không scoping.
- L1: Iterate khi AI sai; thêm context cơ bản; task còn lớn, thiếu acceptance criteria.
- L2: Scoped prompt; constrained; plan-first; có cấu trúc kiểu CLAUDE.md;
      plan trước code; prompt có structure rõ.

[RULES]
1. Tiêu chí rời rạc (met/not met), KHÔNG cho điểm:
   - c1: có plan TRƯỚC khi prompt (plan-first), không nhảy thẳng vào code
   - c2: task được scope nhỏ, rõ (không phải "làm cho tôi cái app")
   - c3: prompt có context (mô tả bối cảnh, ràng buộc)
   - c4: có acceptance criteria / định nghĩa "xong"
   - c5: prompt có cấu trúc (vai trò, constraints, output mong muốn)
2. Mỗi criterion met=true PHẢI kèm evidence trích từ bài làm.
3. KHÔNG suy diễn có lợi: nếu plan không nêu acceptance criteria, c4=false dù task có vẻ rõ.
4. Phân biệt L1/L2: có context cơ bản nhưng task còn lớn & thiếu acceptance = L1;
   scoped + constrained + có acceptance + plan-first = L2.
5. RED FLAG: nếu prompt chứa secret/khóa API thật → red_flag "secret_leak"
   (lưu ý: scan tất định chạy trước, đây chỉ bổ trợ — R15).
6. Không chắc → confidence thấp + abstain=true.

[INPUT]
<đề task mơ hồ>
<bài làm học viên: plan + prompt>

[OUTPUT_SPEC]
Trả về DUY NHẤT một JSON theo schema chung. Chỉ JSON, không lời dẫn.

[SELF_CHECK trước khi trả]
- Mỗi criterion met=true có evidence chưa?
- Có nhầm "prompt dài" thành "prompt có cấu trúc" không? (dài ≠ scoped)
- Đang phân biệt L1 vs L2 dựa trên acceptance criteria & scoping chưa?
- Có nương tay gán L2 khi thực ra task còn lớn không?
````

**Map criteria → level:**
- c1=false, c2=false → L0
- (c1 hoặc c3)=true nhưng c4=false hoặc c2=false → L1
- c1=true, c2=true, c3=true, c4=true, c5=true → L2

---

## 7. Khuôn cho P3 & P5 (chưa làm prompt đầy đủ — theo cùng cấu trúc)

| Phần | Trục | Anchor nguồn | Criteria cốt lõi gợi ý |
| --- | --- | --- | --- |
| P3 Recovery | A3 | Rubric §4.3 | đọc stack trace trước / biết rollback-checkpoint / nêu bước an toàn / có triage |
| P5 Viva | A4, A5 | Rubric §4 + SoT | giải thích được reasoning bài mình làm / hiểu trade-off / chạm khái niệm architecture |

P3, P5 dựng theo đúng 7 khối §4; P5 cần *tách câu theo trục* (cảnh báo Blueprint §5) để tránh một câu trả lời mơ hồ phải suy nhiều level.

---

## 8. Quy trình vận hành chấm (TDD §5.1)

1. Nạp bài làm + đề + ground-truth/bug set + anchors trục.
2. Gọi judge (temp=0) → nhận JSON.
3. Validate schema; sai → retry 1 lần; vẫn sai → đánh dấu "chưa chấm được".
4. Map criteria → level bằng luật cứng (§5/§6) — KHÔNG để LLM tự suy level cuối.
5. Đối chiếu ground-truth (nếu có) → ghi agreement.
6. confidence < ngưỡng → abstain → hàng đợi review (V1).
7. Trích evidence hiển thị trên Profile.

---

## 9. Calibrate (bắt buộc trước khi tin)

Theo Ground-truth Spec §5:
1. Chạy judge trên toàn ground-truth set.
2. Đo exact / adjacent / kappa / re-score stability.
3. Tìm chỗ lệch gold nhiều nhất → đọc xem judge hiểu sai anchor nào.
4. Refine: làm rõ anchor, thêm anchor example vào prompt, siết rule chống nương tay.
5. Tăng judge_prompt_version, đo lại. Lặp cho tới khi đạt mục tiêu hoặc hết thời gian → báo cáo agreement thật.

---

## 10. Tầm nhìn V0 → V2+

| | V0 | V1 | V2+ |
| --- | --- | --- | --- |
| Prompt | P2, P4 mẫu + P3/P5 khuôn | đủ 4 phần, đã calibrate | tối ưu theo dữ liệu lệch |
| Self-consistency | không | chấm 3 lần lấy trung vị (bài giáp ranh) | mặc định bài gate |
| Abstain/review | schema sẵn | bật hàng đợi người | tự động hoá |
| Anchor examples | tối thiểu | thêm từ ground-truth | phong phú |

---

## 11. Checklist trước khi đưa judge prompt vào dùng

- [ ] Đã nhúng nguyên văn anchor đúng trục?
- [ ] Hỏi tiêu chí rời rạc, KHÔNG hỏi điểm số?
- [ ] Mỗi criterion yêu cầu evidence trích dẫn?
- [ ] Có rule chống suy diễn có lợi / chống nương tay?
- [ ] Level cuối map bằng luật cứng, không để LLM tự chế?
- [ ] Có confidence + abstain?
- [ ] temp=0, có version-pin?
- [ ] ĐÃ calibrate trên ground-truth trước khi tin con số?

---

*Nhãn căn cứ: nguyên tắc judge & schema & quy trình từ tài liệu VCoder (Rubric §7, TDD §5.1, ADR-009); tiêu chí rời rạc > thang điểm tinh, chống agreeableness bias, trust-or-escalate, calibrate là vòng lặp từ nghiên cứu bên ngoài 2025–2026; prompt mẫu P2/P4 là đề xuất thiết kế v0 — BẮT BUỘC calibrate với ground-truth thật trước khi dùng, chưa phải bản chốt.*
