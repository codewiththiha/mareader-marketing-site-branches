import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { look as lookOf, resolve, vars, type Look, type LookRef, type Site } from "./looks";
import { Alice, CH6_CHUNKS, Ch6Spread, Chamber, OpeningSpread, Page12, PH, PW, Raven } from "./Pages";
import { Player, Popover, Settings, Sidebar, TitleBar, WordCard, useTicker, type Anchor } from "./Chrome";

export interface WinState {
  panes: 1 | 2 | 3 | 4;
  looks: [LookRef, LookRef, LookRef, LookRef];
  chrome: LookRef;
  pride: "opening" | "ch6";
  sidebar: boolean;
  titlebar: boolean;
  popover: null | "themes" | "split";
  preset: LookRef;
  perPane: boolean;
  marks: boolean;
  card: boolean;
  settings: null | "keys" | "local" | "voices";
  player: boolean;
  lit: string | null;
  voice: "downloading" | "ready";
}

export const DEFAULT_STATE: WinState = {
  panes: 1,
  looks: ["home", "home", "home", "home"],
  chrome: "home",
  pride: "opening",
  sidebar: false,
  titlebar: false,
  popover: null,
  preset: "home",
  perPane: false,
  marks: false,
  card: false,
  settings: null,
  player: false,
  lit: null,
  voice: "downloading",
};

export const WIN_W = 1536;
export const WIN_H = 960;
const SIDEBAR_W = 368;

type R = { x: number; y: number; w: number; h: number };

/** Pane rectangles for 1–4 panes; absent panes collapse at the edge they grow from. */
function paneRects(n: number, side: number): R[] {
  const x0 = side;
  const W = WIN_W - side;
  const H = WIN_H;
  const half = Math.round(W / 2);
  const rw = W - half;
  const P: R = n === 1 ? { x: x0, y: 0, w: W, h: H } : { x: x0, y: 0, w: half, h: H };
  const A: R = n === 1 ? { x: x0 + W, y: 0, w: 0, h: H } : n === 2 ? { x: x0 + half, y: 0, w: rw, h: H } : { x: x0 + half, y: 0, w: rw, h: H / 2 };
  const V: R = n <= 2 ? { x: x0 + half, y: H, w: rw, h: 0 } : n === 3 ? { x: x0 + half, y: H / 2, w: rw, h: H / 2 } : { x: x0 + half, y: H / 2, w: rw / 2, h: H / 2 };
  const C: R = n <= 3 ? { x: x0 + W, y: H / 2, w: 0, h: H / 2 } : { x: x0 + half + rw / 2, y: H / 2, w: rw / 2, h: H / 2 };
  return [P, A, V, C];
}

function Pane(props: { r: R; lk: Look; on: boolean; title: string; count: string; low: boolean; divL?: boolean; divT?: boolean; children: ReactNode; paneRef?: React.Ref<HTMLDivElement> }) {
  const { r, lk, on, title, count, low, divL, divT, children, paneRef } = props;
  return (
    <div ref={paneRef} className="pane look" data-dark={lk.dark} style={{ ...vars(lk), left: r.x, top: r.y, width: r.w, height: r.h, opacity: on ? 1 : 0 }}>
      <div className="tex" />
      {children}
      <div className="pane-title" style={{ top: low ? 70 : 9 }}>
        {title}
      </div>
      <div className="pane-count">{count}</div>
      {divL ? <div className="pane-dl" /> : null}
      {divT ? <div className="pane-dt" /> : null}
    </div>
  );
}

