**VCoder**

Nền tảng AI-Ready Developer

API / INTERFACE CONTRACT

Hợp đồng API & Giao diện

*Các thành phần giao tiếp với nhau như thế nào — input, output, lỗi*

| **Hạng mục**    | **Nội dung**                                                        |
|-----------------|---------------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                         |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                                     |
| Ngày            | 04/06/2026                                                          |
| Trạng thái      | Đang soạn — chờ review kỹ thuật                                     |
| Đồng bộ với     | Data Model v0.2 · TDD v0.2 · Functional Spec v0.2 · ADR-009/010/011 |

## 1. Giới thiệu

API Contract là HỢP ĐỒNG giữa các bên: frontend ↔ backend, Scoring Engine ↔ data, hệ thống ↔ LLM judge. Định nghĩa rõ input/output/lỗi để hai phía build SONG SONG mà vẫn khớp. Với team Vibe Coding, contract rõ giúp AI agent build đúng interface.

**Cập nhật v0.2 (ADR-009/010/011):** (1) Bỏ \[V0-STUB\] — V0 chấm thật bằng AI. (2) submit trả 202 + chấm ASYNC; thêm GET /assessments/{id}/status. (3) Thêm GET /nodes/{id}/content (nội dung bài học từ DB). (4) Gate Exam build thật (MCQ, ≥80%). (5) Ví dụ Profile cập nhật theo test 5 phần (P1–P5), bỏ M1/M2; thêm scoring_method/model_version/confidence. (6) score() đọc part_answers, dùng LLM judge.

### 1.1 Quy ước chung

| **Hạng mục** | **Quy ước**                                                                        |
|--------------|------------------------------------------------------------------------------------|
| Định dạng    | JSON cho cả request và response (Content-Type: application/json).                  |
| Versioning   | Qua path: mọi endpoint dưới tiền tố /v1/. Breaking change → tăng /v2/.             |
| Đặt tên      | Tài nguyên số nhiều, snake_case cho field JSON (vd readiness_status, axis_levels). |
| Thời gian    | Chuẩn ISO 8601, UTC (vd 2026-06-04T09:30:00Z).                                     |
| Phân trang   | Query ?page=&page_size= (mặc định 20); response kèm total & page.                  |
| ID           | UUID v4 cho mọi khoá chính.                                                        |
| Tác vụ dài   | MỚI: chấm bài là async. submit trả 202; client poll GET .../status.                |

## 2. Xác thực & Phân quyền

Cơ chế: JWT token-based. Sau đăng nhập, client nhận access token; gửi kèm header Authorization: Bearer \<token\>. Token mã hoá vai trò + learner_id; backend kiểm scope ở từng endpoint. API stateless (NFR-03).

| **Vai trò**         | **Phạm vi truy cập**            | **Ví dụ quyền**                                                   |
|---------------------|---------------------------------|-------------------------------------------------------------------|
| learner             | Chỉ dữ liệu của chính mình      | Xem Profile mình; làm test; học Learning Path; opt-in leaderboard |
| instructor / mentor | Học viên trong cohort phụ trách | Xem Dashboard cohort; drill-down; at-risk list                    |
| admin (Lead)        | Toàn quyền vận hành             | Tất cả; cấu hình rubric version; quản trị cohort                  |

## 3. Quy ước mã lỗi

| **HTTP** | **Mã nội bộ**    | **Ý nghĩa**                                       | **Client nên làm gì**                   |
|----------|------------------|---------------------------------------------------|-----------------------------------------|
| 400      | VALIDATION_ERROR | Request sai định dạng/thiếu field                 | Hiển thị lỗi field; không retry tự động |
| 401      | UNAUTHENTICATED  | Thiếu/sai token                                   | Chuyển về màn đăng nhập                 |
| 403      | FORBIDDEN        | Không đủ quyền                                    | Ẩn chức năng; báo không có quyền        |
| 404      | NOT_FOUND        | Tài nguyên không tồn tại                          | Hiển thị trạng thái rỗng phù hợp        |
| 409      | CONFLICT         | Vi phạm nghiệp vụ (vd thi Gate khi đang cooldown) | Hiển thị lý do từ message               |
| 422      | BUSINESS_RULE    | Hợp lệ cú pháp nhưng sai luật gating              | Hiển thị điều kiện còn thiếu            |
| 500      | INTERNAL_ERROR   | Lỗi server                                        | Báo lỗi chung; cho thử lại sau          |

**Cấu trúc lỗi thống nhất:** { "error": { "code": "FORBIDDEN", "message": "..." } }

## 4. Danh mục endpoint

Bảng tổng hợp endpoint, nhóm theo tài nguyên. \[V0\] = build thật ở V0; \[V1+\] = pilot. Cột Đổi ghi thay đổi so với v0.1.

