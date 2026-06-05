**VCoder**

Nền tảng AI-Ready Developer

PRODUCT REQUIREMENTS DOCUMENT (PRD)

Đặc tả Yêu cầu Sản phẩm

*Sản phẩm cần làm được gì và tại sao — tài liệu để tranh luận và thống nhất*

| **Hạng mục**    | **Nội dung**                                                  |
|-----------------|---------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                   |
| Người phụ trách | Đặng Văn Minh — Lead Team                                     |
| Ngày            | 04/06/2026                                                    |
| Trạng thái      | Đang soạn — chờ review                                        |
| Đồng bộ với     | Source of Truth v1.1 · Functional Spec v0.2 · ADR-009/010/011 |

## 1. Giới thiệu

### 1.1 Mục đích

Đặc tả yêu cầu sản phẩm VCoder, làm cơ sở thống nhất trước thiết kế kỹ thuật. PRD trả lời CÁI GÌ và TẠI SAO; phần LÀM NHƯ THẾ NÀO thuộc Functional Spec và TDD. Đây là tài liệu để tranh luận — viết để người khác phản biện được.

**Cập nhật v0.2 (ADR-009/010/011):** (1) Bài test đầu vào rút còn 30–60′, 5 phần, CHẤM HOÀN TOÀN BẰNG AI. (2) FR-06 (Level Gate Exam) nâng lên Must và build thật ở V0. (3) NFR-01 làm rõ chỉ áp cho đọc Profile; chấm là async. (4) Câu hỏi mở \#1–#4 đã được quyết. Trong phạm vi V0 KHÔNG chống học viên dùng AI làm bài — chỉ chấm artifact.

### 1.2 Phạm vi sản phẩm

PRD phủ toàn cảnh V0 → V3, đặc tả chi tiết nhất ở V0 (demo) và V1 (pilot). Yêu cầu phân bổ theo phiên bản ở mục 7.

### 1.3 Thuật ngữ & viết tắt

| **Thuật ngữ**     | **Định nghĩa**                                                                                                                                                                |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AI-Ready Engineer | Học viên đạt AI-Ready: A1≥L2, A2≥L2, A3≥L1, A4≥L2 (A5 không gate). Tương ứng L2 — ngưỡng tốt nghiệp.                                                                          |
| Test-gated        | Cơ chế chỉ mở nội dung tiếp theo khi đã pass bài kiểm tra trước đó.                                                                                                           |
| AI-Ready Profile  | Radar 5 trục (L0–L4) + gap analysis + 3 quick wins + evidence + percentile (opt-in).                                                                                          |
| Bài test đầu vào  | Test 30–60′ gồm 5 phần (P1 MCQ, P2 Audit, P3 Recovery, P4 Prompt/Plan, P5 Mini-viva); chấm hoàn toàn bằng AI; không pass/fail, sinh Profile. (Thay Diagnostic 4–5h của v0.1.) |
| Capstone          | Bài tổng kết đóng một learning node (MCQ, ≥80%).                                                                                                                              |
| Level Gate Exam   | Bài kiểm tra cuối mỗi level (MCQ rút item bank, ≥80%); pass = đủ điều kiện lên level kế. Build thật ở V0.                                                                     |
| LLM-as-judge      | MỚI: cơ chế dùng mô hình ngôn ngữ chấm artifact theo behavioral anchors, trả điểm có cấu trúc + evidence.                                                                     |
| Evidence          | Bằng chứng quan sát được do bài test sinh (plan, diff, findings, recovery note, viva...).                                                                                     |

## 2. Bối cảnh & Cơ sở

Chương trình Đào tạo 20.000 Nhân tài AI Thực chiến (Vingroup/VinUni): 20.000 học viên/2 năm theo cohort cuốn chiếu; Cohort 1 khai giảng 02/04/2026 (500 học viên); Cohort 2 tháng 5/2026. Phương pháp Vibe Coding với Cursor, Claude Code, Copilot; khung năng lực neo SFIA 9.

Bối cảnh tạo bài toán đo lường: AI sinh được artifact nên đầu ra không còn là tín hiệu đáng tin về năng lực. Khảo sát CodeSignal 3/2026 (N=450): 91% đã dùng agentic AI tại nơi làm, 75% đã ship code production sinh bằng AI; Escape.tech quét 1.400+ app vibe-coded: 65% có vấn đề bảo mật, 58% chứa ≥1 lỗ hổng nghiêm trọng. Khoảng cách “vibe code được” vs “làm được việc thật” là thứ sản phẩm muốn đo.

### 2.1 Hồ sơ người dùng nền

Cohort 2 (N=154): ~65% sinh viên / 35% đi làm; phần lớn dưới 1 năm kinh nghiệm IT; đa số thiếu kinh nghiệm codebase lớn; ưa học qua lab thực hành. Xuất phát điểm đa dạng → cá nhân hoá lộ trình là bắt buộc. Khảo sát cũng cho thấy học viên ngại bài kiểm tra dài → là một lý do rút test xuống 30–60′.

## 3. Personas người dùng

