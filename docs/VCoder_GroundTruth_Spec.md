# VCoder — Ground-truth Set Specification

*Quy trình & chuẩn xây bộ gold label để validate chấm-AI · v0.1 · 05/06/2026 · Lead: Đặng Văn Minh*
*Đồng bộ với: Rubric §8 · Test & QA Plan §6.1 · ADR-009/010 · Risk Register R11/R12/R14*

---

## 1. Mục đích

Ground-truth set là **bộ bài mẫu đã có đáp án/level chuẩn (gold label)** do người gán, dùng để đo xem LLM judge chấm có khớp người không. Đây là tài sản chống ba rủi ro cùng lúc: R11 (chấm không tất định), R12 (demo thuyết phục nhưng chưa validate), R14 (test đo nông). Project Plan §6 xếp nó **trên đường găng** — là đầu vào của Scoring Engine.

**Phân biệt rõ:** tài liệu này là *spec quy trình + template*. Dữ liệu gold label thật phải do Lead + mentor (+ nhà tuyển dụng ở V1) gán — không ai khác tự sinh được, vì gold label chính là "chân lý" mà cả hệ thống dựa vào.

---

## 2. Vì sao ground-truth phải làm cẩn thận (bằng chứng)

*(Từ chuẩn bên ngoài 2025–2026 — quan trọng để mentor & team hiểu mức độ nghiêm túc)*

- Agreement LLM-judge ↔ người trên **domain chuyên môn** thực tế chỉ **64–68%**, thấp hơn baseline giữa chuyên gia (~72–75%). Chấm artifact security/recovery là domain chuyên môn → không thể giả định kappa > 0.7 sẵn có.
- **Agreeableness bias:** nếu bộ mẫu toàn bài "tàm tạm", judge có xu hướng cho qua → agreement *trông* cao giả tạo (TPR cao, TNR thấp). Vì vậy bộ mẫu BẮT BUỘC cân bằng pass / fail / giáp ranh.
- Gold label do 1 người gán = lại rơi vào chính cái chủ quan ta muốn loại. Cần ≥2 người gán độc lập + đo đồng thuận giữa người gán *trước* khi dùng làm chuẩn.

---

## 3. Cấu trúc bộ ground-truth

### 3.1 Cỡ mẫu

| Mục đích | Số bài/phần | Khi nào | Ghi chú |
| --- | --- | --- | --- |
| **Demo V0** | 3–5/phần | Sprint V0 | Đủ *minh hoạ*, KHÔNG đủ tuyên bố reliability — phải nói rõ |
| **Validate V1** | 20–30/phần | Pilot Cohort 2 | Mức tối thiểu để kappa có ý nghĩa thống kê (ước lượng, cần validate) |
| **Vận hành V2+** | 50+/phần, mở rộng liên tục | Full | Bổ sung từ bài confidence-thấp được người review |

**Lưu ý thành thật:** kappa tính trên n=3–5 có khoảng tin cậy rất rộng — gần như vô nghĩa thống kê. V0 dùng nó chỉ để *demo cơ chế*, không để khẳng định "AI chấm đúng X%".

### 3.2 Phân bố bắt buộc (chống agreeableness bias)

Mỗi phần, bộ mẫu phải phủ cả ba vùng:

| Vùng | Tỷ lệ gợi ý | Vai trò |
| --- | --- | --- |
| Rõ ràng ĐẠT (vd L2 sạch) | ~30% | Kiểm judge không hạ oan người giỏi |
| Rõ ràng KHÔNG đạt (vd L0) | ~30% | Kiểm judge không nâng khống (TNR) — quan trọng nhất |
| **Giáp ranh** (L1/L2 mơ hồ) | ~40% | Chỗ judge dễ sai nhất; chỗ cần self-consistency ở V1 |

Phải có ít nhất 1 bài chứa **red flag** (lộ secret, bỏ sót lỗi nghiêm trọng) để kiểm cơ chế loại trực tiếp.

### 3.3 Thành phần một bài gold label (template)

```
gold_label_id:        GT-P2-003
part:                 P2_audit
axis:                 A2
problem_id:           <ref tới Problem trong item bank>
student_artifact:     <bài làm mẫu — thật hoặc mô phỏng có chủ đích>
gold_level:           L1            # do người gán
gold_criteria:        [ {name, met:bool, note}, ... ]
gold_evidence:        [ {quote, where}, ... ]   # bằng chứng người gán dựa vào
gold_red_flags:       [ ... ]       # nếu có
annotator_1:          <tên + level gán>
annotator_2:          <tên + level gán>
inter_annotator_agree: <khớp / lệch mấy mức>
resolution_note:      <nếu 2 người lệch, chốt thế nào>
zone:                 borderline    # clear_pass / clear_fail / borderline
```

### 3.4 Bug set cho P2 (riêng)

P2 Audit cần một thành phần đặc biệt: **danh sách bug đã biết kèm severity** để so findings của học viên.

```
bug_set_id:    BS-P2-003
bugs:
  - id: b1, type: security,  severity: critical, location: <line>, desc: "secret hardcode"
  - id: b2, type: logic,     severity: major,    location: <line>, desc: "off-by-one"
  - id: b3, type: ai_halluc, severity: major,    location: <line>, desc: "gọi API không tồn tại"
honeypot:      # lỗi bẫy — bắt được = tín hiệu mạnh
  - id: h1, type: subtle_auth, severity: critical, desc: "thiếu check quyền"
```

