// Spotless Days Cleaning — site behaviour (no dependencies)
(function () {
  "use strict";

  var CONTACT_EMAIL = "spotlessdayscleaning@gmail.com";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var close = function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        close();
        toggle.focus();
      }
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Quote form: checks the fields, then opens the visitor's email app
  // with the request filled in and addressed to the business.
  var form = document.getElementById("quote-form");
  if (form) {
    var status = document.getElementById("form-status");
    var fields = form.querySelectorAll("input, textarea");

    var isValid = function (input) {
      var value = input.value.trim();
      if (!value) return false;
      if (input.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return true;
    };
    var mark = function (input, bad) {
      input.closest(".field").classList.toggle("invalid", bad);
      input.setAttribute("aria-invalid", bad ? "true" : "false");
    };

    Array.prototype.forEach.call(fields, function (input) {
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("invalid") && isValid(input)) mark(input, false);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Array.prototype.forEach.call(fields, function (input) {
        var bad = !isValid(input);
        mark(input, bad);
        if (bad && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;

      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("Quote request from " + name) +
        "&body=" + encodeURIComponent(body);

      if (status) { status.hidden = false; status.focus(); }
    });
  }

  // Scroll reveal: fades marked blocks in as they enter the screen.
  var targets = document.querySelectorAll("[data-reveal], [data-reveal-group] > *");
  if (!targets.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  Array.prototype.forEach.call(targets, function (el) {
    if (el.parentElement && el.parentElement.hasAttribute("data-reveal-group")) {
      var i = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.transitionDelay = Math.min(i, 4) * 90 + "ms";
    }
    el.classList.add("reveal");
    io.observe(el);
  });
})();
