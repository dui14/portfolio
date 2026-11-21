---
title: "Vibe Coding Workflow: một file ý tưởng, một bản spec bạn duyệt, rồi mới code"
date: 2026-11-20
summary: Bộ khung mã nguồn mở bắt AI agent viết kiến trúc, spec tính năng và bảng tiến độ trước, rồi chờ bạn duyệt mới được đụng vào src/.
---

Phần lớn những buổi làm việc tệ của mình với AI agent đều bắt đầu giống nhau: mình gõ "làm cho mình X", agent tự chọn stack, tự nghĩ cấu trúc thư mục và viết cả nghìn dòng trước khi mình kịp nghĩ rõ X là gì. Sửa lại sau đó còn tốn công hơn tự viết.

Vì vậy mình làm [vibe-coding-workflow](https://github.com/dui14/vibe-coding-workflow), một bộ khung dự án cho kiểu phát triển AI-native. Ý chính gói trong một dòng của README:

> One prompt. Agent writes the development context. You review the spec, then build.

Chính trang duii.dev này được làm theo quy trình đó.

![Quy trình phát triển AI-native, từ ý tưởng tới tính năng hoàn thành](ai-native-workflow.png)

## Vấn đề

Một agent bắt đầu dự án mới thì không có ngữ cảnh gì. Nó không biết sản phẩm, stack, luật chia tầng hay thế nào thì gọi là "xong". Bạn có thể giải thích trong chat, nhưng chat trôi mất, và phiên sau lại bắt đầu từ số 0.

Bộ khung này đưa ngữ cảnh đó vào file để agent đọc mỗi lần, và bắt chính agent viết các file đó cho bạn. README viết: *"You edit, not write from scratch"*, tức là bạn chỉ sửa, không phải viết từ đầu.

## Trong repo có gì

```
AGENTS.md                         luật chung cho mọi agent
CLAUDE.md                         trỏ tới AGENTS.md
.github/copilot-instructions.md   trỏ tới AGENTS.md
.agents/skills/                   bootstrap, code-review, finish-feature, fix-bug, ...
ai-context/                       sản phẩm, stack, kiến trúc, API, chuẩn code, UI system
spec/                             features/, ui/, progress.md
idea.md                           ý tưởng của bạn, viết bằng lời thường
```

Repo chỉ có file ngữ cảnh: không có thư viện chạy kèm, không cần `npm install`. Dùng được với mọi agent đọc `AGENTS.md` và skill của dự án: Cursor, Claude Code, GitHub Copilot, Windsurf, Antigravity và các công cụ tương tự.

## Quy trình

**1. Viết `idea.md`.** Viết tự do. Vài câu là đủ, chi tiết hơn thì tốt hơn.

**2. Bootstrap (chỉ spec).** Dán prompt bootstrap trong README. Agent viết `ai-context/` và `spec/` rồi dừng. Prompt kết thúc bằng:

```text
3. STOP. Do not create src/, do not install dependencies, do not implement features.
4. Ask me to review the spec before any build.
```

Dự án nhỏ dùng chế độ **lite** (3 file: sản phẩm, tech stack, chuẩn code). Ứng dụng lớn dùng chế độ **full**, từ `ai-context/00` tới `08`, thêm spec giao diện. Tầng nào không có thì ghi N/A chứ không bịa ra.

**3. Cổng duyệt.** Đây là bước quan trọng nhất:

> This gate is required. Do not skip it and do not let the agent start `src/` until you say the spec is accepted.

Bạn đọc spec, sửa chỗ sai, rồi trả lời `Spec accepted. Continue to src/ structure.`

**4. Khung mã nguồn.** Agent tạo các file rỗng có sẵn import và export. Chưa có logic.

**5. Làm từng tính năng.** Giao diện làm từng section, mỗi component xử lý đủ các trạng thái mặc định, đang tải, lỗi, trống và thành công, kiểm tra trên trình duyệt thật qua Playwright MCP. Sau đó tới backend, rồi nối hai bên.

**6. Bằng chứng.** Mỗi spec tính năng có tiêu chí nghiệm thu là lệnh chạy được, không phải văn xuôi:

> Acceptance criteria in `spec/features/` must be runnable commands (test runner, curl, CLI). Prose-only criteria are invalid.

**7. Tiến độ.** `spec/progress.md` chỉ có `todo`, `blocked` hoặc `done`, và agent không được ghi `done` chỉ vì code "trông như xong". Một dòng chỉ thành `done` khi các lệnh của nó đã chạy và qua trong chính phiên làm việc đó.

## Những luật mình coi trọng nhất

- **Chưa duyệt thì chưa code.** Agent đề xuất, bạn quyết.
- **Xong nghĩa là lệnh đã chạy qua.** Không phải "nhìn thì thấy ổn".
- **Ít MCP server.** Giữ 4 đến 5 cái (context7, GitHub, Playwright, codegraph) và ưu tiên CLI, vì schema của mỗi MCP tốn token ở mọi lượt.
- **Đúng model cho đúng việc.** Model mạnh nhất cho bootstrap, kiến trúc và bảo mật; model mặc định để viết code; model nhanh cho sửa máy móc; công cụ CLI thường (k6, trivy, semgrep, gitleaks) cho các bản quét.

Repo còn hướng dẫn cho hai điểm xuất phát khác: codebase đang làm dở (làm quen, viết test giữ hành vi, lấp chỗ thiếu) và sản phẩm đã xong cần mở rộng.

## Dùng thử

Cần Node.js 18 trở lên.

```bash
git clone https://github.com/dui14/vibe-coding-workflow.git your-project
cd your-project
npx skills add vercel-labs/agent-skills
npx skills add shadcn/ui
```

Hoặc bấm **Use this template** trên GitHub. Sau đó mở thư mục bằng agent của bạn, viết `idea.md` và dán prompt bootstrap.

Repo dùng giấy phép MIT. Mọi issue và pull request góp ý cho quy trình hay tài liệu đều được chào đón: [github.com/dui14/vibe-coding-workflow](https://github.com/dui14/vibe-coding-workflow).
