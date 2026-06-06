import generatedVietnamese from "./vi.generated.json";

export type Language = "en" | "vi";

const overrides: Record<string, string> = {
  "Admin": "Quản trị",
  "Admin Content Authoring": "Biên soạn nội dung",
  "Admin Dashboard": "Bảng điều khiển quản trị",
  "Admin Gate Exam Config": "Cấu hình bài kiểm tra lên cấp",
  "Admin Item Bank": "Ngân hàng câu hỏi",
  "Admin Rubric & Ground-truth": "Bộ tiêu chí và dữ liệu chuẩn",
  "Admin overview": "Tổng quan quản trị",
  "AI-Curious": "Đang làm quen với AI",
  "AI-Ready": "Sẵn sàng với AI",
  "AI-ready count": "Số học viên sẵn sàng với AI",
  "AI-Ready Engineer": "Kỹ sư sẵn sàng với AI",
  "AI-Ready Profile": "Hồ sơ năng lực AI",
  "AI Output Evaluation & Critical Review": "Rà soát đầu ra AI và đánh giá phản biện",
  "All readiness": "Tất cả mức độ sẵn sàng",
  "Agent Guardrails & Tool Boundaries": "Cơ chế kiểm soát tác nhân và ranh giới công cụ",
  "Agent guardrails, tool boundaries, evaluation pipelines, observability, and human-in-the-loop design.": "Cơ chế kiểm soát tác nhân, ranh giới công cụ, quy trình đánh giá, khả năng quan sát và thiết kế có con người phê duyệt.",
  "Agentic Engineer": "Kỹ sư hệ thống tác nhân",
  "Agentic systems need explicit permissions before external tools can read, write, spend, or disclose data.": "Hệ thống tác nhân cần quyền rõ ràng trước khi công cụ bên ngoài được đọc, ghi, tiêu tốn chi phí hoặc tiết lộ dữ liệu.",
  "Anti-pattern": "Cách làm cần tránh",
  "Architecture": "Kiến trúc",
  "Assessment progress": "Tiến độ bài đánh giá",
  "Assessment Scoring": "Chấm bài đánh giá",
  "At-risk learners": "Học viên cần hỗ trợ",
  "Audit Lab: Login PR Review": "Bài thực hành rà soát PR đăng nhập",
  "Audit Lab: Secrets and Input Validation": "Bài thực hành rà soát bí mật và xác thực đầu vào",
  "Available": "Có thể học",
  "Average": "Trung bình",
  "Average level": "Cấp độ trung bình",
  "Average level by axis": "Cấp độ trung bình theo trục",
  "Axis": "Trục",
  "Axis levels": "Cấp độ theo trục",
  "Axis weights": "Trọng số các trục",
  "Back to path": "Quay lại lộ trình",
  "Begin P1": "Bắt đầu P1",
  "Canonical Flow": "Luồng tổng thể",
  "Capstone": "Bài tập tổng hợp",
  "Capstone Detail": "Chi tiết bài tập tổng hợp",
  "Capstone Items": "Câu hỏi bài tập tổng hợp",
  "Capstone passed": "Đã đạt bài tập tổng hợp",
  "Checklist": "Danh sách kiểm tra",
  "Code Audit": "Rà soát mã nguồn",
  "Cohort": "Nhóm học viên",
  "Cohort size": "Quy mô nhóm",
  "Complete": "Hoàn thành",
  "Completed": "Đã hoàn thành",
  "Completion rate": "Tỷ lệ hoàn thành",
  "Config": "Cấu hình",
  "Content Authoring": "Biên soạn nội dung",
  "Content nodes": "Nút nội dung",
  "Continue to": "Tiếp tục đến",
  "Core nodes completed": "Đã hoàn thành các nút cốt lõi",
  "Current": "Hiện tại",
  "Dashboard": "Bảng điều khiển",
  "Demo mode": "Chế độ trình diễn",
  "Developing": "Đang phát triển",
  "Difficulty": "Độ khó",
  "Difficulty distribution": "Phân bố độ khó",
  "Engineering Foundations": "Nền tảng kỹ thuật",
  "Entry Test": "Bài kiểm tra đầu vào",
  "Entry Test Items": "Câu hỏi kiểm tra đầu vào",
  "Entry Test Overview": "Tổng quan bài kiểm tra đầu vào",
  "Entry Test scored": "Đã chấm bài kiểm tra đầu vào",
  "Entry test": "Bài kiểm tra đầu vào",
  "Error": "Lỗi",
  "Errors": "Lỗi",
  "Evidence": "Minh chứng",
  "Evidence generated": "Minh chứng được tạo",
  "Expected artifact": "Sản phẩm cần nộp",
  "Foundation needed": "Cần củng cố nền tảng",
  "Foundations": "Nền tảng",
  "Gap analysis": "Phân tích khoảng trống",
  "Gate Exam": "Bài kiểm tra lên cấp",
  "Gate Exam Config": "Cấu hình bài kiểm tra lên cấp",
  "Gate Exam Items": "Câu hỏi kiểm tra lên cấp",
  "Gate Exam L1": "Bài kiểm tra lên cấp L1",
  "Gate Exam locked": "Bài kiểm tra lên cấp đang khóa",
  "Gate Exam unlocked": "Đã mở bài kiểm tra lên cấp",
  "Gate exams": "Bài kiểm tra lên cấp",
  "Gate status": "Trạng thái mở khóa",
  "Graduation marker: L2": "Mốc hoàn thành: L2",
  "Guided demo": "Hướng dẫn trình diễn",
  "Guided demo ·": "Hướng dẫn trình diễn ·",
  "Ground-truth coverage": "Độ phủ dữ liệu chuẩn",
  "Item Bank": "Ngân hàng câu hỏi",
  "Item bank items": "Số câu hỏi trong ngân hàng",
  "Lab / Checkpoint Detail": "Chi tiết bài thực hành",
  "Lab / Checkpoint Items": "Câu hỏi thực hành",
  "Landing": "Trang mở đầu",
  "Language": "Ngôn ngữ",
  "L1 Vibe Coder": "L1 Lập trình viên theo cảm tính",
  "L4 Agentic Engineer": "L4 Kỹ sư hệ thống tác nhân",
  "Leaderboard": "Bảng xếp hạng",
  "Learner": "Học viên",
  "Learner answer": "Bài làm của học viên",
  "Learner drill-down": "Chi tiết học viên",
  "Learner story": "Hành trình học viên",
  "Learners": "Học viên",
  "Learning Content": "Nội dung học tập",
  "Learning Path": "Lộ trình học tập",
  "Lesson": "Bài học",
  "Lesson Detail": "Chi tiết bài học",
  "Level Gate Exam": "Bài kiểm tra lên cấp",
  "Level capstone": "Bài tập tổng hợp của cấp độ",
  "Level capstone passed": "Đã đạt bài tập tổng hợp",
  "Locked": "Đang khóa",
  "Local demo progress": "Tiến độ demo cục bộ",
  "MCQ Test": "Bài kiểm tra trắc nghiệm",
  "Mentor Dashboard": "Bảng điều khiển cố vấn",
  "Mentor view": "Giao diện cố vấn",
  "Mini-viva": "Phỏng vấn ngắn",
  "Mock API": "API mô phỏng",
  "Mock API adapter": "Bộ kết nối API mô phỏng",
  "Open": "Mở",
  "Open capstone": "Mở bài tập tổng hợp",
  "Open lesson": "Mở bài học",
  "Open recommended path": "Mở lộ trình đề xuất",
  "Operations": "Vận hành",
  "Ops controls": "Công cụ vận hành",
  "Opt-in": "Đồng ý tham gia",
  "Output Review": "Đánh giá đầu ra",
  "Overview": "Tổng quan",
  "P1 MCQ": "P1 Trắc nghiệm",
  "P2 Code Audit": "P2 Rà soát mã",
  "P3 Recovery": "P3 Khôi phục",
  "P4 Prompt / Plan": "P4 Prompt / Kế hoạch",
  "P5 Mini-viva": "P5 Phỏng vấn ngắn",
  "Part": "Phần",
  "Part type": "Loại phần",
  "Path": "Lộ trình",
  "Path progress": "Tiến độ lộ trình",
  "Pending": "Đang chờ",
  "Problem": "Bài toán",
  "Problem type": "Loại bài toán",
  "Problem validation": "Kiểm tra tính hợp lệ của bài toán",
  "Product story": "Câu chuyện sản phẩm",
  "Profile": "Hồ sơ",
  "Progress timeline": "Tiến trình học tập",
  "Prompt / Plan": "Câu lệnh AI / Kế hoạch",
  "Prompt/Plan Lab: Agent Tool Guardrails": "Bài thực hành câu lệnh/kế hoạch: Cơ chế kiểm soát công cụ tác nhân",
  "Question": "Câu hỏi",
  "Quick wins": "Việc có thể cải thiện ngay",
  "Rank": "Xếp hạng",
  "Readiness": "Mức độ sẵn sàng",
  "Recent submissions": "Bài nộp gần đây",
  "Recommended interventions": "Can thiệp đề xuất",
  "Recommended mentor action": "Hành động đề xuất cho cố vấn",
  "Recovery": "Khôi phục",
  "Recovery / Debug": "Khôi phục / Gỡ lỗi",
  "Red flags": "Cảnh báo rủi ro",
  "Reset": "Đặt lại",
  "Review learning path": "Xem lại lộ trình học tập",
  "Rubric & Ground-truth": "Bộ tiêu chí và dữ liệu chuẩn",
  "Rubric config preview": "Xem trước cấu hình bộ tiêu chí",
  "Rubric preview": "Bộ tiêu chí chấm",
  "Sample anchors": "Mốc năng lực mẫu",
  "Sample gold labels": "Nhãn chuẩn mẫu",
  "Sample question pool": "Ngân hàng câu hỏi mẫu",
  "Save local demo item": "Lưu câu hỏi demo",
  "Scored parts": "Các phần đã chấm",
  "Scoring": "Đang chấm",
  "Seed Validation": "Kiểm tra dữ liệu mẫu",
  "Simulated scoring": "Chấm điểm mô phỏng",
  "Source:": "Nguồn:",
  "Start guided demo": "Bắt đầu hướng dẫn",
  "Start Lab / Checkpoint": "Bắt đầu bài thực hành",
  "Start Test": "Bắt đầu kiểm tra",
  "Stuck nodes": "Các nút học đang bị vướng",
  "Submission area": "Khu vực nộp bài",
  "Submit": "Nộp bài",
  "Submit capstone": "Nộp bài tập tổng hợp",
  "Submit Entry Test": "Nộp bài kiểm tra đầu vào",
  "Target evidence:": "Minh chứng mục tiêu:",
  "Target level": "Cấp độ mục tiêu",
  "Task instructions": "Yêu cầu bài làm",
  "Test": "Kiểm tra",
  "Test-gated path": "Lộ trình có kiểm tra mở khóa",
  "Title": "Tiêu đề",
  "Tool Boundaries for Agents": "Ranh giới công cụ cho tác nhân",
  "Valid": "Hợp lệ",
  "Validation": "Kiểm tra tính hợp lệ",
  "Validation warnings": "Cảnh báo kiểm tra",
  "Vibe Coder": "Lập trình viên theo cảm tính",
  "Visible": "Hiển thị",
  "Warning": "Cảnh báo",
  "Warnings": "Cảnh báo",
  "What this means": "Ý nghĩa của kết quả",
  "Why this matters": "Vì sao nội dung này quan trọng",
  "Worked example": "Ví dụ mẫu",
  "admin": "quản trị viên",
  "audit": "rà soát",
  "capstone": "bài tập tổng hợp",
  "complete": "hoàn thành",
  "developing": "đang phát triển",
  "gate": "kiểm tra lên cấp",
  "learner": "học viên",
  "learners": "học viên",
  "lessons": "bài học",
  "location": "vị trí",
  "mentor": "cố vấn",
  "no": "không",
  "plan": "kế hoạch",
  "prompt": "câu lệnh AI",
  "proposed fix": "cách sửa đề xuất",
  "rationale": "lý do",
  "recovery": "khôi phục",
  "recovery note": "ghi chú khôi phục",
  "recovery steps": "các bước khôi phục",
  "rollback or fix forward": "quay lui hoặc sửa tiếp",
  "severity": "mức độ nghiêm trọng",
  "test": "kiểm tra",
  "test plan": "kế hoạch kiểm thử",
  "triage": "phân tích ban đầu",
  "type": "loại",
  "viva": "phỏng vấn ngắn",
  "why": "lý do",
  "yes": "có",
  "Switch to English": "Chuyển sang tiếng Anh",
  "Switch to Vietnamese": "Chuyển sang tiếng Việt",
  "English": "Tiếng Anh",
  "Vietnamese": "Tiếng Việt",
  "VCoder Story Demo": "VCoder - Bản demo sản phẩm",
  "asm-guided-tour": "Bài đánh giá trình diễn",
  "lab-agent-guardrails": "Bài thực hành cơ chế kiểm soát tác nhân",
  "lab-audit-review": "Bài thực hành rà soát đăng nhập",
  "lab-prompt-plan": "Bài thực hành câu lệnh AI và kế hoạch",
  "lab-recovery-stacktrace": "Bài thực hành khôi phục từ stack trace",
  "lab-secrets-auth": "Bài thực hành bí mật và xác thực",
  "lab-tests-before-ai": "Bài thực hành viết kiểm thử trước AI",
  "· gt": "· dữ liệu chuẩn",
  "gt": "dữ liệu chuẩn",
  "Prompt / Kế hoạch": "Câu lệnh AI / Kế hoạch",
  "P2 Audit Lab": "Bài thực hành rà soát P2",
  "Judge rubric ref: rubric://axis-": "Tham chiếu bộ tiêu chí: rubric://axis-",
  "Validation rules: MCQ/gate/capstone-MCQ require answer_key; artifact items require ground_truth and judge_rubric_ref; axis and difficulty are bounded; payload needs schema_version.": "Quy tắc kiểm tra hợp lệ: câu hỏi trắc nghiệm, bài kiểm tra lên cấp và bài tổng hợp dạng trắc nghiệm cần answer_key; bài nộp dạng sản phẩm cần ground_truth và judge_rubric_ref; trục năng lực và độ khó phải nằm trong giới hạn; payload cần schema_version.",
  "Preparing guided demo...": "Đang chuẩn bị hướng dẫn...",
  "Demo audit item: generated export endpoint": "Câu hỏi rà soát demo: endpoint xuất dữ liệu do AI tạo",
  "All MCQ answers are complete.": "Đã trả lời đầy đủ câu hỏi trắc nghiệm.",
  "Three structured findings are complete.": "Đã hoàn thành ba phát hiện có cấu trúc.",
  "Recovery response is complete.": "Đã hoàn thành phương án khôi phục.",
  "Complete every recovery field with a short explanation.": "Hãy hoàn thành mọi trường khôi phục kèm giải thích ngắn.",
  "Prompt and plan are complete.": "Đã hoàn thành prompt và kế hoạch.",
  "Complete every prompt/plan field.": "Hãy hoàn thành mọi trường prompt/kế hoạch.",
  "All viva answers are complete.": "Đã hoàn thành toàn bộ câu trả lời phỏng vấn.",
  "Capstone must be passed before the Level Gate Exam unlocks.": "Phải đạt bài tập tổng hợp trước khi mở bài kiểm tra lên cấp.",
  "Add a capstone submission before requesting a score.": "Hãy nhập bài làm tổng hợp trước khi yêu cầu chấm điểm.",
  "Add a lab submission before requesting a score.": "Hãy nhập bài thực hành trước khi yêu cầu chấm điểm.",
  "Answer all questions before submitting.": "Hãy trả lời tất cả câu hỏi trước khi nộp.",
  "Unknown assessment part": "Không tìm thấy phần kiểm tra này",
  "Return to overview": "Quay lại trang tổng quan",
  "No Profile is available yet": "Chưa có hồ sơ năng lực",
  "Assessment is still being scored": "Bài đánh giá vẫn đang được chấm",
  "Open entry test": "Mở bài kiểm tra đầu vào",
  "Return to scoring": "Quay lại màn hình chấm bài",
  "Could not start the assessment.": "Không thể bắt đầu bài đánh giá.",
  "Could not submit the assessment.": "Không thể nộp bài đánh giá.",
  "Could not refresh scoring status.": "Không thể cập nhật trạng thái chấm bài.",
  "Could not refresh scoring status": "Không thể cập nhật trạng thái chấm bài",
  "Scoring is taking longer than expected": "Quá trình chấm bài đang lâu hơn dự kiến",
  "Retry status": "Thử cập nhật lại",
  "Back to test": "Quay lại bài kiểm tra",
  "Back": "Quay lại",
  "Close": "Đóng",
  "Last": "Hoàn tất",
  "Next": "Tiếp",
  "Skip": "Bỏ qua",
  "Skip tour": "Bỏ qua hướng dẫn"
};

