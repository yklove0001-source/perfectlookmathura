"use client";

import { useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { business, services, telLink } from "@/lib/site";
import {
  enquiryWhatsappLink,
  timeSlots,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from "@/lib/enquiry";

const serviceOptions = [...services.map((s) => s.title), "Not sure yet — need advice"];
const empty: Enquiry = { name: "", phone: "", service: "", date: "", time: "Any time", message: "" };

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Browser-only values read safely (server renders without them, no mismatch)
const subscribeUrl = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
const noopSubscribe = () => () => {};

const inputCls =
  "peer w-full min-w-0 border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ivory placeholder:text-mist/50 transition-colors duration-300 focus:border-gold focus:outline-none focus:ring-0 aria-[invalid=true]:border-red-400/70";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      <label htmlFor={id} className="text-[0.62rem] uppercase tracking-[0.28em] text-mist">
        {label} {optional && <span className="normal-case tracking-normal text-mist/60">(optional)</span>}
      </label>
      {children}
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-2 min-h-5 text-xs text-red-300">
        {error}
      </p>
    </div>
  );
}

/**
 * Appointment enquiry. On submit the visitor's WhatsApp opens with a ready
 * message to the studio — they review it and tap Send. No data is stored here.
 */
export function EnquiryForm() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const form = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Enquiry>(empty);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [sentLink, setSentLink] = useState<string | null>(null);

  const today = useSyncExternalStore(noopSubscribe, localToday, () => undefined);
  // Coming from a service page ("/?service=hair-wig#book") pre-selects that service
  const search = useSyncExternalStore(
    subscribeUrl,
    () => window.location.search,
    () => "",
  );
  const prefill = services.find((x) => x.slug === new URLSearchParams(search).get("service"))?.title ?? "";
  const current: Enquiry = { ...values, service: values.service || prefill };

  const set = (k: keyof Enquiry) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const a11y = (k: keyof Enquiry) => ({
    id: id(k),
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": `${id(k)}-error`,
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateEnquiry(current, today);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Enquiry)[])[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const link = enquiryWhatsappLink(current);
    window.open(link, "_blank", "noopener,noreferrer");
    setSentLink(link);
  };

  if (sentLink) {
    return (
      <div role="status" className="flex h-full flex-col items-start justify-center gap-6 py-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
          <WhatsAppIcon className="h-6 w-6" />
        </span>
        <h3 className="font-display text-title text-ivory">Almost done — just tap Send in WhatsApp.</h3>
        <p className="max-w-md leading-7 text-mist">
          We&apos;ve prepared your message to {business.name}. Send it from WhatsApp and we&apos;ll reply to
          confirm your consultation.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-[0.72rem] uppercase tracking-[0.22em]">
          <a
            href={sentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline pb-1 text-gold"
          >
            WhatsApp didn&apos;t open? Tap here
          </a>
          <button type="button" onClick={() => setSentLink(null)} className="link-underline pb-1 text-ivory">
            Edit details
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={form} noValidate onSubmit={onSubmit} aria-labelledby={id("title")} className="flex flex-col">
      <p className="eyebrow">Appointment enquiry</p>
      <h3 id={id("title")} className="mt-4 font-display text-title text-ivory">
        Book your private consultation
      </h3>

      <div className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        <Field id={id("name")} label="Your name" error={errors.name}>
          <input
            {...a11y("name")}
            type="text"
            autoComplete="name"
            required
            maxLength={60}
            value={values.name}
            onChange={set("name")}
            className={inputCls}
            placeholder="Full name"
          />
        </Field>
        <Field id={id("phone")} label="Mobile number" error={errors.phone}>
          <input
            {...a11y("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={set("phone")}
            className={inputCls}
            placeholder="98765 43210"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id={id("service")} label="Service" error={errors.service}>
            <div className="relative">
              <select
                {...a11y("service")}
                required
                value={current.service}
                onChange={set("service")}
                className={`${inputCls} cursor-pointer appearance-none pr-8 ${current.service ? "" : "text-mist/50"}`}
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s} className="bg-charcoal text-ivory">
                    {s}
                  </option>
                ))}
              </select>
              <Icon
                name="arrow"
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-gold"
              />
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-x-6 min-[400px]:grid-cols-2 sm:col-span-2 sm:gap-x-8 [&>*]:min-w-0">
          <Field id={id("date")} label="Preferred date" optional error={errors.date}>
            <input
              {...a11y("date")}
              type="date"
              min={today}
              value={values.date}
              onChange={set("date")}
              className={`${inputCls} [color-scheme:dark]`}
            />
          </Field>
          <Field id={id("time")} label="Time" optional>
            <div className="relative">
              <select
                {...a11y("time")}
                value={values.time}
                onChange={set("time")}
                className={`${inputCls} cursor-pointer appearance-none pr-8`}
              >
                {timeSlots.map((t) => (
                  <option key={t} value={t} className="bg-charcoal text-ivory">
                    {t}
                  </option>
                ))}
              </select>
              <Icon
                name="arrow"
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-gold"
              />
            </div>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id={id("message")} label="Anything we should know?" optional error={errors.message}>
            <textarea
              {...a11y("message")}
              rows={3}
              maxLength={500}
              value={values.message}
              onChange={set("message")}
              className={`${inputCls} resize-none`}
              placeholder="e.g. hair thinning at the crown, looking for a natural hairline"
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-5">
        <button
          type="submit"
          className="inline-flex min-h-13 w-full items-center justify-center gap-3 bg-gold px-5 py-3 text-center text-[0.74rem] font-medium uppercase tracking-[0.16em] sm:w-auto sm:whitespace-nowrap sm:px-8 sm:text-[0.78rem] sm:tracking-[0.22em] text-ink transition-colors duration-500 hover:bg-gold-soft"
        >
          <WhatsAppIcon className="h-4 w-4" /> Send enquiry on WhatsApp
        </button>
        <a
          href={telLink}
          className="link-underline w-fit pb-1 text-[0.72rem] uppercase tracking-[0.22em] text-mist hover:text-ivory"
        >
          Prefer to call? {business.phoneDisplay}
        </a>
      </div>
      <p className="mt-6 text-xs leading-6 text-mist/80">
        Your details are not stored on this website. They go straight into a WhatsApp message that you review
        and send yourself.
      </p>
    </form>
  );
}
