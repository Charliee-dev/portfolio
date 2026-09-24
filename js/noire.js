/* NOIRE case study interactions */
(() => {
    "use strict";

    const themeToggle = document.getElementById("themeToggle");

    function applyTheme(theme) {
        const light = theme === "light";
        document.body.classList.toggle("light-mode", light);

        if (themeToggle) {
            themeToggle.textContent = light ? "\uD83C\uDF19" : "\u2600\uFE0F";
            themeToggle.setAttribute(
                "aria-label",
                light ? "Switch to dark mode" : "Switch to light mode"
            );
            themeToggle.setAttribute("aria-pressed", String(light));
        }
    }

    let savedTheme = "dark";
    try {
        savedTheme = localStorage.getItem("theme") || "dark";
    } catch (error) {
        // Storage may be disabled by the browser.
    }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
            try {
                localStorage.setItem("theme", nextTheme);
            } catch (error) {
                // The toggle still works for this page view.
            }
            applyTheme(nextTheme);
        });
    }

    const clock = document.getElementById("clock");
    function updateClock() {
        if (!clock) return;
        clock.textContent = new Date().toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    }
    updateClock();
    window.setInterval(updateClock, 30000);

    const navContainer = document.querySelector(".nav-links");
    const activeNavLink = document.querySelector(".nav-links .active-nav");
    if (navContainer && activeNavLink) {
        const slider = document.createElement("span");
        slider.className = "nav-slider";
        slider.setAttribute("aria-hidden", "true");
        navContainer.appendChild(slider);

        function moveSlider(link) {
            const containerRect = navContainer.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            slider.style.width = linkRect.width + "px";
            slider.style.transform = "translate3d(" + (linkRect.left - containerRect.left) + "px, 0, 0)";
        }

        moveSlider(activeNavLink);
        navContainer.querySelectorAll("a").forEach(link => {
            link.addEventListener("mouseenter", () => moveSlider(link));
            link.addEventListener("focus", () => moveSlider(link));
        });
        navContainer.addEventListener("mouseleave", () => moveSlider(activeNavLink));
        navContainer.addEventListener("focusout", event => {
            if (!navContainer.contains(event.relatedTarget)) moveSlider(activeNavLink);
        });
        window.addEventListener("resize", () => moveSlider(activeNavLink));
    }

    const progressBar = document.querySelector(".top-progress-bar");
    const scrollNumber = document.querySelector(".hud-scroll .scroll-number");
    const hudLinks = Array.from(document.querySelectorAll(".hud-link"));
    const hudSections = hudLinks
        .map(link => document.getElementById((link.getAttribute("href") || "").slice(1)))
        .filter(Boolean);

    function updateScrollUI() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
            : 0;

        if (progressBar) progressBar.style.width = percentage + "%";
        if (scrollNumber) scrollNumber.textContent = Math.round(percentage) + "%";

        if (hudLinks.length && hudSections.length) {
            const activationLine = window.innerHeight * 0.38;
            let currentSection = hudSections[0];
            hudSections.forEach(section => {
                if (section.getBoundingClientRect().top <= activationLine) currentSection = section;
            });

            hudLinks.forEach(link => {
                const selected = link.getAttribute("href") === "#" + currentSection.id;
                link.classList.toggle("active", selected);
                if (selected) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        }
    }

    let scrollFrame = 0;
    function scheduleScrollUIUpdate() {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(() => {
            scrollFrame = 0;
            updateScrollUI();
        });
    }
    window.addEventListener("scroll", scheduleScrollUIUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUIUpdate);
    updateScrollUI();

    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("show"));
    }

    document.querySelectorAll(".stack-tab").forEach(tab => {
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", String(tab.classList.contains("active")));
        tab.setAttribute("tabindex", tab.classList.contains("active") ? "0" : "-1");
        const panel = document.querySelector('.stack-panel[data-panel="' + tab.dataset.stack + '"]');
        if (panel) {
            if (!panel.id) panel.id = "stack-panel-" + tab.dataset.stack;
            tab.setAttribute("aria-controls", panel.id);
            panel.setAttribute("role", "tabpanel");
            panel.setAttribute("aria-labelledby", tab.id || (tab.id = "stack-tab-" + tab.dataset.stack));
        }

        tab.addEventListener("click", () => {
            const selectedKey = tab.dataset.stack;
            document.querySelectorAll(".stack-tab").forEach(otherTab => {
                const selected = otherTab === tab;
                otherTab.classList.toggle("active", selected);
                otherTab.setAttribute("aria-selected", String(selected));
                otherTab.setAttribute("tabindex", selected ? "0" : "-1");
            });
            document.querySelectorAll(".stack-panel").forEach(panelItem => {
                const selected = panelItem.dataset.panel === selectedKey;
                panelItem.classList.toggle("active", selected);
                panelItem.hidden = !selected;
            });
        });
    });

    document.querySelectorAll(".stack-panel").forEach(panel => {
        panel.hidden = !panel.classList.contains("active");
    });

    function showImageFallback(image) {
        const frame = image.closest(".hero-image, .screen-image");
        if (!frame || frame.classList.contains("media-missing")) return;
        frame.classList.add("media-missing");
        frame.dataset.placeholder = image.alt || "Project preview";
        image.hidden = true;
    }

    document.querySelectorAll(".hero-image img, .screen-image img").forEach(image => {
        image.addEventListener("error", () => showImageFallback(image), { once: true });
        if (image.complete && image.naturalWidth === 0) showImageFallback(image);
    });

    const finePointer = window.matchMedia
        && window.matchMedia("(hover: hover) and (pointer: fine)").matches
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (finePointer) {
        document.querySelectorAll(".screen-card, .hero-image").forEach(card => {
            card.addEventListener("pointermove", event => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                card.style.transform = "perspective(1000px) rotateX(" + (-y * 1.2) + "deg) rotateY(" + (x * 1.2) + "deg) translateY(-3px)";
            });
            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }
})();
