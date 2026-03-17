import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

function CodeownersSim({ isMobile }) {
  const [rules, setRules] = useState([
    { pattern: "*", owners: "@alice @bob", note: "Default: review everything" },
    { pattern: "src/payments/", owners: "@payment-team", note: "Payment code" },
    { pattern: "*.md", owners: "@docs-team", note: "Documentation" },
    { pattern: ".github/", owners: "@devops", note: "CI and config" },
    { pattern: "src/auth/", owners: "@security-team", note: "Auth changes" },
  ]);
  const [testFile, setTestFile] = useState("src/payments/checkout.js");
  const [newR, setNewR] = useState({ pattern: "", owners: "" });

  const getMatch = (file) => {
    const hits = rules.filter((r) => {
      if (r.pattern === "*") return true;
      if (r.pattern.endsWith("/")) return file.startsWith(r.pattern);
      if (r.pattern.startsWith("*.")) return file.endsWith(r.pattern.slice(1));
      return file.includes(r.pattern);
    });
    return hits.length > 0 ? hits[hits.length - 1] : null;
  };

  const addRule = () => {
    if (!newR.pattern.trim() || !newR.owners.trim()) return;
    setRules((r) => [...r, { ...newR, note: "Custom rule" }]);
    setNewR({ pattern: "", owners: "" });
  };

  const matched = getMatch(testFile);

  return (
    <div>
      <InfoBox icon="👑" title="CODEOWNERS — auto-assign reviewers by file path" color={T.amber}>
        The CODEOWNERS file maps file patterns to GitHub users or teams. When a PR touches those
        files, those owners are automatically requested as reviewers. Combined with Branch
        Protection this ensures the right experts always review the right code.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ background: "rgba(6,11,24,.8)", borderBottom: "1px solid " + T.border, padding: "8px 14px" }}>
            <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}>.github/CODEOWNERS</span>
          </div>
          <div style={{ padding: 14 }}>
            {rules.map((r, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < rules.length - 1 ? "1px solid " + T.border : "none" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                  <code style={{ color: T.green, fontSize: 11, fontFamily: "monospace", flex: 1 }}>{r.pattern}</code>
                  <code style={{ color: T.blue, fontSize: 11, fontFamily: "monospace" }}>{r.owners}</code>
                </div>
                <div style={{ color: T.muted, fontSize: 10 }}>#{r.note}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input value={newR.pattern} onChange={(e) => setNewR((p) => ({ ...p, pattern: e.target.value }))} placeholder="src/feature/" style={{ flex: 1, background: "rgba(6,11,24,.6)", border: "1px solid " + T.border, borderRadius: 5, padding: "5px 8px", color: T.text, fontSize: 11, outline: "none", fontFamily: "monospace" }} />
              <input value={newR.owners} onChange={(e) => setNewR((p) => ({ ...p, owners: e.target.value }))} placeholder="@team" style={{ flex: 1, background: "rgba(6,11,24,.6)", border: "1px solid " + T.border, borderRadius: 5, padding: "5px 8px", color: T.text, fontSize: 11, outline: "none" }} />
              <button onClick={addRule} style={{ background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 5, color: T.green, fontSize: 10, padding: "5px 10px", cursor: "pointer" }}>+</button>
            </div>
          </div>
        </div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>WHO REVIEWS THIS FILE?</div>
          <input value={testFile} onChange={(e) => setTestFile(e.target.value)} placeholder="Type a file path" style={{ width: "100%", background: "rgba(6,11,24,.6)", border: "1px solid " + T.border, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, outline: "none", fontFamily: "monospace", boxSizing: "border-box", marginBottom: 10 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {["src/payments/checkout.js", "src/auth/login.js", "README.md", ".github/ci.yml", "src/utils/helper.js"].map((f) => (
              <button key={f} onClick={() => setTestFile(f)} style={{ background: testFile === f ? "rgba(96,165,250,.12)" : "rgba(13,21,38,.5)", border: "1px solid " + (testFile === f ? "rgba(96,165,250,.3)" : T.border), borderRadius: 5, color: testFile === f ? T.blue : T.muted, fontSize: 10, padding: "3px 8px", cursor: "pointer" }}>
                {f.split("/").pop()}
              </button>
            ))}
          </div>
          {matched ? (
            <div style={{ background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 8, padding: 12 }}>
              <div style={{ color: T.green, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Matched: {matched.pattern}</div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Auto-assigned reviewers:</div>
              <div>{matched.owners.split(" ").map((o) => (
                <span key={o} style={{ display: "inline-block", background: "rgba(96,165,250,.12)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 12, fontSize: 11, color: T.blue, padding: "3px 10px", margin: "2px" }}>{o}</span>
              ))}</div>
            </div>
          ) : (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>No match — no auto-reviewer</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CodeownersModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="👑" title="What is CODEOWNERS?" color={T.amber}>
        The <code style={{ color: T.green }}>CODEOWNERS</code> file tells GitHub:{" "}
        <em>"whenever someone changes this part of the codebase, automatically request a review
        from these specific people."</em> You define ownership by file path or folder — so the
        payments team automatically reviews changes to{" "}
        <code style={{ color: T.green }}>src/payments/</code>, and the security team reviews any{" "}
        <code style={{ color: T.green }}>*.env</code> config changes.
        <br /><br />
        This eliminates the manual step of "remember to add the right reviewers" — GitHub does it
        for you the moment a PR is opened.
      </InfoBox>
      <InfoBox icon="🔍" title="Why does ownership matter?" color={T.blue}>
        In a large codebase, no one person understands every file. Code owners are the domain
        experts for their section. When their area changes, they need to know — not just to review
        quality, but because only they understand the subtle implications of a change. CODEOWNERS
        makes sure that knowledge is automatically involved in every review.
      </InfoBox>
      <SectionTitle>CODEOWNERS</SectionTitle>
      <CodeownersSim isMobile={isMobile} />
    </div>
  );
}
