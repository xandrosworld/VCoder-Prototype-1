**VCoder**

Nền tảng AI-Ready Developer

FUNCTIONAL SPECIFICATION

Đặc tả Chức năng

*Mỗi tính năng làm gì, ở góc nhìn người dùng — kèm tiêu chí nghiệm thu*

| **Hạng mục**    | **Nội dung**                                                    |
|-----------------|-----------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                     |
| Người phụ trách | Đặng Văn Minh — Lead Team                                       |
| Ngày            | 04/06/2026                                                      |
| Trạng thái      | Đang soạn — chờ review                                          |
| Đồng bộ với     | Source of Truth v1.1 · PRD v0.2 · Rubric v0.2 · ADR-009/010/011 |

## 1. Giới thiệu

Tài liệu đặc tả hành vi chi tiết của từng tính năng trong sản phẩm VCoder, làm đầu vào trực tiếp cho việc xây dựng và kiểm thử. Functional Spec chi tiết hơn PRD: nó mô tả chính xác mỗi tính năng hành xử thế nào ở mọi tình huống — bao gồm lỗi và biên. Người đọc chính: dev, QA, designer. Mỗi tính năng có acceptance criteria để QA kiểm thử được và để chống AI build lệch.

**Thay đổi lớn ở v0.2 (theo ADR-009/010/011):** (1) Bài test đầu vào (F1) rút từ 4–5h xuống 30–60′, gồm 5 phần ngắn, CHẤM HOÀN TOÀN BẰNG AI + Rubric (không seed, không chấm tay). (2) Level Gate Exam (F3) build THẬT ở V0 mức đơn giản (MCQ, ngưỡng 80%). (3) Nội dung bài học + đề test lưu trong DB. Trong phạm vi này KHÔNG chống học viên dùng AI làm bài (bỏ telemetry/honeypot) — chỉ chấm artifact.

### 1.1 Liên kết với PRD

Mỗi tính năng hiện thực hoá một yêu cầu chức năng (FR) trong PRD. Năm tính năng F1–F5 ánh xạ 1-1 với FR-01..FR-05; F3 nay bao gồm cả FR-06 (Level Gate Exam) vì Gate Exam được build thật ở V0.

**Kiến trúc dữ liệu (đọc trước khi đặc tả):** F1 Test → LLM judge + answer_key sinh điểm & level 5 trục + evidence. F3 Learning Path → checkpoint/Capstone (MCQ) + Level Gate Exam (MCQ) gác tiến độ & cập nhật level. F2 Profile = hiển thị read-only từ F1 + F3. F4 Leaderboard = xếp hạng theo level TB. F5 Dashboard = tổng hợp phân bố level + tiến độ/stuck. Profile/Leaderboard/Dashboard cập nhật từ bài test đầu vào (F1) VÀ các Gate Exam (F3).

## 2. Ma trận truy vết yêu cầu

| **Mã FR (PRD)** | **Tính năng (mục)**                                    | **Test case** | **Trạng thái** |
|-----------------|--------------------------------------------------------|---------------|----------------|
| FR-01           | F1 — Bài test đầu vào 30–60′, AI chấm (mục 3)          | TC-01..05     | Chưa làm       |
| FR-02           | F2 — AI-Ready Profile (mục 4)                          | TC-06..09     | Chưa làm       |
| FR-03 / FR-06   | F3 — Learning Path test-gated + Gate Exam thật (mục 5) | TC-10..15     | Chưa làm       |
| FR-04           | F4 — Leaderboard (mục 6)                               | TC-16..18     | Chưa làm       |
| FR-05           | F5 — Dashboard vận hành (mục 7)                        | TC-19..22     | Chưa làm       |

## 3. Tính năng F1 — Bài test đầu vào (30–60′, chấm hoàn toàn bằng AI)

### 3.1 Mô tả & mục đích

Bài test đầu vào ngắn (~30–60 phút) gồm 5 phần, nhằm sinh AI-Ready Profile định vị học viên trên 5 trục (L0–L4) và mở lộ trình học phù hợp. Mục đích KHÔNG phải pass/fail mà là vẽ bản đồ năng lực kèm evidence. Đây là phiên bản rút gọn thay cho Diagnostic 4–5h ở v0.1 — đánh đổi: đo nông hơn nhưng nhanh, hạ rào cản onboarding, và CHẤM ĐƯỢC HOÀN TOÀN BẰNG AI.

