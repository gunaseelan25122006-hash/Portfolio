const root = document.documentElement,
  header = document.querySelector(".site-header"),
  toggle = document.querySelector(".theme-toggle"),
  menuButton = document.querySelector(".menu-toggle"),
  navMenu = document.querySelector(".nav-menu"),
  progress = document.querySelector(".scroll-progress span"),
  backTop = document.querySelector(".back-top");
const savedTheme = localStorage.getItem("portfolio-theme");
root.dataset.theme = savedTheme || "dark";
function updateToggle() {
  const dark = root.dataset.theme === "dark";
  toggle.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme",
  );
  toggle.querySelector(".theme-icon").textContent = dark ? "☼" : "☾";
}
updateToggle();
toggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", root.dataset.theme);
  updateToggle();
});
menuButton.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu",
  );
});
document.querySelectorAll(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }),
);
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
const links = [...document.querySelectorAll(".nav-link")],
  sections = [...document.querySelectorAll("main section[id]")].filter(
    (section) => links.some((link) => link.hash === `#${section.id}`),
  ),
  sectionObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          links.forEach((link) =>
            link.classList.toggle(
              "active",
              link.hash === `#${entry.target.id}`,
            ),
          );
      }),
    { rootMargin: "-35% 0px -55%" },
  );
sections.forEach((section) => sectionObserver.observe(section));
function onScroll() {
  const height = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${height ? scrollY / height : 0})`;
  header.classList.toggle("scrolled", scrollY > 20);
  backTop.classList.toggle("visible", scrollY > 650);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
backTop.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" }),
);
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const error = field.parentElement.querySelector("small");
    let message = "";
    if (!field.value.trim()) message = `Please enter your ${field.name}.`;
    else if (field.type === "email" && !field.validity.valid)
      message = "Enter a valid email address.";
    field.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    if (message) valid = false;
  });
  const status = form.querySelector(".form-message");
  status.textContent = valid
    ? "Thanks! Please connect using the email address above."
    : "";
  if (valid) form.reset();
});
if (
  window.matchMedia(
    "(pointer:fine) and (prefers-reduced-motion: no-preference)",
  ).matches
) {
  document.body.classList.add("cursor-enabled");
  const dot = document.createElement("span"),
    ring = document.createElement("span");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);
  addEventListener(
    "pointermove",
    (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
      dot.style.opacity = 1;
      ring.style.opacity = 1;
    },
    { passive: true },
  );
  document.querySelectorAll("a,button,input,textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
}
addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.focus();
  }
});
addEventListener("click", (event) => {
  if (
    navMenu.classList.contains("open") &&
    !navMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    navMenu.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});
