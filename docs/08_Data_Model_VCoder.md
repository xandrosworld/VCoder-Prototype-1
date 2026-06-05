**VCoder**

Nền tảng AI-Ready Developer

DATA MODEL / SCHEMA SPECIFICATION

Đặc tả Mô hình Dữ liệu

*Dữ liệu được tổ chức như thế nào — thực thể, quan hệ, và lược đồ*

| **Hạng mục**    | **Nội dung**                                                        |
|-----------------|---------------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                         |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                                     |
| Ngày            | 04/06/2026                                                          |
| Trạng thái      | Đang soạn — chờ review kỹ thuật                                     |
| Đồng bộ với     | Source of Truth v1.1 · ADR-009/010/011 · Rubric v0.2 · API Contract |

## 1. Giới thiệu

Data Model định nghĩa cách dữ liệu được tổ chức trên PostgreSQL 16. Quyết định sớm và cẩn thận vì sai schema rất đắt để sửa về sau. Người đọc chính: dev backend. Mọi enum neo canonical về Source of Truth v1.1 và Rubric — chống lệch định nghĩa (giảm R5).

**Cập nhật v0.2 (theo ADR-009/010/011):** (1) Thêm thực thể LearningContent (nội dung bài học trong DB). (2) Mở rộng Problem thành item bank đầy đủ: answer_key + ground_truth + judge_rubric_ref. (3) AxisScore & Profile thêm metadata chấm-AI: model_version, judge_prompt_version, confidence. (4) Assessment dùng cho test 30–60′ (5 phần). (5) Thêm enum part_type, scoring_method, content_type. Telemetry vẫn \[V1+\] nhưng V0 KHÔNG dùng.

## 2. Sơ đồ quan hệ thực thể (ERD)

Ký hiệu: 1──\< một-nhiều; \>──\< nhiều-nhiều (qua bảng nối).

Cohort 1──\< Learner 1──\< Assessment 1──\< AxisScore │ │ (axis 1..5, raw_score, level, │ │ model_version, confidence) │ └──\< (sinh ra) Profile (snapshot 5 trục) │ ├──\< NodeProgress \>──1 LearningNode 1──\< LearningContent \[MỚI\] │ (status, capstone_passed) 1──\< Problem (item bank) │ ├ answer_key \[MỚI\] │ └ ground_truth \[MỚI\] ├──\< GateExamAttempt \>──1 LevelGateExam 1──\< Problem (rút N câu) │ (passed, score, attempt_no) ├──\< TelemetryEvent \[V1+, append-only, V0 KHÔNG dùng\] └──1 LeaderboardEntry (opt-in; projection từ Profile)

Đường dữ liệu chính: Assessment → AxisScore (LLM judge + answer_key) → Profile → Leaderboard/Dashboard. NodeProgress & GateExamAttempt là tầng gating; pass Gate Exam → cập nhật level trên Profile. LearningNode nay có nội dung (LearningContent) và đề (Problem) ngay trong DB.

## 3. Danh mục thực thể

VCoder v0.2 có 14 thực thể: 12 ở v0.1 + 2 mới (LearningContent, GroundTruth gộp vào Problem). Bảng dưới nêu thực thể & mục đích.

