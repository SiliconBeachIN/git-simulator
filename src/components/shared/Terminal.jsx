import { useState, useEffect, useRef, useCallback } from "react";
import T from "../../constants/tokens";

/* ── Exact-match commands ── */
const TERM_RESPONSES = {
  "git init": [
    "Initialized empty Git repository in /my-project/.git/",
    "",
    "📁 .git/ created — this is the brain of your repo:",
    "  .git/HEAD        ← which branch you're on",
    "  .git/objects/    ← all your commits stored here",
    "  .git/refs/heads/ ← branch pointers",
  ],
  "git status": [
    "On branch main",
    "Your branch is up to date with 'origin/main'.",
    "",
    "Changes not staged for commit:",
    '  (use "git add <file>..." to update)',
    "",
    "        modified:   src/App.js",
    "        modified:   README.md",
    "",
    "Untracked files:",
    "        src/components/Hero.js",
    "",
    'no changes added to commit (use "git add")',
  ],
  "git add .": [
    "✓ Staged: src/App.js",
    "✓ Staged: README.md",
    "✓ Staged: src/components/Hero.js",
    "",
    "💡 All changes are now in the staging area, ready to commit.",
    "   Run: git status  to verify",
  ],
  "git log": [
    "commit a3f2b1c (HEAD -> main, origin/main)",
    "Author: You <you@example.com>",
    "Date:   Tue Mar 10 2026 09:00:00",
    "",
    "    feat: add user authentication",
    "",
    "commit 9d4e5f6",
    "Author: You <you@example.com>",
    "Date:   Mon Mar 09 2026 14:22:11",
    "",
    "    feat: initial project setup",
  ],
  "git log --oneline": [
    "a3f2b1c (HEAD -> main) feat: add auth",
    "9d4e5f6 feat: initial project setup",
    "1a2b3c4 chore: initial commit",
    "",
    "💡 --oneline condenses each commit to a single line. Add --graph for a visual branch map.",
  ],
  "git log --oneline --graph --all": [
    "* a3f2b1c (HEAD -> main) feat: add auth",
    "* | d7e8f9a (feature/login) feat: login form",
    "* | c5d6e7f feat: login API",
    "|/",
    "* 9d4e5f6 feat: project setup",
    "* 1a2b3c4 chore: initial commit",
  ],
  "git branch": [
    "* main",
    "  feature/login",
    "  feature/dashboard",
    "  hotfix/security-patch",
    "",
    "💡 The * marks your current branch.",
  ],
  "git branch -a": [
    "* main",
    "  feature/login",
    "  feature/dashboard",
    "  remotes/origin/main",
    "  remotes/origin/feature/login",
    "",
    "💡 -a shows remote-tracking branches too.",
  ],
  "git diff": [
    "diff --git a/src/App.js b/src/App.js",
    "@@ -10,6 +10,10 @@ function App() {",
    "   return (",
    "",
    "+    <div className='hero'>",
    "+      <h1>Welcome Back!</h1>",
    "+    </div>",
    "   );",
    "",
    "Lines with + are ADDED, lines with - are REMOVED.",
  ],
  "git diff --staged": [
    "diff --git a/src/App.js b/src/App.js",
    "@@ -1,3 +1,5 @@",
    "+import Hero from './components/Hero';",
    " import React from 'react';",
    "",
    "💡 --staged shows changes that are already git add-ed (in the staging area).",
  ],
  "git stash": [
    "Saved working directory and index state",
    "WIP on main: a3f2b1c feat: add auth",
    "",
    "💡 Your changes are safely stored. Use 'git stash pop' to restore.",
  ],
  "git stash list": [
    "stash@{0}: WIP on main: a3f2b1c feat: add auth",
    "stash@{1}: WIP on feature/login: d7e8f9a feat: login form",
    "",
    "💡 You can apply a specific stash with: git stash apply stash@{1}",
  ],
  "git stash pop": [
    "On branch main",
    "Changes not staged for commit:",
    "        modified:   src/App.js",
    "",
    "✓ Stash applied and removed from stash list.",
  ],
  "git pull": [
    "remote: Enumerating objects: 5, done.",
    "remote: Counting objects: 100% (5/5), done.",
    "Updating a3f2b1c..9d8c7b6",
    "Fast-forward",
    " src/App.js | 12 ++++++------",
    "",
    "✓ Your branch is now up to date with origin/main 📥",
  ],
  "git push": [
    "Enumerating objects: 5, done.",
    "Writing objects: 100% (3/3), 1.02 KiB | 1.02 MiB/s, done.",
    "To https://github.com/user/repo.git",
    "   a3f2b1c..9d8c7b6  main -> main",
    "",
    "✓ Successfully pushed to origin/main 🚀",
  ],
  "git fetch": [
    "remote: Enumerating objects: 8, done.",
    "remote: Counting objects: 100% (8/8), done.",
    "From https://github.com/user/repo",
    "   a3f2b1c..f4e5d6c  main       -> origin/main",
    " * [new branch]      feature/api -> origin/feature/api",
    "",
    "💡 fetch downloads remote data but does NOT merge. Your working files are untouched.",
    "   Run: git merge origin/main  to integrate the changes.",
  ],
  "git remote -v": [
    "origin  https://github.com/user/repo.git (fetch)",
    "origin  https://github.com/user/repo.git (push)",
    "",
    "💡 'origin' is the default name for your remote. You can add more with: git remote add <name> <url>",
  ],
  "git reflog": [
    "a3f2b1c (HEAD -> main) HEAD@{0}: commit: feat: add auth",
    "9d4e5f6 HEAD@{1}: commit: feat: setup",
    "b2c3d4e HEAD@{2}: checkout: moving to main",
    "c5d6e7f HEAD@{3}: commit: WIP",
    "",
    "💡 Even deleted commits appear here. Your ultimate safety net!",
    "   Use: git reset --hard HEAD@{N}  to travel back in time.",
  ],
  "git blame src/app.js": [
    "a3f2b1c (Alice   2026-03-10) const App = () => {",
    "9d4e5f6 (Bob     2026-03-09)   const [count, setCount] = useState(0);",
    "c5d6e7f (Alice   2026-03-08)   useEffect(() => { fetchData(); }, []);",
    "b2c3d4e (Charlie 2026-03-07)   return null;",
    "",
  ],
  "git tag": [
    "v1.0.0",
    "v1.1.0",
    "v2.0.0-beta",
    "",
    "💡 Tags mark release points. Create one with: git tag -a v1.2.0 -m 'Release 1.2.0'",
  ],
  "git help": [
    "📚 Simulated commands in this terminal:",
    "",
    "  Setup:     git init · git clone · git config",
    "  Snapshot:  git add · git commit · git status · git diff",
    "  Branch:    git branch · git checkout · git switch · git merge",
    "  Remote:    git push · git pull · git fetch · git remote -v",
    "  Undo:      git reset · git revert · git stash · git reflog",
    "  Inspect:   git log · git blame · git tag · git show",
    "  Advanced:  git rebase · git cherry-pick · git bisect",
    "",
    "💡 Most commands also accept arguments — try: git commit -m 'my message'",
    "   For full docs, explore the modules in the sidebar!",
  ],
  clear: ["__CLEAR__"],
};

