import { useEffect, useState } from "react";
import { Mail, Instagram, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLocalizedPageMeta } from "@/hooks/useLocalizedPageMeta";
import {
  getLanguagePath,
  supportedLanguages,
  type SupportedLanguage,
} from "@/i18n";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

/**
 * Jocelyne Portfolio - Cyberpunk Neon Maximalism
 * Design Philosophy: Dark immersive background with hot pink, electric cyan, and lime green neon accents
 * Typography: Space Mono for bold headlines, Poppins for body text
 * Layout: Asymmetric with diagonal cuts and overlapping galleries
 */

type SectionId =
  | "about"
  | "timeline"
  | "dual-track"
  | "identity"
  | "gallery"
  | "contact";

const navLinks: Array<{ href: `#${SectionId}`; id: SectionId; labelKey: string }> = [
  { href: "#about", id: "about", labelKey: "home.nav.about" },
  { href: "#timeline", id: "timeline", labelKey: "home.nav.timeline" },
  {
    href: "#dual-track",
    id: "dual-track",
    labelKey: "home.nav.dualTrack",
  },
  { href: "#identity", id: "identity", labelKey: "home.nav.identity" },
  { href: "#gallery", id: "gallery", labelKey: "home.nav.gallery" },
  { href: "#contact", id: "contact", labelKey: "home.nav.contact" },
];

const aboutParagraphs = [
  "home.about.paragraphs.first",
  "home.about.paragraphs.second",
  "home.about.paragraphs.third",
  "home.about.paragraphs.fourth",
] as const;

const achievementKeys = [
  "home.about.achievements.speaker",
  "home.about.achievements.speech",
  "home.about.achievements.narrator",
  "home.about.achievements.graduate",
  "home.about.achievements.poppa",
  "home.about.achievements.mmq",
] as const;

const earlyLifeTimeline = ["sichuan", "singapore", "speech", "hwaChong", "nus"] as const;
const financeTrack = ["cmb", "huatai", "uob", "cfa"] as const;
const acgTrack = ["entry", "identity", "poppa", "mmq"] as const;
const featuredEvents = ["march", "april", "scape"] as const;
const identityCards = ["names", "persona", "foundation", "why"] as const;
const currentDirection = ["switch", "near", "long"] as const;

const galleryItems = [
  {
    id: 1,
    image:
      "https://scontent-sin2-3.cdninstagram.com/v/t51.82787-15/611768079_18553568932050027_3836558343992148656_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=107&ig_cache_key=MzgwNzE4NzU2NDk5OTQ3NDg1OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkxOS5zZHIuQzMifQ%3D%3D&_nc_ohc=GunD-MD7ewkQ7kNvwECPw71&_nc_oc=Adp5oj1ZPrPaqQD9nscravB3shsDK5BXTpuN_sukr0bM1t6gA0ObgCxU_KFtjI0x92c&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-sin2-3.cdninstagram.com&_nc_gid=Bgq_dLu8DfVUfPjH6JTvTw&_nc_ss=7a32e&oh=00_Af0aPT7KH7ImTrqmLCRPhVNqSR6DAIgQSSUcaAfhW31vEA&oe=69DC0BDC",
    translationKey: "stagePresence",
  },
  {
    id: 2,
    image: "https://static.wikia.nocookie.net/singapore/images/2/20/Nie_Yi.jpg/",
    translationKey: "energyMotion",
  },
  {
    id: 3,
    image:
      "https://scontent-sin6-3.cdninstagram.com/v/t51.82787-15/657956452_18440991415116216_384955324265327759_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=106&ig_cache_key=Mzg2NjkyNDMyMTM2OTgyNDY1MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzODd4MTg1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=9uMFY5FoF2UQ7kNvwGiRg1l&_nc_oc=AdpHRjb4JQvucurvLytGaDEtkGYrGQYj_SqKnGONruVP7-EwBAez4ZG2v3SPzEYoeAM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-sin6-3.cdninstagram.com&_nc_gid=tem1c8SPaAzbZmCjpJXrzw&_nc_ss=7a32e&oh=00_Af21oR3KOqpStQ5yhO5d-i9cpcwpSp66_VoSp6bz0m7ueg&oe=69DBFD5D",
    translationKey: "digitalSpirit",
  },
] as const;