---

## 4. Quy trình gán gold label

1. **Chuẩn bị bài mẫu:** Lead chọn/tạo bài cho mỗi vùng (clear/borderline/fail), phủ đủ phân bố §3.2.
2. **Gán độc lập:** ≥2 người (Lead + mentor) gán level + criteria + evidence *riêng rẽ*, không xem nhau.
3. **Đo đồng thuận người-người:** tính % khớp level giữa 2 người gán. Nếu khớp thấp (<70%) → anchor (Rubric §4) chưa đủ rõ, phải refine anchor *trước*, không vội dùng làm chuẩn.
4. **Chốt gold:** chỗ 2 người khớp → gold. Chỗ lệch → thảo luận, ghi resolution_note, chốt 1 level.
5. **Khoá & version:** lưu trong DB tách khỏi học viên (ADR-010), gắn rubric_version đã dùng để gán.

**Bất biến quan trọng:** nếu người-người không đồng thuận được trên một bài giáp ranh, đó là tín hiệu bài đó *bản chất chủ quan* — đánh dấu để judge được phép abstain (xem §6), không ép một gold cứng.

---

## 5. Đo agreement AI ↔ human

Từ Rubric §8.2 / Test Plan §6.1:

| Metric | Đo gì | Mục tiêu | Hiện thực V0 |
| --- | --- | --- | --- |
| Exact-level agreement | % AI trùng level gold | ≥ 80% | Báo cáo, không cam kết |
| Adjacent agreement | % AI lệch ≤ 1 level | ≥ 95% | Báo cáo |
| Quadratic weighted kappa | Đồng thuận có trọng số khoảng cách | > 0.7 | Chỉ tham khảo ở n nhỏ |
| Re-score stability | Chấm lại cùng bài/version → lệch | ≤ 1 mức tiêu chí | Kiểm được ngay ở V0 |

**Quy trình:** chấm AI trên toàn bộ ground-truth → tính 4 metric → tìm chỗ AI lệch gold nhiều nhất → refine judge prompt + anchor ở chỗ đó → đo lại (vòng lặp calibrate).

---

## 6. Cơ chế trust-or-escalate (nâng confidence thành chính)

*(Từ chuẩn bên ngoài — ICLR 2025)* Thay vì ép judge gán level cứng cho mọi bài, dùng confidence để quyết định tin hay đẩy review:

- Judge trả `confidence` (0–1) cùng level.
- `confidence ≥ ngưỡng` → tin, dùng level.
- `confidence < ngưỡng` → **abstain**: không gán level cứng, đẩy hàng đợi review người (V1).
- Bài judge abstain thường trùng với bài người-người cũng khó đồng thuận (đúng tín hiệu §4 bất biến) — tức judge đang abstain đúng chỗ subjective.

Ngưỡng confidence cần calibrate trên ground-truth: chọn ngưỡng sao cho phần "tin" đạt agreement cao, phần "abstain" gom đúng bài khó.

---

## 7. Honesty playbook cho demo (chống R12)

Câu chốt chuẩn cho cả team khi demo stakeholder:

> *"AI judge đang trong quá trình validate. Trên bộ ground-truth đã biết đáp án (n=…), agreement hiện tại là X% exact / Y% adjacent. Đây là điểm khởi đầu của quá trình calibrate, không phải con số cuối cùng. Bài judge không chắc được đẩy review người."*

KHÔNG nói "AI chấm đúng" hay "ngang chuyên gia". Luôn kèm cỡ mẫu.

---

## 8. Tầm nhìn V0 → V2+

| | V0 | V1 | V2+ |
| --- | --- | --- | --- |
| Cỡ mẫu | 3–5/phần | 20–30/phần | 50+/phần, tự mở rộng |
| Người gán | Lead + mentor | + nhà tuyển dụng | + panel SME |
| Self-consistency | không | có (bài giáp ranh, chấm 3 lần lấy trung vị) | mặc định |
| Trust-or-escalate | thiết kế sẵn schema | bật review người | tự động hoá hàng đợi |
| Predictive validity | — | — | đo r với outcome việc làm |

---

## 9. Checklist trước khi dùng ground-truth làm chuẩn

- [ ] Phủ đủ 3 vùng (clear pass / clear fail / borderline)?
- [ ] Có ≥1 bài chứa red flag?
- [ ] Mỗi bài gán bởi ≥2 người độc lập?
- [ ] Đồng thuận người-người ≥70% (nếu không, refine anchor trước)?
- [ ] Bug set P2 có severity + honeypot?
- [ ] Lưu kèm rubric_version + tách khỏi dữ liệu học viên?
- [ ] Bài giáp ranh không-đồng-thuận được đánh dấu cho abstain?

---

*Nhãn căn cứ: khung metric & quy trình từ tài liệu VCoder (Rubric §8, Test Plan §6.1); con số 64–68% agreement, agreeableness bias, trust-or-escalate, yêu cầu ≥2 người gán từ nghiên cứu bên ngoài 2025–2026; cỡ mẫu 20–30/phần là ước lượng định hướng (cần validate bằng power analysis chính thức nếu mentor yêu cầu chặt); gold label thật phải do người gán, tài liệu này chỉ cấp template.*