/* ── Pattern-matched commands (prefix → dynamic response) ── */
const TERM_PATTERNS = [
  {
    match: (k) => k.startsWith("git init "),
    respond: (cmd) => {
      const name = cmd.replace(/^git init\s+/i, "").trim();
      return [
        `Initialized empty Git repository in /${name}/.git/`,
        "",
        `📁 Created project folder '${name}' with a .git/ directory inside:`,
        "  .git/HEAD        ← which branch you're on",
        "  .git/objects/    ← all your commits stored here",
        "  .git/refs/heads/ ← branch pointers",
        "",
        `💡 cd ${name}  to enter your new project, then start working!`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git clone "),
    respond: (cmd) => {
      const url = cmd.replace(/^git clone\s+/i, "").trim();
      const name = url.split("/").pop()?.replace(".git", "") || "repo";
      return [
        `Cloning into '${name}'...`,
        "remote: Enumerating objects: 142, done.",
        "remote: Counting objects: 100% (142/142), done.",
        "remote: Compressing objects: 100% (98/98), done.",
        "Receiving objects: 100% (142/142), 1.23 MiB | 4.56 MiB/s, done.",
        "Resolving deltas: 100% (47/47), done.",
        "",
        `✓ Repository cloned into ./${name}/`,
        `💡 cd ${name}  to enter the project. All branches & history are downloaded.`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git add "),
    respond: (cmd) => {
      const files = cmd.replace(/^git add\s+/i, "").trim();
      if (files === ".") return null; // fall through to exact match
      return [
        `✓ Staged: ${files}`,
        "",
        "💡 File is now in the staging area, ready for the next commit.",
        "   Run: git status  to see what's staged.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git commit"),
    respond: (cmd) => {
      const msgMatch = cmd.match(/-m\s+["'](.+?)["']/);
      const cmdWithoutQuoted = cmd.replace(/(["']).*?\1/g, " ");
      const hasStandaloneMFlag = /(^|\s)-m(\s|["']|$)/.test(cmdWithoutQuoted);
      if (cmd === "git commit") {
        return [
          "hint: Waiting for your editor to close the file...",
          "error: Terminal does not support opening an editor.",
          "",
          '💡 Use: git commit -m "your commit message"',
        ];
      }
      if (cmd.match(/^git commit\s+-m\s*$/) || cmd.match(/^git commit\s+-m\s+["']["']\s*$/)) {
        return [
          "error: switch `m' requires a value",
          "",
          '💡 Usage: git commit -m "your commit message"',
        ];
      }
      if (hasStandaloneMFlag && !msgMatch) {
        return [
          'error: commit message must be wrapped in quotes.',
          "",
          '💡 Usage: git commit -m "your commit message"',
        ];
      }
      if (!msgMatch) {
        return [
          "hint: Waiting for your editor to close the file...",
          "error: Terminal does not support opening an editor.",
          "",
          '💡 Use: git commit -m "your commit message"',
        ];
      }
      const msg = msgMatch[1];
      return [
        `[main e7f8a9b] ${msg}`,
        " 2 files changed, 15 insertions(+), 3 deletions(-)",
        "",
        "✓ Commit created! Your changes are now saved in git history.",
        "💡 Run: git log --oneline  to see your commit list.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git checkout -b ") || k.startsWith("git switch -c "),
    respond: (cmd) => {
      const branch = cmd.replace(/^git (checkout -b|switch -c)\s+/i, "").trim();
      return [
        `Switched to a new branch '${branch}'`,
        "",
        `✓ Created and switched to branch '${branch}'.`,
        "💡 This is shorthand for: git branch " + branch + " && git checkout " + branch,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git checkout ") || k.startsWith("git switch "),
    respond: (cmd) => {
      const branch = cmd.replace(/^git (checkout|switch)\s+/i, "").trim();
      return [
        `Switched to branch '${branch}'`,
        `Your branch is up to date with 'origin/${branch}'.`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git branch -d ") || k.startsWith("git branch -D "),
    respond: (cmd) => {
      const branch = cmd.replace(/^git branch -[dD]\s+/i, "").trim();
      return [
        `Deleted branch ${branch} (was d7e8f9a).`,
        "",
        "💡 Use -D (uppercase) to force-delete a branch that hasn't been merged.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git branch "),
    respond: (cmd) => {
      const branch = cmd.replace(/^git branch\s+/i, "").trim();
      if (branch.startsWith("-")) return null; // flags we don't handle
      return [
        `✓ Branch '${branch}' created (but you're still on current branch).`,
        `💡 Run: git checkout ${branch}  to switch to it.`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git merge "),
    respond: (cmd) => {
      const branch = cmd.replace(/^git merge\s+/i, "").trim();
      return [
        `Merge made by the 'ort' strategy.`,
        ` src/App.js        | 8 ++++++--`,
        ` src/utils/auth.js  | 4 ++++`,
        " 2 files changed, 10 insertions(+), 2 deletions(-)",
        "",
        `✓ Branch '${branch}' merged into current branch.`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git rebase "),
    respond: (cmd) => {
      const branch = cmd.replace(/^git rebase\s+/i, "").trim();
      return [
        `Successfully rebased and updated refs/heads/current.`,
        "",
        `✓ Your commits are now replayed on top of '${branch}'.`,
        "💡 Rebase rewrites history — never rebase branches others are using!",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git reset --hard "),
    respond: (cmd) => {
      const ref = cmd.replace(/^git reset --hard\s+/i, "").trim();
      return [
        `HEAD is now at ${ref.substring(0, 7)} (previous commit)`,
        "",
        "⚠️  --hard discards ALL uncommitted changes. They cannot be recovered!",
        "💡 Use git reflog to find commits you've reset past.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git reset --soft "),
    respond: (cmd) => {
      const ref = cmd.replace(/^git reset --soft\s+/i, "").trim();
      return [
        `HEAD is now at ${ref.substring(0, 7)}`,
        "",
        "✓ Commit undone, but your changes are still staged (ready to re-commit).",
        "💡 --soft is the safest reset — nothing is lost.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git reset "),
    respond: (cmd) => {
      const ref = cmd.replace(/^git reset\s+/i, "").trim();
      return [
        "Unstaged changes after reset:",
        "M       src/App.js",
        "",
        `✓ HEAD moved to ${ref.substring(0, 7)}. Changes are preserved but unstaged.`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git revert "),
    respond: (cmd) => {
      const ref = cmd.replace(/^git revert\s+/i, "").trim();
      return [
        `[main b1c2d3e] Revert "previous commit"`,
        " 1 file changed, 2 insertions(+), 5 deletions(-)",
        "",
        `✓ Created a NEW commit that undoes the changes from ${ref.substring(0, 7)}.`,
        "💡 Unlike reset, revert is safe for shared branches — it doesn't rewrite history.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git cherry-pick "),
    respond: (cmd) => {
      const ref = cmd.replace(/^git cherry-pick\s+/i, "").trim();
      return [
        `[main f9e8d7c] feat: cherry-picked commit`,
        " 1 file changed, 4 insertions(+)",
        "",
        `✓ Commit ${ref.substring(0, 7)} applied to current branch as a new commit.`,
        "💡 Cherry-pick copies a single commit — useful for hotfixes across branches.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git remote add "),
    respond: (cmd) => {
      const parts = cmd.replace(/^git remote add\s+/i, "").trim().split(/\s+/);
      const name = parts[0] || "upstream";
      const url = parts[1] || "https://github.com/org/repo.git";
      return [
        `✓ Remote '${name}' added → ${url}`,
        "",
        `💡 Now you can: git fetch ${name}  or  git push ${name} main`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git push "),
    respond: (cmd) => {
      const args = cmd.replace(/^git push\s+/i, "").trim();
      return [
        "Enumerating objects: 5, done.",
        "Writing objects: 100% (3/3), 1.02 KiB, done.",
        `To remote → ${args}`,
        "",
        `✓ Successfully pushed ${args} 🚀`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git pull "),
    respond: (cmd) => {
      const args = cmd.replace(/^git pull\s+/i, "").trim();
      return [
        "remote: Enumerating objects: 5, done.",
        "remote: Counting objects: 100% (5/5), done.",
        `From ${args}`,
        "Updating a3f2b1c..9d8c7b6",
        "Fast-forward",
        "",
        `✓ Pulled latest changes from ${args} 📥`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git config "),
    respond: (cmd) => {
      const args = cmd.replace(/^git config\s+/i, "").trim();
      const isGlobal = args.includes("--global");
      const scope = isGlobal ? "global (~/.gitconfig)" : "local (.git/config)";
      const clean = args.replace("--global", "").trim();
      const parts = clean.split(/\s+/);
      const key = parts[0] || "user.name";
      const val = parts.slice(1).join(" ").replace(/["']/g, "") || "";
      if (val) {
        return [
          `✓ Set ${key} = ${val}  (scope: ${scope})`,
          "",
          "💡 --global applies to all repos on your machine.",
          "   Without --global, the setting only applies to this repo.",
        ];
      }
      return [
        `${key} = you@example.com`,
        "",
        "💡 To set a value: git config " + (isGlobal ? "--global " : "") + key + ' "new value"',
      ];
    },
  },
  {
    match: (k) => k.startsWith("git tag "),
    respond: (cmd) => {
      const args = cmd.replace(/^git tag\s+/i, "").trim();
      const name = args.split(/\s+/)[0];
      return [
        `✓ Tag '${name}' created at HEAD (a3f2b1c).`,
        "",
        "💡 Push tags to remote with: git push origin " + name,
        "   Or push all tags: git push --tags",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git show "),
    respond: (cmd) => {
      const ref = cmd.replace(/^git show\s+/i, "").trim();
      return [
        `commit ${ref} (HEAD -> main)`,
        "Author: You <you@example.com>",
        "Date:   Mon Mar 10 2026 09:00:00",
        "",
        "    feat: add user authentication",
        "",
        "diff --git a/src/auth.js b/src/auth.js",
        "+export function login(user, pass) {",
        "+  return api.post('/auth', { user, pass });",
        "+}",
        "",
        "💡 git show displays the full commit details + diff for any commit or tag.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git blame "),
    respond: (cmd) => {
      const file = cmd.replace(/^git blame\s+/i, "").trim();
      return [
        `a3f2b1c (Alice   2026-03-10 09:00) line 1 of ${file}`,
        `9d4e5f6 (Bob     2026-03-09 14:22) line 2 of ${file}`,
        `c5d6e7f (Alice   2026-03-08 11:05) line 3 of ${file}`,
        `b2c3d4e (Charlie 2026-03-07 16:30) line 4 of ${file}`,
        "",
        "💡 git blame shows who last changed each line and in which commit.",
      ];
    },
  },
  {
    match: (k) => k === "git bisect start",
    respond: () => [
      "✓ Bisect session started.",
      "",
      "💡 Now mark commits: git bisect good <hash>  and  git bisect bad <hash>",
      "   Git will binary-search to find the exact commit that introduced a bug.",
    ],
  },
  {
    match: (k) => k.startsWith("git log "),
    respond: (cmd) => {
      const args = cmd.replace(/^git log\s+/i, "").trim();
      return [
        "commit a3f2b1c (HEAD -> main)",
        "Author: You <you@example.com>",
        "Date:   Tue Mar 10 2026 09:00:00",
        "",
        "    feat: add user authentication",
        "",
        `💡 git log ${args} — showing filtered log output.`,
      ];
    },
  },
  {
    match: (k) => k.startsWith("git rm "),
    respond: (cmd) => {
      const file = cmd.replace(/^git rm\s+/i, "").trim();
      return [
        `rm '${file}'`,
        "",
        `✓ File '${file}' removed and staged for commit.`,
        "💡 The file is deleted from both your working directory and the staging area.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git mv "),
    respond: (cmd) => {
      const parts = cmd.replace(/^git mv\s+/i, "").trim().split(/\s+/);
      return [
        `✓ Renamed: ${parts[0] || "old"} → ${parts[1] || "new"}`,
        "",
        "💡 git mv = mv + git add. The rename is staged automatically.",
      ];
    },
  },
  {
    match: (k) => k.startsWith("git fetch "),
    respond: (cmd) => {
      const remote = cmd.replace(/^git fetch\s+/i, "").trim();
      return [
        `From ${remote}`,
        `   a3f2b1c..f4e5d6c  main -> ${remote}/main`,
        "",
        `✓ Downloaded latest data from '${remote}' without merging.`,
        "💡 Your local branches are untouched. Merge manually when ready.",
      ];
    },
  },
];

/**
 * Normalises a git command for matching purposes:
 * - Everything outside of quoted strings is lowercased (handles mobile
 *   auto-capitalisation of 'Git', 'Git Status', 'Git Stash Pop', etc.)
 * - Content inside quotes is preserved (commit messages, etc.)
 * - Non-git commands are returned unchanged.
 */
function normaliseCmd(raw) {
  const trimmed = raw.trim();
  if (!/^[Gg][Ii][Tt](\s|$)/.test(trimmed)) return trimmed;

  let result = "";
  let inQuote = null;

  const isEscapedQuote = (text, idx) => {
    let slashCount = 0;
    for (let j = idx - 1; j >= 0 && text[j] === "\\"; j--) {
      slashCount++;
    }
    return slashCount % 2 === 1;
  };

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    const isEscaped = isEscapedQuote(trimmed, i);
    if (inQuote) {
      result += ch;
      if (ch === inQuote && !isEscaped) inQuote = null;
    } else if ((ch === '"' || ch === "'") && !isEscaped) {
      inQuote = ch;
      result += ch;
    } else {
      result += ch.toLowerCase();
    }
  }
  return result;
}

/**
 * Tries exact match first, then pattern match.
 * For git commands, matching uses the normalised form from normaliseCmd,
 * while pattern responders still receive the raw command text to preserve
 * user-entered casing in echoed values.
 * Non-git commands are matched exactly.
 * Returns [response lines] or null.
 */
function findResponse(rawCmd, normalised) {
  // 1. Exact match
  if (TERM_RESPONSES[normalised]) return TERM_RESPONSES[normalised];
  // 2. Pattern match
  for (const p of TERM_PATTERNS) {
    if (p.match(normalised)) {
      const result = p.respond(rawCmd);
      if (result) return result;
    }
  }
  return null;
}

export default function Terminal({ compact = false }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    { t: "info", v: "GitSimulator Terminal v2.0 — type git commands to explore" },
    { t: "out", v: "Try: git init  |  git status  |  git log  |  git help" },
    { t: "out", v: "" },
  ]);
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const run = useCallback(() => {
    if (!input.trim()) return;
    const cmd = input.trim();
    const normalised = normaliseCmd(cmd);

    // 'clear' is a shell built-in — accept any casing
    if (cmd.toLowerCase() === "clear") {
      setLines([{ t: "info", v: "Terminal cleared. Ready." }]);
      setInput("");
      return;
    }

    const resp = findResponse(cmd, normalised);
    const newEntries = [{ t: "cmd", v: cmd }];

    if (resp) {
      resp.forEach((r) =>
        newEntries.push({
          t:
            r.startsWith("✓") || r.startsWith("💡") || r.startsWith("📁") || r.startsWith("📚")
              ? "ok"
              : r.startsWith("⚠")
                ? "err"
                : r.startsWith("diff") || r.startsWith("@@") || r.startsWith("+")
                  ? "diff"
                  : r.startsWith("-")
                    ? "minus"
                    : "out",
          v: r,
        })
      );
    } else if (normalised.startsWith("git ")) {
      // git executable recognised, but subcommand is unknown
      const sub = normalised.slice(3).trim().split(/\s+/)[0] || "";
      newEntries.push({
        t: "err",
        v: `git: '${sub}' is not a git command. See 'git help'.`,
      });
      newEntries.push({
        t: "info",
        v: "💡 Type 'git help' to see all supported commands.",
      });
    } else {
      // Completely unknown executable
      const base = cmd.split(/\s+/)[0];
      newEntries.push({
        t: "err",
        v: `bash: ${base}: command not found`,
      });
    }
    newEntries.push({ t: "out", v: "" });
    setLines((prev) => [...prev, ...newEntries]);
    setHist((p) => [cmd, ...p]);
    setInput("");
    setHIdx(-1);
  }, [input]);

  const col = {
    cmd: T.green,
    ok: T.terminalOk,
    info: T.blue,
    err: T.red,
    diff: T.purple,
    minus: T.red,
    out: T.muted,
  };

  return (
    <div
      style={{
        background: T.terminalBg,
        border: `1px solid ${T.greenBorderLight}`,

        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* title bar */}
      <div
        style={{
          background: T.surface,
          padding: "9px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderBottom: `1px solid ${T.greenBgLight}`,

        }}
      >
        {[T.red, T.amber, T.green].map((c) => (
          <div
            key={c}
            style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
          />
        ))}
        <span
          style={{
          color: T.scrollBarLine,
            fontSize: 11,
            marginLeft: 8,
            fontFamily: "monospace",
          }}
        >
          git-simulator — terminal
        </span>
      </div>
      {/* output */}
      <div
        style={{
          padding: 14,
          height: compact ? 180 : 240,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: `${T.border} transparent`,
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              lineHeight: 1.65,
              color: col[l.t] || col.out,
            }}
          >
            {l.t === "cmd" && <span style={{ color: T.purple }}>$ </span>}
            {l.v}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {/* input */}
      <div
        style={{
          borderTop: `1px solid ${T.greenBgLight}`,

          padding: "9px 14px",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <span style={{ color: T.purple, fontFamily: "monospace", fontSize: 13 }}>
          $
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run();
            if (e.key === "ArrowUp") {
              const i = Math.min(hIdx + 1, hist.length - 1);
              setHIdx(i);
              if (hist[i]) setInput(hist[i]);
            }
            if (e.key === "ArrowDown") {
              const i = Math.max(hIdx - 1, -1);
              setHIdx(i);
              setInput(i === -1 ? "" : hist[i] || "");
            }
            if (e.key === "Tab" && input.trim()) {
              e.preventDefault();
              const all = Object.keys(TERM_RESPONSES);
              const m = all.find((k) => k.startsWith(input.toLowerCase()));
              if (m) setInput(m);
            }
          }}
          aria-label="Git command input"
          placeholder="Type a git command… (↑↓ history, Tab autocomplete)"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: T.green,
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
          }}
        />
        <button
          onClick={run}
          style={{
            background: T.greenBgMedium,
            border: `1px solid ${T.greenBorderMedium}`,

            borderRadius: 6,
            color: T.green,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: 11,
          }}
        >
          Run ↵
        </button>
      </div>
    </div>
  );
}
