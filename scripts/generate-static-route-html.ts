import fs from "node:fs";
import path from "node:path";
import en from "../client/src/locales/en";
import {
  buildSiteUrl,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
} from "../client/src/site";
import zhCN from "../client/src/locales/zh-CN";

type PageMeta = {
  dir: string;
  language: "en" | "zh-CN";
  title: string;
  description: string;
  siteName: string;
  canonicalPath: string;
  imageAlt: string;
};

const projectRoot = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(projectRoot, "dist", "public");
const rootHtmlPath = path.join(outputRoot, "index.html");

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function upsertMetaTag(
  html: string,
  attributeName: "name" | "property",
  key: string,
  value: string
) {
  const escapedValue = escapeHtmlAttribute(value);
  const tag = `<meta ${attributeName}="${key}" content="${escapedValue}" />`;
  const pattern = new RegExp(`<meta\\s+${attributeName}="${key}"\\s+content="[^"]*"\\s*\\/>`);

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `  ${tag}\n  </head>`);
}

function upsertLinkTag(html: string, rel: string, href: string, hreflang?: string) {
  const escapedHref = escapeHtmlAttribute(href);
  const attributes = hreflang
    ? `rel="${rel}" hreflang="${hreflang}" href="${escapedHref}"`
    : `rel="${rel}" href="${escapedHref}"`;
  const tag = `<link ${attributes} />`;
  const pattern = hreflang
    ? new RegExp(`<link\\s+rel="${rel}"\\s+hreflang="${hreflang}"\\s+href="[^"]*"\\s*\\/>`)
    : new RegExp(`<link\\s+rel="${rel}"\\s+href="[^"]*"\\s*\\/>`);

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `  ${tag}\n  </head>`);
}

function localizeHtml(html: string, page: PageMeta) {
  const alternateLocale = page.language === "zh-CN" ? "en_US" : "zh_CN";
  const canonicalUrl = buildSiteUrl(page.canonicalPath);

  let nextHtml = html.replace(/<html lang="[^"]+">/, `<html lang="${page.language}">`);
  nextHtml = nextHtml.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  nextHtml = upsertMetaTag(nextHtml, "name", "description", page.description);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:title", page.title);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:description", page.description);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:url", canonicalUrl);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:site_name", page.siteName);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:image", OG_IMAGE_URL);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:image:secure_url", OG_IMAGE_URL);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:image:type", "image/png");
  nextHtml = upsertMetaTag(nextHtml, "property", "og:image:width", String(OG_IMAGE_WIDTH));
  nextHtml = upsertMetaTag(nextHtml, "property", "og:image:height", String(OG_IMAGE_HEIGHT));
  nextHtml = upsertMetaTag(nextHtml, "property", "og:image:alt", page.imageAlt);
  nextHtml = upsertMetaTag(nextHtml, "property", "og:locale", page.language === "zh-CN" ? "zh_CN" : "en_US");
  nextHtml = upsertMetaTag(nextHtml, "property", "og:locale:alternate", alternateLocale);
  nextHtml = upsertMetaTag(nextHtml, "name", "twitter:card", "summary_large_image");
  nextHtml = upsertMetaTag(nextHtml, "name", "twitter:title", page.title);
  nextHtml = upsertMetaTag(nextHtml, "name", "twitter:description", page.description);
  nextHtml = upsertMetaTag(nextHtml, "name", "twitter:image", OG_IMAGE_URL);
  nextHtml = upsertMetaTag(nextHtml, "name", "twitter:image:alt", page.imageAlt);
  nextHtml = upsertMetaTag(nextHtml, "name", "robots", page.canonicalPath.endsWith("/404") ? "noindex,nofollow" : "index,follow");
  nextHtml = upsertLinkTag(nextHtml, "canonical", canonicalUrl);
  nextHtml = upsertLinkTag(nextHtml, "alternate", buildSiteUrl("/en"), "en");
  nextHtml = upsertLinkTag(nextHtml, "alternate", buildSiteUrl("/zh-CN"), "zh-CN");
  nextHtml = upsertLinkTag(nextHtml, "alternate", buildSiteUrl("/"), "x-default");

  return nextHtml;
}

function writePage(html: string, relativePath: string) {
  const destination = path.join(outputRoot, relativePath, "index.html");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html, "utf8");
}

const rootHtml = fs.readFileSync(rootHtmlPath, "utf8");

const pages: PageMeta[] = [
  {
    dir: "en",
    language: "en",
    title: en.home.metaTitle,
    description: en.home.metaDescription,
    siteName: en.common.siteName,
    canonicalPath: "/en",
    imageAlt: en.common.socialImageAlt,
  },
  {
    dir: "zh-CN",
    language: "zh-CN",
    title: zhCN.home.metaTitle,
    description: zhCN.home.metaDescription,
    siteName: zhCN.common.siteName,
    canonicalPath: "/zh-CN",
    imageAlt: zhCN.common.socialImageAlt,
  },
  {
    dir: path.join("en", "404"),
    language: "en",
    title: en.notFound.metaTitle,
    description: en.notFound.metaDescription,
    siteName: en.common.siteName,
    canonicalPath: "/en/404",
    imageAlt: en.common.socialImageAlt,
  },
  {
    dir: path.join("zh-CN", "404"),
    language: "zh-CN",
    title: zhCN.notFound.metaTitle,
    description: zhCN.notFound.metaDescription,
    siteName: zhCN.common.siteName,
    canonicalPath: "/zh-CN/404",
    imageAlt: zhCN.common.socialImageAlt,
  },
  {
    dir: "404",
    language: "en",
    title: en.notFound.metaTitle,
    description: en.notFound.metaDescription,
    siteName: en.common.siteName,
    canonicalPath: "/404",
    imageAlt: en.common.socialImageAlt,
  },
];

pages.forEach(page => {
  writePage(localizeHtml(rootHtml, page), page.dir);
});