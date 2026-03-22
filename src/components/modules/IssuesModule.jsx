import { useState } from "react";
import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

const ISSUE_LABELS = [
  { name: "bug", color: T.red },
  { name: "enhancement", color: T.blue },
  { name: "good first issue", color: T.green },
  { name: "help wanted", color: T.amber },
  { name: "documentation", color: T.purple },
  { name: "wontfix", color: T.muted },
];

function IssuesSimulator({ isMobile }) {
  const [issues, setIssues] = usePageState("issues", [
    { id: 1, title: "Login button crashes on Safari", label: "bug", state: "open", comments: 3, author: "alice", body: "Steps: open Safari, click login, app freezes." },
    { id: 2, title: "Add dark mode support", label: "enhancement", state: "open", comments: 7, author: "bob", body: "Users requested a dark theme." },
    { id: 3, title: "Fix typo in README", label: "good first issue", state: "closed", comments: 1, author: "charlie", body: "Line 42: recieve should be receive." },
  ]);
  const [form, setForm] = useState({ title: "", label: "bug", body: "" });
  const [selId, setSelId] = useState(null);
  const sel = issues.find((i) => i.id === selId) || null;
  const [filter, setFilter] = usePageState("filter", "open");

  const create = () => {
    if (!form.title.trim()) return;
    setIssues((prev) => [{ id: prev.length + 1, title: form.title, label: form.label, state: "open", comments: 0, author: "you", body: form.body || "No description." }, ...prev]);
    setForm({ title: "", label: "bug", body: "" });
  };
  const closeIssue = (id) => setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, state: i.state === "open" ? "closed" : "open" } : i)));
  const shown = issues.filter((i) => filter === "all" || i.state === filter);

  return (
    <div>
      <InfoBox icon="🐛" title="Issues are your project memory" color={T.red}>
        Every bug report, feature request, or question lives as an Issue — a ticket system built
        into GitHub. Issues can be assigned, tagged with labels, linked to PRs, and tracked on a
        board. Write Fixes #42 in a PR description to auto-close the issue on merge.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid " + T.border, display: "flex", gap: 8 }}>
            {["open", "closed", "all"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? T.greenBgMedium : "transparent", border: "1px solid " + (filter === f ? T.greenBorderStrong : T.border), borderRadius: 5, color: filter === f ? T.green : T.muted, fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>
                {f} ({issues.filter((i) => f === "all" || i.state === f).length})
              </button>
            ))}
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {shown.map((i) => {
              const lc = (ISSUE_LABELS.find((l) => l.name === i.label) || { color: T.blue }).color;
              return (
                <div key={i.id} onClick={() => setSelId(i.id)} style={{ padding: "10px 14px", borderBottom: "1px solid " + T.border, cursor: "pointer", background: sel && sel.id === i.id ? T.greenBgSubtle : "transparent" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 13, marginTop: 1 }}>{i.state === "open" ? "🟢" : "⚫"}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: T.text, fontSize: 12, fontWeight: 500, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.title}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ background: lc + "20", border: "1px solid " + lc + "50", borderRadius: 10, fontSize: 9, color: lc, padding: "1px 6px" }}>{i.label}</span>
                        <span style={{ color: T.muted, fontSize: 10 }}>#{i.id} · {i.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {sel ? (
            <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: T.muted, fontSize: 11 }}>Issue #{sel.id}</span>
                <button onClick={() => closeIssue(sel.id)} style={{ background: T.greenBgMedium, border: `1px solid ${T.greenBorderMedium}`, borderRadius: 5, color: T.green, fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>
                  {sel.state === "open" ? "Close" : "Reopen"}
                </button>
              </div>
              <div style={{ color: T.text, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{sel.title}</div>
              <div style={{ color: T.subtleText, fontSize: 12, lineHeight: 1.7, marginBottom: 8 }}>{sel.body}</div>
              <div style={{ color: T.green, fontSize: 11, background: T.greenBgLight, border: `1px solid ${T.heroBannerBorder}`, borderRadius: 6, padding: "8px 10px" }}>
                In a PR, write: Fixes #{sel.id} to auto-close on merge
              </div>
            </div>
          ) : (
            <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
              <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>NEW ISSUE</div>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Issue title" style={{ width: "100%", background: T.inputBgDark, border: "1px solid " + T.border, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
              <select value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} style={{ width: "100%", background: T.inputBgFaint, border: "1px solid " + T.border, borderRadius: 6, padding: "6px 10px", color: T.text, fontSize: 11, outline: "none", marginBottom: 8, boxSizing: "border-box" }}>
                {ISSUE_LABELS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
              <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} placeholder="Describe the issue" rows={3} style={{ width: "100%", background: T.inputBgDark, border: "1px solid " + T.border, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 8 }} />
              <button onClick={create} style={{ width: "100%", background: T.greenBgMedium, border: `1px solid ${T.greenBorderMedium}`, borderRadius: 7, color: T.green, fontSize: 12, padding: 9, cursor: "pointer" }}>Submit Issue</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IssuesModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🐛" title="What are GitHub Issues?" color={T.red}>
        GitHub Issues is the built-in <strong style={{ color: T.red }}>task tracker</strong> for
        every repository. Developers use it to report bugs, request new features, ask questions,
        and track ongoing work. Every issue gets a number (#1, #2...) and you can reference it in
        commits and PRs — e.g.{" "}
        <code style={{ color: T.green }}>git commit -m "fix: resolve null pointer (closes #42)"</code>.
        <br /><br />
        When you write "closes #42" in a PR, GitHub automatically closes that issue when the PR is
        merged. This links your work to the problem it solved, giving your repo a clean, searchable
        history of decisions.
      </InfoBox>
      <InfoBox icon="📌" title="Why use Issues instead of a chat or email?" color={T.amber}>
        Chats disappear. Emails get buried. Issues stay permanently attached to the repo, fully
        searchable, and linked to the exact code that fixed them. Six months later, anyone can find{" "}
        <em>why</em> a decision was made — not just what was changed.
      </InfoBox>
      <SectionTitle>Issues Simulator</SectionTitle>
      <IssuesSimulator isMobile={isMobile} />
    </div>
  );
}



