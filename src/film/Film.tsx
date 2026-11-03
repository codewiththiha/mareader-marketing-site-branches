import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Window, WIN_H, WIN_W } from "../app/Window";
import { look as lookOf, rgba, type Site } from "../app/looks";
import { STEPS, bakeKey, stateOf, type R, type Step } from "./steps";

const BLURS = import.meta.glob("../blur/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const blurUrl = (key: string): string | undefined => BLURS[`../blur/${key}.webp`];

const NAV = 60;
const STEP_VH = 92;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

type Side = "left" | "right" | "top" | "bottom";
interface Layout {
  landscape: boolean;
  side: Side;
  text: R;
  fa: R;
  focus: R;
  maxS: number;
}

/** Where the caption goes and where the camera frames its focus. */
function layoutOf(s: Step, vw: number, vh: number): Layout {
  const landscape = vw >= 820 && vw / vh >= 1.12;
  if (s.hero) {
    // The window rises from below the fold under the headline.
    const top = NAV + (landscape ? clamp(vh * 0.055, 18, 60) : 12);
    const th = landscape ? clamp(vh * 0.4, 300, 390) : clamp(vh * 0.47, 330, 420);
    const pad = landscape ? 48 : 14;
    const sc = Math.min((vw - pad * 2) / WIN_W, landscape ? 0.82 : 1);
    const w = WIN_W * sc;
    return {
      landscape,
      side: "top",
      text: { x: 0, y: top, w: vw, h: th },
      fa: { x: (vw - w) / 2, y: top + th + 6, w, h: WIN_H * sc },
      focus: s.focus,
      maxS: 1,
    };
  }
  const focus = (!landscape && s.focusP) || s.focus;
  if (landscape) {
    const side = s.side ?? (focus.x + focus.w / 2 >= WIN_W / 2 ? "left" : "right");
    const padX = clamp(vw * 0.055, 28, 104);
    const tw = clamp(vw * 0.33, 330, 520);
    const gap = clamp(vw * 0.035, 28, 72);
    const top = NAV + 28;
    const faW = vw - padX - tw - gap - padX * 0.5;
    const text: R = side === "left" ? { x: padX, y: 0, w: tw, h: vh } : { x: vw - padX - tw, y: 0, w: tw, h: vh };
    const fa: R = side === "left" ? { x: padX + tw + gap, y: top, w: faW, h: vh - top - 36 } : { x: padX * 0.5, y: top, w: faW, h: vh - top - 36 };
    return { landscape, side, text, fa, focus, maxS: s.maxS ?? 1.6 };
  }
  const th = clamp(vh * 0.31, 196, 300);
  const maxS = s.maxS ?? 1.2;
  const make = (side: "top" | "bottom"): Layout => {
    const text: R = side === "bottom" ? { x: 22, y: vh - th, w: vw - 44, h: th - 20 } : { x: 22, y: NAV + 8, w: vw - 44, h: th };
    const fa: R = side === "bottom" ? { x: 12, y: NAV + 10, w: vw - 24, h: vh - th - NAV - 14 } : { x: 12, y: NAV + 8 + th, w: vw - 24, h: vh - NAV - 8 - th - 16 };
    return { landscape, side, text, fa, focus, maxS };
  };
  // A window edge must never run through a caption: cover it fully or stay clear of it.
  const crosses = (L: Layout) => {
    if (!s.zoom) return false;
    const sc = Math.min(L.fa.w / focus.w, L.fa.h / focus.h, maxS);
    const top = L.fa.y + L.fa.h / 2 - (focus.y + focus.h / 2) * sc;
    const bottom = top + WIN_H * sc;
    const t0 = L.text.y;
    const t1 = L.text.y + L.text.h;
    return !((top <= t0 && bottom >= t1) || bottom <= t0 + 12 || top >= t1 - 12);
  };
  const first = s.sideP ?? (focus.y + focus.h / 2 > WIN_H * 0.66 ? "top" : "bottom");
  const L1 = make(first);
  if (!crosses(L1)) return L1;
  const L2 = make(first === "top" ? "bottom" : "top");
  return crosses(L2) ? L1 : L2;
}

type V5 = [number, number, number, number, number];
function camOf(L: Layout): V5 {
  const s = Math.min(L.fa.w / L.focus.w, L.fa.h / L.focus.h, L.maxS);
  return [L.focus.x + L.focus.w / 2, L.focus.y + L.focus.h / 2, Math.log(s), L.fa.x + L.fa.w / 2, L.fa.y + L.fa.h / 2];
}

/**
 * A critically damped spring on (centre, log-scale, screen anchor): the
 * focus point stays put while the zoom eases, and a new target mid-move
 * carries the velocity instead of restarting the curve.
 */
class Camera {
  x: V5;
  v: V5 = [0, 0, 0, 0, 0];
  t: V5;
  raf = 0;
  last = 0;
  omega = 6.4;
  constructor(init: V5, private els: () => HTMLElement[]) {
    this.x = [...init] as V5;
    this.t = [...init] as V5;
  }
  to(t: V5, snap: boolean) {
    this.t = [...t] as V5;
    if (snap) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.x = [...t] as V5;
      this.v = [0, 0, 0, 0, 0];
      this.apply();
      this.will(false);
      return;
    }
    if (!this.raf) {
      this.last = performance.now();
      this.will(true);
      this.raf = requestAnimationFrame(this.tick);
    }
  }
  tick = (now: number) => {
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    const w = this.omega;
    const e = Math.exp(-w * dt);
    let moving = false;
    for (let k = 0; k < 5; k++) {
      const x0 = this.x[k] - this.t[k];
      const v0 = this.v[k];
      const c = v0 + w * x0;
      const x = (x0 + c * dt) * e;
      const v = (v0 - w * c * dt) * e;
      this.x[k] = this.t[k] + x;
      this.v[k] = v;
      const tol = k === 2 ? 0.0006 : 0.3;
      if (Math.abs(x) > tol || Math.abs(v) > tol * 3) moving = true;
    }
    if (!moving) this.x = [...this.t] as V5;
    this.apply();
    if (moving) this.raf = requestAnimationFrame(this.tick);
    else {
      this.raf = 0;
      this.will(false);
    }
  };
  apply() {
    const [cx, cy, z, ax, ay] = this.x;
    const s = Math.exp(z);
    const tr = `translate3d(${(ax - cx * s).toFixed(2)}px, ${(ay - cy * s).toFixed(2)}px, 0) scale(${s.toFixed(5)})`;
    for (const el of this.els()) el.style.transform = tr;
  }
  will(on: boolean) {
    for (const el of this.els()) el.style.willChange = on ? "transform" : "auto";
  }
}