| **Thực thể**     | **Mục đích**                                                            | **Quan hệ chính**                                              |
|------------------|-------------------------------------------------------------------------|----------------------------------------------------------------|
| Learner          | Học viên trong chương trình                                             | n-1 Cohort; 1-n Assessment, NodeProgress, GateExamAttempt      |
| Cohort           | Đợt học cuốn chiếu                                                      | 1-n Learner                                                    |
| Assessment       | Một lần làm bài test đầu vào (30–60′, 5 phần)                           | n-1 Learner; 1-n AxisScore; 1-1 Profile                        |
| AxisScore        | Điểm & level một trục trong một lần test (kèm metadata chấm-AI)         | n-1 Assessment                                                 |
| Profile          | AI-Ready Profile (snapshot 5 trục)                                      | n-1 Learner; ref Assessment                                    |
| LearningNode     | Một node học (1 trục trọng tâm + 1 level)                               | 1-n LearningContent; 1-n Problem; n-n Learner qua NodeProgress |
| LearningContent  | **\[MỚI\] Nội dung micro-lesson của node**                              | n-1 LearningNode                                               |
| NodeProgress     | Tiến độ học viên ở một node                                             | n-1 Learner; n-1 LearningNode                                  |
| Problem          | Đề trong item bank (MCQ/audit/recovery/…) kèm answer_key + ground_truth | n-1 LearningNode hoặc n-1 LevelGateExam                        |
| LevelGateExam    | Bài kiểm tra cuối một level (V0: MCQ thật)                              | 1-1 level; 1-n GateExamAttempt; 1-n Problem                    |
| GateExamAttempt  | Một lần thi Level Gate Exam                                             | n-1 Learner; n-1 LevelGateExam                                 |
| TelemetryEvent   | Sự kiện từ công cụ coding \[V1+, V0 không dùng\]                        | n-1 Learner; append-only                                       |
| LeaderboardEntry | Bản ghi xếp hạng opt-in (projection)                                    | 1-1 Learner (khi opt-in)                                       |

## 4. Chi tiết từng thực thể

### 4.1 Learner

| **Trường**         | **Kiểu**   | **Ràng buộc**             | **Mô tả**                         |
|--------------------|------------|---------------------------|-----------------------------------|
| id                 | UUID       | PK                        | Định danh học viên                |
| email              | string     | unique, not null          | Email đăng nhập                   |
| full_name          | string     | not null                  | Họ tên hiển thị                   |
| cohort_id          | UUID       | FK → Cohort, not null     | Cohort đang theo                  |
| role               | enum(role) | not null, default learner | learner / instructor / admin      |
| opt_in_leaderboard | boolean    | not null, default false   | Đồng ý lên Leaderboard (NFR-06)   |
| opt_in_percentile  | boolean    | not null, default false   | Đồng ý xem/so percentile (NFR-06) |
| consent_telemetry  | boolean    | not null, default false   | Consent telemetry \[V1+\]         |
| created_at         | timestamp  | not null                  | Thời điểm tạo                     |

### 4.2 AxisScore (cập nhật: metadata chấm-AI)

Lưu cả điểm thô lẫn level, gắn assessment_id → vẽ trajectory. Bổ sung metadata để chấm-AI deterministic-as-possible và audit được.

| **Trường**           | **Kiểu**                 | **Ràng buộc**             | **Mô tả**                                             |
|----------------------|--------------------------|---------------------------|-------------------------------------------------------|
| id                   | UUID                     | PK                        | Định danh                                             |
| assessment_id        | UUID                     | FK → Assessment, not null | Thuộc lần test nào                                    |
| axis                 | enum(axis)               | not null                  | Trục năng lực (1..5)                                  |
| raw_score            | float                    | not null, 0..100          | Điểm thô nội bộ 0–100                                 |
| level                | enum(level)              | not null                  | Level đã ánh xạ (L0..L4)                              |
| evidence             | JSONB                    | nullable                  | Bằng chứng (findings, plan, recovery note, trích dẫn) |
| scoring_method       | **enum(scoring_method)** | **not null**              | **deterministic / llm_judge**                         |
| rubric_version       | string                   | not null                  | Phiên bản rubric dùng để chấm                         |
| model_version        | **string**               | **nullable**              | **Model LLM dùng chấm (nếu llm_judge)**               |
| judge_prompt_version | **string**               | **nullable**              | **Phiên bản judge prompt**                            |
| confidence           | **float**                | **nullable, 0..1**        | **Độ chắc của judge; thấp → hàng đợi review**         |

### 4.3 Assessment (cập nhật: test 5 phần)

