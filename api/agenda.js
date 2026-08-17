import { randomUUID } from "node:crypto";
import { isAuthenticated, isSameOrigin } from "../lib/auth.js";
import { readAgenda, validateEvent, writeAgenda } from "../lib/agenda-store.js";

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });
}

async function handler(request) {
  try {
    if (request.method === "GET") return json({ events: await readAgenda() });
    if (!isSameOrigin(request)) return json({ error: "Origem inválida." }, 403);
    if (!isAuthenticated(request)) return json({ error: "Faça login novamente." }, 401);

    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Dados inválidos." }, 400);
      }

      const validation = validateEvent(body);
      if (validation.error) return json({ error: validation.error }, 400);
      const events = await readAgenda();
      const event = { id: randomUUID(), ...validation.event };
      return json({ events: await writeAgenda([...events, event]), event }, 201);
    }

    if (request.method === "DELETE") {
      const id = new URL(request.url).searchParams.get("id");
      if (!id) return json({ error: "Agenda não identificada." }, 400);
      const events = await readAgenda();
      const remaining = events.filter((event) => event.id !== id);
      if (remaining.length === events.length) return json({ error: "Agenda não encontrada." }, 404);
      return json({ events: await writeAgenda(remaining) });
    }

    return json({ error: "Método não permitido." }, 405, { Allow: "GET, POST, DELETE" });
  } catch (error) {
    console.error("Agenda API error", error);
    return json({ error: "Não foi possível acessar a agenda agora." }, 500);
  }
}

export default { fetch: handler };