function maskFor(side: Side, L: Layout, vw: number, vh: number) {
  if (side === "left") {
    const a = L.text.x + L.text.w * 0.92;
    const b = L.fa.x + 18;
    return `linear-gradient(90deg, #000 0px, #000 ${a}px, transparent ${b}px)`;
  }
  if (side === "right") {
    const a = vw - (L.text.x + L.text.w * 0.08);
    const b = vw - (L.fa.x + L.fa.w) + 18;
    return `linear-gradient(270deg, #000 0px, #000 ${a}px, transparent ${b}px)`;
  }
  if (side === "bottom") {
    const a = vh - L.text.y - 6;
    return `linear-gradient(0deg, #000 0px, #000 ${a}px, transparent ${a + 40}px)`;
  }
  const a = L.text.y + L.text.h + 6;
  return `linear-gradient(180deg, #000 0px, #000 ${a}px, transparent ${a + 40}px)`;
}

/** Keeps the last few lens images so a change crossfades instead of popping. */
function useRecent(url: string | undefined, n = 3) {
  const ref = useRef<string[]>([]);
  if (url && ref.current[ref.current.length - 1] !== url) {
    ref.current = [...ref.current.filter((u) => u !== url), url].slice(-n);
  }
  return ref.current;
}

const GH = "https://github.com/codewiththiha/mareader2";
const RELEASES = `${GH}/releases/latest`;

function Caption({ step, L, on, ink }: { step: Step; L: Layout; on: boolean; ink: { i: string; m: string } }) {
  const words = step.title.split(" ");
  const Tag = step.hero ? "h1" : "h2";
  const cls = ["cap", on ? "on" : "", L.landscape ? "land" : "port", step.hero ? "hero" : "", L.side].join(" ");
  return (
    <div className={cls} style={{ left: L.text.x, top: L.text.y, width: L.text.w, height: L.text.h, color: ink.i }} aria-hidden={!on}>
      <Tag className="cap-t">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="w" style={{ "--d": `${i * 38}ms` } as React.CSSProperties}>
              {w}
            </span>{" "}
          </Fragment>
        ))}
      </Tag>
      <p className="cap-b b" style={{ color: ink.m }}>
        {step.body}
      </p>
      {step.hero ? (
        <div className="cap-cta b">
          <a className="btn btn-accent" href={RELEASES} tabIndex={on ? 0 : -1}>
            Download, it's free
          </a>
          <a className="btn btn-ghost" href={GH} tabIndex={on ? 0 : -1}>
            View on GitHub
          </a>
        </div>
      ) : null}
    </div>
  );
}

const SIDES: Side[] = ["left", "right", "top", "bottom"];