| **Trường**      | **Kiểu**            | **Ràng buộc**           | **Mô tả**                                               |
|-----------------|---------------------|-------------------------|---------------------------------------------------------|
| id              | UUID                | PK                      | Định danh lần test                                      |
| learner_id      | UUID                | FK → Learner, not null  | Của học viên nào                                        |
| started_at      | timestamp           | not null                | Bắt đầu                                                 |
| submitted_at    | timestamp           | nullable                | Nộp (null nếu chưa xong)                                |
| status          | enum(assess_status) | not null                | in_progress / submitted / scoring / scored / expired    |
| part_answers    | **JSONB**           | **nullable**            | **Bài làm 5 phần (P1 đáp án MCQ; P2–P5 artifact text)** |
| raw_part_scores | **JSONB**           | **nullable**            | **Điểm thô từng phần (input gộp thành AxisScore)**      |
| is_retest       | boolean             | not null, default false | Re-test tùy chọn (FR-08)                                |

### 4.4 Profile (cập nhật: nguồn cập nhật từ Gate Exam)

| **Trường**           | **Kiểu**        | **Ràng buộc**             | **Mô tả**                                               |
|----------------------|-----------------|---------------------------|---------------------------------------------------------|
| id                   | UUID            | PK                        | Định danh snapshot                                      |
| learner_id           | UUID            | FK → Learner, not null    | Của học viên nào                                        |
| source_assessment_id | UUID            | FK → Assessment, nullable | Lần test sinh snapshot (null nếu cập nhật từ Gate Exam) |
| levels               | JSONB           | not null                  | Map 5 trục → level hiện tại (radar)                     |
| readiness_status     | enum(readiness) | not null                  | foundation_needed / developing / ai_ready / advanced    |
| red_flags            | JSONB           | nullable                  | Red flag (lộ secret, viva fail) — hiển thị riêng        |
| quick_wins           | JSONB           | nullable                  | 3 hành động ưu tiên                                     |
| updated_source       | **enum**        | **not null**              | **intake_test / gate_exam — nguồn cập nhật gần nhất**   |
| created_at           | timestamp       | not null                  | Thời điểm snapshot                                      |

### 4.5 LearningNode, LearningContent & NodeProgress

**LearningContent là thực thể MỚI** (ADR-010): lưu nội dung micro-lesson trong DB để đổi nội dung không cần deploy và route được sang nguồn ngoài.

| **Trường**                   | **Kiểu**               | **Ràng buộc**           | **Mô tả**                                    |
|------------------------------|------------------------|-------------------------|----------------------------------------------|
| LearningNode.id              | UUID                   | PK                      | Định danh node                               |
| LearningNode.title           | string                 | not null                | Tên node                                     |
| LearningNode.level           | enum(level)            | not null                | Node thuộc level nào                         |
| LearningNode.primary_axis    | enum(axis)             | not null                | Trục trọng tâm                               |
| LearningContent.id           | **UUID**               | **PK**                  | **Định danh micro-lesson**                   |
| LearningContent.node_id      | **UUID**               | **FK → LearningNode**   | **Thuộc node nào**                           |
| LearningContent.order        | **int**                | **not null**            | **Thứ tự lesson trong node**                 |
| LearningContent.content_type | **enum(content_type)** | **not null**            | **markdown / video_url / external_link**     |
| LearningContent.body         | **JSONB/text**         | **not null**            | **Nội dung hoặc URL ngoài**                  |
| NodeProgress.status          | enum(node_status)      | not null                | locked / available / in_progress / completed |
| NodeProgress.capstone_passed | boolean                | not null, default false | Đã pass Capstone đóng node chưa              |

### 4.6 Problem (cập nhật: item bank đầy đủ — ADR-010)

Problem nay là item bank thật: lưu đề, đáp án chấm tất định (answer_key), và ground-truth cho LLM judge. Dùng cho checkpoint, Capstone, Gate Exam, và các phần artifact của test đầu vào.

