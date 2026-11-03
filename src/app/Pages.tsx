import { Fragment, type Ref } from "react";
import { ALICE, CH1, CHAMBER, GUTENBERG, P12, P13A, P13B, P14, RAVEN, rich, type Line } from "./texts";

/** A US Letter PDF page, in points. Pages are drawn at this size and scaled. */
export const PW = 612;
export const PH = 792;

const center = (top: number, size: number, text: string, weight = 700, lh = size * 1.25) => (
  <div style={{ position: "absolute", left: 0, width: PW, top, textAlign: "center", fontWeight: weight, fontSize: size, lineHeight: `${lh}px` }}>
    {text}
  </div>
);
const rule = (top: number) => (
  <div style={{ position: "absolute", left: 229, width: 154, top, height: 0.9, background: "currentColor", opacity: 0.42 }} />
);

function Toc() {
  const col = (from: number, to: number, left: number, top: number) => (
    <div style={{ position: "absolute", left, top, fontSize: 11.4, lineHeight: "13.8px" }}>
      {Array.from({ length: to - from + 1 }, (_, i) => (
        <div key={i} className="toc">Chapter {from + i}</div>
      ))}
    </div>
  );
  return (
    <>
      {col(1, 21, 216, 93)}
      {col(22, 42, 280, 93)}
      {col(43, 61, 345, 106.8)}
    </>
  );
}

/** Pages 1–2: the Gutenberg title page, then contents and Chapter 1. */
export function OpeningSpread({ marks, selRef }: { marks: boolean; selRef?: Ref<HTMLSpanElement> }) {
  const counter = { n: 0 };
  return (
    <div className="pdf" style={{ position: "absolute", left: 0, top: 0, width: PW * 2, height: PH }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH }}>
        <div className="pdf-mono" style={{ position: "absolute", left: 80, top: 97, fontSize: 10.8, lineHeight: "12.6px", whiteSpace: "pre" }}>
          {GUTENBERG}
        </div>
        {center(498, 23, "PRIDE AND PREJUDICE")}
        {center(569, 15.6, "By Jane Austen")}
        {rule(638)}
        {center(670, 12.6, "Contents")}
      </div>
      <div style={{ position: "absolute", left: PW, top: 0, width: PW, height: PH }}>
        <Toc />
        {rule(427)}
        {center(485, 18, "Chapter 1")}
        <div className="pdf-col" style={{ left: 85, top: 520, width: 444, fontSize: 11.4, lineHeight: "13.6px" }}>
          {CH1.map((t, i) => (
            <p key={i} style={{ marginBottom: 9.4 }}>
              {rich(t, { marks, selRef, counter })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Page 12, as it sits in a narrow pane. */
export function Page12() {
  return (
    <div className="pdf" style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH }}>
      <div className="pdf-col" style={{ left: 92, top: 82, width: 429 }}>
        {P12.map((t, i) => (
          <p key={i}>{rich(t)}</p>
        ))}
      </div>
    </div>
  );
}

/** Pages 13–14, read aloud phrase by phrase on the right page. */
export function Ch6Spread({ chunk }: { chunk: number }) {
  let ci = 0;
  return (
    <div className="pdf" style={{ position: "absolute", left: 0, top: 0, width: PW * 2, height: PH }}>
      <div className="pdf-col" style={{ left: 92, top: 82, width: 429 }}>
        {P13A.map((t, i) => (
          <p key={i}>{rich(t)}</p>
        ))}
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, lineHeight: "20px", margin: "34px 0 16px" }}>Chapter 6</div>
        {P13B.map((t, i) => (
          <p key={i}>{rich(t)}</p>
        ))}
      </div>
      <div className="pdf-col" style={{ left: PW + 92, top: 82, width: 429 }}>
        {P14.map((p, i) =>
          typeof p === "string" ? (
            <p key={i}>{rich(p)}</p>
          ) : (
            <p key={i}>
              {p.map((c, j) => {
                const idx = ci++;
                const lead = c.startsWith(" ");
                return (
                  <Fragment key={j}>
                    {lead ? " " : null}
                    <span className={"ch" + (idx === chunk ? " on" : "")}>{rich(lead ? c.slice(1) : c)}</span>
                  </Fragment>
                );
              })}
            </p>
          ),
        )}
      </div>
    </div>
  );
}

export const CH6_CHUNKS = P14.reduce<number>((n, p) => n + (typeof p === "string" ? 0 : p.length), 0);

const lines = (ls: Line[]) =>
  ls.map((l, i) => (
    <span key={i} className={"jl" + (l.e ? " e" : "")} style={l.i ? { textIndent: 16 } : undefined}>
      {l.t}
    </span>
  ));

/** Alice's Adventures in Wonderland, a two-page spread in Literata. */
export function Alice() {
  return (
    <div className="epub" style={{ position: "absolute", left: 0, top: 0, width: 768, fontSize: 17, lineHeight: "27.7px" }}>
      <div style={{ position: "absolute", left: 63, top: 59, width: 258 }}>{lines(ALICE[0])}</div>
      <div style={{ position: "absolute", left: 447, top: 59, width: 258 }}>{lines(ALICE[1])}</div>
    </div>
  );
}

/** The Raven's afterword, centred in its pane. */
export function Raven({ w }: { w: number }) {
  return (
    <div className="epub pv-x" style={{ position: "absolute", left: (w - 305) / 2, top: 0, width: 305 }}>
      <div style={{ position: "absolute", top: 188, width: 305, textAlign: "center", fontWeight: 700, fontSize: 26.5, lineHeight: "32px", letterSpacing: "0.01em" }}>
        COMMENT ON THE
        <br />
        POEM.
      </div>
      <div style={{ position: "absolute", top: 272, width: 305, fontSize: 17, lineHeight: "27.7px" }}>{lines(RAVEN)}</div>
    </div>
  );
}

/** Dream of the Red Chamber, vertical and right to left. */
export function Chamber() {
  const page = (cols: string[], right: number) => (
    <div className="cjk" style={{ position: "absolute", top: 105, right, height: 304, fontSize: 15.8, lineHeight: "26.6px" }}>
      {cols.map((c, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {c}
        </div>
      ))}
    </div>
  );
  return (
    <>
      {page(CHAMBER.slice(0, 6), 26)}
      {page(CHAMBER.slice(6, 12), 220)}
    </>
  );
}
