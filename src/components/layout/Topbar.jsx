import T from "../../constants/tokens";
import MODULES from "../../constants/modules";

export default function Topbar({ active, isMobile, onMenuToggle, onResetPage }) {
  const mod = MODULES.find((m) => m.id === active);
  return (
    <div
      style={{
        padding: isMobile ? "10px 14px" : "12px 22px",
        borderBottom: `1px solid ${T.border}`,
        background: T.navbarBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        gap: 10,
      }}
    >
      {isMobile && (
        <button
          onClick={onMenuToggle}
          style={{
            background: T.greenBgLight,
            border: `1px solid ${T.greenBorderLight}`,
            borderRadius: 6,
            color: T.green,
            fontSize: 18,
            padding: "4px 8px",
            cursor: "pointer",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ☰
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {mod?.icon} {mod?.label}
        </div>
        {!isMobile && (
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
            Click any command card to expand · Hover commit nodes · Use terminals below
          </div>
        )}
      </div>
      {active !== "home" && (
        <button
          onClick={onResetPage}
          title="Reset this page's progress"
          style={{
            background: T.red + "12",
            border: `1px solid ${T.red}30`,
            borderRadius: 7,
            color: T.red,
            fontSize: 11,
            fontWeight: 600,
            padding: isMobile ? "5px 10px" : "6px 12px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.red + "22"; e.currentTarget.style.borderColor = T.red + "50"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.red + "12"; e.currentTarget.style.borderColor = T.red + "30"; }}
        >
          ↺ Reset Page
        </button>
      )}
    </div>
  );
}