| **Trường**       | **Kiểu**            | **Ràng buộc**                | **Mô tả**                                                          |
|------------------|---------------------|------------------------------|--------------------------------------------------------------------|
| id               | UUID                | PK                           | Định danh đề                                                       |
| node_id          | UUID                | FK → LearningNode, nullable  | Nếu đề thuộc node (checkpoint/Capstone)                            |
| exam_id          | UUID                | FK → LevelGateExam, nullable | Nếu đề thuộc Gate Exam                                             |
| part_type        | **enum(part_type)** | **nullable**                 | **mcq / audit / recovery / prompt_plan / viva (cho test đầu vào)** |
| problem_type     | enum(problem_type)  | not null                     | mcq / audit / recovery / capstone / gate                           |
| axis             | enum(axis)          | nullable                     | Trục đề đo (nếu có)                                                |
| difficulty       | int 1..5            | not null                     | Độ khó (để rút đề giữ phân bố)                                     |
| payload          | JSONB               | not null                     | Nội dung đề (câu hỏi, code, tình huống)                            |
| answer_key       | **JSONB**           | **nullable**                 | **Đáp án chấm tất định (MCQ); danh sách bug chuẩn (audit)**        |
| ground_truth     | **JSONB**           | **nullable**                 | **Gold label/level chuẩn cho phần artifact (validate LLM judge)**  |
| judge_rubric_ref | **string**          | **nullable**                 | **Tham chiếu anchor/tiêu chí trong rubric YAML cho LLM judge**     |

### 4.7 LevelGateExam & GateExamAttempt (V0: thật, MCQ — ADR-011)

| **Trường**                   | **Kiểu**    | **Ràng buộc**         | **Mô tả**                                            |
|------------------------------|-------------|-----------------------|------------------------------------------------------|
| LevelGateExam.id             | UUID        | PK                    | Định danh bài Gate Exam                              |
| LevelGateExam.level          | enum(level) | unique, not null      | Gắn 1 level                                          |
| LevelGateExam.focus_axes     | JSONB       | not null              | Các trục trọng tâm của level                         |
| LevelGateExam.num_questions  | **int**     | **not null**          | **Số câu rút từ item bank mỗi lần thi**              |
| LevelGateExam.pass_threshold | float       | not null, default 0.8 | Ngưỡng pass = 80% (ADR-007)                          |
| GateExamAttempt.id           | UUID        | PK                    | Định danh lần thi                                    |
| GateExamAttempt.learner_id   | UUID        | FK → Learner          | Của học viên nào                                     |
| GateExamAttempt.exam_id      | UUID        | FK → LevelGateExam    | Bài Gate Exam nào                                    |
| GateExamAttempt.attempt_no   | int         | not null              | Lần thi thứ mấy                                      |
| GateExamAttempt.question_ids | **JSONB**   | **not null**          | **Bộ câu đã rút (chống học vẹt: khác giữa các lần)** |
| GateExamAttempt.score        | float       | not null              | Điểm % đạt                                           |
| GateExamAttempt.passed       | boolean     | not null              | Đạt ≥80% hay không                                   |
| GateExamAttempt.taken_at     | timestamp   | not null              | Thời điểm thi (tính cooldown)                        |

### 4.8 Các thực thể còn lại (tóm tắt)

- Cohort: id (PK), name, start_date, target_size. 1-n Learner.

- LeaderboardEntry: id (PK), learner_id (FK, unique), avg_level (float), axis_levels (JSONB), updated_at. Chỉ tồn tại khi opt_in_leaderboard = true; projection.

## 5. Quy tắc toàn vẹn & ràng buộc

- axis ∈ 1–5; level ∈ L0–L4; raw_score ∈ 0–100 (CHECK constraint).

- Không xoá Learner còn Assessment/Profile (RESTRICT); xoá thật phải qua ẩn danh.

- Mỗi (learner_id, node_id) chỉ một NodeProgress (unique).

