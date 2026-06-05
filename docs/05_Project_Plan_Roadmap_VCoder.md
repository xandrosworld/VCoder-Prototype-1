**VCoder**

Nền tảng AI-Ready Developer

PROJECT PLAN & ROADMAP

Kế hoạch & Lộ trình Dự án

*Ai làm gì, khi nào, theo trình tự nào — và làm sao kiểm soát thay đổi*

| **Hạng mục**    | **Nội dung**                                                 |
|-----------------|--------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                  |
| Người phụ trách | Đặng Văn Minh — Lead Team                                    |
| Ngày            | 04/06/2026                                                   |
| Trạng thái      | Đang soạn — chờ review                                       |
| Đồng bộ với     | Source of Truth v1.1 · PRD v0.2 · TDD v0.2 · ADR-009/010/011 |

## 1. Mục đích & Phạm vi kế hoạch

Tài liệu trình bày lộ trình phát triển VCoder, phân rã công việc, phân công trách nhiệm, các mốc, nhịp làm việc và kiểm soát thay đổi. Đây là tài liệu điều phối — không lặp nội dung sản phẩm (PRD/Functional Spec) mà tập trung CÁCH tổ chức thực hiện.

**Cập nhật v0.2 (ADR-009/010/011):** Công việc V0 nay gồm chấm THẬT bằng AI (LLM judge + answer_key) và Gate Exam thật — không còn mockup chấm/stub. Thêm hai hạng mục nền: chuẩn bị GROUND-TRUTH SET và seed ITEM BANK + nội dung bài học vào DB. Đường găng đổi theo (mục 6).

Phạm vi: phủ V0 → V3, chi tiết nhất ở V0 (demo) và V1 (pilot Cohort 2).

## 2. Đội ngũ & Vai trò

| **Vai trò** | **Người**     | **Cấu phần phụ trách**                                        | **FR liên quan** |
|-------------|---------------|---------------------------------------------------------------|------------------|
| Lead / PMO  | Đặng Văn Minh | Điều phối, giữ Consistency 5 trục, scope, rubric/ground-truth | Tất cả           |
| TV1         | \[điền tên\]  | F1 — Test UI (5 phần) + tích hợp chấm                         | FR-01            |
| TV2         | \[điền tên\]  | F2 — Profile + Scoring Engine (LLM judge)                     | FR-02            |
| TV3         | \[điền tên\]  | F3 — Learning Path + Gate Exam thật                           | FR-03, FR-06     |
| TV4         | \[điền tên\]  | F4 + F5 — Leaderboard & Dashboard                             | FR-04, FR-05     |

Ghi chú: nhãn TV1–TV4 gắn tên thật khi chốt. Lead chịu trách nhiệm cuối về nhất quán + sở hữu rubric config & ground-truth set.

## 3. Ma trận trách nhiệm (RACI)

R = Responsible, A = Accountable (mỗi việc một A), C = Consulted, I = Informed.

| **Cấu phần**                         | **Lead** | **TV1** | **TV2** | **TV3** | **TV4** |
|--------------------------------------|----------|---------|---------|---------|---------|
| F1 — Test UI                         | A/C      | R       | C       | C       | I       |
| F2 — Profile + Scoring Engine        | A/C      | C       | R       | C       | I       |
| F3 — Learning Path + Gate Exam       | A/C      | C       | C       | R       | I       |
| F4 — Leaderboard                     | A/C      | I       | C       | I       | R       |
| F5 — Dashboard                       | A/C      | I       | C       | C       | R       |
| Chấm-AI: judge prompt + ground-truth | R/A      | C       | R       | C       | I       |
| Item bank + nội dung bài học (DB)    | R/A      | C       | C       | R       | C       |
| Consistency 5 trục (cross-cut)       | R/A      | C       | C       | C       | C       |
| Demo & trình stakeholder             | A        | R       | R       | R       | R       |

## 4. Lộ trình sản phẩm (Roadmap V0 → V3)