export function Film({ site }: { site: Site }) {
  const filmRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const lensCams = useRef<(HTMLDivElement | null)[]>([]);
  const camera = useRef<Camera | null>(null);
  const snapNext = useRef(true);

  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [active, setActive] = useState(0);
  const [tl, setTl] = useState({ step: 0, frame: 0 });
  const reduced = useMemo(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false, []);

  const weights = STEPS.map((s) => s.weight ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const bounds = weights.reduce<number[]>((acc, w) => [...acc, acc[acc.length - 1] + w / total], [0]);

  // Stage size (100svh), measured so mobile toolbars don't shake the camera.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      snapNext.current = true;
      setVp({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll picks the step.
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = filmRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = el.offsetHeight - window.innerHeight;
      const p = clamp(-r.top / Math.max(1, span), 0, 0.99999);
      let i = 0;
      while (i < STEPS.length - 1 && p >= bounds[i + 1]) i++;
      setActive(i);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each step plays like a recording: frames advance on their own.
  useEffect(() => {
    const s = STEPS[active];
    setTl({ step: active, frame: 0 });
    let f = 0;
    let t = 0;
    const next = () => {
      const last = f >= s.frames.length - 1;
      if (last && !s.loop) return;
      const dur = Array.isArray(s.ms) ? s.ms[f] ?? 1700 : s.ms ?? 1700;
      t = window.setTimeout(() => {
        f = last ? s.loopFrom ?? 0 : f + 1;
        setTl({ step: active, frame: f });
        next();
      }, dur * (reduced ? 1.6 : 1));
    };
    next();
    return () => window.clearTimeout(t);
  }, [active, reduced]);

  const layouts = useMemo(() => STEPS.map((s) => layoutOf(s, vp.w, vp.h)), [vp]);
  const L = layouts[active];
  const step = STEPS[active];
  const frame = tl.step === active ? tl.frame : 0;
  const st = stateOf(active, frame);

  // The camera.
  useLayoutEffect(() => {
    const target = camOf(L);
    if (!camera.current) {
      camera.current = new Camera(target, () => [camRef.current, ...lensCams.current].filter(Boolean) as HTMLElement[]);
      camera.current.to(target, true);
      snapNext.current = false;
      return;
    }
    camera.current.to(target, snapNext.current || reduced);
    snapNext.current = false;
  }, [L, reduced]);

  // The lens: a pre-rendered lens blur of exactly this frame, moved by the same camera.
  const lensLook = step.lens === "chrome" ? lookOf(st.chrome, site) : lookOf(st.looks[0], site);
  const url = step.zoom ? blurUrl(bakeKey(active, frame, site)) : undefined;
  const recent = useRecent(url);
  const tone = rgba(lensLook.p, url ? (lensLook.dark ? 0.34 : 0.26) : 0.9);
  const ink = step.zoom
    ? lensLook.dark
      ? { i: "#f6efe4", m: "rgba(246,239,228,.80)" }
      : { i: "#1c1610", m: "rgba(28,22,16,.74)" }
    : { i: "var(--ink)", m: "var(--muted)" };

  const lastLayout = useRef<Record<string, Layout>>({});
  lastLayout.current[L.side] = L;

  return (
    <section ref={filmRef} id="tour" className="film" data-film data-bounds={JSON.stringify(bounds)} style={{ height: `${total * STEP_VH + 100}vh` }}>
      <div ref={stageRef} className="stage">
        <div ref={camRef} className="cam" aria-hidden>
          <div className="win-frame">
            <Window st={st} site={site} active />
          </div>
        </div>

        {SIDES.map((side, i) => {
          const fit = (side === "left" || side === "right") === L.landscape;
          if (!fit) return null;
          const show = !!step.zoom && L.side === side;
          const LL = show ? L : lastLayout.current[side] ?? L;
          const mask = maskFor(side, LL, vp.w, vp.h);
          return (
            <div key={side} className="lens" style={{ opacity: show ? 1 : 0, WebkitMaskImage: mask, maskImage: mask }} aria-hidden>
              <div className="lens-base" />
              <div ref={(el) => void (lensCams.current[i] = el)} className="lens-cam">
                {recent.map((u) => (
                  <img key={u} src={u} alt="" className="lens-img" style={{ opacity: u === url ? 1 : 0 }} />
                ))}
              </div>
              <div className="lens-tone" style={{ background: tone }} />
              <div className="lens-grain" />
            </div>
          );
        })}

        {STEPS.map((s, i) => (
          <Caption key={s.id} step={s} L={layouts[i]} on={i === active} ink={i === active ? ink : { i: "var(--ink)", m: "var(--muted)" }} />
        ))}
      </div>
    </section>
  );
}
