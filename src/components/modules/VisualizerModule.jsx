import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

const GRAPH_COMMITS = [
  { id: "1a2b3c", msg: "chore: initial commit", branch: "main", x: 0, y: 2, color: T.green },
  { id: "4d5e6f", msg: "feat: project scaffold", branch: "main", x: 1, y: 2, color: T.green },
  { id: "7g8h9i", msg: "feat: homepage layout", branch: "main", x: 2, y: 2, color: T.green },
  { id: "a1b2c3", msg: "feat: create login branch", branch: "feature", x: 3, y: 0, color: T.blue },
  { id: "d4e5f6", msg: "fix: fix nav bug", branch: "main", x: 3, y: 2, color: T.green },
  { id: "g7h8i9", msg: "feat: login form UI", branch: "feature", x: 4, y: 0, color: T.blue },
  { id: "j1k2l3", msg: "hotfix: critical sec patch", branch: "hotfix", x: 4, y: 4, color: T.red },
  { id: "m4n5o6", msg: "feat: login API integration", branch: "feature", x: 5, y: 0, color: T.blue },
  { id: "p7q8r9", msg: "fix: hotfix merged to main", branch: "main", x: 5, y: 2, color: T.green },
  { id: "s1t2u3", msg: "Merge: feature/login → main", branch: "merge", x: 6, y: 2, color: T.purple },
  { id: "v4w5x6", msg: "feat: user dashboard", branch: "main", x: 7, y: 2, color: T.green },
  { id: "y7z8a1", msg: "feat: analytics widget", branch: "main", x: 8, y: 2, color: T.green },
];

const GRAPH_EDGES = [
  ["1a2b3c", "4d5e6f"], ["4d5e6f", "7g8h9i"], ["7g8h9i", "a1b2c3"], ["7g8h9i", "d4e5f6"],
  ["a1b2c3", "g7h8i9"], ["d4e5f6", "j1k2l3"], ["g7h8i9", "m4n5o6"], ["d4e5f6", "p7q8r9"],
  ["m4n5o6", "s1t2u3"], ["p7q8r9", "s1t2u3"], ["s1t2u3", "v4w5x6"], ["v4w5x6", "y7z8a1"],
];

const GRAPH_COMMIT_MAP = new Map(GRAPH_COMMITS.map((c) => [c.id, c]));

function CommitGraph() {
  const [hovered, setHovered] = useState(null);
  const cellW = 80, cellH = 70, padX = 50, padY = 40;
  const svgW = GRAPH_COMMITS.reduce((m, c) => Math.max(m, c.x), 0) * cellW + padX * 2 + 100;
  const svgH = GRAPH_COMMITS.reduce((m, c) => Math.max(m, c.y), 0) * cellH + padY * 2 + 20;
  const cx = (c) => padX + c.x * cellW;
  const cy = (c) => padY + c.y * cellH;
  const gc = (id) => GRAPH_COMMIT_MAP.get(id);

  return (
    <div>
      <InfoBox icon="📊" title="Reading the Commit Graph" color={T.teal}>
        Every <strong style={{ color: T.green }}>circle = one commit</strong>. Lines show
        parent→child relationships. When a branch splits off, you see the line diverge. When
        branches merge, lines converge. <strong>Hover any commit</strong> to see its details.
        The <span style={{ color: T.purple }}>purple node</span> is a merge commit — it has
        two parents.
      </InfoBox>
      <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 12, overflowX: "auto", padding: "8px 0" }}>
        <svg width={svgW} height={svgH + 80} style={{ display: "block", minWidth: svgW }}>
          <defs>
            <filter id="glow2"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill={T.border} /></marker>
          </defs>
          {[["main", 2, T.green], ["feature/login", 0, T.blue], ["hotfix", 4, T.red]].map(([label, row, color]) => (
            <text key={label} x={padX - 8} y={padY + row * cellH + 4} textAnchor="end" fill={color} fontSize="10" fontFamily="monospace" fontWeight="bold" opacity=".8">{label}</text>
          ))}
          {[[2, T.green], [0, T.blue], [4, T.red]].map(([row, color]) => (
            <line key={row} x1={padX} y1={padY + row * cellH} x2={svgW - 10} y2={padY + row * cellH} stroke={color} strokeWidth="1" opacity=".1" />
          ))}
          {GRAPH_EDGES.map(([fid, tid], i) => {
            const f = gc(fid), t = gc(tid);
            if (!f || !t) return null;
            const x1 = cx(f), y1 = cy(f), x2 = cx(t), y2 = cy(t);
            const curved = y1 !== y2;
            const d = curved ? `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}` : `M${x1},${y1} L${x2},${y2}`;
            return <path key={i} d={d} fill="none" stroke={t.color} strokeWidth="1.5" opacity=".4" strokeDasharray={curved ? "6,3" : "none"} />;
          })}
          {GRAPH_COMMITS.map((c) => {
            const isH = hovered?.id === c.id;
            return (
              <g key={c.id} onMouseEnter={() => setHovered(c)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
                <circle cx={cx(c)} cy={cy(c)} r={isH ? 15 : 11} fill={c.color} opacity={isH ? 1 : 0.75} filter="url(#glow2)" style={{ transition: "all .15s" }} />
                <circle cx={cx(c)} cy={cy(c)} r={4.5} fill={T.terminalBg} />
                <text x={cx(c)} y={cy(c) + 24} textAnchor="middle" fill={T.muted} fontSize="9" fontFamily="monospace">{c.id.slice(0, 6)}</text>
              </g>
            );
          })}
          {hovered && (() => {
            const x = cx(hovered), y = cy(hovered);
            const boxW = 200, boxH = 64;
            const tx = Math.min(Math.max(x - boxW / 2, 4), svgW - boxW - 4);
            const ty = svgH - 10;
            return (
              <g>
                <rect x={tx} y={ty} width={boxW} height={boxH} rx="8" fill={T.card} stroke={hovered.color} strokeWidth="1" opacity=".97" />
                <text x={tx + 12} y={ty + 18} fill={hovered.color} fontSize="11" fontFamily="monospace" fontWeight="bold">{hovered.id}</text>
                <text x={tx + 12} y={ty + 34} fill={T.subtleText} fontSize="10" fontFamily="sans-serif">{hovered.msg.length > 28 ? hovered.msg.slice(0, 28) + "…" : hovered.msg}</text>
                <text x={tx + 12} y={ty + 52} fill={T.muted} fontSize="9" fontFamily="monospace">branch: {hovered.branch}</text>
              </g>
            );
          })()}
        </svg>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
        {[[T.green, "main"], [T.blue, "feature"], [T.red, "hotfix"], [T.purple, "merge commit"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            <span style={{ color: T.muted, fontSize: 11 }}>{l}</span>
          </div>
        ))}
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
      <CommitGraph />
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