**Nguyên tắc thiết kế đề để AI chấm tin cậy:** đề bán cấu trúc — học viên trả lời quanh một khung cố định (chọn + giải thích ngắn theo template) thay vì viết tự do dài. Càng có cấu trúc → LLM judge càng chấm nhất quán. Mỗi phần artifact đều có ground-truth (đáp án/anchor tham chiếu) để validate AI chấm.

### 3.2 Cấu trúc 5 phần & ánh xạ trục

| **Phần**            | **Thời lượng** | **Dạng đề**                                                                    | **Trục đo**                 | **Cách chấm**                    |
|---------------------|----------------|--------------------------------------------------------------------------------|-----------------------------|----------------------------------|
| P1 — MCQ phân loại  | ~10′           | Trắc nghiệm 8–12 câu (Bloom Remember→Apply)                                    | Tất cả (calibrate) + Axis 4 | **Tất định (answer_key)**        |
| P2 — Audit ngắn     | ~15′           | Đọc đoạn code AI-gen, liệt kê findings theo template (vị trí · severity · fix) | Axis 2                      | LLM judge + ground-truth bug set |
| P3 — Recovery ngắn  | ~10′           | Tình huống code hỏng: chọn rollback/fix-forward + giải thích ngắn 2–3 câu      | Axis 3                      | LLM judge + rubric anchor        |
| P4 — Prompt/Plan    | ~10′           | Viết scoped prompt + plan ngắn cho 1 task nhỏ (theo template)                  | Axis 1                      | LLM judge + rubric anchor        |
| P5 — Mini-viva text | ~10′           | 2–3 câu giải thích ownership/khái niệm (trả lời text)                          | Axis 4, 5 + cross-check     | LLM judge + rubric anchor        |

**Lưu ý đánh đổi (đã chốt với Lead):** bỏ M1 Build code tự do (khó chấm, tốn thời gian). Axis 4 Engineering Foundations đo qua MCQ (P1) + viva (P5) thay vì repo thật → đo nông hơn, ghi rõ giới hạn này trong Rubric. Tổng thời lượng ~55′ nằm trong khung 30–60′.

### 3.3 Tác nhân & tiền điều kiện

- **Tác nhân:** học viên đã đăng nhập (người làm bài); hệ thống LLM judge (chấm artifact); answer_key service (chấm MCQ).

- Tiền điều kiện: học viên đã được gán vào một cohort; đã hoàn tất onboarding ngắn; đề bài (Problem) đã có trong DB (ADR-010).

### 3.4 Luồng chính (Happy path)

1.  Học viên vào Landing: thấy mục tiêu test, 5 trục, thời lượng ~30–60′ → bấm Bắt đầu.

2.  Làm P1 MCQ (~10′): chọn đáp án, chuyển câu; hệ thống chấm tất định ngay.

3.  Làm P2 Audit (~15′): đọc code, nhập findings theo template (≥3 findings).

4.  Làm P3 Recovery (~10′): chọn phương án + giải thích ngắn.

5.  Làm P4 Prompt/Plan (~10′): viết scoped prompt + plan theo template.

6.  Làm P5 Mini-viva (~10′): trả lời 2–3 câu bằng text.

7.  Nộp bài → hệ thống gọi LLM judge chấm các phần artifact (async), gộp với điểm MCQ → sinh AI-Ready Profile 5 trục.

8.  Học viên thấy màn “đang chấm” (vài giây–chục giây) → khi xong hiển thị Profile.

### 3.5 Luồng phụ & trường hợp biên

- Nếu học viên thoát giữa chừng: tiến độ từng phần được lưu; quay lại trong 24h tiếp tục, quá 24h làm lại phần dở.

- Nếu hết thời lượng đề xuất một phần: KHÔNG cắt cứng ở V0 (đề ngắn) — chỉ hiển thị nhắc; phần để trống tính là không có evidence cho trục đó.

