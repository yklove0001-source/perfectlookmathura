/**
 * Appointment enquiry → WhatsApp message.
 * Nothing is sent to or stored on any server: the visitor's own WhatsApp opens
 * with the message pre-filled, and they choose whether to send it.
 */
import { whatsappLink } from "./site";

export type Enquiry = {
  name: string;
  phone: string;
  service: string;
  date: string; // yyyy-mm-dd or ""
  time: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export const timeSlots = ["Any time", "Morning", "Afternoon", "Evening"] as const;

/** Accepts "98765 43210", "+91 98765-43210", "098765 43210" → "+91 98765 43210" (or null if invalid). */
export function normalizeIndianMobile(input: string) {
  let d = input.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (!/^[6-9]\d{9}$/.test(d)) return null;
  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

export function validateEnquiry(e: Enquiry, today?: string): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = e.name.trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 60) errors.name = "Please use a shorter name (60 characters max).";
  if (!e.phone.trim()) errors.phone = "Please enter your mobile number.";
  else if (!normalizeIndianMobile(e.phone)) errors.phone = "Please enter a valid 10-digit Indian mobile number.";
  if (!e.service) errors.service = "Please choose a service.";
  if (e.date && today && e.date < today) errors.date = "Please choose today or a future date.";
  if (e.message.length > 500) errors.message = "Please keep your message under 500 characters.";
  return errors;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[m - 1]} ${y}`;
}

export function buildEnquiryMessage(e: Enquiry) {
  const lines = [
    "Hello Perfect Look Hair Wig House, I would like to book a consultation.",
    "",
    `Name: ${e.name.trim()}`,
    `Phone: ${normalizeIndianMobile(e.phone) ?? e.phone.trim()}`,
    `Service: ${e.service}`,
  ];
  if (e.date) lines.push(`Preferred date: ${formatDate(e.date)}${e.time && e.time !== "Any time" ? ` (${e.time.toLowerCase()})` : ""}`);
  else if (e.time && e.time !== "Any time") lines.push(`Preferred time: ${e.time}`);
  if (e.message.trim()) lines.push(`Message: ${e.message.trim()}`);
  return lines.join("\n");
}

export function enquiryWhatsappLink(e: Enquiry) {
  return whatsappLink(buildEnquiryMessage(e));
}
