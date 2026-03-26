import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Canonical() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname || "/";
    const canonicalUrl = `https://gitsimulator.xyz${path}`;

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    let og = document.querySelector("meta[property='og:url']");
    if (!og) {
      og = document.createElement("meta");
      og.setAttribute("property", "og:url");
      document.head.appendChild(og);
    }
    og.setAttribute("content", canonicalUrl);
  }, [location.pathname]);

  return null;
}