const vietnamese = {
  ...(generatedVietnamese as Record<string, string>),
  ...overrides
};

const englishByVietnamese = new Map<string, string>();
for (const [english, translation] of Object.entries(vietnamese)) {
  if (!englishByVietnamese.has(translation)) englishByVietnamese.set(translation, english);
}

const statusTerms: Record<string, string> = {
  draft: "bản nháp",
  submitted: "đã nộp",
  scoring: "đang chấm",
  scored: "đã chấm",
  not_started: "chưa bắt đầu",
  "not started": "chưa bắt đầu",
  partial: "chấm chưa đầy đủ",
  intake_test: "bài kiểm tra đầu vào",
  gate_exam: "bài kiểm tra lên cấp",
  deterministic: "chấm tất định",
  llm_judge: "AI chấm theo bộ tiêu chí",
  mcq: "trắc nghiệm",
  pass: "đạt",
  fail: "chưa đạt",
  progress: "tiến độ",
  prompt: "câu lệnh AI",
  prompt_plan: "câu lệnh AI / kế hoạch"
};

for (const [english, translation] of Object.entries(statusTerms)) {
  if (!englishByVietnamese.has(translation)) englishByVietnamese.set(translation, english);
}

function normalizeText(source: string) {
  return source.replace(/\s+/g, " ").trim();
}

