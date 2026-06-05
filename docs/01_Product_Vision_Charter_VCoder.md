**VCoder**

Nền tảng AI-Ready Developer

PRODUCT VISION & CHARTER

Tầm nhìn & Hiến chương Sản phẩm

*Tài liệu neo tầm nhìn — để mọi bên liên quan nhìn về cùng một hướng*

| **Hạng mục**    | **Nội dung**                                      |
|-----------------|---------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                       |
| Người phụ trách | Đặng Văn Minh — Lead Team                         |
| Ngày            | 04/06/2026                                        |
| Trạng thái      | Đang soạn — chờ review                            |
| Đồng bộ với     | Source of Truth v1.1 · PRD v0.2 · ADR-009/010/011 |

## 1. Mục đích tài liệu

Tài liệu thiết lập tầm nhìn chung, phạm vi, mục tiêu và cơ cấu trách nhiệm của dự án VCoder, làm cơ sở để các bên thống nhất trước khi xây dựng. Charter trả lời “tại sao dự án tồn tại và ai chịu trách nhiệm”; PRD trả lời “sản phẩm cần làm được gì”. Tài liệu ngắn, viết một lần ở đầu dự án, dùng làm điểm neo khi tranh luận về phạm vi. Người đọc chính: Ban tổ chức, mentor, toàn team.

**Cập nhật v0.2:** Bài test đầu vào rút còn 30–60′ (5 phần) và chấm hoàn toàn bằng AI; Level Gate Exam build thật ở V0. Cập nhật mục Giải pháp tổng quan & Phạm vi cho khớp. (Nội dung tầm nhìn cốt lõi không đổi.)

## 2. Tuyên bố tầm nhìn (Vision Statement)

VCoder là nền tảng test-gated learning giúp học viên biết chính xác mình đang ở đâu trên hành trình từ Vibe Coder đến AI-Ready Engineer, và có lộ trình cụ thể để cải thiện. Học viên phải vượt bài kiểm tra mới được mở nội dung tiếp theo, nên mỗi bước tiến phản ánh năng lực thật.

Trong thời đại AI sinh ra được sản phẩm (code, app), bản thân sản phẩm không còn là tín hiệu đáng tin về năng lực con người. VCoder đo cái khác: học viên có điều khiển được AI một cách có kiểm soát hay không.

## 3. Vấn đề cốt lõi (Problem Statement)

Khảo sát 154 học viên Cohort 2 cho thấy ba pain point lớn nhất:

| **\#** | **Pain Point**                                       | **Tần suất** | **Bằng chứng (trích khảo sát)**        |
|--------|------------------------------------------------------|--------------|----------------------------------------|
| 1      | Vibe code mù — không hiểu bản chất, không debug được | Cao          | “Không biết mình đúng hay sai”         |
| 2      | Không có feedback rõ ràng về năng lực                | Cao          | “Không có người review code”           |
| 3      | Khoảng cách từ project đến sản phẩm thực tế          | Trung bình   | “Học xong không đưa được vào vận hành” |

Ở quy mô chương trình (mục tiêu 20.000 học viên trong 2 năm, cohort cuốn chiếu), các pain point trên không thể giải bằng nhân lực chấm tay: không thể chấm bài thực hành cho hàng nghìn người mỗi cohort, không nhìn được ai đang đuối, và chưa có cách cấp chuẩn tốt nghiệp đủ tin để nhà tuyển dụng dựa vào.

**Hệ quả thiết kế (v0.2):** Chính vì không thể chấm tay ở quy mô lớn, VCoder chấm bài test đầu vào HOÀN TOÀN bằng AI (LLM-as-judge + Rubric) — đây vừa là lời giải cho bài toán quy mô, vừa là điểm thuyết phục nhất cần demo cho stakeholder.

## 4. Mục tiêu & Chỉ số thành công

