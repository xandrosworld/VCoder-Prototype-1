**VCoder**

Nền tảng AI-Ready Developer

**QUY TRÌNH PHÁT TRIỂN VỚI AI & QUẢN LÝ DỰ ÁN**

AI-Assisted Development Workflow & Project Management

*Quy trình chuẩn build hiệu quả với Claude Code + GitHub — cho team 4 người*

| **Hạng mục**    | **Nội dung**                                                                          |
|-----------------|---------------------------------------------------------------------------------------|
| Phiên bản       | 1.0 (Draft)                                                                           |
| Người phụ trách | Đặng Văn Minh — Lead Team Gamma                                                       |
| Ngày            | 04/06/2026                                                                            |
| Trạng thái      | Đang soạn — chờ áp dụng cho Sprint V0                                                 |
| AI tool chính   | Claude Code (agent chạy local, plan mode, subagents)                                  |
| Công cụ quản lý | GitHub + GitHub Projects + GitHub Actions (CI)                                        |
| Đồng bộ với     | Project Plan v0.1 · Source of Truth v1.1 · PRD · Functional Spec · TDD · API Contract |

## Mục lục

## 1. Mục đích & cách dùng tài liệu

Bộ tài liệu sản phẩm VCoder (Charter, PRD, Functional Spec, Rubric, Data Model, API Contract, TDD, ADR, Test Plan…) đã trả lời **CÁI GÌ** và **TẠI SAO**. Tài liệu này trả lời câu hỏi còn lại: **LÀM NHƯ THẾ NÀO để team 4 người build hiệu quả với AI** — cụ thể là quy trình, công cụ, vai trò và nhịp làm việc khi dùng Claude Code làm agent chính.

Người đọc chính: cả 4 thành viên Team Gamma. Lead dùng tài liệu này để vận hành sprint; thành viên dùng để biết chính xác một task đi từ spec đến code-được-merge ra sao. Đây là tài liệu **sống** — cập nhật sau mỗi sprint dựa trên thực tế.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Nguyên tắc gốc</strong></p>
<p>Tài liệu sản phẩm là <strong>spec</strong> (hợp đồng). Claude Code là <strong>người thực thi</strong>. Con người giữ vai trò <strong>đạo diễn + người duyệt</strong> — không phải người gõ từng dòng. VCoder đã có spec rất tốt, nên lợi thế lớn nhất của team là biến spec đó thành đầu vào trực tiếp cho AI.</p></td>
</tr>
</tbody>
</table>

## 2. Nguyên tắc nền tảng — Spec-Driven Development (SDD)

Cách build hiệu quả nhất với AI agent năm 2026 là **Spec-Driven Development**: spec là source of truth, code phục vụ spec chứ không ngược lại. Vòng lặp chuẩn gồm bốn bước, áp cho mỗi tính năng:

| **Bước**      | **Làm gì**                                             | **Đầu ra**                              | **VCoder đã có sẵn?**                                            |
|---------------|--------------------------------------------------------|-----------------------------------------|------------------------------------------------------------------|
| 1\. Specify   | Mô tả cái cần build & vì sao, theo ngôn ngữ người dùng | Spec / user story / acceptance criteria | CÓ — PRD (FR-01..10) + Functional Spec (F1..F5, Given-When-Then) |
| 2\. Plan      | Thêm phần 'how': kiến trúc, thư viện, ràng buộc        | Kế hoạch kỹ thuật                       | CÓ — TDD + Data Model + API Contract + ADR                       |
| 3\. Tasks     | Bẻ plan thành các đơn vị nhỏ, review được              | Danh sách issue/task                    | Một phần — Work Breakdown V0 (cần đưa lên GitHub Issues)         |
| 4\. Implement | Agent code từng task một, đối chiếu spec               | Code + test + PR                        | Chưa — đây là phần sprint này làm                                |

Vì ba bước đầu **đã gần hoàn chỉnh**, team không bắt đầu từ con số 0 — chỉ cần đưa spec vào đúng định dạng để Claude Code đọc (mục 4) rồi chạy vòng Implement (mục 5).

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Mẹo tận dụng spec sẵn có</strong></p>
<p>Mỗi <strong>Acceptance Criteria dạng Given-When-Then</strong> trong Functional Spec chính là một <strong>test case viết sẵn</strong>. Đưa thẳng cho Claude Code để nó viết test trước rồi code cho test xanh (TDD — mục 5.3). Đây là đòn bẩy mạnh nhất mà ít team có.</p>
<p>Tùy chọn nâng cao: cài <strong>GitHub Spec Kit</strong> (mã nguồn mở, hỗ trợ Claude Code) để chuẩn hoá quy trình Spec → Plan → Tasks → Implement bằng slash command. Không bắt buộc cho V0, cân nhắc cho V1.</p></td>
</tr>
</tbody>
</table>

