document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const reveals = document.querySelectorAll(".reveal");

document.querySelectorAll("[data-delay]").forEach((element) => {
  element.style.setProperty("--delay", `${element.dataset.delay}ms`);
});

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px 12%" },
  );
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

const shareButton = document.querySelector("[data-share]");

shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "Danilo Cutrim — Neon",
    text: "Neon, o novo álbum de Danilo Cutrim, já está disponível.",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      shareButton.firstChild.textContent = "Link copiado ";
    }
  } catch (error) {
    if (error.name !== "AbortError") console.error("Não foi possível compartilhar.", error);
  }
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const agenda = document.querySelector("[data-agenda]");

function renderAgenda(events) {
  if (!agenda) return;
  agenda.replaceChildren();

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "agenda-empty";
    empty.textContent = "Novas datas serão anunciadas em breve.";
    agenda.append(empty);
    return;
  }

  const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" });
  const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" });

  events.forEach((event, index) => {
    const date = new Date(`${event.date}T12:00:00Z`);
    const month = monthFormatter.format(date).replaceAll(".", "");
    const weekday = weekdayFormatter.format(date).replaceAll(".", "");
    const card = document.createElement("a");
    card.className = "show-card reveal is-visible";
    card.href = event.ticketUrl;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.style.setProperty("--delay", `${Math.min(index * 70, 280)}ms`);

    const timeElement = document.createElement("time");
    timeElement.dateTime = event.time ? `${event.date}T${event.time}` : event.date;
    const day = document.createElement("strong");
    day.textContent = String(date.getUTCDate()).padStart(2, "0");
    const dateLabel = document.createElement("span");
    dateLabel.textContent = `${month.toUpperCase()} · ${weekday.toUpperCase()}`;
    timeElement.append(day, dateLabel);

    const details = document.createElement("div");
    const schedule = document.createElement("p");
    schedule.textContent = event.time ? `${event.time} · AO VIVO` : "HORÁRIO EM BREVE";
    const venue = document.createElement("h3");
    venue.textContent = event.venue;
    const ticket = document.createElement("span");
    ticket.textContent = "Ingressos e informações ↗";
    details.append(schedule, venue, ticket);
    card.append(timeElement, details);
    agenda.append(card);
  });
}

if (agenda) {
  fetch("/api/agenda", { headers: { Accept: "application/json" } })
    .then((response) => {
      if (!response.ok) throw new Error("Agenda indisponível");
      return response.json();
    })
    .then((data) => renderAgenda(data.events || []))
    .catch(() => {
      agenda.replaceChildren();
      const message = document.createElement("p");
      message.className = "agenda-empty";
      message.textContent = "A agenda será atualizada em breve.";
      agenda.append(message);
    });
}

if (!reducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  let frame = 0;
  let latestEvent;

  window.addEventListener(
    "pointermove",
    (event) => {
      latestEvent = event;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${latestEvent.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${latestEvent.clientY}px`);
        frame = 0;
      });
    },
    { passive: true },
  );

  document.querySelectorAll("[data-tilt]").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      element.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) rotateZ(-1deg)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      element.style.transform = `translate(${x * 0.035}px, ${y * 0.06}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}
