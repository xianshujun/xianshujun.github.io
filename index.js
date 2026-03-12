// ===== Scroll-triggered fade-in =====
const faders = document.querySelectorAll(".fade-in");

const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
};

const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

faders.forEach(function (el) {
    fadeObserver.observe(el);
});

// ===== Navbar shadow on scroll =====
var navbar = document.querySelector(".navbar");
window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// ===== Language toggle =====
var currentLang = "zh";
var langBtn = document.getElementById("lang-toggle");

if (langBtn) {
    langBtn.addEventListener("click", function () {
        currentLang = currentLang === "zh" ? "en" : "zh";
        var els = document.querySelectorAll("[data-zh][data-en]");
        els.forEach(function (el) {
            el.textContent = el.getAttribute("data-" + currentLang);
        });
        langBtn.textContent = currentLang === "zh" ? "EN / 中" : "中 / EN";
    });
}
