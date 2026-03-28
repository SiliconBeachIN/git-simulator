import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import T from "../../constants/tokens";

const LANGS = [
  { code: "en", label: "English", region: "EN" },
  { code: "zh-CN", label: "中文（简体）", region: "CN" },
  { code: "es", label: "Español", region: "ES" },
  { code: "hi", label: "हिन्दी", region: "HI" },
  { code: "ar", label: "العربية", region: "AR" },
  { code: "pt-BR", label: "Português (BR)", region: "BR" },
  { code: "ja", label: "日本語", region: "JP" },
  { code: "ko", label: "한국어", region: "KR" },
  { code: "de", label: "Deutsch", region: "DE" },
  { code: "fr", label: "Français", region: "FR" },
];

export default function LanguageSwitcher({ isMobile }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  // normalize base language to match codes like 'zh-CN' and 'pt-BR'
  const base = (i18n.language || "en").split("-")[0];
  const mapping = { zh: "zh-CN", pt: "pt-BR" };
  const current = mapping[base] || base;

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const setLang = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const currentMeta = LANGS.find((l) => l.code === current) || LANGS[0];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        style={{
          background: T.greenBgLight,
          border: `1px solid ${T.greenBorderLight}`,
          borderRadius: 8,
          color: T.green,
          padding: isMobile ? "6px 8px" : "6px 12px",
          fontSize: isMobile ? 12 : 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 700 }}>{currentMeta.label}</span>
        <span style={{ color: T.muted, fontSize: 11 }}>{`(${currentMeta.region})`}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            minWidth: 200,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            boxShadow: "0 8px 24px rgba(0,0,0,.4)",
            padding: 6,
            listStyle: "none",
            zIndex: 40,
          }}
        >
          {LANGS.map((l) => (
            <li
              key={l.code}
              role="option"
              aria-selected={l.code === current}
              onClick={() => setLang(l.code)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setLang(l.code); }}
              tabIndex={0}
              style={{
                padding: "8px 10px",
                borderRadius: 6,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: T.text,
                background: l.code === current ? T.greenBgLight : "transparent",
                marginBottom: 6,
              }}
            >
              <span style={{ fontWeight: 700, color: l.code === current ? T.green : T.text }}>{l.label}</span>
              <span style={{ color: T.muted, fontSize: 12 }}>{l.region}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
