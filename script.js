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
