import { useEffect, useEffectEvent } from "react";

/** Fired by StoryScene after it moves content inside its pinned panels. */
export const SCENE_CHANGE = "scenechange";

/**
 * Calls `update` now, then again whenever the page scrolls, the window resizes, the page
 * changes height (new route, filtered grid, opened <details>) or the Killua scene moves
 * its panel content (SCENE_CHANGE), at most once per frame however fast those events arrive.
 */
export function useScrollFrame(update: () => void) {
  const onFrame = useEffectEvent(update);

  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      onFrame();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };
    const pageSize = new ResizeObserver(schedule);

    run();
    pageSize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener(SCENE_CHANGE, schedule);
    return () => {
      pageSize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(SCENE_CHANGE, schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
}
