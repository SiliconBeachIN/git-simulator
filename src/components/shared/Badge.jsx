import T from "../../constants/tokens";

export default function Badge({ children, color = T.green }) {
  return (
    <span
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 20,
        color,
        fontSize: 11,
        padding: "2px 10px",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