- Nếu LLM judge trả JSON sai định dạng/timeout: retry 1 lần với temperature=0; nếu vẫn lỗi, đánh dấu phần đó “chưa chấm được” và cảnh báo, KHÔNG bịa điểm.

- Nếu phát hiện lộ secret thật trong P2/P4: red flag riêng (scan tất định bằng regex + LLM bổ trợ), không bị che bởi điểm tổng.

- Nếu học viên bỏ trống P5 Mini-viva: không cross-check được → readiness hạ, đánh dấu red flag “không giải thích được”.

### 3.6 Quy tắc nghiệp vụ

- Bài test không pass/fail; kết quả là level + evidence trên 5 trục, không phải một con số duy nhất.

- P1 MCQ chấm tất định bằng answer_key trong DB; P2–P5 chấm bằng LLM judge theo behavioral anchors (Rubric §4).

- **Determinism:** LLM judge chạy temperature=0; mỗi Profile lưu rubric_version + model_version + judge_prompt_version để chấm lại deterministic-as-possible.

- Axis 5 ĐƯỢC đo (qua P5) nhưng KHÔNG gate readiness.

- Điều kiện loại trực tiếp (highlight riêng): lộ secret thật; không giải thích được (viva trống/sai); không nhận ra lỗi auth/data access ở P2; không biết rollback ở P3.

- Không lấy trung bình cộng đơn thuần — giữ breakdown theo từng trục.

### 3.7 Tiêu chí nghiệm thu (Acceptance Criteria)

**AC-F1.1 —** Given học viên hoàn thành cả 5 phần, When nộp bài, Then hệ thống sinh Profile đủ 5 trục với level L0–L4; vì chấm bằng LLM (async) nên thời gian sinh Profile ≤ 60 giây với 95% bài (thay cho “5 giây” của v0.1).

**AC-F1.2 —** Given P1 MCQ, When chấm, Then điểm khớp tuyệt đối với answer_key trong DB (tất định).

**AC-F1.3 —** Given cùng một bài artifact + cùng rubric_version + cùng model_version, When chấm lại, Then điểm dao động trong ngưỡng cho phép (≤ 1 mức tiêu chí); nếu vượt, gắn cờ “cần review”.

**AC-F1.4 —** Given bài artifact có ground-truth, When LLM judge chấm, Then kết quả được so với ground-truth và ghi lại agreement (phục vụ validate — Rubric §7).

**AC-F1.5 —** Given học viên lộ secret thật ở P2/P4, When sinh Profile, Then Profile hiển thị red flag riêng cho lộ secret, không bị che bởi điểm các trục.

**AC-F1.6 —** Given LLM judge trả JSON sai/timeout 2 lần, When chấm, Then phần đó đánh dấu “chưa chấm được” và KHÔNG bịa điểm.

## 4. Tính năng F2 — AI-Ready Profile

### 4.1 Mô tả & mục đích

Màn hiển thị kết quả năng lực cá nhân: radar 5 trục (L0–L4) + gap analysis + 3 quick wins + peer percentile (opt-in). Profile là lớp HIỂN THỊ thuần (read-only). Mọi con số do F1 Test (LLM judge) tính và F3 Learning Path (Gate Exam) cập nhật; Profile không tự tính lại.

**Nguồn dữ liệu:** F2 đọc level 5 trục + evidence + gap + quick wins từ F1; đọc level hiện tại & tiến độ từ F3. Profile cập nhật KHI có bài test đầu vào mới HOẶC khi học viên pass Level Gate Exam. F2 không ghi/tính điểm.

### 4.2 Luồng chính

9.  Mở Profile sau khi hoàn thành test; thấy radar 5 trục, mốc L2 highlight.

10. Đọc gap analysis: trục nào dưới ngưỡng, cần lên mấy level, kèm evidence cụ thể (từ LLM judge).

11. Thấy 3 quick wins; tuỳ chọn bật percentile (mặc định tắt — ADR-008).

12. Bấm một trục → xem evidence chi tiết (findings, recovery note, prompt… do F1 sinh).

### 4.3 Trường hợp biên

- Chưa làm test: trạng thái rỗng + CTA “Làm bài test đầu vào”, không hiển thị radar trống.

