/* Diridari Spins — main.js (vanilla) */
(function () {
  "use strict";

  /* 1. Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* 2 + 3. Casino search + sort */
  var tables = document.querySelectorAll(".casino-table");
  var searchInputs = document.querySelectorAll("[data-casino-search]");
  var noResults = document.querySelector(".no-results");
  function getRows(table) { return Array.prototype.slice.call(table.querySelectorAll(".row")); }
  function applyFilter(term) {
    term = (term || "").trim().toLowerCase();
    var anyVisible = false;
    tables.forEach(function (table) {
      getRows(table).forEach(function (row) {
        var name = (row.getAttribute("data-name") || "").toLowerCase();
        var bonus = (row.textContent || "").toLowerCase();
        var match = !term || name.indexOf(term) !== -1 || bonus.indexOf(term) !== -1;
        row.style.display = match ? "" : "none";
        if (match) anyVisible = true;
      });
    });
    if (noResults) noResults.classList.toggle("show", !anyVisible);
  }
  searchInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      searchInputs.forEach(function (other) { if (other !== input) other.value = input.value; });
      applyFilter(input.value);
    });
    if (input.form) { input.form.addEventListener("submit", function (e) { e.preventDefault(); }); }
  });
  var sortBtn = document.querySelector("[data-sort-rating]");
  if (sortBtn) {
    var descending = true;
    sortBtn.addEventListener("click", function () {
      tables.forEach(function (table) {
        var body = table.querySelector("tbody") || table;
        var rows = getRows(table);
        rows.sort(function (a, b) {
          var ra = parseFloat(a.getAttribute("data-rating")) || 0;
          var rb = parseFloat(b.getAttribute("data-rating")) || 0;
          return descending ? rb - ra : ra - rb;
        });
        rows.forEach(function (r) { body.appendChild(r); });
      });
      descending = !descending;
      sortBtn.textContent = descending ? "Beste zuerst" : "Schlechteste zuerst";
    });
  }

  /* 4. Cookie consent */
  var banner = document.getElementById("cookie-banner");
  if (banner) {
    var STORAGE_KEY = "diridari_cookie_choice";
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!stored) { setTimeout(function () { banner.classList.add("show"); }, 600); }
    banner.addEventListener("click", function (e) {
      var choice = e.target.getAttribute("data-cookie");
      if (!choice) return;
      try { localStorage.setItem(STORAGE_KEY, choice); } catch (err) {}
      banner.classList.remove("show");
    });
  }

  /* 5. Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 6. Bonus calculator */
  function eur(n) { return "€" + Math.round(n).toLocaleString("de-AT"); }
  Array.prototype.forEach.call(document.querySelectorAll("[data-bonus-calc]"), function (calc) {
    var num = calc.querySelector("[data-calc-input]");
    var range = calc.querySelector("[data-calc-range]");
    if (!num) return;
    var match = parseFloat(calc.getAttribute("data-match")) || 0;
    var maxAttr = calc.getAttribute("data-max");
    var max = maxAttr ? parseFloat(maxAttr) : Infinity;
    var min = parseFloat(calc.getAttribute("data-min")) || 0;
    var wager = parseFloat(calc.getAttribute("data-wager")) || 0;
    var base = calc.getAttribute("data-wager-base") || "bonus";
    var fs = calc.getAttribute("data-fs") || "0";
    function setText(sel, val) { var el = calc.querySelector(sel); if (el) el.textContent = val; }
    function update(value) {
      var dep = parseFloat(value) || 0;
      var bonus = Math.min(dep * match / 100, max);
      var total = dep + bonus;
      var wbase = base === "total" ? total : bonus;
      setText("[data-calc-bonus]", eur(bonus));
      setText("[data-calc-total]", eur(total));
      setText("[data-calc-fs]", fs);
      setText("[data-calc-wager]", eur(wbase * wager));
      var warn = calc.querySelector("[data-calc-warn]");
      if (warn) warn.style.display = (dep > 0 && dep < min) ? "block" : "none";
    }
    num.addEventListener("input", function () { if (range) range.value = num.value; update(num.value); });
    if (range) { range.addEventListener("input", function () { num.value = range.value; update(range.value); }); }
    update(num.value);
  });

  /* 7. Mega-menus (click/tap toggle) — handles all dropdowns */
  var megas = document.querySelectorAll(".nav-mega");
  Array.prototype.forEach.call(megas, function (mega) {
    var mbtn = mega.querySelector(".nav-mega-btn");
    if (!mbtn) return;
    mbtn.addEventListener("click", function (e) {
      e.preventDefault();
      Array.prototype.forEach.call(megas, function (other) {
        if (other !== mega) {
          other.classList.remove("open");
          var ob = other.querySelector(".nav-mega-btn");
          if (ob) ob.setAttribute("aria-expanded", "false");
        }
      });
      var open = mega.classList.toggle("open");
      mbtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    Array.prototype.forEach.call(megas, function (mega) {
      if (!mega.contains(e.target)) {
        mega.classList.remove("open");
        var b = mega.querySelector(".nav-mega-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      Array.prototype.forEach.call(megas, function (mega) {
        mega.classList.remove("open");
        var b = mega.querySelector(".nav-mega-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }
  });
})();
