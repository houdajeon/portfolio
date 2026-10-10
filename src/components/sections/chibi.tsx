import type { CSSProperties } from "react";

/**
 * rest: the default (blinks and bobs; dozes off in the dark theme) · awake: the visitor is
 * in the form · wave: Send is hovered or focused · cheer: the message was sent.
 */
export type ChibiMood = "rest" | "awake" | "wave" | "cheer";

/** Where each sparkle flies when a message is sent (px). */
const STARS = [
  [-60, -40],
  [-30, -72],
  [22, -80],
  [62, -44],
  [76, 0],
  [-76, 4],
];
/** The three Zz of the night pose: offset (px) and size. */
const ZS = [
  [0, 0, 13],
  [9, -6, 16],
  [18, -12, 20],
];

/**
 * A small drawing of Houda (burgundy hijab, round glasses) peeking over the contact form.
 * Every part that moves has its own group (eyes, mouth, arm) and each mood is a set of CSS
 * animations (chibi-* in globals.css). Decorative: hidden from screen readers.
 */
export function Chibi({ mood }: { mood: ChibiMood }) {
  return (
    <div aria-hidden="true" data-mood={mood} className="chibi">
      <span className="chibi-moon" />
      <svg viewBox="0 0 120 150" className="block size-full overflow-visible">
        <g className="chibi-all">
          <path
            d="M60 14C85 14 101 32 101 58C101 76 97 90 103 106L106 150H14L17 106C23 90 19 76 19 58C19 32 35 14 60 14Z"
            fill="#5e1629"
          />
          <path d="M22 116C28 106 42 101 60 101C78 101 92 106 98 116L106 150H14Z" fill="#ddd4c5" />
          <path d="M51 101L60 125L69 101Z" fill="#bdd3ea" />
          <path
            d="M50 101L43 119L57 134M70 101L77 119L63 134"
            fill="none"
            stroke="#b6aa96"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M30 92C36 104 50 110 56 124C59 132 56 143 53 150H42C45 140 44 128 36 118C30 110 27 101 30 92Z"
            fill="#7a1f36"
          />
          <path
            d="M34 98C40 106 49 112 53 122"
            fill="none"
            stroke="#9b3352"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <ellipse cx="60" cy="65" rx="25" ry="26" fill="#f2cfb8" />
          <path
            fillRule="evenodd"
            d="M60 18C86 18 97 38 97 60C97 82 84 96 60 97C36 96 23 82 23 60C23 38 34 18 60 18ZM60 40C75 40 84 50 84 64C84 80 73 90 60 90C47 90 36 80 36 64C36 50 45 40 60 40Z"
            fill="#7a1f36"
          />
          <path
            d="M38 50C44 41 76 41 82 50"
            fill="none"
            stroke="#9b3352"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".9"
          />
          <path
            d="M30 40C34 30 44 23 56 21"
            fill="none"
            stroke="#9b3352"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity=".7"
          />
          <path
            d="M45.5 55Q50.5 52.6 55 54.6M65 54.6Q69.5 52.6 74.5 55"
            fill="none"
            stroke="#4a3040"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <g className="chibi-eyes">
            <ellipse cx="51" cy="66" rx="4.3" ry="5.4" fill="#2a1d2f" />
            <ellipse cx="69" cy="66" rx="4.3" ry="5.4" fill="#2a1d2f" />
            <circle cx="52.6" cy="64" r="1.5" fill="#ffffff" />
            <circle cx="70.6" cy="64" r="1.5" fill="#ffffff" />
            <circle cx="49.8" cy="68.4" r=".7" fill="#ffffff" />
            <circle cx="67.8" cy="68.4" r=".7" fill="#ffffff" />
          </g>
          <path
            className="chibi-closed"
            d="M46.5 67Q51 70.5 55.5 67M64.5 67Q69 70.5 73.5 67"
            fill="none"
            stroke="#2a1d2f"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <g fill="rgba(255,255,255,.14)" stroke="#3b2f45" strokeWidth="1.5">
            <circle cx="51" cy="66" r="8.2" />
            <circle cx="69" cy="66" r="8.2" />
          </g>
          <path d="M59.2 65.2Q60 64.2 60.8 65.2" fill="none" stroke="#3b2f45" strokeWidth="1.5" />
          <ellipse cx="43.5" cy="76" rx="4" ry="2.2" fill="#f29bb2" opacity=".55" />
          <ellipse cx="76.5" cy="76" rx="4" ry="2.2" fill="#f29bb2" opacity=".55" />
          <path
            className="chibi-mouth"
            d="M56.5 79Q60 82 63.5 79"
            fill="none"
            stroke="#9b3a52"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="chibi-open-mouth"
            d="M56 78.5Q60 78 64 78.5Q63 84.5 60 84.5Q57 84.5 56 78.5Z"
            fill="#9b3a52"
          />
          <g className="chibi-arm">
            <rect
              x="89"
              y="88"
              width="11"
              height="32"
              rx="5.5"
              fill="#ddd4c5"
              stroke="#b6aa96"
              strokeWidth="1"
            />
            <circle cx="94.5" cy="86" r="6" fill="#f2cfb8" />
          </g>
        </g>
      </svg>
      <span className="chibi-stars">
        {STARS.map(([dx, dy], i) => (
          <span
            key={i}
            style={{ "--i": i, "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}
          />
        ))}
      </span>
      <span className="chibi-z">
        {ZS.map(([x, y, size], i) => (
          <span key={i} style={{ "--i": i, left: x, top: y, fontSize: size } as CSSProperties}>
            {i === 2 ? "Z" : "z"}
          </span>
        ))}
      </span>
    </div>
  );
}
