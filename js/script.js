/* ==========================================================================
   Elixir Cleaning Services — interactions
   Vanilla JS only. No dependencies. Progressive enhancement.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  /* ---------- Header state + floating actions ------------------------- */
  var header = document.getElementById("site-header");
  var floatBox = document.getElementById("action-float");
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (floatBox) floatBox.classList.toggle("is-visible", y > 520);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Mobile navigation --------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");
  var body = document.body;
  var lastFocused = null;
  var firstLink = null;

  function focusables() {
    if (!menu) return [];
    return Array.prototype.slice
      .call(menu.querySelectorAll("a[href], button:not([disabled])"))
      .filter(function (el) {
        return el.offsetParent !== null;
      });
  }

  function openMenu() {
    if (!menu || !toggle) return;
    lastFocused = document.activeElement;
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    body.classList.add("is-locked", "is-menu-open");
    window.requestAnimationFrame(function () {
      menu.classList.add("is-open");
      firstLink = focusables()[0];
      if (firstLink) firstLink.focus({ preventScroll: true });
    });
  }

  function closeMenu(restoreFocus) {
    if (!menu || !toggle) return;
    var wasOpen = toggle.getAttribute("aria-expanded") === "true";
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    body.classList.remove("is-locked", "is-menu-open");
    menu.hidden = true;
    if (wasOpen && restoreFocus !== false && lastFocused && lastFocused.focus) {
      lastFocused.focus({ preventScroll: true });
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    menu.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link) closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key === "Tab") {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000 && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu(false);
      }
    });
  }

  /* ---------- Active section in desktop nav --------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a[href^='#']"));
  var watched = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return { link: link, section: document.getElementById(id) };
    })
    .filter(function (pair) {
      return pair.section;
    });

  if ("IntersectionObserver" in window && watched.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          watched.forEach(function (pair) {
            pair.link.classList.toggle("is-active", pair.section === entry.target);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    watched.forEach(function (pair) {
      navObserver.observe(pair.section);
    });
  }

  /* ---------- Accordion ----------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-accordion]"), function (group) {
    var triggers = Array.prototype.slice.call(group.querySelectorAll(".accordion-trigger"));

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var item = trigger.closest(".accordion-item");
        var isOpen = item.classList.contains("is-open");

        triggers.forEach(function (other) {
          var otherItem = other.closest(".accordion-item");
          if (otherItem !== item && otherItem.classList.contains("is-open")) {
            otherItem.classList.remove("is-open");
            other.setAttribute("aria-expanded", "false");
          }
        });

        item.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  });

  /* ---------- Reveal on scroll ---------------------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (revealItems.length) {
    if (!("IntersectionObserver" in window) || reduceMotion.matches) {
      revealItems.forEach(function (el) {
        el.classList.add("is-revealed");
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealItems.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- Quote form -> email draft ------------------------------- */
  var form = document.getElementById("quote-form");

  if (form) {
    var status = document.getElementById("form-status");

    function setInvalid(field, message) {
      if (!status) return;
      field.setAttribute("aria-invalid", "true");
      status.textContent = message;
      status.classList.add("is-error");
      field.focus({ preventScroll: false });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.querySelector("#qf-name");
      var email = form.querySelector("#qf-email");
      var phone = form.querySelector("#qf-phone");
      var town = form.querySelector("#qf-town");
      var date = form.querySelector("#qf-date");
      var service = form.querySelector("#qf-service");
      var message = form.querySelector("#qf-message");

      [name, email].forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });
      if (status) {
        status.classList.remove("is-error");
        status.textContent = "";
      }

      if (!name.value.trim()) {
        setInvalid(name, "Please add your name so we know who we are replying to.");
        return;
      }

      var emailValue = email.value.trim();
      if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
        setInvalid(email, "Please add a valid email address — that is where the quote will be sent.");
        return;
      }

      var subject =
        "Quote request — " +
        (service.value || "Cleaning") +
        (town.value.trim() ? " · " + town.value.trim() : "");

      var lines = [
        "Name: " + name.value.trim(),
        "Email: " + emailValue,
        "Phone: " + (phone.value.trim() || "—"),
        "Property town: " + (town.value.trim() || "—"),
        "Next check-out: " + (date.value || "—"),
        "Service needed: " + service.value,
        "",
        "Property details:",
        message.value.trim() || "—"
      ];

      var mailto =
        "mailto:info@elixircleaningservices.ca?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      if (status) {
        status.classList.remove("is-error");
        status.textContent =
          "Opening your email app with these details. If nothing opens, email info@elixircleaningservices.ca directly.";
      }

      window.location.href = mailto;
    });
  }

  /* ---------- Footer year --------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