| **Persona**                          | **Bối cảnh**                                                   | **Mục tiêu**                                               | **Nỗi đau chính**                                          |
|--------------------------------------|----------------------------------------------------------------|------------------------------------------------------------|------------------------------------------------------------|
| Học viên Cohort 2 (chung)            | Xuất phát điểm đa dạng, học Vibe Coding cường độ cao           | Tốt nghiệp AI-Ready, được tuyển sau 12 tuần                | Không biết mình ở đâu; thiếu feedback năng lực             |
| Sinh viên CS năm 3-4 / mới ra trường | Nền kỹ thuật khá, ít kinh nghiệm điều khiển AI & codebase thật | Lên L2 toàn diện, nhất là AI Direction & Output Evaluation | Vibe code mù — accept-all, chưa biết review diff & bắt bug |

## 4. Mục tiêu sản phẩm & Chỉ số

| **Loại**   | **Mục tiêu**                                  | **Chỉ số / Mốc**                                                                                       |
|------------|-----------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Kinh doanh | Đóng gói credential bán cho trung tâm/khoa CS | 1–2 khách hàng B2B pilot sau V3                                                                        |
| Người dùng | Học viên biết rõ mình ở đâu trên 5 trục       | ≥ 80% hoàn thành AI-Ready Profile                                                                      |
| Người dùng | Có lộ trình cải thiện cụ thể                  | Mỗi Profile ≥ 3 quick wins khả thi                                                                     |
| Sản phẩm   | Độ tin cậy chấm điểm (north-star)             | AI↔human agreement: exact-level ≥80%, quadratic weighted kappa \>0.7 (thay IRR người-người, Rubric §8) |
| Sản phẩm   | Chứng chỉ dự báo năng lực thật                | Predictive validity r \> 0.2 (V2), \> 0.3 (V3)                                                         |

## 5. User Stories & Yêu cầu chức năng

Mỗi yêu cầu là user story, có mã FR truy vết tới Functional Spec & test case, gắn MoSCoW.

### 5.1 Yêu cầu chính (Must — V0/V1)

| **Mã** | **User Story**                                                                                                      | **Module/Trục**        | **Ưu tiên**               |
|--------|---------------------------------------------------------------------------------------------------------------------|------------------------|---------------------------|
| FR-01  | Là học viên, tôi muốn làm bài test đầu vào (30–60′, 5 phần) để nhận AI-Ready Profile 5 trục, biết mình ở level nào. | Bài test / tất cả trục | Must                      |
| FR-02  | Là học viên, tôi muốn xem radar 5 trục + gap analysis + 3 quick wins, để biết cần cải thiện gì.                     | AI-Ready Profile       | Must                      |
| FR-03  | Là học viên, tôi muốn lộ trình mở khoá theo ngưỡng (pass mới học tiếp), để học đúng năng lực.                       | Learning Path          | Must                      |
| FR-04  | Là học viên, tôi muốn leaderboard xếp hạng & lọc theo trục, để biết mình so với cohort.                             | Leaderboard            | Must                      |
| FR-05  | Là mentor, tôi muốn cohort overview & at-risk list, để can thiệp người đuối kịp thời.                               | Dashboard              | Must                      |
| FR-06  | Là học viên, tôi muốn làm Level Gate Exam cuối mỗi level (build THẬT ở V0), để chứng minh đủ năng lực lên level kế. | Learning Path / gating | **Must (nâng từ Should)** |

### 5.2 Yêu cầu phụ (Should / Could — V1 trở đi)

| **Mã** | **User Story**                                                                                                                                                   | **Module/Trục** | **Ưu tiên** |
|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|-------------|
| FR-07  | Là nền tảng, tôi muốn capture telemetry quá trình (prompt, diff, accept/reject) CÓ CONSENT, để chấm dựa trên cách làm việc. (V0 KHÔNG dùng — chỉ chấm artifact.) | Telemetry       | Should      |
| FR-08  | Là học viên, tôi muốn re-test (tùy chọn) để cập nhật Profile và thấy tiến bộ.                                                                                    | Re-assessment   | Should      |
| FR-09  | Là học viên, tôi muốn nhận chứng chỉ verify được khi đạt chuẩn.                                                                                                  | Credential      | Could       |
| FR-10  | Là mentor, tôi muốn drill-down hồ sơ từng học viên từ dashboard.                                                                                                 | Dashboard       | Could       |

**Truy vết:** FR-01..FR-05 ánh xạ 1-1 với F1..F5; FR-06 (Gate Exam) nay thuộc F3 vì build thật ở V0. Mỗi FR trace tiếp xuống test case TC-xx.

## 6. Yêu cầu phi chức năng (NFR)

