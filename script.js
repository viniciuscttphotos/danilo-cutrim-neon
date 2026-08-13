// Troque estas URLs pelas páginas oficiais de pré-save do álbum quando forem liberadas.
const STREAMING_LINKS = {
  spotify: "https://open.spotify.com/artist/5F0iFhw7bZE7a8INjualJn",
  apple: "https://music.apple.com/br/artist/braza/1780356623",
  deezer: "https://www.deezer.com/search/BRAZA",
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;

document.querySelectorAll("[data-platform]").forEach((link) => {
  const platform = link.dataset.platform;
  if (STREAMING_LINKS[platform]) link.href = STREAMING_LINKS[platform];
});

const countdown = document.querySelector("[data-countdown]");
let countdownTimer;

function updateCountdown() {
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown).getTime();
  const remaining = Math.max(0, target - Date.now());
  const parts = {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };

  Object.entries(parts).forEach(([unit, value]) => {
    const field = countdown.querySelector(`[data-${unit}]`);
    if (field) field.textContent = String(value).padStart(2, "0");
  });

  countdown.classList.toggle("is-live", remaining === 0);

  if (remaining === 0 && countdownTimer) {
    window.clearInterval(countdownTimer);
    countdownTimer = undefined;
  }
}

updateCountdown();
if (countdown && new Date(countdown.dataset.countdown).getTime() > Date.now()) {
  countdownTimer = window.setInterval(updateCountdown, 1_000);
}

document.querySelectorAll("[data-delay]").forEach((element) => {
  element.style.setProperty("--delay", `${element.dataset.delay}ms`);
});

const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.02, rootMargin: "0px 0px 18%" },
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

function updatePointer(event) {
  const x = event.clientX;
  const y = event.clientY;
  const normalizedX = x / window.innerWidth - 0.5;
  const normalizedY = y / window.innerHeight - 0.5;

  root.style.setProperty("--mouse-x", `${x}px`);
  root.style.setProperty("--mouse-y", `${y}px`);
  root.style.setProperty("--bg-x", `${normalizedX * -18}px`);
  root.style.setProperty("--bg-y", `${normalizedY * -14}px`);
}

let pointerFrame = 0;
let latestPointerEvent;

function queuePointerUpdate(event) {
  latestPointerEvent = event;
  if (pointerFrame) return;

  pointerFrame = window.requestAnimationFrame(() => {
    updatePointer(latestPointerEvent);
    pointerFrame = 0;
  });
}

if (!reducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", queuePointerUpdate, { passive: true });

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      element.style.transform = `translate(${x * 0.06}px, ${y * 0.09}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}
