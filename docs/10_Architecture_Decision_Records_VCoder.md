**VCoder**

Nền tảng AI-Ready Developer

ARCHITECTURE DECISION RECORDS (ADR)

Sổ Quyết định Kiến trúc

*Mỗi quyết định kỹ thuật quan trọng — bối cảnh, lựa chọn, hệ quả*

| **Hạng mục**    | **Nội dung**                                              |
|-----------------|-----------------------------------------------------------|
| Phiên bản       | 0.2 (Draft)                                               |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                           |
| Ngày            | 04/06/2026                                                |
| Trạng thái      | Đang theo dõi                                             |
| Đồng bộ với     | TDD v0.2 · Data Model v0.2 · API Contract v0.1 · PRD v0.2 |

## 1. ADR là gì & cách dùng

ADR ghi lại từng quyết định kiến trúc QUAN TRỌNG dưới dạng bản ghi ngắn, bất biến. Mục đích: 3–6 tháng sau không ai phải hỏi “tại sao hồi đó làm vậy”. Nguyên tắc: mỗi ADR là một quyết định, đánh số tăng dần, KHÔNG sửa ADR cũ — nếu đổi ý thì viết ADR mới thay thế (superseded).

Khi nào viết ADR: khi quyết định khó đảo ngược, ảnh hưởng nhiều thành phần, hoặc gây tranh luận. Khi nào KHÔNG cần: quyết định nhỏ, dễ đổi, hiển nhiên. Trạng thái một ADR: Proposed → Accepted → (Superseded / Deprecated).

## 2. Danh mục quyết định

Bảng tổng hợp mọi ADR để tra cứu nhanh. Cập nhật mỗi khi thêm ADR mới hoặc đổi trạng thái.

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 54%" />
<col style="width: 20%" />
<col style="width: 13%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Tiêu đề quyết định</strong></th>
<th><strong>Trạng thái</strong></th>
<th><strong>Ngày</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>ADR-001</td>
<td>Lưu rubric dạng config tách khỏi code (rubric-as-config)</td>
<td>Accepted</td>
<td>01/06</td>
</tr>
<tr class="even">
<td>ADR-002</td>
<td><p>V0 chấm thủ công + Profile seed sẵn (</p>
<p><strong>SUPERSEDED bởi ADR-009</strong></p>
<p>)</p></td>
<td><strong>Superseded</strong></td>
<td>04/06</td>
</tr>
<tr class="odd">
<td>ADR-003</td>
<td>Kiến trúc modular monolith (không microservices) ở V0–V1</td>
<td>Accepted</td>
<td>01/06</td>
</tr>
<tr class="even">
<td>ADR-004</td>
<td>Profile là read-only projection; F1/F3 là nguồn ghi duy nhất</td>
<td>Accepted</td>
<td>01/06</td>
</tr>
<tr class="odd">
<td>ADR-005</td>
<td>Phạm vi V0: backend tối thiểu thật + 5 màn nối API (cập nhật bởi ADR-009)</td>
<td>Accepted</td>
<td>01/06</td>
</tr>
<tr class="even">
<td>ADR-006</td>
<td>Stack: React+TS (FE) / Python+FastAPI (BE) / PostgreSQL</td>
<td>Accepted</td>
<td>01/06</td>
</tr>
<tr class="odd">
<td>ADR-007</td>
<td>Ngưỡng pass mọi bài test = 80% (chốt)</td>
<td><strong>Accepted</strong></td>
<td>04/06</td>
</tr>
<tr class="even">
<td>ADR-008</td>
<td>Peer percentile mặc định TẮT, chỉ bật khi opt-in</td>
<td><strong>Accepted</strong></td>
<td>04/06</td>
</tr>
<tr class="odd">
<td>ADR-009</td>
<td><strong>V0 chấm HOÀN TOÀN bằng AI + Rubric; bài test rút còn 30–60′</strong></td>
<td><strong>Accepted</strong></td>
<td>04/06</td>
</tr>
<tr class="even">
<td>ADR-010</td>
<td><strong>Nội dung bài học + đề test lưu trong DB (content-in-DB)</strong></td>
<td><strong>Accepted</strong></td>
<td>04/06</td>
</tr>
<tr class="odd">
<td>ADR-011</td>
<td><strong>Level Gate Exam build THẬT ở V0 (mức đơn giản, MCQ-based)</strong></td>
<td><strong>Accepted</strong></td>
<td>04/06</td>
</tr>
</tbody>
</table>

## 3. Các quyết định mới & thay đổi (04/06/2026)

**Bối cảnh đợt cập nhật này:** Lead chốt hai thay đổi sản phẩm lớn so với v0.1 — (1) bài test đầu vào rút từ 4–5h xuống 30–60′ và chấm HOÀN TOÀN bằng AI + Rubric (không còn chấm thủ công/seed); (2) Level Gate Exam được build thật ngay ở V0 ở mức đơn giản. Các ADR dưới đây ghi lại và làm rõ hệ quả của hai thay đổi này.

