import type { CSSProperties } from "react";
import { Rich } from "@/components/ui/rich";
import { BackLink, facts, ProjectLinks, type HeroProps } from "./shared";

// The board behind the title, like a Bomberman level: # wall, b brick, . floor, B the bomb,
// f floor that the blast reaches. Every 3 s the fuse burns down and the blast lights the cross.
const BOARD = [
  "###############",
  "#.b...bf..b.b.#",
  "#.#b#.#f#.#b#.#",
  "#b.b.ffBff.b..#",
  "#.#.#b#f#.#.#b#",
  "#..b.b.f..b...#",
  "###############",
];

/** A 16 × 16 pixel bomb: body, highlight, fuse and spark, drawn from one grid of letters. */
const BOMB = (() => {
  const pixels: { x: number; y: number; c: string }[] = [];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      if ((x - 6.5) ** 2 + (y - 10) ** 2 <= 30) {
        const shine = (x - 4.5) ** 2 + (y - 8) ** 2 <= 2.5;
        pixels.push({ x, y, c: shine ? "#b9a3ff" : "#16132a" });
      }
    }
  }
  [
    [8, 4],
    [9, 3],
    [10, 2],
  ].forEach(([x, y]) => pixels.push({ x, y, c: "#eceaf4" }));
  return pixels;
})();
const SPARK = [
  [11, 1, "#fbcfe8"],
  [11, 0, "#f472b6"],
  [12, 1, "#f472b6"],
  [10, 1, "#fbcfe8"],
  [11, 2, "#f472b6"],
] as const;

function Heart() {
  return (
    <svg viewBox="0 0 7 6" className="gm-heart" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" fill="#f472b6" />
      <path d="M1 1h1v1H1z" fill="#fdf2f8" />
    </svg>
  );
}

export function GameHero(props: HeroProps) {
  const { project, copy, locale, dict } = props;
  const t = dict.caseStudy.vibes.game;
  const { category, team } = facts(props);
  return (
    <header className="gm-hero">
      <div className="page-wrap">
        <BackLink locale={locale} label={dict.caseStudy.back} />

        <div className="gm-hud" aria-hidden="true">
          <span>
            1P <Heart />
            <Heart />
            <Heart />
          </span>
          <span>
            {t.stage} {String(project.order).padStart(2, "0")}
          </span>
          <span>60 FPS</span>
          <span>2–4 {t.players}</span>
        </div>

        <div className="gm-stage">
          <div className="gm-text">
            <p className="gm-kicker">
              {category} · <Rich text={team} />
            </p>
            <h1 className="gm-title">{copy.title}</h1>
            <p className="gm-start" aria-hidden="true">
              ▶ {t.pressStart}
            </p>

            <div className="gm-dialog">
              <p>
                <Rich text={copy.summary} />
              </p>
            </div>
          </div>
          <div className="gm-board" aria-hidden="true">
            {BOARD.map((row, y) =>
              [...row].map((tile, x) => {
                const blast = tile === "f" || tile === "B";
                // The blast spreads from the bomb: tiles further away light up a little later.
                const far = Math.abs(x - 7) + Math.abs(y - 3);
                return (
                  <span
                    key={`${x}-${y}`}
                    className={`gm-tile gm-${tile === "#" ? "wall" : tile === "b" ? "brick" : "floor"} ${
                      (x + y) % 2 ? "gm-odd" : ""
                    }`}
                  >
                    {blast && (
                      <span className="gm-flame" style={{ "--far": far } as CSSProperties} />
                    )}
                    {tile === "B" && (
                      <svg viewBox="0 0 16 16" className="gm-bomb" shapeRendering="crispEdges">
                        {BOMB.map(({ x: px, y: py, c }) => (
                          <rect key={`${px}-${py}`} x={px} y={py} width="1" height="1" fill={c} />
                        ))}
                        <g className="gm-spark">
                          {SPARK.map(([px, py, c]) => (
                            <rect key={`${px}-${py}`} x={px} y={py} width="1" height="1" fill={c} />
                          ))}
                        </g>
                      </svg>
                    )}
                  </span>
                );
              }),
            )}
          </div>
        </div>

        <div className="gm-items">
          <p className="gm-label">{t.items}</p>
          <ul>
            {project.stack.map((item) => (
              <li key={item}>
                <Rich text={item} />
              </li>
            ))}
          </ul>
        </div>
        <ProjectLinks project={project} dict={dict} />
      </div>
    </header>
  );
}
