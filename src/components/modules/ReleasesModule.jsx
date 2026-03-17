import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

function ReleasesSimulator({ isMobile }) {
  const [releases, setReleases] = useState([
    { tag: "v2.1.0", name: "The Performance Update", date: "2026-03-01", pre: false, notes: "- 40% faster loads\n- Fixed 12 bugs\n- New dark mode" },
    { tag: "v2.0.0", name: "Major Rewrite", date: "2026-02-01", pre: false, notes: "- Complete redesign\n- New auth\n- Breaking: API v1 removed" },
    { tag: "v2.2.0-beta", name: "Beta: AI Features", date: "2026-03-08", pre: true, notes: "- Experimental AI\n- Not for production" },
  ]);
  const [form, setForm] = useState({ tag: "", name: "", notes: "", pre: false });
  const [open, setOpen] = useState(false);

  const publish = () => {
    if (!form.tag.trim()) return;
    setReleases((r) => [{ ...form, date: new Date().toISOString().slice(0, 10) }, ...r]);
    setForm({ tag: "", name: "", notes: "", pre: false });
    setOpen(false);
  };

  return (
    <div>
      <InfoBox icon="📦" title="Releases — official versioned snapshots" color={T.amber}>
        A Release is a named, versioned snapshot of your repo at a specific tag. Use Semantic
        Versioning: MAJOR.MINOR.PATCH — bump MAJOR for breaking changes, MINOR for new features,
        PATCH for bug fixes.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {[{ bump: "MAJOR", ex: "v1.0.0 → v2.0.0", note: "Breaking change", c: T.red }, { bump: "MINOR", ex: "v1.0.0 → v1.1.0", note: "New feature", c: T.blue }, { bump: "PATCH", ex: "v1.0.0 → v1.0.1", note: "Bug fix only", c: T.green }].map((v) => (
          <div key={v.bump} style={{ background: v.c + "08", border: "1px solid " + v.c + "25", borderRadius: 8, padding: 10 }}>
            <div style={{ color: v.c, fontSize: 13, fontWeight: 700, fontFamily: "monospace", marginBottom: 4 }}>{v.bump}</div>
            <div style={{ color: T.subtleText, fontSize: 10, fontFamily: "monospace", marginBottom: 4 }}>{v.ex}</div>
            <div style={{ color: T.muted, fontSize: 10 }}>{v.note}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ color: T.muted, fontSize: 11, fontWeight: 700 }}>RELEASES</div>
            <button onClick={() => setOpen((o) => !o)} style={{ background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 5, color: T.green, fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>
              {open ? "Cancel" : "+ New"}
            </button>
          </div>
          {releases.map((r, i) => (
            <div key={i} style={{ background: T.card, border: "1px solid " + (r.pre ? "rgba(251,191,36,.3)" : T.border), borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ background: "rgba(74,222,128,.12)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 5, fontSize: 10, color: T.green, padding: "1px 7px", fontFamily: "monospace" }}>{r.tag}</span>
                {r.pre && <span style={{ background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 5, fontSize: 9, color: T.amber, padding: "1px 6px" }}>pre-release</span>}
                <span style={{ color: T.muted, fontSize: 10, marginLeft: "auto" }}>{r.date}</span>
              </div>
              <div style={{ color: T.text, fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{r.name}</div>
              <pre style={{ color: T.muted, fontSize: 10, margin: 0, fontFamily: "monospace", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.notes}</pre>
            </div>
          ))}
        </div>
        {open && (
          <div style={{ background: T.card, border: "1px solid rgba(74,222,128,.2)", borderRadius: 10, padding: 14 }}>
            <div style={{ color: T.green, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>CREATE RELEASE</div>
            <input value={form.tag} onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))} placeholder="Tag: v1.2.3" style={{ width: "100%", background: "rgba(6,11,24,.6)", border: "1px solid " + T.border, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Release title" style={{ width: "100%", background: "rgba(6,11,24,.6)", border: "1px solid " + T.border, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, outline: "none", marginBottom: 8, boxSizing: "border-box" }} />
            <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder={"What is new?\n- Feature\n- Fix"} rows={4} style={{ width: "100%", background: "rgba(6,11,24,.6)", border: "1px solid " + T.border, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 12, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 8 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={form.pre} onChange={(e) => setForm((p) => ({ ...p, pre: e.target.checked }))} style={{ accentColor: T.amber }} />
              <span style={{ color: T.subtleText, fontSize: 12 }}>Pre-release (beta/alpha)</span>
            </label>
            <button onClick={publish} style={{ width: "100%", background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 7, color: T.green, fontSize: 12, padding: 9, cursor: "pointer" }}>Publish Release</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReleasesModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="📦" title="What are GitHub Releases?" color={T.purple}>
        A GitHub Release is an official, versioned{" "}
        <strong style={{ color: T.purple }}>checkpoint in your project</strong> that you want to
        share with the world. It's more than just a tag — it includes release notes (a changelog),
        downloadable zip files of your source code, and optionally binary files like compiled
        executables or installers.
        <br /><br />
        Releases use <strong style={{ color: T.amber }}>semantic versioning</strong>:{" "}
        <code style={{ color: T.green }}>v1.2.3</code> where 1 is the major version (breaking
        changes), 2 is the minor version (new features), and 3 is the patch version (bug fixes).
        Users and dependency managers rely on these numbers to know if they can safely upgrade.
      </InfoBox>
      <InfoBox icon="🎯" title="When do you create a release?" color={T.blue}>
        Create a release when your software reaches a state worth announcing: first public version,
        a batch of new features, or an important security fix. For libraries and packages, every
        release becomes an installable version via npm, pip, or similar package managers.
      </InfoBox>
      <SectionTitle>Releases</SectionTitle>
      <ReleasesSimulator isMobile={isMobile} />
    </div>
  );
}
