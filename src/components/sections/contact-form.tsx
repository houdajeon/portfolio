"use client";

import { useState, type FormEvent } from "react";
import type { Messages } from "@/i18n/dictionaries";
import { buttonStyles } from "@/components/ui/button-styles";
import { Rich } from "@/components/ui/rich";

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <form onSubmit={onSubmit} className="rounded-xl border border-line bg-surface p-6">
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
          className={`${buttonStyles.primary} disabled:opacity-60`}
        >
          {status === "sending" ? labels.sending : labels.send}
        </button>
        <p role="status" className={`text-sm ${shown?.color ?? ""}`}>
          {shown && <Rich text={shown.text} />}
        </p>
      </div>
    </form>
  );
}
