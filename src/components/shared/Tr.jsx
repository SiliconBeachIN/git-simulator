import React from "react";
import { useTranslation } from "react-i18next";

export default function Tr({ children }) {
  const { t } = useTranslation();
  if (typeof children !== "string") return children;
  return t(children);
}
