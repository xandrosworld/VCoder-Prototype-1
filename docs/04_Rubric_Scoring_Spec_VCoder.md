**VCoder**

Nền tảng AI-Ready Developer

RUBRIC & SCORING SPECIFICATION

Khung Năng lực & Đặc tả Chấm điểm

*Tài sản lõi — định nghĩa trục, cấp độ, behavioral anchors, công thức điểm & cách AI chấm*

| **Hạng mục**    | **Nội dung**                                                       |
|-----------------|--------------------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                                        |
| Người phụ trách | Đặng Văn Minh — Lead Team                                          |
| Ngày            | 04/06/2026                                                         |
| Trạng thái      | Đang soạn — chờ validate với nhà tuyển dụng                        |
| Đồng bộ với     | Source of Truth v1.1 · ADR-009 (AI scoring) · Functional Spec v0.2 |

## 1. Giới thiệu

Đây là tài liệu giá trị nhất và là “moat” của VCoder: định nghĩa formal các trục, cấp độ, behavioral anchors, và cách quy ra điểm. Là living document, review định kỳ với nhà tuyển dụng, và là source of truth cho mọi bài test, learning node, profile, leaderboard. Hợp nhất và đồng bộ với Source of Truth v1.1.

**Mới ở v0.2:** Bài test đầu vào rút còn 30–60′ và CHẤM HOÀN TOÀN BẰNG AI (LLM-as-judge) + answer_key. Tài liệu này bổ sung §6 (cấu trúc test mới), §7 (AI-judge rubric: cách LLM chấm theo anchor, structured output), §8 (ground-truth & đo agreement AI↔human). Behavioral anchors §4 GIỮ NGUYÊN — chúng chính là rubric feed cho LLM judge.

### 1.1 Nguồn chuẩn tham chiếu

- SFIA 9 (AI & Data Literacy, AIPD, AIAD) — phân cấp năng lực 7 mức.

- SWEBOK v4 (Testing, Maintenance, Construction, Security KA) — xương sống nội dung kỹ thuật.

- DigComp 2.2; Bloom's Taxonomy (cấu trúc câu hỏi & trọng số); HAI-Eval + I-O Psychology (predictive validity, work-sample).

## 2. Các trục năng lực

| **Trục** | **Tên**                                | **Học viên làm được gì**                             | **Chuẩn neo**                  |
|----------|----------------------------------------|------------------------------------------------------|--------------------------------|
| Axis 1   | AI Direction & Context Engineering     | Scoped prompt, plan-first, CLAUDE.md                 | SFIA AI Literacy + AIPD        |
| Axis 2   | AI Output Evaluation & Critical Review | Đọc diff, phát hiện bug/security/hallucination       | SWEBOK Testing + HAI-Eval      |
| Axis 3   | Recovery, Debug & Resilience           | Stack trace, git bisect, rollback, recovery          | SWEBOK Maintenance             |
| Axis 4   | Engineering Foundations                | Test, security cơ bản, git hygiene, secret mgmt      | SWEBOK Construction + Security |
| Axis 5   | AI Product & System Architecture       | MCP stack, multi-agent, eval pipeline, observability | SFIA AIAD + Architecture       |

## 3. Các cấp độ năng lực

Thang L0–L4 áp dụng cho mọi trục. Ngưỡng tốt nghiệp là L2 — AI-Ready Engineer.

| **Level** | **Tên**                               | **Có thể làm được**                                       | **Ship được gì**                   |
|-----------|---------------------------------------|-----------------------------------------------------------|------------------------------------|
| L0        | AI-Curious                            | Hỏi snippet, chạy được nếu không lỗi                      | Demo cá nhân                       |
| L1        | Vibe Coder                            | Prompt multi-turn, debug với AI, app 2–3 tính năng        | Tool cá nhân, prototype            |
| L2        | AI-Ready Engineer (ngưỡng tốt nghiệp) | CLAUDE.md, Plan Mode, review diff, unit test, secret mgmt | Tính năng production có review     |
| L3        | Context Engineer                      | MCP stack, SKILL.md, CI/CD security gate                  | Dự án solo / lead team nhỏ         |
| L4        | Agentic Engineer                      | Multi-agent, eval pipeline, guardrail, HIL                | AI-native product có observability |

