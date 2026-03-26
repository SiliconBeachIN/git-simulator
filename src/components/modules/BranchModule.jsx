import { useState } from "react";
import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import { Badge, InfoBox, SectionTitle, CommandCard } from "../shared";
import { useTranslation } from "react-i18next";
import Tr from "../shared/Tr";

function getBranchNameError(name, branches) {
  const n = name.trim();
  if (!n) return "";
  if (/\s/.test(n)) return "Branch name cannot contain spaces.";
  if (!/^[A-Za-z0-9._/-]+$/.test(n)) return "Use only letters, numbers, ., _, -, and /.";
  if (n.startsWith("/") || n.endsWith("/")) return "Branch name cannot start or end with '/'.";
  if (n.includes("..") || n.includes("@{") || n.includes("\\")) return "Branch name contains invalid Git characters.";
  if (n.endsWith(".lock")) return "Branch name cannot end with '.lock'.";
  if (branches.some((b) => b.name === n)) return "A branch with this name already exists.";
  return "";
}

function BranchSimulator({ isMobile }) {
  const [branches, setBranches] = usePageState("branches", [
    { name: "main", commits: ["c0a1", "d4b2", "e9f3"], color: T.green, current: false },
    { name: "develop", commits: ["c0a1", "d4b2", "a1b2"], color: T.blue, current: true },
  ]);
  const [newName, setNewName] = useState("");
  const [log, setLog] = usePageState("log", ["Switched to branch 'develop'"]);

  const current = branches.find((b) => b.current) ?? branches[0];
  const branchNameError = getBranchNameError(newName, branches);
  const canCreateBranch = Boolean(newName.trim()) && !branchNameError;

  const addBranch = () => {
    const n = newName.trim();
    const error = getBranchNameError(n, branches);
    if (!n || error) {
      if (error) setLog((l) => [`Branch create failed: ${error}`, ...l]);
      return;
    }
    const base = current.commits;
    setBranches((bs) => [...bs, { name: n, commits: [...base], color: T.purple, current: false }]);
    setLog((l) => [`Branch '${n}' created from '${current.name}'`, ...l]);
    setNewName("");
  };

  const switchBranch = (name) => {
    if (name === current.name) return;
    setBranches((bs) => bs.map((b) => ({ ...b, current: b.name === name })));
    setLog((l) => [`Switched to branch '${name}'`, ...l]);
  };

  const addCommit = () => {
    const id = Math.random().toString(36).slice(2, 7);
    setBranches((bs) => bs.map((b) => (b.current ? { ...b, commits: [...b.commits, id] } : b)));
    setLog((l) => [`[${current.name}] Committed ${id} — changes saved`, ...l]);
  };

  const deleteBranch = (name) => {
    if (name === "main" || name === current.name) return;
    setBranches((bs) => bs.filter((b) => b.name !== name));
    setLog((l) => [`Branch '${name}' deleted`, ...l]);
  };

  return (
    <div>
      <InfoBox icon="🌿" title="What is a Branch?" color={T.green}>
        A branch is just a <strong style={{ color: T.green }}>lightweight pointer</strong> to
        a specific commit. Creating a branch costs almost nothing — it's just a 41-byte file.
        When you commit on a branch, that pointer moves forward.{" "}
        <code style={{ color: T.green }}>main</code> is the default branch. Feature branches
        let you experiment without touching <code style={{ color: T.green }}>main</code>.
      </InfoBox>

      <div
        style={{
          background: T.blueBgLight,
          border: `1px solid ${T.blueBorderLight}`,
          borderRadius: 10,
          padding: isMobile ? 12 : 14,
          marginBottom: 12,
        }}
      >
          <div style={{ color: T.blue, fontSize: 12, fontWeight: 700, marginBottom: 7 }}>
            <Tr>How To Use This Simulator</Tr>
          </div>
        <div style={{ color: T.subtleText, fontSize: 12, lineHeight: 1.7 }}>
          1. Create a branch using the name box and + Branch.
          <br />
          2. Click switch on a branch to move HEAD to that branch.
          <br />
          3. Click git commit to add new changes only to the current branch.
          <br />
          4. Use the GIT LOG panel to see actions in real time.
        </div>
      </div>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 10 }}><Tr>BRANCHES</Tr></div>

      {/* Branch visual */}
      <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 14, overflowX: "auto" }}>
        <svg width={Math.max(500, branches.reduce((m, b) => Math.max(m, b.commits.length), 0) * 70 + 60)} height={branches.length * 54 + 30}>
          {branches.map((b, bi) => {
            const y = bi * 54 + 30;
            return (
              <g key={b.name}>
                {b.commits.length > 1 && <line x1={40} y1={y} x2={40 + (b.commits.length - 1) * 60} y2={y} stroke={b.color} strokeWidth="2" opacity=".35" />}
                {b.commits.map((c, ci) => (
                  <g key={ci}>
                    <circle cx={40 + ci * 60} cy={y} r={b.current && ci === b.commits.length - 1 ? 12 : 9} fill={b.color} opacity={b.current && ci === b.commits.length - 1 ? 1 : 0.7} />
                    <circle cx={40 + ci * 60} cy={y} r={4} fill={T.terminalBg} />
                    <text x={40 + ci * 60} y={y + 22} textAnchor="middle" fill={T.muted} fontSize="9" fontFamily="monospace">{c}</text>
                  </g>
                ))}
                <rect x={40 + (b.commits.length - 1) * 60 + 18} y={y - 11} width={b.name.length * 7 + 14} height={22} rx="4" fill={`${b.color}20`} stroke={b.color} strokeWidth="1" />
                <text x={40 + (b.commits.length - 1) * 60 + 25} y={y + 4} fill={b.color} fontSize="10" fontFamily="monospace" fontWeight="bold">{b.name}</text>
                {b.current && <text x={40 + (b.commits.length - 1) * 60 + 25} y={y - 16} fill={T.amber} fontSize="9" fontFamily="monospace">HEAD →</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>BRANCHES</div>
          <div style={{ color: T.subtleText, fontSize: 10, marginBottom: 10 }}>
            Tip: switch moves HEAD, del removes non-current branches.
          </div>
          {branches.map((b) => (
            <div key={b.name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
              <span style={{ flex: 1, color: b.current ? T.text : T.muted, fontSize: 12, fontFamily: "monospace" }}>{b.name}</span>
              {b.current && <Badge color={T.amber}>current</Badge>}
              {!b.current && <button onClick={() => switchBranch(b.name)} style={{ background: T.blueBgLight, border: `1px solid ${T.blueBorderLight}`, borderRadius: 4, color: T.blue, fontSize: 10, padding: "2px 7px", cursor: "pointer" }}><Tr>switch</Tr></button>}
              {b.name !== "main" && !b.current && <button onClick={() => deleteBranch(b.name)} style={{ background: T.redBgLight, border: `1px solid ${T.redBorderLight}`, borderRadius: 4, color: T.red, fontSize: 10, padding: "2px 7px", cursor: "pointer" }}><Tr>del</Tr></button>}
            </div>
          ))}
          <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="new-branch-name" onKeyDown={(e) => e.key === "Enter" && addBranch()}
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={"new-branch-name"} onKeyDown={(e) => e.key === "Enter" && addBranch()}
              style={{ flex: 1, background: T.inputBgDark, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 9px", color: T.text, fontSize: 11, outline: "none", fontFamily: "monospace" }} />
            <button onClick={addBranch} disabled={!canCreateBranch} style={{ background: canCreateBranch ? T.greenBgMedium : T.selectionBgInactive, border: `1px solid ${canCreateBranch ? T.greenBorderMedium : T.border}`, borderRadius: 6, color: canCreateBranch ? T.green : T.muted, fontSize: 11, padding: "6px 10px", cursor: canCreateBranch ? "pointer" : "default" }}><Tr>+ Branch</Tr></button>
          </div>
          {branchNameError && <div style={{ color: T.red, fontSize: 10, marginTop: 7 }}>{branchNameError}</div>}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>ACTIONS ON: <span style={{ color: T.green }}>{current.name}</span></div>
          <button onClick={addCommit} style={{ width: "100%", background: T.greenBgLight, border: `1px solid ${T.greenBorderLight}`, borderRadius: 7, color: T.green, fontSize: 12, padding: "10px", cursor: "pointer", marginBottom: 8 }}>
            📸 git commit (add changes to current branch)
          </button>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginTop: 12, marginBottom: 8 }}>GIT LOG</div>
          <div style={{ background: T.terminalBg, borderRadius: 6, padding: 8, height: 80, overflowY: "auto", scrollbarWidth: "thin" }}>
            {log.slice(0, 8).map((l, i) => (
              <div key={i} style={{ color: i === 0 ? T.subtleText : T.muted, fontSize: 10, fontFamily: "monospace", lineHeight: 1.7 }}>
                {i === 0 ? "→ " : ""}{l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BranchModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🌿" title="Why do branches exist?" color={T.green}>
        Imagine you're writing a book and a publisher asks for two different endings. Without
        branches, you'd have to make a full copy of the entire manuscript for each ending.
        That's exactly what older version control systems did — slow and storage-heavy.
        <br /><br />
        Git branches are instant and weightless — just a pointer to a commit. You can spin up
        a branch, try something risky, and throw it away if it doesn't work.{" "}
        <strong style={{ color: T.green }}>The rule: never work directly on main.</strong>
      </InfoBox>
      <SectionTitle>🌿 Interactive Branch Simulator</SectionTitle>
      <BranchSimulator isMobile={isMobile} />
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        { cmd: "git branch", desc: "List all local branches (* = current)", detail: "Shows every local branch. The asterisk marks HEAD — where you currently are.", example: "Seeing all your parallel universes listed 🌌" },
        { cmd: "git branch -a", desc: "List ALL branches (local + remote)", detail: "Also shows origin/main, origin/feature-xyz etc. Use after git fetch to see new remote branches.", example: "All universes, including the cloud ones ☁️" },
        { cmd: "git switch -c feature/login", desc: "Create AND switch to new branch (modern)", detail: "Combines branch creation + checkout. -c = create. This is the modern preferred way (Git 2.23+).", example: "Splitting reality and stepping into the new universe 🚪" },
        { cmd: "git checkout -b feature/login", desc: "Create AND switch (classic way)", detail: "Older syntax, still works everywhere. Most tutorials use this. Identical result to 'switch -c'.", example: "The classic way to split timelines 🎯" },
        { cmd: "git switch main", desc: "Switch to an existing branch", detail: "Moves HEAD to that branch, updates working directory to match. Uncommitted changes may carry over or cause conflict.", example: "Stepping back into the main timeline 🚶" },
        { cmd: "git branch -d feature/done", desc: "Delete a merged branch (safe)", detail: "Only deletes if branch is fully merged into current branch. Git refuses if work would be lost — safe by default.", example: "Closing a completed parallel timeline 🗑️" },
        { cmd: "git branch -D feature/oops", desc: "Force delete (even if unmerged)", detail: "Deletes regardless of merge status. Use with care — work on this branch will be lost (but reflog can recover it).", example: "Erasing a timeline that shouldn't exist", warning: "Unmerged commits on this branch will be lost! Recover with git reflog if needed." },
        { cmd: "git branch -m old new", desc: "Rename a branch", detail: "Rename locally. If you've pushed this branch, also run: git push origin --delete old && git push -u origin new", example: "Renaming your parallel universe 📝" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}



