import { useState } from "react";
import T from "../../constants/tokens";
import MODULES from "../../constants/modules";

export default function Sidebar({ active, onNavigate, sideOpen, setSideOpen, isMobile }) {
  const [query, setQuery] = useState("");
  const filtered = MODULES.filter(
    (m) =>
      m.label.toLowerCase().includes(query.toLowerCase()) ||
      m.id.includes(query.toLowerCase())
  );

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
            background: "rgba(0,0,0,.6)",
            zIndex: 19,
          }}
        />
      )}

      <div
        style={{
          width: isMobile ? 260 : sideOpen ? 236 : 56,
          background: "rgba(8,13,26,.99)",
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
        {/* logo */}
        <div
          style={{
            padding: "14px 12px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg,#4ade80,#22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          {(sideOpen || isMobile) && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-.01em",
                }}
              >
                GitSimulator
              </div>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setSideOpen((o) => !o)}
              style={{
                background: "transparent",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                fontSize: 14,
                padding: 4,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {sideOpen ? "◀" : "▶"}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setSideOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: T.muted,
                cursor: "pointer",
                fontSize: 18,
                padding: 4,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* search */}
        {(sideOpen || isMobile) && (
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid rgba(26,37,64,.3)",
              flexShrink: 0,
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              style={{
                width: "100%",
                background: "rgba(13,21,38,.8)",
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                padding: "5px 9px",
                color: "#94a3b8",
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
              onClick={() => handleNav(m.id)}
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
                color: "#1e3a5f",
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
