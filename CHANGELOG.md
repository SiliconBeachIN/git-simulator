# Changelog

All notable changes to GitSimulator are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Version numbers follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

> Changes on `main` not yet tagged as a release.

---

## [3.0.0] — 2026-03-15

### Added

- Plain-language introductions to all 24 modules — each module now opens with
  one or two `InfoBox` components explaining what the feature is, why it exists,
  and a real-world analogy before showing any commands or simulators
- Full GitHub Codespaces module rewrite: "Without vs With" comparison panel,
  labelled boot simulation, `devcontainer.json` explained, four "When to use it"
  use-case cards
- Module intro content for: Stage & Commit, Branching, Merge & Rebase, Commit
  Graph, Issues, GitHub Projects, GitHub Pages, Releases, Branch Protection,
  CODEOWNERS, GitHub API, .github Folder, Dependabot
- `CONTRIBUTING.md` — comprehensive contributor guide covering codebase
  architecture, design tokens, shared components, how to add a module, content
  writing guidelines, commit format, PR process
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- `SECURITY.md` — vulnerability reporting process
- `CHANGELOG.md` — this file
- `LICENSE` — MIT
- `.github/PULL_REQUEST_TEMPLATE.md` — structured PR template
- `.github/ISSUE_TEMPLATE/bug_report.md` — structured bug report template
- `.github/ISSUE_TEMPLATE/feature_request.md` — feature/content request template
- `.github/ISSUE_TEMPLATE/content_improvement.md` — dedicated content feedback template
- `.github/CODEOWNERS` — auto-assign reviews to maintainers
- Updated `README.md` — badges, full module table, tech stack table, deployment
  guide, contributing section

### Removed

- XP system, Level system, Mark as Complete button
- `ModuleFooter` component
- `localStorage` progress persistence (`gitsim_progress_v1` key)
- `visited`, `completed`, `xp`, `toast` state
- XP/Level badges in the topbar
- XP bar and completion counter in the sidebar
- Sequential module lock system
- Toast notifications

---

## [2.0.0] — 2026-02-20

### Added

- Production build configuration: vendor chunk splitting, esbuild minify, ES2015 target
- Enhanced `index.html`: meta description, Open Graph tags, `theme-color`, `color-scheme`
- `StagingSimulator` reset button after all files are committed
- `PagesSimulator` reset button and labelled "Save" step buttons
- `GitHub Actions` module: full CI/CD YAML walkthrough with inline annotations
- `Open Source` module: complete fork workflow with step-by-step numbered list
- `Git Flow` module: 9-step professional workflow with timeline connector UI
- `Advanced Magic` module: `reflog`, `bisect`, `cherry-pick`, tags, worktrees

### Fixed

- `BranchSimulator` crash on null `currentBranch` — added `?? branches[0]` guard
- `CommitGraph` O(n) lookup per render — replaced with `GRAPH_COMMIT_MAP = new Map()`
  built once outside the component
- Terminal stale closure bug — refactored to `useCallback` with `[input]` dependency
- Dead `approved` state in `PRSimulator` — removed
- Dead expression in `MergeSimulator` — removed
- Codespaces button had no effect — full module rewrite

### Removed

- Dead `expCmd` / `expCmds` variables
- Dead `toggle` variable
- Empty "bonus" section in the Advanced module
- "Coming soon" fallback text — replaced with "Module not found" message
- "Nuclear option" wording — replaced with "Last resort"

---

## [1.0.0] — 2026-01-15

### Added

- Initial application scaffold: React 18 + Vite 5 project structure
- `src/App.jsx` — complete single-file application
- `src/main.jsx` — React entry point
- `index.html` — Vite HTML shell
- `vite.config.js` — Vite config with `@vitejs/plugin-react`
- `package.json` with React + Vite dependencies
- `.gitignore` — node_modules, dist, .vite, .DS_Store
- `README.md` — basic project documentation
- 24 learning modules in the sidebar
- Interactive Terminal with `TERM_RESPONSES` command map
- `StagingSimulator` — interactive stage/commit workflow
- `BranchSimulator` — create, switch, delete branches
- `MergeSimulator` — conflict resolution practice
- `CommitGraph` — visual ASCII commit history with clickable nodes
- `PRSimulator` — pull request lifecycle walkthrough
- `IssuesSimulator` — issue creation and management
- `ProjectsSimulator` — Kanban board
- `PagesSimulator` — GitHub Pages deploy flow
- `ReleasesSimulator` — semver release creation
- `ProtectionSim` — branch protection rules
- `CodeownersSim` — CODEOWNERS file builder
- `APIExplorer` — GitHub REST API calls
- `DotGithubExplorer` — .github folder structure
- `DependabotSim` — dependency update simulation
- `CodespacesSim` — cloud dev environment simulation
- `Quiz` — 10-question master knowledge check
- Design token object `T` for consistent colours
- Shared primitives: `CopyBtn`, `Badge`, `InfoBox`, `ConceptDiagram`,
  `SectionTitle`, `CommandCard`, `Terminal`
- Footer: year, GitHub logo, SiliconBeachIN link
- Google Fonts: JetBrains Mono + Syne via `@import`
- Ambient background gradient blobs
- CSS `slideIn` / `fadeIn` animations
- Sidebar search filter
- Collapsible sidebar

---

[Unreleased]: https://github.com/SiliconBeachIN/git-simulator/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/SiliconBeachIN/git-simulator/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/SiliconBeachIN/git-simulator/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/SiliconBeachIN/git-simulator/releases/tag/v1.0.0
