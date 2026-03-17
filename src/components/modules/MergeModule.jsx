import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard } from "../shared";

function MergeSimulator() {
  const [mode, setMode] = useState("idle");
  const [file, setFile] = useState("");
  const [mergeLog, setMergeLog] = useState([]);

  const triggerMerge = () => {
    setMode("conflict");
    setMergeLog(["Merging feature/login into main...", "CONFLICT (content): Merge conflict in src/auth.js", "Automatic merge failed; fix conflicts and then commit."]);
    setFile(`function login(user) {
<<<<<<< HEAD (main)
  return db.findUser(user.email);
=======
  return api.authenticateUser(user.email, user.password);
>>>>>>> feature/login
}`);
  };

  const resolve = () => {
    setFile(`function login(user) {
  return api.authenticateUser(user.email, user.password);
}`);
    setMode("resolved");
    setMergeLog((l) => [...l, "", "✓ Conflict resolved — edit done", "Run: git add src/auth.js && git commit"]);
  };

  const finish = () => {
    setMode("done");
    setMergeLog((l) => [...l, "[main a3f2b1c] Merge branch 'feature/login'", "✓ Successfully merged!"]);
  };

  return (
    <div>
      <InfoBox icon="🔀" title="Merge vs Rebase" color={T.purple}>
        <strong style={{ color: T.green }}>Merge</strong> creates a new "merge commit" that ties two branch histories together — it's non-destructive and preserves the full story.<br /><br />
        <strong style={{ color: T.blue }}>Rebase</strong> rewrites your commits as if you wrote them on top of the target branch — creates a cleaner linear history but rewrites commit hashes.<br /><br />
        <strong>Rule of thumb:</strong> Merge for shared/public branches. Rebase for your own local feature branches.
      </InfoBox>

      <ConceptDiagram>{`  MERGE                               REBASE
                                          
  main:    A─B─C─────M                main:    A─B─C
                ╲   ╱                                ╲
  feat:    A─B─D─E                    feat:    D'─E'  (replayed on top)
                   ↑                                    
               merge commit                  linear history ✓`}</ConceptDiagram>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 12 }}>⚡ CONFLICT RESOLUTION SIMULATOR</div>

        {mode === "idle" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>Two branches edited the same line. See what a conflict looks like — and how to fix it.</div>
            <button onClick={triggerMerge} style={{ background: "rgba(167,139,250,.12)", border: "1px solid rgba(167,139,250,.3)", borderRadius: 8, color: T.purple, fontSize: 13, padding: "10px 28px", cursor: "pointer" }}>
              🔀 Simulate: git merge feature/login
            </button>
          </div>
        )}

        {(mode === "conflict" || mode === "resolved") && (
          <div>
            <div style={{ background: "#050b13", border: `1px solid ${mode === "conflict" ? "rgba(248,113,113,.3)" : "rgba(74,222,128,.3)"}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ color: mode === "conflict" ? T.red : T.green, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                {mode === "conflict" ? "⚠️ src/auth.js — CONFLICT DETECTED" : "✓ src/auth.js — CONFLICT RESOLVED"}
              </div>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: "#94a3b8", lineHeight: 1.7, overflowX: "auto" }}>
                {file.split("\n").map((line, i) => (
                  <div key={i} style={{ color: line.startsWith("<<<<") ? "#f87171" : line.startsWith("====") ? "#fbbf24" : line.startsWith(">>>>") ? "#60a5fa" : line.startsWith("+") ? "#4ade80" : "#94a3b8" }}>
                    {line}
                  </div>
                ))}
              </pre>
            </div>
            {mode === "conflict" && (
              <button onClick={resolve} style={{ background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 7, color: T.green, fontSize: 12, padding: "9px 20px", cursor: "pointer", marginRight: 8 }}>
                ✓ Choose feature/login version (keep API auth)
              </button>
            )}
            {mode === "resolved" && (
              <button onClick={finish} style={{ background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 7, color: T.purple, fontSize: 12, padding: "9px 20px", cursor: "pointer" }}>
                📸 git add . && git commit (finish merge)
              </button>
            )}
          </div>
        )}

        {mode === "done" && <div style={{ color: T.green, textAlign: "center", fontSize: 14, padding: "16px 0" }}>🎉 Merge complete! The timelines are unified.</div>}

        {mergeLog.length > 0 && (
          <div style={{ background: "#050b13", borderRadius: 6, padding: 10, marginTop: 12 }}>
            {mergeLog.map((l, i) => (
              <div key={i} style={{ fontFamily: "monospace", fontSize: 11, color: l.startsWith("✓") || l.startsWith("[") ? "#34d399" : l.startsWith("CONFLICT") || l.startsWith("Automatic") ? "#f87171" : "#64748b", lineHeight: 1.7 }}>{l}</div>
            ))}
          </div>
        )}

        {mode === "done" && (
          <button onClick={() => { setMode("idle"); setMergeLog([]); setFile(""); }} style={{ display: "block", margin: "12px auto 0", background: "rgba(30,41,59,.5)", border: "1px solid #1a2540", borderRadius: 6, color: T.muted, fontSize: 11, padding: "5px 14px", cursor: "pointer" }}>Reset</button>
        )}
      </div>
    </div>
  );
}

export default function MergeModule() {
  return (
    <div>
      <InfoBox icon="🔀" title="Merge vs Rebase — what's the difference?" color={T.blue}>
        Both bring changes from one branch into another.{" "}
        <strong style={{ color: T.blue }}>Merge</strong> creates a new "merge commit" that
        joins the two timelines — history is preserved exactly as it happened.{" "}
        <strong style={{ color: T.purple }}>Rebase</strong> rewrites your commits as if you
        had started from the latest point of the target branch — cleaner, linear history.
        <br /><br />
        <strong style={{ color: T.amber }}>Rule of thumb:</strong> merge for shared branches
        (safe, preserves truth), rebase for your own feature branches before opening a PR.
      </InfoBox>
      <InfoBox icon="⚡" title="Merge conflicts are normal — not scary" color={T.amber}>
        A conflict happens when two people edit the same line of the same file. Git marks the
        sections clearly with <code style={{ color: T.red }}>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>{" "}
        and <code style={{ color: T.green }}>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> markers. You
        read both, pick the right one, then commit.
      </InfoBox>
      <SectionTitle>🔀 Merge Conflict Simulator</SectionTitle>
      <MergeSimulator />
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        { cmd: "git merge feature/login", desc: "Merge a branch into current branch", detail: "Git finds the common ancestor, then combines the changes. If no conflicts = auto-merged. If conflicts = you resolve manually.", example: "Pulling in all the good work from a parallel universe 🔀" },
        { cmd: "git merge --no-ff feature/x", desc: "Force a merge commit even if fast-forward possible", detail: "Fast-forward = just move the pointer. --no-ff = always create a merge commit, preserving that this was once a separate branch.", example: "Insisting on a ceremony marker even for simple merges 🎗️" },
        { cmd: "git merge --squash feature/x", desc: "Compress all branch commits into one staged change", detail: "Takes all commits on the branch and combines them into a single staged change. You then write one clean commit message.", example: "Summarising a whole chapter into a single sentence 📚" },
        { cmd: "git rebase main", desc: "Replay your commits on top of main", detail: "Re-applies your commits as if you started from main's latest commit. Creates clean linear history. New commit hashes are created.", example: "Rewriting history to look like you always worked on the latest ✨", warning: "Never rebase branches others are working on — it rewrites hashes and breaks their history." },
        { cmd: "git rebase -i HEAD~3", desc: "Interactively edit last 3 commits", detail: "Opens an editor listing last N commits. Options: pick (keep), squash (merge into previous), reword (edit message), drop (delete).", example: "Time editing — rearranging the chapters of your story ✂️" },
        { cmd: "git cherry-pick abc1234", desc: "Apply one specific commit to current branch", detail: "Creates a new commit on current branch with the same changes as abc1234, but a new hash. Great for backporting fixes.", example: "Cherry-picking the one perfect scene from another film 🍒" },
        { cmd: "git merge --abort", desc: "Cancel a merge in progress", detail: "Returns everything to the pre-merge state. Use when you triggered a merge by accident.", example: "Pressing the emergency stop 🛑" },
        { cmd: "git stash", desc: "Temporarily shelve uncommitted changes", detail: "Saves all staged + unstaged changes to a stack, then cleans your working directory.", example: "Putting your WIP work in a drawer before switching tasks 🗄️" },
        { cmd: "git stash pop", desc: "Restore last stash and remove it", detail: "Applies the most recent stash to your working directory. If there are conflicts, you resolve them normally.", example: "Pulling your in-progress work back out of the drawer 📤" },
        { cmd: "git stash list", desc: "See all stashed entries", detail: "Shows stash@{0}, stash@{1} etc. You can apply any of them with 'git stash apply stash@{N}'.", example: "" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
