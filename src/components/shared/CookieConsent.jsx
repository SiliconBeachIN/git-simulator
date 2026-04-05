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

  const triggerConsentScripts = () => {
    if (typeof window.loadGtagIfConsented === "function") window.loadGtagIfConsented();
    if (typeof window.loadAdSenseIfConsented === "function") window.loadAdSenseIfConsented();
  };

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, "accepted"); } catch {}
    setVisible(false);
    triggerConsentScripts();
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
        We use cookies for analytics and to serve ads via Google AdSense.{" "}
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