## 3. Bộ công cụ chuẩn (Toolchain)

Bộ công cụ tối thiểu nhưng đủ cho team 4 người, ưu tiên **ít công cụ, gắn chặt với code**, miễn phí ở giai đoạn V0–V1:

| **Lớp**         | **Công cụ chuẩn**                      | **Vai trò**                                                                  | **Chi phí V0**                 |
|-----------------|----------------------------------------|------------------------------------------------------------------------------|--------------------------------|
| AI coding agent | Claude Code                            | Agent chính: explore → plan → implement theo spec; plan mode; subagents; MCP | Theo gói Claude (Pro/Max/Team) |
| Version control | Git + GitHub                           | Source of truth của code; 1 branch/task; PR review                           | Free (private repo)            |
| Quản lý task    | GitHub Projects (v2)                   | Board + Issues + Milestones, gắn thẳng commit/PR                             | Free                           |
| CI/CD           | GitHub Actions                         | Tự động lint + type-check + test + build mỗi PR                              | Free (2.000 phút/tháng)        |
| Review AI       | Claude /review hoặc Copilot/CodeRabbit | Lớp review tự động trước khi người review                                    | Free–thấp                      |
| Giao tiếp       | Slack/Discord + GitHub notifications   | Standup async, thông báo PR/CI, quyết định nhanh                             | Free                           |
| Context cho AI  | CLAUDE.md trong repo + bộ .docx spec   | Spec (cái gì) + context (build thế nào) cho agent                            | —                              |

### 3.1 Vì sao Claude Code + GitHub (không phải tool khác)

- **Claude Code** chạy **local**, bám codebase + spec chặt, context lớn (hợp monorepo), có plan mode và subagents — phù hợp 'làm việc sâu theo spec', đúng nhu cầu VCoder.

- **GitHub Projects** không bắt team đổi context: issue, PR, board, CI nằm cùng một chỗ với code. Team dưới 30 người hầu như không cần tách riêng tool quản lý.

- Tránh phình tool: ở V0 chưa cần Jira/Linear riêng. Nếu sau này cần báo cáo nâng cao có thể cân nhắc Linear (free tier tốt), nhưng GitHub Projects là điểm khởi đầu đúng.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Khi nào thêm Codex/Cursor</strong></p>
<p><strong>Cursor</strong>: hữu ích cho thành viên thích sửa nhanh inline khi làm UI (F1/F2). Bổ trợ, không thay Claude Code.</p>
<p><strong>Codex (cloud, chạy song song bất đồng bộ)</strong>: cân nhắc ở V1+ khi cần giao nhiều task chạy nền cùng lúc hoặc auto-review PR. V0 chưa cần — giữ quy trình đơn giản.</p></td>
</tr>
</tbody>
</table>

## 4. Thiết lập nền tảng cho AI build đúng (Repo + CLAUDE.md)

AI build lệch hay đúng phụ thuộc phần lớn vào **context bạn cấp**. Đây là việc Sprint 0 quan trọng nhất.

### 4.1 Cấu trúc repo (khớp modular monolith — ADR-003)

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>vcoder/</p>
<p>├─ CLAUDE.md # context gốc cho toàn repo (mục 4.2 + Phụ lục A)</p>
<p>├─ docs/ # bộ .docx spec (đã có) — nguồn sự thật</p>
<p>├─ rubric/rubric.yaml # rubric-as-config (ADR-001)</p>
<p>├─ seed/ # dữ liệu mẫu dùng chung (Profile/Path/Leaderboard)</p>
<p>├─ backend/ # FastAPI modular monolith</p>
<p>│ ├─ CLAUDE.md # context riêng cho backend (quy ước Python/Pydantic)</p>
<p>│ └─ app/{assessment,scoring,learning_path,profile,leaderboard,dashboard,auth}/</p>
<p>├─ frontend/ # React + TS + Vite</p>
<p>│ ├─ CLAUDE.md # context riêng cho FE (quy ước component, Recharts)</p>
<p>│ └─ src/features/{f1_test,f2_profile,f3_path,f4_leaderboard,f5_dashboard}/</p>
<p>└─ .github/workflows/ci.yml # lint + type-check + test + build</p></td>
</tr>
</tbody>
</table>

