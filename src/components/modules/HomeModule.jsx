import T from "../../constants/tokens";
import { Badge, SectionTitle, Terminal, ReadmeGuide } from "../shared";
import Tr from "../shared/Tr";

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
          <Tr>home.hero.title</Tr>
        </div>
        <div
          style={{
            color: T.subtleText,
            fontSize: isMobile ? 13 : 14,
            lineHeight: 1.8,
            marginBottom: 16,
          }}
        >
          <span>
            <Tr>home.hero.line1</Tr> <strong style={{ color: T.green }}><Tr>home.hero.emph1</Tr></strong>.
          </span>
          <br />
          <span>
            <Tr>home.hero.line2</Tr>
          </span>
          <br />
          <span>
            <Tr>home.hero.commit</Tr>
          </span>
          <br />
          <span>
            <Tr>home.hero.branch</Tr>
          </span>
          <br />
          <span>
            <Tr>home.hero.merge</Tr>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            "home.badges.commit",
            "home.badges.branch",
            "home.badges.remote",
            "home.badges.pr",
          ].map((key) => (
            <Badge key={key} color={T.blue}>
              <Tr>{key}</Tr>
            </Badge>
          ))}
        </div>
      </div>
      <SectionTitle><Tr>home.readme.title</Tr></SectionTitle>
      <ReadmeGuide />
      <SectionTitle><Tr>home.terminal.title</Tr></SectionTitle>
      <Terminal />
    </div>
  );
}
