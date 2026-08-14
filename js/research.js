/* =====================================================================
   PRAXIS RESEARCH PAGE — page-specific behaviour

   Reads window.PRAXIS_CONTENT.research and renders the archive header
   and research cards, then handles the research details modal.

   Global navigation, header state, mobile menu, footer behaviour, and
   shared reveal systems remain in js/main.js.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const content = window.PRAXIS_CONTENT?.research;
  if (!content) return;

  renderArchiveHeader(content);
  renderResearchCards(content.projects || []);
  bindResearchInteractions();
  setupResearchReveal();
  setupCardTilt();
});


/* =====================================================================
   HELPERS
   ===================================================================== */

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia?.("(pointer: fine)").matches;
}


/* =====================================================================
   ARCHIVE HEADER
   ===================================================================== */

function renderArchiveHeader(content) {
  const eyebrowEl = document.querySelector("[data-research-eyebrow]");
  const headingEl = document.querySelector("[data-research-heading]");
  const introEl = document.querySelector("[data-research-intro]");

  if (eyebrowEl && content.eyebrow) {
    eyebrowEl.textContent = content.eyebrow;
  }

  if (headingEl && content.heading) {
    headingEl.textContent = content.heading;
  }

  if (introEl && content.intro) {
    introEl.textContent = content.intro;
  }
}


/* =====================================================================
   RESEARCH CARDS
   ===================================================================== */

function renderResearchCards(projects) {
  const grid = document.querySelector("[data-research-grid]");
  if (!grid) return;

  grid.innerHTML = "";

  projects.forEach((project, index) => {
    grid.appendChild(createCardElement(project, index));
  });
}

function createCardElement(project, index) {
  const card = document.createElement("article");

  card.className = "research-card" + (index % 2 === 1 ? " reverse" : "");
  card.dataset.projectId = project.id;

  const media = document.createElement("div");
  media.className = "research-card-media";

  const image = document.createElement("img");
  image.src = project.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";

  media.appendChild(image);

  const body = document.createElement("div");
  body.className = "research-card-body";

  const metaEl = document.createElement("div");
  metaEl.className = "research-card-meta";
  metaEl.textContent = `${project.number} / ${project.semester}`;

  const titleEl = document.createElement("h3");
  titleEl.className = "research-card-title";
  titleEl.textContent = project.title;

  const descEl = document.createElement("p");
  descEl.className = "research-card-desc";
  descEl.textContent = project.shortDescription;

  const linkEl = document.createElement("button");
  linkEl.type = "button";
  linkEl.className = "research-card-link";
  linkEl.setAttribute("data-open-modal", "");
  linkEl.setAttribute("aria-label", `See details for ${project.title}`);
  linkEl.innerHTML = 'See Details <span class="arrow">→</span>';

  body.append(metaEl, titleEl, descEl, linkEl);
  card.append(media, body);

  return card;
}


/* =====================================================================
   MODAL
   ===================================================================== */

let lastFocusedTrigger = null;

function getModalEls() {
  return {
    overlay: document.querySelector("[data-modal-overlay]"),
    modal: document.querySelector("[data-modal]"),
    closeBtn: document.querySelector("[data-modal-close]"),
    image: document.querySelector("[data-modal-image]"),
    meta: document.querySelector("[data-modal-meta]"),
    title: document.querySelector("[data-modal-title]"),
    desc: document.querySelector("[data-modal-desc]"),
    pdf: document.querySelector("[data-modal-pdf]")
  };
}

function findProjectById(id) {
  const content = window.PRAXIS_CONTENT?.research;
  if (!content) return null;

  return (content.projects || []).find((project) => project.id === id) || null;
}

function openResearchModal(project, triggerEl) {
  const els = getModalEls();

  if (!els.overlay || !els.modal) return;

  lastFocusedTrigger = triggerEl || null;

  els.image.src = project.image;
  els.image.alt = project.title;
  els.meta.textContent = `${project.number} / ${project.semester}`;
  els.title.textContent = project.title;
  els.desc.textContent = project.fullDescription;

  if (project.pdf) {
    els.pdf.href = project.pdf;
    els.pdf.hidden = false;
  } else {
    els.pdf.removeAttribute("href");
    els.pdf.hidden = true;
  }

  document.body.classList.add("research-modal-open");
  els.overlay.classList.add("is-open");

  document.addEventListener("keydown", onModalKeydown);

  window.setTimeout(() => {
    els.closeBtn?.focus();
  }, 50);
}

function closeResearchModal() {
  const els = getModalEls();

  if (!els.overlay) return;

  els.overlay.classList.remove("is-open");
  document.body.classList.remove("research-modal-open");
  document.removeEventListener("keydown", onModalKeydown);

  if (lastFocusedTrigger) {
    lastFocusedTrigger.focus();
    lastFocusedTrigger = null;
  }
}

function onModalKeydown(event) {
  if (event.key === "Escape") {
    closeResearchModal();
    return;
  }

  if (event.key === "Tab") {
    trapModalFocus(event);
  }
}

function trapModalFocus(event) {
  const els = getModalEls();
  if (!els.modal) return;

  const focusable = Array.from(
    els.modal.querySelectorAll("button, a[href]")
  ).filter((element) => !element.hidden);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}


/* =====================================================================
   MODAL INTERACTIONS
   ===================================================================== */

function bindResearchInteractions() {
  const grid = document.querySelector("[data-research-grid]");

  if (grid) {
    grid.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-open-modal]");
      if (!trigger) return;

      const card = trigger.closest(".research-card");
      const project = card && findProjectById(card.dataset.projectId);

      if (project) {
        openResearchModal(project, trigger);
      }
    });
  }

  const els = getModalEls();

  els.closeBtn?.addEventListener("click", closeResearchModal);

  els.overlay?.addEventListener("click", (event) => {
    if (event.target === els.overlay) {
      closeResearchModal();
    }
  });
}


/* =====================================================================
   CARD SCROLL REVEAL
   ===================================================================== */

function setupResearchReveal() {
  const cards = document.querySelectorAll(".research-card");

  if (!cards.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index * 0.1, 0.3)}s`;
    observer.observe(card);
  });
}


/* =====================================================================
   SUBTLE 3D TILT — DESKTOP / FINE POINTER ONLY
   ===================================================================== */

function setupCardTilt() {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  const cards = document.querySelectorAll(".research-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      onCardTiltMove(event, card);
    });

    card.addEventListener("mouseleave", () => {
      onCardTiltLeave(card);
    });
  });
}

function onCardTiltMove(event, card) {
  const rect = card.getBoundingClientRect();

  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  const rotateX = (-y * 4).toFixed(2);
  const rotateY = (x * 4).toFixed(2);

  card.style.transform =
    `translateY(-8px) scale(1.012) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function onCardTiltLeave(card) {
  card.style.transform = "";
}
