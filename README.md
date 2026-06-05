# VCoder P0 Stakeholder Story Demo

VCoder là prototype demo frontend-only cho câu chuyện sản phẩm **AI-Ready Developer**. Demo này cho stakeholder thấy toàn bộ luồng chính: học viên làm bài test đầu vào 5 phần, hệ thống mô phỏng chấm điểm AI, tạo AI-Ready Profile, mở learning path theo năng lực, học lesson, làm lab/checkpoint, hoàn thành capstone, thi Gate Exam, xem leaderboard, mentor dashboard và admin/content authoring.

Đây là prototype kể chuyện sản phẩm, không phải production app.

## Công nghệ

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- React Router
- Local seed data trong `src/data/`
- Local state và `localStorage`

## Phạm vi prototype

Có trong demo:

- Landing page
- Entry Test P1-P5
- Simulated AI Scoring
- AI-Ready Profile
- Learning Path test-gated
- Lesson detail
- Lab / Checkpoint
- Capstone
- Gate Exam
- Leaderboard
- Mentor Dashboard và learner drill-down
- Admin Dashboard, Content Authoring, Item Bank, Rubric/Ground-truth, Gate Exam Config
- Demo tour overlay

Không có trong demo:

- Backend
- Database
- Authentication
- Real LLM scoring
- API keys
- External integrations
- Telemetry
- CI/CD
- Production persistence

## Cài đặt

Yêu cầu:

- Node.js
- npm

Cài dependencies:

```bash
npm install
```

## Chạy local

Chạy dev server:

```bash
npm run dev
```

Vite sẽ in ra URL local, thường là:

```text
http://127.0.0.1:5173/
```

Nếu port `5173` đang bận, Vite sẽ tự chọn port khác, ví dụ:

```text
http://127.0.0.1:5174/
```

Mở URL đó trong trình duyệt để xem demo.

## Kiểm tra build

Chạy test:

```bash
npm test
```

Chạy TypeScript build và production build:

```bash
npm run build
```

## Cách demo nhanh

1. Mở Landing Page và giới thiệu VCoder đo năng lực điều khiển AI trong công việc phần mềm thật.
2. Bấm Start Test để xem Entry Test 5 phần: P1 MCQ, P2 Code Audit, P3 Recovery, P4 Prompt/Plan, P5 Mini-viva.
3. Submit test để xem màn Simulated AI Scoring.
4. Xem AI-Ready Profile: radar chart, readiness, confidence, evidence, red flags, gaps, quick wins.
5. Mở Learning Path để xem node available/locked và lý do khóa.
6. Mở Lesson Detail và Lab/Checkpoint; dùng strong/weak sample answer để xem pass/fail.
7. Mở Capstone, dùng strong sample answer để unlock Gate Exam.
8. Làm Gate Exam, dùng passing sample answers để xem Level unlocked.
9. Chuyển qua Leaderboard để xem ranking opt-in.
10. Chuyển role Mentor để xem cohort dashboard và learner drill-down.
11. Chuyển role Admin để xem content authoring, item bank validation, rubric, ground-truth và gate config.

## Dữ liệu mô phỏng

Toàn bộ dữ liệu demo nằm trong `src/data/`, bao gồm:

- Axes và levels canonical
- Learners và cohort seed
- Entry test items
- Learning nodes và learning content
- Labs/checkpoints
- Capstone
- Gate exam items
- Leaderboard và dashboard seed
- Rubric và ground-truth examples
- Admin seed validation

Scoring trong prototype là mô phỏng. Màn hình scoring có nhãn rõ: **Prototype demo - this scoring is simulated**.

## Ghi chú cho bước tiếp theo

Sau khi stakeholder duyệt hướng sản phẩm, các bước build thật nên gồm:

- Backend API theo contract trong `docs/09_API_Contract_VCoder.md`
- Database schema theo `docs/08_Data_Model_VCoder.md`
- Real async scoring pipeline
- LLM-as-judge với structured JSON output
- Ground-truth validation và human review cho bài confidence thấp
- Persistent admin content authoring
- E2E tests cho learner, mentor và admin journeys
