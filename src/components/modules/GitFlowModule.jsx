import T from "../../constants/tokens";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard } from "../shared";

export default function GitFlowModule() {
  return (
    <div>
      <InfoBox icon="🔄" title="Git Flow — The Professional Ritual" color={T.teal}>
        Git Flow is a <strong style={{ color: T.teal }}>branching strategy</strong> — a set of
        rules about how branches are named and when they're created. It's not a git command,
        it's a workflow discipline used by professional teams. The core principle:{" "}
        <strong>main is always deployable</strong>. All work happens on branches.
      </InfoBox>
      <ConceptDiagram>{`  main     ──●──────────────────────────●──────────────────●── (always deployable)
              ╲                          ╱ ↑                  ╱
  hotfix       ╲          ╱────●────●──╱  │  hotfix/critical ╱
                ╲        ╱                │                  ╱
  develop  ──────●──●──●──●──●──●──●──●──●──●──●──●──●──●──
                       ╲     ╱     ╲     ╱
  feature/login  ────────●───●      ─────
  feature/dash           ╲     ╱
                          ●──●`}</ConceptDiagram>
      <SectionTitle>Complete Step-by-Step Workflow</SectionTitle>
      {[
        { cmd: "git switch main && git pull", desc: "STEP 1 — Always start from up-to-date main", detail: "Golden rule: never branch from stale code. Pull first, then create your branch.", example: "🏁 Starting the race from the latest checkpoint" },
        { cmd: "git switch -c feature/user-dashboard", desc: "STEP 2 — Create a descriptive feature branch", detail: "Name it clearly: feature/, fix/, hotfix/, release/ prefixes help the team understand at a glance.", example: "🌿 Splitting off into your own universe" },
        { cmd: 'git add . && git commit -m "feat: add dashboard layout"', desc: "STEP 3 — Work and commit often", detail: "Small, focused commits are easier to review and revert if needed. Commit after each logical unit of work.", example: "📸 Photograph your progress as you go" },
        { cmd: "git push -u origin feature/user-dashboard", desc: "STEP 4 — Push branch to GitHub", detail: "This makes your branch visible to teammates and triggers any CI/CD configured on push events.", example: "☁️ Share your universe with the team" },
        { cmd: "# GitHub.com → Compare & Pull Request", desc: "STEP 5 — Open Pull Request on GitHub", detail: "Write a clear title and description. Add reviewers. Link any relevant issues. CI checks run automatically.", example: "🤝 'Hey team, please review my work!'" },
        { cmd: "# Address review comments with new commits", desc: "STEP 6 — Respond to code review", detail: "Never force-push during review — just add new commits. The PR updates automatically. Discuss, iterate, improve.", example: "🔧 Improving based on teammate feedback" },
        { cmd: "# Click Merge on GitHub (Squash & Merge)", desc: "STEP 7 — Merge when approved", detail: "Squash & Merge = all your commits become one clean commit on main. Keeps main history readable.", example: "🔀 Your work is now part of main!" },
        { cmd: "git switch main && git pull", desc: "STEP 8 — Sync your local main", detail: "Pull the merged changes so your local main matches GitHub.", example: "⬇️ Download the newly merged timeline" },
        { cmd: "git branch -d feature/user-dashboard", desc: "STEP 9 — Clean up local branch", detail: "Delete the feature branch — it served its purpose. Keep your local repo tidy.", example: "🧹 Closing the completed parallel universe" },
      ].map((c, i) => (
        <div key={i} style={{ position: "relative", paddingLeft: 26 }}>
          {i < 8 && (
            <div style={{ position: "absolute", left: 5, top: 38, width: 2, height: "calc(100% + 2px)", background: "linear-gradient(to bottom, #4ade80, rgba(74,222,128,.1))" }} />
          )}
          <div style={{ position: "absolute", left: 0, top: 16, width: 12, height: 12, borderRadius: "50%", background: T.green, border: `2px solid ${T.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: T.bg, fontWeight: 700 }}>
            {i + 1}
          </div>
          <CommandCard index={i} {...c} />
        </div>
      ))}
    </div>
  );
}