### ADR-009: V0 chấm hoàn toàn bằng AI + Rubric; bài test rút còn 30–60′

**Trạng thái:** Accepted \| **Ngày:** 04/06/2026 \| **Người quyết:** Đặng Văn Minh \| **Thay thế:** ADR-002 (phần chấm V0)

Bối cảnh (Context)

ADR-002 trước đây quyết định V0 dùng Profile seed sẵn + chấm thủ công, vì lo thuật toán chấm TẤT ĐỊNH (numpy/pandas) chưa đủ dữ liệu calibrate. Tuy nhiên, “chấm bằng AI” (LLM-as-judge) là loại chấm KHÁC bản chất: nó không cần dữ liệu psychometric để calibrate, mà đối chiếu artifact của học viên với behavioral anchors có sẵn trong Rubric §4. Đồng thời Lead quyết rút bài test xuống 30–60′ để hạ rào cản onboarding (khảo sát 154 học viên cho thấy ngại bài dài). Hai điều này khiến lý do từ chối auto-score trong ADR-002 không còn áp dụng cho V0.

Các phương án đã cân nhắc (Options)

| **Phương án**                                        | **Ưu**                                                                                                              | **Nhược**                                                                                                         |
|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Giữ ADR-002 (seed + thủ công)                        | An toàn; đã chốt                                                                                                    | Không demo được năng lực chấm tự động — vốn là điểm thuyết phục nhất; không scale; mâu thuẫn yêu cầu mới của Lead |
| **LLM-as-judge + Rubric, chấm artifact tĩnh (CHỌN)** | Demo được “AI chấm năng lực” thật; scale tốt; tận dụng 25 ô behavioral anchors sẵn có; giữ nguyên interface score() | Không tất định tuyệt đối → cần kiểm soát (temp=0, version); cần ground-truth để validate; chi phí token           |
| Auto-score tất định ngay ở V0                        | Tất định, audit dễ                                                                                                  | Chính lý do ADR-002 từ chối: chưa đủ data calibrate → không tin được                                              |

Quyết định (Decision)

**Chúng tôi sẽ chấm bài test đầu vào V0 HOÀN TOÀN bằng AI (LLM-as-judge) + Rubric.** Pre-MCQ chấm tất định bằng answer_key; các phần artifact (Audit, Recovery, Prompt/Plan, Mini-viva) do LLM judge chấm theo behavioral anchors, trả JSON có cấu trúc (điểm/tiêu chí + evidence + flags). Profile sinh từ output này — KHÔNG còn seed. Interface score(assessment_id, rubric_version) giữ nguyên; chỉ thay nguồn raw score: từ seed → LLM call. Bổ sung model_version + judge_prompt_version vào Profile để chấm lại được.

Hệ quả (Consequences)

- **Tích cực:** V0 demo được năng lực chấm tự động thật (điểm thuyết phục stakeholder lớn nhất); scale không giới hạn người chấm; tái dùng behavioral anchors; nền tảng V1 chỉ cần thêm telemetry.

- **Tiêu cực / nợ kỹ thuật:** LLM không tất định tuyệt đối → phải dùng temperature=0, lưu version, self-consistency cho bài biên (V1); cần xây ground-truth set để validate; chi phí token; AC “Profile \< 5s” phải đổi sang async (xem ADR-009 liên quan TDD §5.1, R13).

- **Anti-gaming:** Trong phạm vi V0 KHÔNG chống học viên dùng AI để LÀM bài (bỏ telemetry/honeypot) — chỉ chấm artifact. Chống gaming để dành V1 (telemetry + viva video).

### ADR-010: Nội dung bài học và đề test lưu trong Database (content-in-DB)

**Trạng thái:** Accepted \| **Ngày:** 04/06/2026 \| **Người quyết:** Đặng Văn Minh

Bối cảnh (Context)

Flow mới yêu cầu mỗi bài học có test nhỏ (MCQ) và mỗi level có Gate Exam — tất cả cần nội dung thật, không hardcode rải rác trong frontend. Cần một nơi lưu nội dung bài học + ngân hàng đề (item bank) để: (a) đổi đề chống học vẹt, (b) chấm tất định bằng answer_key, (c) mentor/Lead thêm đề không cần deploy.

Các phương án đã cân nhắc (Options)

| **Phương án**                                                                          | **Ưu**                                                                                                       | **Nhược**                                                                               |
|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Hardcode đề trong FE                                                                   | Nhanh lúc demo                                                                                               | Không tái dùng; mỗi sửa phải deploy; không có answer_key tách biệt; không chống học vẹt |
| **Lưu trong DB (CHỌN): bảng LearningContent + Problem (item bank) + answer_key JSONB** | Đổi đề không deploy; chấm MCQ tất định; mentor thêm đề; chống học vẹt bằng cách rút đề ngẫu nhiên giữ độ khó | Cần seed nội dung ban đầu; thêm bảng & API quản trị nhẹ                                 |
| File YAML/Markdown trong repo                                                          | Versioned theo Git                                                                                           | Khó query động cho gating; trộn nội dung học vào code repo; không hợp rút đề ngẫu nhiên |

