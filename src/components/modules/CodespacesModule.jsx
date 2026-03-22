import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

function CodespacesSim({ isMobile }) {
  const [phase, setPhase] = usePageState("phase", "idle");
  const [log, setLog] = usePageState("log", []);

  const boot = () => {
    setPhase("booting");
    setLog([]);
    const steps = [
      [300, "info", "Step 1 ─ GitHub reserves a computer (virtual machine) in the cloud..."],
      [900, "ok", "Step 2 ─ VM is ready (4-core CPU, 8 GB RAM, Linux)"],
      [1400, "ok", "Step 3 ─ Your repository is cloned onto that machine"],
      [2000, "ok", "Step 4 ─ devcontainer.json is read — setting up the environment"],
      [2600, "ok", "Step 5 ─ npm install: all packages installed automatically"],
      [3100, "ok", "Step 6 ─ Ports 3000 & 5173 forwarded so browser can reach your app"],
      [3500, "ok", "Step 7 ─ VS Code Server launched on the cloud machine"],
      [3700, "done", "Step 8 ─ Your browser connects — VS Code is now running in the cloud!"],
    ];
    steps.forEach(([delay, type, msg]) =>
      setTimeout(() => {
        setLog((l) => [...l, { type, msg }]);
        if (type === "done") setPhase("ready");
      }, delay)
    );
  };

  const lc = { info: T.blue, ok: T.terminalOk, done: T.green };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: T.redBgSubtle, border: `1px solid ${T.redBorderLight}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.red, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>😩 WITHOUT CODESPACES</div>
          {["Install Node.js", "Install Git", "Install VS Code", "Clone the repo", "Run npm install", "Debug why it works on their PC but not yours", "30–90 minutes before you can write a single line of code"].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ color: T.red, fontSize: 11, flexShrink: 0, marginTop: 1 }}>✗</span>
              <span style={{ color: T.subtleText, fontSize: 12 }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ background: T.greenBgLight, border: `1px solid ${T.greenBorderLight}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.green, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>🚀 WITH CODESPACES</div>
          {["Open the repo on GitHub", "Click Code → Codespaces → New codespace", "Wait ~30 seconds", "VS Code opens in your browser, fully ready", "Start coding immediately — from any device"].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ color: T.green, fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: T.subtleText, fontSize: 12 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>📄 .devcontainer/devcontainer.json</div>
          <div style={{ color: T.subtleText, fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
            This file tells Codespaces exactly how to set up your environment. Think of it as a{" "}
            <span style={{ color: T.amber, fontWeight: 600 }}>recipe card</span> — it lists the
            operating system, tools to install, and commands to run when the space starts.
          </div>
          <pre style={{ margin: 0, background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.subtleText, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{`{
  // Which OS + runtime to use
  "image": "node:20",

  // Open these ports so you can view your app
  "forwardPorts": [3000],

  // Run this command once the space starts
  "postCreateCommand": "npm install",

  // Install VS Code extensions automatically
  "customizations": {
    "vscode": {
      "extensions": ["esbenp.prettier-vscode"]
    }
  }
}`}</pre>
        </div>

        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>⚡ WHAT HAPPENS WHEN YOU CLICK "NEW CODESPACE"</div>
          <div style={{ color: T.muted, fontSize: 11, marginBottom: 10 }}>Watch the steps GitHub takes behind the scenes:</div>
          <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, height: 190, overflowY: "auto", marginBottom: 12, scrollbarWidth: "thin" }}>
            {log.length === 0 && phase === "idle" && (
              <div style={{ color: T.muted, fontSize: 11, textAlign: "center", paddingTop: 60 }}>Press the button below to simulate the boot</div>
            )}
            {log.map((l, i) => (
              <div key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: lc[l.type] || T.muted, lineHeight: 1.8 }}>
                {l.type === "ok" || l.type === "done" ? "✓ " : "→ "}{l.msg}
              </div>
            ))}
          </div>
          {phase !== "ready" ? (
            <button onClick={boot} disabled={phase === "booting"} style={{ width: "100%", background: T.tealBgLight, border: `1px solid ${T.tealBorderLight}`, borderRadius: 7, color: T.teal, fontSize: 12, padding: 10, cursor: phase === "idle" ? "pointer" : "default", fontWeight: 600 }}>
              {phase === "booting" ? "Setting up your Codespace…" : "▶  Simulate: New Codespace"}
            </button>
          ) : (
            <div>
              <div style={{ background: T.greenBgSmall, border: `1px solid ${T.greenBorderLight}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                <div style={{ color: T.green, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🎉 Codespace is live!</div>
                <div style={{ color: T.subtleText, fontSize: 11, marginBottom: 6 }}>Your VS Code editor is now running in the cloud. You would open it at:</div>
                <code style={{ color: T.blue, fontSize: 10, fontFamily: "monospace", wordBreak: "break-all" }}>https://your-username-repo-name-abc123.github.dev</code>
              </div>
              <button onClick={() => { setPhase("idle"); setLog([]); }} style={{ width: "100%", background: T.resetBg, border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, fontSize: 12, padding: 9, cursor: "pointer" }}>↺ Reset</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CodespacesModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="💻" title="What is GitHub Codespaces?" color={T.teal}>
        Normally, before writing any code on a project, you have to spend time installing tools on
        your computer — Node.js, Git, certain VS Code extensions, and so on. This is slow, and
        things often break depending on what computer you're using.
        <br /><br />
        <strong style={{ color: T.teal }}>Codespaces solves this.</strong> It gives you a complete,
        ready-to-use coding environment that runs in the cloud (on GitHub's servers), and you
        access it through your browser. Your own computer doesn't need anything installed — not
        even VS Code.
      </InfoBox>
      <InfoBox icon="🖥️" title="The simple analogy" color={T.amber}>
        Imagine going to a library and sitting at one of their computers. It's already set up with
        everything you need. You just sit down and start working — you don't carry it home, you
        don't install anything, and anyone can use it from any device.
        <br /><br />
        That's Codespaces. The "library computer" is a cloud server. Your "seat" is a browser tab.
      </InfoBox>
      <SectionTitle>WITHOUT vs WITH CODESPACES</SectionTitle>
      <CodespacesSim isMobile={isMobile} />
      <SectionTitle>When should you use it?</SectionTitle>
      {[
        { cmd: "Trying out a project you found on GitHub", desc: "No need to install anything — open a Codespace, explore the code, close the tab when done", detail: "Perfect for evaluating open-source projects or following tutorials. Zero cleanup needed on your own machine.", example: "Like test-driving a car without owning it 🚗" },
        { cmd: "Working on a team project", desc: "Everyone gets the exact same environment — no more 'it works on my machine'", detail: "The devcontainer.json file describes the setup once. Every teammate who opens a Codespace gets an identical environment automatically.", example: "Everyone uses the same recipe → everyone gets the same dish 🍳" },
        { cmd: "Coding from a tablet, school computer, or borrowed device", desc: "All you need is a browser — Codespaces runs on GitHub's servers", detail: "Your code and environment live in the cloud. Log into GitHub from any device, open your Codespace, and continue exactly where you left off.", example: "Your work follows you everywhere, like cloud saved games 🎮" },
        { cmd: "Onboarding a new developer", desc: "New team members can start contributing in minutes, not hours", detail: "Without Codespaces, setting up a dev environment can take half a day and involve many frustrating steps. With Codespaces it's one click.", example: "Starting a new job and your desk is already set up perfectly 🏢" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}



