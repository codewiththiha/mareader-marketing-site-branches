import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Ban, BookA, ChartNoAxesColumnIncreasing, ChevronDown, ChevronRight, ChevronUp, Columns2, Cpu, Download,
  Eclipse, Ellipsis, Headphones, Highlighter, KeyRound, LayoutGrid, LayoutTemplate, LibraryBig, ListTree, Menu,
  Minus, Moon, Palette, PanelLeft, PanelLeftClose, Pause, Pin, Play, Plus, Search, Server, Settings as Gear,
  SkipBack, SkipForward, Square, StickyNote, Sun, SunMoon, Trash2, Undo2, Volume2, Wind, X, type LucideIcon,
} from "lucide-react";
import { CLASSIC, CUSTOM, LOOKS, hueColour, type LookId } from "./looks";
import openai from "../assets/logos/openai.svg?raw";
import gemini from "../assets/logos/gemini.svg?raw";
import openrouter from "../assets/logos/openrouter.svg?raw";
import ollama from "../assets/logos/ollama.svg?raw";
import lmstudio from "../assets/logos/lm-studio.svg?raw";
import apple from "../assets/logos/apple.svg?raw";

const LOGOS = { openai, gemini, openrouter, ollama, lmstudio, apple };
type LogoName = keyof typeof LOGOS;

const ic = (I: LucideIcon, size = 22, sw = 1.8, style?: CSSProperties) => <I size={size} strokeWidth={sw} style={style} aria-hidden />;

function Logo({ name, size = 22 }: { name: LogoName; size?: number }) {
  const svg = LOGOS[name]
    .replace(/fill="white"/g, 'fill="currentColor"')
    .replace(/width="24" height="24"/, `width="${size}" height="${size}"`);
  return <span style={{ display: "inline-flex", width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

function AiMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="4.5" width="19" height="15" rx="4" />
      <path d="M6.5 16 9.25 8 12 16" />
      <path d="M7.6 13.2h3.3" />
      <path d="M16.5 8v8" />
      <path d="M15 8h3" />
      <path d="M15 16h3" />
    </svg>
  );
}

export function useTicker(on: boolean, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    setN(0);
    const id = window.setInterval(() => setN((v) => v + 1), ms);
    return () => window.clearInterval(id);
  }, [on, ms]);
  return n;
}

/* ------------------------------------------------------------------ title bar */

