import { useState } from "react";
import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import Tr from "../shared/Tr";
import { InfoBox, SectionTitle } from "../shared";

function PagesSimulator({ isMobile }) {
  const [source, setSource] = usePageState("source", "branch");
  const [step, setStep] = usePageState("step", 0);
  const [deployed, setDeployed] = usePageState("deployed", false);
  const [building, setBuilding] = useState(false);

  const deploy = () => {
    if (step < 3) return;
    setBuilding(true);
    setTimeout(() => { setBuilding(false); setDeployed(true); setStep(4); }, 2000);
  };

  const resetPages = () => {
    setSource("branch"); setStep(0); setDeployed(false); setBuilding(false);
  };

  const steps = [
    { label: "Choose source", done: step > 0 },
    { label: "Configure branch", done: step > 1 },
    { label: "Commit your site", done: step > 2 },
    { label: "Push to GitHub", done: step > 3 },
    { label: "Site is live!", done: deployed },
  ];

  return (
    <div>
      <InfoBox icon="🌍" title="GitHub Pages — free website hosting from your repo" color={T.green}>
        GitHub Pages publishes any static site directly from a branch or folder. Your URL will be
        username.github.io/repo-name — free, HTTPS included, worldwide CDN. Perfect for portfolios,
        documentation sites, and project demos.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>CONFIGURE PAGES</div>
          {[{ v: "branch", l: "Deploy from branch" }, { v: "actions", l: "GitHub Actions workflow" }].map((opt) => (
            <label key={opt.v} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
              <input type="radio" checked={source === opt.v} onChange={() => { setSource(opt.v); setStep((s) => Math.max(s, 1)); }} style={{ accentColor: T.green }} />
              <span style={{ color: T.text, fontSize: 12 }}><Tr>{opt.l}</Tr></span>
            </label>
          ))}
          <div style={{ height: 12 }} />
          <button onClick={() => setStep((s) => Math.min(s + 1, 3))} disabled={step >= 3} style={{ width: "100%", background: T.greenBgLight, border: `1px solid ${T.greenBorderLight}`, borderRadius: 6, color: step >= 3 ? T.muted : T.green, fontSize: 11, padding: 8, cursor: step >= 3 ? "default" : "pointer", marginBottom: 8 }}>
            {step === 0 ? <Tr>Save — Configure Branch</Tr> : step === 1 ? <Tr>Save — Commit Your Site</Tr> : step === 2 ? <Tr>Save — Push to GitHub</Tr> : <Tr>Settings Saved ✓</Tr>}
          </button>
          <button onClick={deploy} disabled={step < 3 || deployed || building} style={{ width: "100%", background: deployed ? T.greenBgMedium : T.blueBgLight, border: "1px solid " + (deployed ? T.greenBorderStrong : T.blueBorderMedium), borderRadius: 6, color: deployed ? T.green : T.blue, fontSize: 11, padding: 8, cursor: (step < 3 || deployed || building) ? "default" : "pointer" }}>
            {building ? <Tr>Building...</Tr> : deployed ? <Tr>Site is Live!</Tr> : <Tr>Deploy Site</Tr>}
          </button>
        </div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>DEPLOYMENT STEPS</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.done ? T.stepActiveBg : T.stepInactiveBg, border: "1px solid " + (s.done ? T.green : T.border), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: s.done ? T.green : T.muted, flexShrink: 0 }}>
                {s.done ? "✓" : i + 1}
              </div>
              <span style={{ color: s.done ? T.text : T.muted, fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
          {deployed && (
            <div style={{ marginTop: 10 }}>
              <div style={{ background: T.greenBgSmall, border: `1px solid ${T.greenBorderLight}`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                <div style={{ color: T.green, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>🎉 Your site is live:</div>
                <div style={{ color: T.blue, fontSize: 12, fontFamily: "monospace" }}>username.github.io/my-project</div>
              </div>
              <button onClick={resetPages} style={{ width: "100%", background: T.resetBg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.muted, fontSize: 11, padding: 7, cursor: "pointer" }}>↺ Reset</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PagesModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🌍" title="What is GitHub Pages?" color={T.teal}>
        GitHub Pages is a{" "}
        <strong style={{ color: T.teal }}>free static website hosting service</strong> built into
        every GitHub repository. You push HTML, CSS, and JavaScript files to a specific branch —
        GitHub builds and serves them at{" "}
        <code style={{ color: T.green }}>https://username.github.io/repo-name</code>. No server
        setup, no hosting fees, no deployment commands.
        <br /><br />
        It's perfect for: personal portfolios, project documentation sites, open source project
        landing pages, and demo deployments of frontend apps.
      </InfoBox>
      <InfoBox icon="📚" title="What can it NOT host?" color={T.amber}>
        GitHub Pages only serves <strong style={{ color: T.amber }}>static files</strong> —
        pre-built HTML/CSS/JS. It cannot run a backend server, execute Python or Node.js, or
        connect to a database. For those you need platforms like Vercel, Render, or Railway.
        But for a portfolio or documentation site, Pages is all you need.
      </InfoBox>
      <SectionTitle>GitHub Pages</SectionTitle>
      <PagesSimulator isMobile={isMobile} />
    </div>
  );
}



