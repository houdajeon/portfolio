"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = { id: string; href: string; label: string };

/** Desktop menu that highlights the section currently on screen (scrollspy). */
export function SectionNav({ links, label }: { links: NavLink[]; label: string }) {
  // The header lives in the layout, so it stays mounted when you move between pages.
  // Keying the state on the pathname resets the highlight on every page change, and the
  // effect below re-attaches the observer to the sections of the new page.
  const pathname = usePathname();
  const [spy, setSpy] = useState<{ path: string; id: string | null }>({ path: "", id: null });
  const active = spy.path === pathname ? spy.id : null;

  useEffect(() => {
    // "top" is the hero: when it is on screen, no menu item is highlighted.
    const targets = ["top", ...links.map((link) => link.id)]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length < 2) return; // not on the home page

    // A thin band across the middle of the screen: the section crossing it is "current".
    const observer = new IntersectionObserver(
      (entries) =>
        setSpy((previous) => {
          let id = previous.path === pathname ? previous.id : null;
          // A section that leaves the band stops being current, even if no other one
          // enters it (after a jump, or in the Killua scene's intro before About).
          for (const entry of entries) {
            if (!entry.isIntersecting && entry.target.id === id) id = null;
          }
          for (const entry of entries) {
            if (entry.isIntersecting) id = entry.target.id === "top" ? null : entry.target.id;
          }
          return { path: pathname, id };
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [links, pathname]);

  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {links.map((link) => {
          const current = active === link.id;
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                aria-current={current ? "location" : undefined}
                className={`relative rounded-md px-3 py-2 font-mono text-[13px] transition hover:bg-raised hover:text-fg ${
                  current ? "text-fg" : "text-muted"
                }`}
              >
                {link.label.toLowerCase()}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-accent transition-transform duration-300 ${
                    current ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