export function TitleBar({ shown, title, lit }: { shown: boolean; title: string; lit: string | null }) {
  const btn = (x: number, node: ReactNode, id?: string) => (
    <div className={"tb-btn spot" + (id && lit === id ? " lit" : "")} style={{ left: x - 20 }}>
      {node}
    </div>
  );
  return (
    <div className={"tb" + (shown ? " on" : "")}>
      {btn(34, ic(PanelLeft))}
      {btn(88, ic(LibraryBig))}
      {btn(142, ic(BookA))}
      <div className="tb-title">{title}</div>
      {btn(1270, ic(Search))}
      {btn(1324, ic(Palette), "palette")}
      {btn(1378, ic(Menu))}
      {[Minus, Square, X].map((I, i) => (
        <div key={i} className="tb-ctl" style={{ left: 1415 + i * 41 }}>
          {ic(I, i === 1 ? 11 : 13, 2)}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ sidebar */

type Mini = "title" | "toc" | "text" | "chapter";
const THUMBS: Mini[] = ["title", "toc", "text", "chapter", "text", "chapter", "text", "text"];

function rnd(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function MiniPage({ kind, seed }: { kind: Mini; seed: number }) {
  const bars: ReactNode[] = [];
  const line = (x: number, y: number, w: number, o = 0.38, h = 1.5, c = "var(--k)") =>
    bars.push(<rect key={bars.length} x={x} y={y} width={w} height={h} fill={c} opacity={o} />);
  const para = (y0: number, y1: number, s: number) => {
    let y = y0;
    let n = 0;
    while (y < y1) {
      const end = rnd(s + n) > 0.8;
      line(n === 0 ? 20 : 17, y, end ? 40 + rnd(s + n * 3) * 70 : n === 0 ? 117 : 120);
      y += end ? 6.4 : 3.9;
      n++;
    }
  };
  if (kind === "title") {
    for (let i = 0; i < 11; i++) if (![1, 6, 8, 10].includes(i)) line(19, 16 + i * 3.6, 40 + rnd(i) * 60, 0.3, 1.2, "var(--a)");
    line(52, 118, 50, 0.85, 3);
    line(62, 132, 30, 0.8, 2.2);
    line(60, 146, 34, 0.4, 0.8);
    line(66, 158, 22, 0.7, 1.8);
  } else if (kind === "toc") {
    for (let c = 0; c < 3; c++) for (let r = 0; r < 21; r++) if (!(c === 2 && r === 20)) line(52 + c * 18, 12 + r * 2.9 + (c === 2 ? 2.9 : 0), 13, 0.55, 1.1, "var(--lk)");
    line(60, 92, 34, 0.4, 0.7);
    line(64, 104, 26, 0.85, 2.4);
    para(112, 146, seed);
  } else if (kind === "chapter") {
    para(12, 86, seed);
    line(64, 102, 26, 0.85, 2.4);
    para(114, 188, seed + 40);
  } else {
    para(12, 188, seed);
  }
  return (
    <svg width="154" height="198" viewBox="0 0 154 198" aria-hidden>
      {bars}
    </svg>
  );
}

export function Sidebar({ open }: { open: boolean }) {
  const tabs: [string, LucideIcon][] = [["Thumbnails", LayoutGrid], ["Outline", ListTree], ["Notes", StickyNote], ["Library", LibraryBig]];
  return (
    <aside className={"sb" + (open ? " on" : "")}>
      <div className="sb-i" style={{ left: 14 }}>{ic(PanelLeftClose)}</div>
      <div className="sb-i" style={{ left: 68 }}>{ic(Search)}</div>
      <div className="sb-i" style={{ left: 121 }}>{ic(Gear)}</div>
      <div className="sb-i" style={{ left: 314, color: "var(--a)" }}>{ic(Pin)}</div>
      {THUMBS.map((k, i) => {
        const x = i % 2 ? 191 : 23;
        const y = 77 + Math.floor(i / 2) * 237;
        return (
          <div key={i}>
            <div className={"sb-th" + (i === 1 ? " sel" : "")} style={{ left: x, top: y }}>
              <MiniPage kind={k} seed={i * 17} />
            </div>
            <div className={"sb-n" + (i === 1 ? " sel" : "")} style={{ left: x, top: y + 205 }}>
              {i + 1}
            </div>
          </div>
        );
      })}
      <div className="sb-tabs">
        {tabs.map(([name, I], i) => (
          <div key={name} className={"sb-tab" + (i === 0 ? " sel" : "")}>
            {ic(I, 20, 1.8)}
            <span>{name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ appearance popover */

function Fold({ title, summary, open, plus }: { title: string; summary: string; open?: boolean; plus?: boolean }) {
  return (
    <div className="fold">
      <span className="fold-t">{title}</span>
      <span className="fold-s">{summary}</span>
      {plus ? <span className="fold-plus">{ic(Plus, 14, 2)}</span> : null}
      <span className="fold-c">{ic(open ? ChevronUp : ChevronDown, 14, 2)}</span>
    </div>
  );
}

function PresetCard({ id, sel }: { id: LookId; sel: boolean }) {
  const L = LOOKS[id];
  return (
    <div className="pc">
      <div className={"pc-page" + (sel ? " sel" : "")} style={{ background: L.p }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={{ background: L.mode === "Dim" ? "#0d1015" : L.k, width: i === 4 ? "48%" : "100%" }} />
        ))}
      </div>
      <div className={"pc-name" + (sel ? " sel" : "")}>{L.name}</div>
    </div>
  );
}

function Segs<T extends string>({ items, value, cols }: { items: [T, LucideIcon?][]; value: T; cols: number }) {
  return (
    <div className="segs" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {items.map(([name, I]) => (
        <div key={name} className={"seg" + (name === value ? " on" : "")}>
          {I ? ic(I, 13, 2) : null}
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}

function Dial({ name, v, label, dim }: { name: string; v: number; label: string; dim?: boolean }) {
  return (
    <div className="dial" style={{ opacity: dim ? 0.45 : 1 }}>
      <span className="dial-n">{name}</span>
      <span className="dial-t">
        <span className="dial-f" style={{ width: `${v}%` }} />
        <span className="dial-k" style={{ left: `${v}%` }} />
      </span>
      <span className="dial-v">{label}</span>
    </div>
  );
}

function Switch({ on }: { on: boolean }) {
  return (
    <span className={"sw" + (on ? " on" : "")}>
      <i />
    </span>
  );
}

const HUES: [number, string][] = [[34, "Sepia"], [14, "Rose"], [104, "Green"], [160, "Mint"], [200, "Sky"], [240, "Blue"], [290, "Violet"]];
const HUE_STRIP = `linear-gradient(90deg, ${Array.from({ length: 13 }, (_, i) => hueColour(i * 30)).join(", ")})`;

export function Popover({ shown, mode, sel, perPane, lit }: { shown: boolean; mode: "themes" | "split"; sel: LookId; perPane: boolean; lit: string | null }) {
  const L = LOOKS[sel];
  const colourSum = `${L.mode}${L.strength ? ` · ${L.hueName} ${L.strength}%` : ""}`;
  const texSum = L.texture === "None" ? "None" : `Real paper · ${L.texOpacity}%`;
  const grainSum = L.grain === "Off" ? "Off" : `${L.grain} · ${L.grainI}%`;
  return (
    <div className={"pop" + (shown ? " on" : "")}>
      <Fold title="Presets" summary={L.name} open plus />
      <div className="pop-cards">
        {CLASSIC.map((id) => (
          <PresetCard key={id} id={id} sel={sel === id} />
        ))}
      </div>
      <div className="pop-sec">Custom</div>
      <div className="pop-cards">
        {CUSTOM.map((id) => (
          <PresetCard key={id} id={id} sel={sel === id} />
        ))}
      </div>
      {mode === "themes" ? (
        <>
          <Fold title="Mode & colour" summary={colourSum} open />
          <Segs items={[["Light", Sun], ["Dark", Moon], ["Dim", SunMoon], ["Black", Eclipse]]} value={L.mode} cols={4} />
          <div className="dial">
            <span className="dial-n">Hue</span>
            <span className="hue" style={{ background: HUE_STRIP }}>
              <span className="dial-k" style={{ left: `${(L.hue / 359) * 100}%` }} />
            </span>
            <span className="dial-v">{L.hue}°</span>
          </div>
          <div className="swatches">
            {HUES.map(([h, n]) => (
              <span key={n} title={n} className={"swatch" + (Math.abs(h - L.hue) < 8 ? " on" : "")} style={{ background: hueColour(h) }} />
            ))}
          </div>
          <Dial name="Strength" v={L.strength} label={`${L.strength}%`} />
          <Fold title="Page texture" summary={texSum} open />
          <Segs items={[["None"], ["Real paper"], ["Lined"], ["Grid"], ["Dotted"], ["Cross"]]} value={L.texture} cols={3} />
          <Dial name="Opacity" v={L.texOpacity} label={`${L.texOpacity}%`} dim={L.texture === "None"} />
          <Dial name="Scale" v={30} label="110%" dim={L.texture === "None"} />
          <Fold title="Film grain" summary={grainSum} />
        </>
      ) : (
        <>
          <Fold title="Mode & colour" summary={colourSum} />
          <Fold title="Page texture" summary={texSum} />
          <Fold title="Film grain" summary={grainSum} />
          <div className="pop-hr" />
          <div className="pop-sec">Split view</div>
          <div className={"pop-row spot" + (lit === "perpane" ? " lit" : "")}>
            <span>Theme per pane</span>
            <Switch on={perPane} />
          </div>
          <div className="pop-row">
            <span>Texture per pane</span>
            <Switch on={false} />
          </div>
          <div className="pop-note">Film grain stays shared.</div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ AI Dictionary card */

export type Anchor = { x: number; y: number; w: number; h: number };
const CARD_W = 320;
const GAP = 11;
const CARET = 8;
const CORNER = 16;

/** The AI Dictionary card, above its word, its caret on the word's middle. */
export function WordCard({ open, at, roomW }: { open: boolean; at: Anchor | null; roomW: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(372);
  useLayoutEffect(() => {
    if (ref.current) setH(ref.current.offsetHeight);
  }, [at, open]);
  if (!at) return null;
  const mid = at.x + at.w / 2;
  const left = Math.max(8, Math.min(roomW - 8 - CARD_W, mid - CARD_W / 2));
  const top = at.y - GAP - h;
  const cx = Math.max(CORNER, Math.min(CARD_W - CORNER, mid - left));
  const delay = (i: number): CSSProperties => ({ animationDelay: `${120 + i * 110}ms` });
  return (
    <div ref={ref} className={"wc" + (open ? " on" : "")} style={{ left, top, width: CARD_W }}>
      <div className="wc-head">
        <span className="wc-word">acknowledged</span>
        <span className="wc-pos">verb</span>
        <span className="wc-lvl">B1</span>
        <span className="wc-icon" style={{ marginLeft: "auto" }}>{ic(Volume2, 17, 1.8)}</span>
        <span className="wc-icon">{ic(X, 17, 1.8)}</span>
      </div>
      <div key={open ? "o" : "c"} className="wc-body stream">
        <div className="wc-lab" style={delay(0)}>Meaning</div>
        <div className="wc-text" style={delay(1)}>
          Accepted as true or recognized. Here, Austen frames a belief about wealthy bachelors and marriage as unquestioned, with a wry edge.
        </div>
        <div className="wc-lab" style={delay(2)}>Synonyms</div>
        <div className="wc-chips" style={delay(3)}>
          {["recognized", "accepted", "assumed", "understood", "taken for granted"].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="wc-lab" style={delay(4)}>Usages</div>
        <ul className="wc-uses" style={delay(5)}>
          <li>Her contribution was acknowledged in the report.</li>
          <li>He acknowledged that the first plan had failed.</li>
          <li>The report acknowledges the limits of the evidence.</li>
        </ul>
        <div className="wc-foot" style={delay(6)}>
          <span>Assistant-generated sample</span>
          <span className="wc-again">Ask again</span>
        </div>
      </div>
      <svg className="wc-caret" width={CARET * 2 + 2} height={CARET + 2} style={{ left: cx - CARET - 1 }} aria-hidden>
        <path d={`M0 0 L1 0 L${CARET + 1} ${CARET} L${CARET * 2 + 1} 0 L${CARET * 2 + 2} 0 L${CARET * 2 + 2} 1 L0 1 Z`} fill="var(--wc-bg)" />
        <path d={`M1 0.5 L${CARET + 1} ${CARET + 0.5} L${CARET * 2 + 1} 0.5`} fill="var(--wc-bg)" stroke="var(--l)" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ read-aloud player */

export function Player({ shown, t }: { shown: boolean; t: number }) {
  return (
    <div className={"pl" + (shown ? " on" : "")}>
      <span className="pl-b" style={{ left: 14 }}>{ic(SkipBack, 20, 1.8)}</span>
      <span className="pl-play">{ic(Pause, 17, 2.2, { fill: "currentColor" })}</span>
      <span className="pl-b" style={{ left: 101 }}>{ic(SkipForward, 20, 1.8)}</span>
      <span className="pl-track">
        <i style={{ width: `${t}%` }} />
        <b style={{ left: `${t}%` }} />
      </span>
      <span className="pl-b" style={{ left: 250 }}>{ic(ChevronUp, 20, 1.8)}</span>
      <span className="pl-b" style={{ left: 293 }}>{ic(Ellipsis, 20, 1.8)}</span>
      <span className="pl-div" />
      <span className="pl-b" style={{ left: 341 }}>{ic(X, 20, 1.8)}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ settings */

type Page = "keys" | "local" | "voices";

const NAV: [string, [string, ReactNode][]][] = [
  ["Reading", [["Appearance", ic(Palette, 20)], ["Layout", ic(LayoutTemplate, 20)], ["Read aloud", ic(Headphones, 20)]]],
  ["Study", [["Highlights", ic(Highlighter, 20)], ["Vocabulary", ic(ChartNoAxesColumnIncreasing, 20)], ["Dictionary", ic(BookA, 20)], ["AI", <AiMark key="ai" />]]],
  ["App", [["AI models", ic(Cpu, 20)], ["Panes", ic(Columns2, 20)], ["Motion", ic(Wind, 20)]]],
];

function ModelRow({ logo, name, sub, pills }: { logo: LogoName; name: string; sub: string; pills: string[] }) {
  return (
    <div className="st-model">
      <span className="st-logo"><Logo name={logo} size={22} /></span>
      <span className="st-mt">
        <b>{name}</b>
        <small>{sub}</small>
      </span>
      <span className="st-pills">
        {pills.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </span>
      <span className="st-chev">{ic(ChevronDown, 18, 2)}</span>
    </div>
  );
}

const TILES: { logo: LogoName | null; name: string; sub: string; local?: boolean }[] = [
  { logo: "apple", name: "Apple Intelligence", sub: "On this Mac", local: true },
  { logo: "ollama", name: "Ollama", sub: "On this computer", local: true },
  { logo: "lmstudio", name: "LM Studio", sub: "On this computer", local: true },
  { logo: "openai", name: "OpenAI", sub: "API key" },
  { logo: "gemini", name: "Gemini", sub: "API key" },
  { logo: "openrouter", name: "OpenRouter", sub: "Many models" },
  { logo: null, name: "Custom", sub: "Any /v1 address" },
];

type KeyRowState = { id: string; status: string; tone?: "use" | "rest" | "bad" };

/** Requests take turns across usable keys; one rests, one is set aside. */
function keyStates(t: number): { rows: KeyRowState[]; using: number } {
  const p = t % 16;
  const resting = p < 8;
  const using = resting ? p % 2 : (p - 8) % 3;
  const rows: KeyRowState[] = [
    { id: "sk-proj-••••a1F9", status: "Ready" },
    { id: "sk-proj-••••7Qx2", status: "Ready" },
    resting ? { id: "sk-proj-••••Lm3k", status: `Resting, ${(8 - p) * 3} s`, tone: "rest" } : { id: "sk-proj-••••Lm3k", status: "Ready" },
    { id: "sk-proj-••••Zt0p", status: "Set aside: invalid key", tone: "bad" },
  ];
  rows[using] = { ...rows[using], status: "In use", tone: "use" };
  return { rows, using };
}

function AiModels({ local, lit, tick }: { local: boolean; lit: string | null; tick: number }) {
  const { rows, using } = keyStates(tick);
  return (
    <div>
      <div className="st-sec">Models</div>
      <div className="st-card">
        <ModelRow logo="apple" name="Apple Intelligence" sub="On this Mac · ready" pills={["AI Dictionary"]} />
        <ModelRow logo="ollama" name="Ollama · qwen3" sub="3 models on this computer" pills={["Library", "Summarize"]} />
        <ModelRow logo="openai" name="OpenAI" sub="gpt-4.1-mini · 1 at once" pills={["Translate", "+2"]} />
        <div className="st-add">
          {ic(Plus, 16, 2)}
          <span>Add a model</span>
        </div>
        <div className="st-tiles-wrap" style={{ height: local ? 222 : 0 }}>
          <div className="st-tiles">
            {TILES.map((t) => (
              <div key={t.name} className={"st-tile spot" + (t.local && lit === "local" ? " lit" : "")}>
                <span className="st-logo sm">{t.logo ? <Logo name={t.logo} size={18} /> : ic(Server, 18, 1.8)}</span>
                <span className="st-mt">
                  <b>{t.name}</b>
                  <small>{t.sub}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="st-help">Each task asks the model chosen for it in the AI tab. Duplicate a model with another “At once” to give a task its own room.</p>
      <div className="st-sec">Providers</div>
      <div className="st-card">
        <div className="st-model">
          <span className="st-logo"><Logo name="openai" size={22} /></span>
          <span className="st-mt">
            <b>OpenAI</b>
            <small>{rows[2].tone === "rest" ? "2 keys ready" : "3 keys ready"}</small>
          </span>
          <span className="st-chev">{ic(ChevronUp, 18, 2)}</span>
        </div>
        <div className="st-indent">
          <div className="st-row">
            <span>Address</span>
            <span className="st-field">https://api.openai.com/v1/</span>
          </div>
          <div className="st-row">
            <span>API keys</span>
            <span className="st-quiet">With 3 keys, up to 3 at once.</span>
          </div>
          <div className={"st-keys spot" + (lit === "keys" ? " lit" : "")}>
            {rows.map((k, i) => (
              <div key={k.id} className={"st-key" + (i === using ? " use" : "") + (k.tone === "bad" ? " bad" : "") + (k.tone === "rest" ? " rest" : "")}>
                <span className="st-kicon">{ic(KeyRound, 16, 1.8)}</span>
                <span className="st-kid">{k.id}</span>
                <span className="st-kstat">{k.status}</span>
                <span className="st-kbtn">{ic(k.tone === "bad" ? Undo2 : Ban, 16, 1.8)}</span>
                <span className="st-kbtn">{ic(Trash2, 16, 1.8)}</span>
              </div>
            ))}
          </div>
          <div className="st-row last">
            <span className="st-field ph">Paste an API key</span>
            <span className="st-btn">Add</span>
          </div>
        </div>
      </div>
      <p className="st-help">Keys are encrypted on this computer. With several, requests take turns, and a key the provider turns away is set aside.</p>
    </div>
  );
}

function Radio({ on }: { on: boolean }) {
  return <span className={"st-radio" + (on ? " on" : "")} />;
}

function Engine({ name, sub, build, size, dl, ready, picked }: { name: string; sub: string; build?: string; size?: string; dl?: boolean; ready?: boolean; picked: boolean }) {
  const [mb, setMb] = useState(12.4);
  useEffect(() => {
    if (!dl) return;
    setMb(12.4);
    const start = performance.now();
    const id = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - start) / 3400);
      setMb(12.4 + (347.9 - 12.4) * (1 - Math.pow(1 - k, 1.6)));
    }, 90);
    return () => window.clearInterval(id);
  }, [dl]);
  return (
    <div className="st-eng">
      <span className="st-mt">
        <b>{name}</b>
        <small>{sub}</small>
      </span>
      {build ? (
        <span className="st-build">
          {build} {ic(ChevronDown, 16, 2)}
        </span>
      ) : null}
      {size ? <span className="st-size">{dl ? `${mb.toFixed(1)} of ${size}` : size}</span> : null}
      {size ? (
        ready ? (
          <span className="st-manage">
            Manage {ic(ChevronRight, 15, 2)}
          </span>
        ) : (
          <span className="st-dl">{ic(dl ? Pause : Download, 21, 1.9)}</span>
        )
      ) : null}
      {!size || ready ? <Radio on={picked} /> : null}
      {dl ? (
        <span className="st-prog">
          <i className="dl-bar" />
        </span>
      ) : null}
    </div>
  );
}

function ReadAloud({ voice }: { voice: "downloading" | "ready" }) {
  const ready = voice === "ready";
  return (
    <div>
      <div className="st-sec">Engine</div>
      <div className="st-card">
        <Engine name="System voices" sub="Built into your system" picked={!ready} />
        <Engine name="Kokoro" sub="7 languages · 49 voices" build="Full" size="347.9 MB" dl={!ready} ready={ready} picked={ready} />
        <Engine name="Piper" sub="English · 8 voices" size="83.7 MB" picked={false} />
        <Engine name="Kitten" sub="English · 8 voices" build="Mini" size="92.2 MB" picked={false} />
        <Engine name="Phonon" sub="English · 26 voices" size="65.1 MB" picked={false} />
      </div>
      <div className="st-sec">Voice</div>
      <div className="st-card">
        <div className="st-row">
          <span>Voices</span>
          <span className="st-quiet">
            {ready ? "Heart · American English" : "System default"} {ic(ChevronDown, 16, 2)}
          </span>
        </div>
        <div className="st-row last">
          <span>Hear a sample</span>
          <span className="st-btn">
            {ic(Play, 14, 2)} Preview
          </span>
        </div>
      </div>
    </div>
  );
}

export function Settings({ page, lit, voice, active }: { page: Page | null; lit: string | null; voice: "downloading" | "ready"; active: boolean }) {
  const last = useRef<Page>("keys");
  if (page) last.current = page;
  const pg = page ?? last.current;
  const tick = useTicker(active && page === "keys", 950);
  const sel = pg === "voices" ? "Read aloud" : "AI models";
  return (
    <>
      <div className={"st-back" + (page ? " on" : "")} />
      <div className={"st" + (page ? " on" : "")}>
        <nav className="st-nav">
          {NAV.map(([group, items]) => (
            <div key={group}>
              <div className="st-ng">{group}</div>
              {items.map(([name, icon]) => (
                <div key={name} className={"st-ni" + (name === sel ? " sel" : "")}>
                  {icon}
                  <span>{name}</span>
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="st-main">
          <div className="st-head">
            <span>{sel}</span>
            {ic(X, 22, 1.8)}
          </div>
          <div className="st-clip">
            <div className="st-scroll" style={{ transform: `translateY(${pg === "keys" ? -236 : 0}px)` }}>
              {pg === "voices" ? <ReadAloud voice={voice} /> : <AiModels local={pg === "local"} lit={lit} tick={tick} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

