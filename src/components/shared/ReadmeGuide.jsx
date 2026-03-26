import T from "../../constants/tokens";
import InfoBox from "./InfoBox";
import { useTranslation } from "react-i18next";

export default function ReadmeGuide() {
  const { t } = useTranslation();
  return (
    <InfoBox icon="📘" title={t("README.md — Your Project's Front Door")} color={T.blue}>
      <div style={{ color: T.subtleText, fontSize: 12, lineHeight: 1.8 }}>
        <strong style={{ color: T.text }}>{t("readme.name")}</strong> {t("readme.body.intro")}
        <br />
        1. {t("readme.body.q1")}
        <br />
        2. {t("readme.body.q2")}
        <br />
        3. {t("readme.body.q3")}
        <br />
        4. {t("readme.body.q4")}
        <br />
        <br />
        {t("readme.body.conclusion")}
      </div>
    </InfoBox>
  );
}
