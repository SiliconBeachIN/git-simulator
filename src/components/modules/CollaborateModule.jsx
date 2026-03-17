import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

export default function CollaborateModule() {
  return (
    <div>
      <InfoBox icon="🌐" title="The Open Source Cycle" color={T.teal}>
        Open source runs on a beautiful feedback loop: someone creates → you fork → you
        improve → you PR → they merge → you helped improve a tool millions use. Projects like
        React, Linux, Python, and VS Code were built this way.{" "}
        <strong style={{ color: T.teal }}>You can contribute too.</strong>
      </InfoBox>
      <SectionTitle>Complete Fork Workflow</SectionTitle>
      {[
        { cmd: "# Click 'Fork' on GitHub.com", desc: "STEP 1 — Create your own copy on GitHub", detail: "Fork creates a full copy of the repo under YOUR account. You have full write access to your fork.", example: "📋 Photocopying a book so you can write in the margins" },
        { cmd: "git clone https://github.com/YOU/forked-repo.git", desc: "STEP 2 — Clone YOUR fork locally", detail: "Clone your fork, not the original. You'll push to your fork and open PRs from there.", example: "🏠 Taking your photocopy home to work on" },
        { cmd: "git remote add upstream https://github.com/ORIGINAL/repo.git", desc: "STEP 3 — Track the original repo", detail: "Add 'upstream' remote pointing to the original. This lets you sync with the original project's updates.", example: "🔗 Staying connected to the source library" },
        { cmd: "git fetch upstream && git merge upstream/main", desc: "STEP 4 — Sync with original (do regularly!)", detail: "Before starting new work, always sync. The original project may have moved forward significantly.", example: "📥 Importing the latest updates from the source" },
        { cmd: "git switch -c fix/my-contribution", desc: "STEP 5 — Create a feature branch", detail: "Never work on main directly — always branch. This keeps your fork clean and PRs focused.", example: "🌿 Your personal workspace for this contribution" },
        { cmd: "git push origin fix/my-contribution", desc: "STEP 6 — Push to YOUR fork", detail: "Push to your fork (origin), not upstream. Then open a PR from your fork's branch to the original's main.", example: "☁️ Publishing your annotated copy" },
        { cmd: "# On GitHub: your fork → New PR → base: original/main", desc: "STEP 7 — Open PR to original repo", detail: "Select base repository = original, base = main. Head repository = your fork. Write a clear description.", example: "🌍 Contributing to open source! You just made the world better." },
      ].map((c, i) => (
        <div key={i} style={{ position: "relative", paddingLeft: 26 }}>
          {i < 6 && (
            <div style={{ position: "absolute", left: 5, top: 38, width: 2, height: "calc(100% + 2px)", background: T.timelineGradientTeal }} />
          )}
          <div style={{ position: "absolute", left: 0, top: 16, width: 12, height: 12, borderRadius: "50%", background: T.teal, border: `2px solid ${T.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: T.bg, fontWeight: 700 }}>
            {i + 1}
          </div>
          <CommandCard index={i} {...c} />
        </div>
      ))}
    </div>
  );
}