| **Method** | **Đường dẫn**                        | **Mục đích (FR/F)**              | **Phạm vi**             |
|------------|--------------------------------------|----------------------------------|-------------------------|
| POST       | /v1/auth/login                       | Đăng nhập, nhận JWT              | công khai               |
| POST       | /v1/assessments                      | Tạo lần làm bài test (F1)        | **\[V0\] (đổi: thật)**  |
| POST       | /v1/assessments/{id}/submit          | Nộp bài → 202, chấm async (F1)   | **\[V0\] (đổi: async)** |
| GET        | /v1/assessments/{id}/status          | Trạng thái chấm (scoring/scored) | **\[V0\] MỚI**          |
| GET        | /v1/learners/{id}/profile            | Profile mới nhất (F2)            | \[V0\]                  |
| GET        | /v1/learners/{id}/profile/history    | Trajectory (FR-08)               | \[V1+\]                 |
| GET        | /v1/learners/{id}/learning-path      | Path + node locked/unlocked (F3) | \[V0\]                  |
| GET        | /v1/nodes/{id}/content               | Nội dung micro-lesson từ DB (F3) | **\[V0\] MỚI**          |
| POST       | /v1/nodes/{id}/capstone/submit       | Nộp Capstone (F3)                | \[V0\]                  |
| GET        | /v1/levels/{level}/gate-exam         | Trạng thái Gate Exam (F3)        | **\[V0\] (đổi: thật)**  |
| POST       | /v1/levels/{level}/gate-exam/attempt | Thi Gate Exam (FR-06)            | **\[V0\] (đổi: thật)**  |
| GET        | /v1/cohorts/{id}/leaderboard         | Xếp hạng, filter trục (F4)       | \[V0\]                  |
| GET        | /v1/cohorts/{id}/dashboard           | Cohort overview + at-risk (F5)   | \[V0\]                  |
| GET        | /v1/learners/{id}/me/data            | Dữ liệu hệ thống thu (NFR-06)    | \[V0\]                  |
| POST       | /v1/telemetry/events                 | Event từ công cụ coding (FR-07)  | \[V1+\] V0 không dùng   |

## 5. Chi tiết endpoint lõi V0

### 5.1 POST /v1/assessments/{id}/submit (đổi: async)

Mô tả: nộp bài 5 phần → backend lưu part_answers, đặt status=scoring, kích hoạt chấm async (LLM judge), trả về ngay 202. KHÔNG chờ chấm xong (chấm có thể mất chục giây vì gọi LLM).

**Response 202 — ví dụ:**

{ "assessment_id": "a91...77", "status": "scoring", "poll": "/v1/assessments/a91...77/status" }

**Lỗi có thể:** 401, 403, 409 (đã nộp rồi), 422 (thiếu phần bắt buộc).

### 5.2 GET /v1/assessments/{id}/status (MỚI)

Mô tả: client poll để biết đã chấm xong chưa. Phục vụ màn “đang chấm…” (AC-F1.1, ≤60s với 95% bài).

**Response 200 — ví dụ:**

{ "assessment_id": "a91...77", "status": "scored", "scored_parts": 5, "total_parts": 5, "profile_ready": true }

**Giá trị status:** scoring / scored / partial (có phần “chưa chấm được” — AC-F1.6). Lỗi: 401, 403, 404.

### 5.3 GET /v1/learners/{id}/profile (đổi: bỏ M1/M2, thêm metadata chấm-AI)

Mô tả: trả Profile mới nhất (5 trục từ P1–P5 + readiness + red flags + quick wins). Quyền: learner(self)/instructor.

**Response 200 — ví dụ:**

{ "learner_id": "8c1f...e2", "source_assessment_id": "a91...77", "levels": { "1":"L2","2":"L1","3":"L2","4":"L2","5":"L1" }, "readiness_status": "developing", "graduation_marker": "L2", "updated_source": "intake_test", "red_flags": \[ { "type":"secret_leak", "part":"P2", "note":"Lộ API key trong đoạn audit" } \], "gaps": \[ { "axis":2, "current":"L1", "needed":"L2", "evidence":"Chưa phát hiện SQL injection ở P2 Audit" } \], "quick_wins": \[ "Tập review diff trước khi accept", "Thêm 1 scenario test cho failure path", "Khai báo off-limits (.env) trong CLAUDE.md" \], "percentile": null, "scoring_method": "llm_judge", "model_version": "claude-sonnet-4-6", "rubric_version": "v0.2", "judge_prompt_version": "jp-v0.2", "confidence": 0.84 }

**Lưu ý:** part thay cho module (M1/M2 cũ); percentile=null khi chưa opt-in. Trục “chưa chấm được” trả level kèm cờ thiếu dữ liệu, không bịa. Lỗi: 401, 403, 404.

### 5.4 GET /v1/nodes/{id}/content (MỚI — ADR-010)

Mô tả: trả nội dung micro-lesson của node từ DB (content-in-DB). Quyền: learner(self).

