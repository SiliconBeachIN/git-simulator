import T from "../../constants/tokens";

export default function ConceptDiagram({ children }) {
  return (
    <div
      style={{
        background: "#050b16",
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "16px 20px",
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 12,
        color: T.muted,
        lineHeight: 1.8,
        overflowX: "auto",
        marginBottom: 14,
        whiteSpace: "pre",
      }}
    >
      {children}
    </div>
  );
}
