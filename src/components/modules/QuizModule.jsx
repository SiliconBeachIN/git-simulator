import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox } from "../shared";

const QUESTIONS = [
  { q: "What does `git init` create?", opts: ["A GitHub repository", "A hidden .git/ folder", "A branch called main", "A remote connection"], ans: 1, exp: "git init creates a .git/ folder — the database that stores all commits, branches, and history for your project." },
  { q: "What is the staging area?", opts: ["A remote server", "A temporary holding area before committing", "A backup of main branch", "A GitHub feature"], ans: 1, exp: "The staging area (index) holds changes you've 'git add'-ed. Only staged changes become part of the next commit — it's your selection frame." },
  { q: "Which command shows WHO wrote each line of a file?", opts: ["git log --author", "git who", "git blame", "git annotate"], ans: 2, exp: "git blame shows every line of a file annotated with commit hash, author, and date. Perfect for detective work!" },
  { q: "What does `git fetch` do vs `git pull`?", opts: ["They're identical", "fetch downloads only; pull downloads + merges", "pull downloads only; fetch downloads + merges", "fetch deletes remote branches"], ans: 1, exp: "git fetch safely downloads remote data without touching your local branches. git pull = git fetch + git merge." },
  { q: "How do you undo the last commit but KEEP changes staged?", opts: ["git undo", "git reset --soft HEAD~1", "git revert HEAD", "git restore --staged"], ans: 1, exp: "git reset --soft HEAD~1 moves HEAD back one commit but leaves the changes ready to re-commit. Like pressing 'unsend' on an email but keeping the draft." },
  { q: "What is a 'detached HEAD' state?", opts: ["A broken repository", "HEAD points directly to a commit, not a branch", "A merge conflict", "A deleted branch"], ans: 1, exp: "Detached HEAD = you've checked out a specific commit (not a branch). Any new commits won't belong to any branch — they'll be lost if you switch away!" },
  { q: "What does `git rebase -i HEAD~3` do?", opts: ["Rebase 3 remote branches", "Delete last 3 commits", "Interactively edit/squash/reorder last 3 commits", "Reset to 3 commits ago"], ans: 2, exp: "Interactive rebase opens an editor where you can squash, reword, reorder, or drop the last N commits. Powerful for cleaning up history before a PR." },
  { q: "What is `git cherry-pick abc1234`?", opts: ["Delete commit abc1234", "Apply only that one commit to the current branch", "Merge entire branch", "Revert that commit"], ans: 1, exp: "Cherry-pick takes ONE specific commit from anywhere in history and applies it to your current branch. Like picking one good scene from another movie." },
  { q: "What does `--force-with-lease` do safer than `--force`?", opts: ["Nothing different", "Only force-pushes if nobody else pushed since your last fetch", "Asks for confirmation", "Creates a backup branch"], ans: 1, exp: "--force-with-lease checks if the remote still matches your last fetch. If someone else pushed in the meantime, it refuses — preventing you from overwriting their work." },
  { q: "What is `git reflog`?", opts: ["Remote log of all users", "Complete local history of every HEAD movement, including deleted commits", "Log of all git config changes", "Commit log for a specific file"], ans: 1, exp: "reflog is your ultimate safety net — it records every place HEAD has been, even for commits you deleted. You can recover lost work with git reset --hard HEAD@{N}." },
];

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const q = QUESTIONS[idx];

  const pick = (i) => {
    if (sel !== null) return;
    setSel(i);
    if (i === q.ans) setScore((s) => s + 1);
    setShowExp(true);
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) { setDone(true); return; }
    setIdx((i) => i + 1);
    setSel(null);
    setShowExp(false);
  };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "30px 20px" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{pct === 100 ? "🏆" : pct >= 70 ? "⭐" : "📚"}</div>
        <div style={{ color: T.green, fontSize: 28, fontWeight: 700, fontFamily: "monospace" }}>{score}/{QUESTIONS.length}</div>
        <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 6, marginBottom: 24 }}>{pct === 100 ? "Perfect! You're a Git Master 🎉" : pct >= 70 ? "Great work! Review the missed ones." : "Keep exploring the modules and retry!"}</div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "inline-block", minWidth: isMobile ? "auto" : 260, width: isMobile ? "100%" : "auto" }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
            <div style={{ width: `${pct}%`, minWidth: 4, height: 8, background: `linear-gradient(90deg,${T.green},${T.teal})`, borderRadius: 4 }} />
            <div style={{ width: `${100 - pct}%`, height: 8, background: T.border, borderRadius: 4 }} />
          </div>
          <div style={{ color: T.muted, fontSize: 12 }}>{pct}% correct</div>
        </div>
        <br />
        <button onClick={() => { setIdx(0); setSel(null); setScore(0); setDone(false); setShowExp(false); }} style={{ background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 9, color: T.green, fontSize: 13, padding: "10px 28px", cursor: "pointer" }}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{ width: i === idx ? 20 : 8, height: 8, borderRadius: 4, background: i < idx ? T.green : i === idx ? T.amber : T.border, transition: "all .2s" }} />
          ))}
        </div>
        <span style={{ color: T.muted, fontSize: 12 }}>Score: <span style={{ color: T.green }}>{score}</span></span>
      </div>
      <div style={{ color: T.text, fontSize: 15, lineHeight: 1.6, marginBottom: 20, fontWeight: 500 }}>Q{idx + 1}. {q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {q.opts.map((opt, i) => {
          let bg = T.card, border = T.border, col = "#94a3b8";
          if (sel !== null) {
            if (i === q.ans) { bg = "rgba(74,222,128,.1)"; border = "rgba(74,222,128,.4)"; col = T.green; }
            else if (i === sel && sel !== q.ans) { bg = "rgba(248,113,113,.1)"; border = "rgba(248,113,113,.35)"; col = T.red; }
          }
          return (
            <button key={i} onClick={() => pick(i)} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "11px 15px", color: col, textAlign: "left", cursor: sel !== null ? "default" : "pointer", transition: "all .2s", fontSize: 13, lineHeight: 1.4 }}>
              <span style={{ color: T.muted, marginRight: 8, fontFamily: "monospace" }}>{String.fromCharCode(65 + i)}.</span>{opt}
              {sel !== null && i === q.ans && <span style={{ marginLeft: 8 }}>✓</span>}
              {sel !== null && i === sel && sel !== q.ans && <span style={{ marginLeft: 8 }}>✗</span>}
            </button>
          );
        })}
      </div>
      {showExp && (
        <div style={{ background: "rgba(96,165,250,.07)", border: "1px solid rgba(96,165,250,.2)", borderRadius: 9, padding: "12px 14px", marginBottom: 14, animation: "slideIn .25s ease" }}>
          <div style={{ color: T.blue, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>💡 EXPLANATION</div>
          <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>{q.exp}</div>
        </div>
      )}
      {sel !== null && (
        <button onClick={next} style={{ width: "100%", background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 8, color: T.green, fontSize: 13, padding: "11px", cursor: "pointer" }}>
          {idx + 1 >= QUESTIONS.length ? "See Results 🏆" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

export default function QuizModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🧠" title="Master Quiz — 10 Questions" color={T.purple}>
        Each question includes a detailed explanation after you answer. Complete all 10 to see
        your mastery level. These questions cover the concepts that trip up even experienced
        developers.
      </InfoBox>
      <Quiz />
    </div>
  );
}
