import T from "../../constants/tokens";

export default function PrivacyPolicy() {
  const h2 = { fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: T.text, margin: "28px 0 10px" };
  const p = { color: T.subtleText, fontSize: 14, lineHeight: 1.8, marginBottom: 10 };
  const ul = { color: T.subtleText, fontSize: 14, lineHeight: 1.8, paddingLeft: 24, marginBottom: 10 };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p style={{ ...p, fontSize: 12, color: T.muted }}>Last updated: April 5, 2026</p>

      <h2 style={h2}>1. Information We Collect</h2>
      <p style={p}>
        GitSimulator does not require registration or collect personal information directly.
        However, we use third-party services that may collect data automatically:
      </p>
      <ul style={ul}>
        <li><strong style={{ color: T.text }}>Google Analytics</strong> — collects anonymized usage data (pages visited, session duration, device type, approximate location) to help us improve the site.</li>
        <li><strong style={{ color: T.text }}>Google AdSense</strong> — may use cookies and web beacons to serve personalized or non-personalized ads based on your browsing behavior.</li>
      </ul>

      <h2 style={h2}>2. Cookies & Tracking Technologies</h2>
      <p style={p}>
        We and our third-party partners use cookies, pixels, and local storage for:
      </p>
      <ul style={ul}>
        <li>Remembering your learning progress (local storage only, stays on your device)</li>
        <li>Analytics and site performance measurement (Google Analytics)</li>
        <li>Serving and measuring advertisements (Google AdSense)</li>
      </ul>
      <p style={p}>
        You can manage cookie preferences through your browser settings. Disabling cookies may affect ad personalization but will not affect core site functionality.
      </p>

      <h2 style={h2}>3. Google AdSense & Personalized Advertising</h2>
      <p style={p}>
        Google uses cookies to serve ads based on your prior visits to this website or other websites.
        Google's use of advertising cookies enables it and its partners to serve ads based on your visit
        to this site and/or other sites on the Internet.
      </p>
      <p style={p}>
        You may opt out of personalized advertising by visiting{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: T.linkColor }}>
          Google Ads Settings
        </a>. Alternatively, you can opt out of third-party vendor cookies at{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: T.linkColor }}>
          www.aboutads.info
        </a>.
      </p>

      <h2 style={h2}>4. Data Sharing</h2>
      <p style={p}>
        We do not sell, trade, or transfer your personal information to third parties.
        Data collected by Google Analytics and Google AdSense is governed by{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: T.linkColor }}>
          Google's Privacy Policy
        </a>.
      </p>

      <h2 style={h2}>5. Children's Privacy</h2>
      <p style={p}>
        GitSimulator is an educational tool suitable for all ages. We do not knowingly collect personal
        information from children under 13. If you believe a child has provided us personal data,
        please contact us to have it removed.
      </p>

      <h2 style={h2}>6. Your Rights (GDPR / CCPA)</h2>
      <p style={p}>
        Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict
        processing of your personal data. Since we do not collect personal data directly, most rights
        are exercised through Google's tools linked above.
      </p>

      <h2 style={h2}>7. Changes to This Policy</h2>
      <p style={p}>
        We may update this Privacy Policy from time to time. Changes will be posted on this page
        with an updated revision date.
      </p>

      <h2 style={h2}>8. Contact Us</h2>
      <p style={p}>
        If you have questions about this Privacy Policy, contact us at:{" "}
        <a href="mailto:jithesh1298@gmail.com" style={{ color: T.linkColor }}>jithesh1298@gmail.com</a>
      </p>
    </div>
  );
}
