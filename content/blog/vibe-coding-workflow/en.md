---
title: "Vibe Coding Workflow: one idea file, a spec you review, then code"
date: 2026-11-20
summary: An open-source scaffold that makes an AI coding agent write the architecture, feature specs and progress tracker first, and wait for your approval before it touches src/.
tags: [ai, workflow, claude-code, open-source]
cover: ai-native-workflow.png
---

Most of my bad sessions with AI coding agents started the same way: I typed "build me X", the agent picked a stack, invented a folder layout and wrote a thousand lines before I had decided what X actually was. Fixing that later cost more than writing it by hand.

So I built [vibe-coding-workflow](https://github.com/dui14/vibe-coding-workflow), a project scaffold for AI-native development. The idea fits in one line from the README:

> One prompt. Agent writes the development context. You review the spec, then build.

This site, duii.dev, was built with it.

![How an AI-native development workflow goes from idea to a finished feature](ai-native-workflow.png)

## The problem

An agent starting a new project has no context. It does not know your product, your stack, your layering rules or what "done" means. You can explain it in chat, but chat scrolls away, and the next session starts from zero.

The scaffold moves that context into files the agent reads every time, and makes the agent write those files for you. In the README's words: *"You edit, not write from scratch."*

## What is in the repo

```
AGENTS.md                         shared rules for every agent
CLAUDE.md                         points at AGENTS.md
.github/copilot-instructions.md   points at AGENTS.md
.agents/skills/                   bootstrap, code-review, finish-feature, fix-bug, ...
ai-context/                       product, stack, architecture, API, standards, UI system
spec/                             features/, ui/, progress.md
idea.md                           your idea, in plain words
```

It is context files only. No runtime dependencies, no `npm install`. It works with any agent that reads `AGENTS.md` and project skills: Cursor, Claude Code, GitHub Copilot, Windsurf, Antigravity and similar.

## The flow

**1. Write `idea.md`.** Write freely. A short description is enough; more detail helps.

**2. Bootstrap (spec only).** Paste the bootstrap prompt from the README. The agent writes `ai-context/` and `spec/`, then stops. The prompt ends with:

```text
3. STOP. Do not create src/, do not install dependencies, do not implement features.
4. Ask me to review the spec before any build.
```

Small projects use **lite** mode (three files: product, tech stack, coding standards). Bigger apps use **full** mode, `ai-context/00` to `08`, plus UI specs. A layer that does not apply is written as N/A instead of being invented.

**3. Review gate.** This is the step that matters most:

> This gate is required. Do not skip it and do not let the agent start `src/` until you say the spec is accepted.

You read the spec, fix what is wrong, then reply `Spec accepted. Continue to src/ structure.`

**4. Source structure.** The agent creates placeholder files with imports and empty exports. No logic yet.

**5. Feature by feature.** UI section by section, every component handling default, loading, error, empty and success states, checked in a real browser through Playwright MCP. Then backend, then wiring.

**6. Proof.** Every feature spec carries acceptance criteria as runnable commands, never prose:

> Acceptance criteria in `spec/features/` must be runnable commands (test runner, curl, CLI). Prose-only criteria are invalid.

**7. Progress.** `spec/progress.md` holds `todo`, `blocked` or `done`, and *"the agent must not set done because the code 'looks finished.'"* A row becomes `done` only when its commands ran and passed in the current session.

## The rules I care about most

- **No code before approval.** The agent proposes; you decide.
- **Done means a command passed.** Not "looks right to me".
- **Few MCP servers.** Keep four or five (context7, GitHub, Playwright, codegraph) and prefer a CLI, because every MCP schema costs tokens on every turn.
- **Right model for the job.** The strongest model for bootstrap, architecture and security; the default model for implementation; a fast one for mechanical edits; plain CLI tools (k6, trivy, semgrep, gitleaks) for scans.

It also covers two other starting points: a half-built codebase (onboard, characterise with tests, fill gaps) and a finished product that needs to scale.

## Try it

Requires Node.js 18+.

```bash
git clone https://github.com/dui14/vibe-coding-workflow.git your-project
cd your-project
npx skills add vercel-labs/agent-skills
npx skills add shadcn/ui
```

Or click **Use this template** on GitHub. Then open the folder in your agent, write `idea.md` and paste the bootstrap prompt.

The repo is MIT-licensed. Issues and pull requests for the workflow or the docs are welcome: [github.com/dui14/vibe-coding-workflow](https://github.com/dui14/vibe-coding-workflow).
