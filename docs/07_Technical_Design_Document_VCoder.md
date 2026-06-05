**VCoder**

Nền tảng AI-Ready Developer

TECHNICAL DESIGN DOCUMENT (TDD / SDD)

Tài liệu Thiết kế Kỹ thuật

*Hệ thống được xây dựng như thế nào — kiến trúc, công nghệ, và lý do chọn*

| **Hạng mục**    | **Nội dung**                                                                           |
|-----------------|----------------------------------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                                            |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                                                        |
| Ngày            | 04/06/2026                                                                             |
| Trạng thái      | Đang soạn — chờ review kỹ thuật                                                        |
| Đồng bộ với     | Source of Truth v1.1 · PRD v0.2 · Functional Spec v0.2 · Rubric v0.2 · ADR-009/010/011 |

## 1. Giới thiệu

TDD trả lời câu hỏi LÀM NHƯ THẾ NÀO — đối lập với PRD (cái gì) và Functional Spec (hành vi). Người đọc chính: dev, tech lead, kiến trúc sư. Mục tiêu: một dev mới đọc xong hiểu hệ thống vận hành thế nào và tại sao thiết kế như vậy.

**Cập nhật v0.2 (ADR-009/010/011):** (1) V0 chấm THẬT bằng AI (LLM judge) — không còn \[V0-STUB\] scoring/seed. (2) Chấm là tác vụ ASYNC; NFR-01 “Profile \<2s” không áp cho việc chấm (chấm ≤60s, xem 5.1 & 6). (3) Thêm thành phần LLM Judge + Secret Scanner. (4) Nội dung bài học + đề lưu DB (ADR-010). (5) Gate Exam thật (ADR-011). ADR-002 (seed/manual) đã bị supersede bởi ADR-009.

### 1.1 Mục đích & phạm vi

Mô tả thiết kế kỹ thuật của VCoder theo mô hình test-gated learning: kiến trúc tổng thể, thành phần, lựa chọn công nghệ, các quyết định chính. Phạm vi phủ V0 (demo) và V1 (pilot Cohort 2), phác thảo V2–V3 ở chỗ ảnh hưởng quyết định kiến trúc hôm nay.

**Phân định V0 build thật vs V0 stub (cập nhật v0.2):** V0 có backend thật: API + PostgreSQL + 5 màn FE nối API + CHẤM THẬT BẰNG AI (LLM judge cho P2–P5, answer_key cho P1) + Gate Exam thật (MCQ). STUB còn lại ở V0: telemetry ingest, viva video platform, problem bank lớn, percentile từ cohort thật, self-consistency multi-run. Scoring KHÔNG còn là stub.

### 1.2 Liên kết tài liệu

| **Tài liệu nguồn**                  | **Vai trò trong thiết kế này**                                                                |
|-------------------------------------|-----------------------------------------------------------------------------------------------|
| Source of Truth v1.1                | Định nghĩa canonical 5 trục × 5 level, ngưỡng tốt nghiệp, gating — mọi enum/logic neo về đây. |
| PRD v0.2                            | Nguồn FR-01..10 và NFR-01..06. Mục 6 map NFR sang thiết kế.                                   |
| Functional Spec v0.2                | Hành vi F1–F5 (test 30–60′ chấm AI, Gate Exam thật) cần hiện thực hoá.                        |
| Rubric & Scoring Spec v0.2          | Logic chấm: trọng số, score→level, readiness, AI-judge rubric (§7), ground-truth (§8).        |
| Data Model v0.2 & API Contract v0.2 | Schema dữ liệu (item bank, judge metadata) và hợp đồng interface (async, status).             |
| ADR (file 10)                       | ADR-009 (chấm AI), ADR-010 (content-in-DB), ADR-011 (Gate Exam thật); ADR-002 superseded.     |

## 2. Bối cảnh & Ràng buộc kỹ thuật

- Team nhỏ 4 người, mỗi người sở hữu một cấu phần (F1–F5). Kiến trúc tối thiểu hoá phối hợp, cho build song song.

