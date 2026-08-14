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
  const slides = content.hero?.slides || [];
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
    if (!slides.length) return;
    active = index;
    slideEls.forEach((el, i) => el.classList.toggle("active", i === index));
    const slide = slides[index];
    if (eyebrow) eyebrow.textContent = slide.eyebrow;
    if (title) title.textContent = slide.title;
    if (description) description.textContent = slide.description;
    if (heroButton) {
      heroButton.textContent = `${slide.buttonText}  ↗`;
      heroButton.href = slide.buttonLink;
    }
    if (currentCounter) currentCounter.textContent = String(index + 1).padStart(2, "0");
    progressButtons.forEach((button, i) => button.classList.toggle("active", i === index));
  };

  const startTimer = () => {
    clearInterval(timer);
    if (slides.length > 1 && progressButtons.length) {
      timer = setInterval(() => renderHero((active + 1) % slides.length), 4000);
    }
  };

  progressButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      renderHero(index);
      startTimer();
    });
  });

  if (slides.length) {
    renderHero(0);
    startTimer();
  }

  // Announcement
  const announcement = document.querySelector(".announcement");
  if (announcement && !content.announcement?.active) announcement.hidden = true;

  // Populate hero slide images from data
  document.querySelectorAll(".hero-slide img").forEach((img, i) => {
    if (slides[i]) img.src = slides[i].image;
  });

  // Executive Council cards on the Home page
  const ecContainer = document.querySelector('[data-members="ec.members"]');
  const ecMembers = content.ec?.members || [];
  if (ecContainer) {
    ecContainer.innerHTML = ecMembers.map((member) => `
      <article class="ec-card">
        <img src="${member.image}" alt="${member.name}">
        <div class="ec-meta">
          <div class="ec-name">${member.name}</div>
          <div class="ec-role">${member.role}</div>
        </div>
      </article>
    `).join("");
  }

  // Footer links
  const footer = content.footer || {};
  const footerLinks = {
    instagram: footer.instagram,
    linkedin: footer.linkedin,
    email: footer.email
  };

  Object.entries(footerLinks).forEach(([key, value]) => {
    const link = document.querySelector(`[data-footer-link="${key}"]`);
    if (!link || !value) return;

    let url = value.trim();

    // Support values accidentally written as Markdown links.
    const markdownMatch = url.match(/\]\(([^)]+)\)/);
    if (markdownMatch) url = markdownMatch[1];

    if (key === "email") {
      url = url.replace(/^mailto:/i, "");
      link.href = `mailto:${url}`;
    } else {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });

  // Registration form (Phase 1 demo until a real endpoint is configured)
  const form = document.querySelector("#interest-form");
  const formMessage = document.querySelector(".form-message");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    if (formMessage) {
      formMessage.textContent = "Thank you — your interest has been recorded on this demo form. Connect a production form endpoint before launch.";
      formMessage.classList.add("show");
    }
  });

  // About page interactions
  const aboutPage = document.querySelector(".ab3");
  if (aboutPage) initializeAboutPage();

  function initializeAboutPage() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Scroll reveals
    const revealEls = document.querySelectorAll(".ab3 .rv, .ab3 .rv-left, .ab3 .rv-right, .ab3 .mask, .ab3-line");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.22, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach((el) => revealObserver.observe(el));
    }

    // How-we-work stages + connectors
    const stageEls = document.querySelectorAll(".ab3-stage-inner, .ab3-connector");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      stageEls.forEach((el) => el.classList.add("in"));
    } else {
      const stageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            setTimeout(() => el.classList.add("in"), index * 90);
            stageObserver.unobserve(el);
          }
        });
      }, { threshold: 0.3 });
      stageEls.forEach((el) => stageObserver.observe(el));
    }

    // Hero logo mouse parallax (desktop only)
    if (canHover && !reduceMotion) {
      const hero = document.querySelector(".ab3-hero");
      const logo = document.getElementById("ab3HeroLogo");
      if (hero && logo) {
        hero.addEventListener("mousemove", (event) => {
          const rect = hero.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          logo.style.transform = `translate(${(x * 18).toFixed(1)}px,${(y * 18).toFixed(1)}px)`;
        });
        hero.addEventListener("mouseleave", () => {
          logo.style.transform = "translate(0,0)";
        });
      }
    }

    // Founder portrait 3D tilt on hover (desktop only)
    if (canHover && !reduceMotion) {
      document.querySelectorAll(".ab3-tilt").forEach((el) => {
        el.addEventListener("mousemove", (event) => {
          const rect = el.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          el.style.transform = `perspective(1200px) rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateZ(12px) scale(1.012)`;
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "perspective(1200px) rotateY(0) rotateX(0) translateZ(0) scale(1)";
        });
      });
    }

    // Watermark parallax on scroll (rAF-throttled)
    if (!reduceMotion) {
      const marks = [document.getElementById("ab3WhyMark"), document.getElementById("ab3BelieveMark")].filter(Boolean);
      if (marks.length) {
        let ticking = false;
        const updateMarks = () => {
          marks.forEach((mark) => {
            const section = mark.closest("section");
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
            const offset = (progress - 0.5) * 40;
            mark.style.transform = `translate(-50%,calc(-50% + ${offset.toFixed(1)}px))`;
          });
          ticking = false;
        };

        window.addEventListener("scroll", () => {
          if (!ticking) {
            window.requestAnimationFrame(updateMarks);
            ticking = true;
          }
        }, { passive: true });
        updateMarks();
      }
    }
  }
});
