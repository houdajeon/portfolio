import { Fragment, type CSSProperties } from "react";

/**
 * A heading whose words rise one after another from behind an invisible edge when its
 * <Reveal> block scrolls into view (word-mask, word-rise in globals.css). Without
 * JavaScript the words are simply in place.
 */
export function RiseWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word-mask">
            <span className="word-rise" style={{ "--i": i } as CSSProperties}>
              {word}
            </span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}