- Phương pháp Vibe Coding (Cursor/Claude Code). Ưu tiên stack phổ biến, type-safe, AI agent build tốt.

- V0 demo trong 1–2 tuần; mỗi cấu phần demo gọn 2 phút.

- Mở rộng: hướng 20.000 học viên/2 năm; NFR-03 chịu ≥1.000 học viên đồng thời.

- **MỚI:** Chấm dùng LLM (chi phí + độ trễ + non-determinism) → chấm async, kiểm soát temp=0 + version-pin + ground-truth (R11–R13).

- Dữ liệu năng lực nhạy cảm; telemetry (V1+) chỉ thu khi consent. V0 không telemetry.

## 3. Kiến trúc tổng thể

VCoder ở V0–V1 là modular monolith: một backend FastAPI chia module theo cấu phần sản phẩm, một frontend SPA, một PostgreSQL, cộng dịch vụ LLM judge bên ngoài. Lý do chọn monolith: ADR-003 (team 4 người, ưu tiên tốc độ & nhất quán).

### 3.1 Sơ đồ kiến trúc (C4 — Container view)

NGƯỜI DÙNG: Học viên · Mentor/Instructor · Admin (Lead) │ HTTPS (JWT) ▼ FRONTEND SPA (React + TS + Vite + Recharts) F1 Test UI (P1–P5) · F2 Profile · F3 Learning Path · F4 Leaderboard · F5 Dashboard │ REST /v1/\* (JSON; submit→202 async; poll /status) ▼ BACKEND API (Python · FastAPI · Pydantic) ┌ assessment │ scoring │ learning_path │ profile ┐ └ leaderboard · dashboard · auth (RBAC) · secret_scanner ┘ Scoring Engine ── reads ── Rubric Config (YAML) │ SQL │ async chấm ▼ ▼ PostgreSQL LLM Judge API (claude-sonnet-4-6) learner, assessment, temperature=0 · structured JSON axis_score, profile, judge_prompt_version jp-v0.2 learning_node, learning_content (ADR-010), problem (item bank: answer_key + ground_truth), node_progress, level_gate_exam, gate_exam_attempt ▲ └ (V1+) Telemetry Ingest — V0 KHÔNG dùng

Sợi chỉ đỏ dữ liệu: assessment (part_answers) → scoring engine (P1 tất định + P2–P5 LLM judge) → axis_score → profile (read-model) → learning_path cập nhật level khi qua Gate Exam → leaderboard & dashboard đọc projection. Profile là read-only projection; nguồn ghi là assessment và learning_path (ADR-004).

### 3.2 Mô tả các thành phần

| **Thành phần**           | **Trách nhiệm**                                                                                        | **Công nghệ**                              |
|--------------------------|--------------------------------------------------------------------------------------------------------|--------------------------------------------|
| Frontend SPA             | Render F1–F5; radar 5 trục; locked/unlocked; màn “đang chấm”; poll status                              | React 18 + TS + Vite + Tailwind + Recharts |
| Backend API              | Auth/RBAC, điều phối, module nghiệp vụ; expose /v1/\*; submit async                                    | Python 3.12 + FastAPI + Pydantic v2        |
| Scoring Engine           | P1 chấm tất định (answer_key); điều phối LLM judge P2–P5; map score→level; readiness; rubric-as-config | Python (httpx gọi LLM; numpy)              |
| LLM Judge                | **MỚI: chấm artifact theo anchors, trả structured JSON; temp=0; version-pin**                          | Anthropic API (claude-sonnet-4-6)          |
| Secret Scanner           | **MỚI: quét secret tất định (regex/trufflehog) trước khi chấm (R15)**                                  | Python (regex/trufflehog)                  |
| Learning Path engine     | Test-gated: mở/khoá node, evaluate_gate, Gate Exam thật (MCQ rút item bank)                            | Python (backend module)                    |
| Data layer               | Lưu thực thể nghiệp vụ + item bank + nội dung bài học; transaction; toàn vẹn                           | PostgreSQL 16 (JSONB)                      |
| Rubric Config            | Trọng số, ngưỡng→level, ngưỡng pass, anchors, judge controls — tách khỏi code                          | YAML versioned (ADR-001)                   |
| Telemetry Ingest \[V1+\] | Nhận event công cụ coding; append-only. V0 không dùng                                                  | FastAPI + telemetry_event                  |

