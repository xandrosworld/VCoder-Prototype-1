**VCoder**

Nền tảng AI-Ready Developer

RISK REGISTER

Sổ Đăng ký Rủi ro

*Theo dõi rủi ro liên tục — mỗi rủi ro có chủ, mức độ, biện pháp và trạng thái*

| **Hạng mục**    | **Nội dung**              |
|-----------------|---------------------------|
| Phiên bản       | 0.2 (Draft)               |
| Người phụ trách | Đặng Văn Minh — Lead Team |
| Ngày            | 04/06/2026                |
| Trạng thái      | Đang theo dõi             |

## 1. Mục đích & cách dùng

Tài liệu theo dõi toàn bộ rủi ro của dự án VCoder, rà soát định kỳ trong các buổi review. Risk Register là tài liệu SỐNG. Mỗi rủi ro có owner; cột Trạng thái cập nhật mỗi lần review.

**Cập nhật v0.2:** Thêm R11–R16 phát sinh từ hai thay đổi lớn (chấm hoàn toàn bằng AI + test 30–60′; Gate Exam thật ở V0). R6 (Level Gate Exam) hạ mức vì nay được build thật (ADR-011) thay vì để ngỏ. R9 đóng (ngưỡng 80% đã chốt — ADR-007).

## 2. Thang đánh giá rủi ro

| **Mức**    | **Likelihood**        | **Impact**                                           |
|------------|-----------------------|------------------------------------------------------|
| Cao        | Nhiều khả năng xảy ra | Ảnh hưởng nghiêm trọng tới scope/timeline/chất lượng |
| Trung bình | Có thể xảy ra         | Ảnh hưởng vừa, xử lý được                            |
| Thấp       | Khó xảy ra            | Ảnh hưởng nhỏ                                        |

## 3. Sổ rủi ro

Mỗi dòng một rủi ro. R1–R5 từ Draft Solution; R6–R10 từ bộ tài liệu sản phẩm; R11–R16 từ đợt cập nhật chấm-AI / test ngắn (04/06).

