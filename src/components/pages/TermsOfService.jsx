import T from "../../constants/tokens";

export default function TermsOfService() {
  const h2 = { fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: T.text, margin: "28px 0 10px" };
  const p = { color: T.subtleText, fontSize: 14, lineHeight: 1.8, marginBottom: 10 };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 8 }}>
        Terms of Service
      </h1>
      <p style={{ ...p, fontSize: 12, color: T.muted }}>Last updated: April 5, 2026</p>

      <h2 style={h2}>1. Acceptance of Terms</h2>
      <p style={p}>
        By accessing and using GitSimulator (gitsimulator.xyz), you agree to be bound by these Terms
        of Service. If you do not agree, please do not use the site.
      </p>

      <h2 style={h2}>2. Description of Service</h2>
      <p style={p}>
        GitSimulator is a free, browser-based educational tool for learning Git and GitHub concepts
        through interactive modules, a simulated terminal, and quizzes. No account creation is required.
      </p>

      <h2 style={h2}>3. Acceptable Use</h2>
      <p style={p}>You agree not to:</p>
      <ul style={{ color: T.subtleText, fontSize: 14, lineHeight: 1.8, paddingLeft: 24, marginBottom: 10 }}>
        <li>Use the service for any unlawful purpose</li>
        <li>Attempt to interfere with or disrupt the service</li>
        <li>Scrape or automate access to the site in a way that degrades performance</li>
        <li>Circumvent or manipulate advertisements displayed on the site</li>
      </ul>

      <h2 style={h2}>4. Intellectual Property</h2>
      <p style={p}>
        The GitSimulator source code is open source under the MIT License. Educational content,
        design, and branding are the property of GitSimulator. Third-party trademarks (Git, GitHub)
        belong to their respective owners.
      </p>

      <h2 style={h2}>5. Advertisements</h2>
      <p style={p}>
        GitSimulator displays advertisements via Google AdSense to support free access. Ad content
        is provided by third parties and does not represent endorsement by GitSimulator.
      </p>

      <h2 style={h2}>6. Disclaimer of Warranties</h2>
      <p style={p}>
        GitSimulator is provided "as is" without warranties of any kind. We do not guarantee the
        accuracy of all educational content or uninterrupted availability of the service.
      </p>

      <h2 style={h2}>7. Limitation of Liability</h2>
      <p style={p}>
        GitSimulator shall not be liable for any indirect, incidental, or consequential damages
        arising from your use of the service.
      </p>

      <h2 style={h2}>8. Changes to Terms</h2>
      <p style={p}>
        We reserve the right to modify these terms at any time. Continued use of the site after
        changes constitutes acceptance of the updated terms.
      </p>

      <h2 style={h2}>9. Contact</h2>
      <p style={p}>
        Questions about these Terms? Contact us at:{" "}
        <a href="mailto:jithesh1298@gmail.com" style={{ color: T.linkColor }}>jithesh1298@gmail.com</a>
      </p>
    </div>
  );
}
