**VCoder**

Nền tảng AI-Ready Developer

TEST & QA PLAN

Kế hoạch Kiểm thử & Đảm bảo Chất lượng

*Làm sao biết sản phẩm hoạt động đúng — chiến lược, ca kiểm thử, tiêu chí*

| **Hạng mục**    | **Nội dung**                                             |
|-----------------|----------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                              |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                          |
| Ngày            | 04/06/2026                                               |
| Trạng thái      | Đang soạn — chờ review                                   |
| Đồng bộ với     | PRD v0.2 · Functional Spec v0.2 · TDD v0.2 · Rubric v0.2 |

## 1. Giới thiệu

LƯU Ý phân biệt: tài liệu này nói về kiểm thử SẢN PHẨM (phần mềm chạy đúng không), KHÁC với “bài test năng lực” của học viên (ở Rubric Spec). Người đọc: QA, dev. Với team Vibe Coding, test plan đặc biệt quan trọng vì AI agent không tự đảm bảo code khớp spec — con người verify qua test.

**Cập nhật v0.2:** Thêm cụm kiểm thử chấm-AI (determinism, AI↔human agreement, “chưa chấm được”, async/status). Gate Exam kiểm thử như tính năng THẬT (không còn stub). Bỏ AC “Profile \<5s” (chấm async ≤60s). Mọi acceptance criteria mới của Functional Spec v0.2 đều có ca kiểm thử.

Mọi acceptance criteria (Given-When-Then) trong Functional Spec đều phải có ca kiểm thử (mục 4) — cơ chế chống AI build lệch spec. VCoder có hai thứ cần kiểm thử đặc biệt: (1) độ tin cậy chấm điểm (nay là AI↔human agreement), (2) tính đúng của cơ chế test-gated. Đặc tả ở mục 6.

## 2. Phạm vi & Mục tiêu kiểm thử

**Trong phạm vi V0:**

- 5 luồng demo end-to-end: F1 (5 phần) → chấm AI → F2 Profile → F3 Learning Path → F4 Leaderboard → F5 Dashboard.

- Sợi chỉ đỏ test → Profile → Learning Path chạy thông trên dữ liệu mẫu thật + ground-truth set.

- Mỗi acceptance criteria F1–F5 (phần áp dụng V0) pass, gồm AC chấm-AI mới (AC-F1.1..1.6).

- **Gate Exam thật:** thi được, chấm tất định, gating đúng (≥3 node + Gate Exam hoạt động).

**Ngoài phạm vi V0 (để V1+):**

- Kiểm thử tải thật (1.000 user — NFR-03); telemetry thật; viva video; self-consistency multi-run.

- Chống học viên dùng AI gian lận khi làm bài (V0 chỉ chấm artifact).

**Mục tiêu chất lượng (cổng release):** 100% acceptance criteria trong phạm vi pass; không còn bug critical/major mở trước demo; AI↔human agreement trên ground-truth set đạt mục tiêu (mục 6.1).

## 3. Chiến lược & Các mức kiểm thử

| **Mức**       | **Kiểm thử gì**                                                                            | **Tự động / Thủ công**              | **Ai làm**        |
|---------------|--------------------------------------------------------------------------------------------|-------------------------------------|-------------------|
| Unit          | Scoring Engine (map score→level, score_mcq), gating (evaluate_gate), validate_judge_output | Tự động (pytest)                    | Dev sở hữu module |
| Integration   | API contract v0.2: schema, mã lỗi, RBAC, submit async + status, gate-exam/attempt          | Tự động (pytest + httpx)            | Dev backend       |
| End-to-end    | 5 luồng demo qua UI nối API thật + màn “đang chấm”                                         | Bán tự động (Playwright) + thủ công | QA / Lead         |
| Chấm-AI       | MỚI: determinism (chấm lại), AI↔human agreement trên ground-truth, “chưa chấm được”        | Script + quy trình                  | Lead + dev        |
| Thủ công (V0) | Kịch bản demo 2′/phần; trạng thái rỗng; edge case                                          | Thủ công                            | Cả team           |

