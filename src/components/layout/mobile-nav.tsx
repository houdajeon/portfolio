"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { Close, Menu } from "@/components/ui/icons";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  openLabel,
  closeLabel,
  navLabel,
}: {
  links: NavLink[];
  openLabel: string;
  closeLabel: string;
  navLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className={buttonStyles.icon}
      >
        {open ? <Close className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <nav
          id="mobile-nav"
          aria-label={navLabel}
          className="absolute inset-x-0 top-full border-b border-line bg-bg/95 backdrop-blur"
        >
          <ul className="page-wrap flex flex-col py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/60 py-3 font-mono text-sm text-muted last:border-0 hover:text-fg"
                >
                  <span className="text-accent-text">./</span>
                  {link.label.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