export function Window({ st, site, active, bake = false }: { st: WinState; site: Site; active: boolean; bake?: boolean }) {
  const chrome = lookOf(st.chrome, site);
  const looks = st.looks.map((l) => lookOf(l, site));
  const rects = paneRects(st.panes, st.sidebar ? SIDEBAR_W : 0);
  const P = rects[0];

  // Pride and Prejudice: a spread when wide, page 12 when narrow.
  const wide = P.w > 1000;
  const sO = Math.min(P.w / (PW * 2), P.h / PH);
  const oX = (P.w - PW * 2 * sO) / 2;
  const oY = (P.h - PH * sO) / 2;
  const s6 = P.w / (PW * 2);
  const s1 = Math.min(P.h / PH, P.w / PW);
  const x1 = (P.w - PW * s1) / 2;
  const y1 = (P.h - PH * s1) / 2;

  // Read aloud moves phrase by phrase.
  const tick = useTicker(active && st.player, 1400);
  const chunk = bake ? 6 : 3 + (tick % (CH6_CHUNKS - 3));
  const track = bake ? 34 : Math.min(96, 30 + tick * 2.2);

  // The selected word, measured in pane units, so the card's caret lands on it.
  const paneEl = useRef<HTMLDivElement>(null);
  const selRef = useRef<HTMLSpanElement>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  useLayoutEffect(() => {
    if (!st.card) return;
    const measure = () => {
      const p = paneEl.current;
      const s = selRef.current;
      if (!p || !s) return;
      const pr = p.getBoundingClientRect();
      const sr = s.getBoundingClientRect();
      const k = pr.width / P.w;
      if (!k) return;
      setAnchor({ x: (sr.left - pr.left) / k, y: (sr.top - pr.top) / k, w: sr.width / k, h: sr.height / k });
    };
    measure();
    const t = window.setTimeout(measure, 900);
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [st.card, P.w, P.h]);

  const prideCount = wide ? (st.pride === "ch6" ? "14 / 234" : "2 / 234") : "12 / 234";
  const low = st.titlebar && st.panes === 1 && !st.popover;

  return (
    <div className={"mr-win look" + (bake ? " bake" : "")} data-dark={chrome.dark} style={{ ...vars(chrome), width: WIN_W, height: WIN_H }}>
      <Pane r={P} lk={looks[0]} on title="Pride and Prejudice, by Jane Austen" count={prideCount} low={low} paneRef={paneEl}>
        <div className="pv" style={{ opacity: wide && st.pride === "opening" ? 1 : 0, transform: `translate(${oX}px, ${oY}px) scale(${sO})` }}>
          <OpeningSpread marks={st.marks} selRef={selRef} />
        </div>
        <div className="pv" style={{ opacity: wide && st.pride === "ch6" ? 1 : 0, transform: `translate(0px, 2px) scale(${s6})` }}>
          <Ch6Spread chunk={st.player ? chunk : -1} />
        </div>
        <div className="pv" style={{ opacity: wide ? 0 : 1, transform: `translate(${x1}px, ${y1}px) scale(${s1})` }}>
          <Page12 />
        </div>
        <WordCard open={st.card && !!anchor} at={anchor} roomW={P.w} />
      </Pane>
      <Pane r={rects[1]} lk={looks[1]} on={st.panes >= 2} title="CHAPTER I. Down the Rabbit-Hole" count="42 / 498" low={false} divL>
        <Alice />
      </Pane>
      <Pane r={rects[2]} lk={looks[2]} on={st.panes >= 3} title="COMMENT ON THE POEM." count="29 / 190" low={false} divL divT>
        <Raven w={rects[2].w} />
      </Pane>
      <Pane r={rects[3]} lk={looks[3]} on={st.panes >= 4} title="紅樓夢" count="87 / 7386" low={false} divL divT>
        <Chamber />
      </Pane>
      <Sidebar open={st.sidebar} />
      <TitleBar shown={st.titlebar} title="Pride and Prejudice, by Jane Austen" lit={st.lit} />
      <Popover shown={st.popover !== null} mode={st.popover ?? "themes"} sel={resolve(st.preset, site)} perPane={st.perPane} lit={st.lit} />
      <Player shown={st.player} t={track} />
      <Settings page={st.settings} lit={st.lit} voice={st.voice} active={active} />
    </div>
  );
}
