/**
 * Shared interactions for the portfolio pages.
 */

(() => {
  "use strict";

  /* ---- Utils ---- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const Copyright = {
    init() {
      const year = new Date().getFullYear();
      $$("#copyright").forEach(el => {
        el.textContent = `© ${year} Chiranjeev Deka`;
      });
    }
  };

  /* ---- Theme ---- */
  const Theme = {
    init() {
      this.btn = $("#themeToggle");
      if (!this.btn) return;

      this.colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
      let theme = "auto";
      try { theme = localStorage.getItem("theme") || "auto"; } catch (e) {}
      this.apply(theme);

      this.btn.addEventListener("click", () => this.toggle());
      const handlePreferenceChange = () => {
        if (this.isAuto) this.apply("auto");
      };
      if (this.colorScheme.addEventListener) {
        this.colorScheme.addEventListener("change", handlePreferenceChange);
      } else if (this.colorScheme.addListener) {
        this.colorScheme.addListener(handlePreferenceChange);
      }
    },

    apply(theme) {
      const prefersDark = this.colorScheme.matches;
      const isDark = theme === "dark" || (theme === "auto" && prefersDark);

      this.isAuto = theme === "auto";
      document.documentElement.dataset.theme = isDark ? "dark" : "light";

      this.btn.innerHTML = isDark
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"></path></svg>';
      this.btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      this.btn.setAttribute("aria-pressed", String(isDark));
    },

    toggle() {
      const current = document.documentElement.dataset.theme;
      const next = current === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", next); } catch (e) {}
      this.apply(next);
    }
  };

  /* ---- Navbar Scroll Effect ---- */
  const Navbar = {
    init() {
      this.el = $(".navbar");
      if (!this.el) return;
      this.ticking = false;
      window.addEventListener("scroll", () => this.onScroll(), { passive: true });
    },

    onScroll() {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        this.el.classList.toggle("is-scrolled", y > 10);
        this.ticking = false;
      });
    }
  };

  const Reveal = {
    init() {
      this.items = $$(".reveal");
      if (!this.items.length) return;

      if (!("IntersectionObserver" in window)) {
        this.items.forEach(el => el.classList.add("visible"));
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.items.forEach(el => el.classList.add("visible"));
        return;
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      });

      this.items.forEach(el => this.observer.observe(el));
    }
  };

  const SideNav = {
    init() {
      this.links = $$(".side-nav-link");
      this.sections = this.links
        .map(a => document.getElementById((a.getAttribute("href") || "").slice(1)))
        .filter(Boolean);
      if (!this.links.length || !this.sections.length) return;

      this.update();
      window.addEventListener("scroll", () => this.update(), { passive: true });
      window.addEventListener("resize", () => this.update());
    },

    update() {
      const triggerLine = window.innerHeight * 0.4;
      let current = this.sections[0];

      this.sections.forEach(section => {
        if (section.getBoundingClientRect().top <= triggerLine) current = section;
      });

      this.links.forEach(link => {
        const active = link.getAttribute("href") === "#" + current.id;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  };

  const StackTabs = {
    init() {
      this.tabs = $$(".stack-tab");
      this.panels = $$(".stack-panel");
      if (!this.tabs.length || !this.panels.length) return;

      this.tabs.forEach(tab => {
        tab.addEventListener("click", () => this.activate(tab));
        tab.addEventListener("keydown", event => this.onKeyDown(event, tab));
      });
      this.activate(this.tabs.find(tab => tab.getAttribute("aria-selected") === "true") || this.tabs[0]);
    },

    onKeyDown(event, tab) {
      const index = this.tabs.indexOf(tab);
      let nextIndex;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % this.tabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + this.tabs.length) % this.tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = this.tabs.length - 1;
      else return;

      event.preventDefault();
      const next = this.tabs[nextIndex];
      this.activate(next);
      next.focus();
    },

    activate(tab) {
      const key = tab.dataset.stack;
      this.tabs.forEach(t => {
        const on = t === tab;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      this.panels.forEach(p => {
        const on = p.dataset.panel === key;
        p.classList.toggle("active", on);
        p.hidden = !on;
      });
    }
  };

  const Lightbox = {
    init() {
      this.box = $("#lightbox");
      this.img = $("#lightbox-img");
      this.caption = $("#lightbox-caption");
      this.closeBtn = $("#lightbox-close");
      this.triggers = $$("[data-lightbox]");
      this.lastFocus = null;

      if (!this.box || !this.triggers.length) return;

      this.triggers.forEach(el => {
        el.addEventListener("click", () => this.open(el.dataset.lightbox, el.dataset.caption || "", el));
        el.addEventListener("keydown", event => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          this.open(el.dataset.lightbox, el.dataset.caption || "", el);
        });
      });

      if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.close());
      this.box.addEventListener("click", (e) => { if (e.target === this.box) this.close(); });
      document.addEventListener("keydown", (event) => this.onKeyDown(event));
    },

    onKeyDown(event) {
      if (!this.box?.classList.contains("open")) return;
      if (event.key === "Escape") {
        this.close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = [...this.box.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex=\"-1\"])")];
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
    },

    open(src, caption, trigger) {
      if (!this.box || !this.img) return;
      this.lastFocus = trigger || document.activeElement;
      this.img.src = src;
      this.img.alt = caption ? `${caption} (expanded)` : "Expanded image";
      if (this.caption) this.caption.textContent = caption;
      this.box.classList.add("open");
      this.box.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      if (this.closeBtn) this.closeBtn.focus();
    },

    close() {
      if (!this.box || !this.box.classList.contains("open")) return;
      this.box.classList.remove("open");
      this.box.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      if (this.img) this.img.removeAttribute("src");
      if (this.lastFocus && this.lastFocus.isConnected) this.lastFocus.focus();
      this.lastFocus = null;
    }
  };

  function init() {
    document.documentElement.classList.add("js");
    Theme.init();
    Copyright.init();
    Navbar.init();
    Reveal.init();
    SideNav.init();
    StackTabs.init();
    Lightbox.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
