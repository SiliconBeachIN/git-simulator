import { lazy, Suspense } from "react";
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
  worktree: lazy(() => import("./WorktreeModule")),
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
      <Mod isMobile={isMobile} />
    </Suspense>
  );
}
