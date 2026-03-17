import T from "../../constants/tokens";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard, Terminal } from "../shared";

export default function InitModule() {
  return (
    <div>
      <InfoBox icon="📖" title="The Story" color={T.purple}>
        In 2005, Linus Torvalds — creator of Linux — spent{" "}
        <strong style={{ color: T.amber }}>just 10 days</strong> writing Git from scratch
        to replace the BitKeeper version control system. He needed something fast,
        distributed, and free. Today Git powers virtually all software development on
        Earth.
      </InfoBox>
      <InfoBox icon="🌱" title="What git init actually does" color={T.green}>
        When you run <code style={{ color: T.green }}>git init</code>, Git creates a hidden{" "}
        <code style={{ color: T.green }}>.git/</code> folder. This folder IS your entire
        repository — every commit, every branch, every piece of history lives here. If you
        delete <code style={{ color: T.green }}>.git/</code>, you lose all history but your
        files remain.
      </InfoBox>
      <ConceptDiagram>{`my-project/
├── .git/                 ← Git's database (don't touch!)
│   ├── HEAD              ← "You are here" pointer
│   ├── objects/          ← All commits, files, trees stored as blobs
│   │   ├── ab/cd1234...  ← Content-addressed storage
│   ├── refs/
│   │   ├── heads/main    ← main branch pointer (just a hash!)
│   │   └── remotes/origin/main
│   └── config            ← Repo settings
├── src/
└── README.md             ← Your actual files (working directory)`}</ConceptDiagram>
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        { cmd: "git init my-project", desc: "Create new repo in a new folder", detail: "Creates 'my-project/' folder AND initialises .git/ inside it", example: "Like planting a seed in fresh soil 🌱" },
        { cmd: "git init", desc: "Init repo in current directory", detail: "Turns ANY existing folder into a git repo. Your files stay untouched.", example: "Like installing a time machine into your house 🏠" },
        { cmd: "git clone https://github.com/user/repo.git", desc: "Copy a remote repo (with full history)", detail: "Downloads the repo AND every commit ever made. You get the full time machine.", example: "Like copying a book with every draft the author ever wrote 📓" },
        { cmd: "git clone --depth 1 https://github.com/user/repo.git", desc: "Shallow clone — latest snapshot only", detail: "Only downloads the most recent state, not full history. Much faster for large repos.", example: "Like reading today's newspaper, not the 30-year archive 📰" },
        { cmd: 'git config --global user.name "Your Name"', desc: "Set your identity (do this first!)", detail: "Every commit is signed with your name and email. This is how blame/log shows who made changes.", example: "Signing your name on everything you photograph 🖊️" },
        { cmd: 'git config --global user.email "you@email.com"', desc: "Set your email", detail: "Must match your GitHub account email for commits to link to your profile.", example: "" },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
      <SectionTitle>⚡ Try It — Live Terminal</SectionTitle>
      <Terminal compact />
    </div>
  );
}
