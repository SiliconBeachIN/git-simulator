import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MODULES from "../../constants/modules";

const BASE = "https://gitsimulator.xyz";

function setMetaName(name, content) {
  let el = document.querySelector(`meta[name='${name}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  let el = document.querySelector(`meta[property='${property}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function setSchema(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function Canonical() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname || "/";
    const moduleId = path.slice(1) || "home";
    const mod = MODULES.find((m) => m.id === moduleId) || MODULES[0];

    const canonicalUrl = `${BASE}${path === "/" ? "/" : path}`;
    const image = `${BASE}/social/${mod.id}.png`;

    document.title = mod.title;
    setMetaName("description", mod.description);
    setMetaName("keywords", mod.keywords);
    setCanonical(canonicalUrl);

    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:title", mod.title);
    setMetaProperty("og:description", mod.description);
    setMetaProperty("og:image", image);

    setMetaName("twitter:title", mod.title);
    setMetaName("twitter:description", mod.description);
    setMetaName("twitter:image", image);

    setSchema("ld-module", {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: mod.title,
      description: mod.description,
      url: canonicalUrl,
      learningResourceType: "InteractiveResource",
      educationalLevel: "Beginner to Advanced",
      inLanguage: "en",
      isAccessibleForFree: true,
      provider: {
        "@type": "Organization",
        name: "GitSimulator",
        url: BASE,
      },
    });
  }, [location.pathname]);

  return null;
}

