import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

const MOCK_FILES = [
  { name: "src/App.jsx", status: "modified" },
  { name: "src/auth.js", status: "new" },
  { name: "README.md", status: "modified" },
  { name: "package.json", status: "modified" },
  { name: "src/utils.js", status: "deleted" },
];

function StagingSimulator({ isMobile }) {
  const [files, setFiles] = useState(MOCK_FILES.map((f) => ({ ...f, staged: false })));
  const [committed, setCommitted] = useState([]);
  const [msg, setMsg] = useState("");
  const [phase, setPhase] = useState("working");

  const unstaged = files.filter((f) => !f.staged);
  const staged = files.filter((f) => f.staged);

  const stageFile = (name) =>
    setFiles((fs) => fs.map((f) => (f.name === name ? { ...f, staged: true } : f)));
  const stageAll = () => setFiles((fs) => fs.map((f) => ({ ...f, staged: true })));
  const unstage = (name) =>
    setFiles((fs) => fs.map((f) => (f.name === name ? { ...f, staged: false } : f)));

  const doCommit = () => {
    if (!msg.trim() || staged.length === 0) return;
    const id = Math.random().toString(36).slice(2, 9);
    setCommitted((c) => [
      { id, msg: msg.trim(), files: staged.map((f) => f.name), time: new Date().toLocaleTimeString() },
      ...c,
    ]);
    setFiles((fs) => fs.filter((f) => !f.staged));
    setMsg("");
    setPhase("committed");
    setTimeout(() => setPhase("working"), 2000);
  };

  const reset = () => {
    setFiles(MOCK_FILES.map((f) => ({ ...f, staged: false })));
    setCommitted([]);
    setMsg("");
    setPhase("working");
  };

  const statusColors = { modified: T.amber, new: T.green, deleted: T.red };
  const statusLabels = { modified: "M", new: "A", deleted: "D" };

  return (
    <div>
      <InfoBox icon="🎬" title="How the Three Areas Work" color={T.blue}>
        Git has <strong style={{ color: T.blue }}>3 areas</strong>: your{" "}
        <strong style={{ color: T.amber }}>Working Directory</strong> (files you're editing),
        the <strong style={{ color: T.green }}>Staging Area</strong> (selected changes ready
        to snapshot), and the <strong style={{ color: T.purple }}>Repository</strong>{" "}
        (permanent commit history). <code style={{ color: T.green }}>git add</code> moves
        files to staging. <code style={{ color: T.green }}>git commit</code> snapshots
        staging into the repo.
      </InfoBox>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {/* Working Dir */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.amber, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>📁 WORKING DIR</div>
          {unstaged.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>✓ Nothing to stage</div>
          ) : (
            unstaged.map((f) => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: statusColors[f.status], fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 14 }}>{statusLabels[f.status]}</span>
                <span style={{ color: T.subtleText, fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button onClick={() => stageFile(f.name)} style={{ background: T.greenBgMedium, border: `1px solid ${T.greenBorderLight}`, borderRadius: 4, color: T.green, fontSize: 10, padding: "2px 7px", cursor: "pointer" }}>add →</button>
              </div>
            ))
          )}
          {unstaged.length > 0 && (
            <button onClick={stageAll} style={{ width: "100%", background: T.greenBgLight, border: `1px solid ${T.greenBorderLight}`, borderRadius: 6, color: T.green, fontSize: 11, padding: "6px", cursor: "pointer", marginTop: 6 }}>
              git add . (stage all)
            </button>
          )}
        </div>
        {/* Staging Area */}
        <div style={{ background: T.card, border: `1px solid ${staged.length > 0 ? T.greenBorderStrong : T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.green, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>📦 STAGING AREA</div>
          {staged.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>Use "add →" to stage files</div>
          ) : (
            staged.map((f) => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: T.green, fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 14 }}>✓</span>
                <span style={{ color: T.subtleText, fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button onClick={() => unstage(f.name)} style={{ background: T.redBgMedium, border: `1px solid ${T.redBorderLight}`, borderRadius: 4, color: T.red, fontSize: 10, padding: "2px 7px", cursor: "pointer" }}>← undo</button>
              </div>
            ))
          )}
          {staged.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="feat: describe your change"
                style={{ width: "100%", background: T.inputBgFaint, border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 11, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
                onKeyDown={(e) => e.key === "Enter" && doCommit()} />
              <button onClick={doCommit} disabled={!msg.trim()} style={{ width: "100%", marginTop: 6, background: msg.trim() ? T.purpleBgMedium : T.cardBgInactive, border: `1px solid ${msg.trim() ? T.purpleBorderLight : T.border}`, borderRadius: 6, color: msg.trim() ? T.purple : T.muted, fontSize: 11, padding: "7px", cursor: msg.trim() ? "pointer" : "default", transition: "all .2s" }}>
                {`git commit -m "${msg.trim() || "..."}"`}
              </button>
            </div>
          )}
        </div>
        {/* Repository */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.purple, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>🏛️ REPOSITORY</div>
          {committed.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>Commits appear here</div>
          ) : (
            committed.map((c) => (
              <div key={c.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ color: T.purple, fontFamily: "monospace", fontSize: 10 }}>{c.id}</span>
                  <span style={{ color: T.muted, fontSize: 10 }}>{c.time}</span>
                </div>
                <div style={{ color: T.subtleText, fontSize: 11, marginBottom: 4 }}>{c.msg}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {c.files.map((f) => (
                    <span key={f} style={{ background: T.purpleBgLight, border: `1px solid ${T.purpleBorderLight}`, borderRadius: 3, fontSize: 9, color: T.purple, padding: "1px 5px" }}>
                      {f.split("/").pop()}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
          {phase === "committed" && (
            <div style={{ color: T.green, fontSize: 11, textAlign: "center", animation: "fadeIn .3s" }}>
              ✓ Committed!
            </div>
          )}
        </div>
      </div>
      {committed.length > 0 && files.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 8, marginBottom: 4 }}>
          <button onClick={reset} style={{ background: T.resetBg, border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, fontSize: 11, padding: "7px 20px", cursor: "pointer" }}>
            ↺ Reset Simulator
          </button>
        </div>
      )}
    </div>
  );
}

export default function StagingModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="📦" title="What is the staging area?" color={T.green}>
        Most beginners think git works like this:{" "}
        <strong style={{ color: T.amber }}>edit file → save → commit</strong>. But Git adds
        a middle step called the <strong style={{ color: T.green }}>staging area</strong>{" "}
        (also called the index). It's a preparation zone where you choose exactly which
        changes go into your next commit.
        <br /><br />
        Why does this matter? Imagine you fixed a bug AND added a new feature in the same
        session. Without staging, you'd have to commit everything together — messy. With
        staging, you commit the bug fix first, then the feature separately. Clean,
        professional history.
      </InfoBox>
      <InfoBox icon="🛒" title="The grocery store analogy" color={T.teal}>
        Think of your project like a grocery store. All your files are items on the shelves,
        and whenever you make changes, it is like picking items you might want to buy. Staging
        in Git (<code style={{ color: T.green }}>git add</code>) is like putting those items
        into your shopping cart. You can walk around and pick up many things, but only the
        items in your cart are actually ready to be purchased. When you run{" "}
        <code style={{ color: T.amber }}>git commit</code>, it is like going to the checkout
        and paying. You get a receipt that records exactly what was in your cart. So staging is
        simply choosing which changes you want to include in your next commit.
      </InfoBox>
      <SectionTitle>🎬 Interactive Simulator</SectionTitle>
      <StagingSimulator isMobile={isMobile} />
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        { cmd: "git status", desc: "See all changes in your working directory", detail: "Shows 3 categories: Untracked (new files), Modified (changed files), Staged (ready to commit). Your project health checkup.", example: "Looking in a mirror before leaving the house 🪞" },
        { cmd: "git add filename.js", desc: "Stage ONE specific file", detail: "Only that file's changes go into the next commit. Useful for atomic commits.", example: "Selecting one specific photo for the album 📷" },
        { cmd: "git add .", desc: "Stage ALL changes in current directory", detail: "Every modified and new file goes to staging. Quick, but be careful you don't accidentally add secrets!", example: "'Select all' for the photo album 🗂️" },
        { cmd: "git add -p", desc: "Stage specific CHUNKS of a file", detail: "Git shows each changed chunk and asks y/n. Lets you make surgical commits: 'only stage the bugfix, not the debug logs'.", example: "Picking the exact best frame from a photo burst ✂️" },
        { cmd: 'git commit -m "feat: add login"', desc: "Save the snapshot permanently", detail: "Creates an immutable commit object with: your changes, message, timestamp, author, and a pointer to the parent commit.", example: "Taking the photograph and writing the caption on the back 📸" },
        { cmd: "git commit --amend", desc: "Edit the last commit", detail: "Replace the last commit's message or add forgotten changes. Creates a NEW commit hash — don't use on pushed commits!", example: "Correcting the caption on the photo you just took ✏️", warning: "Never amend commits you've already pushed to a shared branch!" },
        { cmd: "git log --oneline --graph --all", desc: "Visual commit history tree", detail: "--oneline=compact, --graph=ASCII branch lines, --all=show all branches. Your best friend for understanding history.", example: "The family album with a family tree showing who came from whom 📖" },
        { cmd: "git diff", desc: "Show unstaged changes line-by-line", detail: "Red lines = removed, Green lines = added. Shows what's different between your working directory and the last commit.", example: "Comparing two versions of a letter side by side 📄" },
        { cmd: "git diff --staged", desc: "Show what IS staged (ready to commit)", detail: "Same as diff but shows the staging area vs last commit. See exactly what your next commit will contain.", example: "" },
        { cmd: "git restore filename.js", desc: "Discard unstaged changes to a file", detail: "⚠️ Dangerous — this THROWS AWAY your changes! Use to revert a file to its last committed state.", example: "Throwing away your photo and taking a fresh one 🗑️", warning: "This permanently discards your local changes. Cannot be undone!" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
