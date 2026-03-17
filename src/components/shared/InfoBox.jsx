import T from "../../constants/tokens";

export default function InfoBox({ icon = "💡", title, children, color = T.blue }) {
  return (
    <div
      style={{
        background: `${color}08`,
        border: `1px solid ${color}25`,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      {title && (
        <div
          style={{
            color,
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: ".06em",
          }}
        >
          {icon} {title}
        </div>
      )}
      <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}
