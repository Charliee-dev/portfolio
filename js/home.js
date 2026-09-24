/* Home page interactions */
(() => {
    "use strict";

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
        // The page remains usable when browser storage is disabled.
    }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
            try {
                localStorage.setItem("theme", nextTheme);
            } catch (error) {
                // Theme switching still works for the current visit.
            }
            applyTheme(nextTheme);
        });
    }

    const navContainer = document.querySelector(".nav-links");
    const activeLink = document.querySelector(".nav-links .active-nav");

    if (navContainer && activeLink) {
        let slider = navContainer.querySelector(".nav-slider");

        if (!slider) {
            slider = document.createElement("span");
            slider.className = "nav-slider";
            slider.setAttribute("aria-hidden", "true");
            navContainer.appendChild(slider);
        }

        function moveSlider(link) {
            if (!link) return;
            const containerRect = navContainer.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            slider.style.width = linkRect.width + "px";
            slider.style.transform = "translate3d(" + (linkRect.left - containerRect.left) + "px, 0, 0)";
        }

        window.requestAnimationFrame(() => moveSlider(activeLink));
        navContainer.querySelectorAll("a").forEach(link => {
            link.addEventListener("mouseenter", () => moveSlider(link));
            link.addEventListener("focus", () => moveSlider(link));
        });
        navContainer.addEventListener("mouseleave", () => moveSlider(activeLink));
        navContainer.addEventListener("focusout", event => {
            if (!navContainer.contains(event.relatedTarget)) moveSlider(activeLink);
        });
        window.addEventListener("resize", () => moveSlider(activeLink));
    }

    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("is-visible"));
    }

    const canTilt = window.matchMedia
        && window.matchMedia("(hover: hover) and (pointer: fine)").matches
        && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canTilt) {
        document.querySelectorAll(".preview-card").forEach(card => {
            card.addEventListener("pointermove", event => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                card.style.transform = "perspective(1200px) rotateX(" + (-y * 1.4) + "deg) rotateY(" + (x * 1.4) + "deg) translateY(-4px)";
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }

    const copyright = document.querySelector(".footer-year");
    if (copyright) {
        copyright.textContent = "\u00A9 " + new Date().getFullYear() + " Chiranjeev Deka";
    }
})();