Tỷ trọng V0 nghiêng E2E/thủ công (demo là mục tiêu) + cụm chấm-AI; từ V1 tăng mạnh unit + integration tự động.

## 4. Ma trận kiểm thử theo yêu cầu

Bảng nối mỗi yêu cầu với ca kiểm thử — đảm bảo không yêu cầu nào lọt lưới. Phần khoá chống AI build lệch spec.

| **FR / Tính năng**       | **Acceptance criteria (tóm tắt)**                                                                              | **Test case** | **Loại**             |
|--------------------------|----------------------------------------------------------------------------------------------------------------|---------------|----------------------|
| FR-01 / F1 Test          | 5 phần → Profile 5 trục (async ≤60s); MCQ tất định; determinism; ground-truth; red flag secret; không bịa điểm | TC-01..06     | E2E + Unit + Chấm-AI |
| FR-02 / F2 Profile       | Radar đúng kết quả F1; mốc L2 highlight; gap; percentile ẩn khi chưa opt-in; cập nhật sau Gate Exam            | TC-07..09     | E2E + Integration    |
| FR-03 / F3 Learning Path | Node mở song song; Gate khoá tới khi đủ Capstone; nội dung từ DB; ≥3 node                                      | TC-10..12     | E2E + Unit           |
| FR-04 / F4 Leaderboard   | Xếp theo level TB; filter trục; ẩn người chưa opt-in                                                           | TC-13, TC-14  | Integration          |
| FR-05 / F5 Dashboard     | Phân bố level; at-risk đúng tổ hợp tín hiệu                                                                    | TC-15, TC-16  | Integration          |
| FR-06 / Gate Exam (THẬT) | Khoá khi thiếu Capstone (422); pass ≥80% → lên level + cập nhật Profile; fail → cooldown; rút đề khác lần      | TC-17..19     | Unit + Integration   |
| NFR-01 Hiệu năng         | Profile (đọc) \<2s; chấm async ≤60s                                                                            | TC-20         | Performance          |
| NFR-06 Riêng tư          | Percentile/leaderboard chỉ khi opt-in; trang dữ liệu của tôi                                                   | TC-09, TC-14  | Integration          |

## 5. Chi tiết ca kiểm thử (tiêu biểu)

Mỗi ca: ID, mục tiêu, tiền điều kiện, các bước, dữ liệu, kết quả mong đợi — viết để người/AI thực thi lại y hệt.

TC-01 — F1 sinh Profile đủ 5 trục (chấm AI, async)

- Mục tiêu: hoàn thành 5 phần → Profile 5 trục, chấm async hoàn tất ≤60s (AC-F1.1).

- Bước: 1) Làm P1–P5. 2) Nộp → nhận 202. 3) Poll GET /status tới scored. 4) Mở Profile.

- Kết quả: Profile có đủ 5 trục L0–L4; thời gian từ submit→scored ≤60s với 95% bài.

TC-02 — MCQ chấm tất định (AC-F1.2)

- Mục tiêu: P1 khớp tuyệt đối answer_key trong DB.

- Bước: nộp P1 với bộ đáp án biết trước → so điểm hệ thống với đáp án tay.

- Kết quả: điểm MCQ = số câu đúng / tổng, khớp 100%.

TC-03 — Determinism khi chấm lại (AC-F1.3)

- Mục tiêu: cùng bài artifact + cùng rubric/model/judge version → chấm lại lệch ≤1 mức tiêu chí.

- Bước: chấm một bài P2 hai lần (temp=0) → so kết quả tiêu chí.

- Kết quả: lệch ≤1 mức; nếu vượt → hệ thống gắn cờ “cần review”.

TC-04 — “Chưa chấm được” khi LLM lỗi (AC-F1.6)

- Mục tiêu: LLM trả JSON sai/timeout 2 lần → phần đó đánh dấu “chưa chấm được”, KHÔNG bịa điểm.

- Bước: giả lập LLM trả JSON sai schema 2 lần → quan sát kết quả phần đó.

- Kết quả: trục liên quan hiển thị “chưa đủ dữ liệu”; không có level/điểm giả.

TC-05 — Red flag lộ secret hiển thị riêng (AC-F1.5)