Mỗi thư mục module ánh xạ 1-1 với một cấu phần F1–F5 và một chủ sở hữu (RACI ở Project Plan) — giảm xung đột khi 4 người build song song.

### 4.2 CLAUDE.md — bộ nhớ thường trực của agent

CLAUDE.md là file Claude Code tự đọc mỗi phiên. Đặt ở gốc repo (và bản con trong backend/, frontend/). Nội dung tối thiểu (template đầy đủ ở **Phụ lục A**):

- **Tổng quan sản phẩm** + link tới spec trong docs/ (cái gì đang build, sợi chỉ đỏ test→profile→learning path).

- **5 trục × 5 level canonical** (tên ngắn, enum) — copy từ Source of Truth để agent KHÔNG tự đặt tên biến thể (chống R5).

- **Stack & quy ước**: React+TS/FastAPI/Pydantic/PostgreSQL; cách đặt tên; định dạng JSON snake_case (khớp API Contract).

- **Off-limits zones**: không commit .env/secret; không sửa rubric.yaml hay schema khi chưa được duyệt; không tự ý đổi enum trục/level.

- **Định nghĩa Done** + lệnh chạy test/lint để agent tự verify.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Đây chính là Axis 1 của sản phẩm các bạn</strong></p>
<p>Viết CLAUDE.md tốt = 'context engineering' = đúng Axis 1 trong rubric VCoder. Team đang <strong>thực hành chính thứ mình đo</strong>. Một CLAUDE.md rõ ràng giúp agent build đúng ngay lần đầu, giảm vòng sửa.</p></td>
</tr>
</tbody>
</table>

### 4.3 Tăng tốc với MCP, slash command & subagent

- **GitHub MCP**: cho Claude Code đọc/tạo issue, PR ngay trong phiên — gắn code với quản lý task.

- **Slash command** (.claude/commands/): tạo lệnh tái dùng như /seed (sinh lại dữ liệu mẫu), /test (chạy bộ test), /review-spec (đối chiếu code với Functional Spec).

- **Subagent** (.claude/agents/): dùng cho task chuyên biệt, ví dụ một agent 'test-writer' chuyên viết test từ Given-When-Then. Lưu ý: với team 4 người, **một phiên có kế hoạch rõ thường tốt hơn nhiều agent phối hợp lỏng** — đừng lạm dụng.

## 5. Quy trình lõi cho một task: Explore → Plan → Implement → Verify → Review → Merge

Đây là vòng lặp chuẩn cho **mỗi issue**. Hai bước đầu (Explore + Plan) rẻ nhất về token nhưng quyết định chất lượng nhất — đừng để agent code ngay.

