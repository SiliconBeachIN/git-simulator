# ⚡ GitSimulator — Master GitHub Interactively

> An interactive, browser-based learning tool that teaches Git and GitHub through hands-on simulators, real command references, and visual diagrams. No sign-up. No install. Just open and learn.

**[🚀 Live Demo → gitsimulator.xyz](https://gitsimulator.xyz)**

![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.4-646cff?style=flat&logo=vite)
![Netlify](https://img.shields.io/netlify/PLACEHOLDER?style=flat&logo=netlify&label=Netlify)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat)
![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa?style=flat)

---

## What is GitSimulator?

GitSimulator is a single-page React application with **24 interactive modules** covering every major Git and GitHub concept — from `git init` to GitHub Actions, Codespaces, the GitHub API, and beyond.

Each module includes:
- **Plain-language introductions** — what the feature is, why it exists, and a real-world analogy
- **Interactive simulators** — hands-on practice without touching a real repo
- **Live terminal** — type actual git commands and see responses
- **Command reference cards** — copy-ready commands with full explanations
- **Visual diagrams** — ASCII concept maps and commit graphs

---

## Modules

| # | Module | What you learn |
|---|--------|----------------|
| 1 | ⚡ Mission Control | Overview + live terminal |
| 2 | 🌱 git init | Repos, `.git/` internals, cloning |
| 3 | 📦 Stage & Commit | Staging area, `git add`, `git commit` |
| 4 | 🌿 Branching | Branch creation, switching, deletion |
| 5 | 🔀 Merge & Rebase | Merge strategies, conflict resolution |
| 6 | ☁ Remote & Push | `origin`, `push`, `pull`, `fetch` |
| 7 | 🤝 Pull Requests | PR lifecycle, writing good descriptions |
| 8 | 🔄 Git Flow | Professional branching strategy |
| 9 | ⚗ Advanced Magic | `reflog`, `bisect`, `cherry-pick`, tags |
| 10 | 🌐 Open Source | Fork workflow, upstream remotes |
| 11 | 📊 Commit Graph | Visual history, reading branch diagrams |
| 12 | 🤖 GitHub Actions | CI/CD pipelines, YAML workflows |
| 13 | 🔐 Security | Secrets, SSH keys, `.gitignore` |
| 14 | 🐛 Issues | Bug tracking, linking to commits/PRs |
| 15 | 📋 GitHub Projects | Kanban boards, project management |
| 16 | 🌍 GitHub Pages | Free static site hosting |
| 17 | 📦 Releases | Semantic versioning, release notes |
| 18 | 🔒 Branch Protection | Rules, required reviews, status checks |
| 19 | 👑 CODEOWNERS | Automatic reviewer assignment |
| 20 | 🔌 GitHub API | REST API, Personal Access Tokens |
| 21 | 📂 .github Folder | Workflows, templates, config |
| 22 | 🤖 Dependabot | Automated dependency updates |
| 23 | 💻 Codespaces | Cloud development environments |
| 24 | 🧠 Master Quiz | 10-question knowledge check |

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.4.x | Build tool + dev server |
| @vitejs/plugin-react | 4.x | JSX transform |
| Google Fonts | — | JetBrains Mono + Syne |

No external UI libraries. All styling is pure inline CSS with a design token object. Everything lives in a single `src/App.jsx` file.

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Install & Run

```bash
# Clone the repo
git clone https://github.com/SiliconBeachIN/git-simulator.git
cd git-simulator

# Install dependencies
npm install

# Start development server (opens browser automatically)
npm run dev
```

The app will open at `http://localhost:5173`.

### Build for Production

```bash
npm run build        # Outputs to dist/
npm run preview      # Preview the production build locally
```

---

## Project Structure

```
git-simulator/
├── src/
│   ├── App.jsx          # Entire application — all components, data, state
│   └── main.jsx         # React entry point
├── docs/
│   └── GITHUB_MASTERY_GUIDE.md
├── index.html           # Vite HTML shell
├── vite.config.js       # Vite config (vendor split, esbuild minify)
├── package.json
└── .gitignore
```

---

## Deployment

The `dist/` folder is a fully static build — deploy anywhere:

- **GitHub Pages** — push `dist/` to `gh-pages` branch or use GitHub Actions
- **Vercel** — connect repo, set build command `npm run build`, output dir `dist`
- **Netlify** — same as Vercel
- **Any static host** — just serve the `dist/` folder

---

## Contributing

Contributions are welcome from everyone — beginners to seniors. You can help by:

- Improving an explanation or analogy in any module
- Fixing a broken simulator or layout bug  
- Adding a new module for a Git/GitHub topic not yet covered
- Improving these docs

> **Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.** It covers the codebase architecture, design tokens, shared components, how to add a module, content writing rules, and commit format.

```bash
# Quick start for contributors
git clone https://github.com/YOUR_USERNAME/git-simulator.git
cd git-simulator
npm install
npm run dev
```

### Community health files

| File | Purpose |
|------|---------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute — architecture, components, guidelines |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | How we treat each other |
| [SECURITY.md](SECURITY.md) | How to report vulnerabilities |
| [CHANGELOG.md](CHANGELOG.md) | What changed and when |

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE).

---

Built with ❤️ by [SiliconBeachIN](https://github.com/SiliconBeachIN)
