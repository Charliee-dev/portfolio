/* VELIX case study interactions */
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

        window.requestAnimationFrame(() => moveSlider(activeNavLink));
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

    const progress = document.querySelector(".progress");
    function updateProgress() {
        if (!progress) return;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
            : 0;
        progress.style.width = percentage + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

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

    function showImageFallback(image) {
        const galleryCard = image.closest(".gallery button");
        const frame = galleryCard || image.closest(".hero-media");
        if (!frame || frame.classList.contains("image-missing") || frame.classList.contains("media-missing")) {
            return;
        }

        image.hidden = true;
        frame.dataset.placeholder = image.alt || "Project preview";

        if (galleryCard) {
            galleryCard.classList.add("image-missing");
            galleryCard.dataset.imageUnavailable = "true";
            galleryCard.setAttribute("aria-disabled", "true");
            galleryCard.title = "This image preview is unavailable.";
        } else {
            frame.classList.add("media-missing");
        }
    }

    document.querySelectorAll(".hero-media img, .gallery img").forEach(image => {
        image.addEventListener("error", () => showImageFallback(image), { once: true });
        if (image.complete && image.naturalWidth === 0) showImageFallback(image);
    });

    const lightbox = document.getElementById("lightbox");
    const viewer = document.getElementById("viewer");
    const caption = document.getElementById("caption");
    const closeButton = document.getElementById("close");
    let previousFocus = null;

    function openLightbox(imagePath, title, trigger) {
        if (!lightbox || !viewer || !caption || !imagePath) return;
        previousFocus = trigger || document.activeElement;
        viewer.src = imagePath;
        viewer.alt = title ? title + " expanded view" : "Expanded project image";
        caption.textContent = title || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (closeButton) closeButton.focus();
    }

    function closeLightbox() {
        if (!lightbox || !lightbox.classList.contains("open")) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (viewer) viewer.removeAttribute("src");
        if (previousFocus && previousFocus.isConnected) previousFocus.focus();
        previousFocus = null;
    }

    document.querySelectorAll("[data-image]").forEach(button => {
        button.addEventListener("click", () => {
            if (button.dataset.imageUnavailable === "true") return;
            const title = button.querySelector("b")?.textContent.trim() || "";
            openLightbox(button.dataset.image, title, button);
        });
    });

    if (closeButton) closeButton.addEventListener("click", closeLightbox);
    if (lightbox) {
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeLightbox();
    });
})();
