import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════ */
const T = {
  bg: "#060b18", surface: "#090e1c", card: "#0d1526", border: "#1a2540",
  green: "#4ade80", blue: "#60a5fa", purple: "#a78bfa", amber: "#fbbf24",
  red: "#f87171", teal: "#2dd4bf", text: "#e2e8f0", muted: "#64748b", faint: "#1e293b",
};

/* ═══════════════════════════════════════════════════════
   MODULES CONFIG
═══════════════════════════════════════════════════════ */
const MODULES = [
  { id: "home",        icon: "⚡", label: "Mission Control" },
  { id: "init",        icon: "🌱", label: "git init" },
  { id: "staging",     icon: "📦", label: "Stage & Commit" },
  { id: "branch",      icon: "🌿", label: "Branching" },
  { id: "merge",       icon: "🔀", label: "Merge & Rebase" },
  { id: "remote",      icon: "☁",  label: "Remote & Push" },
  { id: "pullrequest", icon: "🤝", label: "Pull Requests" },
  { id: "gitflow",     icon: "🔄", label: "Git Flow" },
  { id: "advanced",    icon: "⚗",  label: "Advanced Magic" },
  { id: "collaborate", icon: "🌐", label: "Open Source" },
  { id: "visualizer",  icon: "📊", label: "Commit Graph" },
  { id: "actions",     icon: "🤖", label: "GitHub Actions" },
  { id: "security",    icon: "🔐", label: "Security" },
  { id: "issues",      icon: "🐛", label: "Issues" },
  { id: "projects",    icon: "📋", label: "GitHub Projects" },
  { id: "pages",       icon: "🌍", label: "GitHub Pages" },
  { id: "releases",    icon: "📦", label: "Releases" },
  { id: "protection",  icon: "🔒", label: "Branch Protection" },
  { id: "codeowners",  icon: "👑", label: "CODEOWNERS" },
  { id: "githubapi",   icon: "🔌", label: "GitHub API" },
  { id: "dotgithub",   icon: "📂", label: ".github Folder" },
  { id: "dependabot",  icon: "🤖", label: "Dependabot" },
  { id: "codespaces",  icon: "💻", label: "Codespaces" },
  { id: "quiz",        icon: "🧠", label: "Master Quiz" },
];

/* ═══════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════ */
function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={e=>{e.stopPropagation();try{navigator.clipboard.writeText(text);}catch(err){}setDone(true);setTimeout(()=>setDone(false),1400);}}
      style={{background:done?"rgba(74,222,128,.18)":"rgba(30,41,59,.7)",border:`1px solid ${done?"#4ade80":"#1a2540"}`,borderRadius:6,color:done?"#4ade80":"#64748b",padding:"3px 11px",cursor:"pointer",fontSize:11,whiteSpace:"nowrap",transition:"all .2s",flexShrink:0}}>
      {done?"✓ Copied":"Copy"}
    </button>
  );
}

function Badge({ children, color = T.green }) {
  return <span style={{background:`${color}18`,border:`1px solid ${color}40`,borderRadius:20,color,fontSize:11,padding:"2px 10px",fontWeight:600}}>{children}</span>;
}

function InfoBox({ icon="💡", title, children, color=T.blue }) {
  return (
    <div style={{background:`${color}08`,border:`1px solid ${color}25`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
      {title && <div style={{color,fontSize:12,fontWeight:700,marginBottom:8,letterSpacing:".06em"}}>{icon} {title}</div>}
      <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.75}}>{children}</div>
    </div>
  );
}

function ConceptDiagram({ children }) {
  return (
    <div style={{background:"#050b16",border:"1px solid #1a2540",borderRadius:10,padding:"16px 20px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#94a3b8",lineHeight:1.8,overflowX:"auto",marginBottom:14,whiteSpace:"pre"}}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{color:T.muted,fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:12,marginTop:24,borderBottom:"1px solid #1a2540",paddingBottom:6}}>{children}</div>;
}