{ "node_id":"n2", "title":"Scoped prompting", "contents":\[ { "order":1, "content_type":"markdown", "body":"# Scoped prompt\n..." } \] }

**Lỗi có thể:** 401, 403, 404.

### 5.5 GET /v1/learners/{id}/learning-path

Mô tả: cây path 5 level + trạng thái node + trạng thái Gate Exam mỗi level. Quy tắc: node cùng level mở song song; gate_exam.state=locked tới khi pass HẾT Capstone.

{ "current_level":"L1", "levels":\[ { "level":"L1","state":"open", "nodes":\[ {"node_id":"n1","title":"Scoped prompting","primary_axis":1, "status":"completed","capstone_passed":true}, {"node_id":"n2","status":"in_progress","capstone_passed":false} \], "gate_exam":{"level":"L1","state":"locked", "reason":"Còn 1 node chưa pass Capstone"} } \] }

**Lỗi có thể:** 401, 403, 404.

### 5.6 POST /v1/levels/{level}/gate-exam/attempt (đổi: thật, MCQ ≥80%)

Mô tả: thi Level Gate Exam thật. Backend rút N câu MCQ từ item bank của level (giữ phân bố độ khó, khác lần trước), chấm tất định, ngưỡng 80% (ADR-007/011). Chỉ chấp nhận khi đã pass hết Capstone (nếu chưa → 422).

**Response 200 — ví dụ (pass):**

{ "passed":true, "attempt_no":1, "score":0.86, "new_level":"L2", "profile_updated":true }

**Nếu fail:** passed=false, score\<0.8, new_level giữ nguyên, kèm gợi ý node ôn + cooldown. Lỗi: 401, 403, 422 (chưa đủ Capstone), 409 (đang cooldown).

### 5.7 GET /v1/cohorts/{id}/leaderboard & 5.8 /dashboard

Leaderboard: xếp theo level TB 5 trục; ?axis=2 xếp lại theo trục; chỉ học viên opt-in; tie-break theo số trục đạt L2. Dashboard: phân bố level + at-risk (axis cốt lõi L0 HOẶC stuck quá lâu) + drill-down. Quyền dashboard: instructor/admin.

## 6. Giao diện nội bộ (không qua HTTP)

### 6.1 Scoring Engine: score(assessment_id, rubric_version) → Profile (đổi: chấm AI)

| **Khía cạnh**  | **Đặc tả**                                                                                                                                                          |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Input          | assessment_id (đã có part_answers 5 phần P1–P5); rubric_version.                                                                                                    |
| Output         | Profile: 5 AxisScore (raw_score + level + evidence + scoring_method + confidence), readiness_status, red_flags, quick_wins.                                         |
| Tiền điều kiện | Assessment.status = submitted và part_answers != null.                                                                                                              |
| Hậu điều kiện  | Profile lưu (snapshot mới, không ghi đè); status=scored; level cập nhật cho Learning Path đọc.                                                                      |
| Cách chấm      | MỚI: P1 tất định (answer_key); P2–P5 LLM judge (temp=0, jp-v0.2). Lưu model_version + judge_prompt_version.                                                         |
| Bất biến       | Chấm deterministic-as-possible (temp=0, version-pin); JSON sai 2 lần → “chưa chấm được”, KHÔNG bịa; readiness theo từng trục; A5 không gate; red flag không bị che. |

### 6.2 Learning Path: evaluate_gate(learner_id, level) → GateDecision

Input: learner_id, level. Output: { all_capstones_passed, gate_unlocked, missing_nodes }. Bất biến: gate_unlocked=true CHỈ KHI mọi node trong level có capstone_passed=true (gating Hướng B).

## 7. Telemetry Ingest Contract (V1+, V0 không dùng)

Giữ nguyên đặc tả để V1 cắm vào. Endpoint POST /v1/telemetry/events chỉ nhận khi consent_telemetry=true (nếu false → 403); append-only, idempotent theo id; payload đã lọc secret phía client. Response 202. V0 KHÔNG gửi telemetry (ADR-009 — chỉ chấm artifact).

## 8. Phiên bản & Tương thích

Breaking change (đổi/xoá field, đổi nghĩa) → tăng /v2/. Thêm field optional là non-breaking. Frontend và backend tiến hoá độc lập theo contract này.

## 9. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                                                        |
|---------------|------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | 13 endpoint; auth JWT; mã lỗi; 5 endpoint lõi + ví dụ JSON; giao diện nội bộ score()/evaluate_gate().                                                                                                                                                     |
| 0.2           | 04/06/2026 | Team Gamma    | Bỏ \[V0-STUB\]; submit async + GET /status (mới); GET /nodes/{id}/content (mới); Gate Exam thật (MCQ ≥80%); ví dụ Profile theo P1–P5 (bỏ M1/M2) + scoring_method/model_version/confidence; score() đọc part_answers + LLM judge. Đồng bộ ADR-009/010/011. |
