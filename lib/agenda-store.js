import { get, put } from "@vercel/blob";

const AGENDA_PATH = "agenda/agenda.json";

export const defaultEvents = [
  {
    id: "rockambole-2026-08-21",
    date: "2026-08-21",
    time: "",
    venue: "Casa Rockambole — São Paulo, SP",
    ticketUrl: "https://meaple.com.br/rockambole/danilo-cutrim-2026",
  },
  {
    id: "dolores-2026-08-28",
    date: "2026-08-28",
    time: "",
    venue: "Dolores Club — Rio de Janeiro, RJ",
    ticketUrl: "https://bileto.sympla.com.br/event/122945",
  },
];

function sortEvents(events) {
  return [...events].sort((left, right) => `${left.date}T${left.time || "00:00"}`.localeCompare(`${right.date}T${right.time || "00:00"}`));
}

export async function readAgenda() {
  try {
    const result = await get(AGENDA_PATH, { access: "private" });
    if (result?.statusCode !== 200) return sortEvents(defaultEvents);
    const data = await new Response(result.stream).json();
    return Array.isArray(data) ? sortEvents(data) : sortEvents(defaultEvents);
  } catch (error) {
    if (error?.status === 404 || error?.statusCode === 404) return sortEvents(defaultEvents);
    throw error;
  }
}

export async function writeAgenda(events) {
  const sortedEvents = sortEvents(events);
  await put(AGENDA_PATH, JSON.stringify(sortedEvents), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
  return sortedEvents;
}

export function validateEvent(input) {
  const date = String(input?.date || "").trim();
  const time = String(input?.time || "").trim();
  const venue = String(input?.venue || "").trim();
  const ticketUrl = String(input?.ticketUrl || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
    return { error: "Informe uma data válida." };
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return { error: "Informe um horário válido." };
  if (venue.length < 2 || venue.length > 120) return { error: "Informe um local válido." };

  try {
    const parsedUrl = new URL(ticketUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return { error: "Informe um link de ingresso válido." };
  }

  return { event: { date, time, venue, ticketUrl } };
}
