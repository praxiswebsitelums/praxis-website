/* Team sections, person cards and interactions. */



document.addEventListener("DOMContentLoaded", () => {
  const data = window.PRAXIS_TEAM;
  const root = document.querySelector("[data-team-root]");
  if (!data || !root) return;

  applyBackgroundImage(data.backgroundImage);

  root.appendChild(buildHero(data.hero));
  root.appendChild(buildEC(data.ec));

  const departments = data.departments || [];
  departments.forEach((dept, index) => {
    root.appendChild(buildDepartment(dept, index));
  });

  setupReveal();
  setupCardTilt();
});

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia && window.matchMedia("(pointer: fine)").matches;
}

function chunk(list, size) {
  const rows = [];
  for (let i = 0; i < list.length; i += size) {
    rows.push(list.slice(i, i + size));
  }
  return rows;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function applyBackgroundImage(path) {
  if (!path) return;
  const absoluteUrl = new URL(path, window.location.href).href;
  document.documentElement.style.setProperty("--team-bg", `url("${absoluteUrl}")`);
}

function buildHero(hero) {
  hero = hero || {};

  const section = el("section", "team-hero team-photo-section");

  const wrap = el("div", "wrap");

  const eyebrow = el("div", "eyebrow rv");
  eyebrow.textContent = hero.eyebrow || "01 / OUR TEAM";

  const h1 = el("h1", "mask");
  const h1Span = document.createElement("span");
  h1Span.textContent = hero.title || "";
  h1.appendChild(h1Span);

  const desc = el("p", "team-hero-desc rv d1");
  desc.textContent = hero.description || "";

  wrap.append(eyebrow, h1, desc);
  section.appendChild(wrap);

  return section;
}

function buildEC(members) {
  members = members || [];

  const section = el("section", "team-ec team-cream-section");
  const wrap = el("div", "wrap");

  const eyebrow = el("div", "eyebrow rv");
  eyebrow.textContent = "02 / EXECUTIVE COUNCIL";

  const h2 = el("h2", "mask");
  const h2Span = document.createElement("span");
  h2Span.textContent = "Executive Council 26–27";
  h2.appendChild(h2Span);

  const grid = el("div", "team-ec-grid");
  members.forEach((member) => grid.appendChild(createPersonCard(member)));

  wrap.append(eyebrow, h2, grid);
  section.appendChild(wrap);

  return section;
}

function buildDepartment(dept, index) {
  dept = dept || {};
  const number = String(index + 3).padStart(2, "0");
  const isPhoto = index % 2 === 0; // Department 1, 3, 5... => photo; 2, 4... => cream
  const bgClass = isPhoto ? "team-photo-section" : "team-cream-section";

  const section = el("section", `team-department ${bgClass}`);
  if (dept.id) section.id = dept.id;

  const wrap = el("div", "wrap");

  const eyebrow = el("div", "eyebrow rv");
  eyebrow.textContent = `${number} / ${(dept.name || "").toUpperCase()}`;

  const h2 = el("h2", "mask");
  const h2Span = document.createElement("span");
  h2Span.textContent = dept.name || "";
  h2.appendChild(h2Span);

  wrap.append(eyebrow, h2);

  const directors = dept.directors || [];
  const assistantDirectors = dept.assistantDirectors || [];

  if (directors.length) {
    wrap.appendChild(buildPersonRow(directors, "team-director-row"));
  }

  if (assistantDirectors.length) {
    wrap.appendChild(buildPersonRow(assistantDirectors, "team-ad-row"));
  }

  if (dept.showGroupPhoto && dept.groupPhoto) {
    wrap.appendChild(buildGroupPhoto(dept.groupPhoto, dept.name));
  }

  section.appendChild(wrap);
  return section;
}

function buildPersonRow(people, rowClass) {
  const row = el("div", `team-person-row ${rowClass}`);

  chunk(people, 3).forEach((line) => {
    const lineEl = el("div", "team-person-line");
    line.forEach((person, i) => {
      const card = createPersonCard(person);
      card.style.transitionDelay = `${Math.min(i * 0.08, 0.24)}s`;
      lineEl.appendChild(card);
    });
    row.appendChild(lineEl);
  });

  return row;
}

function createPersonCard(person) {
  person = person || {};

  const card = el("article", "team-card");

  const img = document.createElement("img");
  img.src = person.image || "";
  img.alt = person.name || "";
  img.loading = "lazy";
  img.decoding = "async";
  card.appendChild(img);

  const meta = el("div", "team-card-meta");

  const name = el("div", "team-card-name");
  name.textContent = person.name || "";

  const role = el("div", "team-card-role");
  role.textContent = person.role || "";

  meta.append(name, role);
  card.appendChild(meta);

  return card;
}

function buildGroupPhoto(src, deptName) {
  const wrapper = el("div", "team-group-photo");
  const img = document.createElement("img");
  img.src = src;
  img.alt = deptName ? `${deptName} group photograph` : "Department group photograph";
  img.loading = "lazy";
  img.decoding = "async";
  wrapper.appendChild(img);
  return wrapper;
}

function setupReveal() {
  const targets = document.querySelectorAll(
    "[data-team-root] .rv, [data-team-root] .mask, [data-team-root] .team-card, [data-team-root] .team-group-photo"
  );

  if (!targets.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("in"));
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

  targets.forEach((target) => observer.observe(target));
}

function setupCardTilt() {
  if (prefersReducedMotion() || !hasFinePointer()) return;

  document.querySelectorAll("[data-team-root] .team-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => onCardTiltMove(event, card));
    card.addEventListener("mouseleave", () => onCardTiltLeave(card));
  });
}

function onCardTiltMove(event, card) {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  const rotateX = (-y * 3).toFixed(2);
  const rotateY = (x * 3).toFixed(2);

  card.style.transform =
    `perspective(1100px) translateY(-8px) scale(1.012) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function onCardTiltLeave(card) {
  card.style.transform = "";
}
