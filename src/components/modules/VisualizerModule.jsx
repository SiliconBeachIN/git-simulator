import { useState, useMemo, useRef, useEffect } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

/* ─── Helpers ─── */
const randId = () => Math.random().toString(36).slice(2, 9);
const BRANCH_COLORS = [T.green, T.blue, T.red, T.amber, T.teal, T.purple];
const pickColor = (idx) => BRANCH_COLORS[idx % BRANCH_COLORS.length];

/* ─── Layout engine: main always row 0 (top), others in creation order below ─── */
function layoutGraph(commits, edges, branches) {
  // Assign rows: main=0, then each new branch in creation order
  const rowOf = {};
  let nextRow = 1;
  for (const name of Object.keys(branches)) {
    if (name === "main" || name === "master") {
      rowOf[name] = 0;
    } else if (!(name in rowOf)) {
      rowOf[name] = nextRow++;
    }
  }

  const placed = new Map();
  let maxCol = 0;

  // Pre-index parent edges by target commit id to avoid repeated filtering per commit.
  const parentsByTarget = new Map();
  for (const [fromId, toId] of edges) {
    if (!parentsByTarget.has(toId)) {
      parentsByTarget.set(toId, []);
    }
    parentsByTarget.get(toId).push(fromId);
  }

  for (const c of commits) {
    const row = rowOf[c.branch] ?? nextRow;
    const parentIds = parentsByTarget.get(c.id) || [];
    let myCol = 0;
    if (parentIds.length > 0) {
      const parentCols = parentIds.map((fid) => placed.get(fid)?.x ?? 0);
      myCol = Math.max(...parentCols) + 1;
    } else if (placed.size > 0) {
      myCol = maxCol + 1;
    }
    placed.set(c.id, { ...c, x: myCol, y: row });
    maxCol = Math.max(maxCol, myCol);
  }

  const totalRows = Math.max(1, ...Object.values(rowOf)) + 1;
  return { placed, totalCols: maxCol + 1, totalRows, rowOf };
}

