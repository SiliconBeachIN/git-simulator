import { usePageState } from "../../hooks/usePageState";
import T from "../../constants/tokens";
import { useTranslation } from "react-i18next";
import Tr from "../shared/Tr";
import { InfoBox, SectionTitle, CommandCard } from "../shared";

const MOCK_FILES = [
  { name: "src/App.jsx", status: "modified" },
  { name: "src/auth.js", status: "new" },
  { name: "README.md", status: "modified" },
  { name: "package.json", status: "modified" },
  { name: "src/utils.js", status: "deleted" },
];

function StagingSimulator({ isMobile }) {
  const { t } = useTranslation();
  const [files, setFiles] = usePageState("files", MOCK_FILES.map((f) => ({ ...f, staged: false })));
  const [committed, setCommitted] = usePageState("committed", []);
  const [msg, setMsg] = usePageState("msg", "");
  const [phase, setPhase] = usePageState("phase", "working");

  const unstaged = files.filter((f) => !f.staged);
  const staged = files.filter((f) => f.staged);

  const stageFile = (name) =>
    setFiles((fs) => fs.map((f) => (f.name === name ? { ...f, staged: true } : f)));
  const stageAll = () => setFiles((fs) => fs.map((f) => ({ ...f, staged: true })));
  const unstage = (name) =>
    setFiles((fs) => fs.map((f) => (f.name === name ? { ...f, staged: false } : f)));

  const doCommit = () => {
    if (!msg.trim() || staged.length === 0) return;
    const id = Math.random().toString(36).slice(2, 9);
    setCommitted((c) => [
      { id, msg: msg.trim(), files: staged.map((f) => f.name), time: new Date().toLocaleTimeString() },
      ...c,
    ]);
    setFiles((fs) => fs.filter((f) => !f.staged));
    setMsg("");
    setPhase("committed");
    setTimeout(() => setPhase("working"), 2000);
  };

  const reset = () => {
    setFiles(MOCK_FILES.map((f) => ({ ...f, staged: false })));
    setCommitted([]);
    setMsg("");
    setPhase("working");
  };

  const statusColors = { modified: T.amber, new: T.green, deleted: T.red };
  const statusLabels = { modified: "M", new: "A", deleted: "D" };

  return (
    <div>
      <InfoBox icon="🎬" title={t("staging.how.title")} color={T.blue}>
        {t("staging.how.p1.part1")} <strong style={{ color: T.blue }}>{t("staging.how.p1.emph")}</strong>: {t("staging.how.p1.part2")}
      </InfoBox>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        {/* Working Dir */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.amber, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>{t("staging.workingDir.label")}</div>
          {unstaged.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>{t("staging.workingDir.empty")}</div>
          ) : (
            unstaged.map((f) => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: statusColors[f.status], fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 14 }}>{statusLabels[f.status]}</span>
                <span style={{ color: T.subtleText, fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button onClick={() => stageFile(f.name)} style={{ background: T.greenBgMedium, border: `1px solid ${T.greenBorderLight}`, borderRadius: 4, color: T.green, fontSize: 10, padding: "2px 7px", cursor: "pointer" }}>{t("staging.addButton")}</button>
              </div>
            ))
          )}
          {unstaged.length > 0 && (
            <button onClick={stageAll} style={{ width: "100%", background: T.greenBgLight, border: `1px solid ${T.greenBorderLight}`, borderRadius: 6, color: T.green, fontSize: 11, padding: "6px", cursor: "pointer", marginTop: 6 }}>
              {t("staging.stageAll")}
            </button>
          )}
        </div>
        {/* Staging Area */}
        <div style={{ background: T.card, border: `1px solid ${staged.length > 0 ? T.greenBorderStrong : T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.green, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>{t("staging.stagingArea.label")}</div>
          {staged.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>{t("staging.stagingArea.empty")}</div>
          ) : (
            staged.map((f) => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ color: T.green, fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 14 }}>✓</span>
                <span style={{ color: T.subtleText, fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <button onClick={() => unstage(f.name)} style={{ background: T.redBgMedium, border: `1px solid ${T.redBorderLight}`, borderRadius: 4, color: T.red, fontSize: 10, padding: "2px 7px", cursor: "pointer" }}>{t("staging.undo", "← undo")}</button>
              </div>
            ))
          )}
          {staged.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t("staging.commit.placeholder")}
                style={{ width: "100%", background: T.inputBgFaint, border: `1px solid ${T.border}`, borderRadius: 6, padding: "7px 10px", color: T.text, fontSize: 11, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
                onKeyDown={(e) => e.key === "Enter" && doCommit()} />
              <button onClick={doCommit} disabled={!msg.trim()} style={{ width: "100%", marginTop: 6, background: msg.trim() ? T.purpleBgMedium : T.cardBgInactive, border: `1px solid ${msg.trim() ? T.purpleBorderLight : T.border}`, borderRadius: 6, color: msg.trim() ? T.purple : T.muted, fontSize: 11, padding: "7px", cursor: msg.trim() ? "pointer" : "default", transition: "all .2s" }}>
                {`${t("staging.commit.buttonPrefix")} "${msg.trim() || "..."}"`}
              </button>
            </div>
          )}
        </div>
        {/* Repository */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: T.purple, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", marginBottom: 10 }}>{t("staging.repository.label")}</div>
          {committed.length === 0 ? (
            <div style={{ color: T.muted, fontSize: 12, textAlign: "center", padding: 16 }}>{t("staging.repository.empty")}</div>
          ) : (
            committed.map((c) => (
              <div key={c.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ color: T.purple, fontFamily: "monospace", fontSize: 10 }}>{c.id}</span>
                  <span style={{ color: T.muted, fontSize: 10 }}>{c.time}</span>
                </div>
                <div style={{ color: T.subtleText, fontSize: 11, marginBottom: 4 }}>{c.msg}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {c.files.map((f) => (
                    <span key={f} style={{ background: T.purpleBgLight, border: `1px solid ${T.purpleBorderLight}`, borderRadius: 3, fontSize: 9, color: T.purple, padding: "1px 5px" }}>
                      {f.split("/").pop()}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
          {phase === "committed" && (
            <div style={{ color: T.green, fontSize: 11, textAlign: "center", animation: "fadeIn .3s" }}>
              {t("staging.commit.committed")}
            </div>
          )}
        </div>
      </div>
      {committed.length > 0 && files.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 8, marginBottom: 4 }}>
          <button onClick={reset} style={{ background: T.resetBg, border: `1px solid ${T.border}`, borderRadius: 7, color: T.muted, fontSize: 11, padding: "7px 20px", cursor: "pointer" }}>
            {t("staging.reset")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function StagingModule({ isMobile }) {
  const { t } = useTranslation();

  return (
    <div>
      <InfoBox icon="📦" title={t("staging.how.title")} color={T.green}>
        {t("staging.how.p1.part1")} <strong style={{ color: T.amber }}>{t("staging.how.p1.emph")}</strong> {t("staging.how.p1.part2")}
      </InfoBox>
      <InfoBox icon="🛒" title={t("staging.grocery.title")} color={T.teal}>
        <Tr>staging.grocery.p1</Tr>
      </InfoBox>
      <SectionTitle>{t("staging.interactive.title")}</SectionTitle>
      <StagingSimulator isMobile={isMobile} />
      <SectionTitle>{t("staging.cli.title")}</SectionTitle>
      {[
        { cmd: "git status", desc: t("staging.cli.commands.0.desc"), detail: t("staging.cli.commands.0.detail"), example: t("staging.cli.commands.0.example") },
        { cmd: "git add filename.js", desc: t("staging.cli.commands.1.desc"), detail: t("staging.cli.commands.1.detail"), example: t("staging.cli.commands.1.example") },
        { cmd: "git add .", desc: t("staging.cli.commands.2.desc"), detail: t("staging.cli.commands.2.detail"), example: t("staging.cli.commands.2.example") },
        { cmd: "git add -p", desc: t("staging.cli.commands.3.desc"), detail: t("staging.cli.commands.3.detail"), example: t("staging.cli.commands.3.example") },
        { cmd: 'git commit -m "feat: add login"', desc: t("staging.cli.commands.4.desc"), detail: t("staging.cli.commands.4.detail"), example: t("staging.cli.commands.4.example") },
        { cmd: "git commit --amend", desc: t("staging.cli.commands.5.desc"), detail: t("staging.cli.commands.5.detail"), example: t("staging.cli.commands.5.example"), warning: t("staging.cli.commands.5.warning") },
        { cmd: "git log --oneline --graph --all", desc: t("staging.cli.commands.6.desc"), detail: t("staging.cli.commands.6.detail"), example: t("staging.cli.commands.6.example") },
        { cmd: "git diff", desc: t("staging.cli.commands.7.desc"), detail: t("staging.cli.commands.7.detail"), example: t("staging.cli.commands.7.example") },
        { cmd: "git diff --staged", desc: t("staging.cli.commands.8.desc"), detail: t("staging.cli.commands.8.detail"), example: t("staging.cli.commands.8.example") },
        { cmd: "git restore filename.js", desc: t("staging.cli.commands.9.desc"), detail: t("staging.cli.commands.9.detail"), example: t("staging.cli.commands.9.example"), warning: t("staging.cli.commands.9.warning") },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
    </div>
  );
}



