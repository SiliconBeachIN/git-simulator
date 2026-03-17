import T from "../../constants/tokens";

export default function SectionTitle({ children }) {
  return (
    <div
      style={{
        color: T.muted,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        marginBottom: 12,
        marginTop: 24,
        borderBottom: `1px solid ${T.border}`,
        paddingBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
