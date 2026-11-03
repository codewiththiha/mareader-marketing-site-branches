import { useEffect, useState } from "react";
import { ChartNoAxesColumnIncreasing, LibraryBig, Moon, ScrollText, Search, StickyNote, Sun, Type, type LucideIcon } from "lucide-react";
import { Film } from "./film/Film";
import { Bake } from "./Bake";
import type { Site } from "./app/looks";
import icon from "./assets/icon.png";
import favicon from "./assets/icon32.png";

const GH = "https://github.com/codewiththiha/mareader2";
const RELEASES = `${GH}/releases/latest`;

const isBake = /[?&](bake|bakelist)\b/.test(window.location.search);

export default function App() {
  return isBake ? <Bake /> : <SiteRoot />;
}

function initialSite(): Site {
  try {
    const saved = localStorage.getItem("mr-site");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* private mode */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function GithubMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function SiteRoot() {
  const [site, setSite] = useState<Site>(initialSite);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = site;
    try {
      localStorage.setItem("mr-site", site);
    } catch {
      /* private mode */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", site === "dark" ? "#12100e" : "#f6f1e8");
  }, [site]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = favicon;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className={"nav" + (solid ? " solid" : "")}>
        <a href="#top" className="flex items-center gap-2.5" aria-label="Mareader, back to top">
          <img src={icon} alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-[8px]" />
          <span className="text-[16px] font-semibold tracking-[-0.01em]">Mareader</span>
        </a>
        <nav className="flex items-center gap-1.5">
          <a href={GH} className="icon-btn" aria-label="Mareader on GitHub">
            <GithubMark />
          </a>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSite((s) => (s === "dark" ? "light" : "dark"))}
            aria-label={site === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {site === "dark" ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
          </button>
          <a href="#download" className="btn btn-accent btn-sm ml-1.5">
            Download
          </a>
        </nav>
      </header>

      <main id="top">
        <Film site={site} />
        <Details />
        <Get />
      </main>

      <footer className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-8 text-[13.5px] text-[var(--muted)] sm:flex-row">
        <div className="flex items-center gap-2.5">
          <img src={icon} alt="" width={20} height={20} className="h-5 w-5 rounded-[5px]" />
          <span>Mareader · MIT licensed</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={RELEASES} className="hover:text-[var(--ink)]">Releases</a>
          <a href={GH} className="hover:text-[var(--ink)]">Source</a>
        </div>
      </footer>
    </>
  );
}

const DETAILS: [LucideIcon, string, string][] = [
  [StickyNote, "Notes that stay with the book", "Mark a passage, add a thought, and find it again in Notes."],
  [ChartNoAxesColumnIncreasing, "Words above your level", "Shade words past your CEFR level and look them up in place."],
  [ScrollText, "Whole-page AI", "Summarize, translate or simplify a page, right where it sits."],
  [Type, "Every script, every direction", "Vertical Chinese and right-to-left books read the way they were set."],
  [LibraryBig, "A library that shelves itself", "AI proposes shelves for hundreds of books. You approve the plan."],
  [Search, "Search that keeps up", "Find any phrase, washed in place on the page it lives on."],
];

function Details() {
  return (
    <section className="mx-auto max-w-[1080px] px-6 pb-24 pt-28 sm:pt-36">
      <h2 className="serif max-w-[16ch] text-[clamp(30px,4vw,48px)] font-[540] leading-[1.08] tracking-[-0.02em]">And the quiet details.</h2>
      <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {DETAILS.map(([I, title, text]) => (
          <div key={title} className="border-t border-[var(--line)] pt-5">
            <I size={20} strokeWidth={1.8} className="text-[var(--accent)]" aria-hidden />
            <h3 className="mt-3.5 text-[16.5px] font-semibold tracking-[-0.01em]">{title}</h3>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-[var(--muted)]">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Get() {
  return (
    <section id="download" className="mx-auto flex max-w-[760px] scroll-mt-16 flex-col items-center px-6 pb-28 pt-10 text-center">
      <img src={icon} alt="" width={84} height={84} className="h-[84px] w-[84px]" />
      <h2 className="serif mt-7 text-[clamp(32px,4.4vw,54px)] font-[540] leading-[1.06] tracking-[-0.02em]">Free, open source, and yours.</h2>
      <p className="mt-4 max-w-[40ch] text-[17px] leading-[1.55] text-[var(--muted)]">No account, no subscription. Just your books, the way you like to read them.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={RELEASES} className="btn btn-accent">Download for macOS</a>
        <a href={RELEASES} className="btn btn-ghost">Windows</a>
        <a href={RELEASES} className="btn btn-ghost">Linux</a>
      </div>
      <p className="mt-6 max-w-[52ch] text-[13px] leading-[1.6] text-[var(--muted)]">
        The macOS build isn’t notarized yet. If macOS stops it, choose Open Anyway in System Settings › Privacy &amp; Security.
      </p>
    </section>
  );
}