| **Mục tiêu**                       | **Chỉ số đo (KPI)**                           | **Mốc đạt** | **Thời hạn** |
|------------------------------------|-----------------------------------------------|-------------|--------------|
| Học viên biết rõ mình đang ở đâu   | Tỷ lệ hoàn thành AI-Ready Profile             | ≥ 80%       | Hết V1       |
| Chấm điểm đáng tin cậy             | AI↔human agreement (quadratic weighted kappa) | \> 0.7      | Hết V1       |
| Học viên hài lòng & quay lại học   | NPS học viên                                  | \> 30       | Hết V1       |
| Chứng chỉ có giá trị thị trường    | Predictive validity (r) với outcome việc làm  | \> 0.2      | Hết V2       |
| Đóng gói bán ra ngoài hệ sinh thái | Số khách hàng B2B (trung tâm/khoa CS)         | 1–2 pilot   | Từ V3        |

**Lưu ý v0.2:** chỉ số độ tin cậy đổi từ IRR giữa hai examiner người sang AI↔human agreement (vì V0 chấm bằng AI) — mục tiêu vẫn tương đương kappa \> 0.7.

## 5. Phạm vi (Scope)

Phần này là công cụ chính chống scope creep. “Ngoài phạm vi” quan trọng ngang “trong phạm vi”.

### 5.1 Trong phạm vi (In scope) — V0 Demo

- 5 thành phần demo được trong ~2 phút mỗi phần: (1) bài test đầu vào 30–60′ (5 phần), (2) AI-Ready Profile, (3) Learning Path test-gated, (4) Leaderboard, (5) Dashboard vận hành.

- **Chấm thật bằng AI:** bài test đầu vào chấm hoàn toàn bằng LLM-as-judge + answer_key, demo trên ground-truth set đã biết đáp án (nêu rõ agreement %).

- Dùng dữ liệu mẫu thật (MCQ, audit task, recovery task) — không placeholder “lorem ipsum”.

- Thể hiện sợi chỉ đỏ: test → chấm AI → Profile → Learning Path chạy thông.

- **Level Gate Exam build THẬT** ở mức đơn giản (MCQ, ngưỡng 80%) — không còn chỉ “thể hiện vị trí”.

### 5.2 Ngoài phạm vi (Out of scope) — để dành V1 trở đi

- Chống học viên dùng AI để gian lận khi làm bài (telemetry hook từ Cursor/Claude Code, honeypot, viva video). V0 chỉ chấm artifact.

- Self-consistency multi-run cho bài giáp ranh; human-in-the-loop review confidence thấp.

- Problem bank đầy đủ và percentile tính từ cohort thật.

- Viva platform (record video + examiner async Q&A).

## 6. Các bên liên quan (Stakeholders)

| **Bên liên quan**                | **Vai trò / Lợi ích**                  | **Kỳ vọng chính**                              | **Ảnh hưởng** |
|----------------------------------|----------------------------------------|------------------------------------------------|---------------|
| Ban tổ chức chương trình         | Stakeholder / nghiệm thu               | Hiểu sản phẩm, cho feedback, chốt scope        | Cao           |
| Học viên (end user)              | Người dùng cuối                        | Biết mình ở đâu, có lộ trình tiến              | Cao           |
| Giảng viên / mentor              | Người vận hành                         | Theo dõi cohort, can thiệp người đuối kịp thời | Trung bình    |
| Nhà tuyển dụng                   | Đồng-thiết-kế rubric / dùng credential | Chứng chỉ phản ánh đúng năng lực               | Trung bình    |
| Team phát triển (Gamma, 4 người) | Người xây dựng                         | Scope rõ, tài liệu nhất quán, không confuse    | Cao           |

## 7. Giải pháp tổng quan (Solution Overview)

Một nền tảng gồm năm thành phần liên kết, vận hành theo mô hình test-gated learning:

1.  **Bài test năng lực 5 trục —** test đầu vào ~30–60′ gồm 5 phần (P1 MCQ, P2 Audit, P3 Recovery, P4 Prompt/Plan, P5 Mini-viva), chấm hoàn toàn bằng AI, định vị học viên trên 5 trục.

2.  **AI-Ready Profile —** radar 5 trục + gap analysis + 3 quick wins + peer percentile (opt-in).

3.  **Learning Path test-gated —** thư viện node/lesson; pass checkpoint/Capstone mới mở tiếp; pass hết Capstone + Level Gate Exam (thật) mới lên level.

