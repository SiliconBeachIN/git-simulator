import { useState } from "react";
import T from "../../constants/tokens";
import { InfoBox, SectionTitle } from "../shared";

const API_EX = [
  { label: "Get a repo", method: "GET", path: "/repos/torvalds/linux", resp: { id: 2325298, name: "linux", stargazers_count: 180000, language: "C", default_branch: "master" } },
  { label: "List issues", method: "GET", path: "/repos/facebook/react/issues", resp: [{ number: 28942, title: "useEffect cleanup issue", state: "open" }, { number: 28940, title: "React 19 migration guide", state: "open" }] },
  { label: "List branches", method: "GET", path: "/repos/vercel/next.js/branches", resp: [{ name: "main", protected: true }, { name: "canary", protected: true }] },
  { label: "Create an issue", method: "POST", path: "/repos/owner/repo/issues", resp: { number: 43, title: "New feature request", state: "open" } },
  { label: "Get user info", method: "GET", path: "/users/torvalds", resp: { login: "torvalds", name: "Linus Torvalds", public_repos: 8, followers: 226000 } },
];

function APIExplorer({ isMobile }) {
  const [sel, setSel] = useState(0);
  const ex = API_EX[sel];
  const isGet = ex.method === "GET";
  const methodStyle = { background: isGet ? "rgba(74,222,128,.15)" : "rgba(96,165,250,.15)", border: "1px solid " + (isGet ? "rgba(74,222,128,.3)" : "rgba(96,165,250,.3)"), borderRadius: 4, fontSize: 10, fontWeight: 700, color: isGet ? T.green : T.blue, padding: "2px 7px", fontFamily: "monospace" };

  return (
    <div>
      <InfoBox icon="🔌" title="The GitHub REST API — control GitHub with code" color={T.teal}>
        Every GitHub action in the browser can be done via HTTP requests. Base URL: api.github.com.
        Authenticate with a Personal Access Token. Powers bots, dashboards, and integrations.
      </InfoBox>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: 12 }}>
        <div>
          <div style={{ color: T.muted, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>EXAMPLES</div>
          {API_EX.map((e, i) => {
            const eg = e.method === "GET";
            return (
              <button key={i} onClick={() => setSel(i)} style={{ display: "block", width: "100%", background: i === sel ? "rgba(45,212,191,.08)" : T.card, border: "1px solid " + (i === sel ? "rgba(45,212,191,.3)" : T.border), borderRadius: 7, padding: "9px 12px", textAlign: "left", cursor: "pointer", marginBottom: 6 }}>
                <span style={{ background: eg ? "rgba(74,222,128,.15)" : "rgba(96,165,250,.15)", border: "1px solid " + (eg ? "rgba(74,222,128,.3)" : "rgba(96,165,250,.3)"), borderRadius: 4, fontSize: 9, color: eg ? T.green : T.blue, padding: "1px 6px", fontFamily: "monospace", marginRight: 7 }}>{e.method}</span>
                <span style={{ color: i === sel ? T.text : T.subtleText, fontSize: 11 }}>{e.label}</span>
              </button>
            );
          })}
        </div>
        <div>
          <div style={{ background: "#050b13", border: "1px solid #1a2540", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ background: T.surface, padding: "8px 14px", borderBottom: "1px solid #1a2540", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={methodStyle}>{ex.method}</span>
              <code style={{ color: T.subtleText, fontSize: 11, wordBreak: "break-all" }}>https://api.github.com{ex.path}</code>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>RESPONSE JSON</div>
              <pre style={{ margin: 0, color: T.subtleText, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{JSON.stringify(ex.resp, null, 2)}</pre>
            </div>
          </div>
          <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: 14 }}>
            <div style={{ color: T.muted, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>CALL IN JAVASCRIPT</div>
            <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.subtleText, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{`const res = await fetch(
  "https://api.github.com` + ex.path + `",
  { headers: { Authorization: "Bearer YOUR_TOKEN" } }
);
const data = await res.json();`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GithubApiModule({ isMobile }) {
  return (
    <div>
      <InfoBox icon="🔌" title="What is the GitHub API?" color={T.teal}>
        Everything you can do on GitHub.com — create issues, comment on PRs, check CI status, star
        repos, manage teams — can also be done in code via the{" "}
        <strong style={{ color: T.teal }}>GitHub REST API</strong>. It's a set of URLs you call
        with HTTP requests, and GitHub responds with JSON data.
        <br /><br />
        This opens up automation possibilities: a script that closes stale issues, a bot that
        comments on every PR, a dashboard showing your team's PR review times, GitHub Actions
        steps that interact with your repo. Anything you can click on GitHub, you can automate
        via the API.
      </InfoBox>
      <InfoBox icon="🔑" title="Authentication" color={T.amber}>
        Public data (public repos, user profiles) can be read without a token. Everything else
        requires a <strong style={{ color: T.amber }}>Personal Access Token (PAT)</strong> —
        generated in GitHub Settings → Developer settings → Tokens. Treat it like a password:
        never commit it to code, always use it via environment variables or GitHub Secrets.
      </InfoBox>
      <SectionTitle>GitHub API Explorer</SectionTitle>
      <APIExplorer isMobile={isMobile} />
    </div>
  );
}
