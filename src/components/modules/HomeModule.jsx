import T from "../../constants/tokens";
import MODULES from "../../constants/modules";
import { Badge, SectionTitle, Terminal } from "../shared";

export default function HomeModule({ isMobile }) {
  return (
    <div>
      <div
        style={{
          background:
            "linear-gradient(135deg,rgba(74,222,128,.06),rgba(96,165,250,.04))",
          border: "1px solid rgba(74,222,128,.15)",
          borderRadius: 14,
          padding: isMobile ? 16 : 22,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: isMobile ? 18 : 22,
            fontWeight: 800,
            color: T.text,
            marginBottom: 8,
          }}
        >
          ⚡ Welcome to GitSimulator
        </div>
        <div
          style={{
            color: T.subtleText,
            fontSize: isMobile ? 13 : 14,
            lineHeight: 1.8,
            marginBottom: 16,
          }}
        >
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
            <Badge key={t} color={T.blue}>
              {t}
            </Badge>
          ))}
        </div>
      </div>
      <SectionTitle>⚡ Interactive Terminal — Try Commands Now</SectionTitle>
      <Terminal />
      <SectionTitle>🗺️ Learning Path</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill,minmax(190px,1fr))",
          gap: 10,
        }}
      >
        {MODULES.filter((m) => m.id !== "home").map((m) => (
          <div
            key={m.id}
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "13px 14px",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <span style={{ color: T.subtleText, fontSize: 12, fontWeight: 500 }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