| **Pha**       | **Người làm gì**                                              | **Claude Code làm gì**                                  |
|---------------|---------------------------------------------------------------|---------------------------------------------------------|
| 1\. Explore   | Chọn 1 issue; chỉ cho agent spec liên quan (FR, F, AC)        | Đọc spec + code hiện có ở **plan mode** (chưa sửa file) |
| 2\. Plan      | Yêu cầu agent lập kế hoạch; review & chỉnh trước khi cho code | Đề xuất các bước + file sẽ đụng; nêu giả định           |
| 3\. Implement | Duyệt plan; ưu tiên TDD (5.3)                                 | Viết test từ AC → code cho test xanh; commit nhỏ        |
| 4\. Verify    | Yêu cầu chạy test/lint/type-check                             | Chạy bộ test, sửa tới khi xanh; tự đối chiếu AC         |
| 5\. Review    | Mở PR; AI review trước, rồi người review                      | Tự review (/review); người soát phần phán đoán (mục 7)  |
| 6\. Merge     | CI xanh + ≥1 review → merge vào main                          | Squash-merge; issue tự đóng (Closes \#)                 |

### 5.1 Plan mode — quy tắc 'nghĩ trước, code sau'

Bật plan mode để Claude đọc và đề xuất **không** chỉnh file. Người review kế hoạch (đặc biệt: file nào bị đụng, có vượt scope issue không) rồi mới duyệt. Đây là chốt chặn chống AI build lan man.

### 5.2 Mỗi task phải nhỏ và truy vết được

Một issue = một đơn vị review được trong ~1 buổi. Issue tham chiếu mã FR/F/AC; PR tham chiếu issue. Nhờ vậy chuỗi truy vết **FR → Issue → PR → Test** luôn liền mạch (mở rộng ma trận truy vết sẵn có trong Functional Spec/Test Plan).

### 5.3 TDD với AI — pattern mạnh nhất

Test-Driven Development là mẫu hiệu quả nhất khi làm với agent: mỗi vòng đỏ→xanh cho agent tín hiệu rõ ràng để tự lặp mà không cần người can thiệp.

1.  Dán Acceptance Criteria (Given-When-Then) của tính năng cho Claude.

2.  Yêu cầu agent viết test trước (pytest cho BE, Vitest/Playwright cho FE) — test phải đỏ.

3.  Yêu cầu agent code tối thiểu để test xanh; không viết quá phạm vi test.

4.  Refactor khi xanh; chạy lại toàn bộ suite; commit.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Lưu ý V0 (theo ADR-005)</strong></p>
<p>V0 là <strong>backend tối thiểu thật + 5 màn nối API</strong>; scoring/telemetry/viva là <strong>stub</strong>. TDD ở V0 tập trung vào: API trả đúng schema (API Contract), logic gating (evaluate_gate), và 5 màn render đúng từ dữ liệu seed. Auto-scoring thật để V1.</p></td>
</tr>
</tbody>
</table>

## 6. Làm việc song song cho 4 người (Git workflow)

### 6.1 Chiến lược nhánh (branch)

- **main** được bảo vệ: không push thẳng; chỉ vào qua PR có CI xanh + ≥1 review.

- Mỗi task một nhánh ngắn hạn: ví dụ feat/f2-profile-radar, feat/f3-gating-ui. Sống ngắn, merge sớm để tránh xung đột.

- Mỗi thành viên sở hữu một cấu phần (TV1→F1, TV2→F2, TV3→F3, TV4→F4+F5; Lead giữ cross-cut) — module tách biệt nên ít đụng file nhau.

### 6.2 Git worktrees — khi một người chạy nhiều agent

Khi một thành viên muốn chạy **2–4 phiên Claude Code song song** (vd vừa build vừa sửa bug), dùng git worktree để mỗi agent có thư mục riêng, không giẫm file nhau:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p># tạo worktree + nhánh riêng cho 1 agent</p>
<p>claude --worktree feat/f4-filter # hoặc: git worktree add ../wt-f4 feat/f4-filter</p>
<p># mỗi agent chạy ở 1 worktree, test &amp; sửa độc lập, không dirty checkout của nhau</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Giới hạn thực tế</strong></p>
<p>Khuyến nghị <strong>bắt đầu với 1 agent thực thi + 1 agent/người verify</strong>, chứng minh chạy ổn rồi mới tăng. <strong>2–4 agent song song là vùng dễ quản</strong>; vượt mức đó chi phí điều phối/merge lớn hơn lợi ích. Với team 4 người ở V0, không cần multi-agent phức tạp.</p></td>
</tr>
</tbody>
</table>

### 6.3 Điểm ghép nối quan trọng nhất: hợp đồng Profile JSON

F2/F4/F5 đều đọc cùng một **Profile JSON** (ADR-004). Để TV2/TV4 build song song mà không chờ F1/F3, phải **chốt và seed dữ liệu mẫu ngay ngày đầu** (đúng biện pháp giảm R7 trong Risk Register). Một người sở hữu bộ seed (gắn schema Data Model file 08). Đây là việc chặn đường găng — làm trước tiên.

## 7. Review & chất lượng code AI sinh

Nghiên cứu 2026 cho thấy code do agent sinh có **xu hướng dư thừa và nợ kỹ thuật cao hơn** code người viết, và PR do AI tạo nếu **không có governance** chờ review lâu hơn ~4–5 lần. Vì vậy review là bắt buộc, theo 2 lớp:

| **Lớp**                      | **Ai/cái gì**                                  | **Bắt cái gì**                                                                     |
|------------------------------|------------------------------------------------|------------------------------------------------------------------------------------|
| 1\. AI review (tự động)      | Claude /review hoặc Copilot/CodeRabbit trên PR | Lỗi cơ học: style, bug rõ, thiếu test, lặp code — sửa trước khi người xem          |
| 2\. Human review (phán đoán) | Một thành viên khác hoặc Lead                  | Đúng spec/AC? An toàn (secret, auth, data access)? Đúng tên 5 trục? Có vượt scope? |

### 7.1 Checklist review PR (rút gọn — bản đầy đủ ở Phụ lục B)

- Khớp Acceptance Criteria của Functional Spec; test tương ứng đã có và xanh.

- **Không** hardcode secret; thay đổi ở auth/data access được soi kỹ (đây chính là red flag trong rubric của các bạn).

- Dùng đúng enum/tên trục–level canonical (Source of Truth); JSON snake_case khớp API Contract.

- PR nhỏ, có mô tả: agent được yêu cầu làm gì, theo spec nào, bằng chứng khớp (test/ảnh chụp).

- Không vượt phạm vi issue; không thêm tính năng ngoài phân công (giữ scope — chống R4).

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Ăn chính món mình nấu</strong></p>
<p>Review diff cẩn thận trước khi accept <strong>chính là Axis 2 (Output Evaluation)</strong> trong rubric VCoder. Team nên là người gương mẫu: không accept-all. Mỗi PR là một bài tập Axis 2 thực tế.</p></td>
</tr>
</tbody>
</table>

### 7.2 Chọn task an toàn để giao cho AI

- **Giao sớm, rủi ro thấp**: scaffold UI, sinh dữ liệu seed, viết test cho hàm đã rõ đầu ra, refactor có bản tham chiếu.

- **Soi kỹ, làm sau khi quy trình ổn**: logic scoring/gating, auth, xử lý dữ liệu nhạy cảm — đúng những chỗ rubric coi là red flag.

## 8. Quản lý dự án bằng GitHub Projects

### 8.1 Thiết lập board

Tạo **một** GitHub Project (kiểu board) cho cả team. Cột gợi ý:

**Backlog → Todo (sprint này) → In Progress → In Review → Done**

- Bật automation sẵn có: tự thêm issue mới vào project; tự chuyển sang **Done** khi PR đóng issue được merge.

- Mỗi thành viên chỉ nên có **1–2 issue** ở 'In Progress' cùng lúc — tránh ôm việc.

### 8.2 Tạo issue từ Work Breakdown V0

Chuyển bảng phân rã công việc V0 (Project Plan mục 5) thành issue. Bộ issue khởi đầu:

| **Issue (tiêu đề gắn FR)**                                     | **Chủ sở hữu** | **Nhãn**                          |
|----------------------------------------------------------------|----------------|-----------------------------------|
| \[FR-01/F1\] 7 màn Test UI: Landing→Result                     | TV1            | comp:F1 · prio:Must               |
| \[FR-02/F2\] Radar 5 trục + gap + 3 quick wins + ẩn percentile | TV2            | comp:F2 · prio:Must               |
| \[FR-03/F3\] Learning Path locked/unlocked + vị trí Gate Exam  | TV3            | comp:F3 · prio:Must               |
| \[FR-04/F4\] Leaderboard xếp hạng + filter theo trục           | TV4            | comp:F4 · prio:Should             |
| \[FR-05/F5\] Dashboard cohort overview + at-risk + drill-down  | TV4            | comp:F5 · prio:Should             |
| \[CROSS\] Bộ seed dùng chung + đồng bộ tên 5 trục              | Lead           | comp:core · prio:Must · risk:high |
| \[INFRA\] Repo scaffold + CLAUDE.md + CI                       | Lead           | comp:infra · prio:Must            |

### 8.3 Nhãn, milestone & truy vết

- **Nhãn**: comp:F1..F5/core/infra · prio:Must/Should · type:feat/chore/bug/test · risk:high (gắn R1/R4/R5/R6).

- **Milestone** = mốc Project Plan: M0 Chốt SoT (done) · M1 Draft cho mentor · M2 Mockup xong · M3 Demo stakeholder · M4 Kế hoạch V1.

- **Truy vết**: tiêu đề issue chứa mã FR; PR ghi 'Closes \#\<issue\>'; PR liên kết test (TC). Chuỗi **FR → Issue → PR → TC** nối tiếp ma trận truy vết đã có trong Test Plan.

## 9. Nhịp làm việc & giao tiếp (Cadence)

Giữ đúng nhịp đã định trong Project Plan mục 8, bổ sung chi tiết cho làm việc với AI:

| **Nhịp**            | **Khi nào**              | **Nội dung**                                                      |
|---------------------|--------------------------|-------------------------------------------------------------------|
| Daily async standup | Mỗi sáng, trên kênh chat | 3 dòng/người: hôm qua / hôm nay / blocker. Kèm link PR đang mở    |
| Mid-sprint sync     | Giữa sprint              | Ráp thử **sợi chỉ đỏ** test→profile→learning path để bắt lệch sớm |
| Demo review         | Cuối sprint              | Mỗi cấu phần demo 2 phút; rà soát rủi ro mức Cao (R1/R4/R5/R6)    |
| Quyết định nhanh    | Khi có blocker           | Vấn đề ngoài phân công → Lead quyết trong 24h                     |
| Weekly risk review  | Hằng tuần                | Soi R1, R4, R5, R6 (theo Risk Register)                           |

## 10. Định nghĩa Done & cổng chất lượng

### 10.1 Definition of Done cho một task/PR

- Code khớp Acceptance Criteria của issue; test tương ứng đã viết và **xanh**.

- CI xanh: lint + type-check (tsc/mypy) + test (pytest/vitest) + build.

- Được ít nhất 1 người review; không còn comment chặn; không secret/red flag.

- Dùng đúng tên trục/level canonical; JSON khớp API Contract.

- Demo được trong 2 phút trên dữ liệu mẫu thật; đã merge vào main.

### 10.2 Cổng release V0 (theo Test Plan)

100% acceptance criteria trong phạm vi pass; không còn bug critical/major mở; sợi chỉ đỏ chạy thông; mỗi phần demo được trong 2 phút.

## 11. Áp dụng cụ thể cho VCoder V0 (kế hoạch 1–2 tuần)

Lịch theo **đường găng** đã chốt: Rubric/SoT (xong) → seed + F1/F3 → F2/F4/F5 → ráp & demo.

| **Giai đoạn**       | **Ngày** | **Trọng tâm**                                                                                                                  | **Ai**           |
|---------------------|----------|--------------------------------------------------------------------------------------------------------------------------------|------------------|
| Sprint 0 — Nền tảng | Ngày 1   | Repo scaffold, CLAUDE.md, GitHub Project + issues, CI skeleton, branch protection, **chốt+seed Profile JSON**, gán tên TV1–TV4 | Lead (+ cả team) |
| Nguồn dữ liệu       | Ngày 2–4 | F1 Test UI (7 màn) + F3 Learning Path (gating UI) nối API thật; hoàn thiện bộ seed                                             | TV1, TV3         |
| Lớp hiển thị        | Ngày 4–7 | F2 Profile (radar/gap/quick wins) + F4/F5 (leaderboard/dashboard) build trên Profile JSON seed                                 | TV2, TV4         |
| Mid-sprint sync     | Ngày 5   | Ráp sợi chỉ đỏ test→profile→path; bắt lệch sớm                                                                                 | Cả team          |
| Tích hợp & QA       | Ngày 8–9 | E2E 5 luồng (Playwright + thủ công); đóng bug critical/major; kiểm gating điểm biên                                            | Cả team + Lead   |
| Demo                | Ngày 10  | Tổng duyệt 2 phút/phần; demo stakeholder; thu feedback → backlog V1                                                            | Cả team          |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Việc chặn đường găng — làm NGAY ngày 1</strong></p>
<p><strong>Bộ seed Profile/Path/Leaderboard dùng chung</strong> + <strong>gán tên thật cho TV1–TV4</strong> (RACI còn để trống). Thiếu hai thứ này thì F2/F4/F5 không build song song được.</p></td>
</tr>
</tbody>
</table>

## 12. Checklist khởi động (Sprint 0 — Ngày 1)

1.  Tạo private repo GitHub theo cấu trúc mục 4.1; bật branch protection cho main (yêu cầu PR + 1 review + CI).

2.  Viết CLAUDE.md gốc + backend/ + frontend/ (Phụ lục A).

3.  Đưa rubric.yaml + bộ seed (≥10 học viên, Profile/Path/Leaderboard nhất quán) vào repo; cử 1 người sở hữu seed.

4.  Tạo GitHub Project (board 5 cột) + nhập issue từ Work Breakdown V0 (mục 8.2); gắn nhãn + milestone.

5.  Tạo .github/workflows/ci.yml: lint + type-check + test + build.

6.  Gán tên thật cho TV1–TV4 (điền RACI Project Plan).

7.  Cài Claude Code cho cả 4 người; kết nối GitHub MCP; thử /test, /seed.

8.  Mỗi người chạy thử 1 task nhỏ trọn vòng (mục 5) để 'làm nóng' quy trình trước khi vào việc chính.

## 13. Rủi ro quy trình & cách phòng

| **Rủi ro quy trình**                           | **Phòng ngừa**                                               | **Liên kết** |
|------------------------------------------------|--------------------------------------------------------------|--------------|
| Accept-all code AI → nợ kỹ thuật, lỗi security | Bắt buộc 2 lớp review; PR nhỏ; checklist mục 7.1             | R1, Axis 2   |
| CLAUDE.md/spec lệch nhau theo thời gian        | Khi SoT đổi, cập nhật CLAUDE.md cùng lúc; Lead giữ cross-cut | R5           |
| Nhiều agent song song → merge hỗn loạn         | Worktrees + branch ngắn + merge sớm; cap 2–4 agent           | R7           |
| Seed/Profile JSON đổi giữa chừng → F2/F4/F5 vỡ | Chốt hợp đồng JSON ngày 1; đổi phải qua change control       | R7           |
| Scope creep — thêm tính năng ngoài phân công   | Issue = đơn vị scope; Lead duyệt thay đổi (24h rule)         | R4           |
| Level Gate Exam chưa có người đặc tả           | V0 chỉ thể hiện vị trí; giao đặc tả nội dung ở V1            | R6           |

## Phụ lục A — Template CLAUDE.md (gốc repo)

Copy nội dung dưới vào file CLAUDE.md ở gốc repo, chỉnh theo thực tế. Bản con trong backend/ và frontend/ chỉ cần phần quy ước riêng của lớp đó.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p># VCoder — Context cho AI agent</p>
<p>## Sản phẩm</p>
<p>Nền tảng test-gated learning đo năng lực điều khiển AI (Vibe Coder → AI-Ready</p>
<p>Engineer). Sợi chỉ đỏ: Test (F1) → AI-Ready Profile (F2) → Learning Path (F3);</p>
<p>Leaderboard (F4) &amp; Dashboard (F5) đọc projection từ Profile.</p>
<p>Spec nguồn: xem docs/ (PRD, Functional Spec, Data Model, API Contract, TDD, ADR).</p>
<p>Source of Truth: docs/AI-Ready-Engine_Source-of-Truth_v1.1 — khi mâu thuẫn, SoT thắng.</p>
<p>## 5 trục canonical (KHÔNG tự đặt tên khác)</p>
<p>Axis 1 AI Direction | Axis 2 Output Evaluation | Axis 3 Recovery &amp; Debug |</p>
<p>Axis 4 Eng. Foundations | Axis 5 AI Product Arch</p>
<p>Level: L0 AI-Curious | L1 Vibe Coder | L2 AI-Ready Engineer | L3 Context Engineer |</p>
<p>L4 Agentic Engineer. AI-Ready khi A1&gt;=L2, A2&gt;=L2, A3&gt;=L1, A4&gt;=L2 (A5 đo, không gate).</p>
<p>## Stack &amp; quy ước</p>
<p>- Backend: Python 3.12 + FastAPI + Pydantic v2 + PostgreSQL 16 (JSONB cho evidence).</p>
<p>- Frontend: React 18 + TypeScript + Vite + Tailwind + Recharts (radar).</p>
<p>- JSON: snake_case, khớp API Contract (file 09). Enum dùng đúng giá trị canonical.</p>
<p>- Migration: Alembic. ID: UUID v4. Thời gian: ISO-8601 UTC.</p>
<p>## Phạm vi V0 (ADR-005)</p>
<p>Backend tối thiểu THẬT (API Profile + schema) + 5 màn nối API. STUB: auto-scoring</p>
<p>(dùng Profile seed), telemetry, viva, problem bank lớn, percentile thật.</p>
<p>## Off-limits (đừng làm nếu chưa được duyệt)</p>
<p>- KHÔNG commit secret/.env; KHÔNG hardcode key.</p>
<p>- KHÔNG đổi enum trục/level, rubric.yaml, hay schema DB khi chưa được Lead duyệt.</p>
<p>- KHÔNG thêm tính năng ngoài issue đang làm (giữ scope).</p>
<p>## Quy trình &amp; Done</p>
<p>- Làm theo plan mode trước; ưu tiên TDD (viết test từ Given-When-Then trong Functional Spec).</p>
<p>- Trước khi báo xong: chạy `make test` (lint+type+test) phải xanh.</p>
<p>- PR nhỏ, mô tả rõ, 'Closes #&lt;issue&gt;'.</p></td>
</tr>
</tbody>
</table>

## Phụ lục B — Template PR / Issue / Standup / Definition of Done

B.1 PR template (.github/pull_request_template.md)

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>## Liên quan</p>
<p>Closes #&lt;issue&gt; · FR: &lt;FR-xx&gt; · Tính năng: &lt;F?&gt;</p>
<p>## Agent được giao làm gì (prompt request)</p>
<p>- Yêu cầu: ...</p>
<p>- Spec/AC tham chiếu: ...</p>
<p>## Bằng chứng khớp spec</p>
<p>- [ ] Test tương ứng AC đã xanh (TC-...)</p>
<p>- [ ] CI xanh (lint/type/test/build)</p>
<p>- [ ] Ảnh chụp/clip demo (nếu UI)</p>
<p>## Tự kiểm (checklist review)</p>
<p>- [ ] Không secret; thay đổi auth/data access đã soi kỹ</p>
<p>- [ ] Đúng tên 5 trục/level canonical; JSON khớp API Contract</p>
<p>- [ ] Không vượt scope issue</p></td>
</tr>
</tbody>
</table>

B.2 Issue template

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>Tiêu đề: [FR-xx/F?] &lt;mô tả ngắn&gt;</p>
<p>Mục tiêu (user story): Là &lt;vai trò&gt;, tôi muốn &lt;...&gt; để &lt;...&gt;.</p>
<p>Acceptance Criteria (Given-When-Then): copy từ Functional Spec.</p>
<p>Phạm vi V0: &lt;thật/stub&gt;. Nhãn: comp:F? · prio:Must/Should.</p>
<p>Định nghĩa Done: xem mục 10.1.</p></td>
</tr>
</tbody>
</table>

B.3 Daily standup (async, 3 dòng)

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>Hôm qua: &lt;đã xong gì, PR nào&gt;</p>
<p>Hôm nay: &lt;issue đang làm&gt;</p>
<p>Blocker: &lt;chặn gì / cần ai / cần Lead quyết gì&gt;</p></td>
</tr>
</tbody>
</table>

B.4 Definition of Done (dán vào board)

- AC khớp + test xanh + CI xanh + ≥1 review + không secret + đúng tên trục + demo 2 phút + merged.

## Phụ lục C — Nguồn tham khảo

- [Claude Code — Best practices (Anthropic)](https://code.claude.com/docs/en/best-practices) — https://code.claude.com/docs/en/best-practices

- [Claude Code — Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees) — https://code.claude.com/docs/en/worktrees

- [How Anthropic teams use Claude Code (PDF)](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf) — https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf

- [GitHub Spec Kit — Spec-Driven Development toolkit](https://github.com/github/spec-kit) — https://github.com/github/spec-kit

- [GitHub Blog — Spec-driven development with AI](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/

- [GitHub Blog — Agent pull requests: how to review them](https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/) — https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/

- [Multi-agent coding workflow for small teams (worktrees, roles, review gates)](https://blog.laozhang.ai/en/posts/multi-agent-coding-workflow-small-team) — https://blog.laozhang.ai/en/posts/multi-agent-coding-workflow-small-team

- [Codex vs Claude Code 2026 — khi nào dùng cái nào](https://www.mindstudio.ai/blog/codex-vs-claude-code-2026) — https://www.mindstudio.ai/blog/codex-vs-claude-code-2026

- [Linear vs Jira vs GitHub Projects 2026 — so sánh & định giá](https://comparetiers.com/blog/best-dev-tools-pricing-2026) — https://comparetiers.com/blog/best-dev-tools-pricing-2026

Lịch sử phiên bản

| **Phiên bản** | **Ngày**   | **Người sửa** | **Mô tả thay đổi**                                                                                                                                                                                                             |
|---------------|------------|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0           | 04/06/2026 | Team Gamma    | Khởi tạo quy trình build với AI (Claude Code) + quản lý dự án (GitHub Projects). SDD, vòng lặp 6 pha, git workflow/worktrees, review 2 lớp, kế hoạch V0 1–2 tuần, templates. Đồng bộ Project Plan v0.1 + Source of Truth v1.1. |
