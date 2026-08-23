/**
 * Charged Development — static homepage
 * Header state, mobile navigation, project filtering, quick contact, contact form placeholder.
 */

function initHeader() {
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
}

/**
 * Six featured projects are shown by default so the section stays scannable.
 * Picking a category always reveals everything in it — those sets are small enough.
 */
function initWorkFilter() {
  const grid = document.getElementById("work-grid");
  const toggle = document.getElementById("work-toggle");
  const buttons = Array.from(document.querySelectorAll(".filter-btn"));
  const cards = Array.from(grid.querySelectorAll(".work-card"));

  let category = "all";
  let expanded = false;

  const render = () => {
    const showEverything = expanded || category !== "all";

    cards.forEach((card) => {
      const matches = category === "all" || card.dataset.category === category;
      card.hidden = !matches || (!showEverything && card.dataset.featured !== "true");
    });

    buttons.forEach((btn) => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    toggle.hidden = category !== "all";
    toggle.textContent = expanded
      ? window.I18N.t("work.showFewer")
      : window.I18N.t("work.showAll", { count: cards.length });
    toggle.setAttribute("aria-expanded", String(expanded));
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      category = btn.dataset.filter;
      if (category === "all") expanded = false;
      render();
    });
  });

  toggle.addEventListener("click", () => {
    expanded = !expanded;
    render();
    if (!expanded) {
      document.getElementById("work").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  render();
  window.I18N.onChange(render);
}

/**
 * Floating contact button: two clicks to any channel from anywhere on the page.
 * It stays out of the way in the hero (where the main CTA already sits) and while
 * the contact section itself is on screen.
 */
function initQuickContact() {
  const root = document.getElementById("quick-contact");
  const fab = document.getElementById("quick-fab");
  const panel = document.getElementById("quick-panel");
  const hero = document.getElementById("top");
  const contact = document.getElementById("contact");

  let heroVisible = true;
  let contactVisible = false;

  const setOpen = (open) => {
    panel.hidden = !open;
    root.classList.toggle("is-open", open);
    fab.setAttribute("aria-expanded", String(open));
    // The visible label is hidden on small screens, so the button carries its own name.
    fab.setAttribute("aria-label", window.I18N.t(open ? "quick.close" : "quick.fab"));
  };

  const syncVisibility = () => {
    const shouldShow = !heroVisible && !contactVisible;
    root.classList.toggle("is-visible", shouldShow);
    if (!shouldShow) setOpen(false);
  };

  fab.addEventListener("click", () => setOpen(panel.hidden));
  panel.querySelectorAll("[data-quick-close]").forEach((link) =>
    link.addEventListener("click", () => setOpen(false))
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      setOpen(false);
      fab.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!panel.hidden && !root.contains(event.target)) setOpen(false);
  });

  if ("IntersectionObserver" in window) {
    // The hero CTA is only "still on screen" while a decent slice of it is visible.
    new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        syncVisibility();
      },
      { threshold: 0, rootMargin: "-45% 0px 0px 0px" }
    ).observe(hero);

    new IntersectionObserver(
      ([entry]) => {
        contactVisible = entry.isIntersecting;
        syncVisibility();
      },
      { threshold: 0 }
    ).observe(contact);
  } else {
    heroVisible = false;
    syncVisibility();
  }

  setOpen(false);
  window.I18N.onChange(() => setOpen(!panel.hidden));
}

/**
 * Submits to Formspree over fetch so the visitor stays on the page. The form's
 * action attribute is the single source of truth for the endpoint; without JS the
 * plain POST to that same action still works.
 */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const submit = form.querySelector('button[type="submit"]');

  const setStatus = (state, message) => {
    status.textContent = message;
    status.classList.toggle("is-success", state === "success");
    status.classList.toggle("is-error", state === "error");
    status.classList.toggle("is-visible", Boolean(message));
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      // Optional fields live in a collapsed <details>; open it so an invalid one is reachable.
      form.querySelectorAll("details").forEach((details) => {
        if (details.querySelector(":invalid")) details.open = true;
      });
      form.reportValidity();
      return;
    }

    const restoreLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = window.I18N.t("form.sending");
    setStatus(null, "");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Formspree responded " + response.status);

      setStatus("success", window.I18N.t("form.success"));
      form.reset();
    } catch (error) {
      console.error("[Charged Development] Enquiry submission failed:", error);
      setStatus("error", window.I18N.t("form.error"));
    } finally {
      submit.disabled = false;
      submit.textContent = restoreLabel;
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

document.getElementById("year").textContent = String(new Date().getFullYear());

initHeader();
initMobileNav();
initWorkFilter();
initQuickContact();
initContactForm();