const normalizedVietnamese = new Map<string, string>();
for (const [english, translation] of Object.entries(vietnamese)) {
  normalizedVietnamese.set(normalizeText(english), translation);
}

const vietnameseTermPolish: Array<[RegExp, string]> = [
  [/\bBản demo\b/g, "Bản trình diễn"],
  [/\bdemo\b/g, "trình diễn"],
  [/\bDemo\b/g, "Trình diễn"],
  [/\bcapstone\b/g, "bài tổng hợp"],
  [/\bCapstone\b/g, "Bài tổng hợp"],
  [/\bMCQ\b/g, "trắc nghiệm"],
  [/\bmini-viva\b/gi, "phỏng vấn ngắn"],
  [/\bPrompt \/ Kế hoạch\b/g, "Câu lệnh AI / Kế hoạch"],
  [/\bprompt \/ kế hoạch\b/g, "câu lệnh AI / kế hoạch"],
  [/\bprompt\b/g, "câu lệnh AI"],
  [/\bPrompt\b/g, "Câu lệnh AI"],
  [/Phòng thí nghiệm/g, "Bài thực hành"],
  [/phòng thí nghiệm/g, "bài thực hành"],
  [/Lan can/g, "Cơ chế kiểm soát"],
  [/lan can/g, "cơ chế kiểm soát"],
  [/Đại lý/g, "Tác nhân"],
  [/đại lý/g, "tác nhân"],
  [/Phiếu tự đánh giá/g, "Bộ tiêu chí"],
  [/phiếu tự đánh giá/g, "bộ tiêu chí"],
  [/sự thật cơ bản/g, "dữ liệu chuẩn"],
  [/ngân hàng mục/g, "ngân hàng câu hỏi"],
  [/Bài kiểm tra cổng/g, "Bài kiểm tra lên cấp"],
  [/bài kiểm tra cổng/g, "bài kiểm tra lên cấp"],
  [/Cổng thi/g, "Bài kiểm tra lên cấp"],
  [/cổng thi/g, "bài kiểm tra lên cấp"],
  [/cổng dựa trên trắc nghiệm/gi, "bài kiểm tra lên cấp dạng trắc nghiệm"],
  [/Cổng dựa trên trắc nghiệm/g, "Bài kiểm tra lên cấp dạng trắc nghiệm"],
  [/điểm kiểm tra trắc nghiệm/gi, "bài kiểm tra trắc nghiệm"],
  [/trắc nghiệm\/gate\/bài tổng hợp-trắc nghiệm/g, "trắc nghiệm, bài kiểm tra lên cấp, bài tổng hợp dạng trắc nghiệm"],
  [/vật phẩm/g, "bài nộp"],
  [/tải trọng/g, "dữ liệu gửi kèm"],
  [/giai đoạn giống như sản xuất/g, "môi trường giả lập sản xuất"],
  [/đột biến dữ liệu/g, "thay đổi dữ liệu"],
  [/CI màu xanh lá cây/g, "CI xanh"],
  [/tiêm chích/g, "chèn lệnh"],
  [/Đặc vụ/g, "Tác nhân"],
  [/đặc vụ/g, "tác nhân"],
  [/nhắc nhở/g, "lời nhắc"],
  [/dấu nhắc/g, "lời nhắc"],
  [/frontend/g, "giao diện"],
  [/Bộ mã hóa Vibe/g, "Lập trình viên theo cảm tính"],
  [/Judge_rubric_ref/g, "judge_rubric_ref"],
  [/câu trả lời_key/g, "answer_key"],
  [/lược đồ_version/g, "schema_version"]
];

