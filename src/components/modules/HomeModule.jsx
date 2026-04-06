import T from "../../constants/tokens";
import { Badge, SectionTitle, Terminal, ReadmeGuide, InfoBox } from "../shared";

const prose = { color: T.subtleText, fontSize: 13, lineHeight: 1.9, marginBottom: 12 };
const h3 = { color: T.text, fontSize: 14, fontWeight: 700, marginBottom: 6, marginTop: 16 };

export default function HomeModule({ isMobile }) {
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: T.heroBannerBg,
          border: `1px solid ${T.heroBannerBorder}`,
          borderRadius: 14,
          padding: isMobile ? 16 : 22,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
            fontSize: isMobile ? 18 : 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: T.text,
            marginBottom: 8,
          }}
        >
          ⚡ Welcome to GitSimulator
        </div>
        <div style={{ color: T.subtleText, fontSize: isMobile ? 13 : 14, lineHeight: 1.8, marginBottom: 16 }}>
          You are a <strong style={{ color: T.green }}>Time-Traveler Developer</strong>.
          Git is your time machine.
          <br />
          Every <strong style={{ color: T.amber }}>commit</strong> is a checkpoint you can
          return to.
          <br />
          Every <strong style={{ color: T.blue }}>branch</strong> is a parallel universe you
          can experiment in.
          <br />
          Every <strong style={{ color: T.purple }}>merge</strong> brings parallel timelines
          together.
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            "📸 Commit = Snapshot",
            "🌿 Branch = Parallel Universe",
            "☁️ Remote = Cloud Backup",
            "🤝 PR = Code Review",
          ].map((t) => (
            <Badge key={t} color={T.blue}>{t}</Badge>
          ))}
        </div>
      </div>

      {/* What is Git */}
      <SectionTitle>🔍 What is Git?</SectionTitle>
      <InfoBox icon="🧠" title="Git — The Version Control System Every Developer Uses" color={T.green}>
        <p style={prose}>
          <strong style={{ color: T.text }}>Git</strong> is a free, open-source <strong style={{ color: T.green }}>distributed version control system</strong> created by Linus Torvalds in 2005. It tracks changes in any set of files — usually source code — and coordinates work on those files among multiple developers. Today, Git is the standard version control tool used by millions of developers and companies worldwide.
        </p>
        <p style={prose}>
          With Git, every change you make is recorded as a <strong style={{ color: T.amber }}>commit</strong> — a permanent snapshot of your project at that moment. You can travel back to any previous commit, compare differences, and understand exactly who changed what and why. This makes debugging, code reviews, and collaboration dramatically easier.
        </p>
        <h3 style={h3}>Why do developers use Git?</h3>
        <ul style={{ ...prose, paddingLeft: 18 }}>
          <li><strong style={{ color: T.text }}>Never lose work</strong> — every version is preserved in history.</li>
          <li><strong style={{ color: T.text }}>Work in parallel</strong> — branches let you develop features without affecting the main codebase.</li>
          <li><strong style={{ color: T.text }}>Collaborate safely</strong> — merge changes from multiple developers without overwriting each other.</li>
          <li><strong style={{ color: T.text }}>Audit every change</strong> — <code style={{ color: T.green }}>git log</code> and <code style={{ color: T.green }}>git blame</code> show who changed what and when.</li>
          <li><strong style={{ color: T.text }}>Experiment freely</strong> — create throwaway branches for risky experiments; delete them with no consequences.</li>
        </ul>
      </InfoBox>

      {/* What is GitHub */}
      <SectionTitle>🐙 What is GitHub?</SectionTitle>
      <InfoBox icon="☁️" title="GitHub — Where Git Repositories Live in the Cloud" color={T.blue}>
        <p style={prose}>
          <strong style={{ color: T.text }}>GitHub</strong> is a web-based platform built on top of Git. While Git is a local tool running on your machine, GitHub provides a <strong style={{ color: T.blue }}>central place to host Git repositories online</strong>. It adds powerful collaboration features on top of Git: pull requests, issues, code review, GitHub Actions CI/CD pipelines, project boards, and much more.
        </p>
        <p style={prose}>
          Owned by Microsoft since 2018, GitHub hosts over 420 million repositories and is the largest code-hosting platform in the world. Almost every open-source project — from Linux to React to Python — is developed on GitHub.
        </p>
        <h3 style={h3}>Git vs GitHub — what's the difference?</h3>
        <ul style={{ ...prose, paddingLeft: 18 }}>
          <li><strong style={{ color: T.green }}>Git</strong> is the version control tool — it runs locally on your computer and tracks changes.</li>
          <li><strong style={{ color: T.blue }}>GitHub</strong> is a hosting service — it stores your Git repository online and adds collaboration tools.</li>
          <li>You can use Git without GitHub (with GitLab, Bitbucket, or no remote at all), but GitHub makes team collaboration much easier.</li>
        </ul>
      </InfoBox>

      {/* Modules overview */}
      <SectionTitle>🗺️ What You Will Learn — 24 Interactive Modules</SectionTitle>
      <InfoBox icon="📚" title="A Complete Git & GitHub Curriculum" color={T.purple}>
        <p style={prose}>
          GitSimulator offers <strong style={{ color: T.text }}>24 structured learning modules</strong> covering everything from running your first <code style={{ color: T.green }}>git init</code> to advanced topics like GitHub Actions CI/CD, Dependabot security automation, and Git internals. Every module includes:
        </p>
        <ul style={{ ...prose, paddingLeft: 18 }}>
          <li>📖 <strong style={{ color: T.text }}>Story-based introduction</strong> — real-world analogies that make abstract concepts click.</li>
          <li>💡 <strong style={{ color: T.text }}>Concept diagrams</strong> — visual text diagrams showing how things work under the hood.</li>
          <li>⚡ <strong style={{ color: T.text }}>Interactive terminal</strong> — type real git commands and see simulated output instantly.</li>
          <li>📋 <strong style={{ color: T.text }}>Copy-ready command cards</strong> — every important command with detailed explanations.</li>
          <li>🧪 <strong style={{ color: T.text }}>Master quiz</strong> — test your knowledge across all modules at any time.</li>
        </ul>
        <h3 style={h3}>Beginner modules</h3>
        <p style={prose}>
          Start with <strong style={{ color: T.green }}>git init</strong> to create your first repository, learn the <strong style={{ color: T.green }}>staging area</strong> (git add + git commit), create and switch <strong style={{ color: T.green }}>branches</strong>, and push your work to a <strong style={{ color: T.green }}>remote</strong> on GitHub. These five modules give you everything you need to work on solo projects professionally.
        </p>
        <h3 style={h3}>Intermediate modules</h3>
        <p style={prose}>
          Learn <strong style={{ color: T.green }}>merge &amp; rebase</strong> strategies, open your first <strong style={{ color: T.green }}>pull request</strong>, resolve merge conflicts, follow the <strong style={{ color: T.green }}>Git Flow</strong> branching model, master <strong style={{ color: T.green }}>GitHub Issues &amp; Projects</strong>, and publish your site with <strong style={{ color: T.green }}>GitHub Pages</strong>.
        </p>
        <h3 style={h3}>Advanced modules</h3>
        <p style={prose}>
          Dive into <strong style={{ color: T.green }}>GitHub Actions</strong> for CI/CD pipelines, set up <strong style={{ color: T.green }}>Dependabot</strong> security alerts, configure <strong style={{ color: T.green }}>branch protection rules</strong> and <strong style={{ color: T.green }}>CODEOWNERS</strong>, use the <strong style={{ color: T.green }}>GitHub REST API</strong>, manage <strong style={{ color: T.green }}>releases &amp; tags</strong>, and explore <strong style={{ color: T.green }}>GitHub Codespaces</strong>.
        </p>
      </InfoBox>

      {/* Who is this for */}
      <SectionTitle>🎯 Who Is This For?</SectionTitle>
      <InfoBox icon="👥" title="Perfect For Beginners and Developers Levelling Up" color={T.amber}>
        <p style={prose}>
          GitSimulator is designed for anyone who wants to learn Git and GitHub — from complete beginners writing their first lines of code to experienced developers who want to fill gaps in their GitHub knowledge.
        </p>
        <ul style={{ ...prose, paddingLeft: 18 }}>
          <li><strong style={{ color: T.text }}>Students</strong> — no installation required; run everything in the browser.</li>
          <li><strong style={{ color: T.text }}>Bootcamp learners</strong> — structured curriculum aligned with real dev workflows.</li>
          <li><strong style={{ color: T.text }}>Self-taught developers</strong> — skip the confusion and learn from first principles.</li>
          <li><strong style={{ color: T.text }}>Professionals</strong> — reference advanced topics like CI/CD, branch protection, and the GitHub API.</li>
        </ul>
        <p style={prose}>
          No sign-up, no credit card, no installation. Everything runs in your browser for free.
        </p>
      </InfoBox>

      <SectionTitle>📘 Start With README.md</SectionTitle>
      <ReadmeGuide />

      <SectionTitle>⚡ Interactive Terminal — Try Commands Now</SectionTitle>
      <Terminal />
    </div>
  );
}