/* ─── Graph SVG renderer ─── */
function SimGraph({ commits, edges, branches, head, hovered, setHovered }) {
  const { placed, totalCols, totalRows, rowOf } = useMemo(
    () => layoutGraph(commits, edges, branches),
    [commits, edges, branches]
  );

  const padX = 130, padY = 44, cellW = 80, cellH = 60;
  const svgW = Math.max(totalCols * cellW + padX + 80, 420);
  const svgH = Math.max(totalRows * cellH + padY * 2, 160);

  const cx = (node) => padX + node.x * cellW;
  const cy = (node) => padY + node.y * cellH;

  const branchNames = Object.keys(branches);

  return (
    <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 12, overflowX: "auto", padding: "8px 0" }}>
      <svg width={svgW} height={svgH + 70} style={{ display: "block", minWidth: svgW }}>
        <defs>
          <filter id="simGlow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {/* Branch labels + guide lines */}
        {branchNames.map((name) => {
          const color = branches[name].color;
          const row = rowOf[name] ?? 0;
          const y = padY + row * cellH;
          const isHead = head === name;
          return (
            <g key={name}>
              <line x1={padX} y1={y} x2={svgW - 10} y2={y} stroke={color} strokeWidth="1" opacity=".08" />
              <text x={padX - 14} y={y + 4} textAnchor="end" fill={color} fontSize="10" fontFamily="monospace" fontWeight="bold" opacity=".85">
                {name}
              </text>
              {isHead && (
                <text x={padX - 14} y={y + 16} textAnchor="end" fill={T.amber} fontSize="8" fontFamily="monospace" opacity=".7">
                  HEAD
                </text>
              )}
            </g>
          );
        })}

        {/* Edges */}
        {edges.map(([fid, tid], i) => {
          const f = placed.get(fid), t = placed.get(tid);
          if (!f || !t) return null;
          const x1 = cx(f), y1 = cy(f), x2 = cx(t), y2 = cy(t);
          const curved = y1 !== y2;
          // For branch-out: curve stays horizontal from source then bends to target row
          // For merge-in: curve bends from source row then arrives horizontal at target
          const d = curved
            ? `M${x1},${y1} C${x1 + 30},${y1} ${x2 - 30},${y2} ${x2},${y2}`
            : `M${x1},${y1} L${x2},${y2}`;
          return (
            <path key={i} d={d} fill="none" stroke={t.color}
              strokeWidth={1.5} opacity={curved ? 0.5 : 0.35}
              strokeDasharray={curved ? "5,3" : "none"} style={{ transition: "all .3s" }} />
          );
        })}

        {/* Nodes */}
        {commits.map((c) => {
          const node = placed.get(c.id);
          if (!node) return null;
          const isH = hovered === c.id;
          const isLatest = c.id === (branches[c.branch]?.tip);
          return (
            <g key={c.id} onMouseEnter={() => setHovered(c.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              {isLatest && (
                <circle cx={cx(node)} cy={cy(node)} r={17} fill="none" stroke={c.color} strokeWidth="1" opacity=".3" strokeDasharray="3,3">
                  <animate attributeName="r" values="15;19;15" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={cx(node)} cy={cy(node)} r={isH ? 13 : 10} fill={c.color}
                opacity={isH ? 1 : 0.75} filter="url(#simGlow)" style={{ transition: "all .15s" }} />
              <circle cx={cx(node)} cy={cy(node)} r={3.5} fill={T.terminalBg} />
              <text x={cx(node)} y={cy(node) + 22} textAnchor="middle" fill={T.muted} fontSize="8" fontFamily="monospace">
                {c.id.slice(0, 7)}
              </text>
              {/* Show branch tag on the tip commit */}
              {isLatest && (
                <g>
                  <rect x={cx(node) - 28} y={cy(node) - 25} width={56} height={14} rx="7" fill={c.color + "20"} stroke={c.color + "40"} strokeWidth=".5" />
                  <text x={cx(node)} y={cy(node) - 15} textAnchor="middle" fill={c.color} fontSize="7" fontFamily="monospace" fontWeight="bold">
                    {c.branch.length > 10 ? c.branch.slice(0, 9) + "…" : c.branch}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hovered && (() => {
          const c = commits.find((x) => x.id === hovered);
          const node = placed.get(hovered);
          if (!c || !node) return null;
          const boxW = 230, boxH = 58;
          const tx = Math.min(Math.max(cx(node) - boxW / 2, 4), svgW - boxW - 4);
          const ty = svgH + 2;
          return (
            <g style={{ pointerEvents: "none" }}>
              <rect x={tx} y={ty} width={boxW} height={boxH} rx="8" fill={T.card} stroke={c.color} strokeWidth="1" opacity=".97" />
              <text x={tx + 10} y={ty + 16} fill={c.color} fontSize="10" fontFamily="monospace" fontWeight="bold">{c.id.slice(0, 7)}</text>
              <text x={tx + 10} y={ty + 32} fill={T.subtleText} fontSize="10" fontFamily="sans-serif">{c.msg.length > 34 ? c.msg.slice(0, 34) + "…" : c.msg}</text>
              <text x={tx + 10} y={ty + 48} fill={T.muted} fontSize="9" fontFamily="monospace">on {c.branch}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

/* ─── Quick-action button ─── */
function ActionBtn({ label, onClick, color = T.blue, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "5px 14px", borderRadius: 8, fontSize: 11, fontFamily: "monospace",
      cursor: disabled ? "not-allowed" : "pointer",
      background: disabled ? "transparent" : color + "14",
      border: `1px solid ${disabled ? T.border : color + "35"}`,
      color: disabled ? T.muted : color,
      opacity: disabled ? 0.4 : 1,
      transition: "all .2s",
    }}>
      {label}
    </button>
  );
}

/* ─── Interactive Simulator ─── */
function InteractiveSimulator() {
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const initialCommit = { id: randId(), msg: "initial commit", branch: "main", color: T.green };
  const [commits, setCommits] = useState([initialCommit]);
  const [edges, setEdges] = useState([]);
  const [branches, setBranches] = useState({ main: { color: T.green, tip: initialCommit.id, base: null } });
  const [head, setHead] = useState("main");
  const [log, setLog] = useState([
    { type: "system", text: "Repository initialized with branch 'main' and initial commit." },
    { type: "hint", text: "Try: git branch feature/login  →  git checkout feature/login  →  git commit -m \"add login\"" },
  ]);
  const [input, setInput] = useState("");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  const addLog = (type, text) => setLog((p) => [...p, { type, text }]);

  const branchesRef = useRef(branches);
  branchesRef.current = branches;
  const headRef = useRef(head);
  headRef.current = head;
  const commitsRef = useRef(commits);
  commitsRef.current = commits;

  const processCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    addLog("cmd", `$ ${cmd}`);

    const br = branchesRef.current;
    const hd = headRef.current;

    // ── git branch <name>
    const branchMatch = cmd.match(/^git\s+branch\s+([^\s]+)$/i);
    if (branchMatch) {
      const name = branchMatch[1];
      if (br[name]) { addLog("error", `fatal: branch '${name}' already exists.`); return; }
      const parentTip = br[hd].tip;
      const color = pickColor(Object.keys(br).length);
      const updated = { ...br, [name]: { color, tip: parentTip, base: hd } };
      setBranches(updated);
      branchesRef.current = updated;
      addLog("success", `Branch '${name}' created from '${hd}' (at ${parentTip.slice(0, 7)}).`);
      addLog("hint", `Now run: git checkout ${name}`);
      return;
    }

    // ── git checkout -b <name> (create + switch) — must be checked before plain checkout
    const checkoutBMatch = cmd.match(/^git\s+(?:checkout|switch)\s+-b\s+([^\s]+)$/i);
    if (checkoutBMatch) {
      const name = checkoutBMatch[1];
      if (br[name]) { addLog("error", `fatal: branch '${name}' already exists.`); return; }
      const parentTip = br[hd].tip;
      const color = pickColor(Object.keys(br).length);
      const updated = { ...br, [name]: { color, tip: parentTip, base: hd } };
      setBranches(updated);
      branchesRef.current = updated;
      setHead(name);
      headRef.current = name;
      addLog("success", `Switched to a new branch '${name}' (from '${hd}' at ${parentTip.slice(0, 7)}).`);
      return;
    }

    // ── git checkout <name> / git switch <name>
    const checkoutMatch = cmd.match(/^git\s+(?:checkout|switch)\s+([^\s]+)$/i);
    if (checkoutMatch) {
      const name = checkoutMatch[1];
      if (!br[name]) { addLog("error", `error: branch '${name}' not found. Create it first with: git branch ${name}`); return; }
      if (name === hd) { addLog("info", `Already on '${name}'.`); return; }
      setHead(name);
      headRef.current = name;
      addLog("success", `Switched to branch '${name}'.`);
      return;
    }

    // ── git commit -m "message"
    const commitMatch = cmd.match(/^git\s+commit\s+-m\s+["'](.+?)["']$/i);
    if (commitMatch) {
      const msg = commitMatch[1];
      const newId = randId();
      const branchData = br[hd];
      const newCommit = { id: newId, msg, branch: hd, color: branchData.color };
      setCommits((p) => [...p, newCommit]);
      commitsRef.current = [...commitsRef.current, newCommit];
      setEdges((p) => [...p, [branchData.tip, newId]]);
      const updatedBr = { ...br, [hd]: { ...br[hd], tip: newId } };
      setBranches(updatedBr);
      branchesRef.current = updatedBr;
      addLog("success", `[${hd} ${newId.slice(0, 7)}] ${msg}`);
      return;
    }

    // ── git merge <branch>
    const mergeMatch = cmd.match(/^git\s+merge\s+([^\s]+)$/i);
    if (mergeMatch) {
      const source = mergeMatch[1];
      if (!br[source]) { addLog("error", `error: branch '${source}' not found.`); return; }
      if (source === hd) { addLog("error", `error: cannot merge '${source}' into itself.`); return; }
      const newId = randId();
      const msg = `Merge ${source} → ${hd}`;
      const newCommit = { id: newId, msg, branch: hd, color: T.purple };
      const headTip = br[hd].tip;
      const sourceTip = br[source].tip;
      setCommits((p) => [...p, newCommit]);
      commitsRef.current = [...commitsRef.current, newCommit];
      setEdges((p) => [...p, [headTip, newId], [sourceTip, newId]]);
      const updatedBr = { ...br, [hd]: { ...br[hd], tip: newId } };
      setBranches(updatedBr);
      branchesRef.current = updatedBr;
      addLog("success", `Merge made: ${source} → ${hd} (commit ${newId.slice(0, 7)}).`);
      return;
    }

    // ── git log --oneline
    if (/^git\s+log(\s+--oneline)?$/i.test(cmd)) {
      const lines = [...commitsRef.current].reverse().map((c) => {
        const isTip = Object.entries(br).some(([, d]) => d.tip === c.id);
        const branchLabel = isTip ? ` (${Object.entries(br).filter(([, d]) => d.tip === c.id).map(([b]) => b).join(", ")})` : "";
        return `${c.id.slice(0, 7)}${branchLabel} ${c.msg}`;
      });
      lines.forEach((l) => addLog("output", l));
      return;
    }

    // ── git branch (list)
    if (/^git\s+branch$/i.test(cmd)) {
      Object.keys(br).forEach((b) => {
        addLog("output", `${b === hd ? "* " : "  "}${b}`);
      });
      return;
    }

    // ── git status
    if (/^git\s+status$/i.test(cmd)) {
      addLog("output", `On branch ${hd}`);
      addLog("output", `Your branch tip: ${br[hd].tip.slice(0, 7)}`);
      addLog("output", `Total commits: ${commitsRef.current.length}`);
      addLog("output", `Branches: ${Object.keys(br).join(", ")}`);
      return;
    }

    // ── reset
    if (/^reset$/i.test(cmd)) {
      const ic = { id: randId(), msg: "initial commit", branch: "main", color: T.green };
      const resetBr = { main: { color: T.green, tip: ic.id, base: null } };
      setCommits([ic]);
      commitsRef.current = [ic];
      setEdges([]);
      setBranches(resetBr);
      branchesRef.current = resetBr;
      setHead("main");
      headRef.current = "main";
      addLog("system", "Repository reset to initial state.");
      return;
    }

    // ── help
    if (/^help$/i.test(cmd)) {
      [
        "Available commands:",
        "  git branch <name>         — create a new branch",
        "  git checkout <name>       — switch to a branch",
        "  git switch <name>         — alias of checkout",
        "  git checkout -b <name>    — create + switch",
        "  git switch -b <name>      — alias of checkout -b",
        "  git commit -m \"message\"   — commit on current branch",
        "  git merge <branch>        — merge branch into current",
        "  git log                   — show commit log",
        "  git log --oneline         — compact commit log",
        "  git branch                — list branches",
        "  git status                — show current state",
        "  reset                     — reset to initial state",
      ].forEach((l) => addLog("output", l));
      return;
    }

    addLog("error", `command not recognized. Type 'help' for available commands.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processCommand(input);
    setInput("");
    inputRef.current?.focus();
  };

  const quickBranch = (name) => {
    // Always branch from main regardless of current HEAD
    if (headRef.current !== "main") processCommand("git checkout main");
    processCommand(`git checkout -b ${name}`);
  };

  const quickCommit = (msg) => {
    processCommand(`git commit -m "${msg}"`);
  };

  return (
    <div>
      <InfoBox icon="🧪" title="Interactive Commit Graph Simulator" color={T.teal}>
        Type git commands below and watch the graph build in real-time.{" "}
        <strong>Create branches</strong>, <strong>make commits</strong>, and{" "}
        <strong>merge</strong> — the graph updates instantly to show exactly what happens.
        Type <code style={{ color: T.amber }}>help</code> for all commands.
      </InfoBox>

      {/* Live graph */}
      <SimGraph commits={commits} edges={edges} branches={branches} head={head} hovered={hovered} setHovered={setHovered} />

      {/* Branch + HEAD indicator */}
      <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
        {Object.entries(branches).map(([name, data]) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 14, fontSize: 11, fontFamily: "monospace",
            background: name === head ? data.color + "18" : "transparent",
            border: `1px solid ${name === head ? data.color + "40" : T.border}`,
            color: name === head ? data.color : T.muted,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: data.color }} />
            {name}
            {name === head && <span style={{ color: T.amber, fontSize: 9, marginLeft: 2 }}>HEAD</span>}
          </div>
        ))}
        <span style={{ color: T.muted, fontSize: 10, marginLeft: "auto" }}>{commits.length} commit{commits.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <span style={{ color: T.muted, fontSize: 10, lineHeight: "28px" }}>Quick:</span>
        <ActionBtn label="+ feature branch" color={T.blue} onClick={() => quickBranch(`feature/${randId().slice(0, 4)}`)} />
        <ActionBtn label="+ hotfix branch" color={T.red} onClick={() => quickBranch(`hotfix/${randId().slice(0, 4)}`)} />
        <ActionBtn label="commit" color={T.green} onClick={() => quickCommit("update code")} />
        <ActionBtn label="merge to main" color={T.purple}
          disabled={head === "main"}
          onClick={() => { const cur = headRef.current; processCommand("git checkout main"); processCommand(`git merge ${cur}`); }}
        />
        <ActionBtn label="reset" color={T.red} onClick={() => processCommand("reset")} />
      </div>

      {/* Terminal log */}
      <div style={{
        marginTop: 12, background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 10,
        display: "flex", flexDirection: "column", maxHeight: 220, overflow: "hidden",
      }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "10px 14px", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7 }}>
          {log.map((l, i) => {
            const colors = { cmd: T.purple, success: T.green, error: T.red, hint: T.amber, system: T.teal, info: T.blue, output: T.subtleText };
            return (
              <div key={i} style={{ color: colors[l.type] || T.muted, opacity: l.type === "hint" ? 0.7 : 1 }}>
                {l.type === "hint" ? `💡 ${l.text}` : l.text}
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: `1px solid ${T.border}` }}>
          <span style={{ color: T.purple, padding: "8px 0 8px 14px", fontSize: 12, fontFamily: "monospace" }}>$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='git commit -m "feat: add login"'
            spellCheck={false}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: T.text, fontSize: 12, fontFamily: "'JetBrains Mono',monospace",
              padding: "8px 14px 8px 8px",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default function VisualizerModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="📊" title="Why visualise your commit history?" color={T.blue}>
        Your commit history is a complete record of how your project evolved — who changed what,
        when, and why. Visualising it as a graph lets you immediately see the shape of your
        workflow: which branches were created, where they merged, which features ran in parallel.
        <br /><br />
        It also helps you pinpoint exactly when a bug was introduced, understand a colleague's
        work before reviewing their PR, or figure out the best place to cherry-pick a fix from
        one branch to another.
      </InfoBox>
      <InfoBox icon="🌳" title="Reading the graph" color={T.green}>
        Each <strong style={{ color: T.green }}>dot (●)</strong> is a commit — a snapshot of
        your entire project at that moment.{" "}
        <strong style={{ color: T.blue }}>Horizontal lines</strong> show commits on the same
        branch over time.{" "}
        <strong style={{ color: T.amber }}>Branch lines (╲ ╱)</strong> show where branches
        split off and where they merged back. Labels like{" "}
        <code style={{ color: T.purple }}>main</code> and{" "}
        <code style={{ color: T.teal }}>feature/login</code> always point to the most recent
        commit on that branch.
      </InfoBox>
      <InteractiveSimulator />
      <SectionTitle>Reading the Graph — Key Commands</SectionTitle>
      {[
        { cmd: "git log --oneline --graph --all --decorate", desc: "Terminal commit graph (ASCII art)", detail: "--graph draws branch lines, --all shows all branches, --decorate adds branch/tag labels.", example: "Your codebase family tree in the terminal 🌳" },
        { cmd: "git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset'", desc: "Coloured pretty graph", detail: "Custom format with colours: short hash, branch labels, message, relative date.", example: "" },
        { cmd: "git show abc1234", desc: "Show full details of one commit", detail: "Displays commit metadata + the complete diff of that commit. Everything that changed.", example: "" },
        { cmd: "git log main..feature", desc: "Commits in feature but NOT in main", detail: "Shows what's unique to feature branch. Great for PR review prep.", example: "" },
        { cmd: "git diff main...feature", desc: "Changes since feature branched from main", detail: "Three dots = diff from common ancestor to feature tip. What the feature actually added.", example: "" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
