import { useRef, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import T from "./constants/tokens";
import useMediaQuery from "./hooks/useMediaQuery";
import { Sidebar, Topbar, Footer } from "./components/layout";
import { ModuleContent } from "./components/modules";
import MODULES from "./constants/modules";

const MOBILE_QUERY = `(max-width:${T.mobileBreakpoint}px)`;

function AppShell() {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(!isMobile);

  useEffect(() => {
    setSideOpen(!isMobile);
  }, [isMobile]);

  // Extract module id from path
  let active = location.pathname.slice(1) || "home";
  if (!MODULES.some(m => m.id === active)) active = "home";

  // Navigation handler updates URL
  const go = (id) => {
    if (id === "home") navigate("/");
    else navigate(`/${id}`);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, 0);
  };

  return (
    <div style={{ display: "flex", height: "100%", minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Segoe UI',system-ui,sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@600;700;800&display=swap');
        html,body,#root{height:100%;margin:0;padding:0}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.scrollThumb};border-radius:3px}
        @keyframes slideIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        .navrow:hover{background:${T.greenNavHover}!important}
        .navrow.on{background:${T.greenNavActive}!important;border-color:${T.greenNavBorder}!important}
        .navrow.on .nlabel{color:${T.green}!important}
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", left: "-8%", width: "40%", height: "40%", background: T.glowGreen }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: "40%", height: "40%", background: T.glowBlue }} />
      </div>

      <Sidebar active={active} onNavigate={go} sideOpen={sideOpen} setSideOpen={setSideOpen} isMobile={isMobile} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 1 }}>
        <Topbar active={active} isMobile={isMobile} onMenuToggle={() => setSideOpen((o) => !o)} />

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 12px" : "22px 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ animation: "fadeIn .2s ease" }}>
              <Routes>
                <Route path="/" element={<ModuleContent id="home" isMobile={isMobile} />} />
                {MODULES.filter(m => m.id !== "home").map(m => (
                  <Route key={m.id} path={`/${m.id}`} element={<ModuleContent id={m.id} isMobile={isMobile} />} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
