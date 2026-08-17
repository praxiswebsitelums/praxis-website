document.addEventListener("DOMContentLoaded", () => {
  const data = window.PRAXIS_CONTACT;
  if (!data) return;

  const grid = document.querySelector("[data-contact-ec]");
  (data.ec || []).forEach((member, i) => {
    const card = document.createElement("article");
    card.className = "contact-card";
    card.innerHTML = `
      <div class="contact-card-top">
        <div class="contact-card-number">${String(i + 1).padStart(2,"0")}</div>
        <h3 class="contact-card-name">${member.name}</h3>
        <div class="contact-card-role">${member.role}</div>
      </div>
      <div class="contact-card-bottom"></div>`;
    const bottom = card.querySelector(".contact-card-bottom");
    if (member.email && !member.email.startsWith("REPLACE_")) {
      const a = document.createElement("a");
      a.className = "contact-card-email";
      a.href = `mailto:${member.email}`;
      a.textContent = member.email;
      bottom.appendChild(a);
    } else {
      bottom.innerHTML = `<span class="contact-card-email contact-email-placeholder">Email to be added</span>`;
    }
    grid.appendChild(card);
  });

  const socials = document.querySelector("[data-contact-socials]");
  [
    ["Instagram", data.socials?.instagram, "Follow Praxis"],
    ["LinkedIn", data.socials?.linkedin, "Connect with Praxis"]
  ].forEach(([label,url,meta]) => {
    if (!url) return;
    const a=document.createElement("a");
    a.className="social-link";
    a.href=url; a.target="_blank"; a.rel="noopener noreferrer";
    a.innerHTML=`<span class="social-link-label">${label}</span><span class="social-link-meta">${meta}<span class="social-link-arrow">↗</span></span>`;
    socials.appendChild(a);
  });

  const items=document.querySelectorAll(".contact-card,.rv,.mask");
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(x=>x.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)}}),{threshold:.12});
    items.forEach(x=>io.observe(x));
  } else items.forEach(x=>x.classList.add("is-visible"));
});
