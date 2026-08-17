const loginPanel = document.querySelector("[data-login-panel]");
const dashboard = document.querySelector("[data-dashboard]");
const loginForm = document.querySelector("[data-login-form]");
const agendaForm = document.querySelector("[data-agenda-form]");
const loginStatus = document.querySelector("[data-login-status]");
const agendaStatus = document.querySelector("[data-agenda-status]");
const eventList = document.querySelector("[data-admin-events]");

function setAuthenticated(authenticated) {
  loginPanel.hidden = authenticated;
  dashboard.hidden = !authenticated;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function renderEvents(events) {
  eventList.replaceChildren();
  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "admin-empty";
    empty.textContent = "Nenhuma apresentação cadastrada.";
    eventList.append(empty);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("article");
    item.className = "admin-event";
    const copy = document.createElement("div");
    const date = document.createElement("p");
    date.textContent = `${formatDate(event.date)}${event.time ? ` · ${event.time}` : " · horário em breve"}`;
    const venue = document.createElement("h3");
    venue.textContent = event.venue;
    const link = document.createElement("a");
    link.href = event.ticketUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ver ingresso ↗";
    copy.append(date, venue, link);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "event-delete";
    removeButton.dataset.deleteEvent = event.id;
    removeButton.setAttribute("aria-label", `Excluir agenda de ${event.venue}`);
    removeButton.textContent = "Excluir";
    item.append(copy, removeButton);
    eventList.append(item);
  });
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Não foi possível concluir a operação.");
    error.status = response.status;
    throw error;
  }
  return data;
}

async function loadEvents() {
  const data = await request("/api/agenda");
  renderEvents(data.events || []);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginStatus.textContent = "Entrando…";
  const submitButton = loginForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  try {
    const formData = new FormData(loginForm);
    await request("/api/session", {
      method: "POST",
      body: JSON.stringify({ username: formData.get("username"), password: formData.get("password") }),
    });
    loginForm.reset();
    setAuthenticated(true);
    await loadEvents();
    loginStatus.textContent = "";
  } catch (error) {
    loginStatus.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

agendaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  agendaStatus.textContent = "Publicando…";
  const submitButton = agendaForm.querySelector("button[type='submit']");
  submitButton.disabled = true;

  try {
    const formData = new FormData(agendaForm);
    const data = await request("/api/agenda", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    renderEvents(data.events || []);
    agendaForm.reset();
    agendaStatus.textContent = "Agenda publicada no site.";
  } catch (error) {
    if (error.status === 401) setAuthenticated(false);
    agendaStatus.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

eventList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-delete-event]");
  if (!button || !window.confirm("Excluir esta apresentação da agenda?")) return;
  button.disabled = true;

  try {
    const data = await request(`/api/agenda?id=${encodeURIComponent(button.dataset.deleteEvent)}`, { method: "DELETE" });
    renderEvents(data.events || []);
  } catch (error) {
    agendaStatus.textContent = error.message;
    button.disabled = false;
  }
});

document.querySelector("[data-logout]").addEventListener("click", async () => {
  await request("/api/session", { method: "DELETE" }).catch(() => {});
  setAuthenticated(false);
});

request("/api/session")
  .then(async ({ authenticated }) => {
    setAuthenticated(authenticated);
    if (authenticated) await loadEvents();
  })
  .catch(() => setAuthenticated(false));