- Mục tiêu: lộ secret thật ở P2/P4 → red flag riêng, không bị che bởi điểm trục.

- Dữ liệu: bài làm chứa secret giả dạng token.

- Kết quả: secret_leak hiện ở khu vực cảnh báo riêng; secret scanner tất định bắt được (không chỉ dựa LLM).

TC-08 — Profile cập nhật sau khi pass Gate Exam (AC-F2.3)

- Mục tiêu: pass Gate Exam → Profile phản ánh level mới (updated_source=gate_exam).

- Bước: thi Gate Exam đạt ≥80% → mở lại Profile.

- Kết quả: radar phản ánh level mới + đánh dấu thay đổi.

TC-09 — Percentile ẩn khi chưa opt-in (NFR-06)

- Mục tiêu: phần so sánh cohort ẩn hoàn toàn khi opt_in_percentile=false.

- Kết quả: không hiển thị “top ?%”; không hiện khung trống.

TC-12 — Nội dung bài học lấy từ DB (ADR-010)

- Mục tiêu: GET /nodes/{id}/content trả nội dung micro-lesson từ DB, không hardcode FE.

- Kết quả: nội dung khớp bản ghi LearningContent đã seed; đổi DB → đổi nội dung không cần deploy.

TC-17 — Gate Exam khoá khi thiếu Capstone (AC-F3.1)

- Mục tiêu: còn node chưa pass Capstone → Gate Exam khoá, trả 422 nêu node thiếu.

TC-18 — Gate Exam pass → lên level (AC-F3.2)

- Mục tiêu: đủ Capstone + thi đạt ≥80% → lên level kế, Profile cập nhật.

TC-19 — Gate Exam rút đề khác giữa các lần (AC-F3.4)

- Mục tiêu: hai lần thi của cùng học viên dùng bộ câu khác nhau, cùng phân bố độ khó.

- Kết quả: question_ids hai attempt khác nhau; phân bố difficulty tương đương.

## 6. Kiểm thử đặc thù của VCoder

### 6.1 Kiểm chứng độ tin cậy chấm điểm (AI↔human agreement)

Thay cho IRR người-người ở v0.1: vì V0 chấm bằng AI, ta validate AI judge so với gold labels do người gán (Rubric §8).

| **Metric**               | **Đo gì**                                   | **Mục tiêu**                |
|--------------------------|---------------------------------------------|-----------------------------|
| Exact-level agreement    | % AI chấm trùng level với gold label        | ≥ 80% trên ground-truth set |
| Adjacent agreement       | % AI lệch ≤ 1 level                         | ≥ 95%                       |
| Quadratic weighted kappa | Đồng thuận AI↔human có trọng số khoảng cách | \> 0.7                      |
| Re-score stability       | Chấm lại cùng bài/cùng version → lệch       | ≤ 1 mức tiêu chí            |

- Quy trình: chấm AI trên ground-truth set (3–5 bài/phần đã có gold label) → tính các metric trên.

- Nếu chưa đạt mục tiêu ở một trục/tiêu chí: refine judge prompt + anchors ở chỗ AI lệch nhiều nhất → đo lại.

- **Cho demo (giảm R12):** demo AI chấm trên ground-truth set đã biết đáp án; nêu rõ “agreement hiện tại X%”, không khẳng định AI chấm đúng tuyệt đối.

### 6.2 Kiểm chứng logic test-gated (điểm biên)

| **Kịch bản**              | **Đầu vào**                                      | **Kết quả mong đợi**                                    |
|---------------------------|--------------------------------------------------|---------------------------------------------------------|
| Điểm biên Capstone        | Capstone ở 79% / 80% / 81% (ngưỡng 80%, ADR-007) | 79% → chưa pass; 80% & 81% → pass.                      |
| Gate Exam đủ điều kiện    | Tất cả Capstone trong level đã pass              | Gate Exam mở khoá (gate_unlocked=true).                 |
| Gate Exam thiếu điều kiện | Còn ≥1 node chưa pass Capstone                   | Gate Exam khoá; báo node thiếu (422).                   |
| Gate Exam điểm biên       | Thi Gate Exam đạt 79% / 80% / 81%                | 79% → fail; 80% & 81% → pass + lên level.               |
| Cooldown thi lại          | Fail Gate Exam rồi thi lại ngay                  | Bị chặn trong cooldown (409); hết cooldown mới cho thi. |

