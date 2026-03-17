import T from "../../constants/tokens";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

export default function AdvancedModule() {
  return (
    <div>
      <InfoBox icon="⚗" title="The Wizard's Spellbook" color={T.purple}>
        These commands separate Git beginners from Git masters. They're rarely needed — but when
        you need them, they're <strong style={{ color: T.purple }}>life-saving</strong>. The
        most important one to memorise:{" "}
        <code style={{ color: T.green }}>git reflog</code>. It's your ultimate safety net.
      </InfoBox>
      <SectionTitle>⚡ Safety Net — Never Lose Work</SectionTitle>
      {[
        { cmd: "git reflog", desc: "The ultimate undo history — see EVERY move", detail: "Shows every position HEAD has ever been in — including deleted commits, abandoned rebases, everything. Your black box recorder.", example: "🛫 The flight recorder that survives any crash" },
        { cmd: "git reset --soft HEAD~1", desc: "Undo last commit, keep changes STAGED", detail: "Moves HEAD back 1 commit. Changes from that commit are still in the staging area, ready to re-commit differently.", example: "📸 Un-take the photo, but keep the image in memory" },
        { cmd: "git reset --mixed HEAD~1", desc: "Undo last commit, keep changes UNSTAGED", detail: "Like --soft but unstages the changes too. They're still in your working directory — just need to be re-added.", example: "" },
        { cmd: "git reset --hard HEAD~1", desc: "DESTROY last commit and its changes", detail: "Completely removes the commit AND its changes from the working directory. Cannot be undone (except via reflog within ~90 days).", example: "", warning: "This permanently destroys your changes. Use reflog within 90 days to recover if needed." },
        { cmd: "git revert abc1234", desc: "Undo a commit by creating a new commit", detail: "Creates a NEW commit that undoes the changes of abc1234. Safe for shared branches — doesn't rewrite history.", example: "The safe way to undo on main — leaves evidence in history 📜" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
      <SectionTitle>🔍 Finding Things</SectionTitle>
      {[
        { cmd: "git blame src/auth.js", desc: "See who wrote every single line", detail: "Shows commit hash, author, and date for each line. Perfect for understanding why code exists.", example: "🕵️ The detective board of your codebase" },
        { cmd: "git bisect start", desc: "Binary-search for the commit that broke something", detail: "Git checks out commits between 'good' and 'bad', halving the search space each time. Finds bugs in O(log n) steps.", example: "🔬 Let Git do the detective work for you" },
        { cmd: 'git log --grep="feat" --author="Alice"', desc: "Search commit history", detail: "Filter commits by message content, author, date, files changed. Combine flags for precise archaeology.", example: "" },
        { cmd: 'git log -S "password" --all', desc: "Find when a specific string was added/removed", detail: "The 'pickaxe' search — finds commits that changed the number of occurrences of a string. Great for security audits.", example: "🔐 Find every time 'password' appeared in history" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
      <SectionTitle>🏷️ Tags & Releases</SectionTitle>
      {[
        { cmd: "git tag v1.0.0", desc: "Create a lightweight tag at HEAD", detail: "A tag is like a branch that never moves — a permanent label on a specific commit.", example: "🏷️ Stamp a milestone on your timeline" },
        { cmd: 'git tag -a v1.0.0 -m "First stable release"', desc: "Annotated tag with message", detail: "Stores tagger name, email, date, and message. This is what GitHub uses for Releases.", example: "🎉 Official milestone with full ceremony" },
        { cmd: "git push origin --tags", desc: "Push all tags to GitHub", detail: "Tags aren't pushed automatically with 'git push'. Run this after creating tags.", example: "" },
        { cmd: "git tag -d v1.0.0", desc: "Delete a local tag", detail: "Tags can be deleted locally and on remote (git push origin --delete v1.0.0) if you made a mistake.", example: "" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
      <SectionTitle>🧙 Power User Tricks</SectionTitle>
      {[
        { cmd: "git worktree add ../hotfix hotfix/critical", desc: "Check out two branches at once in different folders", detail: "Creates a new working directory for the branch. Useful when you need to fix a bug without disturbing your current work.", example: "🌌🌌 Working in two parallel universes simultaneously" },
        { cmd: "git archive --format=zip HEAD > release.zip", desc: "Export current state as zip (no .git)", detail: "Creates a clean zip/tar of your project without the .git folder. Good for releases.", example: "" },
        { cmd: "git shortlog -s -n", desc: "Contribution leaderboard", detail: "Shows how many commits each author has made, sorted by count. Fun for team stats.", example: "🏆 The contribution scoreboard" },
        { cmd: 'git config --global alias.lg "log --oneline --graph --all"', desc: "Create a git alias", detail: "Now you can type 'git lg' instead of the long command. Set up your own shortcuts!", example: "⌨️ Your personal git shortcuts" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}
