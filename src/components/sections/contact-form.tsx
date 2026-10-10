"use client";

import { useEffect, useState, type CSSProperties, type FocusEvent, type FormEvent } from "react";
import type { Messages } from "@/i18n/dictionaries";
import { buttonStyles } from "@/components/ui/button-styles";
import { Rich } from "@/components/ui/rich";
import { Petal, seeded } from "@/components/garden/flower";
import type { PetalColor } from "@/components/garden/defs";
import { Chibi, type ChibiMood } from "./chibi";

/** Petals thrown out of the button when a message is sent: direction, distance, spin. */
const random = seeded(3);
const BURST = Array.from({ length: 16 }, (_, i) => {
  const angle = -Math.PI / 2 + (random() - 0.5) * 2.2;
  const distance = 70 + random() * 100;
  return {
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance - 30),
    spin: Math.round(-300 + random() * 600),
    color: (["pink", "violet", "plum"] as PetalColor[])[i % 3],
  };
});

type Status = "idle" | "sending" | "success" | "error" | "unconfigured";

const field =
  "mt-1.5 w-full rounded-md border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none";
const labelClass = "font-mono text-xs text-muted";

// GitHub Pages has no server, so the browser posts straight to a form service
// (Web3Forms), which forwards the message by email. The access key is public by design.
const ENDPOINT = "https://api.web3forms.com/submit";

export function ContactForm({
  accessKey,
  labels,
}: {
  accessKey: string | null;
  labels: Messages["contact"]["form"];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [bursts, setBursts] = useState(0); // each send replays the petal burst

  // The chibi's mood follows the visitor: pointer or focus in the form wakes her, Send
  // makes her wave, a sent message makes her jump for a moment.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onSend, setOnSend] = useState(false);
  const [cheering, setCheering] = useState(false);
  const mood: ChibiMood = cheering
    ? "cheer"
    : onSend
      ? "wave"
      : hovered || focused
        ? "awake"
        : "rest";

  useEffect(() => {
    if (!cheering) return;
    const timer = setTimeout(() => setCheering(false), 1600);
    return () => clearTimeout(timer);
  }, [cheering]);

  function onBlur(event: FocusEvent<HTMLFormElement>) {
    // Focus moving between two fields of the form does not count as leaving it.
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBursts((n) => n + 1);
    if (!accessKey) {
      setStatus("unconfigured");
      return;
    }
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...Object.fromEntries(new FormData(form)),
          access_key: accessKey,
          subject: "New message from your portfolio",
        }),
      });
      const result = (await response.json()) as { success?: boolean };
      if (response.ok && result.success) {
        setStatus("success");
        setCheering(true);
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const feedback: Partial<Record<Status, { text: string; color: string }>> = {
    success: { text: labels.success, color: "text-ok" },
    error: { text: labels.error, color: "text-accent-text" },
    unconfigured: { text: labels.notConfigured, color: "text-muted" },
  };
  const shown = feedback[status];

  return (
    <div
      className="relative"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Chibi mood={mood} />
      <form
        onSubmit={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={onBlur}
        className="relative rounded-xl border border-line bg-surface p-6"
      >
        <h3 className="font-bold stretch-semi">{labels.title}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className={labelClass}>
              {labels.name}
            </label>
            <input id="cf-name" name="name" required autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="cf-email" className={labelClass}>
              {labels.email}
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={field}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="cf-message" className={labelClass}>
            {labels.message}
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            minLength={10}
            className={`${field} resize-y`}
          />
        </div>
        {/* Honeypot: invisible to people, bots fill it in and the service drops the message. */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            onPointerEnter={() => setOnSend(true)}
            onPointerLeave={() => setOnSend(false)}
            onFocus={() => setOnSend(true)}
            onBlur={() => setOnSend(false)}
            className={`${buttonStyles.primary} relative disabled:opacity-60`}
          >
            {status === "sending" ? labels.sending : labels.send}
            {bursts > 0 && (
              <span key={bursts} aria-hidden="true" className="petal-burst">
                {BURST.map((petal, i) => (
                  <span
                    key={i}
                    style={
                      {
                        "--i": i,
                        "--dx": `${petal.dx}px`,
                        "--dy": `${petal.dy}px`,
                        "--spin": `${petal.spin}deg`,
                      } as CSSProperties
                    }
                  >
                    <Petal color={petal.color} />
                  </span>
                ))}
              </span>
            )}
          </button>
          <p role="status" className={`text-sm ${shown?.color ?? ""}`}>
            {shown && <Rich text={shown.text} />}
          </p>
        </div>
      </form>
    </div>
  );
}
