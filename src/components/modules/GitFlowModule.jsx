import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

const FLOW_STEPS = [
  {
    title: "Start From Main",
    cmd: "git switch main && git pull",
    note: "Sync your local main before creating any feature branch.",
  },
  {
    title: "Create Feature Branch",
    cmd: "git switch -c feature/user-dashboard",
    note: "Create an isolated branch for your new work.",
  },
  {
    title: "Commit Progress",
    cmd: 'git add . && git commit -m "feat: add dashboard layout"',
    note: "Snapshot your work in small, logical commits.",
  },
  {
    title: "Push Branch",
    cmd: "git push -u origin feature/user-dashboard",
    note: "Publish your branch so teammates and CI can see it.",
  },
  {
    title: "Open Pull Request",
    cmd: "GitHub: Compare & Pull Request",
    note: "Request review and link related issues.",
  },
  {
    title: "Address Review",
    cmd: "Push follow-up commits",
    note: "Apply feedback and push updates to the same PR.",
  },
  {
    title: "Merge To Main",
    cmd: "GitHub: Squash & Merge",
    note: "After approvals and checks pass, merge safely.",
  },
  {
    title: "Cleanup",
    cmd: "git switch main && git pull && git branch -d feature/user-dashboard",
    note: "Sync main and delete the completed feature branch.",
  },
];

function GitFlowSimulator({ isMobile }) {
  const [stepIndex, setStepIndex] = usePageState("stepIndex", 0);
  const [log, setLog] = usePageState("log", ["Simulator ready. Click Run Step to start Git Flow."]);

  const done = stepIndex >= FLOW_STEPS.length;
  const currentStep = done ? null : FLOW_STEPS[stepIndex];

  const runStep = () => {
    if (done) return;
    const step = FLOW_STEPS[stepIndex];
    setLog((l) => [`✓ ${step.title}: ${step.cmd}`, ...l]);
    setStepIndex((s) => s + 1);
  };

  const reset = () => {
    setStepIndex(0);
    setLog(["Simulator reset. Ready to run from main again."]);
  };

  const branchState = {
    main: stepIndex >= 7 ? "updated" : "stable",
    feature: stepIndex >= 1 && stepIndex < 8 ? "active" : "closed",
    pr: stepIndex >= 4 && stepIndex < 7 ? "open" : stepIndex >= 7 ? "merged" : "not-opened",
  };

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
      <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>
        GIT FLOW SIMULATOR
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
          <div style={{ color: T.subtleText, fontSize: 11, marginBottom: 6 }}>
            Step {Math.min(stepIndex + 1, FLOW_STEPS.length)} / {FLOW_STEPS.length}
          </div>
          {currentStep ? (
            <>
              <div style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{currentStep.title}</div>
              <code style={{ color: T.green, fontFamily: "monospace", fontSize: 12 }}>{currentStep.cmd}</code>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 8 }}>{currentStep.note}</div>
            </>
          ) : (
            <div style={{ color: T.green, fontSize: 13, fontWeight: 700 }}>All steps completed. Git Flow successful.</div>
          )}
        </div>

        <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 10 }}>
          <div style={{ color: T.subtleText, fontSize: 11, marginBottom: 6 }}>Live Branch State</div>
          <div style={{ color: T.text, fontSize: 11, lineHeight: 1.8, fontFamily: "monospace" }}>
            main: <span style={{ color: branchState.main === "updated" ? T.green : T.blue }}>{branchState.main}</span>
            <br />
            feature/user-dashboard: <span style={{ color: branchState.feature === "active" ? T.amber : T.muted }}>{branchState.feature}</span>
            <br />
            pull-request: <span style={{ color: branchState.pr === "open" ? T.blue : branchState.pr === "merged" ? T.green : T.muted }}>{branchState.pr}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={runStep} disabled={done} style={{ background: done ? T.selectionBgInactive : T.greenBgMedium, border: `1px solid ${done ? T.border : T.greenBorderMedium}`, borderRadius: 7, color: done ? T.muted : T.green, fontSize: 12, padding: "8px 14px", cursor: done ? "default" : "pointer" }}>
          Run Step
        </button>
        <button onClick={reset} style={{ background: T.resetBg, border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, fontSize: 12, padding: "8px 14px", cursor: "pointer" }}>
          Reset
        </button>
      </div>

      <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 7 }}>
        ACTION LOG
      </div>
      <div style={{ background: T.terminalBg, borderRadius: 6, padding: 8, maxHeight: 130, overflowY: "auto" }}>
        {log.slice(0, 10).map((line, i) => (
          <div key={i} style={{ color: i === 0 ? T.subtleText : T.muted, fontSize: 10.5, fontFamily: "monospace", lineHeight: 1.7 }}>
            {i === 0 ? "→ " : ""}
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GitFlowModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🔄" title="Git Flow — The Professional Ritual" color={T.teal}>
        Git Flow is a <strong style={{ color: T.teal }}>branching strategy</strong> — a set of
        rules about how branches are named and when they're created. It's not a git command,
        it's a workflow discipline used by professional teams. The core principle:{" "}
        <strong>main is always deployable</strong>. All work happens on branches.
      </InfoBox>
      <SectionTitle>🎮 Interactive Git Flow Simulator</SectionTitle>
      <GitFlowSimulator isMobile={isMobile} />
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        { cmd: "git switch main && git pull", desc: "Start from updated main", detail: "Always sync your local main before creating new feature branches.", example: "🏁 Begin from the latest checkpoint" },
        { cmd: "git switch -c feature/user-dashboard", desc: "Create a feature branch", detail: "Branch off for isolated work so main stays clean and deployable.", example: "🌿 Start your parallel work lane" },
        { cmd: 'git add . && git commit -m "feat: add dashboard layout"', desc: "Commit your feature work", detail: "Create small, focused commits so reviews and rollbacks are easier.", example: "📸 Save progress in snapshots" },
        { cmd: "git push -u origin feature/user-dashboard", desc: "Push branch to GitHub", detail: "Publish your branch for collaboration and CI checks.", example: "☁️ Share your branch with the team" },
        { cmd: "# GitHub.com → Compare & Pull Request", desc: "Open a PR", detail: "Create a pull request with context, screenshots, and linked issues.", example: "🤝 Request review from teammates" },
        { cmd: "# Address review comments with new commits", desc: "Iterate on feedback", detail: "Push follow-up commits to the same branch until reviewers approve.", example: "🔧 Improve based on review" },
        { cmd: "# Click Merge on GitHub (Squash & Merge)", desc: "Merge when approved", detail: "Squash merge keeps main history compact and readable.", example: "🔀 Bring feature into main" },
        { cmd: "git switch main && git pull", desc: "Sync local main after merge", detail: "Update your local main with the merged changes from remote.", example: "⬇️ Pull merged timeline" },
        { cmd: "git branch -d feature/user-dashboard", desc: "Delete completed feature branch", detail: "Clean up local branches once work is merged.", example: "🧹 Keep your repo tidy" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}



