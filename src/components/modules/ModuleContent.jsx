import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import T from "../../constants/tokens";

const MAP = {
  home: lazy(() => import("./HomeModule")),
  init: lazy(() => import("./InitModule")),
  staging: lazy(() => import("./StagingModule")),
  branch: lazy(() => import("./BranchModule")),
  merge: lazy(() => import("./MergeModule")),
  remote: lazy(() => import("./RemoteModule")),
  pullrequest: lazy(() => import("./PullRequestModule")),
  gitflow: lazy(() => import("./GitFlowModule")),
  advanced: lazy(() => import("./AdvancedModule")),
  collaborate: lazy(() => import("./CollaborateModule")),
  visualizer: lazy(() => import("./VisualizerModule")),
  actions: lazy(() => import("./ActionsModule")),
  security: lazy(() => import("./SecurityModule")),
  quiz: lazy(() => import("./QuizModule")),
  issues: lazy(() => import("./IssuesModule")),
  projects: lazy(() => import("./ProjectsModule")),
  pages: lazy(() => import("./PagesModule")),
  releases: lazy(() => import("./ReleasesModule")),
  protection: lazy(() => import("./ProtectionModule")),
  codeowners: lazy(() => import("./CodeownersModule")),
  githubapi: lazy(() => import("./GithubApiModule")),
  dotgithub: lazy(() => import("./DotGithubModule")),
  dependabot: lazy(() => import("./DependabotModule")),
  codespaces: lazy(() => import("./CodespacesModule")),
};

export default function ModuleContent({ id, isMobile }) {
  const Mod = MAP[id];
  if (!Mod) return <div style={{ color: T.subtleText, padding: 40, textAlign: "center" }}>Module not found</div>;
  return (
    <Suspense fallback={<div style={{ color: T.muted, padding: 40, textAlign: "center" }}>Loading…</div>}>
      <ModuleMeta id={id} />
      <Mod isMobile={isMobile} />
    </Suspense>
  );
}

function ModuleMeta({ id }) {
  try {
    const MODULES = require("../../constants/modules").default;
    const meta = MODULES.find((m) => m.id === id) || {};
    const title = meta.title || (meta.label ? `${meta.label} — GitSimulator` : "GitSimulator — Master GitHub");
    const description = meta.description || "Interactive Git and GitHub learning with live terminal, commit graphs, and quizzes.";
    const canonical = meta.canonical || (id === "home" ? "https://gitsimulator.xyz/" : `https://gitsimulator.xyz/${id}`);
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={meta.image || (id === 'home' ? 'https://gitsimulator.xyz/social/default.png' : `https://gitsimulator.xyz/social/${id}.png`)} />
        <meta name="twitter:image" content={meta.image || (id === 'home' ? 'https://gitsimulator.xyz/social/default.png' : `https://gitsimulator.xyz/social/${id}.png`)} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
    );
  } catch (e) {
    return null;
  }
}

