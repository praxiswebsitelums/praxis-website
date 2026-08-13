document.addEventListener("DOMContentLoaded", () => {
  const content = window.PRAXIS_CONTENT;

  // Populate editable content
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const path = el.dataset.bind.split(".");
    let value = content;
    for (const key of path) value = value?.[key];
    if (value !== undefined) el.textContent = value;
  });

  // Navbar
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 30);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuButton?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", mobileMenu?.classList.contains("open") ? "true" : "false");
  });
  mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

  // Hero slider
  const slides = content.hero.slides;
  const slideEls = document.querySelectorAll(".hero-slide");
  const eyebrow = document.querySelector("[data-hero-eyebrow]");
  const title = document.querySelector("[data-hero-title]");
  const description = document.querySelector("[data-hero-description]");
  const heroButton = document.querySelector("[data-hero-button]");
  const progressButtons = document.querySelectorAll(".hero-progress button");
  const currentCounter = document.querySelector("[data-hero-current]");
  let active = 0;
  let timer;

  const renderHero = (index) => {
    active = index;
    slideEls.forEach((el, i) => el.classList.toggle("active", i === index));
    const s = slides[index];
    if (eyebrow) eyebrow.textContent = s.eyebrow;
    if (title) title.textContent = s.title;
    if (description) description.textContent = s.description;
    if (heroButton) {
      heroButton.textContent = `${s.buttonText}  ↗`;
      heroButton.href = s.buttonLink;
    }
    if (currentCounter) currentCounter.textContent = String(index + 1).padStart(2, "0");
    progressButtons.forEach((b, i) => b.classList.toggle("active", i === index));
  };

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => renderHero((active + 1) % slides.length), 4000);
  };

  progressButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      renderHero(index);
      startTimer();
    });
  });
  renderHero(0);
  startTimer();

  // Announcement
  const announcement = document.querySelector(".announcement");
  if (announcement && !content.announcement.active) announcement.hidden = true;

  // Populate hero slide images from data
  document.querySelectorAll(".hero-slide img").forEach((img, i) => {
    if (slides[i]) img.src = slides[i].image;
  });

  // Registration form (Phase 1 demo until a real endpoint is configured)
  const form = document.querySelector("#interest-form");
  const formMessage = document.querySelector(".form-message");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    formMessage.textContent = "Thank you — your interest has been recorded on this demo form. Connect a production form endpoint before launch.";
    formMessage.classList.add("show");
  });
});