## 4. Lựa chọn công nghệ (Tech Stack)

| **Hạng mục**  | **Công nghệ chọn**                                   | **Lý do tóm tắt**                                                                        |
|---------------|------------------------------------------------------|------------------------------------------------------------------------------------------|
| Frontend      | React 18 + TS + Vite + Tailwind + Recharts           | Phổ biến → AI agent generate tốt; TS an toàn kiểu; Recharts dựng radar nhanh.            |
| Backend       | Python 3.12 + FastAPI + Pydantic v2                  | Hệ sinh thái Python hợp scoring & gọi LLM; Pydantic khớp Data Model; async tốt cho chấm. |
| LLM Judge     | **Anthropic API (claude-sonnet-4-6), temp=0**        | Chấm artifact theo anchors; structured output JSON; version-pin để chấm lại (ADR-009).   |
| Database      | PostgreSQL 16                                        | Quan hệ rõ; JSONB cho evidence/payload/ground_truth/answer_key; đủ tải 1.000 user.       |
| Auth          | JWT, 3 vai trò                                       | Stateless → scale ngang; phân quyền từng endpoint.                                       |
| Hosting       | Container (Docker) trên VM/PaaS đơn giản             | Một artifact deploy hợp monolith; rẻ, nhanh.                                             |
| Rubric store  | YAML versioned trong Git                             | Rubric-as-config: đổi không cần redeploy (ADR-001).                                      |
| Content store | **PostgreSQL (LearningContent + Problem) — ADR-010** | Đổi đề/nội dung không deploy; chấm MCQ tất định; rút đề chống học vẹt.                   |

## 5. Thiết kế chi tiết các module

### 5.1 Module: Scoring Engine (lõi — chấm bằng AI)

Vai trò: biến bài làm 5 phần thành AI-Ready Profile. Bất biến: chấm deterministic-as-possible (temp=0, pin model + judge_prompt + rubric version) để chấm lại & audit.

**Trách nhiệm:** P1 chấm tất định bằng answer_key; P2–P5 gọi LLM judge theo anchors (Rubric §7) trả JSON điểm tiêu chí + evidence + confidence; quét secret tất định trước; tổng hợp điểm trục (0–100) → map level → readiness + red flags → Profile.

**Input:** assessment_id (đã có part_answers) + rubric_version. **Output:** Profile (5 AxisScore + scoring_method/model_version/confidence, readiness_status, red_flags, quick_wins).

**Logic chính (pseudocode):**

def score(assessment_id, rubric_version) -\> Profile: raw = load_assessment_parts(assessment_id) \# part_answers P1-P5 + đề cfg = load_rubric(rubric_version) \# YAML: trọng số + ngưỡng + anchors axis_in = defaultdict(list) \# P1 tất định axis_in\[4\].append(score_mcq(raw\["P1"\].answers, raw\["P1"\].answer_key)) \# P2-P5 LLM judge (temp=0), retry 1, "chưa chấm được" nếu vẫn lỗi for part in \["P2","P3","P4","P5"\]: out = judge_part_with_retry(part, raw\[part\], cfg) \# None nếu lỗi if out is None: mark_unscored(axis_in, part); continue for a in out.axes_scored: axis_in\[a.axis\].append(criteria_to_score(a.criteria)) flags = secret_scan(raw) + collect_llm_flags() axes = {ax: map_score_to_level(mean(v), cfg.thresholds) for ax,v in axis_in.items()} return Profile(axes, readiness(axes, flags), flags, quick_wins(axes))

- Readiness theo TỪNG trục (A1≥L2, A2≥L2, A3≥L1, A4≥L2; A5 không gate) — KHÔNG trung bình cộng.

- A5 đo đầy đủ nhưng không gate. Red flag hiển thị riêng, không bị che.

