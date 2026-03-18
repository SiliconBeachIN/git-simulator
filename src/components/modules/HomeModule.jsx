import T from "../../constants/tokens";
import { Badge, SectionTitle, Terminal, ReadmeGuide } from "../shared";

export default function HomeModule({ isMobile }) {
  return (
    <div>
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
      <SectionTitle>📘 Start With README.md</SectionTitle>
      <ReadmeGuide />
      <SectionTitle>⚡ Interactive Terminal — Try Commands Now</SectionTitle>
      <Terminal />
    </div>
  );
}
