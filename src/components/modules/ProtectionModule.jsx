import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

function ProtectionSim({ isMobile }) {
  const [rules, setRules] = useState({ pr: true, approvals: 1, ci: true, noForce: true, noDel: true, upToDate: false, signed: false });
  const [scenarioId, setScenarioId] = useState(null);
  const toggle = (k) => setRules((r) => ({ ...r, [k]: !r[k] }));

  const SCENARIOS = [
    { id: "push", label: "Push directly to main", passes: !rules.pr, why: "Requires a pull request first" },
    { id: "noci", label: "Merge PR with failing CI", passes: !rules.ci, why: "All CI checks must pass" },
    { id: "self", label: "Merge your own PR", passes: rules.approvals === 0, why: "Need " + rules.approvals + " approval(s) from someone else" },
    { id: "force", label: "git push --force to main", passes: !rules.noForce, why: "Force pushes are blocked" },
    { id: "del", label: "Delete the main branch", passes: !rules.noDel, why: "Branch deletion is locked" },
  ];
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || null;

  return (
    <div>
      <InfoBox icon="🔒" title="Branch Protection — guardrails for main" color={T.purple}>
        Branch Protection Rules enforce quality gates. No one — not even the repo owner — can
        bypass them. Every change to main must be reviewed, tested, and approved. This is how
        every serious team ships safely.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>RULES FOR: main</div>
          {[
            { k: "pr", label: "Require pull request before merging" },
            { k: "ci", label: "Require CI status checks to pass" },
            { k: "noForce", label: "Block force pushes" },
            { k: "noDel", label: "Prevent branch deletion" },
            { k: "upToDate", label: "Require branch up to date" },
            { k: "signed", label: "Require signed commits" },
          ].map((r) => (
            <div key={r.k} onClick={() => toggle(r.k)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: rules[r.k] ? "rgba(74,222,128,.3)" : "rgba(30,41,64,.5)", border: "1px solid " + (rules[r.k] ? "rgba(74,222,128,.5)" : T.border), position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: rules[r.k] ? 18 : 2, width: 14, height: 14, borderRadius: "50%", background: rules[r.k] ? T.green : T.muted, transition: "left .2s" }} />
              </div>
              <span style={{ color: rules[r.k] ? T.text : T.subtleText, fontSize: 12 }}>{r.label}</span>
            </div>
          ))}
          {rules.pr && (
            <div style={{ paddingTop: 10, borderTop: "1px solid " + T.border }}>
              <div style={{ color: T.subtleText, fontSize: 11, marginBottom: 6 }}>Required approvals: <span style={{ color: T.green }}>{rules.approvals}</span></div>
              <input type="range" min={0} max={4} value={rules.approvals} onChange={(e) => setRules((r) => ({ ...r, approvals: Number(e.target.value) }))} style={{ width: "100%", accentColor: T.green }} />
            </div>
          )}
        </div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>TEST YOUR RULES</div>
          {SCENARIOS.map((s) => (
            <button key={s.id} onClick={() => setScenarioId(s.id)} style={{ display: "block", width: "100%", background: scenario && scenario.id === s.id ? (s.passes ? "rgba(74,222,128,.1)" : "rgba(248,113,113,.1)") : "rgba(13,21,38,.5)", border: "1px solid " + (scenario && scenario.id === s.id ? (s.passes ? "rgba(74,222,128,.3)" : "rgba(248,113,113,.3)") : T.border), borderRadius: 7, padding: "9px 12px", color: T.text, textAlign: "left", cursor: "pointer", marginBottom: 7, fontSize: 12 }}>
              {s.label}
            </button>
          ))}
          {scenario && (
            <div style={{ marginTop: 10, background: scenario.passes ? "rgba(74,222,128,.06)" : "rgba(248,113,113,.06)", border: "1px solid " + (scenario.passes ? "rgba(74,222,128,.2)" : "rgba(248,113,113,.2)"), borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ color: scenario.passes ? T.green : T.red, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                {scenario.passes ? "ALLOWED" : "BLOCKED"}
              </div>
              <div style={{ color: T.subtleText, fontSize: 11 }}>{scenario.passes ? "Permitted by current rules." : scenario.why}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProtectionModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🔒" title="What is Branch Protection?" color={T.red}>
        Branch protection rules are{" "}
        <strong style={{ color: T.red }}>safety guardrails for your most important branches</strong>.
        Without them, anyone with write access can push directly to{" "}
        <code style={{ color: T.green }}>main</code>, force-push over history, or delete the branch
        entirely — accidentally or intentionally.
        <br /><br />
        With protection rules, you can require: every change goes through a PR, at least one
        reviewer approves it, all automated tests pass, and no one can force-push. The branch only
        changes in ways your team deliberately agreed on.
      </InfoBox>
      <InfoBox icon="🏢" title="Real-world analogy" color={T.amber}>
        Think of <code style={{ color: T.green }}>main</code> as the master recording in a music
        studio. Junior engineers can record on their own tracks all day. But overwriting the master
        requires sign-off from the lead producer AND a quality check. Branch protection is that
        sign-off process.
      </InfoBox>
      <SectionTitle>Branch Protection</SectionTitle>
      <ProtectionSim isMobile={isMobile} />
    </div>
  );
}
