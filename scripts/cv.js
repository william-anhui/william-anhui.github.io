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

  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // 3D tilt + glare: enabled per card once its reveal transition has finished
  function enableTilt(el) {
    var big = el.offsetWidth > 600;
    var max = el.classList.contains("cta-card") ? 2 : big ? 2.5 : 9;
    el.style.transitionDelay = "";
    el.classList.add("tilt");
    el.addEventListener("pointermove", function (ev) {
      var r = el.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width;
      var py = (ev.clientY - r.top) / r.height;
      el.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - py) * 2 * max).toFixed(2) + "deg");
      el.style.setProperty("--mx", (ev.clientX - r.left).toFixed(0) + "px");
      el.style.setProperty("--my", (ev.clientY - r.top).toFixed(0) + "px");
    });
    el.addEventListener("pointerleave", function () {
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        el.classList.add("in");
        io.unobserve(el);
        if (fine && !el.classList.contains("sec-title")) {
          var delay = parseFloat(el.style.transitionDelay) || 0;
          setTimeout(function () { enableTilt(el); }, 900 + delay);
        }
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  targets.forEach(function (el) { io.observe(el); });

  // hero: orbs parallax on scroll and mouse, avatar stage tilts toward the cursor
  var orbs = document.querySelectorAll(".orb");
  var stage = document.getElementById("photoStage");
  var hero = document.querySelector(".hero");
  var mouseX = 0, mouseY = 0;

  function moveOrbs() {
    if (reduce) return;
    var y = window.scrollY;
    if (y > 900) return;
    orbs.forEach(function (o, i) {
      var k = 0.08 + i * 0.05;
      o.style.translate = (mouseX * (i + 1) * 14) + "px " + (y * k + mouseY * (i + 1) * 10) + "px";
    });
  }

  window.addEventListener("scroll", moveOrbs, { passive: true });

  if (fine && hero) {
    hero.addEventListener("pointermove", function (ev) {
      var r = hero.getBoundingClientRect();
      mouseX = (ev.clientX - r.left) / r.width - 0.5;
      mouseY = (ev.clientY - r.top) / r.height - 0.5;
      if (stage) {
        stage.style.setProperty("--hx", (mouseX * 36).toFixed(1) + "deg");
        stage.style.setProperty("--hy", (-mouseY * 28).toFixed(1) + "deg");
      }
      moveOrbs();
    });
    hero.addEventListener("pointerleave", function () {
      mouseX = mouseY = 0;
      if (stage) { stage.style.removeProperty("--hx"); stage.style.removeProperty("--hy"); }
      moveOrbs();
    });
  }
})();
