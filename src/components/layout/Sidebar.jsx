import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import T from "../../constants/tokens";
import MODULES from "../../constants/modules";

export default function Sidebar({ active, onNavigate, sideOpen, setSideOpen, isMobile }) {
  const [query, setQuery] = useState("");
  const filtered = MODULES.filter(
    (m) =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.id.includes(query.toLowerCase())
  );
  const location = useLocation();
  const current = location.pathname.slice(1) || "home";

  const handleNav = (id) => {
    onNavigate(id);
    if (isMobile) setSideOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sideOpen && (
        <div
          onClick={() => setSideOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: T.overlayBg,
            zIndex: 19,
          }}
        />
      )}

      <div
        style={{
          width: isMobile ? T.sidebarMobileWidth : sideOpen ? T.sidebarOpenWidth : T.sidebarClosedWidth,
          background: T.navbarBg,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          transition: "transform .22s ease, width .22s ease",
          flexShrink: 0,
          zIndex: 20,
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                transform: sideOpen ? "translateX(0)" : "translateX(-100%)",
              }
            : {}),
        }}
      >
        {/* logo + toggle */}
        <div
          style={{
            padding: "14px 12px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            flexShrink: 0,
            minHeight: 60,
          }}
        >
          <div
            onClick={!isMobile && !sideOpen ? () => setSideOpen(true) : undefined}
            title={!isMobile && !sideOpen ? "Expand sidebar" : undefined}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: !isMobile && !sideOpen ? T.greenBgLight : T.logoGradient,
              border: !isMobile && !sideOpen ? `1px solid ${T.greenBorderLight}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: !isMobile && !sideOpen ? 18 : 16,
              flexShrink: 0,
              cursor: !isMobile && !sideOpen ? "pointer" : "default",
              transition: "background .15s, border-color .15s",
            }}
            onMouseEnter={!isMobile && !sideOpen ? (e) => {
              e.currentTarget.style.background = T.greenBgMedium;
              e.currentTarget.style.borderColor = T.greenBorderMedium;
            } : undefined}
            onMouseLeave={!isMobile && !sideOpen ? (e) => {
              e.currentTarget.style.background = T.greenBgLight;
              e.currentTarget.style.borderColor = T.greenBorderLight;
            } : undefined}
          >
            {!isMobile && !sideOpen ? (
              <span style={{ color: T.green, lineHeight: 1 }}>☰</span>
            ) : "⚡"}
          </div>

          {(sideOpen || isMobile) && (
            <>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-.01em",
                  flex: 1,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                GitSimulator
              </div>

              {!isMobile && (
                <button
                  onClick={() => setSideOpen(false)}
                  style={{
                    background: T.greenBgLight,
                    border: `1px solid ${T.greenBorderLight}`,
                    borderRadius: 6,
                    color: T.green,
                    cursor: "pointer",
                    width: 26,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                    transition: "background .15s, border-color .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = T.greenBgMedium;
                    e.currentTarget.style.borderColor = T.greenBorderMedium;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = T.greenBgLight;
                    e.currentTarget.style.borderColor = T.greenBorderLight;
                  }}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  ‹
                </button>
              )}
            </>
          )}
        </div>

        {/* search */}
        {(sideOpen || isMobile) && (
          <div
            style={{
              padding: "8px 10px",
              borderBottom: `1px solid ${T.sidebarSearchBorder}`,
              flexShrink: 0,
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              style={{
                width: "100%",
                background: T.sidebarSearchBg,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                padding: "5px 9px",
                color: T.subtleText,
                fontSize: 11,
                outline: "none",
              }}
            />
          </div>
        )}

        {/* nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
          {filtered.map((m) => (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNav(m.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNav(m.id); } }}
              className={`navrow${active === m.id ? " on" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: sideOpen || isMobile ? "9px 10px" : "9px",
                borderRadius: 7,
                cursor: "pointer",
                border: "1px solid transparent",
                marginBottom: 2,
                transition: "all .14s",
                outline: "none",
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0, opacity: 0.8 }}>
                {m.icon}
              </span>
              {(sideOpen || isMobile) && (
                <span
                  className="nlabel"
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    fontWeight: 500,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {(sideOpen || isMobile) && (
          <div
            style={{
              padding: "10px 12px",
              borderTop: `1px solid ${T.border}`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: T.faint,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              Git mastery · All features · v3.0
            </div>
          </div>
        )}
      </div>
    </>
  );
}
