export const SITE_URL = "https://jocelyne-portfolio.vercel.app";
export const OG_IMAGE_PATH = "/og/jocelyne-portfolio-card.png";
export const OG_IMAGE_URL = new URL(OG_IMAGE_PATH, SITE_URL).toString();
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function buildSiteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}