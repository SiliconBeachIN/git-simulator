import T from "../../constants/tokens";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard, Terminal } from "../shared";

export default function RemoteModule() {
  return (
    <div>
      <InfoBox icon="☁" title="Local vs Remote" color={T.blue}>
        Your <strong style={{ color: T.amber }}>local repo</strong> lives on your machine — fast, private, no internet needed. A <strong style={{ color: T.blue }}>remote</strong> is another copy, usually on GitHub. The name <code style={{ color: T.green }}>origin</code> is just a convention — it's the primary remote.
      </InfoBox>
      <ConceptDiagram>{`  Your machine                      GitHub (origin)
  ┌─────────────────┐    push →    ┌─────────────────┐
  │  local/main     │◄────────────►│  origin/main    │
  │  local/feat     │    ← pull    │  origin/feat    │
  └─────────────────┘              └─────────────────┘
         │                                  ↕
      git fetch                     other developers
  (download, don't merge)          clone / pull / push`}</ConceptDiagram>
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        { cmd: "git remote add origin https://github.com/user/repo.git", desc: "Link local repo to GitHub", detail: "'origin' is the conventional name. You can call it anything. This just stores the URL — no data transferred yet.", example: "Connecting your local lab notebook to the cloud library ☁️" },
        { cmd: "git push -u origin main", desc: "First push to GitHub", detail: "-u sets 'upstream tracking' so future 'git push' and 'git pull' know which remote/branch to use without specifying.", example: "Uploading to the cloud for the first time 🚀" },
        { cmd: "git push", desc: "Push local commits to remote", detail: "Sends all new local commits on the current branch to the tracked remote branch. Fast — only sends new data.", example: "Syncing your notebook to the cloud 📤" },
        { cmd: "git pull", desc: "Download + merge remote changes", detail: "Shortcut for: git fetch + git merge. Gets remote commits and merges them into your current branch.", example: "Downloading latest changes from the cloud 📥" },
        { cmd: "git fetch", desc: "Download remote data (no merge)", detail: "Downloads all remote branches and commits but does NOT touch your working directory. Safe.", example: "Checking what new chapters arrived in the library without reading them yet 👀" },
        { cmd: "git pull --rebase", desc: "Pull and rebase instead of merge", detail: "Like git pull but instead of a merge commit, it replays your local commits on top of the remote. Cleaner history.", example: "" },
        { cmd: "git remote -v", desc: "List all remote connections", detail: "Shows fetch and push URLs for each remote. Useful to verify you're connected to the right repo.", example: "" },
        { cmd: "git push origin --delete feature/old", desc: "Delete a branch on GitHub", detail: "Removes the branch from the remote. Your local branch is unaffected. Common after a PR is merged.", example: "Deleting a cloud chapter you no longer need 🗑️" },
        { cmd: "git push --force-with-lease", desc: "Safe force push", detail: "Force pushes but checks first: if someone else pushed since your last fetch, it refuses.", example: "Overwriting cloud history, but only if nobody else added to it", warning: "Force pushing rewrites history. Never force-push main or shared branches." },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
      <SectionTitle>⚡ Terminal</SectionTitle>
      <Terminal compact />
    </div>
  );
}