- Có red flag từ F1: cảnh báo riêng nổi bật, tách khỏi điểm các trục.

- Phần “chưa chấm được” (AC-F1.6): trục liên quan hiển thị “chưa đủ dữ liệu”, không hiển thị level giả.

- Khi F3 nâng level qua Gate Exam: Profile cập nhật level mới + đánh dấu thay đổi.

### 4.4 Quy tắc nghiệp vụ & nghiệm thu

- Readiness: A1≥L2, A2≥L2, A3≥L1, A4≥L2 (A5 không gate). Mốc L2 luôn hiển thị trên radar.

- Percentile chỉ hiện khi opt-in; nhãn trục/level dùng đúng tên canonical (Rubric).

**AC-F2.1 —** Given đã hoàn thành test, When mở Profile, Then radar 5 trục đúng kết quả F1 và mốc L2 highlight.

**AC-F2.2 —** Given một trục dưới L2, When xem gap analysis, Then chỉ rõ cần lên mấy level + evidence từ LLM judge.

**AC-F2.3 —** Given F3 vừa nâng level qua Gate Exam, When mở lại Profile, Then radar phản ánh level mới và đánh dấu thay đổi.

## 5. Tính năng F3 — Learning Path test-gated (gồm Level Gate Exam thật)

### 5.1 Mô tả & mục đích

Lộ trình học test-gated: thư viện node/lesson tổ chức theo 5 level. Mỗi lesson có checkpoint (MCQ ngắn); pass Capstone (MCQ) đóng node; pass HẾT Capstone trong level → mở Level Gate Exam; pass Gate Exam (MCQ, ngưỡng 80%) → lên level kế và cập nhật Profile. Theo ADR-011, Gate Exam build THẬT ở V0 mức đơn giản (MCQ-based).

**Nguồn dữ liệu & nội dung:** F3 nhận level khởi điểm từ F1; đọc nội dung bài học + đề (MCQ) từ DB (ADR-010). Ghi tiến độ & level cập nhật để F2/F5 đọc. Mỗi Gate Exam rút N câu từ item bank của level, giữ phân bố độ khó (chống học vẹt). Ngưỡng pass mọi bài = 80% (ADR-007).

### 5.2 Luồng chính

13. Học viên vào Learning Path; thấy level khởi điểm mở, các node trong level mở song song.

14. Chọn node → học micro-lesson → làm checkpoint MCQ mỗi lesson (pass ≥80%).

15. Làm Capstone của node (MCQ tổng hợp, ≥80%) → node hoàn thành.

16. Pass HẾT Capstone trong level → Level Gate Exam mở khoá.

17. Làm Gate Exam (MCQ rút từ item bank, ≥80%) → pass → lên level kế; Profile cập nhật level mới.

### 5.3 Trường hợp biên

- Chưa pass Capstone một node: Gate Exam vẫn khoá; hệ thống nêu rõ còn node nào.

- Fail Gate Exam: không lên level; gợi ý node cần ôn; thi lại sau cooldown (mặc định cấu hình).

- Các node trong cùng level KHÔNG khoá lẫn nhau — học viên tự chọn thứ tự.

- Re-test diagnostic toàn phần là TÙY CHỌN, không phải điều kiện lên level.

- Gate Exam rút đề: hai lần thi của cùng học viên dùng bộ câu khác nhau, giữ độ khó.

### 5.4 Quy tắc nghiệp vụ & nghiệm thu

- Điều kiện lên level = (a) pass HẾT Capstone mọi node trong level VÀ (b) pass Level Gate Exam (≥80%).

- Checkpoint/Capstone/Gate Exam đều dùng ngưỡng 80% (ADR-007).

**AC-F3.1 —** Given vài node chưa pass Capstone, When mở Gate Exam, Then hệ thống khoá Gate Exam và nêu node còn thiếu (HTTP 422).

**AC-F3.2 —** Given đã pass hết Capstone, When làm Gate Exam và đạt ≥80%, Then lên level kế, level mới mở, Profile cập nhật.

**AC-F3.3 —** Given làm Gate Exam đạt \<80%, When xem kết quả, Then không lên level, gợi ý node ôn, cho thi lại sau cooldown.

