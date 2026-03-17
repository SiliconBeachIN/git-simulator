import { useState } from "react";
import T from "../../constants/tokens";
import { Badge, InfoBox, ConceptDiagram, SectionTitle, CommandCard } from "../shared";

function PRSimulator() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "🌿", label: "Branch pushed", desc: "git push -u origin feature/user-auth" },
    { icon: "📝", label: "PR Opened", desc: "GitHub shows diff, you write description" },
    { icon: "👀", label: "Code Review", desc: "Teammates leave comments, request changes" },
    { icon: "🔧", label: "Address feedback", desc: "git commit + push fixes — PR auto-updates" },
    { icon: "✅", label: "Approved", desc: "Reviewer approves — checks all pass" },
    { icon: "🔀", label: "Merged", desc: "Squash & merge → main updated" },
    { icon: "🧹", label: "Cleanup", desc: "Delete feature branch, git pull main" },
  ];
  return (
    <div>
      <InfoBox icon="🤝" title="What is a Pull Request?" color={T.blue}>
        A PR is <strong style={{ color: T.blue }}>NOT a git concept</strong> — it's a{" "}
        <strong>GitHub feature</strong>. It's a web-based proposal to merge your branch into
        another. It includes a diff viewer, comment threads, CI status checks, and an approval
        system. This is how professional teams review code before it reaches main.
      </InfoBox>
      <div style={{ position: "relative", paddingLeft: 32 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{ position: "relative", marginBottom: 2, cursor: "pointer" }}>
            {i < steps.length - 1 && (
              <div style={{ position: "absolute", left: -20, top: 36, width: 2, height: "calc(100% + 2px)", background: i < step ? "linear-gradient(to bottom,#4ade80,#60a5fa)" : "#1a2540", transition: "background .3s" }} />
            )}
            <div style={{ position: "absolute", left: -27, top: 14, width: 14, height: 14, borderRadius: "50%", background: i <= step ? T.green : T.border, border: `2px solid ${T.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: T.bg, fontWeight: 700, transition: "all .2s" }}>
              {i < step ? "✓" : i + 1}
            </div>
            <div style={{ background: i === step ? "rgba(74,222,128,.05)" : T.card, border: `1px solid ${i === step ? "rgba(74,222,128,.25)" : T.border}`, borderRadius: 9, padding: "11px 14px", marginBottom: 8, transition: "all .2s" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ color: i === step ? T.text : "#94a3b8", fontWeight: i === step ? 600 : 400, fontSize: 13 }}>{s.label}</span>
                {i < step && <Badge color={T.green}>done</Badge>}
                {i === step && <Badge color={T.amber}>current</Badge>}
              </div>
              {i === step && <div style={{ color: T.muted, fontSize: 12, marginTop: 6, fontFamily: "monospace" }}>{s.desc}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ flex: 1, background: "rgba(30,41,59,.4)", border: `1px solid ${T.border}`, borderRadius: 7, color: step === 0 ? T.muted : T.text, fontSize: 12, padding: 9, cursor: step === 0 ? "default" : "pointer" }}>← Back</button>
        <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} style={{ flex: 1, background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 7, color: step === steps.length - 1 ? T.muted : T.green, fontSize: 12, padding: 9, cursor: step === steps.length - 1 ? "default" : "pointer" }}>Next Step →</button>
      </div>
    </div>
  );
}

export default function PullRequestModule() {
  return (
    <div>
      <SectionTitle>🤝 PR Lifecycle Walkthrough</SectionTitle>
      <PRSimulator />
      <SectionTitle>Writing a Great PR Description</SectionTitle>
      <ConceptDiagram>{`## What does this PR do?
Adds JWT-based user authentication to the API.

## Why?
Users need to sign in to access their saved data (Fixes #42)

## How to test
1. Run: npm install && npm run dev
2. POST /api/auth/login with {"email":"test@x.com","password":"test123"}
3. You receive a token — use it as: Authorization: Bearer <token>

## Checklist
- [x] Tests written and passing
- [x] No API keys committed
- [x] Reviewed own diff before requesting review
- [x] Documentation updated

## Screenshots (if UI change)
| Before | After |
|--------|-------|
| [img]  | [img] |`}</ConceptDiagram>
      <SectionTitle>GitHub CLI — PR Commands</SectionTitle>
      {[
        { cmd: "gh pr create --title 'feat: add auth' --body 'Adds JWT auth'", desc: "Create PR from terminal", detail: "GitHub CLI (gh) lets you create, review, and merge PRs without leaving the terminal.", example: "" },
        { cmd: "gh pr list", desc: "List open PRs", detail: "Shows all open PRs in the current repo.", example: "" },
        { cmd: "gh pr checkout 42", desc: "Checkout a PR branch locally", detail: "Fetches the PR branch and switches to it so you can test the changes.", example: "" },
        { cmd: "gh pr merge 42 --squash", desc: "Merge a PR (squash method)", detail: "Merges PR #42 using squash strategy — all commits become one.", example: "" },
        { cmd: "gh pr review --approve", desc: "Approve a PR from CLI", detail: "Adds your approval to the PR, same as clicking Approve on GitHub.com", example: "" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
