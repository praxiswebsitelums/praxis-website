/* Events page rendering and interactions. */



document.addEventListener("DOMContentLoaded", () => {
  const content = window.PRAXIS_CONTENT && window.PRAXIS_CONTENT.events;
  if (!content) return;

  renderEventsHeader(content);
  renderEventCards(content.items || []);
  setupEventsReveal();
  setupCardTilt();
});

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia && window.matchMedia("(pointer: fine)").matches;
}

function renderEventsHeader(content) {
  const eyebrowEl = document.querySelector("[data-events-eyebrow]");
  const headingEl = document.querySelector("[data-events-heading]");
  const introEl = document.querySelector("[data-events-intro]");

  if (eyebrowEl && content.eyebrow) eyebrowEl.textContent = content.eyebrow;
  if (headingEl && content.heading) headingEl.textContent = content.heading;
  if (introEl && content.intro) introEl.textContent = content.intro;
}

function renderEventCards(items) {
  const grid = document.querySelector("[data-events-grid]");
  if (!grid) return;

  grid.innerHTML = "";
  items.forEach((event, index) => {
    grid.appendChild(createEventCard(event, index));
  });
}

function createEventCard(event, index) {
  const card = document.createElement("article");
  card.className = "event-card" + (index % 2 === 1 ? " reverse" : "");

  const media = document.createElement("div");
  media.className = "event-card-media";

  const img = document.createElement("img");
  img.setAttribute("src", event.image);
  img.setAttribute("alt", event.title || "");
  img.setAttribute("loading", "lazy");
  img.setAttribute("decoding", "async");
  media.appendChild(img);

  const body = document.createElement("div");
  body.className = "event-card-body";

  const dateEl = document.createElement("div");
  dateEl.className = "event-card-date";
  dateEl.textContent = event.date;

  const titleEl = document.createElement("h3");
  titleEl.className = "event-card-title";
  titleEl.textContent = event.title;

  const descEl = document.createElement("p");
  descEl.className = "event-card-desc";
  descEl.textContent = event.shortDescription;

  body.appendChild(dateEl);
  body.appendChild(titleEl);
  body.appendChild(descEl);

  card.appendChild(media);
  card.appendChild(body);

  return card;
}

function setupEventsReveal() {
  const cards = document.querySelectorAll(".event-card");
  if (!cards.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index * 0.08, 0.32)}s`;
    observer.observe(card);
  });
}

function setupCardTilt() {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const cards = document.querySelectorAll(".event-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => onCardTiltMove(e, card));
    card.addEventListener("mouseleave", () => onCardTiltLeave(card));
  });
}

function onCardTiltMove(e, card) {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  const rotateX = (-y * 3.5).toFixed(2);
  const rotateY = (x * 3.5).toFixed(2);

  card.style.transform = `translateY(-8px) scale(1.012) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function onCardTiltLeave(card) {
  card.style.transform = "";
}