**AC-F3.4 —** Given thi Gate Exam lần 2, When hệ thống rút đề, Then bộ câu khác lần 1 nhưng cùng phân bố độ khó (từ item bank DB).

**AC-F3.5 —** Given V0, When mở Learning Path, Then thấy ≥3 node, trạng thái locked/unlocked đúng, và Gate Exam THẬT làm được (không phải stub).

## 6. Tính năng F4 — Leaderboard

Bảng xếp hạng học viên trong cohort theo level trung bình 5 trục (lấy từ Profile), filter theo từng trục. Read-only: không tự chấm. Cập nhật khi Profile thay đổi (sau test đầu vào hoặc Gate Exam).

- Chỉ hiển thị học viên opt-in (NFR-06); dưới ngưỡng tối thiểu người opt-in thì ẩn leaderboard (privacy).

- Đồng hạng: tie-break theo số trục đạt L2.

**AC-F4.1 —** Given ≥10 học viên có Profile và opt-in, When mở Leaderboard, Then xếp theo level TB 5 trục, vị trí bản thân nổi bật.

**AC-F4.2 —** Given chọn filter Axis 2, When áp dụng, Then bảng xếp lại theo level Axis 2.

**AC-F4.3 —** Given một học viên không opt-in, When mở Leaderboard, Then học viên đó không xuất hiện.

## 7. Tính năng F5 — Dashboard vận hành

Bảng điều khiển cho mentor: cohort overview (phân bố level từ Profile) + at-risk list + drill-down. Read-only. At-risk = có axis cốt lõi (1,2,4) ở L0 HOẶC stuck quá ngưỡng ở một node.

**AC-F5.1 —** Given cohort có dữ liệu Profile, When mở Dashboard, Then phân bố level khớp dữ liệu Profile.

**AC-F5.2 —** Given học viên có axis cốt lõi ở L0 hoặc stuck quá ngưỡng, When dựng at-risk list, Then học viên đó xuất hiện.

**AC-F5.3 —** Given mentor bấm một học viên at-risk, When drill-down, Then thấy Profile cơ bản + tiến độ Learning Path.

## 8. Giao diện & màn hình V0

Bố cục các màn V0, liên kết tính năng. Bài test nay gọn 6 màn (Landing + 5 phần) thay vì 7 module.

| **Màn hình**            | **Tính năng** | **Nội dung tối thiểu**                                                       |
|-------------------------|---------------|------------------------------------------------------------------------------|
| 1\. Landing             | F1            | Mục tiêu test, 5 trục, thời lượng ~30–60′; nút Bắt đầu                       |
| 2\. P1 MCQ              | F1            | 8–12 câu trắc nghiệm; chọn & chuyển câu                                      |
| 3\. P2 Audit            | F1            | Code view + panel nhập findings theo template                                |
| 4\. P3 Recovery         | F1            | Tình huống + 2 lựa chọn rollback/fix + ô lý do ngắn                          |
| 5\. P4 Prompt/Plan      | F1            | Template scoped prompt + plan                                                |
| 6\. P5 Mini-viva        | F1            | 2–3 câu trả lời text                                                         |
| 7\. Đang chấm → Profile | F1→F2         | Trạng thái “đang chấm” → Radar 5 trục, readiness, evidence, gaps, quick wins |
| 8\. Learning Path       | F3            | Node locked/unlocked, checkpoint, Capstone, Gate Exam (thật)                 |
| 9\. Leaderboard         | F4            | Xếp hạng + filter theo trục                                                  |
| 10\. Dashboard          | F5            | Cohort overview + at-risk + drill-down                                       |

## 9. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                    |
|---------------|------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | Khởi tạo; F1–F5 (Diagnostic 4–5h, 5 module), ma trận truy vết.                                                                                                                                                        |
| 0.2           | 04/06/2026 | Team Gamma    | Viết lại F1: test 30–60′, 5 phần, chấm hoàn toàn bằng AI + answer_key, AC mới (async ≤60s, determinism, ground-truth). F3 gồm Gate Exam THẬT (MCQ, 80%). Bỏ telemetry/honeypot khỏi phạm vi. Đồng bộ ADR-009/010/011. |