function polishVietnamese(text: string) {
  return vietnameseTermPolish.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text);
}

function preserveOuterWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translatePattern(text: string): string | undefined {
  let match: RegExpMatchArray | null;

  if ((match = text.match(/^Question (\d+)$/))) return `Câu hỏi ${match[1]}`;
  if ((match = text.match(/^Difficulty (\d+)$/))) return `Độ khó ${match[1]}`;
  if ((match = text.match(/^Axis (\d+)$/))) return `Trục ${match[1]}`;
  if ((match = text.match(/^Axis (\d+): (.+)$/))) return `Trục ${match[1]}: ${translateText(match[2], "vi")}`;
  if ((match = text.match(/^(\d+)\/(\d+) complete$/))) return `Hoàn thành ${match[1]}/${match[2]}`;
  if ((match = text.match(/^(\d+)\/(\d+) parts complete$/))) return `Hoàn thành ${match[1]}/${match[2]} phần`;
  if ((match = text.match(/^(\d+) questions$/))) return `${match[1]} câu hỏi`;
  if ((match = text.match(/^(\d+) lessons$/))) return `${match[1]} bài học`;
  if ((match = text.match(/^(\d+) learners$/))) return `${match[1]} học viên`;
  if ((match = text.match(/^(\d+) examples$/))) return `${match[1]} ví dụ`;
  if ((match = text.match(/^(\d+) min$/))) return `${match[1]} phút`;
  if ((match = text.match(/^(\d+) min ago$/))) return `${match[1]} phút trước`;
  if ((match = text.match(/^(\d+) hr ago$/))) return `${match[1]} giờ trước`;
  if ((match = text.match(/^(\d+)s elapsed$/))) return `Đã trôi qua ${match[1]} giây`;
  if ((match = text.match(/^(\d+) stuck days$/))) return `Bị vướng ${match[1]} ngày`;
  if ((match = text.match(/^Confidence (\d+)%$/))) return `Độ tin cậy ${match[1]}%`;
  if ((match = text.match(/^Rubric (.+)$/))) return `Bộ tiêu chí ${match[1]}`;
  if ((match = text.match(/^Step (\d+) of (\d+)$/i))) return `Bước ${match[1]}/${match[2]}`;
  if ((match = text.match(/^Next \((\d+) of (\d+)\)$/))) return `Tiếp (${match[1]}/${match[2]})`;
  if ((match = text.match(/^Back \((\d+) of (\d+)\)$/))) return `Quay lại (${match[1]}/${match[2]})`;
  if ((match = text.match(/^Close \((\d+) of (\d+)\)$/))) return `Đóng (${match[1]}/${match[2]})`;
  if ((match = text.match(/^Status: (.+)$/))) return `Trạng thái: ${statusTerms[match[1]] ?? translateText(match[1], "vi")}`;
  if ((match = text.match(/^Source: (.+)$/))) return `Nguồn: ${statusTerms[match[1]] ?? translateText(match[1], "vi")}`;
  if ((match = text.match(/^Assessment (.+)$/))) return `Bài đánh giá ${statusTerms[match[1]] ?? translateText(match[1], "vi")}`;
  if ((match = text.match(/^Entry test - part (\d+) of (\d+)$/))) return `Bài kiểm tra đầu vào - phần ${match[1]}/${match[2]}`;
  if ((match = text.match(/^Back to (.+)$/))) return `Quay lại ${translateText(match[1], "vi")}`;
  if ((match = text.match(/^Continue to (.+)$/))) return `Tiếp tục đến ${translateText(match[1], "vi")}`;
  if ((match = text.match(/^Enter (.+)$/))) return `Nhập ${translateText(match[1], "vi")}`;
  if ((match = text.match(/^Complete (\d+) required learning nodes? first\.$/))) return `Hãy hoàn thành ${match[1]} nút học bắt buộc trước.`;
  if ((match = text.match(/^Answer (\d+) remaining question\(s\)\.$/))) return `Hãy trả lời ${match[1]} câu hỏi còn lại.`;
  if ((match = text.match(/^Complete (\d+) more finding\(s\)\.$/))) return `Hãy hoàn thành thêm ${match[1]} phát hiện.`;

  return undefined;
}

export function translateText(source: string, language: Language): string {
  if (!source.trim()) return source;

  const trimmed = source.trim();
  if (language === "en") {
    return preserveOuterWhitespace(source, englishByVietnamese.get(trimmed) ?? trimmed);
  }

  const translated =
    overrides[trimmed] ??
    translatePattern(trimmed) ??
    statusTerms[trimmed] ??
    vietnamese[trimmed] ??
    normalizedVietnamese.get(normalizeText(trimmed)) ??
    trimmed;

  return preserveOuterWhitespace(source, translated === trimmed ? translated : polishVietnamese(translated));
}

export function hasVietnameseTranslation(source: string) {
  const trimmed = source.trim();
  return Boolean(
    overrides[trimmed] ||
    translatePattern(trimmed) ||
    statusTerms[trimmed] ||
    vietnamese[trimmed] ||
    normalizedVietnamese.has(normalizeText(trimmed))
  );
}
