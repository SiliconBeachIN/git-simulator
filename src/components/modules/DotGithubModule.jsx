import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

const DG_FILES = {
  "CODEOWNERS": { desc: "Auto-assign PR reviewers by file path", c: T.amber, txt: "*                   @lead-dev\nsrc/payments/       @payment-team\n*.md                @docs-team\n.github/            @devops" },
  "PR_TEMPLATE.md": { desc: "Default template when opening a PR", c: T.blue, txt: "## What does this PR do?\n\n## How to test\n1. Step one\n2. Step two\n\n## Checklist\n- [ ] Tests added\n- [ ] No secrets committed" },
  "ISSUE_TEMPLATE/bug.md": { desc: "Template for bug reports", c: T.red, txt: "name: Bug Report\nlabels: bug\n\n## Describe the bug\n\n## Steps to reproduce\n1.\n2.\n\n## Expected behaviour" },
  "workflows/ci.yml": { desc: "CI pipeline — runs on every push", c: T.green, txt: "name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test" },
  "dependabot.yml": { desc: "Auto-open PRs for dep updates", c: T.purple, txt: "version: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: weekly" },
  "SECURITY.md": { desc: "How to report vulnerabilities", c: T.red, txt: "# Security Policy\n\n## Reporting a Vulnerability\nPlease email security@yourproject.com\nDo NOT open a public issue for security bugs." },
  "CONTRIBUTING.md": { desc: "How to contribute to the project", c: T.teal, txt: "# Contributing\n\n1. Fork the repo\n2. Create branch: git switch -c feature/my-thing\n3. Commit: git commit -m 'feat: add thing'\n4. Push and open a Pull Request" },
};

function DotGithubExplorer({ isMobile }) {
  const [sel, setSel] = usePageState("sel", "CODEOWNERS");
  const file = DG_FILES[sel];
  return (
    <div>
      <InfoBox icon="📂" title="The .github folder — your repo control panel" color={T.blue}>
        The .github/ folder is a special directory that GitHub reads to configure your repository
        behaviour. This is not app code — it is instructions for GitHub itself. PR templates,
        Actions, issue forms, and security policies all live here.
      </InfoBox>
      <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ background: T.surface, padding: "8px 14px", borderBottom: `1px solid ${T.border}` }}>
          <code style={{ color: T.muted, fontSize: 11 }}>📂 .github/</code>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", minHeight: 280 }}>
          <div style={{ borderRight: isMobile ? "none" : `1px solid ${T.border}`, borderBottom: isMobile ? `1px solid ${T.border}` : "none", padding: 10, overflowY: "auto" }}>
            {Object.entries(DG_FILES).map(([name, f]) => (
              <div key={name} onClick={() => setSel(name)} style={{ background: sel === name ? f.c + "12" : T.cardBgInactive, border: "1px solid " + (sel === name ? f.c + "40" : "transparent"), borderRadius: 6, padding: "8px 10px", cursor: "pointer", marginBottom: 5 }}>
                <div style={{ color: sel === name ? f.c : T.linkColor, fontSize: 10, fontFamily: "monospace", marginBottom: 3 }}>{name}</div>
                <div style={{ color: T.muted, fontSize: 9 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, overflowY: "auto" }}>
            <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.subtleText, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{file.txt}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DotGithubModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="📂" title="What is the .github folder?" color={T.blue}>
        The <code style={{ color: T.green }}>.github/</code> folder is a special directory that
        GitHub recognises and acts on. It's where you store repository configuration that GitHub —
        not your app code — reads and uses. Think of it as instructions you leave for GitHub itself.
        <br /><br />
        It can contain: <strong style={{ color: T.amber }}>GitHub Actions workflows</strong>{" "}
        (.github/workflows/), <strong style={{ color: T.green }}>Issue templates</strong>{" "}
        (.github/ISSUE_TEMPLATE/), <strong style={{ color: T.blue }}>PR templates</strong>{" "}
        (.github/pull_request_template.md), <strong style={{ color: T.purple }}>CODEOWNERS</strong>,
        and <strong style={{ color: T.teal }}>Dependabot config</strong>. Everything in this folder
        shapes how your team and GitHub bots interact with the repo.
      </InfoBox>
      <InfoBox icon="📉" title="Why centralise it here?" color={T.green}>
        Keeping all GitHub-specific configuration in one folder separates it cleanly from your
        application code. New contributors immediately know where to look for how the project's
        development workflows are configured. It's also version-controlled like everything else —
        so changes to your CI pipeline have a full audit trail in git history.
      </InfoBox>
      <SectionTitle>.github Folder Explorer</SectionTitle>
      <DotGithubExplorer isMobile={isMobile} />
    </div>
  );
}



