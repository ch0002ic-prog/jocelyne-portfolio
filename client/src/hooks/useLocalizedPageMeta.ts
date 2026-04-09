import { useEffect } from "react";
import { getLanguagePath, type SupportedLanguage } from "@/i18n";
import {
  buildSiteUrl,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
} from "@/site";

type LocalizedPageMetaOptions = {
  title: string;
  description: string;
  siteName: string;
  language: SupportedLanguage;
  imageAlt: string;
  pathSuffix?: string;
  index?: boolean;
};

function normalizeSuffix(pathSuffix = "") {
  if (!pathSuffix || pathSuffix === "/") {
    return "";
  }

  return pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`;
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;

  let tag = document.head.querySelector<HTMLLinkElement>(selector);

  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;

    if (hreflang) {
      tag.hreflang = hreflang;
    }

    document.head.appendChild(tag);
  }

  tag.href = href;
}

export function useLocalizedPageMeta({
  title,
  description,
  siteName,
  language,
  imageAlt,
  pathSuffix,
  index = true,
}: LocalizedPageMetaOptions) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const suffix = normalizeSuffix(pathSuffix);
    const currentPath = getLanguagePath(language, suffix);
    const canonicalUrl = buildSiteUrl(currentPath);
    const enUrl = buildSiteUrl(getLanguagePath("en", suffix));
    const zhUrl = buildSiteUrl(getLanguagePath("zh-CN", suffix));
    const defaultUrl = buildSiteUrl("/");

    document.title = title;
    document.documentElement.lang = language;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", index ? "index,follow" : "noindex,nofollow");
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", siteName);
    upsertMeta("property", "og:image", OG_IMAGE_URL);
    upsertMeta("property", "og:image:secure_url", OG_IMAGE_URL);
    upsertMeta("property", "og:image:type", "image/png");
    upsertMeta("property", "og:image:width", String(OG_IMAGE_WIDTH));
    upsertMeta("property", "og:image:height", String(OG_IMAGE_HEIGHT));
    upsertMeta("property", "og:image:alt", imageAlt);
    upsertMeta("property", "og:locale", language === "zh-CN" ? "zh_CN" : "en_US");
    upsertMeta(
      "property",
      "og:locale:alternate",
      language === "zh-CN" ? "en_US" : "zh_CN"
    );
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", OG_IMAGE_URL);
    upsertMeta("name", "twitter:image:alt", imageAlt);

    upsertLink("canonical", canonicalUrl);
    upsertLink("alternate", enUrl, "en");
    upsertLink("alternate", zhUrl, "zh-CN");
    upsertLink("alternate", defaultUrl, "x-default");
  }, [description, imageAlt, index, language, pathSuffix, siteName, title]);
}