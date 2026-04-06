import { useState, useEffect } from "react";
import T from "../../constants/tokens";

const CONSENT_KEY = "gitsim_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch { /* localStorage unavailable */ }
  }, []);

  const accept = () => {
    setVisible(false);
    // Load GA immediately
    if (typeof window.loadGtagIfConsented === "function") window.loadGtagIfConsented();
    // Reload so AdSense reinitializes in personalized mode deterministically
    if (typeof window.upgradeAdsConsent === "function") window.upgradeAdsConsent();
  };

  const decline = () => {
    try { localStorage.setItem(CONSENT_KEY, "declined"); } catch {}
    setVisible(false);
    window["ga-disable-G-QGLJFHKHP4"] = true;
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: T.card || "#0d1117",
        borderTop: `1px solid ${T.border}`,
        padding: "14px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        animation: "slideIn .3s ease",
      }}
    >
      <p style={{ color: T.subtleText, fontSize: 13, lineHeight: 1.6, maxWidth: 600, margin: 0 }}>
        We and third-party vendors, including Google, use cookies to serve ads and analyze traffic.
        Accepting allows cookies to be used for ads and traffic measurement.{" "}
        <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" style={{ color: T.linkColor, textDecoration: "underline" }}>How Google uses data</a>
        {" · "}
        <a href="/privacy" style={{ color: T.linkColor, textDecoration: "underline" }}>Privacy Policy</a>
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={accept}
          style={{
            background: T.green,
            color: "#000",
            border: "none",
            borderRadius: 6,
            padding: "7px 18px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          style={{
            background: "transparent",
            color: T.subtleText,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            padding: "7px 18px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