- **Async:** score() chạy nền sau submit (202). Client poll /status. Vì gọi LLM, không áp ràng buộc \<2s; mục tiêu ≤60s/95% bài (NFR-01 chỉ áp cho ĐỌC Profile, không áp cho việc CHẤM).

- **Determinism & độ tin:** temp=0; pin version; đối chiếu ground-truth → agreement (Rubric §8). JSON sai 2 lần → “chưa chấm được”, KHÔNG bịa (AC-F1.6); confidence\<0.6 → hàng đợi review (V1).

### 5.2 Module: Learning Path engine (Gate Exam thật)

Quản lý locked/unlocked node & level theo gating Hướng B. Node cùng level mở song song; lên level cần (a) pass HẾT Capstone VÀ (b) pass Level Gate Exam (≥80%).

**Gate Exam thật (ADR-011):** rút N câu MCQ từ item bank của level (giữ phân bố độ khó, khác lần trước — chống học vẹt), chấm tất định, ngưỡng 80%. Pass → ghi level mới → phát tín hiệu cập nhật Profile (updated_source=gate_exam).

**Trạng thái:** node locked → available → in_progress → completed; level locked → open → gate_unlocked → passed.

### 5.3 Module: Profile (read-model)

Projection read-only cho F2/F4/F5: không tự tính lại; đọc axis_score (Scoring Engine ghi) + level hiện tại (Learning Path cập nhật). Tách read-model để F2/F4/F5 build song song trên cùng hợp đồng dữ liệu (giảm R5, R7).

### 5.4 Module: Leaderboard & Dashboard (projections)

Leaderboard: xếp theo level TB 5 trục; filter trục; chỉ opt-in; tie-break theo số trục đạt L2. Dashboard: phân bố level + at-risk (axis cốt lõi L0 HOẶC stuck quá lâu) + drill-down. Không sinh dữ liệu năng lực mới.

## 6. Yêu cầu phi chức năng & cách đáp ứng

| **NFR (PRD)**    | **Mục tiêu đo được**                               | **Thiết kế đáp ứng**                                                                                                                            |
|------------------|----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-01 Hiệu năng | Trang Profile tải \< 2s (95%)                      | Profile read-model tính sẵn; index learner_id; cache. LƯU Ý: ràng buộc \<2s áp cho ĐỌC Profile, KHÔNG áp cho việc CHẤM (async, ≤60s — AC-F1.1). |
| NFR-02 Bảo mật   | Mã hoá; không hardcode secret; consent telemetry   | TLS; secret qua env/secret manager; secret scanner tất định; consent kiểm trước khi ghi telemetry \[V1+\].                                      |
| NFR-03 Mở rộng   | ≥1.000 học viên đồng thời                          | API stateless scale ngang; chấm là job async (hàng đợi) tách khỏi request; connection pool Postgres.                                            |
| NFR-04 Khả dụng  | Hoàn thành test không cần hỗ trợ (onboarding ~30′) | Luồng F1 tuyến tính 5 phần; lưu tiến độ 24h; màn “đang chấm” rõ; trạng thái rỗng có CTA.                                                        |
| NFR-05 Truy cập  | Desktop & mobile; WCAG AA                          | Tailwind responsive; màu đạt AA; radar có nhãn text kèm màu.                                                                                    |
| NFR-06 Riêng tư  | Thấy dữ liệu bị thu; percentile opt-in             | Trang “dữ liệu của tôi”; cờ opt_in\_\*; ẩn hoàn toàn khi chưa opt-in.                                                                           |

## 7. Bảo mật & Quyền riêng tư

- Dữ liệu nhạy cảm: AxisScore & level, evidence (code/diff/prompt), thông tin định danh. Red flag (lộ secret) đặc biệt nhạy cảm.

- RBAC: learner xem Profile mình; instructor xem cohort phụ trách; admin toàn quyền. Mỗi endpoint khai báo vai trò (API Contract).

- **MỚI — gửi bài làm cho LLM judge:** quét secret tất định TRƯỚC khi gửi; không gửi nội dung .env/key thật; LLM judge nhận artifact đã lọc. Lưu rõ model_version để audit.