## 4. Behavioral Anchors (giữ nguyên — là rubric feed cho LLM judge)

Phần chống chấm cảm tính: với mỗi ô (trục × cấp độ), mô tả hành vi quan sát được cụ thể. 25 ô anchors ở v0.1 GIỮ NGUYÊN và nay đóng vai trò kép: (a) hướng dẫn examiner người ở V1+, (b) rubric văn bản nhúng vào prompt cho LLM judge ở V0 (§7). Dưới đây tóm tắt mức L0–L2 trọng tâm cho test đầu vào; bảng đầy đủ 5 mức xem Source of Truth.

### 4.1 Axis 1 — AI Direction (tóm tắt cho judge)

| **Level** | **Hành vi quan sát được**                                                        | **Bằng chứng cần có**                |
|-----------|----------------------------------------------------------------------------------|--------------------------------------|
| L0        | Câu hỏi đơn giản, không context, accept-all                                      | Prompt 1–2 turn; không scoping       |
| L1        | Iterate khi AI sai; thêm context cơ bản; task còn lớn, thiếu acceptance criteria | Prompt có iteration                  |
| L2        | Scoped prompt; constrained; plan-first; CLAUDE.md                                | Plan trước code; prompt có structure |

### 4.2 Axis 2 — Output Evaluation (tóm tắt cho judge)

| **Level** | **Hành vi quan sát được**                                           | **Bằng chứng cần có**                     |
|-----------|---------------------------------------------------------------------|-------------------------------------------|
| L0        | Tin output AI mặc định; không đọc diff                              | Không phát hiện bug                       |
| L1        | Đọc diff cơ bản; bắt lỗi syntax                                     | Bug report lỗi rõ ràng                    |
| L2        | Bắt security phổ biến (secret, SQLi); nhận lỗi logic; ghi reasoning | Findings ≥ phần lớn bug set; reasoning rõ |

### 4.3 Axis 3 — Recovery (tóm tắt cho judge)

| **Level** | **Hành vi quan sát được**                                         | **Bằng chứng cần có**                              |
|-----------|-------------------------------------------------------------------|----------------------------------------------------|
| L0        | Bí là restart/bỏ cuộc                                             | Không có strategy                                  |
| L1        | Paste error vào AI, thử đề xuất đầu                               | Sửa được lỗi dễ                                    |
| L2        | Đọc stack trace trước; biết rollback/checkpoint; nêu bước an toàn | Recovery note có triage; lý do rollback/fix hợp lý |

**Lưu ý đo Axis 4 ở test rút gọn:** vì bỏ M1 Build code tự do, Axis 4 (Engineering Foundations) đo qua MCQ P1 (kiến thức test/security/git/secret) + cross-check P5. Đây là phép đo NÔNG hơn v0.1 — ghi rõ giới hạn: level Axis 4 từ test đầu vào là “tham chiếu sơ bộ”, được củng cố bằng Capstone/Gate Exam khi học.

## 5. Trọng số & Công thức điểm

| **Trục** | **Trọng số** | **Phần đo chính (test 30–60′)**        | **Ngưỡng tốt nghiệp** |
|----------|--------------|----------------------------------------|-----------------------|
| Axis 1   | 25%          | P4 Prompt/Plan + P5 Viva               | ≥ L2 (bắt buộc)       |
| Axis 2   | 25%          | P2 Audit + P5 Viva                     | ≥ L2 (bắt buộc)       |
| Axis 3   | 20%          | P3 Recovery + P5 Viva                  | ≥ L1                  |
| Axis 4   | 20%          | P1 MCQ + P5 Viva (đo nông, tham chiếu) | ≥ L2 (bắt buộc)       |
| Axis 5   | 10%          | P5 Viva + P1 scenario                  | Đo nhưng KHÔNG gate   |

### 5.1 Công thức tổng hợp

- Điểm mỗi trục = Σ (điểm tiêu chí × trọng số tiêu chí) trong các phần đo trục đó, thang 0–100 nội bộ.