| **ID** | **Rủi ro**                                                         | **Mức**         | **Biện pháp kiểm soát**                                                                                 | **Owner**      | **Trạng thái** |
|--------|--------------------------------------------------------------------|-----------------|---------------------------------------------------------------------------------------------------------|----------------|----------------|
| R1     | Rubric không nhất quán — 2 người/2 lần chấm khác nhau              | **Cao**         | Behavioral anchors chi tiết + (AI) determinism temp=0 + đo agreement (Rubric §8)                        | Lead           | Mở             |
| R2     | Học viên game bài test                                             | **TB**          | V0 KHÔNG chống gaming (chỉ chấm artifact); để dành viva video + telemetry ở V1                          | TV1            | Chấp nhận ở V0 |
| R3     | Rubric đông cứng — lĩnh vực đổi nhanh                              | **TB**          | Living document, review 6 tháng/lần (Rubric §9)                                                         | Lead           | Mở             |
| R4     | MVP quá tham — không phần nào xong                                 | **Cao**         | Mỗi phần demo 2′; Lead giữ scope; F4/F5 là Should; test rút gọn giảm tải F1                             | Lead           | Đang xử lý     |
| R5     | 5 trục không nhất quán giữa cấu phần                               | **Cao**         | Source of Truth v1.1 + enum canonical (Data Model §6); cross-cut consistency                            | Lead           | Đang xử lý     |
| R6     | Level Gate Exam chưa đặc tả                                        | **TB ↓ từ Cao** | Đã build THẬT ở V0 mức MCQ đơn giản (ADR-011); item bank trong DB                                       | TV3            | Đang xử lý     |
| R7     | F4/F5 cuối đường găng, dễ trễ                                      | **TB**          | Chốt sớm schema Profile JSON; TV4 build song song với dữ liệu giả đúng cấu trúc                         | TV4            | Mở             |
| R8     | Telemetry vướng quyền riêng tư                                     | **TB**          | V0 bỏ telemetry hoàn toàn; consent văn bản khi bật ở V1                                                 | Lead           | Hoãn V1        |
| R9     | Ngưỡng pass Capstone chưa chốt                                     | **Đóng**        | Đã chốt 80% mọi bài (ADR-007)                                                                           | Lead           | Đóng 04/06     |
| R10    | Phụ thuộc ngoài: lịch Cohort 2 & nhà tuyển dụng                    | **TB**          | Bám Ban tổ chức; kế hoạch B dùng rubric nội bộ tạm                                                      | Lead           | Mở             |
| R11    | AI chấm không tất định → cùng bài ra điểm khác nhau                | **Cao**         | temperature=0; lưu model+prompt version; re-score stability ≤1 mức (Rubric §8.2); self-consistency ở V1 | Lead           | Mở             |
| R12    | AI chấm chưa validate nhưng demo trông thuyết phục → rủi ro uy tín | **Cao**         | V0 demo trên ground-truth set đã biết đáp án; nói rõ “đang validate, agreement X%” (Rubric §8.2)        | Lead           | Mở             |
| R13    | Cost/latency LLM phá AC “Profile \<5s” & NFR-01                    | **TB**          | Chuyển scoring sang async + màn “đang chấm”; AC đổi ≤60s (Func Spec AC-F1.1)                            | TV2            | Đang xử lý     |
| R14    | Test 30–60′ đo nông, 5 trục thiếu evidence                         | **TB**          | Đề bán cấu trúc phủ đủ 5 trục; ghi rõ Axis 4 đo nông; củng cố bằng Capstone/Gate Exam                   | Lead           | Đang xử lý     |
| R15    | Giao secret-leak detection cho LLM → bỏ lọt                        | **TB**          | Scan tất định (regex/trufflehog) là chính, LLM bổ trợ (Func Spec 3.5)                                   | TV1            | Mở             |
| R16    | Đảo ADR-002 + nhiều \[V0-STUB\] mà không ghi → team lệch scope     | **Cao**         | Đã viết ADR-009 (supersede 002), ADR-010, ADR-011; cập nhật TDD/API/Data Model đồng bộ                  | **Đang xử lý** | Đang xử lý     |

**Ưu tiên rà soát hàng tuần (mức Cao):** R1, R4, R5, R11, R12, R16. Nhóm chấm-AI (R11, R12, R13, R15) là cụm rủi ro mới quan trọng nhất — gắn trực tiếp với uy tín demo. Chuẩn bị ground-truth set là biện pháp gốc xử lý cả R11, R12 và R14.

## 4. Rủi ro đã đóng

| **ID** | **Rủi ro**                     | **Ngày đóng** | **Bài học rút ra**                                                                                        |
|--------|--------------------------------|---------------|-----------------------------------------------------------------------------------------------------------|
| R9     | Ngưỡng pass Capstone chưa chốt | 04/06/2026    | Chốt giá trị mặc định sớm (80%) + để dạng config → gỡ tranh luận lặp; mentor tinh chỉnh sau bằng dữ liệu. |

## 5. Nhịp rà soát

- Rà soát toàn bộ sổ mỗi cuối phiên bản và trong demo review.

- Mức Cao (R1, R4, R5, R11, R12, R16): rà soát hàng tuần.

- Rủi ro mới: thêm dòng ngay, không chờ kỳ review.

## 6. Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                       |
|---------------|------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0.1           | 01/06/2026 | Team Gamma    | R1–R10.                                                                                                                                                                                                  |
| 0.2           | 04/06/2026 | Team Gamma    | Thêm R11–R16 (chấm-AI determinism/uy tín/cost, test nông, secret-leak, đảo ADR). Hạ R6 (Gate Exam đã build thật). Đóng R9 (ngưỡng 80%). R2/R8 chuyển “chấp nhận/hoãn” do V0 bỏ chống gaming & telemetry. |
