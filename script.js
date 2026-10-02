const root = document.documentElement;
const toggle = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const backTop = document.querySelector(".back-top");
const themeColor = document.querySelector('meta[name="theme-color"]');

root.classList.add("js-ready");

let savedTheme = "dark";
try {
  const storedTheme = localStorage.getItem("portfolio-theme");
  if (storedTheme === "dark" || storedTheme === "light") savedTheme = storedTheme;
} catch {
  // Keep the site usable when browser storage is unavailable.
}
root.dataset.theme = savedTheme;

function updateThemeButton() {
  const dark = root.dataset.theme === "dark";
  toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  toggle.querySelector(".theme-icon").textContent = dark ? "\u263e" : "\u2600";
  themeColor.setAttribute("content", dark ? "#0d1420" : "#f4f6fb");
}

updateThemeButton();
toggle.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("portfolio-theme", root.dataset.theme);
  } catch {
    // Theme switching still works for this visit without browser storage.
  }
  updateThemeButton();
});

const mobileNav = window.matchMedia("(max-width: 980px)");

function setMenuOpen(open) {
  const closedOnMobile = mobileNav.matches && !open;
  navMenu.classList.toggle("open", open);
  navMenu.inert = closedOnMobile;
  navMenu.setAttribute("aria-hidden", String(closedOnMobile));
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
}

setMenuOpen(false);
menuButton.addEventListener("click", () => {
  setMenuOpen(!navMenu.classList.contains("open"));
});
mobileNav.addEventListener("change", () => setMenuOpen(false));

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("open")) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    navMenu.classList.contains("open") &&
    !navMenu.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const links = [...document.querySelectorAll(".nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")].filter((section) =>
    links.some((link) => link.hash === "#" + section.id),
  );
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            const active = link.hash === "#" + entry.target.id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-35% 0px -55%" },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  const hero = document.querySelector(".hero");
  const backTopObserver = new IntersectionObserver(([entry]) => {
    const visible = !entry.isIntersecting;
    backTop.classList.toggle("visible", visible);
    backTop.inert = !visible;
    backTop.setAttribute("aria-hidden", String(!visible));
  });
  backTopObserver.observe(hero);
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

backTop.addEventListener("click", () => {
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior });
});

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = [...form.querySelectorAll("[required]")];
  let firstInvalid = null;

  fields.forEach((field) => {
    const error = field.parentElement.querySelector("small");
    let message = "";
    if (!field.value.trim()) message = "Please enter your " + field.name + ".";
    else if (field.type === "email" && !field.validity.valid) message = "Enter a valid email address.";

    field.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
    if (message && !firstInvalid) firstInvalid = field;
  });

  const status = form.querySelector(".form-message");
  if (firstInvalid) {
    status.textContent = "Check the highlighted fields and try again.";
    firstInvalid.focus();
    return;
  }

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent([message, "", "From: " + name, "Reply to: " + email].join("\n"));
  status.textContent = "Your email app will open with a draft. Send it there to complete your message.";
  window.location.href = "mailto:gunaseelan25122006@gmail.com?subject=" + subject + "&body=" + body;
});
