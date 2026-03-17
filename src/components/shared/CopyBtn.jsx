import { useState } from "react";
import T from "../../constants/tokens";

export default function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        try { navigator.clipboard.writeText(text); } catch (err) { /* noop */ }
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      style={{
        background: done ? "rgba(74,222,128,.18)" : "rgba(30,41,59,.7)",
        border: `1px solid ${done ? T.green : T.border}`,
        borderRadius: 6,
        color: done ? T.green : T.muted,
        padding: "3px 11px",
        cursor: "pointer",
        fontSize: 11,
        whiteSpace: "nowrap",
        transition: "all .2s",
        flexShrink: 0,
      }}
    >
      {done ? "✓ Copied" : "Copy"}
    </button>
  );
}