function CommandCard({ cmd, desc, detail, example, warning, index=0 }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={()=>setOpen(o=>!o)}
      style={{background:open?"rgba(74,222,128,.04)":T.card,border:`1px solid ${open?"rgba(74,222,128,.25)":T.border}`,borderRadius:10,padding:"13px 16px",cursor:"pointer",transition:"all .18s",marginBottom:8,animation:`slideIn .3s ease ${index*.04}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12.5,color:T.green,flex:1,lineHeight:1.6,wordBreak:"break-all",whiteSpace:"pre-wrap"}}>{cmd}</code>
        <CopyBtn text={cmd}/>
      </div>
      <div style={{color:T.muted,fontSize:12,marginTop:5}}>{desc}</div>
      {open && (
        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #1a2540"}}>
          <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>📖 {detail}</div>
          {example && <div style={{color:T.amber,fontSize:12,fontStyle:"italic",marginBottom:6}}>✨ {example}</div>}
          {warning && <div style={{color:T.red,fontSize:12,background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:6,padding:"6px 10px",marginTop:8}}>⚠️ {warning}</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE TERMINAL
═══════════════════════════════════════════════════════ */
const TERM_RESPONSES = {
  "git init":["Initialized empty Git repository in /my-project/.git/","","📁 .git/ created — this is the brain of your repo:","  .git/HEAD        ← which branch you're on","  .git/objects/    ← all your commits stored here","  .git/refs/heads/ ← branch pointers"],
  "git status":["On branch main","Your branch is up to date with 'origin/main'.","","Changes not staged for commit:","  (use \"git add <file>...\" to update)","","        modified:   src/App.js","        modified:   README.md","","Untracked files:","        src/components/Hero.js","","no changes added to commit (use \"git add\")"],
  "git add .":["✓ Staged: src/App.js","✓ Staged: README.md","✓ Staged: src/components/Hero.js","","💡 All changes are now in the staging area, ready to commit.","   Run: git status  to verify"],
  "git log":["commit a3f2b1c (HEAD -> main, origin/main)","Author: You <you@example.com>","Date:   Tue Mar 10 2026 09:00:00","","    feat: add user authentication","","commit 9d4e5f6","Author: You <you@example.com>","Date:   Mon Mar 09 2026 14:22:11","","    feat: initial project setup"],
  "git log --oneline --graph --all":["* a3f2b1c (HEAD -> main) feat: add auth","* | d7e8f9a (feature/login) feat: login form","* | c5d6e7f feat: login API","|/","* 9d4e5f6 feat: project setup","* 1a2b3c4 chore: initial commit"],
  "git branch":["* main","  feature/login","  feature/dashboard","  hotfix/security-patch","","💡 The * marks your current branch."],
  "git diff":["diff --git a/src/App.js b/src/App.js","@@ -10,6 +10,10 @@ function App() {","   return (","","+    <div className='hero'>","+      <h1>Welcome Back!</h1>","+    </div>","   );","","Lines with + are ADDED, lines with - are REMOVED."],
  "git stash":["Saved working directory and index state","WIP on main: a3f2b1c feat: add auth","","💡 Your changes are safely stored. Use 'git stash pop' to restore."],
  "git stash pop":["On branch main","Changes not staged for commit:","        modified:   src/App.js","","✓ Stash applied and removed from stash list."],
  "git pull":["remote: Enumerating objects: 5, done.","remote: Counting objects: 100% (5/5), done.","Updating a3f2b1c..9d8c7b6","Fast-forward"," src/App.js | 12 ++++++------","","✓ Your branch is now up to date with origin/main 📥"],
  "git push":["Enumerating objects: 5, done.","Writing objects: 100% (3/3), 1.02 KiB | 1.02 MiB/s, done.","To https://github.com/user/repo.git","   a3f2b1c..9d8c7b6  main -> main","","✓ Successfully pushed to origin/main 🚀"],
  "git reflog":["a3f2b1c (HEAD -> main) HEAD@{0}: commit: feat: add auth","9d4e5f6 HEAD@{1}: commit: feat: setup","b2c3d4e HEAD@{2}: checkout: moving to main","c5d6e7f HEAD@{3}: commit: WIP","","💡 Even deleted commits appear here. Your ultimate safety net!","   Use: git reset --hard HEAD@{N}  to travel back in time."],
  "git blame src/app.js":["a3f2b1c (Alice   2026-03-10) const App = () => {","9d4e5f6 (Bob     2026-03-09)   const [count, setCount] = useState(0);","c5d6e7f (Alice   2026-03-08)   useEffect(() => { fetchData(); }, []);","b2c3d4e (Charlie 2026-03-07)   return null;",""],
  "git help":["📚 Simulated commands in this terminal:","","  git init            git status          git add .","  git log             git log --oneline --graph --all","  git branch          git diff             git stash","  git stash pop       git pull             git push","  git reflog          git blame src/app.js","","💡 For full documentation, explore the modules in the sidebar!"],
  "clear":["__CLEAR__"],
};

function Terminal({ compact = false }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    { t:"info", v:"GitSimulator Terminal v2.0 — type git commands to explore" },
    { t:"out",  v:'Try: git init  |  git status  |  git log  |  git help' },
    { t:"out",  v:"" },
  ]);
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[lines]);

  const run = useCallback(()=>{
    if (!input.trim()) return;
    const cmd = input.trim();
    const key = cmd.toLowerCase();
    const resp = TERM_RESPONSES[key];
    if (resp && resp[0]==="__CLEAR__") {
      setLines([{t:"info",v:"Terminal cleared. Ready."}]);
      setInput("");
      return;
    }
    const newEntries = [{t:"cmd",v:cmd}];
    if (resp) {
      resp.forEach(r=>newEntries.push({t: r.startsWith("✓")||r.startsWith("💡")||r.startsWith("📁")||r.startsWith("📚")?"ok":r.startsWith("diff")||r.startsWith("@@")||r.startsWith("+")?"diff":r.startsWith("-")?"minus":"out", v:r}));
    } else if (key.startsWith("git ")) {
      newEntries.push({t:"info",v:`Simulating: ${cmd}`});
      newEntries.push({t:"out", v:"Command recognised! In a real terminal, this would execute against your repo."});
      newEntries.push({t:"ok",  v:"💡 Explore the module for this command to see exactly what it does."});
    } else {
      newEntries.push({t:"err",v:`bash: ${cmd}: command not found. Try 'git help' for git commands.`});
    }
    newEntries.push({t:"out",v:""});
    setLines(prev => [...prev, ...newEntries]);
    setHist(p=>[cmd,...p]);
    setInput(""); setHIdx(-1);
  },[input]);

  const col = {cmd:"#4ade80",ok:"#34d399",info:"#60a5fa",err:"#f87171",diff:"#a78bfa",minus:"#f87171",out:"#64748b"};

  return (
    <div style={{background:"#050b13",border:"1px solid rgba(74,222,128,.2)",borderRadius:12,overflow:"hidden"}}>
      {/* title bar */}
      <div style={{background:T.surface,padding:"9px 14px",display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid rgba(74,222,128,.1)"}}>
        {["#f87171","#fbbf24","#4ade80"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
        <span style={{color:"#334155",fontSize:11,marginLeft:8,fontFamily:"monospace"}}>git-simulator — terminal</span>
      </div>
      {/* output */}
      <div style={{padding:14,height:compact?180:240,overflowY:"auto",scrollbarWidth:"thin",scrollbarColor:"#1a2540 transparent"}}>
        {lines.map((l,i)=>(
          <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.65,color:col[l.t]||col.out}}>
            {l.t==="cmd"&&<span style={{color:"#a78bfa"}}>$ </span>}{l.v}
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      {/* input */}
      <div style={{borderTop:"1px solid rgba(74,222,128,.08)",padding:"9px 14px",display:"flex",gap:10,alignItems:"center"}}>
        <span style={{color:"#a78bfa",fontFamily:"monospace",fontSize:13}}>$</span>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{
            if(e.key==="Enter") run();
            if(e.key==="ArrowUp"){const i=Math.min(hIdx+1,hist.length-1);setHIdx(i);if(hist[i])setInput(hist[i]);}
            if(e.key==="ArrowDown"){const i=Math.max(hIdx-1,-1);setHIdx(i);setInput(i===-1?"":hist[i]||"");}
            if(e.key==="Tab" && input.trim()){e.preventDefault();const m=Object.keys(TERM_RESPONSES).find(k=>k.startsWith(input));if(m)setInput(m);}
          }}
          placeholder="Type a git command… (↑↓ history, Tab autocomplete)"
          style={{flex:1,background:"transparent",border:"none",outline:"none",color:T.green,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}
        />
        <button onClick={run} style={{background:"rgba(74,222,128,.12)",border:"1px solid rgba(74,222,128,.25)",borderRadius:6,color:T.green,padding:"4px 12px",cursor:"pointer",fontSize:11}}>
          Run ↵
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STAGING AREA SIMULATOR
═══════════════════════════════════════════════════════ */
const MOCK_FILES = [
  {name:"src/App.jsx",   status:"modified"},
  {name:"src/auth.js",   status:"new"},
  {name:"README.md",     status:"modified"},
  {name:"package.json",  status:"modified"},
  {name:"src/utils.js",  status:"deleted"},
];

function StagingSimulator() {
  const [files, setFiles] = useState(MOCK_FILES.map(f=>({...f,staged:false})));
  const [committed, setCommitted] = useState([]);
  const [msg, setMsg] = useState("");
  const [phase, setPhase] = useState("working"); // working | staged | committed

  const unstaged = files.filter(f=>!f.staged);
  const staged   = files.filter(f=>f.staged);

  const stageFile = (name) => setFiles(fs=>fs.map(f=>f.name===name?{...f,staged:true}:f));
  const stageAll  = ()     => setFiles(fs=>fs.map(f=>({...f,staged:true})));
  const unstage   = (name) => setFiles(fs=>fs.map(f=>f.name===name?{...f,staged:false}:f));

  const doCommit = () => {
    if (!msg.trim()||staged.length===0) return;
    const id = Math.random().toString(36).slice(2,9);
    setCommitted(c=>[{id,msg:msg.trim(),files:staged.map(f=>f.name),time:new Date().toLocaleTimeString()},...c]);
    setFiles(fs=>fs.filter(f=>!f.staged));
    setMsg(""); setPhase("committed");
    setTimeout(()=>setPhase("working"),2000);
  };

  const reset = () => {
    setFiles(MOCK_FILES.map(f=>({...f,staged:false})));
    setCommitted([]);
    setMsg("");
    setPhase("working");
  };

  const statusColors = {modified:T.amber, new:T.green, deleted:T.red};
  const statusLabels = {modified:"M", new:"A", deleted:"D"};

  return (
    <div>
      <InfoBox icon="🎬" title="How the Three Areas Work" color={T.blue}>
        Git has <strong style={{color:T.blue}}>3 areas</strong>: your <strong style={{color:T.amber}}>Working Directory</strong> (files you're editing), the <strong style={{color:T.green}}>Staging Area</strong> (selected changes ready to snapshot), and the <strong style={{color:T.purple}}>Repository</strong> (permanent commit history). <code style={{color:T.green}}>git add</code> moves files to staging. <code style={{color:T.green}}>git commit</code> snapshots staging into the repo.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {/* Working Dir */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
          <div style={{color:T.amber,fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:10}}>📁 WORKING DIR</div>
          {unstaged.length===0
            ? <div style={{color:T.muted,fontSize:12,textAlign:"center",padding:16}}>✓ Nothing to stage</div>
            : unstaged.map(f=>(
              <div key={f.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{color:statusColors[f.status],fontFamily:"monospace",fontSize:11,fontWeight:700,width:14}}>{statusLabels[f.status]}</span>
                <span style={{color:"#94a3b8",fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
                <button onClick={()=>stageFile(f.name)} style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.2)",borderRadius:4,color:T.green,fontSize:10,padding:"2px 7px",cursor:"pointer"}}>add →</button>
              </div>
            ))
          }
          {unstaged.length>0&&<button onClick={stageAll} style={{width:"100%",background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:6,color:T.green,fontSize:11,padding:"6px",cursor:"pointer",marginTop:6}}>git add . (stage all)</button>}
        </div>
        {/* Staging Area */}
        <div style={{background:T.card,border:`1px solid ${staged.length>0?"rgba(74,222,128,.3)":T.border}`,borderRadius:10,padding:14}}>
          <div style={{color:T.green,fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:10}}>📦 STAGING AREA</div>
          {staged.length===0
            ? <div style={{color:T.muted,fontSize:12,textAlign:"center",padding:16}}>Use "add →" to stage files</div>
            : staged.map(f=>(
              <div key={f.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{color:T.green,fontFamily:"monospace",fontSize:11,fontWeight:700,width:14}}>✓</span>
                <span style={{color:"#94a3b8",fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</span>
                <button onClick={()=>unstage(f.name)} style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.2)",borderRadius:4,color:T.red,fontSize:10,padding:"2px 7px",cursor:"pointer"}}>← undo</button>
              </div>
            ))
          }
          {staged.length>0&&(
            <div style={{marginTop:10}}>
              <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder='feat: describe your change'
                style={{width:"100%",background:"rgba(10,14,26,.8)",border:`1px solid ${T.border}`,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:11,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}
                onKeyDown={e=>e.key==="Enter"&&doCommit()}
              />
              <button onClick={doCommit} disabled={!msg.trim()} style={{width:"100%",marginTop:6,background:msg.trim()?"rgba(167,139,250,.15)":"rgba(30,41,59,.3)",border:`1px solid ${msg.trim()?"rgba(167,139,250,.4)":T.border}`,borderRadius:6,color:msg.trim()?T.purple:T.muted,fontSize:11,padding:"7px",cursor:msg.trim()?"pointer":"default",transition:"all .2s"}}>
                git commit -m "…" →
              </button>
            </div>
          )}
        </div>
        {/* Repository */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
          <div style={{color:T.purple,fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:10}}>🏛️ REPOSITORY</div>
          {committed.length===0
            ? <div style={{color:T.muted,fontSize:12,textAlign:"center",padding:16}}>Commits appear here</div>
            : committed.map(c=>(
              <div key={c.id} style={{marginBottom:10,paddingBottom:10,borderBottom:"1px solid #1a2540"}}>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                  <span style={{color:T.purple,fontFamily:"monospace",fontSize:10}}>{c.id}</span>
                  <span style={{color:T.muted,fontSize:10}}>{c.time}</span>
                </div>
                <div style={{color:"#94a3b8",fontSize:11,marginBottom:4}}>{c.msg}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                  {c.files.map(f=><span key={f} style={{background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.2)",borderRadius:3,fontSize:9,color:T.purple,padding:"1px 5px"}}>{f.split("/").pop()}</span>)}
                </div>
              </div>
            ))
          }
          {phase==="committed"&&<div style={{color:T.green,fontSize:11,textAlign:"center",animation:"fadeIn .3s"}}>✓ Committed!</div>}
        </div>
      </div>
      {committed.length>0&&files.length===0&&(
        <div style={{textAlign:"center",marginTop:8,marginBottom:4}}>
          <button onClick={reset}
            style={{background:"rgba(30,41,59,.5)",border:"1px solid #1a2540",borderRadius:7,color:T.muted,fontSize:11,padding:"7px 20px",cursor:"pointer"}}>
            ↺ Reset Simulator
          </button>
        </div>
      )}
      <ConceptDiagram>{`
  git add                    git commit
Working Dir ──────────────► Staging Area ──────────────► Repository
   ↑                                                          │
   └──────────────────── git checkout ◄─────────────────────┘
   ↑                                                          │
   └──────────────────── git restore  ◄──── (unstage) ───────┘
`}</ConceptDiagram>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BRANCH SIMULATOR
═══════════════════════════════════════════════════════ */
function BranchSimulator() {
  const [branches, setBranches] = useState([
    {name:"main",   commits:["c0a1","d4b2","e9f3"],color:T.green,  current:false},
    {name:"develop",commits:["c0a1","d4b2","a1b2"],color:T.blue,   current:true},
  ]);
  const [newName, setNewName] = useState("");
  const [log, setLog] = useState(["Switched to branch 'develop'"]);

  const current = branches.find(b=>b.current) ?? branches[0];

  const addBranch = () => {
    const n = newName.trim();
    if (!n||branches.find(b=>b.name===n)) return;
    const base = current.commits;
    setBranches(bs=>[...bs,{name:n,commits:[...base],color:T.purple,current:false}]);
    setLog(l=>[`Branch '${n}' created from '${current.name}'`,...l]);
    setNewName("");
  };

  const switchBranch = (name) => {
    if (name===current.name) return;
    setBranches(bs=>bs.map(b=>({...b,current:b.name===name})));
    setLog(l=>[`Switched to branch '${name}'`,...l]);
  };

  const addCommit = () => {
    const id = Math.random().toString(36).slice(2,7);
    setBranches(bs=>bs.map(b=>b.current?{...b,commits:[...b.commits,id]}:b));
    setLog(l=>[`[${current.name}] Committed ${id} — changes saved`,...l]);
  };

  const deleteBranch = (name) => {
    if (name==="main"||name===current.name) return;
    setBranches(bs=>bs.filter(b=>b.name!==name));
    setLog(l=>[`Branch '${name}' deleted`,...l]);
  };

  return (
    <div>
      <InfoBox icon="🌿" title="What is a Branch?" color={T.green}>
        A branch is just a <strong style={{color:T.green}}>lightweight pointer</strong> to a specific commit. Creating a branch costs almost nothing — it's just a 41-byte file. When you commit on a branch, that pointer moves forward. <code style={{color:T.green}}>main</code> is the default branch. Feature branches let you experiment without touching <code style={{color:T.green}}>main</code>.
      </InfoBox>

      {/* Branch visual */}
      <div style={{background:"#050b13",border:"1px solid #1a2540",borderRadius:10,padding:16,marginBottom:14,overflowX:"auto"}}>
        <svg width={Math.max(500, branches.reduce((m,b)=>Math.max(m,b.commits.length),0)*70+60)} height={branches.length*54+30}>
          {branches.map((b,bi)=>{
            const y=bi*54+30;
            return (
              <g key={b.name}>
                {/* branch line */}
                {b.commits.length>1&&<line x1={40} y1={y} x2={40+(b.commits.length-1)*60} y2={y} stroke={b.color} strokeWidth="2" opacity=".35"/>}
                {/* commits */}
                {b.commits.map((c,ci)=>(
                  <g key={ci}>
                    <circle cx={40+ci*60} cy={y} r={b.current&&ci===b.commits.length-1?12:9} fill={b.color} opacity={b.current&&ci===b.commits.length-1?1:.7}/>
                    <circle cx={40+ci*60} cy={y} r={4} fill="#050b13"/>
                    <text x={40+ci*60} y={y+22} textAnchor="middle" fill={T.muted} fontSize="9" fontFamily="monospace">{c}</text>
                  </g>
                ))}
                {/* branch label */}
                <rect x={40+(b.commits.length-1)*60+18} y={y-11} width={b.name.length*7+14} height={22} rx="4" fill={`${b.color}20`} stroke={b.color} strokeWidth="1"/>
                <text x={40+(b.commits.length-1)*60+25} y={y+4} fill={b.color} fontSize="10" fontFamily="monospace" fontWeight="bold">{b.name}</text>
                {b.current&&<text x={40+(b.commits.length-1)*60+25} y={y-16} fill={T.amber} fontSize="9" fontFamily="monospace">HEAD →</text>}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:10}}>BRANCHES</div>
          {branches.map(b=>(
            <div key={b.name} style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:b.color,flexShrink:0}}/>
              <span style={{flex:1,color:b.current?"#e2e8f0":T.muted,fontSize:12,fontFamily:"monospace"}}>{b.name}</span>
              {b.current&&<Badge color={T.amber}>current</Badge>}
              {!b.current&&<button onClick={()=>switchBranch(b.name)} style={{background:"rgba(96,165,250,.1)",border:"1px solid rgba(96,165,250,.25)",borderRadius:4,color:T.blue,fontSize:10,padding:"2px 7px",cursor:"pointer"}}>switch</button>}
              {b.name!=="main"&&!b.current&&<button onClick={()=>deleteBranch(b.name)} style={{background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:4,color:T.red,fontSize:10,padding:"2px 7px",cursor:"pointer"}}>del</button>}
            </div>
          ))}
          <div style={{marginTop:12,display:"flex",gap:6}}>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="new-branch-name" onKeyDown={e=>e.key==="Enter"&&addBranch()}
              style={{flex:1,background:"rgba(10,14,26,.8)",border:`1px solid ${T.border}`,borderRadius:6,padding:"6px 9px",color:T.text,fontSize:11,outline:"none",fontFamily:"monospace"}}/>
            <button onClick={addBranch} style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:6,color:T.green,fontSize:11,padding:"6px 10px",cursor:"pointer"}}>+ Branch</button>
          </div>
        </div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:10}}>ACTIONS ON: <span style={{color:T.green}}>{current.name}</span></div>
          <button onClick={addCommit} style={{width:"100%",background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:7,color:T.green,fontSize:12,padding:"10px",cursor:"pointer",marginBottom:8}}>
            📸 git commit (add snapshot to current branch)
          </button>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,letterSpacing:".08em",marginTop:12,marginBottom:8}}>GIT LOG</div>
          <div style={{background:"#050b13",borderRadius:6,padding:8,height:80,overflowY:"auto",scrollbarWidth:"thin"}}>
            {log.slice(0,8).map((l,i)=><div key={i} style={{color:i===0?"#94a3b8":T.muted,fontSize:10,fontFamily:"monospace",lineHeight:1.7}}>{i===0?"→ ":""}{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MERGE SIMULATOR
═══════════════════════════════════════════════════════ */
function MergeSimulator() {
  const [mode, setMode] = useState("idle"); // idle | conflict | resolved | done
  const [file, setFile] = useState("");
  const [mergeLog, setMergeLog] = useState([]);

  const triggerMerge = () => {
    setMode("conflict");
    setMergeLog(["Merging feature/login into main...","CONFLICT (content): Merge conflict in src/auth.js","Automatic merge failed; fix conflicts and then commit."]);
    setFile(`function login(user) {
<<<<<<< HEAD (main)
  return db.findUser(user.email);
=======
  return api.authenticateUser(user.email, user.password);
>>>>>>> feature/login
}`);
  };

  const resolve = () => {
    setFile(`function login(user) {
  return api.authenticateUser(user.email, user.password);
}`);
    setMode("resolved");
    setMergeLog(l=>[...l,"","✓ Conflict resolved — edit done","Run: git add src/auth.js && git commit"]);
  };

  const finish = () => {
    setMode("done");
    setMergeLog(l=>[...l,"[main a3f2b1c] Merge branch 'feature/login'","✓ Successfully merged!"]);
  };

  return (
    <div>
      <InfoBox icon="🔀" title="Merge vs Rebase" color={T.purple}>
        <strong style={{color:T.green}}>Merge</strong> creates a new "merge commit" that ties two branch histories together — it's non-destructive and preserves the full story.<br/><br/>
        <strong style={{color:T.blue}}>Rebase</strong> rewrites your commits as if you wrote them on top of the target branch — creates a cleaner linear history but rewrites commit hashes.<br/><br/>
        <strong>Rule of thumb:</strong> Merge for shared/public branches. Rebase for your own local feature branches.
      </InfoBox>

      <ConceptDiagram>{`  MERGE                               REBASE
                                          
  main:    A─B─C─────M                main:    A─B─C
                ╲   ╱                                ╲
  feat:    A─B─D─E                    feat:    D'─E'  (replayed on top)
                   ↑                                    
               merge commit                  linear history ✓`}</ConceptDiagram>

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{color:T.muted,fontSize:11,fontWeight:700,letterSpacing:".08em",marginBottom:12}}>⚡ CONFLICT RESOLUTION SIMULATOR</div>

        {mode==="idle"&&(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{color:"#94a3b8",fontSize:13,marginBottom:16}}>Two branches edited the same line. See what a conflict looks like — and how to fix it.</div>
            <button onClick={triggerMerge} style={{background:"rgba(167,139,250,.12)",border:"1px solid rgba(167,139,250,.3)",borderRadius:8,color:T.purple,fontSize:13,padding:"10px 28px",cursor:"pointer"}}>
              🔀 Simulate: git merge feature/login
            </button>
          </div>
        )}

        {(mode==="conflict"||mode==="resolved")&&(
          <div>
            <div style={{background:"#050b13",border:`1px solid ${mode==="conflict"?"rgba(248,113,113,.3)":"rgba(74,222,128,.3)"}`,borderRadius:8,padding:12,marginBottom:12}}>
              <div style={{color:mode==="conflict"?T.red:T.green,fontSize:11,fontWeight:700,marginBottom:8}}>
                {mode==="conflict"?"⚠️ src/auth.js — CONFLICT DETECTED":"✓ src/auth.js — CONFLICT RESOLVED"}
              </div>
              <pre style={{margin:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,color:"#94a3b8",lineHeight:1.7,overflowX:"auto"}}>
                {file.split("\n").map((line,i)=>(
                  <div key={i} style={{color:line.startsWith("<<<<")?"#f87171":line.startsWith("====")?"#fbbf24":line.startsWith(">>>>")?"#60a5fa":line.startsWith("+")?"#4ade80":"#94a3b8"}}>
                    {line}
                  </div>
                ))}
              </pre>
            </div>
            {mode==="conflict"&&(
              <button onClick={resolve} style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:7,color:T.green,fontSize:12,padding:"9px 20px",cursor:"pointer",marginRight:8}}>
                ✓ Choose feature/login version (keep API auth)
              </button>
            )}
            {mode==="resolved"&&(
              <button onClick={finish} style={{background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.25)",borderRadius:7,color:T.purple,fontSize:12,padding:"9px 20px",cursor:"pointer"}}>
                📸 git add . && git commit (finish merge)
              </button>
            )}
          </div>
        )}

        {mode==="done"&&<div style={{color:T.green,textAlign:"center",fontSize:14,padding:"16px 0"}}>🎉 Merge complete! The timelines are unified.</div>}

        {mergeLog.length>0&&(
          <div style={{background:"#050b13",borderRadius:6,padding:10,marginTop:12}}>
            {mergeLog.map((l,i)=><div key={i} style={{fontFamily:"monospace",fontSize:11,color:l.startsWith("✓")||l.startsWith("[")?"#34d399":l.startsWith("CONFLICT")||l.startsWith("Automatic")?"#f87171":"#64748b",lineHeight:1.7}}>{l}</div>)}
          </div>
        )}

        {mode==="done"&&<button onClick={()=>{setMode("idle");setMergeLog([]);setFile("");}} style={{display:"block",margin:"12px auto 0",background:"rgba(30,41,59,.5)",border:"1px solid #1a2540",borderRadius:6,color:T.muted,fontSize:11,padding:"5px 14px",cursor:"pointer"}}>Reset</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMMIT GRAPH — fixed tooltip (no flicker)
═══════════════════════════════════════════════════════ */
const GRAPH_COMMITS = [
  {id:"1a2b3c",msg:"chore: initial commit",          branch:"main",   x:0,y:2,color:T.green},
  {id:"4d5e6f",msg:"feat: project scaffold",          branch:"main",   x:1,y:2,color:T.green},
  {id:"7g8h9i",msg:"feat: homepage layout",           branch:"main",   x:2,y:2,color:T.green},
  {id:"a1b2c3",msg:"feat: create login branch",       branch:"feature",x:3,y:0,color:T.blue},
  {id:"d4e5f6",msg:"fix: fix nav bug",                branch:"main",   x:3,y:2,color:T.green},
  {id:"g7h8i9",msg:"feat: login form UI",             branch:"feature",x:4,y:0,color:T.blue},
  {id:"j1k2l3",msg:"hotfix: critical sec patch",      branch:"hotfix", x:4,y:4,color:T.red},
  {id:"m4n5o6",msg:"feat: login API integration",     branch:"feature",x:5,y:0,color:T.blue},
  {id:"p7q8r9",msg:"fix: hotfix merged to main",      branch:"main",   x:5,y:2,color:T.green},
  {id:"s1t2u3",msg:"Merge: feature/login → main",     branch:"merge",  x:6,y:2,color:T.purple},
  {id:"v4w5x6",msg:"feat: user dashboard",            branch:"main",   x:7,y:2,color:T.green},
  {id:"y7z8a1",msg:"feat: analytics widget",          branch:"main",   x:8,y:2,color:T.green},
];
const GRAPH_EDGES=[
  ["1a2b3c","4d5e6f"],["4d5e6f","7g8h9i"],["7g8h9i","a1b2c3"],["7g8h9i","d4e5f6"],
  ["a1b2c3","g7h8i9"],["d4e5f6","j1k2l3"],["g7h8i9","m4n5o6"],["d4e5f6","p7q8r9"],
  ["m4n5o6","s1t2u3"],["p7q8r9","s1t2u3"],["s1t2u3","v4w5x6"],["v4w5x6","y7z8a1"],
];

const GRAPH_COMMIT_MAP = new Map(GRAPH_COMMITS.map(c => [c.id, c]));

function CommitGraph() {
  const [hovered, setHovered] = useState(null);
  const cellW=80, cellH=70, padX=50, padY=40;
  const svgW=GRAPH_COMMITS.reduce((m,c)=>Math.max(m,c.x),0)*cellW+padX*2+100;
  const svgH=GRAPH_COMMITS.reduce((m,c)=>Math.max(m,c.y),0)*cellH+padY*2+20;
  const cx=c=>padX+c.x*cellW;
  const cy=c=>padY+c.y*cellH;
  const gc=id=>GRAPH_COMMIT_MAP.get(id);
  return (
    <div>
      <InfoBox icon="📊" title="Reading the Commit Graph" color={T.teal}>
        Every <strong style={{color:T.green}}>circle = one commit</strong>. Lines show parent→child relationships. When a branch splits off, you see the line diverge. When branches merge, lines converge. <strong>Hover any commit</strong> to see its details. The <span style={{color:T.purple}}>purple node</span> is a merge commit — it has two parents.
      </InfoBox>
      {/* SVG with built-in tooltip — no DOM reflow, zero flicker */}
      <div style={{background:"#050b13",border:"1px solid #1a2540",borderRadius:12,overflowX:"auto",padding:"8px 0"}}>
        <svg width={svgW} height={svgH+80} style={{display:"block",minWidth:svgW}}>
          <defs>
            <filter id="glow2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#1a2540"/>
            </marker>
          </defs>
          {/* branch lane labels */}
          {[["main",2,T.green],["feature/login",0,T.blue],["hotfix",4,T.red]].map(([label,row,color])=>(
            <text key={label} x={padX-8} y={padY+row*cellH+4} textAnchor="end" fill={color} fontSize="10" fontFamily="monospace" fontWeight="bold" opacity=".8">{label}</text>
          ))}
          {/* horizontal lane lines */}
          {[[2,T.green],[0,T.blue],[4,T.red]].map(([row,color])=>(
            <line key={row} x1={padX} y1={padY+row*cellH} x2={svgW-10} y2={padY+row*cellH} stroke={color} strokeWidth="1" opacity=".1"/>
          ))}
          {/* edges */}
          {GRAPH_EDGES.map(([fid,tid],i)=>{
            const f=gc(fid), t=gc(tid);
            if(!f||!t) return null;
            const x1=cx(f),y1=cy(f),x2=cx(t),y2=cy(t);
            const curved=y1!==y2;
            const d=curved?`M${x1},${y1} C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}`:`M${x1},${y1} L${x2},${y2}`;
            return <path key={i} d={d} fill="none" stroke={t.color} strokeWidth="1.5" opacity=".4" strokeDasharray={curved?"6,3":"none"}/>;
          })}
          {/* commit nodes */}
          {GRAPH_COMMITS.map(c=>{
            const isH=hovered?.id===c.id;
            return (
              <g key={c.id} onMouseEnter={()=>setHovered(c)} onMouseLeave={()=>setHovered(null)} style={{cursor:"pointer"}}>
                <circle cx={cx(c)} cy={cy(c)} r={isH?15:11} fill={c.color} opacity={isH?1:.75} filter="url(#glow2)" style={{transition:"all .15s"}}/>
                <circle cx={cx(c)} cy={cy(c)} r={4.5} fill="#050b13"/>
                <text x={cx(c)} y={cy(c)+24} textAnchor="middle" fill={T.muted} fontSize="9" fontFamily="monospace">{c.id.slice(0,6)}</text>
              </g>
            );
          })}
          {/* TOOLTIP RENDERED INSIDE SVG — no reflow */}
          {hovered&&(()=>{
            const x=cx(hovered), y=cy(hovered);
            const boxW=200, boxH=64;
            const tx=Math.min(Math.max(x-boxW/2, 4), svgW-boxW-4);
            const ty=svgH-10;
            return (
              <g>
                <rect x={tx} y={ty} width={boxW} height={boxH} rx="8" fill="#0d1526" stroke={hovered.color} strokeWidth="1" opacity=".97"/>
                <text x={tx+12} y={ty+18} fill={hovered.color} fontSize="11" fontFamily="monospace" fontWeight="bold">{hovered.id}</text>
                <text x={tx+12} y={ty+34} fill="#94a3b8" fontSize="10" fontFamily="sans-serif">{hovered.msg.length>28?hovered.msg.slice(0,28)+"…":hovered.msg}</text>
                <text x={tx+12} y={ty+52} fill={T.muted} fontSize="9" fontFamily="monospace">branch: {hovered.branch}</text>
              </g>
            );
          })()}
        </svg>
      </div>
      <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
        {[[T.green,"main"],[T.blue,"feature"],[T.red,"hotfix"],[T.purple,"merge commit"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:c}}/>
            <span style={{color:T.muted,fontSize:11}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PR SIMULATOR
═══════════════════════════════════════════════════════ */
function PRSimulator() {
  const [step, setStep] = useState(0);
  const steps = [
    {icon:"🌿",label:"Branch pushed",    desc:"git push -u origin feature/user-auth"},
    {icon:"📝",label:"PR Opened",        desc:"GitHub shows diff, you write description"},
    {icon:"👀",label:"Code Review",      desc:"Teammates leave comments, request changes"},
    {icon:"🔧",label:"Address feedback", desc:"git commit + push fixes — PR auto-updates"},
    {icon:"✅",label:"Approved",         desc:"Reviewer approves — checks all pass"},
    {icon:"🔀",label:"Merged",           desc:"Squash & merge → main updated"},
    {icon:"🧹",label:"Cleanup",          desc:"Delete feature branch, git pull main"},
  ];
  return (
    <div>
      <InfoBox icon="🤝" title="What is a Pull Request?" color={T.blue}>
        A PR is <strong style={{color:T.blue}}>NOT a git concept</strong> — it's a <strong>GitHub feature</strong>. It's a web-based proposal to merge your branch into another. It includes a diff viewer, comment threads, CI status checks, and an approval system. This is how professional teams review code before it reaches main.
      </InfoBox>
      <div style={{position:"relative",paddingLeft:32}}>
        {steps.map((s,i)=>(
          <div key={i} onClick={()=>setStep(i)} style={{position:"relative",marginBottom:2,cursor:"pointer"}}>
            {i<steps.length-1&&<div style={{position:"absolute",left:-20,top:36,width:2,height:"calc(100% + 2px)",background:i<step?"linear-gradient(to bottom,#4ade80,#60a5fa)":"#1a2540",transition:"background .3s"}}/>}
            <div style={{position:"absolute",left:-27,top:14,width:14,height:14,borderRadius:"50%",background:i<=step?T.green:T.border,border:`2px solid ${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:T.bg,fontWeight:700,transition:"all .2s"}}>
              {i<step?"✓":i+1}
            </div>
            <div style={{background:i===step?"rgba(74,222,128,.05)":T.card,border:`1px solid ${i===step?"rgba(74,222,128,.25)":T.border}`,borderRadius:9,padding:"11px 14px",marginBottom:8,transition:"all .2s"}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:16}}>{s.icon}</span>
                <span style={{color:i===step?T.text:"#94a3b8",fontWeight:i===step?600:400,fontSize:13}}>{s.label}</span>
                {i<step&&<Badge color={T.green}>done</Badge>}
                {i===step&&<Badge color={T.amber}>current</Badge>}
              </div>
              {i===step&&<div style={{color:T.muted,fontSize:12,marginTop:6,fontFamily:"monospace"}}>{s.desc}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{flex:1,background:"rgba(30,41,59,.4)",border:`1px solid ${T.border}`,borderRadius:7,color:step===0?T.muted:T.text,fontSize:12,padding:9,cursor:step===0?"default":"pointer"}}>← Back</button>
        <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1} style={{flex:1,background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:7,color:step===steps.length-1?T.muted:T.green,fontSize:12,padding:9,cursor:step===steps.length-1?"default":"pointer"}}>Next Step →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   QUIZ
