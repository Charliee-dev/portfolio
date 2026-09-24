/* =========================================================
   PROJECTS PAGE INTERACTIONS
========================================================= */


/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {

    const clock = document.getElementById("clock");

    if (!clock) return;

    const now = new Date();

    clock.textContent =
        now.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });

}

updateClock();

setInterval(updateClock, 1000);


/* =========================================================
   NAVIGATION
========================================================= */

const navContainer =
    document.querySelector(".nav-links");

const navLinks =
    document.querySelectorAll(".nav-links a");

const activeLink =
    document.querySelector(".active-nav");

if (navContainer && activeLink) {

    const slider =
        document.createElement("div");

    slider.className = "nav-slider";

    navContainer.appendChild(slider);


    function moveSlider(link) {

        if (!link) return;

        slider.style.width =
            `${link.offsetWidth}px`;

        slider.style.transform =
            `translate3d(${link.offsetLeft}px, 0, 0)`;

    }


    moveSlider(activeLink);


    navLinks.forEach(link => {

        link.addEventListener(
            "mouseenter",
            () => moveSlider(link)
        );

    });


    navContainer.addEventListener(
        "mouseleave",
        () => moveSlider(activeLink)
    );


    window.addEventListener(
        "resize",
        () => moveSlider(activeLink)
    );

}


/* =========================================================
   THEME TOGGLE
========================================================= */

const themeToggle =
    document.getElementById("themeToggle");

if (themeToggle) {

    let savedTheme = "dark";

    try {
        savedTheme =
            localStorage.getItem("theme") || "dark";
    } catch {}

    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeToggle.textContent = "🌙";
        themeToggle.setAttribute("aria-label", "Switch to dark mode");

    } else {

        themeToggle.textContent = "☀️";
        themeToggle.setAttribute("aria-label", "Switch to light mode");

    }


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );

            const light =
                document.body.classList.contains(
                    "light-mode"
                );

            try {
                localStorage.setItem(
                    "theme",
                    light ? "light" : "dark"
                );
            } catch {}

            themeToggle.textContent =
                light ? "🌙" : "☀️";

            themeToggle.setAttribute(
                "aria-label",
                light ? "Switch to dark mode" : "Switch to light mode"
            );

        }
    );

}


/* =========================================================
   PROJECT CARD INTERACTION
========================================================= */

const cards =
    document.querySelectorAll(
        ".featured-project, .project-card"
    );

cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - .5) * -2;

            const rotateY =
                ((x / rect.width) - .5) * 2;

            card.style.transform =
                `perspective(1200px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-5px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".project-card, .featured-project"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: .12
        }
    );


revealElements.forEach(
    element =>
        revealObserver.observe(element)
);


/* =========================================================
   SMOOTH ANCHOR BEHAVIOUR
========================================================= */

document.documentElement.style.scrollBehavior =
    "smooth";