- Mã hoá TLS khi truyền + at-rest cho dữ liệu học viên; không ghi secret vào code/tài liệu.

- V0 KHÔNG telemetry. Consent-gated telemetry chỉ ở V1+.

## 8. Tích hợp & Phụ thuộc bên ngoài

| **Tích hợp**                    | **Phiên bản** | **Rủi ro & giảm thiểu**                                                                             |
|---------------------------------|---------------|-----------------------------------------------------------------------------------------------------|
| LLM Judge API (Anthropic)       | **V0 (MỚI)**  | Non-determinism/cost/latency (R11–R13): temp=0, version-pin, async, ground-truth validate, retry 1. |
| Telemetry từ Cursor/Claude Code | V1+           | Tích hợp khó nhất → định nghĩa interface sớm (API Contract §7); V0 không build.                     |
| Hạ tầng/lịch Ban tổ chức        | V0+           | Phụ thuộc lịch Cohort 2 (R10); kế hoạch B.                                                          |
| Nguồn nội dung học miễn phí     | V1+           | LearningContent route link ngoài (ADR-010); kiểm link định kỳ.                                      |

## 9. Quyết định thiết kế chính

| **Quyết định**           | **Lựa chọn**                                                              | **ADR**            |
|--------------------------|---------------------------------------------------------------------------|--------------------|
| Lưu rubric               | Config YAML tách khỏi code                                                | ADR-001            |
| Chấm điểm V0             | **HOÀN TOÀN bằng AI (LLM judge + answer_key); async (supersede ADR-002)** | ADR-009            |
| Nội dung & đề            | **Lưu trong DB (content-in-DB) + item bank**                              | ADR-010            |
| Gate Exam V0             | **Build THẬT mức đơn giản (MCQ, ≥80%)**                                   | ADR-011            |
| Kiểu kiến trúc           | Modular monolith                                                          | ADR-003            |
| Vai trò Profile          | Read-only projection; F1/F3 là nguồn ghi                                  | ADR-004            |
| Phạm vi V0               | Backend thật + chấm AI thật; telemetry/viva là stub                       | ADR-005 (cập nhật) |
| Ngưỡng pass / percentile | 80% mọi bài; percentile opt-in                                            | ADR-007 / ADR-008  |

## 10. Rủi ro kỹ thuật

| **Rủi ro kỹ thuật**                           | **Ảnh hưởng** | **Giảm thiểu**                                                         |
|-----------------------------------------------|---------------|------------------------------------------------------------------------|
| LLM chấm non-deterministic → chấm lại ra khác | Cao           | temp=0, pin version, re-score stability ≤1; self-consistency V1 (R11). |
| AI chấm chưa validate mà demo thuyết phục     | Cao           | Demo trên ground-truth set; nêu agreement % (R12, Rubric §8).          |
| Cost/latency LLM phá trải nghiệm              | TB            | Chấm async + màn “đang chấm”; cache; batch (R13).                      |
| Schema sai sớm → migrate đắt                  | Cao           | Chốt Data Model v0.2 trước; Alembic; JSONB cho phần dễ đổi.            |
| Giao secret-detection cho LLM → bỏ lọt        | TB            | Scan tất định là chính, LLM bổ trợ (R15).                              |
| Nợ kỹ thuật build nhanh (stub lẫn thật)       | TB            | Đánh dấu rõ stub vs thật; interface stub đúng hình dạng output.        |

## 11. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                                                       |
|---------------|------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | Stack, modular monolith, Scoring Engine rubric-as-config, phân định V0-thật vs V0-stub (scoring seed).                                                                                                                                                   |
| 0.2           | 04/06/2026 | Team Gamma    | Scoring chấm THẬT bằng AI (LLM judge + answer_key), async; thêm thành phần LLM Judge + Secret Scanner; content-in-DB + item bank; Gate Exam thật; làm rõ NFR-01 chỉ áp đọc Profile; cập nhật quyết định/rủi ro kỹ thuật. ADR-002 superseded bởi ADR-009. |