═══════════════════════════════════════════════════════ */
const QUESTIONS = [
  {q:"What does `git init` create?",     opts:["A GitHub repository","A hidden .git/ folder","A branch called main","A remote connection"],  ans:1, exp:"git init creates a .git/ folder — the database that stores all commits, branches, and history for your project."},
  {q:"What is the staging area?",        opts:["A remote server","A temporary holding area before committing","A backup of main branch","A GitHub feature"], ans:1, exp:"The staging area (index) holds changes you've 'git add'-ed. Only staged changes become part of the next commit — it's your selection frame."},
  {q:"Which command shows WHO wrote each line of a file?", opts:["git log --author","git who","git blame","git annotate"],ans:2, exp:"git blame shows every line of a file annotated with commit hash, author, and date. Perfect for detective work!"},
  {q:"What does `git fetch` do vs `git pull`?", opts:["They're identical","fetch downloads only; pull downloads + merges","pull downloads only; fetch downloads + merges","fetch deletes remote branches"],ans:1, exp:"git fetch safely downloads remote data without touching your local branches. git pull = git fetch + git merge."},
  {q:"How do you undo the last commit but KEEP changes staged?", opts:["git undo","git reset --soft HEAD~1","git revert HEAD","git restore --staged"],ans:1, exp:"git reset --soft HEAD~1 moves HEAD back one commit but leaves the changes ready to re-commit. Like pressing 'unsend' on an email but keeping the draft."},
  {q:"What is a 'detached HEAD' state?",  opts:["A broken repository","HEAD points directly to a commit, not a branch","A merge conflict","A deleted branch"],ans:1, exp:"Detached HEAD = you've checked out a specific commit (not a branch). Any new commits won't belong to any branch — they'll be lost if you switch away!"},
  {q:"What does `git rebase -i HEAD~3` do?", opts:["Rebase 3 remote branches","Delete last 3 commits","Interactively edit/squash/reorder last 3 commits","Reset to 3 commits ago"],ans:2, exp:"Interactive rebase opens an editor where you can squash, reword, reorder, or drop the last N commits. Powerful for cleaning up history before a PR."},
  {q:"What is `git cherry-pick abc1234`?", opts:["Delete commit abc1234","Apply only that one commit to the current branch","Merge entire branch","Revert that commit"],ans:1, exp:"Cherry-pick takes ONE specific commit from anywhere in history and applies it to your current branch. Like picking one good scene from another movie."},
  {q:"What does `--force-with-lease` do safer than `--force`?", opts:["Nothing different","Only force-pushes if nobody else pushed since your last fetch","Asks for confirmation","Creates a backup branch"],ans:1, exp:"--force-with-lease checks if the remote still matches your last fetch. If someone else pushed in the meantime, it refuses — preventing you from overwriting their work."},
  {q:"What is `git reflog`?",            opts:["Remote log of all users","Complete local history of every HEAD movement, including deleted commits","Log of all git config changes","Commit log for a specific file"],ans:1, exp:"reflog is your ultimate safety net — it records every place HEAD has been, even for commits you deleted. You can recover lost work with git reset --hard HEAD@{N}."},
];

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const q = QUESTIONS[idx];

  const pick = (i) => {
    if(sel!==null) return;
    setSel(i);
    if(i===q.ans) setScore(s=>s+1);
    setShowExp(true);
  };

  const next = () => {
    if(idx+1>=QUESTIONS.length){setDone(true);return;}
    setIdx(i=>i+1); setSel(null); setShowExp(false);
  };

  if(done) {
    const pct = Math.round((score/QUESTIONS.length)*100);
    return (
      <div style={{textAlign:"center",padding:"30px 20px"}}>
        <div style={{fontSize:56,marginBottom:12}}>{pct===100?"🏆":pct>=70?"⭐":"📚"}</div>
        <div style={{color:T.green,fontSize:28,fontWeight:700,fontFamily:"monospace"}}>{score}/{QUESTIONS.length}</div>
        <div style={{color:"#94a3b8",fontSize:14,marginTop:6,marginBottom:24}}>{pct===100?"Perfect! You're a Git Master 🎉":pct>=70?"Great work! Review the missed ones.":"Keep exploring the modules and retry!"}</div>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"16px 20px",marginBottom:20,display:"inline-block",minWidth:260}}>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:8}}>
            <div style={{width:`${pct}%`,minWidth:4,height:8,background:`linear-gradient(90deg,${T.green},${T.teal})`,borderRadius:4}}/>
            <div style={{width:`${100-pct}%`,height:8,background:T.border,borderRadius:4}}/>
          </div>
          <div style={{color:T.muted,fontSize:12}}>{pct}% correct</div>
        </div>
        <br/>
        <button onClick={()=>{setIdx(0);setSel(null);setScore(0);setDone(false);setShowExp(false);}} style={{background:"rgba(74,222,128,.12)",border:"1px solid rgba(74,222,128,.3)",borderRadius:9,color:T.green,fontSize:13,padding:"10px 28px",cursor:"pointer"}}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:4}}>
          {QUESTIONS.map((_,i)=>(
            <div key={i} style={{width:i===idx?20:8,height:8,borderRadius:4,background:i<idx?T.green:i===idx?T.amber:T.border,transition:"all .2s"}}/>
          ))}
        </div>
        <span style={{color:T.muted,fontSize:12}}>Score: <span style={{color:T.green}}>{score}</span></span>
      </div>
      <div style={{color:T.text,fontSize:15,lineHeight:1.6,marginBottom:20,fontWeight:500}}>
        Q{idx+1}. {q.q}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {q.opts.map((opt,i)=>{
          let bg=T.card, border=T.border, col="#94a3b8";
          if(sel!==null){
            if(i===q.ans){bg="rgba(74,222,128,.1)";border="rgba(74,222,128,.4)";col=T.green;}
            else if(i===sel&&sel!==q.ans){bg="rgba(248,113,113,.1)";border="rgba(248,113,113,.35)";col=T.red;}
          }
          return (
            <button key={i} onClick={()=>pick(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:8,padding:"11px 15px",color:col,textAlign:"left",cursor:sel!==null?"default":"pointer",transition:"all .2s",fontSize:13,lineHeight:1.4}}>
              <span style={{color:T.muted,marginRight:8,fontFamily:"monospace"}}>{String.fromCharCode(65+i)}.</span>{opt}
              {sel!==null&&i===q.ans&&<span style={{marginLeft:8}}>✓</span>}
              {sel!==null&&i===sel&&sel!==q.ans&&<span style={{marginLeft:8}}>✗</span>}
            </button>
          );
        })}
      </div>
      {showExp&&(
        <div style={{background:"rgba(96,165,250,.07)",border:"1px solid rgba(96,165,250,.2)",borderRadius:9,padding:"12px 14px",marginBottom:14,animation:"slideIn .25s ease"}}>
          <div style={{color:T.blue,fontSize:11,fontWeight:700,marginBottom:6}}>💡 EXPLANATION</div>
          <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>{q.exp}</div>
        </div>
      )}
      {sel!==null&&(
        <button onClick={next} style={{width:"100%",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:8,color:T.green,fontSize:13,padding:"11px",cursor:"pointer"}}>
          {idx+1>=QUESTIONS.length?"See Results 🏆":"Next Question →"}
        </button>
      )}
    </div>
  );
}



