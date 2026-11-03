import { useEffect } from "react";
import { Window } from "./app/Window";
import { bakeList, stateOf } from "./film/steps";

/**
 * Renders one frame of the window, settled, for the lens-blur bake.
 * `?bakelist` publishes every frame the lens needs; `?bake=KEY` draws one.
 */
export function Bake() {
  const params = new URLSearchParams(location.search);
  const list = bakeList();
  const item = list.find((x) => x.key === params.get("bake"));

  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
    (window as unknown as { __BAKE__: unknown }).__BAKE__ = list;
    const done = () => window.setTimeout(() => (document.body.dataset.ready = "1"), 700);
    if (document.fonts?.ready) document.fonts.ready.then(done);
    else done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!item) return null;
  document.documentElement.dataset.theme = item.site;
  return (
    <div id="bake-root" style={{ position: "absolute", left: 0, top: 0, width: 1536, height: 960, borderRadius: 14, overflow: "hidden" }}>
      <Window st={stateOf(item.step, item.frame)} site={item.site} active={false} bake />
    </div>
  );
}