- Level mỗi trục = ánh xạ điểm → L0–L4 theo bảng ngưỡng (trong rubric YAML).

- Điểm tổng (tham khảo) = Σ (điểm_trục × trọng_số_trục); chỉ là phụ, KHÔNG thay breakdown.

- Readiness theo từng trục (A1≥L2, A2≥L2, A3≥L1, A4≥L2; A5 không gate) — KHÔNG trung bình cộng.

### 5.2 Readiness status & loại trực tiếp

| **Status**        | **Điều kiện**                                      |
|-------------------|----------------------------------------------------|
| Foundation needed | Có ít nhất một axis cốt lõi (1, 2, 4) ở L0         |
| Developing        | Chưa đạt AI-Ready nhưng không có axis cốt lõi ở L0 |
| AI-Ready 🎓       | A1≥L2 · A2≥L2 · A3≥L1 · A4≥L2 (A5 không gate)      |
| Advanced          | Bốn axis cốt lõi ≥ L3 và Axis 5 ≥ L2               |

**Loại trực tiếp (highlight riêng):** lộ secret thật (scan tất định + LLM bổ trợ); không giải thích được (viva trống/sai); không nhận lỗi auth/data ở P2; không biết rollback ở P3.

## 6. Cấu trúc bài test đầu vào (30–60′) & ánh xạ trục

Bài test rút gọn theo ADR-009. Mỗi trục đo bởi ít nhất một phần; P5 viva làm cross-check.

| **Phần** | **Tên**        | **Trục đo**          | **Bloom**        | **Cách chấm**             |
|----------|----------------|----------------------|------------------|---------------------------|
| P1       | MCQ phân loại  | Tất cả + A4          | Remember→Apply   | **Tất định (answer_key)** |
| P2       | Audit ngắn     | Axis 2               | Analyse→Evaluate | LLM judge + ground-truth  |
| P3       | Recovery ngắn  | Axis 3               | Analyse→Create   | LLM judge + anchor        |
| P4       | Prompt/Plan    | Axis 1               | Apply→Evaluate   | LLM judge + anchor        |
| P5       | Mini-viva text | A4, A5 + cross-check | Evaluate→Create  | LLM judge + anchor        |

## 7. AI-Judge Rubric — cách LLM chấm artifact

Phần đặc tả cách LLM-as-judge chấm các phần P2–P5. Mục tiêu: chấm nhất quán, có evidence, audit được. Đây là phần kỹ thuật mới của v0.2.

### 7.1 Nguyên tắc

- **Anchor-driven:** prompt cho LLM nhúng nguyên văn behavioral anchors (§4) của trục đang chấm; LLM chọn level khớp nhất + trích evidence từ bài làm.

- **Structured output:** LLM bắt buộc trả JSON theo schema cố định (xem 7.3); parser từ chối output không khớp schema, retry temperature=0.

- **Tiêu chí rời rạc:** không hỏi “bài này mấy điểm” mà hỏi từng tiêu chí có/không + mức; điểm số suy ra từ tiêu chí → giảm chấm cảm tính.

- **Determinism kiểm soát:** temperature=0; lưu model_version + judge_prompt_version; với bài giáp ranh 2 level, V1 dùng self-consistency (chấm 3 lần lấy trung vị).

- **Không tự bịa:** nếu thiếu evidence, LLM phải trả level thấp + cờ “thiếu bằng chứng”, KHÔNG suy diễn có lợi cho học viên.

### 7.2 Quy trình chấm một phần artifact

1.  Nạp bài làm của học viên + đề + ground-truth (nếu có) + anchors của trục.

2.  Gọi LLM judge với prompt chuẩn (temperature=0) → nhận JSON.

3.  Validate JSON theo schema; sai → retry 1 lần; vẫn sai → đánh dấu “chưa chấm được”.

4.  Map điểm tiêu chí → điểm trục (0–100) → level theo ngưỡng rubric YAML.

5.  Đối chiếu ground-truth (nếu có) → ghi agreement; gắn cờ nếu lệch lớn.

