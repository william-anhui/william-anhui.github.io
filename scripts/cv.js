(function () {
  "use strict";

  // floating contact button: show once the hero is scrolled past
  var fab = document.getElementById("floatCta");
  if (fab) {
    var toggleFab = function () {
      var contact = document.getElementById("contact");
      var nearEnd = contact && contact.getBoundingClientRect().top < window.innerHeight * 0.6;
      fab.classList.toggle("show", window.scrollY > 500 && !nearEnd);
    };
    window.addEventListener("scroll", toggleFab, { passive: true });
    toggleFab();
  }

  var targets = document.querySelectorAll(".sec-title, .stat, .skill-card, .project, .t-item, #education .card, #more .card, .cta-card");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window)) return;

  targets.forEach(function (el, i) {
    var dir = "up";
    if (el.classList.contains("sec-title")) dir = "left";
    else if (el.classList.contains("t-item")) dir = i % 2 ? "right" : "left";
    else if (el.classList.contains("project") || el.classList.contains("skill-card")) dir = i % 2 ? "right" : "left";
    el.classList.add("reveal", "from-" + dir);
    // stagger siblings in the same grid row
    var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = Math.min(idx % 4, 3) * 90 + "ms";
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  targets.forEach(function (el) { io.observe(el); });

  // subtle parallax on hero orbs
  var orbs = document.querySelectorAll(".orb");
  if (!reduce) window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > 900) return;
    orbs.forEach(function (o, i) {
      o.style.translate = "0 " + (y * (0.08 + i * 0.05)) + "px";
    });
  }, { passive: true });
})();