| **Phiên bản**   | **Timeline**          | **Trọng tâm**                                                     | **Tiêu chí hoàn thành (exit)**                                                                       |
|-----------------|-----------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| V0 — Demo       | Tuần này + tuần sau   | 5 cấu phần + chấm AI thật + Gate Exam thật, sợi chỉ đỏ chạy thông | Stakeholder hiểu & cho feedback; AI↔human agreement đạt mục tiêu trên ground-truth; mỗi phần demo 2′ |
| V1 — Pilot      | Cohort 2 (T5–T8/2026) | Platform chạy thật + telemetry có consent + self-consistency chấm | Agreement ổn định; NPS \> 30; ≥80% hoàn thành Profile                                                |
| V2 — Full       | Cohort 3 (từ T7/2026) | Full engine, problem bank 20+ task, re-assessment, drill-down     | Predictive validity r \> 0.2                                                                         |
| V3 — Credential | Cohort 4 trở đi       | Chứng chỉ verify được + báo cáo validity                          | r \> 0.3; nhà tuyển dụng công nhận; 1–2 B2B pilot                                                    |

## 5. Phân rã công việc — V0 (Sprint hiện tại)

“Done” = demo được 2 phút, dùng dữ liệu mẫu thật, neo đúng 5 trục.

| **Cấu phần**              | **Hạng mục công việc V0**                                                                | **Phụ trách** | **Ưu tiên** |
|---------------------------|------------------------------------------------------------------------------------------|---------------|-------------|
| F1 Test UI                | 6 màn: Landing, P1 MCQ, P2 Audit, P3 Recovery, P4 Prompt/Plan, P5 Viva + màn “đang chấm” | TV1           | Must        |
| Scoring Engine            | score(): MCQ tất định + điều phối LLM judge P2–P5 (temp=0) + map level; async + status   | TV2           | Must        |
| F2 Profile                | Radar 5 trục, readiness, gap, 3 quick wins (đọc từ Scoring Engine)                       | TV2           | Must        |
| F3 Learning Path          | Node locked/unlocked, checkpoint, Capstone, nội dung từ DB                               | TV3           | Must        |
| Gate Exam (thật)          | Rút N câu MCQ từ item bank, chấm ≥80%, pass → lên level + cập nhật Profile               | TV3           | Must        |
| F4 Leaderboard            | Xếp theo level TB + filter trục (≥10 học viên mẫu)                                       | TV4           | Should      |
| F5 Dashboard              | Cohort overview + at-risk (≥3 mẫu) + drill-down cơ bản                                   | TV4           | Should      |
| Ground-truth set          | **3–5 bài/phần có gold label + bug set cho P2 (validate AI chấm)**                       | Lead          | Must        |
| Item bank + nội dung (DB) | **Seed MCQ + answer_key + đề artifact + LearningContent vào PostgreSQL**                 | Lead + TV3    | Must        |
| Cross-cut                 | Đồng bộ tên trục/level/ngưỡng theo Rubric                                                | Lead          | Must        |

## 6. Phụ thuộc & Đường găng (Critical Path)

Thứ tự phụ thuộc quyết định đường găng V0 (đã đổi theo chấm-AI):

1.  Rubric/Source of Truth chốt trước (đã xong v1.1 + rubric_config v0.2).

2.  **MỚI:** Item bank + answer_key + ground-truth set phải seed sớm → là đầu vào cho Scoring Engine chấm thật.

3.  Scoring Engine (LLM judge) chấm ra Profile → đầu vào cho F2 Profile.

4.  F2 Profile + F3 Learning Path → đầu vào cho F4 Leaderboard & F5 Dashboard.

5.  Cross-cut consistency chạy song song, chốt lần cuối trước demo.

**Rủi ro đường găng mới:** Chấm-AI giờ nằm trên đường găng (F1→Scoring→F2). Nếu LLM judge hoặc ground-truth set chưa sẵn, cả chuỗi Profile/Leaderboard/Dashboard trễ. Giảm thiểu: (1) seed ground-truth + item bank NGAY đầu sprint; (2) Scoring Engine skeleton + mock LLM để F2 build song song; (3) chốt sớm schema Profile JSON (API Contract v0.2) cho TV4.

## 7. Các mốc quan trọng (Milestones)

