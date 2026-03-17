import HomeModule from "./HomeModule";
import InitModule from "./InitModule";
import StagingModule from "./StagingModule";
import BranchModule from "./BranchModule";
import MergeModule from "./MergeModule";
import RemoteModule from "./RemoteModule";
import PullRequestModule from "./PullRequestModule";
import GitFlowModule from "./GitFlowModule";
import AdvancedModule from "./AdvancedModule";
import CollaborateModule from "./CollaborateModule";
import VisualizerModule from "./VisualizerModule";
import ActionsModule from "./ActionsModule";
import SecurityModule from "./SecurityModule";
import QuizModule from "./QuizModule";
import IssuesModule from "./IssuesModule";
import ProjectsModule from "./ProjectsModule";
import PagesModule from "./PagesModule";
import ReleasesModule from "./ReleasesModule";
import ProtectionModule from "./ProtectionModule";
import CodeownersModule from "./CodeownersModule";
import GithubApiModule from "./GithubApiModule";
import DotGithubModule from "./DotGithubModule";
import DependabotModule from "./DependabotModule";
import CodespacesModule from "./CodespacesModule";

const MAP = {
  home: HomeModule,
  init: InitModule,
  staging: StagingModule,
  branch: BranchModule,
  merge: MergeModule,
  remote: RemoteModule,
  pullrequest: PullRequestModule,
  gitflow: GitFlowModule,
  advanced: AdvancedModule,
  collaborate: CollaborateModule,
  visualizer: VisualizerModule,
  actions: ActionsModule,
  security: SecurityModule,
  quiz: QuizModule,
  issues: IssuesModule,
  projects: ProjectsModule,
  pages: PagesModule,
  releases: ReleasesModule,
  protection: ProtectionModule,
  codeowners: CodeownersModule,
  githubapi: GithubApiModule,
  dotgithub: DotGithubModule,
  dependabot: DependabotModule,
  codespaces: CodespacesModule,
};

export default function ModuleContent({ id, isMobile }) {
  const Mod = MAP[id];
  if (!Mod) return <div style={{ color: "#94a3b8", padding: 40, textAlign: "center" }}>Module not found</div>;
  return <Mod isMobile={isMobile} />;
}