4.  **Leaderboard —** xếp hạng và filter theo trục.

5.  **Dashboard vận hành —** cohort overview, at-risk list, drill-down cho mentor.

**Sợi chỉ đỏ:** Năm thành phần đều neo vào cùng 5 trục năng lực × 5 level (L0–L4) trong Rubric & Scoring Spec — source of truth của sản phẩm. Ngưỡng tốt nghiệp: L2 (AI-Ready Engineer). Ngưỡng pass mọi bài: 80%.

## 8. Nguyên tắc dẫn đường (Guiding Principles)

- Có trước — hoàn thiện sau — iterate nhiều vòng. MVP demo được cả 5 phần ở mức cơ bản rồi cải tiến.

- Mỗi phần demo được trong 2 phút. Cần giải thích quá 2 phút là chưa đủ rõ.

- Mọi thứ neo vào 5 trục. Khi phân vân: trục nào đang đo? Level nào đang nhắm?

- Đo quá trình, không chỉ sản phẩm. App chạy được chưa đủ; phải thấy cách giao việc, review, recover.

- **Thiết kế để AI chấm tin cậy.** Đề bán cấu trúc + ground-truth set + determinism (temp=0) để việc AI chấm nhất quán và validate được.

- Lead giữ scope. Không làm thêm tính năng ngoài phân công khi chưa xong phần của mình.

## 9. Mốc thời gian cấp cao (High-level Milestones)

| **Giai đoạn**   | **Timeline**          | **Deliverable chính**                       | **Tiêu chí hoàn thành**                                 |
|-----------------|-----------------------|---------------------------------------------|---------------------------------------------------------|
| V0 — Demo       | Tuần này + tuần sau   | 5 phần + chấm AI thật + Gate Exam thật      | Stakeholder hiểu & cho feedback; agreement đạt mục tiêu |
| V1 — Pilot      | Cohort 2 (T5–8/2026)  | Platform chạy với học viên thật + telemetry | Agreement ổn định, NPS \> 30                            |
| V2 — Full       | Cohort 3 (từ T7/2026) | Full engine + problem bank 20+ tasks        | Predictive validity r \> 0.2                            |
| V3 — Credential | Cohort 4 trở đi       | Cert verify được + validity report          | r \> 0.3, nhà tuyển dụng chấp nhận                      |

## 10. Giả định, Ràng buộc & Phụ thuộc

### 10.1 Giả định

- Cohort 2 có đủ học viên (tối thiểu ~100) tham gia pilot V0/V1.

- Nội dung học có thể route sang nguồn miễn phí sẵn có (Anthropic Academy, DeepLearning.AI...).

- **MỚI:** có ngân sách token LLM (dù nhỏ) cho chấm thật ở V0 và chạy validate ground-truth.

### 10.2 Ràng buộc

- V0 demo được trong 1–2 tuần với team 4 người.

- Định vị complementary với SFIA — không cấp “level VCoder” đơn lẻ thay level SFIA.

- Deadline cứng: Draft Solution nộp mentor trước thứ Hai; demo stakeholder cuối tuần.

### 10.3 Phụ thuộc

- Phụ thuộc lịch khai giảng Cohort 2 của Ban tổ chức.

- Phụ thuộc dịch vụ LLM (Anthropic API) cho việc chấm — cần khoá API + ngân sách token.

- Phụ thuộc việc Ban tổ chức kéo được 3–5 nhà tuyển dụng vào đồng-thiết-kế rubric.

## 11. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                                                           |
|---------------|------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | Khởi tạo; nội dung từ Draft Solution, Assessment Framework, Source of Truth v1.1.                                                                                                                                                                            |
| 0.2           | 04/06/2026 | Team Gamma    | Bài test đầu vào 30–60′ 5 phần chấm hoàn toàn bằng AI; Gate Exam build thật ở V0; KPI độ tin đổi sang AI↔human agreement; phạm vi V0 cập nhật (chấm thật, Gate Exam thật; bỏ chống-gaming khỏi V0); thêm giả định/phụ thuộc về LLM. Đồng bộ ADR-009/010/011. |
