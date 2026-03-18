const T = {
  // ── Backgrounds ──────────────────────────────────────────────
  bg: "#060b18",           // page / app background
  surface: "#090e1c",      // elevated surface (cards, panels)
  card: "#0d1526",         // card background
  diagramBg: "#050b16",    // monospace diagram / code block background
  terminalBg: "#050b13",   // interactive terminal background
  navbarBg: "rgba(8,13,26,.99)", // topbar / sidebar opaque background

  // ── Borders ───────────────────────────────────────────────────
  border: "#1a2540",       // default border
  scrollThumb: "#1a2540",  // custom scrollbar thumb

  // ── Text ──────────────────────────────────────────────────────
  text: "#e2e8f0",         // primary text
  subtleText: "#94a3b8",   // secondary / description text
  muted: "#64748b",        // muted / placeholder text
  faint: "#1e293b",        // very faint text (e.g. footer version)
  linkColor: "#475569",    // default link / icon color
  scrollBarLine: "#334155", // terminal scroll hint color

  // ── Accent Colors ─────────────────────────────────────────────
  green: "#4ade80",        // primary success / active accent
  teal: "#2dd4bf",         // teal accent
  blue: "#60a5fa",         // info / link accent
  purple: "#a78bfa",       // terminal prompt / special accent
  amber: "#fbbf24",        // warning / example accent
  red: "#f87171",          // error / danger accent
  terminalOk: "#34d399",   // terminal success text

  // ── Logo gradient (used in sidebar logo icon) ─────────────────
  logoGradient: "linear-gradient(135deg,#4ade80,#22d3ee)",

  // ── Glow overlays (decorative background radials) ─────────────
  glowGreen: "radial-gradient(circle,rgba(74,222,128,.035) 0%,transparent 70%)",
  glowBlue:  "radial-gradient(circle,rgba(96,165,250,.035) 0%,transparent 70%)",

  // ── Semantic alpha variants (used repeatedly across components) ─
  greenBgSubtle:     "rgba(74,222,128,.04)",   // card open background
  greenBorder:       "rgba(74,222,128,.25)",   // card open border
  greenBgLight:      "rgba(74,222,128,.08)",   // button / tag background
  greenBorderLight:  "rgba(74,222,128,.20)",   // button border
  greenBgMedium:     "rgba(74,222,128,.10)",   // slightly stronger bg
  greenBorderMedium: "rgba(74,222,128,.25)",   // slightly stronger border
  greenNavHover:     "rgba(74,222,128,.07)",   // sidebar row hover
  greenNavActive:    "rgba(74,222,128,.11)",   // sidebar row active
  greenNavBorder:    "rgba(74,222,128,.28)",   // sidebar active border

  blueBgLight:       "rgba(96,165,250,.10)",   // blue button background
  blueBorderLight:   "rgba(96,165,250,.25)",   // blue button border
  blueBgMedium:      "rgba(96,165,250,.12)",   // stronger blue bg (active tab etc.)
  blueBorderMedium:  "rgba(96,165,250,.30)",   // stronger blue border (active tab etc.)

  tealBgLight:       "rgba(45,212,191,.10)",   // teal button background
  tealBorderLight:   "rgba(45,212,191,.25)",   // teal button border
  tealBgActive:      "rgba(45,212,191,.08)",   // teal active selection background
  tealBorderActive:  "rgba(45,212,191,.30)",   // teal active selection border

  redBgLight:        "rgba(248,113,113,.08)",  // danger/warning background
  redBorderLight:    "rgba(248,113,113,.20)",  // danger/warning border
  redBgSubtle:       "rgba(248,113,113,.05)",  // very light danger background

  purpleBgLight:     "rgba(167,139,250,.10)",  // purple button background
  purpleBorderLight: "rgba(167,139,250,.25)",  // purple button border

  greenBgSmall:      "rgba(74,222,128,.06)",   // tiny accent background (match result etc.)
  greenBorderStrong: "rgba(74,222,128,.30)",   // stronger green border (resolved conflict etc.)

  heroBannerBg:      "linear-gradient(135deg,rgba(74,222,128,.06),rgba(96,165,250,.04))", // home hero banner
  heroBannerBorder:  "rgba(74,222,128,.15)",   // home hero banner border

  stepActiveBg:      "rgba(74,222,128,.20)",   // step/stepper active circle background
  stepInactiveBg:    "rgba(26,37,64,.50)",      // step/stepper inactive circle background

  redBorderStrong:   "rgba(248,113,113,.30)",  // strong danger border (conflict detected)
  purpleBgMedium:    "rgba(167,139,250,.12)",  // medium purple background (merge button)

  greenBgCopied:     "rgba(74,222,128,.18)",  // copy button "copied" flash bg
  greenBorderActive: "rgba(74,222,128,.50)",  // toggle/switch active border (strong)
  greenBgToggle:     "rgba(74,222,128,.30)",  // toggle active background
  greenBgHalfAlpha:  "rgba(74,222,128,.50)",  // semi-visible green (drop zone text etc.)

  toggleInactiveBg:  "rgba(30,41,64,.50)",    // toggle inactive background

  copyBtnBg:         "rgba(30,41,59,.70)",    // copy button default background

  sidebarSearchBg:   "rgba(13,21,38,.80)",    // sidebar search input background
  sidebarSearchBorder: "rgba(26,37,64,.30)",  // sidebar search container border

  redBgMedium:       "rgba(248,113,113,.10)", // medium red background (scenario button etc.)
  redBorderMedium:   "rgba(248,113,113,.30)", // medium red border
  amberBgLight:      "rgba(251,191,36,.10)",  // amber badge / button background
  amberBorderLight:  "rgba(251,191,36,.20)",  // amber badge border
  amberBorderMedium: "rgba(251,191,36,.30)",  // amber card border (pre-release)

  inputBgDark:       "rgba(6,11,24,.6)",       // darker input background (CODEOWNERS etc.)
  inputBgFaint:      "rgba(6,11,24,.8)",       // faint dark input background
  selectionBgInactive: "rgba(13,21,38,.5)",    // unselected tab/button background
  cardBgInactive:    "rgba(13,21,38,.4)",      // unselected tree item background
  overlayBg:         "rgba(0,0,0,.6)",         // modal backdrop

  // ── Timeline connector gradients (used in step-by-step flows) ─
  timelineGradientGreen: "linear-gradient(to bottom, #4ade80, rgba(74,222,128,.1))",
  timelineGradientTeal:  "linear-gradient(to bottom,#2dd4bf,rgba(45,212,191,.1))",

  // ── Reset / secondary button ───────────────────────────────────
  resetBg:     "rgba(30,41,59,.5)",  // secondary / reset button background
  mobileBreakpoint: 768,   // px — screens narrower than this are "mobile"
  sidebarOpenWidth: 236,   // px — sidebar width when expanded
  sidebarClosedWidth: 56,  // px — sidebar width when collapsed (icons only)
  sidebarMobileWidth: 260, // px — sidebar width on mobile (full overlay)
};

export default T;
