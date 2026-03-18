import T from "../../constants/tokens";
import { CopyBtn, InfoBox, SectionTitle, CommandCard } from "../shared";

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
    
      <SectionTitle>Complete CI/CD Workflow</SectionTitle>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
        <div style={{ color: T.text, fontSize: 12, lineHeight: 1.8, marginBottom: 10 }}>
          Imagine GitHub Actions like a tiny robot helper. You tell it what to do in a file,
          and it does the same thing every time.
        </div>
        <div style={{ color: T.subtleText, fontSize: 12, lineHeight: 1.8, marginBottom: 12 }}>
          1. Open your project on GitHub.
          <br />
          2. Create folder: <code style={{ color: T.green }}>.github/workflows</code>
          <br />
          3. Create file: <code style={{ color: T.green }}>ci.yml</code>
          <br />
          4. Paste the code below.
          <br />
          5. Commit and push to <code style={{ color: T.green }}>main</code>.
          <br />
          6. Go to the <strong style={{ color: T.amber }}>Actions</strong> tab and watch your robot run.
        </div>
        <div style={{ background: T.terminalBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: T.amber, fontSize: 11, fontWeight: 700 }}>ci.yml</span>
            <CopyBtn text={fullYaml} />
          </div>
          <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.subtleText, lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre-wrap" }}>
            {fullYaml}
          </pre>
        </div>
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