6.  Trích evidence (đoạn trong bài làm) để hiển thị trên Profile.

### 7.3 Schema output bắt buộc (rút gọn)

| **Trường JSON** | **Kiểu**                    | **Ý nghĩa**                              |
|-----------------|-----------------------------|------------------------------------------|
| axis            | int 1–5                     | Trục đang chấm                           |
| level           | L0–L4                       | Level LLM kết luận                       |
| criteria        | array{name, met:bool, note} | Từng tiêu chí có đạt + ghi chú           |
| evidence        | array{quote, where}         | Trích dẫn bằng chứng từ bài làm          |
| red_flags       | array{type, note}           | Cờ loại trực tiếp nếu có                 |
| confidence      | 0–1                         | Độ chắc của judge (thấp → gắn cờ review) |

**Bất biến chấm:** (1) LLM chỉ chọn trong L0–L4, không tự chế mức; (2) level phải có ≥1 evidence trích từ bài làm; (3) red_flag ghi riêng, không trừ vào điểm trục; (4) confidence \< ngưỡng → bài vào hàng đợi review người (V1).

## 8. Ground-truth & đo độ tin cậy AI chấm

Vì north-star cũ (IRR giữa hai examiner người) không áp dụng trực tiếp khi AI chấm, v0.2 bổ sung cơ chế validate AI judge.

### 8.1 Ground-truth set

- Mỗi phần artifact (P2/P3/P4/P5) có 3–5 bài mẫu với đáp án/level chuẩn do Lead + mentor gán trước (gold labels).

- P2 Audit có honeypot/bug set chuẩn: danh sách bug đã biết + severity để so findings của học viên.

- Ground-truth lưu trong DB cùng đề (ADR-010), tách khỏi học viên.

### 8.2 Metric agreement AI ↔ human

| **Metric**               | **Đo gì**                                         | **Mục tiêu**                         |
|--------------------------|---------------------------------------------------|--------------------------------------|
| Exact-level agreement    | % bài AI chấm trùng level với gold label          | ≥ 80% trên ground-truth set          |
| Adjacent agreement       | % AI chấm lệch ≤ 1 level                          | ≥ 95%                                |
| Quadratic weighted kappa | Đồng thuận AI↔human có trọng số khoảng cách level | \> 0.7 (tương đương mục tiêu IRR cũ) |
| Re-score stability       | Chấm lại cùng bài, cùng version → lệch            | ≤ 1 mức tiêu chí                     |

**Quan trọng cho demo (giảm R12):** Ở V0 nên demo AI chấm trên chính ground-truth set đã biết đáp án — vừa thật vừa kiểm soát được, tránh AI chấm sai mà trông thuyết phục. Nói rõ với stakeholder: “AI judge đang được validate, agreement hiện tại X%.”

### 8.3 Cơ chế cải thiện

- Refine judge prompt + anchors ở chỗ AI lệch gold label nhiều nhất.

- Ở V1: thêm vòng human-in-the-loop cho bài confidence thấp; dùng để mở rộng ground-truth set.

- Psychometric QA (V2+): content validity (SME review), predictive validity (r \> 0.3) khi có outcome việc làm.

## 9. Quản trị rubric (Living Document)

- Review 6 tháng/lần cùng nhà tuyển dụng; mọi thay đổi định nghĩa ghi vào lịch sử.

- Mọi thay đổi trục/level/ngưỡng đồng bộ ngược về Source of Truth + thông báo team.

- Rubric (trọng số, ngưỡng→level, judge_prompt_version) ở YAML (ADR-001); nội dung đề ở DB (ADR-010) — tách biệt rõ.

## 10. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                            |
|---------------|------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | 5 trục, 5 level, 25 ô anchors, trọng số & công thức, psychometric QA.                                                                                                                                         |
| 0.2           | 04/06/2026 | Team Gamma    | Cấu trúc test 30–60′ (§6); AI-judge rubric: anchor-driven, structured output, determinism (§7); ground-truth set & metric agreement AI↔human (§8). Ghi rõ Axis 4 đo nông ở test rút gọn. Đồng bộ ADR-009/010. |
