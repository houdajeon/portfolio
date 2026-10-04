import { useEffect, useEffectEvent } from "react";

/**
 * Calls `update` now, then again whenever the page scrolls, the window resizes or the page
 * changes height (new route, filtered grid, opened <details>), at most once per frame
 * however fast those events arrive.
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
    return () => {
      pageSize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
}
