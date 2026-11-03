import type { CSSProperties } from "react";

/**
 * Reading looks, as in Mareader's appearance crate: a base mode, a tint
 * (hue + strength), a page texture and film grain. Colours for Parchment are
 * sampled from the app's own screenshots; the rest follow the same rules.
 */
export type LookId =
  | "parchment"
  | "dusk"
  | "sepia"
  | "night"
  | "green"
  | "black"
  | "rose"
  | "violet"
  | "cinema";
export type LookRef = LookId | "home";
export type Site = "light" | "dark";

export interface Look {
  id: LookId;
  name: string;
  dark: boolean;
  mode: "Light" | "Dark" | "Dim" | "Black";
  hue: number;
  hueName: string;
  strength: number;
  texture: "None" | "Real paper";
  texOpacity: number;
  grain: "Off" | "Static" | "Animated";
  grainI: number;
  /** paper, book ink, ui ink, muted, surface, line, accent, accent-soft, ink on accent, card */
  p: string;
  k: string;
  u: string;
  m: string;
  s: string;
  l: string;
  a: string;
  as: string;
  ai: string;
  c: string;
  /** read-aloud wash, pdf link, vocabulary mark, selected mark, thumbnail page */
  hl: string;
  lk: string;
  mk: string;
  mks: string;
  th: string;
  /** page texture opacity 0..1 */
  tx: number;
}

