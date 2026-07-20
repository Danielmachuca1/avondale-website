/* ============================================================
   AVONDALE — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Nav: solid on scroll ---------- */
  var nav = document.getElementById("nav");
  var hero = document.querySelector(".hero");
  function onScroll() {
    var threshold = hero ? hero.offsetHeight - 90 : 120;
    if (window.scrollY > threshold) nav.classList.add("solid");
    else nav.classList.remove("solid");
    // hero parallax
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = "scale(1.06) translateY(" + (window.scrollY * 0.18) + "px)";
    }
  }
  var heroBg = document.getElementById("heroBg");
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Scroll reveals ---------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal:not(.in)");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Planning timeline: hide scroll cue once explored ---------- */
  var ppScroll = document.querySelector(".pp-scroll");
  var ppCue = document.getElementById("ppCue");
  if (ppScroll && ppCue) {
    var hideCue = function () {
      if (ppScroll.scrollLeft > 24) {
        ppCue.classList.add("is-hidden");
        ppScroll.removeEventListener("scroll", hideCue);
      }
    };
    ppScroll.addEventListener("scroll", hideCue, { passive: true });
  }

  /* ---------- Form validation ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    function validateField(wrap) {
      var input = wrap.querySelector("input, textarea");
      if (!input || !input.hasAttribute("required")) return true;
      var val = (input.value || "").trim();
      var ok = val.length > 0;
      if (ok && input.type === "email") {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      wrap.classList.toggle("invalid", !ok);
      return ok;
    }

    form.querySelectorAll("[data-field] input, [data-field] textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        var wrap = input.closest("[data-field]");
        if (wrap.classList.contains("invalid")) validateField(wrap);
      });
      input.addEventListener("input", function () {
        var wrap = input.closest("[data-field]");
        if (wrap.classList.contains("invalid")) validateField(wrap);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll("[data-field]");
      var allOk = true;
      fields.forEach(function (wrap) {
        if (!validateField(wrap)) allOk = false;
      });
      if (!allOk) {
        var firstBad = form.querySelector("[data-field].invalid input, [data-field].invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var interests = Array.prototype.map.call(form.querySelectorAll('input[name="interest"]:checked'), function (i) { return i.value; });
      var recipients = [];
      if (interests.indexOf("Media Enquiries") !== -1) {
        recipients.push("jrobinson@turnerstudio.com.au", "contact@avondale.com.au");
      }
      if (interests.indexOf("Community Enquiries") !== -1) {
        recipients.push("jrobinson@turnerstudio.com.au");
      }
      recipients = recipients.filter(function (v, i) { return recipients.indexOf(v) === i; });
      if (recipients.length) {
        var first = form.querySelector('[name="first"]').value;
        var last = form.querySelector('[name="last"]').value;
        var email = form.querySelector('[name="email"]').value;
        var phone = form.querySelector('[name="phone"]').value;
        var details = form.querySelector('[name="details"]').value;
        var subject = "Avondale Lodge & Spa Enquiry — " + interests.join(", ");
        var body = "Name: " + first + " " + last + "\nEmail: " + email + "\nPhone: " + phone + "\n\n" + details;
        window.location.href = "mailto:" + recipients.join(",") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      }

      form.classList.add("sent");
      form.querySelector(".form__thanks").setAttribute("tabindex", "-1");
      form.querySelector(".form__thanks").focus();
    });
  }
})();
