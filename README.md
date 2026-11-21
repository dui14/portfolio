# Portfolio

Personal portfolio of a software engineer.
Live at **[duii.dev](https://duii.dev)**.

![duii.dev avatar](https://duii.dev/images/profile/avatar.webp)

A single-page, scroll-driven site built with Vite, React 19 and Tailwind CSS v4. No database, no auth, no server rendering: static files plus one small contact endpoint.

## Highlights

| | |
|---|---|
| **4 languages** | English, Tiếng Việt, 中文, 日本語. Every string lives in typed data; a missing translation fails the build. |
| **5 themes** | Three base colours per theme; every other colour is derived with `color-mix()`. An inline script applies the saved theme before first paint, so there is no flash. |
| **Prerendered pages** | Blog posts and project pages are written to static HTML at build time with their own title, description, canonical and Open Graph tags. |
| **Few dependencies** | React, Motion, Lenis and Lucide at runtime. Everything else is build-time tooling. |

## Design techniques

**Design tokens, not ad-hoc values.** Colour, spacing, radius, shadow, duration and easing are CSS custom properties exposed to Tailwind through `@theme`. Components use tokens only, so a theme switch is a change to three variables on `<html>`.

**Typography.** Self-hosted variable fonts (Inter Tight and JetBrains Mono), subset into Latin and Vietnamese files and preloaded. A fluid type scale uses `clamp()`.

**Scroll-driven motion.** One Lenis instance provides smooth scroll. Motion drives section reveals, the Journey timeline (a glowing dot that follows the scroll along an accent rail), metric count-ups and card hover states. Values move through motion values rather than per-frame React state.

**Accessible by default.**
- Every animation is gated by `prefers-reduced-motion`.
- Dialogs trap and restore focus.
- Interactive elements have visible focus rings and labels.
- Images have alt text.
- Hover-only reveals also open on keyboard focus and on tap.

**Bento layout.** The About section is a responsive bento grid:
- skills shown as code cards;
- a Life photo card that shuffles and frames any aspect ratio over a blurred backdrop;
- certifications and badges with a lightbox.

**Command palette.** Press `Ctrl K` to jump to any section, project, post, theme or language.

**A small companion.** A pixel Shiba walks along the page. A manifest-driven state machine runs it on `requestAnimationFrame`, and the code loads lazily when the browser is idle. It steps aside from interactive elements and dialogs, and you can turn it off.

## Engineering

**Layered source tree.**

| Folder | Holds |
|---|---|
| `sections/` | page sections |
| `components/` | shared UI |
| `features/` | hooks with application logic |
| `domain/` | types and validation |
| `data/` | all content and copy |
| `services/` | the only network I/O |

A section never imports another section.

**Media pipeline** (`npm run media`, runs before every build), using sharp and ffmpeg:
- images become WebP at two sizes with `srcset`;
- `.mov` becomes `.mp4` with a poster;
- page one of a PDF becomes an image;
- file names become SEO slugs.

Pages read media only through a generated manifest.

**Markdown blog.** One folder per post and one file per language. HTML is sanitized at build time and code blocks are highlighted. Each post is prerendered, with a language switcher.

**Contact.** The form posts to `/api/contact`. The endpoint validates with the same domain rules as the client, applies a honeypot and a per-IP rate limit, and sends through Resend. The API key never reaches the browser.

**CI.** GitHub Actions runs lint and a full build on every push and pull request.

## Built with a spec-first AI workflow

This site was built with [vibe-coding-workflow](https://github.com/dui14/vibe-coding-workflow):
- the idea is written down first;
- an agent drafts the architecture and feature specs;
- the specs are reviewed before any code is written;
- each feature is marked done only after its build and lint commands pass.

## Run locally

Requires Node.js 24+.

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
npm run check      # lint + production build
npm run preview    # serve dist/ at http://localhost:4173
```

Content media lives in a local `media/` folder that is not committed. Without it the site still builds from the committed manifest, but images are missing.

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Motion · Lenis · sharp · ffmpeg · marked · Resend

## License

Code is released under the [MIT License](LICENSE). Photos, artwork and written content are not covered by it and may not be reused without permission.