export const LOOKS: Record<LookId, Look> = {
  parchment: {
    id: "parchment", name: "Parchment", dark: false, mode: "Light", hue: 40, hueName: "Sepia", strength: 56,
    texture: "Real paper", texOpacity: 85, grain: "Static", grainI: 18,
    p: "#e6d9c3", k: "#1d1a16", u: "#2b2419", m: "#6a5a46", s: "#ecd8bc", l: "#d8c2a4", a: "#7a4e06",
    as: "#f2c48b", ai: "#fff4e2", c: "#f2e1c8", hl: "#cdb58b", lk: "#3b2fbf", mk: "#e8796b", mks: "#c9535b",
    th: "#f3e2cb", tx: 1,
  },
  dusk: {
    id: "dusk", name: "Dusk", dark: true, mode: "Dark", hue: 34, hueName: "Sepia", strength: 46,
    texture: "Real paper", texOpacity: 60, grain: "Off", grainI: 0,
    p: "#1d1814", k: "#e3d8c8", u: "#e8ddcf", m: "#a49583", s: "#241e19", l: "#3a3028", a: "#e3a55b",
    as: "#4a341b", ai: "#1d1206", c: "#2a231d", hl: "#5b4628", lk: "#a5adff", mk: "#7e3b33", mks: "#a5463f",
    th: "#2b241e", tx: 0.55,
  },
  sepia: {
    id: "sepia", name: "Sepia", dark: false, mode: "Light", hue: 34, hueName: "Sepia", strength: 46,
    texture: "None", texOpacity: 0, grain: "Off", grainI: 0,
    p: "#f4e7d4", k: "#211c16", u: "#2a231b", m: "#6f604f", s: "#eadbc6", l: "#dbc9b1", a: "#8b5a1b",
    as: "#f3d5ae", ai: "#fff6ea", c: "#f8eddd", hl: "#e0cba4", lk: "#3b35c4", mk: "#ec8a7a", mks: "#cd5f5f",
    th: "#f8eedf", tx: 0,
  },
  night: {
    id: "night", name: "Night", dark: true, mode: "Dark", hue: 110, hueName: "Green", strength: 36,
    texture: "None", texOpacity: 0, grain: "Off", grainI: 0,
    p: "#141913", k: "#dce3d4", u: "#e0e6d9", m: "#96a28c", s: "#171c15", l: "#2b3327", a: "#a8cf86",
    as: "#29391f", ai: "#10180b", c: "#1b2119", hl: "#33452a", lk: "#a9b6ff", mk: "#6a3a31", mks: "#8e463b",
    th: "#1d241b", tx: 0,
  },
  green: {
    id: "green", name: "Green", dark: false, mode: "Light", hue: 104, hueName: "Green", strength: 40,
    texture: "None", texOpacity: 0, grain: "Off", grainI: 0,
    p: "#e2eddb", k: "#19211a", u: "#1f2a1f", m: "#5a6b55", s: "#d7e5ce", l: "#c4d6b9", a: "#3e6d2b",
    as: "#c9e4b3", ai: "#f4fbee", c: "#ebf4e5", hl: "#c6dab0", lk: "#2f4fc4", mk: "#e8907f", mks: "#c95f5d",
    th: "#eef6e9", tx: 0,
  },
  black: {
    id: "black", name: "Black", dark: true, mode: "Black", hue: 34, hueName: "Sepia", strength: 0,
    texture: "None", texOpacity: 0, grain: "Off", grainI: 0,
    p: "#000000", k: "#d4d4d8", u: "#d4d4d8", m: "#8a8a93", s: "#000000", l: "#27272a", a: "#60a5fa",
    as: "#0c1e33", ai: "#04101f", c: "#0b0b0d", hl: "#1d3049", lk: "#8fb8ff", mk: "#592b29", mks: "#7d3532",
    th: "#111113", tx: 0,
  },
  rose: {
    id: "rose", name: "Rose", dark: false, mode: "Light", hue: 14, hueName: "Rose", strength: 50,
    texture: "Real paper", texOpacity: 40, grain: "Off", grainI: 0,
    p: "#f5e3df", k: "#261a19", u: "#2d1f1d", m: "#775f5b", s: "#eed7d2", l: "#dfc4be", a: "#9e3f3a",
    as: "#f2cbc3", ai: "#fff3f1", c: "#faecea", hl: "#eac5bd", lk: "#3d36c0", mk: "#e48a7c", mks: "#c65a5a",
    th: "#fbeeeb", tx: 0.35,
  },
  violet: {
    id: "violet", name: "Violet", dark: false, mode: "Light", hue: 290, hueName: "Violet", strength: 44,
    texture: "None", texOpacity: 0, grain: "Off", grainI: 0,
    p: "#ebe5f3", k: "#1f1a28", u: "#261f31", m: "#665b75", s: "#e1d8ee", l: "#cec3df", a: "#6a48a8",
    as: "#dbcdf3", ai: "#faf6ff", c: "#f2edf8", hl: "#d6c8ea", lk: "#3a3ac6", mk: "#e48d86", mks: "#c45f63",
    th: "#f4f0fa", tx: 0,
  },
  cinema: {
    id: "cinema", name: "Cinema", dark: true, mode: "Dim", hue: 220, hueName: "Sky", strength: 30,
    texture: "None", texOpacity: 0, grain: "Animated", grainI: 30,
    p: "#1c2129", k: "#0e1217", u: "#c3c9d2", m: "#8b9099", s: "#20252d", l: "#2f353e", a: "#7ea2d6",
    as: "#242d3a", ai: "#0b111a", c: "#232932", hl: "#2c3a4f", lk: "#9fb6ff", mk: "#4a2e2c", mks: "#613937",
    th: "#262c35", tx: 0,
  },
};

export const CLASSIC: LookId[] = ["sepia", "green", "night", "parchment", "cinema"];
export const CUSTOM: LookId[] = ["dusk", "rose", "violet"];

export const homeOf = (site: Site): LookId => (site === "dark" ? "dusk" : "parchment");
export const resolve = (ref: LookRef, site: Site): LookId => (ref === "home" ? homeOf(site) : ref);
export const look = (ref: LookRef, site: Site): Look => LOOKS[resolve(ref, site)];

export function vars(l: Look): CSSProperties {
  return {
    "--p": l.p, "--k": l.k, "--u": l.u, "--m": l.m, "--s": l.s, "--l": l.l, "--a": l.a, "--as": l.as,
    "--ai": l.ai, "--c": l.c, "--hl": l.hl, "--lk": l.lk, "--mk": l.mk, "--mks": l.mks, "--th": l.th,
    "--tx": String(l.tx),
  } as CSSProperties;
}

/** The hue swatch colour the app draws: HSL(h, 60%, 55%). */
export const hueColour = (h: number) => `hsl(${h} 60% 55%)`;

export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
