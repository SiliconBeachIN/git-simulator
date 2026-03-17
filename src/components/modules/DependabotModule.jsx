import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

function DependabotSim({ isMobile }) {
  const [deps, setDeps] = useState([
    { name: "react", cur: "18.2.0", lat: "19.1.0", type: "major", sev: "none", pr: false },
    { name: "axios", cur: "1.6.0", lat: "1.7.2", type: "minor", sev: "none", pr: false },
    { name: "lodash", cur: "4.17.15", lat: "4.17.21", type: "patch", sev: "high", pr: false },
    { name: "express", cur: "4.18.0", lat: "4.19.2", type: "minor", sev: "medium", pr: false },
    { name: "@babel/core", cur: "7.22.0", lat: "7.24.5", type: "minor", sev: "none", pr: false },
  ]);
  const openPR = (name) => setDeps((d) => d.map((dep) => (dep.name === name ? { ...dep, pr: true } : dep)));
  const openAll = () => setDeps((d) => d.map((dep) => ({ ...dep, pr: true })));
  const sc = (s) => ({ high: T.red, medium: T.amber, none: T.muted })[s] || T.muted;
  const tc = (t) => ({ major: T.red, minor: T.blue, patch: T.green })[t] || T.muted;

  return (
    <div>
      <InfoBox icon="🤖" title="Dependabot — automated security guardian" color={T.purple}>
        Dependabot scans your package.json for outdated or vulnerable dependencies and automatically
        opens a PR to update them — complete with changelog. Just review and merge. Configure in
        .github/dependabot.yml.
      </InfoBox>
      <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: T.muted, fontSize: 11, fontWeight: 700 }}>DEPENDENCY SCAN</span>
          <button onClick={openAll} style={{ background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.25)", borderRadius: 5, color: T.purple, fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>Open All PRs</button>
        </div>
        {deps.map((d) => (
          <div key={d.name} style={{ padding: "11px 14px", borderBottom: "1px solid " + T.border, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <code style={{ color: T.text, fontSize: 12, fontFamily: "monospace", width: isMobile ? "auto" : 120, flexShrink: 0 }}>{d.name}</code>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
              <span style={{ color: T.muted, fontSize: 11, fontFamily: "monospace" }}>{d.cur}</span>
              <span style={{ color: T.muted }}>→</span>
              <span style={{ color: tc(d.type), fontSize: 11, fontFamily: "monospace", fontWeight: 600 }}>{d.lat}</span>
              <span style={{ background: tc(d.type) + "15", border: "1px solid " + tc(d.type) + "35", borderRadius: 8, fontSize: 9, color: tc(d.type), padding: "1px 6px" }}>{d.type}</span>
              {d.sev !== "none" && <span style={{ background: sc(d.sev) + "15", border: "1px solid " + sc(d.sev) + "35", borderRadius: 8, fontSize: 9, color: sc(d.sev), padding: "1px 6px" }}>vuln: {d.sev}</span>}
            </div>
            {d.pr ? (
              <span style={{ color: T.green, fontSize: 11 }}>PR opened</span>
            ) : (
              <button onClick={() => openPR(d.name)} style={{ background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 5, color: T.green, fontSize: 10, padding: "3px 10px", cursor: "pointer" }}>Open PR</button>
            )}
          </div>
        ))}
      </div>
      {deps.some((d) => d.pr) && (
        <div style={{ background: "rgba(74,222,128,.04)", border: "1px solid rgba(74,222,128,.15)", borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.green, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>OPENED PRs</div>
          {deps.filter((d) => d.pr).map((d) => (
            <div key={d.name} style={{ color: "#94a3b8", fontSize: 11, padding: "5px 0", borderBottom: "1px solid " + T.border, fontFamily: "monospace" }}>
              chore(deps): bump {d.name} from {d.cur} to {d.lat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DependabotModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🤖" title="What is Dependabot?" color={T.green}>
        Almost every project uses third-party libraries (dependencies like React, Express, or
        NumPy). Those libraries release updates constantly — some adding features, some fixing
        bugs, and some patching{" "}
        <strong style={{ color: T.red }}>critical security vulnerabilities</strong>. Keeping up
        with them manually is tedious and easy to forget.
        <br /><br />
        <strong style={{ color: T.green }}>Dependabot</strong> is a GitHub bot that watches your
        dependencies for you. When it finds an outdated or vulnerable package, it automatically
        opens a Pull Request to update it — with a clear description of what changed and why. You
        review and merge. No manual checking needed.
      </InfoBox>
      <InfoBox icon="🛡️" title="Security alerts vs version updates" color={T.amber}>
        Dependabot does two separate jobs.{" "}
        <strong style={{ color: T.red }}>Security alerts</strong> fire immediately when a
        dependency has a known CVE (Common Vulnerabilities and Exposures) — these are urgent.{" "}
        <strong style={{ color: T.amber }}>Version updates</strong> run on a schedule
        (daily/weekly) and keep your dependencies generally up to date. You configure both in{" "}
        <code style={{ color: T.green }}>.github/dependabot.yml</code>.
      </InfoBox>
      <SectionTitle>Dependabot</SectionTitle>
      <DependabotSim isMobile={isMobile} />
    </div>
  );
}