export default function Home() {
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const { i18n, t } = useTranslation();
  const [, navigate] = useLocation();
  const language: SupportedLanguage = i18n.resolvedLanguage === "zh-CN" ? "zh-CN" : "en";

  useLocalizedPageMeta({
    title: t("home.metaTitle"),
    description: t("home.metaDescription"),
    siteName: t("common.siteName"),
    language,
    imageAlt: t("common.socialImageAlt"),
  });

  useEffect(() => {
    const ratios = new Map<SectionId, number>();
    navLinks.forEach(link => {
      ratios.set(link.id, 0);
    });

    const updateActiveSection = () => {
      const nextSection = Array.from(ratios.entries())
        .filter(([, ratio]) => ratio > 0)
        .sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;

      setActiveSection(current => (current === nextSection ? current : nextSection));
    };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratios.set(
            entry.target.id as SectionId,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        });

        updateActiveSection();
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0, 0.15, 0.3, 0.45, 0.6],
      }
    );

    navLinks.forEach(link => {
      const section = document.getElementById(link.id);
      if (section) {
        observer.observe(section);
      }
    });

    const syncWithHash = () => {
      const hash = window.location.hash.replace("#", "") as SectionId;
      if (navLinks.some(link => link.id === hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", syncWithHash);
    syncWithHash();

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncWithHash);
    };
  }, []);

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    if (nextLanguage !== language) {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      navigate(`${getLanguagePath(nextLanguage)}${hash}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center gap-4 h-16">
          <div className="text-xl sm:text-2xl font-bold font-['Space_Mono'] shrink-0">
            <span className="neon-text">JOCELYNE</span>
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-end gap-3">
            <div className="flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max justify-end gap-2 sm:gap-3 items-center text-xs sm:text-sm font-['IBM_Plex_Mono']">
                {navLinks.map(link => {
                  const isActive = activeSection === link.id;

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setActiveSection(link.id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 whitespace-nowrap border transition-all duration-300",
                        isActive
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-transparent text-muted-foreground hover:text-accent hover:border-accent/30"
                      )}
                    >
                      {t(link.labelKey)}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 rounded-full border border-border bg-card/80 p-1">
              <span className="sr-only">{t("common.languageSwitcher")}</span>
              {supportedLanguages.map(option => {
                const isActive = language === option.code;

                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => handleLanguageChange(option.code)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-['IBM_Plex_Mono'] transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-accent"
                    )}
                  >
                    {option.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-16 overflow-hidden">
        {/* Background gradient and effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b69] via-background to-background opacity-60" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        {/* Hero Content */}
        <div className="relative z-10 container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-['Space_Mono'] leading-tight">
                <span className="neon-text">{t("home.hero.namePrimary")}</span>
                <br />
                <span className="text-cyan-400">{t("home.hero.nameSecondary")}</span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground font-['Poppins']">
                {t("home.hero.tagline")}
              </p>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-foreground/80 font-['Poppins'] max-w-md">
              {t("home.hero.intro")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 max-w-sm sm:max-w-none">
              <a href="#gallery" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  {t("home.hero.primaryCta")}
                </Button>
              </a>
              <a href="#contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10"
                >
                  {t("home.hero.secondaryCta")}
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative h-[22rem] sm:h-96 lg:h-[500px] group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-cyan-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
            <img
              src="https://scontent-sin2-3.cdninstagram.com/v/t51.82787-15/655206054_18438372871116216_873046051657949308_n.jpg?stp=dst-jpg_e35_p1080x1080_tt6&_nc_cat=107&ig_cache_key=Mzg1NjM3ODY5NjU3MjA0ODQ5OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5zZHIuQzMifQ%3D%3D&_nc_ohc=Dr99S7KqzTEQ7kNvwEHFHVX&_nc_oc=Adoas_WRuAkxehvT3CUjrln5LGMT5kRU35uUKx_KSSbVm3ivSSWvU--JWSXc4R8iROQ&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-sin2-3.cdninstagram.com&_nc_gid=9kxwZjkBQV5b6ET439e03Q&_nc_ss=7a32e&oh=00_Af0g85Rp-dwvAqaSkUFKGhS7LDK36OQueY9hbfBR1v3Lmg&oe=69DBEECC"
              alt={t("home.hero.imageAlt")}
              className="w-full h-full object-cover rounded-lg neon-glow"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="text-cyan-400 text-sm font-['IBM_Plex_Mono']">
            {t("home.hero.scrollHint")}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="relative py-24 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1b69]/10 to-transparent" />

        <div className="container relative z-10">
          <div className="mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Mono'] mb-4">
              <span className="neon-text">{t("home.gallery.title")}</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-['Poppins']">
              {t("home.gallery.intro")}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onMouseEnter={() => setHoveredGallery(index)}
                onMouseLeave={() => setHoveredGallery(null)}
              >
                {/* Image Container */}
                <div className="relative h-72 sm:h-80 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={t(`home.gallery.items.${item.translationKey}.title`)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay with neon border */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 hidden sm:flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-2xl font-bold font-['Space_Mono'] mb-2">
                      <span className="neon-text">
                        {t(`home.gallery.items.${item.translationKey}.title`)}
                      </span>
                    </h3>
                    <p className="text-sm text-cyan-400 font-['IBM_Plex_Mono']">
                      {t(`home.gallery.items.${item.translationKey}.category`)}
                    </p>
                  </div>

                  {/* Neon border effect */}
                  <div
                    className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-300 ${
                      hoveredGallery === index
                        ? "neon-border"
                        : "border border-border"
                    }`}
                  />
                </div>

                <div className="px-1 pt-3 sm:hidden">
                  <h3 className="text-lg font-bold font-['Space_Mono']">
                    <span className="neon-text">
                      {t(`home.gallery.items.${item.translationKey}.title`)}
                    </span>
                  </h3>
                  <p className="text-xs text-cyan-400 font-['IBM_Plex_Mono'] mt-1">
                    {t(`home.gallery.items.${item.translationKey}.category`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional gallery note */}
          <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-card rounded-lg border border-border">
            <p className="text-center text-muted-foreground font-['Poppins']">
              {t("home.gallery.moreWork")}{" "}
              <a
                href="https://instagram.com/jocelyn__ny"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {t("home.gallery.instagramLabel")}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative py-24 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1b69]/10 to-transparent" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Mono']">
                <span className="neon-text">{t("home.about.title")}</span>
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-foreground/80 font-['Poppins'] leading-relaxed">
                {aboutParagraphs.map(paragraphKey => (
                  <p key={paragraphKey}>{t(paragraphKey)}</p>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-sm text-muted-foreground font-['IBM_Plex_Mono']">
                  {t("home.about.achievementsTitle")}
                </p>
                <ul className="space-y-2 text-sm font-['Poppins']">
                  {achievementKeys.map(key => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="text-lime-400">▸</span>
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Stats/Info Box */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 sm:p-6 bg-card rounded-lg border border-border neon-glow">
                  <p className="text-2xl sm:text-3xl font-bold text-accent font-['Space_Mono']">
                    2026
                  </p>
                  <p className="text-sm text-muted-foreground font-['Poppins']">
                    {t("home.about.stats.pivotYear")}
                  </p>
                </div>
                <div className="p-5 sm:p-6 bg-card rounded-lg border border-border neon-cyan-glow">
                  <p className="text-2xl sm:text-3xl font-bold text-cyan-400 font-['Space_Mono']">
                    SG
                  </p>
                  <p className="text-sm text-muted-foreground font-['Poppins']">
                    {t("home.about.stats.basedIn")}
                  </p>
                </div>
                <div className="p-5 sm:p-6 bg-card rounded-lg border border-border neon-lime-glow">
                  <p className="text-2xl sm:text-3xl font-bold text-lime-400 font-['Space_Mono']">
                    ACG
                  </p>
                  <p className="text-sm text-muted-foreground font-['Poppins']">
                    {t("home.about.stats.acg")}
                  </p>
                </div>
                <div className="p-5 sm:p-6 bg-card rounded-lg border border-border neon-glow">
                  <p className="text-2xl sm:text-3xl font-bold text-accent font-['Space_Mono']">
                    ∞
                  </p>
                  <p className="text-sm text-muted-foreground font-['Poppins']">
                    {t("home.about.stats.passion")}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground font-['IBM_Plex_Mono'] mb-3">
                  {t("home.about.personality.label")}
                </p>
                <p className="text-lg font-bold font-['Poppins']">
                  {t("home.about.personality.type")}
                </p>
                <p className="text-sm text-foreground/70 font-['Poppins']">
                  {t("home.about.personality.detail")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="timeline"
        className="relative py-24 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1b69]/10 to-transparent" />

        <div className="container relative z-10 space-y-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Mono']">
              <span className="neon-text">{t("home.timeline.title")}</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-['Poppins'] max-w-2xl leading-relaxed">
              {t("home.timeline.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {earlyLifeTimeline.map(item => (
              <article
                key={item}
                className="p-5 sm:p-6 bg-card rounded-lg border border-border space-y-4"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-sm text-cyan-400 font-['IBM_Plex_Mono']">
                    {t(`home.timeline.items.${item}.year`)}
                  </p>
                  <div className="h-px flex-1 min-w-16 bg-border" />
                </div>
                <h3 className="text-2xl font-bold font-['Space_Mono']">
                  {t(`home.timeline.items.${item}.title`)}
                </h3>
                <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                  {t(`home.timeline.items.${item}.detail`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="dual-track"
        className="relative py-24 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1b69]/10 to-transparent" />

        <div className="container relative z-10 space-y-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Mono']">
              <span className="neon-text">{t("home.dualTrack.title")}</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-['Poppins'] max-w-3xl leading-relaxed">
              {t("home.dualTrack.intro")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-cyan-400 font-['IBM_Plex_Mono']">
                  {t("home.dualTrack.financeLabel")}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Mono']">
                  {t("home.dualTrack.financeTitle")}
                </h3>
              </div>

              <div className="space-y-4">
                {financeTrack.map(item => (
                  <article
                    key={item}
                    className="p-5 sm:p-6 bg-card rounded-lg border border-border space-y-3"
                  >
                    <p className="text-sm text-accent font-['IBM_Plex_Mono']">
                      {t(`home.dualTrack.financeItems.${item}.year`)}
                    </p>
                    <h4 className="text-xl font-bold font-['Poppins']">
                      {t(`home.dualTrack.financeItems.${item}.title`)}
                    </h4>
                    <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                      {t(`home.dualTrack.financeItems.${item}.detail`)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-lime-400 font-['IBM_Plex_Mono']">
                  {t("home.dualTrack.performanceLabel")}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Mono']">
                  {t("home.dualTrack.performanceTitle")}
                </h3>
              </div>

              <div className="space-y-4">
                {acgTrack.map(item => (
                  <article
                    key={item}
                    className="p-5 sm:p-6 bg-card rounded-lg border border-border space-y-3"
                  >
                    <p className="text-sm text-lime-400 font-['IBM_Plex_Mono']">
                      {t(`home.dualTrack.performanceItems.${item}.year`)}
                    </p>
                    <h4 className="text-xl font-bold font-['Poppins']">
                      {t(`home.dualTrack.performanceItems.${item}.title`)}
                    </h4>
                    <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                      {t(`home.dualTrack.performanceItems.${item}.detail`)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map(item => (
              <article
                key={item}
                className="p-5 sm:p-6 bg-card rounded-lg border border-border space-y-3"
              >
                <p className="text-sm text-cyan-400 font-['IBM_Plex_Mono']">
                  {t(`home.dualTrack.events.${item}.date`)}
                </p>
                <h3 className="text-xl font-bold font-['Space_Mono']">
                  {t(`home.dualTrack.events.${item}.title`)}
                </h3>
                <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                  {t(`home.dualTrack.events.${item}.detail`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="identity"
        className="relative py-24 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1b69]/10 to-transparent" />

        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <div className="space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Mono']">
                <span className="neon-text">{t("home.identity.title")}</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-['Poppins'] max-w-3xl leading-relaxed">
                {t("home.identity.intro")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {identityCards.map(item => (
                <article
                  key={item}
                  className="p-5 sm:p-6 bg-card rounded-lg border border-border space-y-3"
                >
                  <p className="text-sm text-accent font-['IBM_Plex_Mono'] uppercase">
                    {t(`home.identity.cards.${item}.label`)}
                  </p>
                  <h3 className="text-2xl font-bold font-['Space_Mono']">
                    {t(`home.identity.cards.${item}.title`)}
                  </h3>
                  <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                    {t(`home.identity.cards.${item}.detail`)}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 sm:p-6 bg-card rounded-lg border border-border neon-cyan-glow space-y-4">
              <p className="text-sm text-cyan-400 font-['IBM_Plex_Mono']">
                {t("home.identity.direction.label")}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Mono']">
                {t("home.identity.direction.title")}
              </h3>
              <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                {t("home.identity.direction.summary")}
              </p>
            </div>

            {currentDirection.map(item => (
              <article
                key={item}
                className="p-5 sm:p-6 bg-card rounded-lg border border-border space-y-3"
              >
                <h4 className="text-lg sm:text-xl font-bold font-['Poppins'] text-cyan-400">
                  {t(`home.identity.direction.items.${item}.title`)}
                </h4>
                <p className="text-sm text-foreground/75 font-['Poppins'] leading-relaxed">
                  {t(`home.identity.direction.items.${item}.detail`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative py-24 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2d1b69]/10 to-transparent" />

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Space_Mono'] mb-4">
                <span className="neon-text">{t("home.contact.title")}</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-['Poppins']">
                {t("home.contact.intro")}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instagram */}
              <a
                href="https://instagram.com/jocelyn__ny"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 sm:p-8 bg-card rounded-lg border border-border hover:border-accent transition-all duration-300 neon-glow"
              >
                <div className="flex items-center justify-center mb-4">
                  <Instagram className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Mono'] mb-2">
                  <span className="neon-text">@jocelyn__ny</span>
                </h3>
                <p className="text-sm text-muted-foreground font-['Poppins'] mb-4">
                  {t("home.contact.instagramDescription")}
                </p>
                <div className="flex items-center justify-center text-accent text-sm gap-2 group-hover:gap-3 transition-all">
                  {t("home.contact.visit")} <ExternalLink className="w-4 h-4" />
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:keitoyama01@gmail.com"
                className="group p-6 sm:p-8 bg-card rounded-lg border border-border hover:border-cyan-400 transition-all duration-300 neon-cyan-glow"
              >
                <div className="flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Mono'] mb-2">
                  <span className="text-cyan-400">{t("home.contact.emailTitle")}</span>
                </h3>
                <p className="text-sm text-muted-foreground font-['Poppins'] mb-4">
                  {t("home.contact.emailDescription")}
                </p>
                <div className="flex items-center justify-center text-cyan-400 text-sm gap-2 group-hover:gap-3 transition-all">
                  {t("home.contact.emailCta")} <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground font-['Poppins'] mb-6">
                {t("home.contact.socialIntro")}
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                <a
                  href="https://v.douyin.com/agfkIy7Ibis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-cyan-400 transition-colors font-['IBM_Plex_Mono'] text-sm"
                >
                  {t("home.contact.douyin")}
                </a>
                <a
                  href="https://xhslink.com/m/5iwWQw2dh2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-cyan-400 transition-colors font-['IBM_Plex_Mono'] text-sm"
                >
                  {t("home.contact.xiaohongshu")}
                </a>
                <a
                  href="https://linkedin.com/in/nie-yi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-cyan-400 transition-colors font-['IBM_Plex_Mono'] text-sm"
                >
                  {t("home.contact.linkedin")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-border bg-background/50">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-muted-foreground font-['Poppins'] text-center md:text-left">
              {t("home.footer.rights")}
            </div>
            <div className="text-xs text-muted-foreground font-['IBM_Plex_Mono'] text-center md:text-right">
              {t("home.footer.credit")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
