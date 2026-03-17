import { useState } from "react";
import T from "../../constants/tokens";
import CopyBtn from "./CopyBtn";

export default function CommandCard({ cmd, desc, detail, example, warning, index = 0 }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        background: open ? "rgba(74,222,128,.04)" : T.card,
        border: `1px solid ${open ? "rgba(74,222,128,.25)" : T.border}`,
        borderRadius: 10,
        padding: "13px 16px",
        cursor: "pointer",
        transition: "all .18s",
        marginBottom: 8,
        animation: `slideIn .3s ease ${index * 0.04}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <code
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12.5,
            color: T.green,
            flex: 1,
            lineHeight: 1.6,
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
          }}
        >
          {cmd}
        </code>
        <CopyBtn text={cmd} />
      </div>
      <div style={{ color: T.muted, fontSize: 12, marginTop: 5 }}>{desc}</div>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 8 }}>
            📖 {detail}
          </div>
          {example && (
            <div style={{ color: T.amber, fontSize: 12, fontStyle: "italic", marginBottom: 6 }}>
              ✨ {example}
            </div>
          )}
          {warning && (
            <div
              style={{
                color: T.red,
                fontSize: 12,
                background: "rgba(248,113,113,.08)",
                border: "1px solid rgba(248,113,113,.2)",
                borderRadius: 6,
                padding: "6px 10px",
                marginTop: 8,
              }}
            >
              ⚠️ {warning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
