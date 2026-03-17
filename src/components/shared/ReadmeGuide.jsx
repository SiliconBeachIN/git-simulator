import T from "../../constants/tokens";
import InfoBox from "./InfoBox";

export default function ReadmeGuide() {
  return (
    <InfoBox icon="📘" title="README.md — Your Project's Front Door" color={T.blue}>
      <div style={{ color: T.subtleText, fontSize: 12, lineHeight: 1.8 }}>
        <strong style={{ color: T.text }}>README.md</strong> is the first file people read in a
        repository. It should quickly answer:
        <br />
        1. What is this project?
        <br />
        2. How do I run it?
        <br />
        3. What commands are important?
        <br />
        4. How can I contribute?
        <br />
        <br />
        A good README saves time for beginners, teammates, and future you.
      </div>
    </InfoBox>
  );
}