| **Mốc** | **Sự kiện**                                   | **Deliverable**                              | **Người chịu trách nhiệm** |
|---------|-----------------------------------------------|----------------------------------------------|----------------------------|
| M0      | Chốt Source of Truth & Rubric + rubric_config | SoT v1.1 + Rubric v0.2 + YAML                | Lead                       |
| M0.5    | **Seed item bank + ground-truth set (MỚI)**   | Item bank DB + gold labels                   | Lead + TV3                 |
| M1      | Nộp Draft Solution cho mentor                 | Bộ tài liệu sản phẩm v0.2                    | Lead                       |
| M2      | Hoàn tất 5 cấu phần + chấm AI thật            | 5 cấu phần demo + Profile chấm thật          | Cả team                    |
| M3      | Demo & trình stakeholder                      | Demo 2′/phần + agreement % trên ground-truth | Cả team                    |
| M4      | Tổng hợp feedback, lập kế hoạch V1            | Backlog V1 + plan pilot                      | Lead                       |

## 8. Nhịp làm việc & Họp (Cadence)

- Daily async standup: mỗi người 3 dòng (hôm qua / hôm nay / blocker).

- Mid-sprint sync: ráp thử sợi chỉ đỏ test → chấm AI → profile → learning path để bắt lệch sớm.

- Demo review: cuối sprint, mỗi cấu phần demo 2′; rà soát rủi ro mức Cao (R1, R4, R5, R11, R12, R16).

- Quyết định nhanh: vấn đề ngoài phân công đưa Lead quyết trong 24h.

## 9. Kiểm soát thay đổi (Change Control)

6.  Đề xuất thay đổi ghi ngắn: thay đổi gì, vì sao, ảnh hưởng scope/timeline.

7.  Lead đánh giá tác động (đặc biệt lên đường găng & cấu phần phụ thuộc).

8.  Quyết định: chấp nhận / hoãn / từ chối — ghi vào lịch sử + ADR nếu là quyết định kiến trúc.

9.  Nếu ảnh hưởng định nghĩa trục/level: cập nhật Source of Truth & Rubric, thông báo cả team.

**Ví dụ áp dụng gần đây:** hai pivot lớn (chấm AI + test 30–60′) đã đi qua quy trình này → sinh ADR-009/010/011 và cập nhật toàn bộ bộ tài liệu lên v0.2.

## 10. Ngân sách ước lượng (minh hoạ)

| **Hạng mục**                       | **V0 (Demo)**                          | **V1 (Pilot)**                     | **Ghi chú**                                   |
|------------------------------------|----------------------------------------|------------------------------------|-----------------------------------------------|
| Nhân lực (4 người)                 | Nội bộ chương trình                    | Nội bộ + part-time                 | Quy đổi theo thời gian team                   |
| Hạ tầng (hosting, DB)              | ~0 (free tier)                         | ~3–5 triệu VND/tháng               | Scale theo số học viên                        |
| LLM API (chấm)                     | ~vài trăm K (chấm demo + ground-truth) | ~5–10 triệu VND/tháng              | V0 đã CÓ chi phí LLM vì chấm thật (khác v0.1) |
| Nội dung (item bank, ground-truth) | Soạn item bank + gold labels           | ~10–15 triệu VND                   | Việc nội dung, ưu tiên trước demo             |
| Chấm chéo / examiner               | ~0 (AI chấm + gold labels)             | ~5 triệu/cohort (mở rộng gold set) | Để đo agreement                               |
| Tổng ước lượng/tháng (V1)          | —                                      | ~18–35 triệu VND                   | Khoảng minh hoạ, cần xác nhận                 |

**Lưu ý ngân sách v0.2:** khác v0.1, V0 đã phát sinh chi phí LLM API vì chấm thật (dù nhỏ). Cần một khoản token cho chấm demo + chạy validate ground-truth.

## 11. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                                                                                  |
|---------------|------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | Roadmap V0→V3, RACI, WBS V0, đường găng, milestones, change control, ngân sách.                                                                                                                                                                                                     |
| 0.2           | 04/06/2026 | Team Gamma    | WBS V0 cập nhật chấm-AI thật (Scoring Engine LLM judge) + Gate Exam thật; thêm hạng mục ground-truth set & item bank/nội dung DB (M0.5); đường găng đổi (chấm-AI trên critical path); RACI thêm dòng chấm-AI & item bank; ngân sách thêm chi phí LLM ở V0. Đồng bộ ADR-009/010/011. |