- Mỗi level chỉ một LevelGateExam (unique trên level).

- Profile.levels đủ 5 trục; readiness_status nhất quán với levels theo công thức Rubric (tầng ứng dụng).

- **MỚI:** AxisScore.scoring_method = llm_judge BẮT BUỘC có model_version + judge_prompt_version (chấm lại được).

- **MỚI:** Problem dùng cho phần artifact nên có ground_truth hoặc judge_rubric_ref; MCQ bắt buộc có answer_key.

- **MỚI:** GateExamAttempt.passed = (score ≥ LevelGateExam.pass_threshold). Pass → cập nhật Profile (updated_source = gate_exam).

- TelemetryEvent chỉ ghi khi consent_telemetry = true \[V1+\]; V0 không sinh dòng nào.

## 6. Dữ liệu tham chiếu & enum

| **Enum**       | **Giá trị hợp lệ**                                | **Nguồn chuẩn**                |
|----------------|---------------------------------------------------|--------------------------------|
| axis           | 1, 2, 3, 4, 5                                     | Source of Truth §2 / Rubric §2 |
| level          | L0, L1, L2, L3, L4                                | Source of Truth §3 / Rubric §3 |
| readiness      | foundation_needed, developing, ai_ready, advanced | Source of Truth §5.2           |
| node_status    | locked, available, in_progress, completed         | Functional Spec F3             |
| assess_status  | in_progress, submitted, scoring, scored, expired  | Functional Spec F1             |
| role           | learner, instructor, admin                        | TDD §7 (RBAC)                  |
| problem_type   | mcq, audit, recovery, capstone, gate              | Functional Spec / Rubric §6    |
| part_type      | **mcq, audit, recovery, prompt_plan, viva**       | **Functional Spec F1 §3.2**    |
| scoring_method | **deterministic, llm_judge**                      | **ADR-009 / Rubric §7**        |
| content_type   | **markdown, video_url, external_link**            | **ADR-010 / Func Spec F3**     |

**Ngưỡng AI-Ready** KHÔNG lưu cứng — tính theo định nghĩa từng trục (A1≥L2, A2≥L2, A3≥L1, A4≥L2; A5 không gate). Ngưỡng pass mọi bài = 80% (ADR-007), lưu ở LevelGateExam.pass_threshold + rubric config.

## 7. Lưu trữ telemetry (V1+, V0 không dùng)

Giữ nguyên đặc tả v0.1 (append-only, consent-gated) để V1 cắm vào. V0 KHÔNG sinh telemetry — chỉ chấm artifact. TelemetryEvent: id, learner_id, assessment_id (nullable), tool (cursor/claude_code), event_type (prompt/diff_accepted/diff_rejected/plan_mode/checkpoint), payload (đã lọc secret), occurred_at.

## 8. Migration & phiên bản schema

- Công cụ: Alembic. Mỗi thay đổi là migration version tăng dần (vd 0008_add_learning_content).

- Có dữ liệu thật (V1+): thêm cột nullable → backfill → ràng buộc, tránh downtime.

- JSONB (evidence, payload, ground_truth, levels) cho tiến hoá cấu trúc phụ không cần migration cột.

- Mỗi Profile/AxisScore lưu rubric_version + model_version → diễn giải đúng kể cả khi rubric/model đổi.

## 9. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                                                                                                                                                               |
|---------------|------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | 12 thực thể; AxisScore trajectory; TelemetryEvent append-only; enum canonical.                                                                                                                                                                                                                                                                                   |
| 0.2           | 04/06/2026 | Team Gamma    | Thêm LearningContent; mở rộng Problem thành item bank (answer_key + ground_truth + judge_rubric_ref); AxisScore + Profile thêm metadata chấm-AI (scoring_method, model_version, judge_prompt_version, confidence); Assessment cho test 5 phần; Gate Exam pass_threshold=0.8 + question_ids; enum part_type/scoring_method/content_type. Đồng bộ ADR-009/010/011. |
