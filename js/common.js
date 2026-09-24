/* Shared theme preference for pages with a #themeToggle control. */
(() => {
    const toggle = document.getElementById("themeToggle");
    let light = false;
    try { light = localStorage.getItem("theme") === "light"; } catch {}
    if (!toggle) document.body.classList.toggle("light-mode", light);
})();
