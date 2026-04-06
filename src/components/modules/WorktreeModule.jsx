import { useState, useRef, useEffect, useCallback } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard, Terminal, ConceptDiagram } from "../shared";
import { safeScrollToBottom, safeFocus } from "../../utils/scroll";

/* ── Worktree visual card ── */
function WorktreeCard({ path, branch, isMain, isLocked, color }) {
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${color}30`,
        borderRadius: 10,
        padding: "12px 16px",
        minWidth: 180,
        position: "relative",
        transition: "all .2s",
      }}
    >
      {isMain && (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 10,
            background: color,
            color: "#000",
            fontSize: 9,
            fontWeight: 700,
            padding: "1px 8px",
            borderRadius: 6,
            fontFamily: "monospace",
          }}
        >
          MAIN
        </div>
      )}
      {isLocked && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: 10,
            fontSize: 12,
          }}
        >
          🔒
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>📂</span>
        <span
          style={{
            color: T.text,
            fontSize: 12,
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 600,
          }}
        >
          {path}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        <span
          style={{
            color,
            fontSize: 11,
            fontFamily: "monospace",
            fontWeight: 600,
          }}
        >
          {branch}
        </span>
      </div>
      <div
        style={{
          marginTop: 6,
          color: T.muted,
          fontSize: 10,
          fontFamily: "monospace",
        }}
      >
        {isMain ? "contains .git/" : "linked → .git/"}
      </div>
    </div>
  );
}

/* ── Color palette for branches ── */
const COLORS = [T.green, T.blue, T.red, T.amber, T.teal, T.purple];
const pickColor = (i) => COLORS[i % COLORS.length];

/* ── Interactive Worktree Simulator ── */
function WorktreeSimulator() {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const [worktrees, setWorktrees] = useState([
    { path: "/home/user/my-project", branch: "main", isMain: true, isLocked: false, color: T.green },
  ]);
  const [log, setLog] = useState([
    { type: "system", text: "Repository initialized. Main worktree: /home/user/my-project [main]" },
    { type: "hint", text: "Try: git worktree add ../hotfix hotfix/bug-fix" },
  ]);
  const [input, setInput] = useState("");

  const wtRef = useRef(worktrees);
  wtRef.current = worktrees;

  useEffect(() => {
    safeScrollToBottom(scrollRef.current, { smooth: true });
  }, [log]);

  const addLog = useCallback((type, text) => setLog((p) => [...p, { type, text }]), []);

  const processCommand = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      addLog("cmd", `$ ${cmd}`);
      const wts = wtRef.current;

      // git worktree list
      if (/^git\s+worktree\s+list$/i.test(cmd)) {
        if (wts.length === 0) {
          addLog("output", "No worktrees.");
        } else {
          wts.forEach((w) => {
            const lock = w.isLocked ? " (locked)" : "";
            addLog("output", `${w.path.padEnd(35)} [${w.branch}]${lock}`);
          });
        }
        addLog("info", `Total: ${wts.length} worktree${wts.length !== 1 ? "s" : ""}`);
        return;
      }

      // git worktree add --detach <path>
      const detachMatch = cmd.match(/^git\s+worktree\s+add\s+--detach\s+(\S+)$/i);
      if (detachMatch) {
        const path = detachMatch[1];
        if (wts.some((w) => w.path === path)) {
          addLog("error", `fatal: '${path}' already exists as a worktree.`);
          return;
        }
        const color = pickColor(wts.length);
        const updated = [...wts, { path, branch: "HEAD (detached)", isMain: false, isLocked: false, color }];
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Created worktree at '${path}' in detached HEAD state.`);
        return;
      }

      // git worktree add -b <branch> <path> [<start-point>]
      const addBMatch = cmd.match(/^git\s+worktree\s+add\s+-b\s+(\S+)\s+(\S+)(?:\s+(\S+))?$/i);
      if (addBMatch) {
        const branch = addBMatch[1];
        const path = addBMatch[2];
        const startPoint = addBMatch[3];
        if (wts.some((w) => w.path === path)) {
          addLog("error", `fatal: '${path}' already exists as a worktree.`);
          return;
        }
        if (wts.some((w) => w.branch === branch)) {
          addLog("error", `fatal: '${branch}' is already checked out in another worktree.`);
          return;
        }
        const color = pickColor(wts.length);
        const updated = [...wts, { path, branch, isMain: false, isLocked: false, color }];
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Created new branch '${branch}' and worktree at '${path}'.`);
        if (startPoint) {
          addLog("info", `Base: '${branch}' starts from '${startPoint}'.`);
        }
        return;
      }

      if (/^git\s+worktree\s+add\s+--detach\s*$/i.test(cmd)) {
        addLog("error", "usage: git worktree add --detach <path>");
        return;
      }

      if (/^git\s+worktree\s+add\s+-b\s+\S+\s*$/i.test(cmd)) {
        addLog("error", "usage: git worktree add -b <branch> <path> [<start-point>]");
        return;
      }

      // git worktree add <path> <branch>
      const addMatch = cmd.match(/^git\s+worktree\s+add\s+(\S+)(?:\s+(\S+))?$/i);
      if (addMatch) {
        const path = addMatch[1];
        if (path.startsWith("-")) {
          addLog("error", "usage: git worktree add <path> <branch>");
          return;
        }
        const branch = addMatch[2] || path.split("/").pop();
        if (wts.some((w) => w.path === path)) {
          addLog("error", `fatal: '${path}' already exists as a worktree.`);
          return;
        }
        if (wts.some((w) => w.branch === branch)) {
          addLog("error", `fatal: '${branch}' is already checked out in another worktree.`);
          return;
        }
        const color = pickColor(wts.length);
        const updated = [...wts, { path, branch, isMain: false, isLocked: false, color }];
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Created worktree at '${path}' on branch '${branch}'.`);
        addLog("hint", `cd ${path} to start working there.`);
        return;
      }

      // git worktree remove <path>
      const removeMatch = cmd.match(/^git\s+worktree\s+remove\s+(--force\s+)?(\S+)$/i);
      if (removeMatch) {
        const force = !!removeMatch[1];
        const path = removeMatch[2];
        const wt = wts.find((w) => w.path === path);
        if (!wt) {
          addLog("error", `fatal: '${path}' is not a registered worktree.`);
          return;
        }
        if (wt.isMain) {
          addLog("error", "fatal: cannot remove the main worktree.");
          return;
        }
        if (wt.isLocked && !force) {
          addLog("error", `fatal: '${path}' is locked. Use --force or unlock first.`);
          return;
        }
        const updated = wts.filter((w) => w.path !== path);
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Worktree '${path}' removed. Branch '${wt.branch}' still exists.`);
        return;
      }

      // git worktree lock <path>
      const lockMatch = cmd.match(/^git\s+worktree\s+lock\s+(\S+)$/i);
      if (lockMatch) {
        const path = lockMatch[1];
        const idx = wts.findIndex((w) => w.path === path);
        if (idx === -1) {
          addLog("error", `fatal: '${path}' is not a registered worktree.`);
          return;
        }
        if (wts[idx].isLocked) {
          addLog("info", `'${path}' is already locked.`);
          return;
        }
        const updated = wts.map((w, i) => (i === idx ? { ...w, isLocked: true } : w));
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Worktree '${path}' locked.`);
        return;
      }

      // git worktree unlock <path>
      const unlockMatch = cmd.match(/^git\s+worktree\s+unlock\s+(\S+)$/i);
      if (unlockMatch) {
        const path = unlockMatch[1];
        const idx = wts.findIndex((w) => w.path === path);
        if (idx === -1) {
          addLog("error", `fatal: '${path}' is not a registered worktree.`);
          return;
        }
        if (!wts[idx].isLocked) {
          addLog("info", `'${path}' is not locked.`);
          return;
        }
        const updated = wts.map((w, i) => (i === idx ? { ...w, isLocked: false } : w));
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Worktree '${path}' unlocked.`);
        return;
      }

      // git worktree move <old> <new>
      const moveMatch = cmd.match(/^git\s+worktree\s+move\s+(\S+)\s+(\S+)$/i);
      if (moveMatch) {
        const oldPath = moveMatch[1];
        const newPath = moveMatch[2];
        const idx = wts.findIndex((w) => w.path === oldPath);
        if (idx === -1) {
          addLog("error", `fatal: '${oldPath}' is not a registered worktree.`);
          return;
        }
        if (wts[idx].isMain) {
          addLog("error", "fatal: cannot move the main worktree.");
          return;
        }
        if (wts.some((w, i) => i !== idx && w.path === newPath)) {
          addLog("error", `fatal: '${newPath}' already exists as a worktree.`);
          return;
        }
        const updated = wts.map((w, i) => (i === idx ? { ...w, path: newPath } : w));
        setWorktrees(updated);
        wtRef.current = updated;
        addLog("success", `✓ Worktree moved: ${oldPath} → ${newPath}`);
        return;
      }

      // git worktree prune
      if (/^git\s+worktree\s+prune$/i.test(cmd)) {
        addLog("success", "✓ Pruned stale worktree references.");
        return;
      }

      // reset
      if (/^reset$/i.test(cmd)) {
        const initial = [
          { path: "/home/user/my-project", branch: "main", isMain: true, isLocked: false, color: T.green },
        ];
        setWorktrees(initial);
        wtRef.current = initial;
        addLog("system", "Simulator reset to initial state.");
        return;
      }

      // help
      if (/^help$/i.test(cmd)) {
        [
          "Available commands:",
          '  git worktree add <path> <branch>   — create a worktree',
          '  git worktree add -b <branch> <path> — create branch + worktree',
          '  git worktree add --detach <path>    — detached HEAD worktree',
          '  git worktree list                   — list all worktrees',
          '  git worktree remove <path>          — remove a worktree',
          '  git worktree remove --force <path>  — force remove',
          '  git worktree move <old> <new>       — move a worktree',
          '  git worktree lock <path>            — lock a worktree',
          '  git worktree unlock <path>          — unlock a worktree',
          '  git worktree prune                  — prune stale refs',
          '  reset                               — reset simulator',
        ].forEach((l) => addLog("output", l));
        return;
      }

      addLog("error", "Command not recognized. Type 'help' for available commands.");
    },
    [addLog],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    processCommand(input);
    setInput("");
    safeFocus(inputRef.current);
  };

  const logColors = {
    cmd: T.purple,
    success: T.green,
    error: T.red,
    hint: T.amber,
    system: T.teal,
    info: T.blue,
    output: T.subtleText,
  };

  return (
    <div>
      <InfoBox icon="🧪" title="Interactive Worktree Simulator" color={T.teal}>
        Type worktree commands below and watch directories appear and disappear in
        real-time. <strong>Create worktrees</strong>, <strong>lock them</strong>,{" "}
        <strong>move them</strong>, and <strong>remove them</strong>. Type{" "}
        <code style={{ color: T.amber }}>help</code> for all commands.
      </InfoBox>

      {/* Visual worktree cards */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          padding: 16,
          background: T.terminalBg,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          minHeight: 100,
          alignItems: "flex-start",
        }}
      >
        {worktrees.map((wt) => (
          <WorktreeCard key={wt.path} {...wt} />
        ))}
        {worktrees.length === 0 && (
          <div style={{ color: T.muted, fontSize: 12, padding: 20, textAlign: "center", width: "100%" }}>
            No worktrees. Run a command to add one.
          </div>
        )}
      </div>

      {/* Shared .git indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
          padding: "6px 12px",
          background: T.green + "08",
          border: `1px solid ${T.green}15`,
          borderRadius: 8,
        }}
      >
        <span style={{ fontSize: 14 }}>🔗</span>
        <span style={{ color: T.muted, fontSize: 11, fontFamily: "monospace" }}>
          All {worktrees.length} worktree{worktrees.length !== 1 ? "s" : ""} share the same .git
          history
        </span>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <span style={{ color: T.muted, fontSize: 10, lineHeight: "28px" }}>Quick:</span>
        {[
          { label: "+ hotfix worktree", color: T.red, cmd: "git worktree add ../hotfix hotfix/urgent" },
          { label: "+ feature worktree", color: T.blue, cmd: "git worktree add -b feat/new-ui ../new-ui" },
          { label: "+ detached worktree", color: T.amber, cmd: "git worktree add --detach ../experiment" },
          { label: "list", color: T.teal, cmd: "git worktree list" },
          { label: "reset", color: T.red, cmd: "reset" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => processCommand(btn.cmd)}
            style={{
              padding: "5px 14px",
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "monospace",
              cursor: "pointer",
              background: btn.color + "14",
              border: `1px solid ${btn.color}35`,
              color: btn.color,
              transition: "all .2s",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Terminal log */}
      <div
        style={{
          marginTop: 12,
          background: T.terminalBg,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          maxHeight: 220,
          overflow: "hidden",
        }}
      >
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 14px",
            fontSize: 12,
            fontFamily: "'JetBrains Mono',monospace",
            lineHeight: 1.7,
          }}
        >
          {log.map((l, i) => (
            <div
              key={i}
              style={{
                color: logColors[l.type] || T.muted,
                opacity: l.type === "hint" ? 0.7 : 1,
              }}
            >
              {l.type === "hint" ? `💡 ${l.text}` : l.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: `1px solid ${T.border}` }}>
          <span
            style={{ color: T.purple, padding: "8px 0 8px 14px", fontSize: 12, fontFamily: "monospace" }}
          >
            $
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Git worktree command input"
            placeholder="git worktree add ../feature feat/login"
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: T.text,
              fontSize: 12,
              fontFamily: "'JetBrains Mono',monospace",
              padding: "8px 14px 8px 8px",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default function WorktreeModule() {
  return (
    <div>
      <InfoBox icon="📖" title="The Story" color={T.purple}>
        Imagine you're a chef working on a new pasta recipe. Halfway through, the
        restaurant calls — a customer needs an urgent dessert. Normally you'd have
        to clean up your entire station, put the pasta away, and start fresh. With{" "}
        <strong style={{ color: T.green }}>git worktree</strong>, it's like having{" "}
        <strong style={{ color: T.amber }}>a second kitchen</strong>. You walk next
        door, make the dessert on a clean counter, deliver it, and walk back — your
        pasta is exactly where you left it, mid-stir.
      </InfoBox>

      <InfoBox icon="🌲" title="Work on Multiple Branches at Once" color={T.green}>
        <code style={{ color: T.green }}>git worktree</code> lets you check out
        multiple branches <strong>simultaneously</strong> in separate directories —
        no more stashing or switching. Review a PR, fix a hotfix, and continue
        feature work all at the same time.
      </InfoBox>

      <InfoBox icon="🔑" title="How it actually works" color={T.blue}>
        Every Git repo has <strong>one main working directory</strong> (where{" "}
        <code style={{ color: T.green }}>.git/</code> lives). When you run{" "}
        <code style={{ color: T.green }}>git worktree add</code>, Git creates a{" "}
        <strong>new folder</strong> that shares the same{" "}
        <code style={{ color: T.green }}>.git</code> database — same commits, same
        branches, same history. The new folder just has a tiny{" "}
        <code style={{ color: T.green }}>.git</code> file (not a folder) that{" "}
        <strong style={{ color: T.amber }}>points back</strong> to the original.
        That means: <strong>zero duplication</strong> of history, instant setup, and
        every worktree sees the same commits.
      </InfoBox>

      <ConceptDiagram>{`How worktrees are connected:

/home/user/my-project/          ← Main worktree
├── .git/                       ← The REAL database (shared by all)
│   ├── objects/                ← All commits live here once
│   ├── refs/
│   └── worktrees/
│       ├── hotfix/             ← Metadata for linked worktree
│       └── pr-review/          ← Metadata for linked worktree
├── src/
└── README.md

/home/user/hotfix/              ← Linked worktree (separate folder)
├── .git                        ← Tiny FILE pointing → ../my-project/.git
├── src/                        ← Working copy of hotfix branch
└── README.md

/home/user/pr-review/           ← Another linked worktree
├── .git                        ← Also points → ../my-project/.git
├── src/                        ← Working copy of PR branch
└── README.md

💡 Key insight: One .git database, multiple working directories.
   Each worktree checks out a DIFFERENT branch simultaneously.
   You can cd between them like separate projects.`}</ConceptDiagram>

      <InfoBox icon="⚠" title="One rule to remember" color={T.amber}>
        A branch can only be checked out in <strong>one worktree at a time</strong>.
        If <code style={{ color: T.green }}>main</code> is checked out in your main
        directory, you can't check it out in a linked worktree too. This prevents
        accidental conflicts. Use{" "}
        <code style={{ color: T.green }}>git worktree list</code> to see which
        branch is where.
      </InfoBox>

      {/* Interactive simulator */}
      <WorktreeSimulator />

      <SectionTitle>🌲 Creating Worktrees</SectionTitle>
      {[
        {
          cmd: "git worktree add ../hotfix hotfix/critical",
          desc: "Create a worktree for an existing branch",
          detail:
            "Creates a new working directory at ../hotfix linked to the hotfix/critical branch. Both directories share the same .git history.",
          example: "🌌 Open a portal to a parallel branch — no switching needed",
        },
        {
          cmd: "git worktree add -b feat/new-ui ../new-ui",
          desc: "Create a new branch and worktree together",
          detail:
            "The -b flag creates the branch for you and checks it out in the new directory. One command, two results.",
          example: "🚀 Launch a new branch in its own workspace instantly",
        },
        {
          cmd: "git worktree add --detach ../experiment",
          desc: "Create a detached HEAD worktree",
          detail:
            "Checks out the current commit in a new directory without any branch. Useful for quick experiments you may throw away.",
          example: "🧪 A throwaway lab for risky experiments",
        },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}

      <SectionTitle>📋 Managing Worktrees</SectionTitle>
      {[
        {
          cmd: "git worktree list",
          desc: "List all active worktrees",
          detail:
            "Shows the path, HEAD commit, and branch name for the main working directory and every linked worktree.",
          example: "🗺️ See all your parallel universes at a glance",
        },
        {
          cmd: "git worktree move ../hotfix ../patches/hotfix",
          desc: "Move a worktree to a different path",
          detail:
            "Relocates the worktree directory. Git updates its internal records so the link stays intact.",
          example: "",
        },
        {
          cmd: "git worktree lock ../hotfix",
          desc: "Prevent a worktree from being pruned",
          detail:
            "Marks a worktree as locked so 'git worktree prune' won't remove it — useful if the path is on a removable drive or network share.",
          example: "🔒 Pin a worktree so it survives cleanup",
        },
        {
          cmd: "git worktree unlock ../hotfix",
          desc: "Unlock a previously locked worktree",
          detail:
            "Removes the lock so the worktree can be pruned normally again.",
          example: "",
        },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}

      <SectionTitle>🧹 Cleaning Up</SectionTitle>
      {[
        {
          cmd: "git worktree remove ../hotfix",
          desc: "Delete a worktree and its directory",
          detail:
            "Removes the linked working directory and cleans up Git's internal worktree metadata. The branch itself stays untouched.",
          example: "🗑️ Close the portal when you're done",
        },
        {
          cmd: "git worktree remove --force ../hotfix",
          desc: "Force-remove a worktree with uncommitted changes",
          detail:
            "Use --force when the worktree has modified or untracked files that you want to discard.",
          example: "",
          warning:
            "This discards all uncommitted changes in that worktree. Commit or stash first.",
        },
        {
          cmd: "git worktree prune",
          desc: "Clean up stale worktree references",
          detail:
            "If you manually deleted a worktree directory, Git still has a record of it. Prune removes those dangling references.",
          example: "🧹 Sweep up any broken links",
        },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}

      <SectionTitle>💡 Real-World Workflows</SectionTitle>
      {[
        {
          cmd: "git worktree add ../pr-review origin/feat/login",
          desc: "Code review in a separate directory",
          detail:
            "Check out the PR branch in a new folder, run tests, inspect code — all while your feature branch stays untouched in the main directory.",
          example: "👀 Review code without disrupting your flow",
        },
        {
          cmd: "git worktree add -b hotfix/CVE-fix ../hotfix main",
          desc: "Ship a hotfix without stashing work-in-progress",
          detail:
            "Create a hotfix branch based on main in a new directory. Fix, commit, push, then delete the worktree. Your feature branch never notices.",
          example: "🚑 Emergency fix without touching your current work",
        },
        {
          cmd: "git worktree add ../v1 v1.0.0",
          desc: "Add a worktree for version 1.0.0",
          detail:
            "Create the first tag-based worktree so you can build and inspect an older release alongside your current checkout.",
          example: "⚖️ Compare builds side by side — step 1",
        },
        {
          cmd: "git worktree add ../v2 v2.0.0",
          desc: "Add a worktree for version 2.0.0",
          detail:
            "Create the second tag-based worktree to run two versions simultaneously for regression checks and side-by-side comparison.",
          example: "⚖️ Compare builds side by side — step 2",
        },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}

      <SectionTitle>⚡ Try It — Live Terminal</SectionTitle>
      <Terminal compact />
    </div>
  );
}