- Xác minh KHÔNG có đường vòng mở khoá (gọi thẳng API attempt khi chưa đủ Capstone → 422).

- Xác minh node cùng level KHÔNG khoá lẫn nhau (mở song song).

## 7. Dữ liệu & Môi trường kiểm thử

| **Khía cạnh**  | **Nội dung**                                                                                                                             |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Môi trường     | dev (DB local) + staging (giống production thu nhỏ) cho E2E. Demo trên staging.                                                          |
| Dữ liệu test   | V0: bộ dữ liệu mẫu seed (≥10 học viên) + GROUND-TRUTH SET (3–5 bài/phần có gold label) + item bank. V1+: dữ liệu thật phải ẩn danh.      |
| Công cụ        | pytest (unit/integration), Playwright (E2E), httpx (API), script Python đo agreement (exact/adjacent/kappa).                             |
| LLM trong test | MỚI: chấm-AI test chạy temp=0, pin model_version + judge_prompt_version để tái lập; mock LLM cho unit test (giả lập JSON lỗi cho TC-04). |
| Quyền riêng tư | Không dùng dữ liệu học viên thật chưa ẩn danh trong test; tuân NFR-06.                                                                   |

**Tài sản quan trọng V0:** bộ dữ liệu mẫu dùng chung + ground-truth set — đảm bảo 5 màn của 4 thành viên demo khớp nhau và validate được AI chấm. Giao một người sở hữu (gắn schema file 08).

## 8. Tiêu chí vào/ra & Định nghĩa hoàn thành

| **Cổng** | **Tiêu chí**                                                                                                                                                              |
|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Entry    | Cấu phần build xong mức demo; dữ liệu mẫu + ground-truth seed; staging sẵn sàng; acceptance criteria rõ.                                                                  |
| Exit     | 100% acceptance criteria trong phạm vi pass; không còn bug critical/major; sợi chỉ đỏ chạy thông; chấm-AI đạt agreement mục tiêu trên ground-truth; mỗi phần demo 2 phút. |

**“Done” cho cấu phần V0:** demo được 2 phút, dùng dữ liệu mẫu thật, neo đúng 5 trục, acceptance criteria liên quan pass.

## 9. Quản lý lỗi (Defect Management)

| **Severity** | **Định nghĩa**                                                         | **Cách xử lý**                   |
|--------------|------------------------------------------------------------------------|----------------------------------|
| Critical     | Chặn luồng demo / sai số liệu năng lực / lộ dữ liệu / AI chấm bịa điểm | Sửa ngay, chặn release           |
| Major        | Một tính năng sai đáng kể nhưng có đường vòng                          | Sửa trước demo nếu trong phạm vi |
| Minor        | Lỗi hiển thị/biên không ảnh hưởng luồng chính                          | Ghi nhận, xử lý theo ưu tiên     |
| Trivial      | Cosmetic, văn bản, canh lề                                             | Gom xử lý khi rảnh               |

- Mỗi bug ghi: mô tả, bước tái hiện, thực tế vs mong đợi, severity, cấu phần, owner.

- Liên kết Risk Register: bug rubric/nhất quán 5 trục → soi R1, R5; bug chấm-AI → soi R11, R12.

## 10. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                                       |
|---------------|------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | Test pyramid; ma trận FR→TC; ca mẫu; IRR người-người (κ\>0.7); logic test-gated điểm biên; tiêu chí vào/ra; severity.                                                                                                                    |
| 0.2           | 04/06/2026 | Team Gamma    | Thêm cụm kiểm thử chấm-AI (determinism, AI↔human agreement, “chưa chấm được”, async/status); Gate Exam kiểm thử như tính năng thật + điểm biên 79/80/81%; ground-truth set vào dữ liệu test; bỏ AC “\<5s”. Đồng bộ Functional Spec v0.2. |
