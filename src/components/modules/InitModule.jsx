import T from "../../constants/tokens";
import { InfoBox, ConceptDiagram, SectionTitle, CommandCard, Terminal } from "../shared";
import { useTranslation } from "react-i18next";
import Tr from "../shared/Tr";

export default function InitModule() {
  const { t } = useTranslation();
  return (
    <div>
      <InfoBox icon="📖" title={t("init.story.title")} color={T.purple}>
        {t("init.story.p1.part1")} <strong style={{ color: T.amber }}>{t("init.story.p1.emph")}</strong> {t("init.story.p1.part2")}
      </InfoBox>
      <InfoBox icon="🌱" title={t("init.what.title")} color={T.green}>
        {t("init.what.p1.part1")} <code style={{ color: T.green }}>{t("init.what.code.gitinit")}</code> {t("init.what.p1.part2")} <code style={{ color: T.green }}>{t("init.what.code.gitfolder")}</code> {t("init.what.p1.part3")}
      </InfoBox>
      <ConceptDiagram>{`my-project/
├── .git/                 ← Git's database (don't touch!)
│   ├── HEAD              ← "You are here" pointer
│   ├── objects/          ← All commits, files, trees stored as blobs
│   │   ├── ab/cd1234...  ← Content-addressed storage
│   ├── refs/
│   │   ├── heads/main    ← main branch pointer (just a hash!)
│   │   └── remotes/origin/main
│   └── config            ← Repo settings
├── src/
└── README.md             ← Your actual files (working directory)`}</ConceptDiagram>
      <SectionTitle>{t("init.cli.title")}</SectionTitle>
      {[
        { cmd: "git init my-project", desc: t("init.cli.commands.0.desc"), detail: t("init.cli.commands.0.detail"), example: t("init.cli.commands.0.example") },
        { cmd: "git init", desc: t("init.cli.commands.1.desc"), detail: t("init.cli.commands.1.detail"), example: t("init.cli.commands.1.example") },
        { cmd: "git clone https://github.com/user/repo.git", desc: t("init.cli.commands.2.desc"), detail: t("init.cli.commands.2.detail"), example: t("init.cli.commands.2.example") },
        { cmd: "git clone --depth 1 https://github.com/user/repo.git", desc: t("init.cli.commands.3.desc"), detail: t("init.cli.commands.3.detail"), example: t("init.cli.commands.3.example") },
        { cmd: 'git config --global user.name "Your Name"', desc: t("init.cli.commands.4.desc"), detail: t("init.cli.commands.4.detail"), example: t("init.cli.commands.4.example") },
        { cmd: 'git config --global user.email "you@email.com"', desc: t("init.cli.commands.5.desc"), detail: t("init.cli.commands.5.detail"), example: t("init.cli.commands.5.example") },
      ].map((c, i) => (
        <CommandCard key={i} index={i} {...c} />
      ))}
      <SectionTitle><Tr>init.try.title</Tr></SectionTitle>
      <Terminal compact />
    </div>
  );
}
