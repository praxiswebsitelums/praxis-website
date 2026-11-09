/* Shared navigation, footer, home interactions and about interactions. */

/* Shared navigation. */


function renderSiteChrome(content) {
  renderHeader();
  renderFooter(content.footer || {});
}

function currentPage() {
  return window.location.pathname.split("/").pop().toLowerCase() || "index.html";
}

function renderHeader() {
  const target = document.querySelector("[data-site-header]");
  if (!target) return;

  const page = currentPage();
  const links = [
    ["Home", "index.html"],
    ["About", "about.html"],
    ["Research", "research.html"],
    ["Events", "events.html"],
    ["Achievements", "achievements.html"],
    ["Team", "team.html"],
    ["Contact Us ↗", "register.html"]
  ];

  const desktopLinks = links.map(([label, href]) => {
    const active = page === href ? "active" : "";
    const cta = href === "register.html" ? "nav-cta" : "";
    return `<a class="${cta} ${active}" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");

  const mobileLinks = links.map(([label, href]) => {
    const active = page === href ? "active" : "";
    return `<a class="${active}" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");

  target.innerHTML = `
    <header class="site-header">
      <nav class="navbar">
        <a class="brand" href="index.html" aria-label="Praxis home">
          <img src="images/logo.jpg" width="1320" height="1228" alt="Praxis logo">
          <span class="brand-word">PRAXIS</span>
        </a>
        <div class="nav-links">${desktopLinks}</div>
        <button class="menu-button" type="button" aria-label="Open menu" aria-controls="praxis-mobile-menu" aria-expanded="false">☰</button>
      </nav>
      <div class="mobile-menu" id="praxis-mobile-menu">${mobileLinks}</div>
    </header>
  `;

  const header = target.querySelector(".site-header");
  const menuButton = target.querySelector(".menu-button");
  const mobileMenu = target.querySelector(".mobile-menu");

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 30);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  menuButton.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });
}

function renderFooter(footer) {
  const target = document.querySelector("[data-site-footer]");
  if (!target) return;

  const instagram = footer.instagram || "#";
  const linkedin = footer.linkedin || "#";
  const email = footer.email || "";

  target.innerHTML = `
    <footer class="site-footer praxis-footer">
      <div class="footer-bg-word" aria-hidden="true">PRAXIS</div>
      <div class="container">
        <div class="footer-top">
          <div>
            <div class="footer-brand-row">
              <img class="footer-logo" src="images/logo.jpg" width="1320" height="1228" loading="lazy" decoding="async" alt="Praxis logo">
              <div class="footer-brand">PRAXIS</div>
            </div>
            <p class="footer-tag">The Praxis Initiative <br>Lahore University of Management Sciences</p>
          </div>
          <div>
            <div class="footer-heading">Explore</div>
            <div class="footer-links">
              <a href="about.html">About</a>
              <a href="research.html">Research</a>
              <a href="events.html">Events</a>
              <a href="achievements.html">Achievements</a>
              <a href="team.html">Team</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Connect</div>
            <div class="footer-links">
              <a href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="${email ? `mailto:${email}` : "#"}">Email</a>
              <a href="privacy.html">Privacy Notice</a>
            </div>
          </div>
          <div>
            <div class="footer-heading">Contact</div>
            <p class="footer-contact-text">If you think our work resonates with you, let’s have a conversation.</p>
            <a class="footer-contact-button" href="register.html">Contact Us ↗</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 The Praxis Initiative, LUMS</span>
          <span>Developed by <a class="developer-link" href="https://ahmadzeeshan.tech" target="_blank" rel="noopener noreferrer">Ahmad Zeeshan</a></span>
        </div>
      </div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const content = window.PRAXIS_CONTENT || {};
  renderSiteChrome(content);

document.querySelectorAll("[data-bind], [data-bind-href]").forEach((el) => {
    const resolve = (path) => {
      let value = content;
      for (const key of path.split(".")) value = value?.[key];
      return value;
    };

    if (el.dataset.bind) {
      const value = resolve(el.dataset.bind);
      if (value !== undefined) el.textContent = value;
    }

    if (el.dataset.bindHref) {
      const value = resolve(el.dataset.bindHref);
      if (value) el.href = value;
    }
  });
  /* Home hero. */
  const slides = content.hero?.slides || [];
  const slideEls = document.querySelectorAll(".hero-slide");
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
  /* Announcement bar. */
  const announcement = document.querySelector(".announcement");
  if (announcement && !content.announcement?.active) announcement.hidden = true;
  document.querySelectorAll(".hero-slide img").forEach((img, i) => {
    if (slides[i]) img.src = slides[i].image;
  });
  /* Home EC. */
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
  /* About page interactions. */
  const aboutPage = document.querySelector(".ab3");
  if (aboutPage) initializeAboutPage();

  function initializeAboutPage() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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
