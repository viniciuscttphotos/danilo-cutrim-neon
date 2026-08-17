import {
  clearSessionCookie,
  createSessionCookie,
  credentialsAreConfigured,
  credentialsMatch,
  isAuthenticated,
  isSameOrigin,
} from "../lib/auth.js";

function json(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function handler(request) {
  if (request.method === "GET") return json({ authenticated: isAuthenticated(request) });
  if (!isSameOrigin(request)) return json({ error: "Origem inválida." }, 403);

  if (request.method === "DELETE") {
    return json({ authenticated: false }, 200, { "Set-Cookie": clearSessionCookie() });
  }

  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405, { Allow: "GET, POST, DELETE" });
  if (!credentialsAreConfigured()) return json({ error: "O painel ainda não foi configurado no servidor." }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Dados inválidos." }, 400);
  }

  if (!credentialsMatch(body?.username, body?.password)) {
    return json({ error: "Usuário ou senha incorretos." }, 401);
  }

  return json({ authenticated: true }, 200, { "Set-Cookie": createSessionCookie() });
}

export default { fetch: handler };
