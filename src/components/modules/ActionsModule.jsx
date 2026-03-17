import T from "../../constants/tokens";
import { CopyBtn } from "../shared";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard } from "../shared";

export default function ActionsModule() {
  const fullYaml = `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  test:
    name: 🧪 Test & Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage

  build:
    name: 🏗️ Build
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci && npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist/ }

  deploy:
    name: 🚀 Deploy to Production
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist, path: dist/ }
      - run: npx vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}`;

  return (
    <div>
      <InfoBox icon="🤖" title="GitHub Actions — Your Robot Army" color={T.amber}>
        Actions are YAML files in <code style={{ color: T.green }}>.github/workflows/</code>.
        Every push, PR, or schedule can trigger a workflow. Robots then test, build, lint,
        deploy, send notifications — all automatically. This is{" "}
        <strong style={{ color: T.amber }}>CI/CD</strong> (Continuous Integration / Continuous
        Deployment).
      </InfoBox>
      <ConceptDiagram>{`  Event Trigger (push to main)
         │
         ▼
  GitHub Actions Runner (ubuntu-latest VM spins up)
         │
         ├─► Job: test   → install → run tests → report
         ├─► Job: lint   → eslint → format check
         └─► Job: deploy → build → push to server
                              │
                         (only if test passes)
                              │
                              ▼
                         🚀 Your app is live!`}</ConceptDiagram>
      <SectionTitle>Complete CI/CD Workflow</SectionTitle>
      <div style={{ background: "#050b13", border: "1px solid #1a2540", borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: T.amber, fontSize: 11, fontWeight: 700, letterSpacing: ".08em" }}>📄 .github/workflows/ci.yml</span>
          <CopyBtn text={fullYaml} />
        </div>
        <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.subtleText, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {`name: CI/CD Pipeline

on:                                 `}<span style={{ color: T.blue }}>← triggers</span>{`
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest          `}<span style={{ color: T.blue }}>← clean VM spins up</span>{`
    steps:
      - uses: actions/checkout@v4   `}<span style={{ color: T.blue }}>← clone your code</span>{`
      - run: npm ci                 `}<span style={{ color: T.blue }}>← install deps</span>{`
      - run: npm test               `}<span style={{ color: T.blue }}>← run your tests</span>{`

  deploy:
    needs: test                     `}<span style={{ color: T.blue }}>← only runs if test passes</span>{`
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npx vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}`}
        </pre>
      </div>
      <SectionTitle>Useful Action Commands</SectionTitle>
      {[
        { cmd: "gh workflow list", desc: "List all workflow files", detail: "Shows all .github/workflows/*.yml files and their status.", example: "" },
        { cmd: "gh workflow run ci.yml", desc: "Manually trigger a workflow", detail: "Some workflows use 'on: workflow_dispatch' to allow manual triggers.", example: "" },
        { cmd: "gh run list", desc: "List recent workflow runs", detail: "Shows status of latest runs for the current repo.", example: "" },
        { cmd: "gh run watch", desc: "Watch a running workflow in real-time", detail: "Streams the logs as the workflow runs. Same as watching it on GitHub.com.", example: "" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