/* ═══════════════════════════════════════════════════════
   ISSUES SIMULATOR
═══════════════════════════════════════════════════════ */
const ISSUE_LABELS = [
  {name:"bug",color:"#f87171"},{name:"enhancement",color:"#60a5fa"},
  {name:"good first issue",color:"#4ade80"},{name:"help wanted",color:"#fbbf24"},
  {name:"documentation",color:"#a78bfa"},{name:"wontfix",color:"#64748b"},
];
function IssuesSimulator() {
  const [issues, setIssues] = useState([
    {id:1,title:"Login button crashes on Safari",label:"bug",state:"open",comments:3,author:"alice",body:"Steps: open Safari, click login, app freezes."},
    {id:2,title:"Add dark mode support",label:"enhancement",state:"open",comments:7,author:"bob",body:"Users requested a dark theme."},
    {id:3,title:"Fix typo in README",label:"good first issue",state:"closed",comments:1,author:"charlie",body:"Line 42: recieve should be receive."},
  ]);
  const [form, setForm] = useState({title:"",label:"bug",body:""});
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("open");

  const create = () => {
    if (!form.title.trim()) return;
    setIssues(prev=>[{id:prev.length+1,title:form.title,label:form.label,state:"open",comments:0,author:"you",body:form.body||"No description."},...prev]);
    setForm({title:"",label:"bug",body:""});
  };
  const closeIssue = (id) => setIssues(prev=>prev.map(i=>i.id===id?{...i,state:i.state==="open"?"closed":"open"}:i));
  const shown = issues.filter(i=>filter==="all"||i.state===filter);

  return (
    <div>
      <InfoBox icon="🐛" title="Issues are your project memory" color={T.red}>
        Every bug report, feature request, or question lives as an Issue — a ticket system built into GitHub.
        Issues can be assigned, tagged with labels, linked to PRs, and tracked on a board.
        Write Fixes #42 in a PR description to auto-close the issue on merge.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,overflow:"hidden"}}>
          <div style={{padding:"10px 14px",borderBottom:"1px solid "+T.border,display:"flex",gap:8}}>
            {["open","closed","all"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                style={{background:filter===f?"rgba(74,222,128,.12)":"transparent",border:"1px solid "+(filter===f?"rgba(74,222,128,.3)":T.border),borderRadius:5,color:filter===f?T.green:T.muted,fontSize:10,padding:"3px 10px",cursor:"pointer"}}>
                {f} ({issues.filter(i=>f==="all"||i.state===f).length})
              </button>
            ))}
          </div>
          <div style={{maxHeight:260,overflowY:"auto"}}>
            {shown.map(i=>{
              const lc=(ISSUE_LABELS.find(l=>l.name===i.label)||{color:T.blue}).color;
              return (
                <div key={i.id} onClick={()=>setSel(i)}
                  style={{padding:"10px 14px",borderBottom:"1px solid "+T.border,cursor:"pointer",background:sel&&sel.id===i.id?"rgba(74,222,128,.04)":"transparent"}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{fontSize:13,marginTop:1}}>{i.state==="open"?"🟢":"⚫"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{color:T.text,fontSize:12,fontWeight:500,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.title}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{background:lc+"20",border:"1px solid "+lc+"50",borderRadius:10,fontSize:9,color:lc,padding:"1px 6px"}}>{i.label}</span>
                        <span style={{color:T.muted,fontSize:10}}>#{i.id} · {i.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {sel ? (
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:T.muted,fontSize:11}}>Issue #{sel.id}</span>
                <button onClick={()=>closeIssue(sel.id)}
                  style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:5,color:T.green,fontSize:10,padding:"3px 10px",cursor:"pointer"}}>
                  {sel.state==="open"?"Close":"Reopen"}
                </button>
              </div>
              <div style={{color:T.text,fontSize:13,fontWeight:600,marginBottom:6}}>{sel.title}</div>
              <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.7,marginBottom:8}}>{sel.body}</div>
              <div style={{color:T.green,fontSize:11,background:"rgba(74,222,128,.05)",border:"1px solid rgba(74,222,128,.15)",borderRadius:6,padding:"8px 10px"}}>
                In a PR, write: Fixes #{sel.id} to auto-close on merge
              </div>
            </div>
          ) : (
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
              <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:10}}>NEW ISSUE</div>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Issue title"
                style={{width:"100%",background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:12,outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
              <select value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))}
                style={{width:"100%",background:"rgba(6,11,24,.8)",border:"1px solid "+T.border,borderRadius:6,padding:"6px 10px",color:T.text,fontSize:11,outline:"none",marginBottom:8,boxSizing:"border-box"}}>
                {ISSUE_LABELS.map(l=><option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
              <textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="Describe the issue" rows={3}
                style={{width:"100%",background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:8}}/>
              <button onClick={create}
                style={{width:"100%",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:7,color:T.green,fontSize:12,padding:9,cursor:"pointer"}}>
                Submit Issue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROJECTS KANBAN
═══════════════════════════════════════════════════════ */
const INIT_KANBAN = {
  todo:   [{id:1,title:"Design login page",tag:"enhancement"},{id:2,title:"Write API docs",tag:"docs"},{id:3,title:"Fix mobile layout",tag:"bug"}],
  inprog: [{id:4,title:"Build auth system",tag:"enhancement"}],
  review: [{id:5,title:"Add rate limiting",tag:"bug"}],
  done:   [{id:6,title:"Setup CI pipeline",tag:"enhancement"},{id:7,title:"Write unit tests",tag:"docs"}],
};
const KCOLS = {todo:{label:"To Do",color:"#64748b"},inprog:{label:"In Progress",color:"#fbbf24"},review:{label:"In Review",color:"#60a5fa"},done:{label:"Done",color:"#4ade80"}};

function ProjectsSimulator() {
  const [cols,setCols] = useState(INIT_KANBAN);
  const [drag,setDrag] = useState(null);
  const [over,setOver] = useState(null);
  const tcolor = t => ({bug:"#f87171",enhancement:"#60a5fa",docs:"#a78bfa"})[t]||T.muted;

  const drop = colId => {
    if (!drag||drag.col===colId){setDrag(null);setOver(null);return;}
    setCols(p=>({...p,[drag.col]:p[drag.col].filter(c=>c.id!==drag.card.id),[colId]:[...p[colId],drag.card]}));
    setDrag(null);setOver(null);
  };

  return (
    <div>
      <InfoBox icon="📋" title="GitHub Projects — your team Kanban board" color={T.blue}>
        GitHub Projects v2 is a spreadsheet and Kanban board built into GitHub. Every issue and PR can be a card.
        Cards move through columns as work progresses. When you close an issue the card auto-moves.
        Drag cards between columns below to try it.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {Object.entries(cols).map(([colId,cards])=>{
          const meta=KCOLS[colId];
          const isOver=over===colId;
          return (
            <div key={colId}
              onDragOver={e=>{e.preventDefault();setOver(colId);}}
              onDrop={()=>drop(colId)}
              onDragLeave={()=>setOver(null)}
              style={{background:isOver?"rgba(74,222,128,.05)":T.card,border:"1px solid "+(isOver?"rgba(74,222,128,.3)":T.border),borderRadius:10,padding:10,minHeight:180}}>
              <div style={{color:meta.color,fontSize:11,fontWeight:700,marginBottom:10,display:"flex",justifyContent:"space-between"}}>
                <span>{meta.label}</span>
                <span style={{background:meta.color+"20",borderRadius:10,padding:"1px 7px",fontSize:10}}>{cards.length}</span>
              </div>
              {cards.map(card=>{
                const isDrag=drag&&drag.card.id===card.id;
                return (
                  <div key={card.id} draggable onDragStart={()=>setDrag({card,col:colId})} onDragEnd={()=>{setDrag(null);setOver(null);}}
                    style={{background:"rgba(6,11,24,.6)",border:"1px solid "+(isDrag?"rgba(74,222,128,.3)":T.border),borderRadius:7,padding:"9px 10px",marginBottom:7,cursor:"grab",opacity:isDrag?0.5:1}}>
                    <div style={{color:T.text,fontSize:11,marginBottom:5}}>{card.title}</div>
                    <span style={{background:tcolor(card.tag)+"18",border:"1px solid "+tcolor(card.tag)+"40",borderRadius:8,fontSize:9,color:tcolor(card.tag),padding:"1px 6px"}}>{card.tag}</span>
                  </div>
                );
              })}
              {isOver&&drag&&<div style={{border:"2px dashed rgba(74,222,128,.3)",borderRadius:7,padding:16,textAlign:"center",color:"rgba(74,222,128,.5)",fontSize:11}}>Drop here</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGES SIMULATOR
═══════════════════════════════════════════════════════ */
function PagesSimulator() {
  const [source,setSource] = useState("branch");
  const [step,setStep] = useState(0);
  const [deployed,setDeployed] = useState(false);
  const [building,setBuilding] = useState(false);

  const deploy = () => {
    if(step<3)return;
    setBuilding(true);
    setTimeout(()=>{setBuilding(false);setDeployed(true);setStep(4);},2000);
  };

  const resetPages = () => {
    setSource("branch"); setStep(0); setDeployed(false); setBuilding(false);
  };

  const steps=[
    {label:"Choose source",done:step>0},
    {label:"Configure branch",done:step>1},
    {label:"Commit your site",done:step>2},
    {label:"Push to GitHub",done:step>3},
    {label:"Site is live!",done:deployed},
  ];

  return (
    <div>
      <InfoBox icon="🌍" title="GitHub Pages — free website hosting from your repo" color={T.green}>
        GitHub Pages publishes any static site directly from a branch or folder.
        Your URL will be username.github.io/repo-name — free, HTTPS included, worldwide CDN.
        Perfect for portfolios, documentation sites, and project demos.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:12}}>CONFIGURE PAGES</div>
          {[{v:"branch",l:"Deploy from branch"},{v:"actions",l:"GitHub Actions workflow"}].map(opt=>(
            <label key={opt.v} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,cursor:"pointer"}}>
              <input type="radio" checked={source===opt.v}
                onChange={()=>{setSource(opt.v);setStep(s=>Math.max(s,1));}}
                style={{accentColor:T.green}}/>
              <span style={{color:T.text,fontSize:12}}>{opt.l}</span>
            </label>
          ))}
          <div style={{height:12}}/>
          <button onClick={()=>setStep(s=>Math.min(s+1,3))} disabled={step>=3}
            style={{width:"100%",background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:6,color:step>=3?T.muted:T.green,fontSize:11,padding:8,cursor:step>=3?"default":"pointer",marginBottom:8}}>
            {step===0?"Save — Configure Branch":step===1?"Save — Commit Your Site":step===2?"Save — Push to GitHub":"Settings Saved ✓"}
          </button>
          <button onClick={deploy} disabled={step<3||deployed||building}
            style={{width:"100%",background:deployed?"rgba(74,222,128,.12)":"rgba(96,165,250,.1)",border:"1px solid "+(deployed?"rgba(74,222,128,.3)":"rgba(96,165,250,.3)"),borderRadius:6,color:deployed?T.green:T.blue,fontSize:11,padding:8,cursor:(step<3||deployed||building)?"default":"pointer"}}>
            {building?"Building...":deployed?"Site is Live!":"Deploy Site"}
          </button>
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:12}}>DEPLOYMENT STEPS</div>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:s.done?"rgba(74,222,128,.2)":"rgba(26,37,64,.5)",border:"1px solid "+(s.done?T.green:T.border),display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:s.done?T.green:T.muted,flexShrink:0}}>
                {s.done?"✓":i+1}
              </div>
              <span style={{color:s.done?T.text:T.muted,fontSize:12}}>{s.label}</span>
            </div>
          ))}
          {deployed&&(
            <div style={{marginTop:10}}>
              <div style={{background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:8,padding:10,marginBottom:10}}>
                <div style={{color:T.green,fontSize:11,fontWeight:700,marginBottom:4}}>🎉 Your site is live:</div>
                <div style={{color:T.blue,fontSize:12,fontFamily:"monospace"}}>username.github.io/my-project</div>
              </div>
              <button onClick={resetPages}
                style={{width:"100%",background:"rgba(30,41,59,.5)",border:"1px solid #1a2540",borderRadius:6,color:T.muted,fontSize:11,padding:7,cursor:"pointer"}}>
                ↺ Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RELEASES SIMULATOR
═══════════════════════════════════════════════════════ */
function ReleasesSimulator() {
  const [releases,setReleases] = useState([
    {tag:"v2.1.0",name:"The Performance Update",date:"2026-03-01",pre:false,notes:"- 40% faster loads\n- Fixed 12 bugs\n- New dark mode"},
    {tag:"v2.0.0",name:"Major Rewrite",date:"2026-02-01",pre:false,notes:"- Complete redesign\n- New auth\n- Breaking: API v1 removed"},
    {tag:"v2.2.0-beta",name:"Beta: AI Features",date:"2026-03-08",pre:true,notes:"- Experimental AI\n- Not for production"},
  ]);
  const [form,setForm]=useState({tag:"",name:"",notes:"",pre:false});
  const [open,setOpen]=useState(false);

  const publish=()=>{
    if(!form.tag.trim())return;
    setReleases(r=>[{...form,date:new Date().toISOString().slice(0,10)},...r]);
    setForm({tag:"",name:"",notes:"",pre:false});
    setOpen(false);
  };

  return (
    <div>
      <InfoBox icon="📦" title="Releases — official versioned snapshots" color={T.amber}>
        A Release is a named, versioned snapshot of your repo at a specific tag.
        Use Semantic Versioning: MAJOR.MINOR.PATCH — bump MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
        {[{bump:"MAJOR",ex:"v1.0.0 → v2.0.0",note:"Breaking change",c:T.red},{bump:"MINOR",ex:"v1.0.0 → v1.1.0",note:"New feature",c:T.blue},{bump:"PATCH",ex:"v1.0.0 → v1.0.1",note:"Bug fix only",c:T.green}].map(v=>(
          <div key={v.bump} style={{background:v.c+"08",border:"1px solid "+v.c+"25",borderRadius:8,padding:10}}>
            <div style={{color:v.c,fontSize:13,fontWeight:700,fontFamily:"monospace",marginBottom:4}}>{v.bump}</div>
            <div style={{color:"#94a3b8",fontSize:10,fontFamily:"monospace",marginBottom:4}}>{v.ex}</div>
            <div style={{color:T.muted,fontSize:10}}>{v.note}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{color:T.muted,fontSize:11,fontWeight:700}}>RELEASES</div>
            <button onClick={()=>setOpen(o=>!o)}
              style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:5,color:T.green,fontSize:10,padding:"3px 10px",cursor:"pointer"}}>
              {open?"Cancel":"+ New"}
            </button>
          </div>
          {releases.map((r,i)=>(
            <div key={i} style={{background:T.card,border:"1px solid "+(r.pre?"rgba(251,191,36,.3)":T.border),borderRadius:8,padding:"10px 12px",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <span style={{background:"rgba(74,222,128,.12)",border:"1px solid rgba(74,222,128,.2)",borderRadius:5,fontSize:10,color:T.green,padding:"1px 7px",fontFamily:"monospace"}}>{r.tag}</span>
                {r.pre&&<span style={{background:"rgba(251,191,36,.1)",border:"1px solid rgba(251,191,36,.2)",borderRadius:5,fontSize:9,color:T.amber,padding:"1px 6px"}}>pre-release</span>}
                <span style={{color:T.muted,fontSize:10,marginLeft:"auto"}}>{r.date}</span>
              </div>
              <div style={{color:T.text,fontSize:12,fontWeight:500,marginBottom:4}}>{r.name}</div>
              <pre style={{color:T.muted,fontSize:10,margin:0,fontFamily:"monospace",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{r.notes}</pre>
            </div>
          ))}
        </div>
        {open&&(
          <div style={{background:T.card,border:"1px solid rgba(74,222,128,.2)",borderRadius:10,padding:14}}>
            <div style={{color:T.green,fontSize:11,fontWeight:700,marginBottom:12}}>CREATE RELEASE</div>
            <input value={form.tag} onChange={e=>setForm(p=>({...p,tag:e.target.value}))} placeholder="Tag: v1.2.3"
              style={{width:"100%",background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:12,outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Release title"
              style={{width:"100%",background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:12,outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
            <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder={"What is new?\n- Feature\n- Fix"} rows={4}
              style={{width:"100%",background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:12,outline:"none",resize:"none",boxSizing:"border-box",marginBottom:8}}/>
            <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,cursor:"pointer"}}>
              <input type="checkbox" checked={form.pre} onChange={e=>setForm(p=>({...p,pre:e.target.checked}))} style={{accentColor:T.amber}}/>
              <span style={{color:"#94a3b8",fontSize:12}}>Pre-release (beta/alpha)</span>
            </label>
            <button onClick={publish}
              style={{width:"100%",background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.25)",borderRadius:7,color:T.green,fontSize:12,padding:9,cursor:"pointer"}}>
              Publish Release
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BRANCH PROTECTION
═══════════════════════════════════════════════════════ */
function ProtectionSim() {
  const [rules,setRules]=useState({pr:true,approvals:1,ci:true,noForce:true,noDel:true,upToDate:false,signed:false});
  const [scenario,setScenario]=useState(null);
  const toggle=k=>setRules(r=>({...r,[k]:!r[k]}));

  const SCENARIOS=[
    {id:"push",  label:"Push directly to main",    passes:!rules.pr,      why:"Requires a pull request first"},
    {id:"noci",  label:"Merge PR with failing CI",  passes:!rules.ci,      why:"All CI checks must pass"},
    {id:"self",  label:"Merge your own PR",         passes:rules.approvals===0, why:"Need "+rules.approvals+" approval(s) from someone else"},
    {id:"force", label:"git push --force to main",  passes:!rules.noForce, why:"Force pushes are blocked"},
    {id:"del",   label:"Delete the main branch",    passes:!rules.noDel,   why:"Branch deletion is locked"},
  ];

  return (
    <div>
      <InfoBox icon="🔒" title="Branch Protection — guardrails for main" color={T.purple}>
        Branch Protection Rules enforce quality gates. No one — not even the repo owner — can bypass them.
        Every change to main must be reviewed, tested, and approved. This is how every serious team ships safely.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:12}}>RULES FOR: main</div>
          {[
            {k:"pr",       label:"Require pull request before merging"},
            {k:"ci",       label:"Require CI status checks to pass"},
            {k:"noForce",  label:"Block force pushes"},
            {k:"noDel",    label:"Prevent branch deletion"},
            {k:"upToDate", label:"Require branch up to date"},
            {k:"signed",   label:"Require signed commits"},
          ].map(r=>(
            <div key={r.k} onClick={()=>toggle(r.k)}
              style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,cursor:"pointer"}}>
              <div style={{width:36,height:20,borderRadius:10,background:rules[r.k]?"rgba(74,222,128,.3)":"rgba(30,41,64,.5)",border:"1px solid "+(rules[r.k]?"rgba(74,222,128,.5)":T.border),position:"relative",flexShrink:0}}>
                <div style={{position:"absolute",top:2,left:rules[r.k]?18:2,width:14,height:14,borderRadius:"50%",background:rules[r.k]?T.green:T.muted,transition:"left .2s"}}/>
              </div>
              <span style={{color:rules[r.k]?T.text:"#94a3b8",fontSize:12}}>{r.label}</span>
            </div>
          ))}
          {rules.pr&&(
            <div style={{paddingTop:10,borderTop:"1px solid "+T.border}}>
              <div style={{color:"#94a3b8",fontSize:11,marginBottom:6}}>Required approvals: <span style={{color:T.green}}>{rules.approvals}</span></div>
              <input type="range" min={0} max={4} value={rules.approvals}
                onChange={e=>setRules(r=>({...r,approvals:Number(e.target.value)}))}
                style={{width:"100%",accentColor:T.green}}/>
            </div>
          )}
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:10}}>TEST YOUR RULES</div>
          {SCENARIOS.map(s=>(
            <button key={s.id} onClick={()=>setScenario(s)}
              style={{display:"block",width:"100%",background:scenario&&scenario.id===s.id?(s.passes?"rgba(74,222,128,.1)":"rgba(248,113,113,.1)"):"rgba(13,21,38,.5)",border:"1px solid "+(scenario&&scenario.id===s.id?(s.passes?"rgba(74,222,128,.3)":"rgba(248,113,113,.3)"):T.border),borderRadius:7,padding:"9px 12px",color:T.text,textAlign:"left",cursor:"pointer",marginBottom:7,fontSize:12}}>
              {s.label}
            </button>
          ))}
          {scenario&&(
            <div style={{marginTop:10,background:scenario.passes?"rgba(74,222,128,.06)":"rgba(248,113,113,.06)",border:"1px solid "+(scenario.passes?"rgba(74,222,128,.2)":"rgba(248,113,113,.2)"),borderRadius:8,padding:"10px 12px"}}>
              <div style={{color:scenario.passes?T.green:T.red,fontSize:12,fontWeight:700,marginBottom:4}}>
                {scenario.passes?"ALLOWED":"BLOCKED"}
              </div>
              <div style={{color:"#94a3b8",fontSize:11}}>{scenario.passes?"Permitted by current rules.":scenario.why}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CODEOWNERS
═══════════════════════════════════════════════════════ */
function CodeownersSim() {
  const [rules,setRules]=useState([
    {pattern:"*",           owners:"@alice @bob",    note:"Default: review everything"},
    {pattern:"src/payments/",owners:"@payment-team", note:"Payment code"},
    {pattern:"*.md",        owners:"@docs-team",     note:"Documentation"},
    {pattern:".github/",   owners:"@devops",        note:"CI and config"},
    {pattern:"src/auth/",   owners:"@security-team", note:"Auth changes"},
  ]);
  const [testFile,setTestFile]=useState("src/payments/checkout.js");
  const [newR,setNewR]=useState({pattern:"",owners:""});

  const getMatch=file=>{
    const hits=rules.filter(r=>{
      if(r.pattern==="*")return true;
      if(r.pattern.endsWith("/"))return file.startsWith(r.pattern);
      if(r.pattern.startsWith("*."))return file.endsWith(r.pattern.slice(1));
      return file.includes(r.pattern);
    });
    return hits.length>0?hits[hits.length-1]:null;
  };

  const addRule=()=>{
    if(!newR.pattern.trim()||!newR.owners.trim())return;
    setRules(r=>[...r,{...newR,note:"Custom rule"}]);
    setNewR({pattern:"",owners:""});
  };

  const matched=getMatch(testFile);

  return (
    <div>
      <InfoBox icon="👑" title="CODEOWNERS — auto-assign reviewers by file path" color={T.amber}>
        The CODEOWNERS file maps file patterns to GitHub users or teams.
        When a PR touches those files, those owners are automatically requested as reviewers.
        Combined with Branch Protection this ensures the right experts always review the right code.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,overflow:"hidden"}}>
          <div style={{background:"rgba(6,11,24,.8)",borderBottom:"1px solid "+T.border,padding:"8px 14px"}}>
            <span style={{color:"#94a3b8",fontSize:11,fontFamily:"monospace"}}>.github/CODEOWNERS</span>
          </div>
          <div style={{padding:14}}>
            {rules.map((r,i)=>(
              <div key={i} style={{marginBottom:10,paddingBottom:10,borderBottom:i<rules.length-1?"1px solid "+T.border:"none"}}>
                <div style={{display:"flex",gap:8,marginBottom:3}}>
                  <code style={{color:T.green,fontSize:11,fontFamily:"monospace",flex:1}}>{r.pattern}</code>
                  <code style={{color:T.blue,fontSize:11,fontFamily:"monospace"}}>{r.owners}</code>
                </div>
                <div style={{color:T.muted,fontSize:10}}>#{r.note}</div>
              </div>
            ))}
            <div style={{display:"flex",gap:6,marginTop:6}}>
              <input value={newR.pattern} onChange={e=>setNewR(p=>({...p,pattern:e.target.value}))} placeholder="src/feature/"
                style={{flex:1,background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:5,padding:"5px 8px",color:T.text,fontSize:11,outline:"none",fontFamily:"monospace"}}/>
              <input value={newR.owners} onChange={e=>setNewR(p=>({...p,owners:e.target.value}))} placeholder="@team"
                style={{flex:1,background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:5,padding:"5px 8px",color:T.text,fontSize:11,outline:"none"}}/>
              <button onClick={addRule} style={{background:"rgba(74,222,128,.1)",border:"1px solid rgba(74,222,128,.2)",borderRadius:5,color:T.green,fontSize:10,padding:"5px 10px",cursor:"pointer"}}>+</button>
            </div>
          </div>
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:12}}>WHO REVIEWS THIS FILE?</div>
          <input value={testFile} onChange={e=>setTestFile(e.target.value)} placeholder="Type a file path"
            style={{width:"100%",background:"rgba(6,11,24,.6)",border:"1px solid "+T.border,borderRadius:6,padding:"7px 10px",color:T.text,fontSize:12,outline:"none",fontFamily:"monospace",boxSizing:"border-box",marginBottom:10}}/>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {["src/payments/checkout.js","src/auth/login.js","README.md",".github/ci.yml","src/utils/helper.js"].map(f=>(
              <button key={f} onClick={()=>setTestFile(f)}
                style={{background:testFile===f?"rgba(96,165,250,.12)":"rgba(13,21,38,.5)",border:"1px solid "+(testFile===f?"rgba(96,165,250,.3)":T.border),borderRadius:5,color:testFile===f?T.blue:T.muted,fontSize:10,padding:"3px 8px",cursor:"pointer"}}>
                {f.split("/").pop()}
              </button>
            ))}
          </div>
          {matched ? (
            <div style={{background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:8,padding:12}}>
              <div style={{color:T.green,fontSize:11,fontWeight:700,marginBottom:6}}>Matched: {matched.pattern}</div>
              <div style={{color:"#94a3b8",fontSize:12,marginBottom:8}}>Auto-assigned reviewers:</div>
              <div>{matched.owners.split(" ").map(o=>(
                <span key={o} style={{display:"inline-block",background:"rgba(96,165,250,.12)",border:"1px solid rgba(96,165,250,.25)",borderRadius:12,fontSize:11,color:T.blue,padding:"3px 10px",margin:"2px"}}>{o}</span>
              ))}</div>
            </div>
          ) : (
            <div style={{color:T.muted,fontSize:12,textAlign:"center",padding:16}}>No match — no auto-reviewer</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GITHUB API EXPLORER
═══════════════════════════════════════════════════════ */
const API_EX=[
  {label:"Get a repo",      method:"GET",  path:"/repos/torvalds/linux",      resp:{id:2325298,name:"linux",stargazers_count:180000,language:"C",default_branch:"master"}},
  {label:"List issues",     method:"GET",  path:"/repos/facebook/react/issues",resp:[{number:28942,title:"useEffect cleanup issue",state:"open"},{number:28940,title:"React 19 migration guide",state:"open"}]},
  {label:"List branches",   method:"GET",  path:"/repos/vercel/next.js/branches",resp:[{name:"main",protected:true},{name:"canary",protected:true}]},
  {label:"Create an issue", method:"POST", path:"/repos/owner/repo/issues",   resp:{number:43,title:"New feature request",state:"open"}},
  {label:"Get user info",   method:"GET",  path:"/users/torvalds",             resp:{login:"torvalds",name:"Linus Torvalds",public_repos:8,followers:226000}},
];

function APIExplorer() {
  const [sel,setSel]=useState(0);
  const ex=API_EX[sel];
  const isGet=ex.method==="GET";
  const methodStyle={background:isGet?"rgba(74,222,128,.15)":"rgba(96,165,250,.15)",border:"1px solid "+(isGet?"rgba(74,222,128,.3)":"rgba(96,165,250,.3)"),borderRadius:4,fontSize:10,fontWeight:700,color:isGet?T.green:T.blue,padding:"2px 7px",fontFamily:"monospace"};

  return (
    <div>
      <InfoBox icon="🔌" title="The GitHub REST API — control GitHub with code" color={T.teal}>
        Every GitHub action in the browser can be done via HTTP requests. Base URL: api.github.com.
        Authenticate with a Personal Access Token. Powers bots, dashboards, and integrations.
      </InfoBox>
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:12}}>
        <div>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:8}}>EXAMPLES</div>
          {API_EX.map((e,i)=>{
            const eg=e.method==="GET";
            return (
              <button key={i} onClick={()=>setSel(i)}
                style={{display:"block",width:"100%",background:i===sel?"rgba(45,212,191,.08)":T.card,border:"1px solid "+(i===sel?"rgba(45,212,191,.3)":T.border),borderRadius:7,padding:"9px 12px",textAlign:"left",cursor:"pointer",marginBottom:6}}>
                <span style={{background:eg?"rgba(74,222,128,.15)":"rgba(96,165,250,.15)",border:"1px solid "+(eg?"rgba(74,222,128,.3)":"rgba(96,165,250,.3)"),borderRadius:4,fontSize:9,color:eg?T.green:T.blue,padding:"1px 6px",fontFamily:"monospace",marginRight:7}}>{e.method}</span>
                <span style={{color:i===sel?T.text:"#94a3b8",fontSize:11}}>{e.label}</span>
              </button>
            );
          })}
        </div>
        <div>
          <div style={{background:"#050b13",border:"1px solid #1a2540",borderRadius:10,overflow:"hidden",marginBottom:10}}>
            <div style={{background:T.surface,padding:"8px 14px",borderBottom:"1px solid #1a2540",display:"flex",alignItems:"center",gap:10}}>
              <span style={methodStyle}>{ex.method}</span>
              <code style={{color:"#94a3b8",fontSize:11}}>https://api.github.com{ex.path}</code>
            </div>
            <div style={{padding:14}}>
              <div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8}}>RESPONSE JSON</div>
              <pre style={{margin:0,color:"#94a3b8",fontSize:11,fontFamily:"'JetBrains Mono',monospace",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{JSON.stringify(ex.resp,null,2)}</pre>
            </div>
          </div>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
            <div style={{color:T.muted,fontSize:10,fontWeight:700,marginBottom:8}}>CALL IN JAVASCRIPT</div>
            <pre style={{margin:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{`const res = await fetch(
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

/* ═══════════════════════════════════════════════════════
   .GITHUB FOLDER EXPLORER
═══════════════════════════════════════════════════════ */
const DG_FILES={
  "CODEOWNERS":           {desc:"Auto-assign PR reviewers by file path",c:T.amber, txt:"*                   @lead-dev\nsrc/payments/       @payment-team\n*.md                @docs-team\n.github/            @devops"},
  "PR_TEMPLATE.md":       {desc:"Default template when opening a PR",   c:T.blue,  txt:"## What does this PR do?\n\n## How to test\n1. Step one\n2. Step two\n\n## Checklist\n- [ ] Tests added\n- [ ] No secrets committed"},
  "ISSUE_TEMPLATE/bug.md":{desc:"Template for bug reports",             c:T.red,   txt:"name: Bug Report\nlabels: bug\n\n## Describe the bug\n\n## Steps to reproduce\n1.\n2.\n\n## Expected behaviour"},
  "workflows/ci.yml":     {desc:"CI pipeline — runs on every push",     c:T.green, txt:"name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test"},
  "dependabot.yml":       {desc:"Auto-open PRs for dep updates",        c:T.purple,txt:"version: 2\nupdates:\n  - package-ecosystem: npm\n    directory: /\n    schedule:\n      interval: weekly"},
  "SECURITY.md":          {desc:"How to report vulnerabilities",        c:T.red,   txt:"# Security Policy\n\n## Reporting a Vulnerability\nPlease email security@yourproject.com\nDo NOT open a public issue for security bugs."},
  "CONTRIBUTING.md":      {desc:"How to contribute to the project",     c:T.teal,  txt:"# Contributing\n\n1. Fork the repo\n2. Create branch: git switch -c feature/my-thing\n3. Commit: git commit -m 'feat: add thing'\n4. Push and open a Pull Request"},
};

function DotGithubExplorer() {
  const [sel,setSel]=useState("CODEOWNERS");
  const file=DG_FILES[sel];
  return (
    <div>
      <InfoBox icon="📂" title="The .github folder — your repo control panel" color={T.blue}>
        The .github/ folder is a special directory that GitHub reads to configure your repository behaviour.
        This is not app code — it is instructions for GitHub itself.
        PR templates, Actions, issue forms, and security policies all live here.
      </InfoBox>
      <div style={{background:"#050b13",border:"1px solid #1a2540",borderRadius:10,overflow:"hidden",marginBottom:14}}>
        <div style={{background:T.surface,padding:"8px 14px",borderBottom:"1px solid #1a2540"}}>
          <code style={{color:T.muted,fontSize:11}}>📂 .github/</code>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",minHeight:280}}>
          <div style={{borderRight:"1px solid #1a2540",padding:10,overflowY:"auto"}}>
            {Object.entries(DG_FILES).map(([name,f])=>(
              <div key={name} onClick={()=>setSel(name)}
                style={{background:sel===name?f.c+"12":"rgba(13,21,38,.4)",border:"1px solid "+(sel===name?f.c+"40":"transparent"),borderRadius:6,padding:"8px 10px",cursor:"pointer",marginBottom:5}}>
                <div style={{color:sel===name?f.c:"#64748b",fontSize:10,fontFamily:"monospace",marginBottom:3}}>{name}</div>
                <div style={{color:T.muted,fontSize:9}}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div style={{padding:14,overflowY:"auto"}}>
            <pre style={{margin:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{file.txt}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DEPENDABOT SIMULATOR
═══════════════════════════════════════════════════════ */
function DependabotSim() {
  const [deps,setDeps]=useState([
    {name:"react",       cur:"18.2.0",lat:"19.1.0",type:"major",sev:"none",pr:false},
    {name:"axios",       cur:"1.6.0", lat:"1.7.2", type:"minor",sev:"none",pr:false},
    {name:"lodash",      cur:"4.17.15",lat:"4.17.21",type:"patch",sev:"high",pr:false},
    {name:"express",     cur:"4.18.0",lat:"4.19.2",type:"minor",sev:"medium",pr:false},
    {name:"@babel/core", cur:"7.22.0",lat:"7.24.5",type:"minor",sev:"none",pr:false},
  ]);
  const openPR=name=>setDeps(d=>d.map(dep=>dep.name===name?{...dep,pr:true}:dep));
  const openAll=()=>setDeps(d=>d.map(dep=>({...dep,pr:true})));
  const sc=s=>({high:T.red,medium:T.amber,none:T.muted})[s]||T.muted;
  const tc=t=>({major:T.red,minor:T.blue,patch:T.green})[t]||T.muted;

  return (
    <div>
      <InfoBox icon="🤖" title="Dependabot — automated security guardian" color={T.purple}>
        Dependabot scans your package.json for outdated or vulnerable dependencies and automatically
        opens a PR to update them — complete with changelog. Just review and merge.
        Configure in .github/dependabot.yml.
      </InfoBox>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,overflow:"hidden",marginBottom:14}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid "+T.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:T.muted,fontSize:11,fontWeight:700}}>DEPENDENCY SCAN</span>
          <button onClick={openAll} style={{background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.25)",borderRadius:5,color:T.purple,fontSize:10,padding:"3px 10px",cursor:"pointer"}}>Open All PRs</button>
        </div>
        {deps.map(d=>(
          <div key={d.name} style={{padding:"11px 14px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <code style={{color:T.text,fontSize:12,fontFamily:"monospace",width:120,flexShrink:0}}>{d.name}</code>
            <div style={{display:"flex",gap:6,alignItems:"center",flex:1}}>
              <span style={{color:T.muted,fontSize:11,fontFamily:"monospace"}}>{d.cur}</span>
              <span style={{color:T.muted}}>→</span>
              <span style={{color:tc(d.type),fontSize:11,fontFamily:"monospace",fontWeight:600}}>{d.lat}</span>
              <span style={{background:tc(d.type)+"15",border:"1px solid "+tc(d.type)+"35",borderRadius:8,fontSize:9,color:tc(d.type),padding:"1px 6px"}}>{d.type}</span>
              {d.sev!=="none"&&<span style={{background:sc(d.sev)+"15",border:"1px solid "+sc(d.sev)+"35",borderRadius:8,fontSize:9,color:sc(d.sev),padding:"1px 6px"}}>vuln: {d.sev}</span>}
            </div>
            {d.pr?(
              <span style={{color:T.green,fontSize:11}}>PR opened</span>
            ):(
              <button onClick={()=>openPR(d.name)} style={{background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:5,color:T.green,fontSize:10,padding:"3px 10px",cursor:"pointer"}}>Open PR</button>
            )}
          </div>
        ))}
      </div>
      {deps.some(d=>d.pr)&&(
        <div style={{background:"rgba(74,222,128,.04)",border:"1px solid rgba(74,222,128,.15)",borderRadius:10,padding:14}}>
          <div style={{color:T.green,fontSize:11,fontWeight:700,marginBottom:8}}>OPENED PRs</div>
          {deps.filter(d=>d.pr).map(d=>(
            <div key={d.name} style={{color:"#94a3b8",fontSize:11,padding:"5px 0",borderBottom:"1px solid "+T.border,fontFamily:"monospace"}}>
              chore(deps): bump {d.name} from {d.cur} to {d.lat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CODESPACES SIMULATOR
═══════════════════════════════════════════════════════ */
function CodespacesSim() {
  const [phase,setPhase]=useState("idle");
  const [log,setLog]=useState([]);

  const boot=()=>{
    setPhase("booting");
    setLog([]);
    const steps=[
      [300, "info","Step 1 ─ GitHub reserves a computer (virtual machine) in the cloud..."],
      [900, "ok",  "Step 2 ─ VM is ready (4-core CPU, 8 GB RAM, Linux)"],
      [1400,"ok",  "Step 3 ─ Your repository is cloned onto that machine"],
      [2000,"ok",  "Step 4 ─ devcontainer.json is read — setting up the environment"],
      [2600,"ok",  "Step 5 ─ npm install: all packages installed automatically"],
      [3100,"ok",  "Step 6 ─ Ports 3000 & 5173 forwarded so browser can reach your app"],
      [3500,"ok",  "Step 7 ─ VS Code Server launched on the cloud machine"],
      [3700,"done","Step 8 ─ Your browser connects — VS Code is now running in the cloud!"],
    ];
    steps.forEach(([delay,type,msg])=>setTimeout(()=>{
      setLog(l=>[...l,{type,msg}]);
      if(type==="done")setPhase("ready");
    },delay));
  };

  const lc={info:"#60a5fa",ok:"#34d399",done:"#4ade80"};

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        {/* What happens without Codespaces */}
        <div style={{background:"rgba(248,113,113,.05)",border:"1px solid rgba(248,113,113,.2)",borderRadius:10,padding:14}}>
          <div style={{color:T.red,fontSize:11,fontWeight:700,marginBottom:10}}>😩 WITHOUT CODESPACES</div>
          {["Install Node.js","Install Git","Install VS Code","Clone the repo","Run npm install","Debug why it works on their PC but not yours","30–90 minutes before you can write a single line of code"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:6}}>
              <span style={{color:T.red,fontSize:11,flexShrink:0,marginTop:1}}>✗</span>
              <span style={{color:"#94a3b8",fontSize:12}}>{s}</span>
            </div>
          ))}
        </div>
        {/* What happens with Codespaces */}
        <div style={{background:"rgba(74,222,128,.05)",border:"1px solid rgba(74,222,128,.2)",borderRadius:10,padding:14}}>
          <div style={{color:T.green,fontSize:11,fontWeight:700,marginBottom:10}}>🚀 WITH CODESPACES</div>
          {["Open the repo on GitHub","Click Code → Codespaces → New codespace","Wait ~30 seconds","VS Code opens in your browser, fully ready","Start coding immediately — from any device"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:6}}>
              <span style={{color:T.green,fontSize:11,flexShrink:0,marginTop:1}}>✓</span>
              <span style={{color:"#94a3b8",fontSize:12}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {/* devcontainer explanation */}
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:6}}>📄 .devcontainer/devcontainer.json</div>
          <div style={{color:"#94a3b8",fontSize:12,lineHeight:1.7,marginBottom:10}}>
            This file tells Codespaces exactly how to set up your environment.
            Think of it as a <span style={{color:T.amber,fontWeight:600}}>recipe card</span> — it lists the operating system, tools to install, and commands to run when the space starts.
          </div>
          <pre style={{margin:0,background:"#050b13",border:"1px solid #1a2540",borderRadius:8,padding:12,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#94a3b8",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{`{
  // Which OS + runtime to use
  "image": "node:20",

  // Open these ports so you can view your app
  "forwardPorts": [3000],

  // Run this command once the space starts
  "postCreateCommand": "npm install",

  // Install VS Code extensions automatically
  "customizations": {
    "vscode": {
      "extensions": ["esbenp.prettier-vscode"]
    }
  }
}`}</pre>
        </div>

        {/* Boot simulation */}
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:10,padding:14}}>
          <div style={{color:T.muted,fontSize:11,fontWeight:700,marginBottom:6}}>⚡ WHAT HAPPENS WHEN YOU CLICK "NEW CODESPACE"</div>
          <div style={{color:"#64748b",fontSize:11,marginBottom:10}}>Watch the steps GitHub takes behind the scenes:</div>
          <div style={{background:"#050b13",border:"1px solid #1a2540",borderRadius:8,padding:12,height:190,overflowY:"auto",marginBottom:12,scrollbarWidth:"thin"}}>
            {log.length===0&&phase==="idle"&&(
              <div style={{color:T.muted,fontSize:11,textAlign:"center",paddingTop:60}}>
                Press the button below to simulate the boot
              </div>
            )}
            {log.map((l,i)=>(
              <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:lc[l.type]||"#64748b",lineHeight:1.8}}>
                {l.type==="ok"||l.type==="done" ? "✓ " : "→ "}{l.msg}
              </div>
            ))}
          </div>
          {phase!=="ready" ? (
            <button onClick={boot} disabled={phase==="booting"}
              style={{width:"100%",background:"rgba(45,212,191,.1)",border:"1px solid rgba(45,212,191,.25)",borderRadius:7,color:T.teal,fontSize:12,padding:10,cursor:phase==="idle"?"pointer":"default",fontWeight:600}}>
              {phase==="booting"?"Setting up your Codespace…":"▶  Simulate: New Codespace"}
            </button>
          ) : (
            <div>
              <div style={{background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:8,padding:"10px 14px",marginBottom:10}}>
                <div style={{color:T.green,fontSize:12,fontWeight:700,marginBottom:4}}>🎉 Codespace is live!</div>
                <div style={{color:"#94a3b8",fontSize:11,marginBottom:6}}>Your VS Code editor is now running in the cloud. You would open it at:</div>
                <code style={{color:T.blue,fontSize:10,fontFamily:"monospace",wordBreak:"break-all"}}>https://your-username-repo-name-abc123.github.dev</code>
              </div>
              <button onClick={()=>{setPhase("idle");setLog([]);}} style={{width:"100%",background:"rgba(30,41,59,.5)",border:"1px solid #1a2540",borderRadius:7,color:T.muted,fontSize:12,padding:9,cursor:"pointer"}}>
                ↺ Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MODULE CONTENT RENDERER
═══════════════════════════════════════════════════════ */
function ModuleContent({ id }) {

  if(id==="home") return (
    <div>
      <div style={{background:"linear-gradient(135deg,rgba(74,222,128,.06),rgba(96,165,250,.04))",border:"1px solid rgba(74,222,128,.15)",borderRadius:14,padding:22,marginBottom:24}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:T.text,marginBottom:8}}>⚡ Welcome to GitSimulator</div>
        <div style={{color:"#94a3b8",fontSize:14,lineHeight:1.8,marginBottom:16}}>
          You are a <strong style={{color:T.green}}>Time-Traveler Developer</strong>. Git is your time machine.<br/>
          Every <strong style={{color:T.amber}}>commit</strong> is a checkpoint you can return to.<br/>
          Every <strong style={{color:T.blue}}>branch</strong> is a parallel universe you can experiment in.<br/>
          Every <strong style={{color:T.purple}}>merge</strong> brings parallel timelines together.
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {["📸 Commit = Snapshot","🌿 Branch = Parallel Universe","☁️ Remote = Cloud Backup","🤝 PR = Code Review"].map(t=><Badge key={t} color={T.blue}>{t}</Badge>)}
        </div>
      </div>
      <SectionTitle>⚡ Interactive Terminal — Try Commands Now</SectionTitle>
      <Terminal/>
      <SectionTitle>🗺️ Learning Path</SectionTitle>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10}}>
        {MODULES.filter(m=>m.id!=="home").map(m=>(
          <div key={m.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"13px 14px",display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:18}}>{m.icon}</span>
            <span style={{color:"#94a3b8",fontSize:12,fontWeight:500}}>{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if(id==="init") return (
    <div>
      <InfoBox icon="📖" title="The Story" color={T.purple}>
        In 2005, Linus Torvalds — creator of Linux — spent <strong style={{color:T.amber}}>just 10 days</strong> writing Git from scratch to replace the BitKeeper version control system. He needed something fast, distributed, and free. Today Git powers virtually all software development on Earth.
      </InfoBox>
      <InfoBox icon="🌱" title="What git init actually does" color={T.green}>
        When you run <code style={{color:T.green}}>git init</code>, Git creates a hidden <code style={{color:T.green}}>.git/</code> folder. This folder IS your entire repository — every commit, every branch, every piece of history lives here. If you delete <code style={{color:T.green}}>.git/</code>, you lose all history but your files remain.
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
        {cmd:"git init my-project",        desc:"Create new repo in a new folder",      detail:"Creates 'my-project/' folder AND initialises .git/ inside it",example:"Like planting a seed in fresh soil 🌱",},
        {cmd:"git init",                   desc:"Init repo in current directory",        detail:"Turns ANY existing folder into a git repo. Your files stay untouched.",example:"Like installing a time machine into your house 🏠",},
        {cmd:"git clone https://github.com/user/repo.git", desc:"Copy a remote repo (with full history)", detail:"Downloads the repo AND every commit ever made. You get the full time machine.",example:"Like copying a book with every draft the author ever wrote 📓",},
        {cmd:"git clone --depth 1 https://github.com/user/repo.git", desc:"Shallow clone — latest snapshot only", detail:"Only downloads the most recent state, not full history. Much faster for large repos.",example:"Like reading today's newspaper, not the 30-year archive 📰",},
        {cmd:"git config --global user.name \"Your Name\"", desc:"Set your identity (do this first!)", detail:"Every commit is signed with your name and email. This is how blame/log shows who made changes.",example:"Signing your name on everything you photograph 🖊️",},
        {cmd:"git config --global user.email \"you@email.com\"", desc:"Set your email", detail:"Must match your GitHub account email for commits to link to your profile.",example:"",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
      <SectionTitle>⚡ Try It — Live Terminal</SectionTitle>
      <Terminal compact/>
    </div>
  );

  if(id==="staging") return (
    <div>
      <InfoBox icon="📦" title="What is the staging area?" color={T.green}>
        Most beginners think git works like this: <strong style={{color:T.amber}}>edit file → save → commit</strong>. But Git adds a middle step called the <strong style={{color:T.green}}>staging area</strong> (also called the index). It's a preparation zone where you choose exactly which changes go into your next commit.
        <br/><br/>
        Why does this matter? Imagine you fixed a bug AND added a new feature in the same session. Without staging, you'd have to commit everything together — messy. With staging, you commit the bug fix first, then the feature separately. Clean, professional history.
      </InfoBox>
      <InfoBox icon="🎬" title="The camera analogy" color={T.teal}>
        Think of your project as a photo studio. <strong style={{color:T.teal}}>Modified files</strong> are your subjects walking around the studio. <strong style={{color:T.green}}>Staging (git add)</strong> is posing the right subjects for the shot. <strong style={{color:T.amber}}>Committing (git commit)</strong> is pressing the shutter — the photo is saved forever, exactly as staged.
      </InfoBox>
      <SectionTitle>🎬 Interactive Simulator</SectionTitle>
      <StagingSimulator/>
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        {cmd:"git status",                  desc:"See all changes in your working directory", detail:"Shows 3 categories: Untracked (new files), Modified (changed files), Staged (ready to commit). Your project health checkup.",example:"Looking in a mirror before leaving the house 🪞",},
        {cmd:"git add filename.js",         desc:"Stage ONE specific file",                  detail:"Only that file's changes go into the next commit. Useful for atomic commits.",example:"Selecting one specific photo for the album 📷",},
        {cmd:"git add .",                   desc:"Stage ALL changes in current directory",    detail:"Every modified and new file goes to staging. Quick, but be careful you don't accidentally add secrets!",example:"'Select all' for the photo album 🗂️",},
        {cmd:"git add -p",                  desc:"Stage specific CHUNKS of a file",          detail:"Git shows each changed chunk and asks y/n. Lets you make surgical commits: 'only stage the bugfix, not the debug logs'.",example:"Picking the exact best frame from a photo burst ✂️",},
        {cmd:"git commit -m \"feat: add login\"", desc:"Save the snapshot permanently",      detail:"Creates an immutable commit object with: your changes, message, timestamp, author, and a pointer to the parent commit.",example:"Taking the photograph and writing the caption on the back 📸",},
        {cmd:"git commit --amend",          desc:"Edit the last commit",                     detail:"Replace the last commit's message or add forgotten changes. Creates a NEW commit hash — don't use on pushed commits!",example:"Correcting the caption on the photo you just took ✏️",warning:"Never amend commits you've already pushed to a shared branch!",},
        {cmd:"git log --oneline --graph --all", desc:"Visual commit history tree",           detail:"--oneline=compact, --graph=ASCII branch lines, --all=show all branches. Your best friend for understanding history.",example:"The family album with a family tree showing who came from whom 📖",},
        {cmd:"git diff",                    desc:"Show unstaged changes line-by-line",        detail:"Red lines = removed, Green lines = added. Shows what's different between your working directory and the last commit.",example:"Comparing two versions of a letter side by side 📄",},
        {cmd:"git diff --staged",           desc:"Show what IS staged (ready to commit)",    detail:"Same as diff but shows the staging area vs last commit. See exactly what your next commit will contain.",example:"",},
        {cmd:"git restore filename.js",     desc:"Discard unstaged changes to a file",       detail:"⚠️ Dangerous — this THROWS AWAY your changes! Use to revert a file to its last committed state.",example:"Throwing away your photo and taking a fresh one 🗑️",warning:"This permanently discards your local changes. Cannot be undone!",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="branch") return (
    <div>
      <InfoBox icon="🌿" title="Why do branches exist?" color={T.green}>
        Imagine you're writing a book and a publisher asks for two different endings. Without branches, you'd have to make a full copy of the entire manuscript for each ending. That's exactly what older version control systems did — slow and storage-heavy.
        <br/><br/>
        Git branches are instant and weightless — just a pointer to a commit. You can spin up a branch, try something risky, and throw it away if it doesn't work. Professional teams typically have dozens of branches running in parallel: features, bug fixes, experiments, hotfixes. <strong style={{color:T.green}}>The rule: never work directly on main.</strong>
      </InfoBox>
      <SectionTitle>🌿 Interactive Branch Simulator</SectionTitle>
      <BranchSimulator/>
      <SectionTitle>How Branches Really Work</SectionTitle>
      <InfoBox icon="💡" title="Branches are just pointers — they cost nothing" color={T.green}>
        A branch is literally a <strong style={{color:T.green}}>41-byte text file</strong> containing a commit hash. That's it. When you create a branch, Git writes one tiny file. When you commit on a branch, Git moves that pointer forward. This is why branching in Git is instant and essentially free — unlike older version control systems.
      </InfoBox>
      <ConceptDiagram>{`  Before branching:               After git branch feature:

  main → [A]─[B]─[C]             main    → [A]─[B]─[C]
                  ↑                                    ↑
                 HEAD                        feature → [C]
                                                       ↑
                                                      HEAD

  After committing on feature:    After merging feature → main:

  main    → [A]─[B]─[C]─────────────[M]
                    ╲                ↗
           feature → [D]─[E]─[F]──┘
                              ↑
                             HEAD`}</ConceptDiagram>
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        {cmd:"git branch",                  desc:"List all local branches (* = current)",    detail:"Shows every local branch. The asterisk marks HEAD — where you currently are.",example:"Seeing all your parallel universes listed 🌌",},
        {cmd:"git branch -a",               desc:"List ALL branches (local + remote)",       detail:"Also shows origin/main, origin/feature-xyz etc. Use after git fetch to see new remote branches.",example:"All universes, including the cloud ones ☁️",},
        {cmd:"git switch -c feature/login", desc:"Create AND switch to new branch (modern)", detail:"Combines branch creation + checkout. -c = create. This is the modern preferred way (Git 2.23+).",example:"Splitting reality and stepping into the new universe 🚪",},
        {cmd:"git checkout -b feature/login",desc:"Create AND switch (classic way)",         detail:"Older syntax, still works everywhere. Most tutorials use this. Identical result to 'switch -c'.",example:"The classic way to split timelines 🎯",},
        {cmd:"git switch main",             desc:"Switch to an existing branch",             detail:"Moves HEAD to that branch, updates working directory to match. Uncommitted changes may carry over or cause conflict.",example:"Stepping back into the main timeline 🚶",},
        {cmd:"git branch -d feature/done",  desc:"Delete a merged branch (safe)",            detail:"Only deletes if branch is fully merged into current branch. Git refuses if work would be lost — safe by default.",example:"Closing a completed parallel timeline 🗑️",},
        {cmd:"git branch -D feature/oops",  desc:"Force delete (even if unmerged)",          detail:"Deletes regardless of merge status. Use with care — work on this branch will be lost (but reflog can recover it).",example:"Erasing a timeline that shouldn't exist",warning:"Unmerged commits on this branch will be lost! Recover with git reflog if needed.",},
        {cmd:"git branch -m old new",       desc:"Rename a branch",                          detail:"Rename locally. If you've pushed this branch, also run: git push origin --delete old && git push -u origin new",example:"Renaming your parallel universe 📝",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="merge") return (
    <div>
      <InfoBox icon="🔀" title="Merge vs Rebase — what's the difference?" color={T.blue}>
        Both bring changes from one branch into another. <strong style={{color:T.blue}}>Merge</strong> creates a new "merge commit" that joins the two timelines — history is preserved exactly as it happened, bumps and all. <strong style={{color:T.purple}}>Rebase</strong> rewrites your commits as if you had started from the latest point of the target branch — history looks cleaner and linear.
        <br/><br/>
        <strong style={{color:T.amber}}>Rule of thumb:</strong> merge for shared branches (safe, preserves truth), rebase for your own feature branches before opening a PR (clean, readable history). Never rebase a branch others are using.
      </InfoBox>
      <InfoBox icon="⚡" title="Merge conflicts are normal — not scary" color={T.amber}>
        A conflict happens when two people edit the same line of the same file. Git doesn't know whose version to keep, so it stops and asks you to decide. It marks the conflicting sections clearly in the file with <code style={{color:T.red}}>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> and <code style={{color:T.green}}>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> markers. You read both versions, pick the right one (or combine them), then commit. Every developer deals with conflicts regularly.
      </InfoBox>
      <SectionTitle>🔀 Merge Conflict Simulator</SectionTitle>
      <MergeSimulator/>
      <SectionTitle>CLI Commands</SectionTitle>
      {[
        {cmd:"git merge feature/login",       desc:"Merge a branch into current branch",     detail:"Git finds the common ancestor, then combines the changes. If no conflicts = auto-merged. If conflicts = you resolve manually.",example:"Pulling in all the good work from a parallel universe 🔀",},
        {cmd:"git merge --no-ff feature/x",   desc:"Force a merge commit even if fast-forward possible", detail:"Fast-forward = just move the pointer. --no-ff = always create a merge commit, preserving that this was once a separate branch.",example:"Insisting on a ceremony marker even for simple merges 🎗️",},
        {cmd:"git merge --squash feature/x",  desc:"Compress all branch commits into one staged change", detail:"Takes all commits on the branch and combines them into a single staged change. You then write one clean commit message.",example:"Summarising a whole chapter into a single sentence 📚",},
        {cmd:"git rebase main",               desc:"Replay your commits on top of main",     detail:"Re-applies your commits as if you started from main's latest commit. Creates clean linear history. New commit hashes are created.",example:"Rewriting history to look like you always worked on the latest ✨",warning:"Never rebase branches others are working on — it rewrites hashes and breaks their history.",},
        {cmd:"git rebase -i HEAD~3",           desc:"Interactively edit last 3 commits",      detail:"Opens an editor listing last N commits. Options: pick (keep), squash (merge into previous), reword (edit message), drop (delete).",example:"Time editing — rearranging the chapters of your story ✂️",},
        {cmd:"git cherry-pick abc1234",        desc:"Apply one specific commit to current branch", detail:"Creates a new commit on current branch with the same changes as abc1234, but a new hash. Great for backporting fixes.",example:"Cherry-picking the one perfect scene from another film 🍒",},
        {cmd:"git merge --abort",             desc:"Cancel a merge in progress",             detail:"Returns everything to the pre-merge state. Use when you triggered a merge by accident or want to resolve conflicts differently.",example:"Pressing the emergency stop 🛑",},
        {cmd:"git stash",                     desc:"Temporarily shelve uncommitted changes",  detail:"Saves all staged + unstaged changes to a stack, then cleans your working directory. You can stash multiple times.",example:"Putting your WIP work in a drawer before switching tasks 🗄️",},
        {cmd:"git stash pop",                 desc:"Restore last stash and remove it",       detail:"Applies the most recent stash to your working directory. If there are conflicts, you resolve them normally.",example:"Pulling your in-progress work back out of the drawer 📤",},
        {cmd:"git stash list",                desc:"See all stashed entries",                detail:"Shows stash@{0}, stash@{1} etc. You can apply any of them with 'git stash apply stash@{N}'.",example:"",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="remote") return (
    <div>
      <InfoBox icon="☁" title="Local vs Remote" color={T.blue}>
        Your <strong style={{color:T.amber}}>local repo</strong> lives on your machine — fast, private, no internet needed. A <strong style={{color:T.blue}}>remote</strong> is another copy, usually on GitHub. The name <code style={{color:T.green}}>origin</code> is just a convention — it's the primary remote. You can have multiple remotes (e.g., origin + upstream for open source).
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
        {cmd:"git remote add origin https://github.com/user/repo.git", desc:"Link local repo to GitHub", detail:"'origin' is the conventional name. You can call it anything. This just stores the URL — no data transferred yet.",example:"Connecting your local lab notebook to the cloud library ☁️",},
        {cmd:"git push -u origin main",      desc:"First push to GitHub",                   detail:"-u sets 'upstream tracking' so future 'git push' and 'git pull' know which remote/branch to use without specifying.",example:"Uploading to the cloud for the first time 🚀",},
        {cmd:"git push",                     desc:"Push local commits to remote",             detail:"Sends all new local commits on the current branch to the tracked remote branch. Fast — only sends new data.",example:"Syncing your notebook to the cloud 📤",},
        {cmd:"git pull",                     desc:"Download + merge remote changes",          detail:"Shortcut for: git fetch + git merge. Gets remote commits and merges them into your current branch. May cause conflicts.",example:"Downloading latest changes from the cloud 📥",},
        {cmd:"git fetch",                    desc:"Download remote data (no merge)",          detail:"Downloads all remote branches and commits but does NOT touch your working directory. Safe — then you choose when to merge.",example:"Checking what new chapters arrived in the library without reading them yet 👀",},
        {cmd:"git pull --rebase",            desc:"Pull and rebase instead of merge",        detail:"Like git pull but instead of a merge commit, it replays your local commits on top of the remote. Cleaner history.",example:"",},
        {cmd:"git remote -v",                desc:"List all remote connections",              detail:"Shows fetch and push URLs for each remote. Useful to verify you're connected to the right repo.",example:"",},
        {cmd:"git push origin --delete feature/old", desc:"Delete a branch on GitHub",        detail:"Removes the branch from the remote. Your local branch is unaffected. Common after a PR is merged.",example:"Deleting a cloud chapter you no longer need 🗑️",},
        {cmd:"git push --force-with-lease",  desc:"Safe force push",                         detail:"Force pushes but checks first: if someone else pushed since your last fetch, it refuses. Always prefer this over --force.",example:"Overwriting cloud history, but only if nobody else added to it",warning:"Force pushing rewrites history. Never force-push main or shared branches.",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
      <SectionTitle>⚡ Terminal</SectionTitle>
      <Terminal compact/>
    </div>
  );

  if(id==="pullrequest") return (
    <div>
      <SectionTitle>🤝 PR Lifecycle Walkthrough</SectionTitle>
      <PRSimulator/>
      <SectionTitle>Writing a Great PR Description</SectionTitle>
      <ConceptDiagram>{`## What does this PR do?
Adds JWT-based user authentication to the API.

## Why?
Users need to sign in to access their saved data (Fixes #42)

## How to test
1. Run: npm install && npm run dev
2. POST /api/auth/login with {"email":"test@x.com","password":"test123"}
3. You receive a token — use it as: Authorization: Bearer <token>

## Checklist
- [x] Tests written and passing
- [x] No API keys committed
- [x] Reviewed own diff before requesting review
- [x] Documentation updated

## Screenshots (if UI change)
| Before | After |
|--------|-------|
| [img]  | [img] |`}</ConceptDiagram>
      <SectionTitle>GitHub CLI — PR Commands</SectionTitle>
      {[
        {cmd:"gh pr create --title 'feat: add auth' --body 'Adds JWT auth'", desc:"Create PR from terminal", detail:"GitHub CLI (gh) lets you create, review, and merge PRs without leaving the terminal.",example:"",},
        {cmd:"gh pr list",                   desc:"List open PRs",                           detail:"Shows all open PRs in the current repo.",example:"",},
        {cmd:"gh pr checkout 42",            desc:"Checkout a PR branch locally",            detail:"Fetches the PR branch and switches to it so you can test the changes.",example:"",},
        {cmd:"gh pr merge 42 --squash",      desc:"Merge a PR (squash method)",              detail:"Merges PR #42 using squash strategy — all commits become one.",example:"",},
        {cmd:"gh pr review --approve",       desc:"Approve a PR from CLI",                   detail:"Adds your approval to the PR, same as clicking Approve on GitHub.com",example:"",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="gitflow") return (
    <div>
      <InfoBox icon="🔄" title="Git Flow — The Professional Ritual" color={T.teal}>
        Git Flow is a <strong style={{color:T.teal}}>branching strategy</strong> — a set of rules about how branches are named and when they're created. It's not a git command, it's a workflow discipline used by professional teams. The core principle: <strong>main is always deployable</strong>. All work happens on branches.
      </InfoBox>
      <ConceptDiagram>{`  main     ──●──────────────────────────●──────────────────●── (always deployable)
              ╲                          ╱ ↑                  ╱
  hotfix       ╲          ╱────●────●──╱  │  hotfix/critical ╱
                ╲        ╱                │                  ╱
  develop  ──────●──●──●──●──●──●──●──●──●──●──●──●──●──●──
                       ╲     ╱     ╲     ╱
  feature/login  ────────●───●      ─────
  feature/dash           ╲     ╱
                          ●──●`}</ConceptDiagram>
      <SectionTitle>Complete Step-by-Step Workflow</SectionTitle>
      {[
        {cmd:"git switch main && git pull", desc:"STEP 1 — Always start from up-to-date main", detail:"Golden rule: never branch from stale code. Pull first, then create your branch.",example:"🏁 Starting the race from the latest checkpoint",},
        {cmd:"git switch -c feature/user-dashboard", desc:"STEP 2 — Create a descriptive feature branch", detail:"Name it clearly: feature/, fix/, hotfix/, release/ prefixes help the team understand at a glance.",example:"🌿 Splitting off into your own universe",},
        {cmd:"git add . && git commit -m \"feat: add dashboard layout\"", desc:"STEP 3 — Work and commit often", detail:"Small, focused commits are easier to review and revert if needed. Commit after each logical unit of work.",example:"📸 Photograph your progress as you go",},
        {cmd:"git push -u origin feature/user-dashboard", desc:"STEP 4 — Push branch to GitHub", detail:"This makes your branch visible to teammates and triggers any CI/CD configured on push events.",example:"☁️ Share your universe with the team",},
        {cmd:"# GitHub.com → Compare & Pull Request", desc:"STEP 5 — Open Pull Request on GitHub", detail:"Write a clear title and description. Add reviewers. Link any relevant issues. CI checks run automatically.",example:"🤝 'Hey team, please review my work!'",},
        {cmd:"# Address review comments with new commits", desc:"STEP 6 — Respond to code review", detail:"Never force-push during review — just add new commits. The PR updates automatically. Discuss, iterate, improve.",example:"🔧 Improving based on teammate feedback",},
        {cmd:"# Click Merge on GitHub (Squash & Merge)", desc:"STEP 7 — Merge when approved", detail:"Squash & Merge = all your commits become one clean commit on main. Keeps main history readable.",example:"🔀 Your work is now part of main!",},
        {cmd:"git switch main && git pull", desc:"STEP 8 — Sync your local main", detail:"Pull the merged changes so your local main matches GitHub.",example:"⬇️ Download the newly merged timeline",},
        {cmd:"git branch -d feature/user-dashboard", desc:"STEP 9 — Clean up local branch", detail:"Delete the feature branch — it served its purpose. Keep your local repo tidy.",example:"🧹 Closing the completed parallel universe",},
      ].map((c,i)=>(
        <div key={i} style={{position:"relative",paddingLeft:26}}>
          {i<8&&<div style={{position:"absolute",left:5,top:38,width:2,height:"calc(100% + 2px)",background:"linear-gradient(to bottom, #4ade80, rgba(74,222,128,.1))"}}/>}
          <div style={{position:"absolute",left:0,top:16,width:12,height:12,borderRadius:"50%",background:T.green,border:`2px solid ${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:T.bg,fontWeight:700}}>
            {i+1}
          </div>
          <CommandCard index={i} {...c}/>
        </div>
      ))}
    </div>
  );

  if(id==="advanced") return (
    <div>
      <InfoBox icon="⚗" title="The Wizard's Spellbook" color={T.purple}>
        These commands separate Git beginners from Git masters. They're rarely needed — but when you need them, they're <strong style={{color:T.purple}}>life-saving</strong>. The most important one to memorise: <code style={{color:T.green}}>git reflog</code>. It's your ultimate safety net.
      </InfoBox>
      <SectionTitle>⚡ Safety Net — Never Lose Work</SectionTitle>
      {[
        {cmd:"git reflog",                   desc:"The ultimate undo history — see EVERY move", detail:"Shows every position HEAD has ever been in — including deleted commits, abandoned rebases, everything. Your black box recorder.",example:"🛫 The flight recorder that survives any crash",},
        {cmd:"git reset --soft HEAD~1",      desc:"Undo last commit, keep changes STAGED",     detail:"Moves HEAD back 1 commit. Changes from that commit are still in the staging area, ready to re-commit differently.",example:"📸 Un-take the photo, but keep the image in memory",},
        {cmd:"git reset --mixed HEAD~1",     desc:"Undo last commit, keep changes UNSTAGED",   detail:"Like --soft but unstages the changes too. They're still in your working directory — just need to be re-added.",example:"",},
        {cmd:"git reset --hard HEAD~1",      desc:"DESTROY last commit and its changes",       detail:"Completely removes the commit AND its changes from the working directory. Cannot be undone (except via reflog within ~90 days).",example:"",warning:"This permanently destroys your changes. Use reflog within 90 days to recover if needed.",},
        {cmd:"git revert abc1234",           desc:"Undo a commit by creating a new commit",   detail:"Creates a NEW commit that undoes the changes of abc1234. Safe for shared branches — doesn't rewrite history.",example:"The safe way to undo on main — leaves evidence in history 📜",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
      <SectionTitle>🔍 Finding Things</SectionTitle>
      {[
        {cmd:"git blame src/auth.js",        desc:"See who wrote every single line",           detail:"Shows commit hash, author, and date for each line. Perfect for understanding why code exists.",example:"🕵️ The detective board of your codebase",},
        {cmd:"git bisect start",             desc:"Binary-search for the commit that broke something", detail:"Git checks out commits between 'good' and 'bad', halving the search space each time. Finds bugs in O(log n) steps.",example:"🔬 Let Git do the detective work for you",},
        {cmd:"git log --grep=\"feat\" --author=\"Alice\"", desc:"Search commit history", detail:"Filter commits by message content, author, date, files changed. Combine flags for precise archaeology.",example:"",},
        {cmd:"git log -S \"password\" --all", desc:"Find when a specific string was added/removed", detail:"The 'pickaxe' search — finds commits that changed the number of occurrences of a string. Great for security audits.",example:"🔐 Find every time 'password' appeared in history",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
      <SectionTitle>🏷️ Tags & Releases</SectionTitle>
      {[
        {cmd:"git tag v1.0.0",               desc:"Create a lightweight tag at HEAD",          detail:"A tag is like a branch that never moves — a permanent label on a specific commit.",example:"🏷️ Stamp a milestone on your timeline",},
        {cmd:"git tag -a v1.0.0 -m \"First stable release\"", desc:"Annotated tag with message", detail:"Stores tagger name, email, date, and message. This is what GitHub uses for Releases.",example:"🎉 Official milestone with full ceremony",},
        {cmd:"git push origin --tags",       desc:"Push all tags to GitHub",                  detail:"Tags aren't pushed automatically with 'git push'. Run this after creating tags.",example:"",},
        {cmd:"git tag -d v1.0.0",            desc:"Delete a local tag",                        detail:"Tags can be deleted locally and on remote (git push origin --delete v1.0.0) if you made a mistake.",example:"",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
      <SectionTitle>🧙 Power User Tricks</SectionTitle>
      {[
        {cmd:"git worktree add ../hotfix hotfix/critical", desc:"Check out two branches at once in different folders", detail:"Creates a new working directory for the branch. Useful when you need to fix a bug without disturbing your current work.",example:"🌌🌌 Working in two parallel universes simultaneously",},
        {cmd:"git archive --format=zip HEAD > release.zip", desc:"Export current state as zip (no .git)", detail:"Creates a clean zip/tar of your project without the .git folder. Good for releases.",example:"",},
        {cmd:"git shortlog -s -n",           desc:"Contribution leaderboard",                  detail:"Shows how many commits each author has made, sorted by count. Fun for team stats.",example:"🏆 The contribution scoreboard",},
        {cmd:"git config --global alias.lg \"log --oneline --graph --all\"", desc:"Create a git alias", detail:"Now you can type 'git lg' instead of the long command. Set up your own shortcuts!",example:"⌨️ Your personal git shortcuts",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="collaborate") return (
    <div>
      <InfoBox icon="🌐" title="The Open Source Cycle" color={T.teal}>
        Open source runs on a beautiful feedback loop: someone creates → you fork → you improve → you PR → they merge → you helped improve a tool millions use. Projects like React, Linux, Python, and VS Code were built this way. <strong style={{color:T.teal}}>You can contribute too.</strong>
      </InfoBox>
      <ConceptDiagram>{`  ORIGINAL (torvalds/linux)          YOUR FORK (you/linux)
  ┌──────────────────────┐          ┌──────────────────────┐
  │  main branch         │◄── PR ───│  main branch         │
  │  (protected)         │          │  feature/my-fix      │◄─── you work here
  └──────────────────────┘          └──────────────────────┘
            ↑                                  ↑
            └─── upstream remote               └─── origin remote
          (git remote add upstream ...)         (default clone)`}</ConceptDiagram>
      <SectionTitle>Complete Fork Workflow</SectionTitle>
      {[
        {cmd:"# Click 'Fork' on GitHub.com",  desc:"STEP 1 — Create your own copy on GitHub",  detail:"Fork creates a full copy of the repo under YOUR account. You have full write access to your fork.",example:"📋 Photocopying a book so you can write in the margins",},
        {cmd:"git clone https://github.com/YOU/forked-repo.git", desc:"STEP 2 — Clone YOUR fork locally", detail:"Clone your fork, not the original. You'll push to your fork and open PRs from there.",example:"🏠 Taking your photocopy home to work on",},
        {cmd:"git remote add upstream https://github.com/ORIGINAL/repo.git", desc:"STEP 3 — Track the original repo", detail:"Add 'upstream' remote pointing to the original. This lets you sync with the original project's updates.",example:"🔗 Staying connected to the source library",},
        {cmd:"git fetch upstream && git merge upstream/main", desc:"STEP 4 — Sync with original (do regularly!)", detail:"Before starting new work, always sync. The original project may have moved forward significantly.",example:"📥 Importing the latest updates from the source",},
        {cmd:"git switch -c fix/my-contribution", desc:"STEP 5 — Create a feature branch",     detail:"Never work on main directly — always branch. This keeps your fork clean and PRs focused.",example:"🌿 Your personal workspace for this contribution",},
        {cmd:"git push origin fix/my-contribution", desc:"STEP 6 — Push to YOUR fork",         detail:"Push to your fork (origin), not upstream. Then open a PR from your fork's branch to the original's main.",example:"☁️ Publishing your annotated copy",},
        {cmd:"# On GitHub: your fork → New PR → base: original/main", desc:"STEP 7 — Open PR to original repo", detail:"Select base repository = original, base = main. Head repository = your fork. Write a clear description.",example:"🌍 Contributing to open source! You just made the world better.",},
      ].map((c,i)=>(
        <div key={i} style={{position:"relative",paddingLeft:26}}>
          {i<6&&<div style={{position:"absolute",left:5,top:38,width:2,height:"calc(100% + 2px)",background:"linear-gradient(to bottom,#2dd4bf,rgba(45,212,191,.1))"}}/>}
          <div style={{position:"absolute",left:0,top:16,width:12,height:12,borderRadius:"50%",background:T.teal,border:`2px solid ${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:T.bg,fontWeight:700}}>{i+1}</div>
          <CommandCard index={i} {...c}/>
        </div>
      ))}
    </div>
  );

  if(id==="visualizer") return (
    <div>
      <InfoBox icon="📊" title="Why visualise your commit history?" color={T.blue}>
        Your commit history is a complete record of how your project evolved — who changed what, when, and why. Visualising it as a graph lets you immediately see the shape of your workflow: which branches were created, where they merged, which features ran in parallel.
        <br/><br/>
        It also helps you pinpoint exactly when a bug was introduced, understand a colleague's work before reviewing their PR, or figure out the best place to cherry-pick a fix from one branch to another.
      </InfoBox>
      <InfoBox icon="🌳" title="Reading the graph" color={T.green}>
        Each <strong style={{color:T.green}}>dot (●)</strong> is a commit — a snapshot of your entire project at that moment. <strong style={{color:T.blue}}>Horizontal lines</strong> show commits on the same branch over time. <strong style={{color:T.amber}}>Branch lines (╲ ╱)</strong> show where branches split off and where they merged back. Labels like <code style={{color:T.purple}}>main</code> and <code style={{color:T.teal}}>feature/login</code> always point to the most recent commit on that branch.
      </InfoBox>
      <CommitGraph/>
      <SectionTitle>Reading the Graph — Key Commands</SectionTitle>
      {[
        {cmd:"git log --oneline --graph --all --decorate", desc:"Terminal commit graph (ASCII art)", detail:"--graph draws branch lines, --all shows all branches, --decorate adds branch/tag labels.",example:"Your codebase family tree in the terminal 🌳",},
        {cmd:"git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset'", desc:"Coloured pretty graph", detail:"Custom format with colours: short hash, branch labels, message, relative date.",example:"",},
        {cmd:"git show abc1234",              desc:"Show full details of one commit",          detail:"Displays commit metadata + the complete diff of that commit. Everything that changed.",example:"",},
        {cmd:"git log main..feature",         desc:"Commits in feature but NOT in main",       detail:"Shows what's unique to feature branch. Great for PR review prep.",example:"",},
        {cmd:"git diff main...feature",       desc:"Changes since feature branched from main", detail:"Three dots = diff from common ancestor to feature tip. What the feature actually added.",example:"",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="actions") return (
    <div>
      <InfoBox icon="🤖" title="GitHub Actions — Your Robot Army" color={T.amber}>
        Actions are YAML files in <code style={{color:T.green}}>.github/workflows/</code>. Every push, PR, or schedule can trigger a workflow. Robots then test, build, lint, deploy, send notifications — all automatically. This is <strong style={{color:T.amber}}>CI/CD</strong> (Continuous Integration / Continuous Deployment).
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
      <div style={{background:"#050b13",border:"1px solid #1a2540",borderRadius:10,padding:16,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{color:T.amber,fontSize:11,fontWeight:700,letterSpacing:".08em"}}>📄 .github/workflows/ci.yml</span>
          <CopyBtn text={`name: CI/CD Pipeline

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
      - run: npx vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}`}/>
        </div>
        <pre style={{margin:0,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#94a3b8",lineHeight:1.7,overflowX:"auto",whiteSpace:"pre-wrap"}}>
{`name: CI/CD Pipeline

on:                                 `}<span style={{color:T.blue}}>← triggers</span>{`
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest          `}<span style={{color:T.blue}}>← clean VM spins up</span>{`
    steps:
      - uses: actions/checkout@v4   `}<span style={{color:T.blue}}>← clone your code</span>{`
      - run: npm ci                 `}<span style={{color:T.blue}}>← install deps</span>{`
      - run: npm test               `}<span style={{color:T.blue}}>← run your tests</span>{`

  deploy:
    needs: test                     `}<span style={{color:T.blue}}>← only runs if test passes</span>{`
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npx vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}`}
        </pre>
      </div>
      <SectionTitle>Useful Action Commands</SectionTitle>
      {[
        {cmd:"gh workflow list",             desc:"List all workflow files",                 detail:"Shows all .github/workflows/*.yml files and their status.",example:"",},
        {cmd:"gh workflow run ci.yml",       desc:"Manually trigger a workflow",             detail:"Some workflows use 'on: workflow_dispatch' to allow manual triggers.",example:"",},
        {cmd:"gh run list",                  desc:"List recent workflow runs",               detail:"Shows status of latest runs for the current repo.",example:"",},
        {cmd:"gh run watch",                 desc:"Watch a running workflow in real-time",   detail:"Streams the logs as the workflow runs. Same as watching it on GitHub.com.",example:"",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="security") return (
    <div>
      <InfoBox icon="🔐" title="The #1 Rule of Git Security" color={T.red}>
        <strong style={{color:T.red}}>NEVER commit secrets.</strong> API keys, passwords, private keys — once committed to a public repo, assume they're compromised immediately (bots scan GitHub continuously). Even if you delete them later, the full history is public. Prevention: <code style={{color:T.green}}>.gitignore</code> + <code style={{color:T.green}}>pre-commit hooks</code>.
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
        {cmd:"ssh-keygen -t ed25519 -C \"you@email.com\"", desc:"Generate a secure SSH key pair",         detail:"Creates a private key (~/.ssh/id_ed25519) and public key (~/.ssh/id_ed25519.pub). Add the PUBLIC key to GitHub Settings → SSH Keys.",example:"🗝️ Making your unique digital identity key",},
        {cmd:"cat ~/.ssh/id_ed25519.pub",     desc:"View your public key (safe to share)",   detail:"Copy this entire string and paste it into GitHub → Settings → SSH and GPG keys → New SSH Key",example:"",},
        {cmd:"ssh -T git@github.com",         desc:"Test SSH connection to GitHub",           detail:"Should respond: 'Hi username! You've successfully authenticated.' If not, check your SSH config.",example:"",},
        {cmd:"gh secret set MY_SECRET_KEY",   desc:"Add a secret to GitHub repo",             detail:"Encrypted, never shown again. Reference in Actions as: ${{ secrets.MY_SECRET_KEY }}",example:"🔒 Giving your robot a keycard it can use but never reveal",},
        {cmd:"git log --all --full-history -- \"*.env\"", desc:"Search history for .env files",  detail:"Check if .env was ever accidentally committed. If found, you need to rotate those credentials immediately.",example:"",warning:"If you find secrets in git history, rotate the credentials immediately — git history is permanent.",},
        {cmd:"git filter-branch --index-filter 'git rm --cached --ignore-unmatch secrets.txt' HEAD", desc:"Remove a file from ALL history", detail:"Last resort — rewrites every single commit in the repo's history. Use the BFG Repo Cleaner tool for large repos; it's faster and safer. After running this, every collaborator must delete their local copy and re-clone.",example:"",warning:"This rewrites history. All collaborators must delete and re-clone. Coordinate with your team first.",},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );

  if(id==="quiz") return (
    <div>
      <InfoBox icon="🧠" title="Master Quiz — 10 Questions" color={T.purple}>
        Each question includes a detailed explanation after you answer. Complete all 10 to see your mastery level. These questions cover the concepts that trip up even experienced developers.
      </InfoBox>
      <Quiz/>
    </div>
  );

  if(id==="issues")     return (
    <div>
      <InfoBox icon="🐛" title="What are GitHub Issues?" color={T.red}>
        GitHub Issues is the built-in <strong style={{color:T.red}}>task tracker</strong> for every repository. Developers use it to report bugs, request new features, ask questions, and track ongoing work. Every issue gets a number (#1, #2...) and you can reference it in commits and PRs — e.g. <code style={{color:T.green}}>git commit -m "fix: resolve null pointer (closes #42)"</code>.
        <br/><br/>
        When you write "closes #42" in a PR, GitHub automatically closes that issue when the PR is merged. This links your work to the problem it solved, giving your repo a clean, searchable history of decisions.
      </InfoBox>
      <InfoBox icon="📌" title="Why use Issues instead of a chat or email?" color={T.amber}>
        Chats disappear. Emails get buried. Issues stay permanently attached to the repo, fully searchable, and linked to the exact code that fixed them. Six months later, anyone can find <em>why</em> a decision was made — not just what was changed.
      </InfoBox>
      <SectionTitle>Issues Simulator</SectionTitle>
      <IssuesSimulator/>
    </div>
  );
  if(id==="projects")   return (
    <div>
      <InfoBox icon="📋" title="What is GitHub Projects?" color={T.blue}>
        GitHub Projects is a <strong style={{color:T.blue}}>Kanban-style project management board</strong> built directly into GitHub. Think of it like Trello or Jira — but every card is a real GitHub Issue or Pull Request, so your board stays in sync with your actual code activity automatically.
        <br/><br/>
        You organise work into columns: <strong style={{color:T.amber}}>To Do → In Progress → In Review → Done</strong>. When a developer opens a PR linked to an issue, the card moves. When it merges, it moves again. No manual updates needed.
      </InfoBox>
      <InfoBox icon="🏗️" title="When should a team use it?" color={T.green}>
        Any time more than one person is working on a project. Without a board, it's hard to see at a glance: what's being worked on, what's blocked, what's waiting for review, and what's done this week. Projects makes that visible in seconds.
      </InfoBox>
      <SectionTitle>GitHub Projects — Kanban Board</SectionTitle>
      <ProjectsSimulator/>
    </div>
  );
  if(id==="pages")      return (
    <div>
      <InfoBox icon="🌍" title="What is GitHub Pages?" color={T.teal}>
        GitHub Pages is a <strong style={{color:T.teal}}>free static website hosting service</strong> built into every GitHub repository. You push HTML, CSS, and JavaScript files to a specific branch — GitHub builds and serves them at <code style={{color:T.green}}>https://username.github.io/repo-name</code>. No server setup, no hosting fees, no deployment commands.
        <br/><br/>
        It's perfect for: personal portfolios, project documentation sites, open source project landing pages, and demo deployments of frontend apps.
      </InfoBox>
      <InfoBox icon="📚" title="What can it NOT host?" color={T.amber}>
        GitHub Pages only serves <strong style={{color:T.amber}}>static files</strong> — pre-built HTML/CSS/JS. It cannot run a backend server, execute Python or Node.js, or connect to a database. For those you need platforms like Vercel, Render, or Railway. But for a portfolio or documentation site, Pages is all you need.
      </InfoBox>
      <SectionTitle>GitHub Pages</SectionTitle>
      <PagesSimulator/>
    </div>
  );
  if(id==="releases")   return (
    <div>
      <InfoBox icon="📦" title="What are GitHub Releases?" color={T.purple}>
        A GitHub Release is an official, versioned <strong style={{color:T.purple}}>checkpoint in your project</strong> that you want to share with the world. It's more than just a tag — it includes release notes (a changelog), downloadable zip files of your source code, and optionally binary files like compiled executables or installers.
        <br/><br/>
        Releases use <strong style={{color:T.amber}}>semantic versioning</strong>: <code style={{color:T.green}}>v1.2.3</code> where 1 is the major version (breaking changes), 2 is the minor version (new features), and 3 is the patch version (bug fixes). Users and dependency managers rely on these numbers to know if they can safely upgrade.
      </InfoBox>
      <InfoBox icon="🎯" title="When do you create a release?" color={T.blue}>
        Create a release when your software reaches a state worth announcing: first public version, a batch of new features, or an important security fix. For libraries and packages, every release becomes an installable version via npm, pip, or similar package managers.
      </InfoBox>
      <SectionTitle>Releases</SectionTitle>
      <ReleasesSimulator/>
    </div>
  );
  if(id==="protection") return (
    <div>
      <InfoBox icon="🔒" title="What is Branch Protection?" color={T.red}>
        Branch protection rules are <strong style={{color:T.red}}>safety guardrails for your most important branches</strong>. Without them, anyone with write access can push directly to <code style={{color:T.green}}>main</code>, force-push over history, or delete the branch entirely — accidentally or intentionally.
        <br/><br/>
        With protection rules, you can require: every change goes through a PR, at least one reviewer approves it, all automated tests pass, and no one can force-push. The branch only changes in ways your team deliberately agreed on.
      </InfoBox>
      <InfoBox icon="🏢" title="Real-world analogy" color={T.amber}>
        Think of <code style={{color:T.green}}>main</code> as the master recording in a music studio. Junior engineers can record on their own tracks all day. But overwriting the master requires sign-off from the lead producer AND a quality check. Branch protection is that sign-off process.
      </InfoBox>
      <SectionTitle>Branch Protection</SectionTitle>
      <ProtectionSim/>
    </div>
  );
  if(id==="codeowners") return (
    <div>
      <InfoBox icon="👑" title="What is CODEOWNERS?" color={T.amber}>
        The <code style={{color:T.green}}>CODEOWNERS</code> file tells GitHub: <em>"whenever someone changes this part of the codebase, automatically request a review from these specific people."</em> You define ownership by file path or folder — so the payments team automatically reviews changes to <code style={{color:T.green}}>src/payments/</code>, and the security team reviews any <code style={{color:T.green}}>*.env</code> config changes.
        <br/><br/>
        This eliminates the manual step of "remember to add the right reviewers" — GitHub does it for you the moment a PR is opened.
      </InfoBox>
      <InfoBox icon="🔍" title="Why does ownership matter?" color={T.blue}>
        In a large codebase, no one person understands every file. Code owners are the domain experts for their section. When their area changes, they need to know — not just to review quality, but because only they understand the subtle implications of a change. CODEOWNERS makes sure that knowledge is automatically involved in every review.
      </InfoBox>
      <SectionTitle>CODEOWNERS</SectionTitle>
      <CodeownersSim/>
    </div>
  );
  if(id==="githubapi")  return (
    <div>
      <InfoBox icon="🔌" title="What is the GitHub API?" color={T.teal}>
        Everything you can do on GitHub.com — create issues, comment on PRs, check CI status, star repos, manage teams — can also be done in code via the <strong style={{color:T.teal}}>GitHub REST API</strong>. It's a set of URLs you call with HTTP requests, and GitHub responds with JSON data.
        <br/><br/>
        This opens up automation possibilities: a script that closes stale issues, a bot that comments on every PR, a dashboard showing your team's PR review times, GitHub Actions steps that interact with your repo. Anything you can click on GitHub, you can automate via the API.
      </InfoBox>
      <InfoBox icon="🔑" title="Authentication" color={T.amber}>
        Public data (public repos, user profiles) can be read without a token. Everything else requires a <strong style={{color:T.amber}}>Personal Access Token (PAT)</strong> — generated in GitHub Settings → Developer settings → Tokens. Treat it like a password: never commit it to code, always use it via environment variables or GitHub Secrets.
      </InfoBox>
      <SectionTitle>GitHub API Explorer</SectionTitle>
      <APIExplorer/>
    </div>
  );
  if(id==="dotgithub")  return (
    <div>
      <InfoBox icon="📂" title="What is the .github folder?" color={T.blue}>
        The <code style={{color:T.green}}>.github/</code> folder is a special directory that GitHub recognises and acts on. It's where you store repository configuration that GitHub — not your app code — reads and uses. Think of it as instructions you leave for GitHub itself.
        <br/><br/>
        It can contain: <strong style={{color:T.amber}}>GitHub Actions workflows</strong> (.github/workflows/), <strong style={{color:T.green}}>Issue templates</strong> (.github/ISSUE_TEMPLATE/), <strong style={{color:T.blue}}>PR templates</strong> (.github/pull_request_template.md), <strong style={{color:T.purple}}>CODEOWNERS</strong>, and <strong style={{color:T.teal}}>Dependabot config</strong>. Everything in this folder shapes how your team and GitHub bots interact with the repo.
      </InfoBox>
      <InfoBox icon="📉" title="Why centralise it here?" color={T.green}>
        Keeping all GitHub-specific configuration in one folder separates it cleanly from your application code. New contributors immediately know where to look for how the project's development workflows are configured. It's also version-controlled like everything else — so changes to your CI pipeline have a full audit trail in git history.
      </InfoBox>
      <SectionTitle>.github Folder Explorer</SectionTitle>
      <DotGithubExplorer/>
    </div>
  );
  if(id==="dependabot") return (
    <div>
      <InfoBox icon="🤖" title="What is Dependabot?" color={T.green}>
        Almost every project uses third-party libraries (dependencies like React, Express, or NumPy). Those libraries release updates constantly — some adding features, some fixing bugs, and some patching <strong style={{color:T.red}}>critical security vulnerabilities</strong>. Keeping up with them manually is tedious and easy to forget.
        <br/><br/>
        <strong style={{color:T.green}}>Dependabot</strong> is a GitHub bot that watches your dependencies for you. When it finds an outdated or vulnerable package, it automatically opens a Pull Request to update it — with a clear description of what changed and why. You review and merge. No manual checking needed.
      </InfoBox>
      <InfoBox icon="🛡️" title="Security alerts vs version updates" color={T.amber}>
        Dependabot does two separate jobs. <strong style={{color:T.red}}>Security alerts</strong> fire immediately when a dependency has a known CVE (Common Vulnerabilities and Exposures) — these are urgent. <strong style={{color:T.amber}}>Version updates</strong> run on a schedule (daily/weekly) and keep your dependencies generally up to date. You configure both in <code style={{color:T.green}}>.github/dependabot.yml</code>.
      </InfoBox>
      <SectionTitle>Dependabot</SectionTitle>
      <DependabotSim/>
    </div>
  );
  if(id==="codespaces") return (
    <div>
      <InfoBox icon="💻" title="What is GitHub Codespaces?" color={T.teal}>
        Normally, before writing any code on a project, you have to spend time installing tools on your computer — Node.js, Git, certain VS Code extensions, and so on. This is slow, and things often break depending on what computer you're using.
        <br/><br/>
        <strong style={{color:T.teal}}>Codespaces solves this.</strong> It gives you a complete, ready-to-use coding environment that runs in the cloud (on GitHub's servers), and you access it through your browser. Your own computer doesn't need anything installed — not even VS Code.
      </InfoBox>
      <InfoBox icon="🖥️" title="The simple analogy" color={T.amber}>
        Imagine going to a library and sitting at one of their computers. It's already set up with everything you need. You just sit down and start working — you don't carry it home, you don't install anything, and anyone can use it from any device.
        <br/><br/>
        That's Codespaces. The "library computer" is a cloud server. Your "seat" is a browser tab.
      </InfoBox>
      <SectionTitle>WITHOUT vs WITH CODESPACES</SectionTitle>
      <CodespacesSim/>
      <SectionTitle>When should you use it?</SectionTitle>
      {[
        {cmd:"Trying out a project you found on GitHub", desc:"No need to install anything — open a Codespace, explore the code, close the tab when done", detail:"Perfect for evaluating open-source projects or following tutorials. Zero cleanup needed on your own machine.",example:"Like test-driving a car without owning it 🚗"},
        {cmd:"Working on a team project", desc:"Everyone gets the exact same environment — no more 'it works on my machine'", detail:"The devcontainer.json file describes the setup once. Every teammate who opens a Codespace gets an identical environment automatically.",example:"Everyone uses the same recipe → everyone gets the same dish 🍳"},
        {cmd:"Coding from a tablet, school computer, or borrowed device", desc:"All you need is a browser — Codespaces runs on GitHub's servers", detail:"Your code and environment live in the cloud. Log into GitHub from any device, open your Codespace, and continue exactly where you left off.",example:"Your work follows you everywhere, like cloud saved games 🎮"},
        {cmd:"Onboarding a new developer", desc:"New team members can start contributing in minutes, not hours", detail:"Without Codespaces, setting up a dev environment can take half a day and involve many frustrating steps. With Codespaces it's one click.",example:"Starting a new job and your desk is already set up perfectly 🏢"},
      ].map((c,i)=><CommandCard key={i} index={i} {...c}/>)}
    </div>
  );


  return (
    <div style={{color:T.muted,textAlign:"center",padding:40}}>
      <div style={{fontSize:40,marginBottom:12}}>�</div>
      <div style={{fontSize:14,color:"#94a3b8"}}>Module not found.</div>
      <div style={{fontSize:12,marginTop:6}}>Pick a topic from the sidebar to get started.</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */

export default function App() {
  const [active,   setActive]   = useState("home");
  const [sideOpen, setSideOpen] = useState(true);
  const [query,    setQuery]    = useState("");
  const scrollRef = useRef(null);

  const go = useCallback(id => {
    setActive(id);
    setTimeout(() => { if(scrollRef.current) scrollRef.current.scrollTop = 0; }, 0);
  }, []);

  const filtered = MODULES.filter(m=>m.label.toLowerCase().includes(query.toLowerCase())||m.id.includes(query.toLowerCase()));
  const mod = MODULES.find(m=>m.id===active);

  return (
    <div style={{display:"flex",height:"100%",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@600;700;800&display=swap');
        html,body,#root{height:100%;margin:0;padding:0}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1a2540;border-radius:3px}
        @keyframes slideIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        .navrow:hover{background:rgba(74,222,128,.07)!important}
        .navrow.on{background:rgba(74,222,128,.11)!important;border-color:rgba(74,222,128,.28)!important}
        .navrow.on .nlabel{color:#4ade80!important}
      `}</style>

      {/* ambient blobs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-15%",left:"-8%",width:"40%",height:"40%",background:"radial-gradient(circle,rgba(74,222,128,.035) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"-15%",right:"-8%",width:"40%",height:"40%",background:"radial-gradient(circle,rgba(96,165,250,.035) 0%,transparent 70%)"}}/>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{width:sideOpen?236:56,background:"rgba(8,13,26,.99)",borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",transition:"width .22s ease",flexShrink:0,zIndex:10}}>
        {/* logo */}
        <div style={{padding:"14px 12px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#4ade80,#22d3ee)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⚡</div>
          {sideOpen&&<div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13.5,fontWeight:800,color:T.text,letterSpacing:"-.01em"}}>GitSimulator</div>
            <div style={{fontSize:9,color:T.green,letterSpacing:".08em"}}>MASTER EDITION</div>
          </div>}
          <button onClick={()=>setSideOpen(o=>!o)} style={{background:"transparent",border:"none",color:T.muted,cursor:"pointer",fontSize:14,padding:4,flexShrink:0,lineHeight:1}}>
            {sideOpen?"◀":"▶"}
          </button>
        </div>

        {/* search */}
        {sideOpen&&<div style={{padding:"8px 10px",borderBottom:`1px solid rgba(26,37,64,.3)`,flexShrink:0}}>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…"
            style={{width:"100%",background:"rgba(13,21,38,.8)",border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 9px",color:"#94a3b8",fontSize:11,outline:"none"}}/>
        </div>}

        {/* nav */}
        <div style={{flex:1,overflowY:"auto",padding:"6px"}}>
          {filtered.map(m=>(
            <div key={m.id} onClick={()=>go(m.id)} className={`navrow${active===m.id?" on":""}`}
              style={{display:"flex",alignItems:"center",gap:9,padding:sideOpen?"9px 10px":"9px",borderRadius:7,cursor:"pointer",border:"1px solid transparent",marginBottom:2,transition:"all .14s"}}>
              <span style={{fontSize:15,flexShrink:0,opacity:.8}}>{m.icon}</span>
              {sideOpen&&<span className="nlabel" style={{fontSize:12,color:T.muted,fontWeight:500,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.label}</span>}
            </div>
          ))}
        </div>

        {sideOpen&&<div style={{padding:"10px 12px",borderTop:`1px solid ${T.border}`,flexShrink:0}}>
          <div style={{fontSize:9,color:"#1e3a5f",textAlign:"center",lineHeight:1.6}}>Git mastery · All features · v3.0</div>
        </div>}
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:1}}>
        {/* topbar */}
        <div style={{padding:"12px 22px",borderBottom:`1px solid ${T.border}`,background:"rgba(8,13,26,.99)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700}}>{mod?.icon} {mod?.label}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2}}>Click any command card to expand · Hover commit nodes · Use terminals below</div>
          </div>

        </div>

        {/* scrollable content */}
        <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"22px 24px"}}>
          <div style={{maxWidth:820,margin:"0 auto"}}>
            <div style={{animation:"fadeIn .2s ease"}}>
              <ModuleContent id={active}/>
            </div>
          </div>
        </div>
        {/* footer */}
        <footer style={{flexShrink:0,borderTop:"1px solid #0f1825",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"center",gap:10,background:"#050d1a"}}>
          <span style={{color:"#334155",fontSize:11}}>{new Date().getFullYear()}</span>
          <span style={{color:"#1e293b",fontSize:11}}>|</span>
          <a href="https://github.com/SiliconBeachIN" target="_blank" rel="noopener noreferrer"
            style={{display:"flex",alignItems:"center",gap:7,color:"#475569",fontSize:11,textDecoration:"none",transition:"color .2s"}}
            onMouseEnter={e=>e.currentTarget.style.color="#94a3b8"}
            onMouseLeave={e=>e.currentTarget.style.color="#475569"}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            SiliconBeachIN
          </a>
        </footer>
      </div>
    </div>
  );
}
