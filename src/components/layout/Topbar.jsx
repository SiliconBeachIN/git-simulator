import T from "../../constants/tokens";
import MODULES from "../../constants/modules";

export default function Topbar({ active, isMobile, onMenuToggle }) {
  const mod = MODULES.find((m) => m.id === active);
  return (
    <div
      style={{
        padding: isMobile ? "10px 14px" : "12px 22px",
        borderBottom: `1px solid ${T.border}`,
        background: "rgba(8,13,26,.99)",
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
            background: "rgba(74,222,128,.08)",
            border: `1px solid rgba(74,222,128,.2)`,
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
    </div>
  );
}
