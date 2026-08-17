/* Contact page rendering and interactions. */



document.addEventListener("DOMContentLoaded", () => {
  const content = window.PRAXIS_CONTENT;
  const contact = content && content.contact;
  if (!contact) return;

  renderHero(contact);
  renderEC(contact.ec);
  renderConnect(contact.connect, content.footer || {});
  setupReveal();
  setupCardTilt();
});

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia && window.matchMedia("(pointer: fine)").matches;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function renderHero(contact) {
  const eyebrowEl = document.querySelector("[data-contact-eyebrow]");
  const headingEl = document.querySelector("[data-contact-heading]");
  const introEl = document.querySelector("[data-contact-intro]");

  if (eyebrowEl && contact.eyebrow) eyebrowEl.textContent = contact.eyebrow;
  if (headingEl && contact.heading) headingEl.textContent = contact.heading;

  if (introEl && Array.isArray(contact.intro)) {
    introEl.innerHTML = "";
    contact.intro.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      introEl.appendChild(p);
    });
  }
}

function renderEC(ec) {
  if (!ec) return;

  const eyebrowEl = document.querySelector("[data-contact-ec-eyebrow]");
  const headingEl = document.querySelector("[data-contact-ec-heading]");
  const introEl = document.querySelector("[data-contact-ec-intro]");
  const grid = document.querySelector("[data-contact-ec]");

  if (eyebrowEl && ec.eyebrow) eyebrowEl.textContent = ec.eyebrow;
  if (headingEl && ec.heading) headingEl.textContent = ec.heading;
  if (introEl && ec.intro) introEl.textContent = ec.intro;
  if (!grid) return;

  grid.innerHTML = "";
  (ec.members || []).forEach((member, index) => {
    grid.appendChild(createContactCard(member, index));
  });
}

function createContactCard(member, index) {
  const card = el("article", "contact-card");

  const number = el("div", "contact-card-number");
  number.textContent = String(index + 1).padStart(2, "0");

  const name = el("div", "contact-card-name");
  name.textContent = member.name || "";

  const role = el("div", "contact-card-role");
  role.textContent = member.role || "";

  card.append(number, name, role);

  if (member.email) {
    const email = document.createElement("a");
    email.className = "contact-card-email";
    email.href = `mailto:${member.email}`;
    email.innerHTML = `<span>${member.email}</span><span class="arrow" aria-hidden="true">↗</span>`;
    card.appendChild(email);
  }

  return card;
}

function renderConnect(connect, footer) {
  if (!connect) return;

  const eyebrowEl = document.querySelector("[data-contact-connect-eyebrow]");
  const headingEl = document.querySelector("[data-contact-connect-heading]");
  const list = document.querySelector("[data-contact-connect]");

  if (eyebrowEl && connect.eyebrow) eyebrowEl.textContent = connect.eyebrow;
  if (headingEl && connect.heading) headingEl.textContent = connect.heading;
  if (!list) return;

  const socials = [
    { label: "Instagram", supporting: "Follow Praxis", url: footer.instagram },
    { label: "LinkedIn", supporting: "Connect with Praxis", url: footer.linkedin }
  ].filter((social) => !!social.url);

  list.innerHTML = "";
  socials.forEach((social) => list.appendChild(createConnectLink(social)));
}

function createConnectLink(social) {
  const link = document.createElement("a");
  link.className = "connect-link";
  link.href = social.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const label = el("span", "connect-link-label");
  label.textContent = social.label;

  const supporting = el("span", "connect-link-supporting");
  supporting.innerHTML = `<span>${social.supporting}</span><span class="arrow" aria-hidden="true">↗</span>`;

  link.append(label, supporting);
  return link;
}

function setupReveal() {
  const cards = document.querySelectorAll(".contact-card, .connect-link");
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

  document.querySelectorAll(".contact-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => onCardTiltMove(e, card));
    card.addEventListener("mouseleave", () => onCardTiltLeave(card));
  });
}

function onCardTiltMove(e, card) {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  const rotateX = (-y * 3).toFixed(2);
  const rotateY = (x * 3).toFixed(2);

  card.style.transform = `translateY(-8px) scale(1.012) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function onCardTiltLeave(card) {
  card.style.transform = "";
}
