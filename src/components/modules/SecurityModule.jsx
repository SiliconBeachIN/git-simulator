import T from "../../constants/tokens";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard } from "../shared";

export default function SecurityModule() {
  return (
    <div>
      <InfoBox icon="🔐" title="The #1 Rule of Git Security" color={T.red}>
        <strong style={{ color: T.red }}>NEVER commit secrets.</strong> API keys, passwords,
        private keys — once committed to a public repo, assume they're compromised immediately
        (bots scan GitHub continuously). Even if you delete them later, the full history is
        public. Prevention:{" "}
        <code style={{ color: T.green }}>.gitignore</code> +{" "}
        <code style={{ color: T.green }}>pre-commit hooks</code>.
      </InfoBox>
      <InfoBox icon="🧹" title="How .gitignore works" color={T.green}>
        Imagine your project is a backpack for a school trip. You want to carry your homework,
        snacks, and a water bottle, but not your dirty laundry or old receipts. The{" "}
        <code style={{ color: T.green }}>.gitignore</code> file is like a packing list that
        tells Git, "ignore these things; I don't want them in my backpack."
        <br /><br />
        If you put a file in <code style={{ color: T.green }}>.gitignore</code> before your
        first commit, Git will never track it. But if you've already packed it once (already
        committed), adding it to <code style={{ color: T.green }}>.gitignore</code> won't
        magically remove it. You'll need to "unpack" it with{" "}
        <code style={{ color: T.green }}>git rm --cached filename</code> and commit again.
      </InfoBox>
      <SectionTitle>.gitignore Essentials</SectionTitle>
      <ConceptDiagram>{`# Environment & Secrets (NEVER COMMIT THESE!)
.env
.env.local
.env.*.local
*.pem
*.key
*.cert
config/secrets.yml
credentials.json

# Dependencies (huge, rebuilt from package.json)
node_modules/
vendor/
.venv/

# Build output (generated, not source)
dist/
build/
.cache/
*.min.js

# IDE files (personal preference, not project files)
.vscode/settings.json
.idea/
*.swp
.DS_Store`}</ConceptDiagram>
      <SectionTitle>CLI Security Commands</SectionTitle>
      {[
        { cmd: 'ssh-keygen -t ed25519 -C "you@email.com"', desc: "Generate a secure SSH key pair", detail: "Creates a private key (~/.ssh/id_ed25519) and public key (~/.ssh/id_ed25519.pub). Add the PUBLIC key to GitHub Settings → SSH Keys.", example: "🗝️ Making your unique digital identity key" },
        { cmd: "cat ~/.ssh/id_ed25519.pub", desc: "View your public key (safe to share)", detail: "Copy this entire string and paste it into GitHub → Settings → SSH and GPG keys → New SSH Key", example: "" },
        { cmd: "ssh -T git@github.com", desc: "Test SSH connection to GitHub", detail: "Should respond: 'Hi username! You've successfully authenticated.' If not, check your SSH config.", example: "" },
        { cmd: "gh secret set MY_SECRET_KEY", desc: "Add a secret to GitHub repo", detail: "Encrypted, never shown again. Reference in Actions as: ${{ secrets.MY_SECRET_KEY }}", example: "🔒 Giving your robot a keycard it can use but never reveal" },
        { cmd: 'git log --all --full-history -- "*.env"', desc: "Search history for .env files", detail: "Check if .env was ever accidentally committed. If found, you need to rotate those credentials immediately.", example: "", warning: "If you find secrets in git history, rotate the credentials immediately — git history is permanent." },
        { cmd: "git filter-branch --index-filter 'git rm --cached --ignore-unmatch secrets.txt' HEAD", desc: "Remove a file from ALL history", detail: "Last resort — rewrites every single commit in the repo's history. Use the BFG Repo Cleaner tool for large repos; it's faster and safer. After running this, every collaborator must delete their local copy and re-clone.", example: "", warning: "This rewrites history. All collaborators must delete and re-clone. Coordinate with your team first." },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