Quyết định (Decision)

**Nội dung bài học (LearningContent) và đề test (Problem / item bank, gồm answer_key) lưu trong PostgreSQL.** MCQ chấm tất định bằng answer_key trong DB; đề artifact lưu kèm ground-truth (rubric tham chiếu) để LLM judge dùng. Mỗi Gate Exam rút N câu từ item bank của level, giữ phân bố độ khó. Rubric (trọng số, ngưỡng→level) VẪN ở YAML (ADR-001) — tách biệt: rubric = cách chấm, content = nội dung chấm.

Hệ quả (Consequences)

- **Tích cực:** Tái dùng nội dung; đổi đề không deploy; chấm MCQ tất định; nền cho problem bank lớn ở V2.

- **Tiêu cực:** Cần seed nội dung ban đầu (việc nội dung, không phải code); thêm 2 bảng (LearningContent, mở rộng Problem) + API admin nhẹ để nhập đề.

### ADR-011: Level Gate Exam build THẬT ở V0 (mức đơn giản, MCQ-based)

**Trạng thái:** Accepted \| **Ngày:** 04/06/2026 \| **Người quyết:** Đặng Văn Minh \| **Liên quan:** đóng một phần R6

Bối cảnh (Context)

v0.1 để Level Gate Exam ở dạng \[V0-STUB\] (chỉ thể hiện vị trí). Lead quyết build THẬT ngay ở V0 nhưng giữ đơn giản, vì gating là sợi chỉ đỏ của mô hình test-gated — demo nửa vời sẽ không thuyết phục. “Đơn giản” = Gate Exam dạng MCQ rút từ item bank của level, chấm tất định, ngưỡng pass 80% (ADR-007), pass thì lên level và cập nhật Profile thật.

Quyết định (Decision)

**Level Gate Exam ở V0 build THẬT ở mức đơn giản:** đề MCQ rút từ item bank của level (ADR-010), chấm tất định, ngưỡng 80%. Pass → Learning Path cập nhật level → Profile/Leaderboard/Dashboard phản ánh thật. Điều kiện mở Gate Exam vẫn là pass hết Capstone trong level (giữ logic gating Hướng B). Đề dạng artifact-judged trong Gate Exam để dành V1.

Hệ quả (Consequences)

- **Tích cực:** Demo được vòng test-gated đầy đủ end-to-end; đóng phần lớn rủi ro R6; Profile cập nhật từ dữ liệu thật chứ không seed.

- **Tiêu cực:** Tăng nhẹ phạm vi V0 (cần item bank Gate Exam + logic chấm); bù lại bằng việc dùng chung hạ tầng MCQ với checkpoint bài học.

## 4. Các ADR đã ghi trước đó (giữ nguyên)

ADR-001, 003, 004, 006 giữ nguyên trạng thái Accepted và nội dung như v0.1. ADR-002 chuyển Superseded (xem dưới). ADR-005 cập nhật phạm vi V0 theo ADR-009/011. ADR-007 và ADR-008 chuyển từ Proposed sang Accepted theo quyết định của Lead ngày 04/06.

### ADR-002 (Superseded): V0 chấm thủ công + Profile seed sẵn

**Trạng thái: SUPERSEDED bởi ADR-009 (04/06/2026).** Lý do thay thế: Lead quyết V0 chấm hoàn toàn bằng AI + Rubric thay cho seed + thủ công. Nội dung gốc của ADR-002 giữ lại trong lịch sử để tham chiếu; mọi tham chiếu “Profile seed” trong TDD/API Contract được cập nhật theo ADR-009.

### ADR-007 (Accepted): Ngưỡng pass mọi bài test = 80%

Chốt: ngưỡng pass cho MỌI bài test (checkpoint, Capstone, Level Gate Exam) = 80%, là tham số trong rubric config, áp dụng đồng nhất. Mentor có thể điều chỉnh theo dữ liệu ở V1 nhưng giá trị mặc định và đang dùng là 80%. Gỡ R9.

### ADR-008 (Accepted): Peer percentile mặc định TẮT, chỉ bật khi opt-in

Chốt: percentile mặc định tắt; chỉ hiển thị khi opt_in_percentile = true; khi chưa opt-in ẩn hoàn toàn phần so sánh. Đồng bộ NFR-06.

## 5. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                           |
|---------------|------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | Khởi tạo. ADR-001..006 (Accepted); ADR-007, ADR-008 (Proposed).                                                                                                                                              |
| 0.2           | 04/06/2026 | Team Gamma    | ADR-009 (chấm hoàn toàn bằng AI + test 30–60′, supersede ADR-002), ADR-010 (content-in-DB), ADR-011 (Gate Exam thật ở V0). Chốt ADR-007 (80%) & ADR-008 (percentile opt-in) sang Accepted. Cập nhật ADR-005. |
