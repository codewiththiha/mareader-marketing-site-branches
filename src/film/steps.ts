import { DEFAULT_STATE, WIN_H, WIN_W, type WinState } from "../app/Window";
import { resolve, type LookRef, type Site } from "../app/looks";

export type R = { x: number; y: number; w: number; h: number };

export interface Step {
  id: string;
  title: string;
  body: string;
  hero?: boolean;
  /** What the camera frames, in window units; `focusP` on tall screens. */
  focus: R;
  focusP?: R;
  side?: "left" | "right";
  sideP?: "top" | "bottom";
  /** The window runs under the caption, so the caption sits on the lens. */
  zoom?: boolean;
  /** Which look the lens shows under the caption. */
  lens?: "pane" | "chrome";
  maxS?: number;
  base?: Partial<WinState>;
  frames: Partial<WinState>[];
  ms?: number | number[];
  loop?: boolean;
  loopFrom?: number;
  /** Frames whose lens image is another frame's (they differ only in focus). */
  bakeAs?: number[];
  weight?: number;
}

const all = (l: LookRef): Partial<WinState> => ({ looks: [l, l, l, l], chrome: l, preset: l });
const FULL: R = { x: 0, y: 0, w: WIN_W, h: WIN_H };

export const STEPS: Step[] = [
  {
    id: "hero",
    hero: true,
    weight: 0.7,
    title: "Shaped around the way you read.",
    body: "A calm reader for PDFs and EPUBs. Your colours on every page, four books at once, and AI and voices that stay on your computer.",
    focus: FULL,
    base: { sidebar: true },
    frames: [{}],
  },
  {
    id: "themes",
    title: "Limitless themes, even on a PDF.",
    body: "Pick a mode, turn the hue, lay on real paper or grain, then save it as your own. Every PDF and EPUB follows.",
    focus: { x: 968, y: 22, w: 568, h: 640 },
    focusP: { x: 1150, y: 50, w: 372, h: 600 },
    zoom: true,
    base: { titlebar: true },
    frames: [
      { ...all("home"), lit: "palette" },
      { ...all("home"), popover: "themes" },
      { ...all("sepia"), popover: "themes" },
      { ...all("night"), popover: "themes" },
      { ...all("green"), popover: "themes" },
      { ...all("rose"), popover: "themes" },
    ],
    ms: [1100, 1900, 1700, 1700, 1700, 1700],
    loop: true,
    loopFrom: 1,
    bakeAs: [1, 1, 2, 3, 4, 5],
  },
  {
    id: "panes",
    title: "Four books, one desk.",
    body: "Open up to four panes side by side: a novel and its notes, a text and its translation.",
    focus: FULL,
    frames: [{ panes: 1 }, { panes: 2 }, { panes: 3 }, { panes: 4 }],
    ms: [650, 1050, 1050],
  },
  {
    id: "together",
    title: "Change the look, every pane follows.",
    body: "Scanned PDF, reflowing EPUB, vertical Chinese. One theme, consistent across all four.",
    focus: FULL,
    base: { panes: 4 },
    frames: [all("home"), all("night"), all("green"), all("black"), all("sepia")],
    ms: 1700,
    loop: true,
  },
  {
    id: "perpane",
    title: "Or give each pane its own.",
    body: "Turn on Theme per pane, and every book keeps a colour and texture of its own.",
    focus: FULL,
    base: { panes: 4, titlebar: true, popover: "split" },
    frames: [
      { lit: "perpane" },
      { perPane: true, lit: "perpane" },
      { perPane: true, looks: ["home", "night", "home", "home"] },
      { perPane: true, looks: ["home", "night", "green", "home"] },
      { perPane: true, looks: ["home", "night", "green", "rose"] },
      { perPane: true, looks: ["sepia", "night", "green", "rose"] },
    ],
    ms: [1100, 950, 850, 850, 850],
  },
  {
    id: "word",
    title: "Ask about a word without losing your place.",
    body: "The AI Dictionary explains it in this very sentence, with synonyms and usage, right on the page.",
    focus: { x: 884, y: 226, w: 640, h: 524 },
    focusP: { x: 896, y: 232, w: 372, h: 470 },
    zoom: true,
    frames: [{}, { marks: true }, { marks: true, card: true }],
    ms: [450, 1150],
    bakeAs: [2, 2, 2],
  },
  {
    id: "keys",
    title: "Bring your own keys.",
    body: "Add as many as you like. Requests take turns, a rate-limited key rests, and a rejected one is set aside.",
    focus: { x: 534, y: 268, w: 712, h: 540 },
    focusP: { x: 544, y: 440, w: 700, h: 360 },
    zoom: true,
    lens: "chrome",
    base: { settings: "keys", lit: "keys" },
    frames: [{}],
  },
  {
    id: "local",
    title: "Or keep the AI on your computer.",
    body: "Run models locally with Ollama or LM Studio, or use Apple Intelligence on Apple silicon. No key needed.",
    focus: { x: 534, y: 150, w: 712, h: 500 },
    focusP: { x: 544, y: 392, w: 700, h: 262 },
    zoom: true,
    lens: "chrome",
    base: { settings: "local", lit: "local" },
    frames: [{}],
  },
  {
    id: "listen",
    title: "Rest your eyes. Keep reading.",
    body: "Read aloud follows every phrase on the page, and turns it for you.",
    focus: { x: 560, y: 196, w: 912, h: 716 },
    focusP: { x: 862, y: 196, w: 600, h: 420 },
    zoom: true,
    base: { pride: "ch6", titlebar: true, player: true },
    frames: [{}],
  },
  {
    id: "voices",
    title: "Voices that never leave your computer.",
    body: "Download Kokoro, Piper, Kitten or Phonon once. They read offline: no cloud, no account.",
    focus: { x: 534, y: 130, w: 712, h: 420 },
    focusP: { x: 544, y: 150, w: 700, h: 380 },
    zoom: true,
    lens: "chrome",
    base: { settings: "voices" },
    frames: [{ voice: "downloading" }, { voice: "ready" }],
    ms: [3900],
    bakeAs: [1, 1],
  },
];

export function stateOf(i: number, f: number): WinState {
  const s = STEPS[i];
  return { ...DEFAULT_STATE, ...(s.base ?? {}), ...(s.frames[f] ?? {}) } as WinState;
}

function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** The lens image for a frame: named by what the window shows. */
export function bakeKey(i: number, f: number, site: Site) {
  const step = STEPS[i];
  const bf = step.bakeAs?.[f] ?? f;
  const st = stateOf(i, bf);
  const resolved = {
    ...st,
    looks: st.looks.map((l) => resolve(l, site)),
    chrome: resolve(st.chrome, site),
    preset: resolve(st.preset, site),
    lit: null,
  };
  return `${step.id}-${hash(JSON.stringify(resolved))}`;
}

export function bakeList() {
  const out = new Map<string, { key: string; step: number; frame: number; site: Site }>();
  STEPS.forEach((s, i) => {
    if (!s.zoom) return;
    s.frames.forEach((_, f) => {
      for (const site of ["light", "dark"] as Site[]) {
        const key = bakeKey(i, f, site);
        if (!out.has(key)) out.set(key, { key, step: i, frame: s.bakeAs?.[f] ?? f, site });
      }
    });
  });
  return [...out.values()];
}
