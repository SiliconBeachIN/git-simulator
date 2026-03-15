# Contributing to GitSimulator

Thank you for wanting to improve GitSimulator! This guide explains everything you need to know — from setting up locally to the exact process for adding a new module.

Read this fully before opening a PR. It saves you and the reviewers time.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Local Setup](#local-setup)
- [Codebase Overview](#codebase-overview)
- [Design Tokens](#design-tokens)
- [Shared Components](#shared-components)
- [How to Add a New Module](#how-to-add-a-new-module)
- [How to Improve an Existing Module](#how-to-improve-an-existing-module)
- [Content Writing Guidelines](#content-writing-guidelines)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [What Gets Rejected](#what-gets-rejected)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).  
By participating, you agree to uphold it. Report issues to the maintainers.

---

## Ways to Contribute

| Type | Examples |
|------|---------|
| **Content** | Improve an explanation, add a better analogy, fix confusing wording |
| **Bug fix** | A simulator button that doesn't work, a layout that breaks on mobile |
| **New module** | A new GitHub/Git topic not yet covered |
| **UI improvement** | Better readability, accessibility, responsiveness |
| **Docs** | Improve this guide, the README, or module instructions |

If you're unsure whether an idea is in scope, **open an Issue first** and discuss it before writing code.

---

## Local Setup

### Prerequisites

- Node.js 18 or higher — [download](https://nodejs.org)
- npm 9 or higher (comes with Node)
- Any code editor (VS Code recommended)

### Steps

```bash
# 1. Fork the repo on GitHub, then clone YOUR fork
git clone https://github.com/YOUR_USERNAME/git-simulator.git
cd git-simulator

# 2. Install dependencies
npm install

# 3. Start the dev server (auto-opens browser)
npm run dev
```

The app runs at `http://localhost:5173`. Changes to `src/App.jsx` hot-reload instantly.

### Verify the build works

Before opening a PR, always confirm the production build passes:

```bash
npm run build
```

It must complete with `✓ built` and no errors.

---

## Codebase Overview

The entire application lives in **one file**: `src/App.jsx` (~2400 lines).

This is intentional — no build complexity, no import chains, easy to read top-to-bottom.

### File layout (top to bottom)

```
src/App.jsx
│
├── Design tokens (T object)
├── MODULES array                    ← sidebar config
├── Shared primitives                ← CopyBtn, Badge, InfoBox, etc.
├── Interactive Terminal             ← TERM_RESPONSES map + Terminal component
├── GRAPH_COMMIT_MAP + CommitGraph   ← visual commit history
├── Interactive simulators           ← StagingSimulator, BranchSimulator, etc.
├── Quiz component + QUIZ_DATA       ← the Master Quiz
├── ModuleContent function           ← routes module id → JSX content
└── App (root component)             ← state, sidebar, layout
```

### Key data structures

**`MODULES` array** — drives the sidebar and navigation:
```js
const MODULES = [
  { id: "home",    icon: "⚡", label: "Mission Control" },
  { id: "init",    icon: "🌱", label: "git init" },
  // ... one entry per module
];
```

**`ModuleContent` function** — routes each module id to its JSX:
```jsx
function ModuleContent({ id }) {
  if (id === "init")    return <div>...</div>;
  if (id === "staging") return <div>...</div>;
  // ...
}
```

---

## Design Tokens

All colours come from the `T` object at the top of `App.jsx`. **Never use raw hex values** — always reference `T`.

```js
const T = {
  bg:      "#060b18",  // page background
  surface: "#090e1c",  // slightly lighter background
  card:    "#0d1526",  // card background
  border:  "#1a2540",  // borders everywhere
  green:   "#4ade80",  // primary accent (success, Git commands)
  blue:    "#60a5fa",  // secondary accent (info, links)
  purple:  "#a78bfa",  // third accent (advanced topics)
  amber:   "#fbbf24",  // warnings, tips, highlights
  red:     "#f87171",  // errors, danger
  teal:    "#2dd4bf",  // fourth accent (cloud, tools)
  text:    "#e2e8f0",  // primary text
  muted:   "#64748b",  // secondary text / labels
  faint:   "#1e293b",  // subtle backgrounds
};
```

### Colour usage convention

| Colour | Use for |
|--------|---------|
| `T.green` | Git commands, success states, confirmations |
| `T.blue` | Concepts, info boxes, links |
| `T.amber` | Warnings, tips, "pay attention" highlights |
| `T.red` | Errors, danger, "never do this" |
| `T.purple` | Advanced topics, power-user content |
| `T.teal` | Cloud features (Codespaces, remote, Actions) |

---

## Shared Components

Use these building blocks in module content — do not re-implement styling inline when a component already exists.

### `<InfoBox>`

A highlighted explanation box. Use at the top of every module.

```jsx
<InfoBox icon="💡" title="What this is" color={T.blue}>
  Explain the concept here in plain language. Use{" "}
  <strong style={{color: T.amber}}>bold</strong> for key terms.
  <br/><br/>
  A second paragraph if needed.
</InfoBox>
```

Props: `icon` (emoji string), `title` (string), `color` (from `T`), `children` (JSX).

---

### `<SectionTitle>`

An uppercase divider label between sections.

```jsx
<SectionTitle>CLI Commands</SectionTitle>
```

---

### `<CommandCard>`

An expandable card for a single command. Clicking reveals the detail, example, and optional warning.

```jsx
<CommandCard
  cmd="git switch -c feature/login"
  desc="Create and switch to a new branch"
  detail="The -c flag creates the branch if it doesn't exist. This is the modern replacement for git checkout -b."
  example="Splitting off into your own parallel universe 🌿"
  warning="Optional: only include if there's a real gotcha the learner must know."
  index={0}  // used for stagger animation — increment per card
/>
```

Always render a list of commands with `.map()`:
```jsx
{[
  { cmd: "...", desc: "...", detail: "...", example: "..." },
  { cmd: "...", desc: "...", detail: "...", example: "..." },
].map((c, i) => <CommandCard key={i} index={i} {...c} />)}
```

---

### `<ConceptDiagram>`

A monospaced ASCII art block for showing structure or flow.

```jsx
<ConceptDiagram>{`  main  ──●──●──●──●
              ╲
  feature  ────●──●`}</ConceptDiagram>
```

Use template literals (backtick string). Indent content with real spaces.

---

### `<Badge>`

A small inline tag.

```jsx
<Badge color={T.blue}>📸 Commit = Snapshot</Badge>
```

---

### `<Terminal>` and `<Terminal compact />`

The interactive terminal. Use `compact` prop for smaller contexts. No additional props needed.

```jsx
<Terminal compact />
```

---

## How to Add a New Module

Follow these exact steps — in this order.

### Step 1 — Add to MODULES array

Find the `MODULES` array near the top of `App.jsx`. Add your entry in the correct position (logical sequence matters for learners):

```js
const MODULES = [
  // ...existing entries...
  { id: "yourmodule", icon: "🔧", label: "Your Module Name" },
  // ...
];
```

- `id` — lowercase, no spaces, no special characters except `-` (used as URL key and JSX routing key)
- `icon` — one emoji
- `label` — short, title-case, ≤ 20 characters

### Step 2 — Add content in `ModuleContent`

Scroll to the `ModuleContent` function. Add your `if` block before the final `return` (the "not found" fallback):

```jsx
if (id === "yourmodule") return (
  <div>
    {/* 1. ALWAYS start with at least one InfoBox explaining what & why */}
    <InfoBox icon="🔧" title="What is [feature name]?" color={T.blue}>
      Explain what this feature is, the problem it solves, and who uses it.
      <br/><br/>
      Add a real-world analogy on the second paragraph.
    </InfoBox>

    {/* 2. Optional: a second InfoBox for a deeper insight or analogy */}
    <InfoBox icon="💡" title="Simple analogy" color={T.amber}>
      ...
    </InfoBox>

    {/* 3. Optional: ASCII concept diagram */}
    <SectionTitle>How It Works</SectionTitle>
    <ConceptDiagram>{`  Your ASCII diagram here`}</ConceptDiagram>

    {/* 4. Commands (if applicable) */}
    <SectionTitle>CLI Commands</SectionTitle>
    {[
      {
        cmd: "git example-command",
        desc: "One-line description of what it does",
        detail: "Full explanation — what happens internally, when to use it, edge cases.",
        example: "Real-world analogy for this specific command ✨",
        // warning: "Only add if there's a real danger the learner must know",
      },
    ].map((c, i) => <CommandCard key={i} index={i} {...c} />)}
  </div>
);
```

### Step 3 — Build and test

```bash
npm run build   # must pass with no errors
npm run dev     # open browser, click your module, review every section
```

### Step 4 — Write your commit and PR

See [Commit Message Format](#commit-message-format) and [Pull Request Process](#pull-request-process).

---

## How to Improve an Existing Module

1. Find the `if (id === "yourmodule")` block in `ModuleContent`
2. Make your change — improve wording, add an `InfoBox`, fix a `CommandCard` detail
3. Run `npm run build` to confirm no errors
4. Open a PR using the PR template

For content-only changes (wording, analogies, typos), `npm run build` passing is sufficient — no simulator testing required.

---

## Content Writing Guidelines

These rules apply to everything inside module content: InfoBox text, CommandCard `desc`/`detail`/`example` fields, SectionTitles, everything.

### Tone

- Write for someone who has **never used Git before** as the baseline
- Still be useful to intermediate/senior developers — don't over-explain the obvious
- Use **second person**: "you run", "your repo", "you'll see"
- Be direct. No filler. Cut any sentence that doesn't add information.

### Plain language rules

| ❌ Don't write | ✅ Write instead |
|---------------|----------------|
| "Leverages the native filesystem APIs" | "Reads files from your computer" |
| "This powerful feature enables collaboration at scale" | "This lets multiple people work on the same codebase" |
| "Coming soon" / "TODO" | Either write it or don't add the section |
| "As mentioned above" | Repeat the key point |
| "Simply run..." | Just show the command |

### Analogies

Every `InfoBox` should have a real-world analogy in the second paragraph. Good analogies:
- Use things everyone has experienced (libraries, kitchens, cameras, post offices)
- Map the Git concept to the analogy structurally (not just vibes)
- Are one or two sentences — not a paragraph

Good: *"Think of the staging area like a shopping basket. You pick items (git add) before paying (git commit). You can put things back before checkout."*

### CommandCard fields

| Field | What to write |
|-------|---------------|
| `cmd` | The exact command as you would type it |
| `desc` | One sentence: what it does. No technical jargon. |
| `detail` | Two to four sentences: what happens internally, when to use it, what to watch for |
| `example` | One short sentence with an analogy and an emoji. Leave `""` if you can't think of a good one. |
| `warning` | Only include if there is a real risk of data loss or breaking a shared repo. Keep it short. |

### What NOT to add

- Marketing language ("This revolutionary feature...")
- Vague descriptions ("This useful command does things with your repo")
- Empty sections (if you don't have content for a section, skip it)
- External links inside module content (the app is intentionally self-contained)

---

## Commit Message Format

Use the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```
<type>: <short description>

[optional body]
```

| Type | Use when |
|------|---------|
| `feat` | Adding a new module or significant new content |
| `fix` | Fixing a broken simulator, layout bug, wrong command |
| `content` | Improving wording, analogies, explanations in existing modules |
| `refactor` | Code changes with no behaviour change |
| `style` | CSS / visual changes only |
| `docs` | README, CONTRIBUTING, or other docs only |
| `chore` | Dependency updates, config changes |

### Examples

```
feat: add GitHub Packages module

content: improve merge conflict analogy in Merge module

fix: StagingSimulator reset button not clearing committed files

refactor: extract QUIZ_DATA to top-level constant

docs: add setup troubleshooting section to CONTRIBUTING
```

Rules:
- Use present tense: "add" not "added", "fix" not "fixed"
- Lowercase first word after the colon
- No period at the end of the subject line
- Keep the subject line under 72 characters

---

## Pull Request Process

1. **Fork** the repo on GitHub
2. **Create a branch** from `main` with a descriptive name:
   - `feat/github-packages-module`
   - `fix/staging-simulator-reset`
   - `content/improve-merge-analogies`
   - `docs/setup-guide-improvements`
3. **Make your changes** — one focused concern per PR
4. **Build**: `npm run build` must pass
5. **Test in browser**: `npm run dev`, open the affected module(s), check every interaction
6. **Push** to your fork and open a PR against `main`
7. **Fill in the PR template** — every section, no blank fields
8. **Wait for review** — address feedback by pushing new commits to the same branch

### PR size

- Prefer **small, focused PRs** — easier to review, faster to merge
- One new module = one PR
- Content fixes for multiple modules can go in one PR if they're the same type of change
- Do not mix unrelated changes in one PR

---

## What Gets Rejected

PRs will be closed without merging if they:

- Break the production build (`npm run build` fails)
- Add external runtime dependencies (`npm install some-package`) without prior discussion
- Add content that is incorrect, misleading, or promotional
- Contain AI-generated placeholder text ("Coming soon", "TODO", vague descriptions)
- Introduce accessibility regressions (e.g., removing keyboard navigability)
- Mix multiple unrelated concerns in one PR
- Have no description in the PR template

---

## Questions?

Open a Discussion on GitHub, or file an Issue with the `question` label.  
Do not use Issues for general Git/GitHub help — Issues are for this project only.