| **Mã** | **Loại**  | **Yêu cầu (đo được)**                                                                                                                          |
|--------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-01 | Hiệu năng | Trang AI-Ready Profile (ĐỌC) tải \< 2s với 95% request. Việc CHẤM bài là async (không áp \<2s): Profile sinh trong ≤60s với 95% bài (AC-F1.1). |
| NFR-02 | Bảo mật   | Mã hoá dữ liệu khi lưu & truyền; không hardcode secret; telemetry chỉ thu khi consent văn bản (V1+).                                           |
| NFR-03 | Mở rộng   | Hỗ trợ ≥1.000 học viên làm bài đồng thời; chấm là job async tách khỏi request.                                                                 |
| NFR-04 | Khả dụng  | Hoàn thành test không cần hỗ trợ trực tiếp (onboarding ~30′).                                                                                  |
| NFR-05 | Truy cập  | Hiển thị đúng desktop & mobile; tương phản WCAG AA.                                                                                            |
| NFR-06 | Riêng tư  | Học viên xem được dữ liệu bị thu & mục đích; percentile chỉ hiện khi opt-in.                                                                   |

## 7. Phạm vi theo phiên bản (Release Scope)

| **Phiên bản**   | **Yêu cầu bao gồm**                                                 | **Mục tiêu**                                     |
|-----------------|---------------------------------------------------------------------|--------------------------------------------------|
| V0 — Demo       | FR-01..05 chạy thật (chấm AI) + FR-06 (Gate Exam thật, MCQ)         | Thống nhất tầm nhìn + demo năng lực chấm tự động |
| V1 — Pilot      | FR-01..06 + FR-07 (telemetry+consent) + self-consistency chấm       | Kiểm chứng với học viên thật Cohort 2            |
| V2 — Full       | Thêm FR-08 (re-assessment), problem bank đầy đủ, FR-10 (drill-down) | Vận hành đủ 5 trục, đo predictive validity       |
| V3 — Credential | Thêm FR-09 (cert verify được) + báo cáo validity                    | Credential được nhà tuyển dụng công nhận         |

**Thay đổi so với v0.1:** V0 nay chấm THẬT bằng AI (không mockup chấm) và FR-06 build thật — đây là điểm thuyết phục stakeholder lớn nhất. Bù lại, telemetry (FR-07) lùi hoàn toàn về V1.

## 8. Trải nghiệm & Luồng người dùng

1.  Đăng nhập → làm bài test đầu vào (30–60′, 5 phần P1–P5) → màn “đang chấm” → hệ thống sinh AI-Ready Profile (chấm AI).

2.  Xem Profile: radar 5 trục, gap analysis, 3 quick wins, percentile (nếu opt-in).

3.  Vào Learning Path ở level khởi điểm; node trong level mở song song.

4.  Học lesson (mỗi lesson có checkpoint MCQ) → pass Capstone (≥80%) để đóng từng node.

5.  Pass hết Capstone trong level → mở Level Gate Exam → pass (≥80%) để lên level kế; Profile cập nhật.

6.  Lặp tới khi đạt AI-Ready (L2). Re-test toàn phần là tùy chọn.

Luồng mentor: mở Dashboard → cohort overview → lọc at-risk → drill-down hồ sơ → can thiệp.

## 9. Ngoài phạm vi & Hướng tương lai

- Chống học viên dùng AI để gian lận khi làm bài (telemetry/honeypot/viva video): để dành V1+. V0 chỉ chấm artifact.

- Chứng chỉ verify được (chữ ký số): V3, phụ thuộc dữ liệu predictive validity.

- Đóng gói multi-tenant cho khoa CS/trung tâm IT: sau pilot Cohort 2.

- Tích hợp chính thức Anthropic (Claude for Education): cần đối tác, ngoài V0–V2.

## 10. Câu hỏi mở & Vấn đề cần quyết

Cập nhật v0.2: bốn câu hỏi đầu đã được Lead quyết.

| **\#** | **Câu hỏi**                                       | **Quyết định**                             | **Trạng thái** |
|--------|---------------------------------------------------|--------------------------------------------|----------------|
| 1      | V0 chấm thủ công hay tự động?                     | **Chấm HOÀN TOÀN bằng AI (ADR-009)**       | Đã quyết 04/06 |
| 2      | Gate Exam ở V0: vị trí hay làm thật?              | **Build THẬT, mức MCQ đơn giản (ADR-011)** | Đã quyết 04/06 |
| 3      | Ngưỡng pass Capstone đồng nhất?                   | **80% cho MỌI bài (ADR-007)**              | Đã quyết 04/06 |
| 4      | Percentile bật mặc định hay opt-in?               | **Opt-in, mặc định TẮT (ADR-008)**         | Đã quyết 04/06 |
| 5      | Nhà tuyển dụng nào đồng-thiết-kế rubric, khi nào? | Ban tổ chức                                | Mở (2–3 tuần)  |

## 11. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                       |
|---------------|------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | FR-01..10, NFR-01..06, personas, release scope V0→V3.                                                                                                                                                    |
| 0.2           | 04/06/2026 | Team Gamma    | Test đầu vào 30–60′ 5 phần chấm AI; FR-06 nâng Must + build thật V0; north-star đổi sang AI↔human agreement; NFR-01 làm rõ async; câu hỏi mở \#1–#4 đã quyết; telemetry lùi V1. Đồng bộ ADR-009/010/011. |
