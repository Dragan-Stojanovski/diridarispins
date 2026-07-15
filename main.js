/* Diridari Spins — main.js (vanilla) */
(function () {
  "use strict";

  /* 0. Inject mobile-accordion styles (keeps per-page HTML untouched) */
  (function injectAccCss() {
    var css = [
      ".mobile-panel .m-acc{padding:.3rem var(--gutter) .8rem;}",
      ".mobile-panel .m-home{display:block;padding:.9rem .2rem;font-weight:700;color:var(--nocht);border-bottom:1px solid var(--rand);}",
      ".mobile-panel .m-home[aria-current=\"page\"]{color:var(--almrot);}",
      ".mobile-panel .m-acc-item{border-bottom:1px solid var(--rand);}",
      ".mobile-panel .m-acc-btn{display:flex;width:100%;justify-content:space-between;align-items:center;gap:.5rem;background:none;border:0;padding:.95rem .2rem;font-family:inherit;font-size:var(--step-sm);font-weight:700;color:var(--nocht);cursor:pointer;text-align:left;}",
      ".mobile-panel .m-acc-btn .m-chev{transition:transform .2s ease;flex:none;color:var(--loden);}",
      ".mobile-panel .m-acc-item.open>.m-acc-btn{color:var(--almrot);}",
      ".mobile-panel .m-acc-item.open>.m-acc-btn .m-chev{transform:rotate(180deg);color:var(--almrot);}",
      ".mobile-panel .m-acc-panel{display:none;padding:0 0 .7rem;}",
      ".mobile-panel .m-acc-item.open>.m-acc-panel{display:block;}",
      ".mobile-panel .m-acc-panel .m-sub{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--almrot);font-weight:700;padding:.7rem .2rem .15rem;}",
      ".mobile-panel .m-acc-panel a{display:block;padding:.6rem .2rem .6rem .9rem;font-weight:600;color:var(--nocht);border-bottom:1px solid var(--rand);font-size:var(--step-sm);}",
      ".mobile-panel .m-acc-panel a.m-all{color:var(--almrot);font-weight:700;padding-left:.2rem;}"
    ].join("");
    var el = document.createElement("style");
    el.setAttribute("data-diridari", "mobile-acc");
    el.textContent = css;
    (document.head || document.documentElement).appendChild(el);
  })();

  /* 1. Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-panel");
  if (toggle && panel) {
    function sizePanel() {
      if (!panel.classList.contains("open")) return;
      // Cap the panel to the space between its top and the bottom of the
      // viewport so the menu scrolls internally instead of being clipped
      // by the sticky header.
      var top = panel.getBoundingClientRect().top;
      panel.style.maxHeight = Math.max(120, window.innerHeight - top) + "px";
    }
    function openMenu() {
      panel.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      sizePanel();
    }
    function closeMenu() {
      panel.classList.remove("open");
      panel.style.maxHeight = "";
      toggle.setAttribute("aria-expanded", "false");
      // collapse any expanded accordion section
      Array.prototype.forEach.call(panel.querySelectorAll(".m-acc-item.open"), function (it) {
        it.classList.remove("open");
        var b = it.querySelector(".m-acc-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }

    /* Transform the flat group list into a collapsing accordion:
       top-level sections (Online Casinos / Boni / Banking) closed by default;
       tapping one expands it and collapses the others. Links are MOVED, so
       each page keeps its own correct relative URLs. */
    function buildAccordion() {
      var ul = panel.querySelector("ul");
      if (!ul || panel.querySelector(".m-acc")) return;
      var groups = ul.querySelectorAll("li.m-group");
      if (!groups.length) return;

      var buckets = { oc: [], boni: [], bank: [] };
      var homeA = ul.querySelector("li:not(.m-group) a");

      Array.prototype.forEach.call(groups, function (li) {
        var span = li.querySelector("span");
        var label = span ? span.textContent.replace(/\s+/g, " ").trim() : "";
        var links = Array.prototype.slice.call(li.querySelectorAll("a"));
        var cat = "oc";
        if (label.indexOf("Boni") === 0) cat = "boni";
        else if (label.indexOf("Banking") === 0) cat = "bank";
        else if (label.indexOf("Online Casinos") === 0) cat = "oc";
        var sub = null, foot = false;
        if (label.indexOf("·") !== -1) sub = label.split("·").pop().trim();
        else if (label === "Boni" || label === "Banking" || label === "Online Casinos") foot = true;
        else sub = label; // e.g. "Zahlung & Auszahlung", "Nach Feature"
        buckets[cat].push({ sub: sub, links: links, foot: foot });
      });

      function panelFor(id) {
        var wrap = document.createElement("div");
        wrap.className = "m-acc-panel";
        wrap.id = "macc-" + id;
        buckets[id].forEach(function (g) {
          if (g.foot) {
            g.links.forEach(function (aEl) { aEl.className = "m-all"; wrap.appendChild(aEl); });
            return;
          }
          if (g.sub) {
            var h = document.createElement("span");
            h.className = "m-sub";
            h.textContent = g.sub;
            wrap.appendChild(h);
          }
          g.links.forEach(function (aEl) { wrap.appendChild(aEl); });
        });
        return wrap;
      }

      var acc = document.createElement("nav");
      acc.className = "m-acc";
      acc.setAttribute("aria-label", "Mobile Navigation");

      if (homeA) { homeA.className = "m-home"; acc.appendChild(homeA); }

      [["oc", "Online Casinos"], ["boni", "Boni"], ["bank", "Banking"]].forEach(function (d) {
        var id = d[0];
        var item = document.createElement("div");
        item.className = "m-acc-item";
        var btn = document.createElement("button");
        btn.className = "m-acc-btn";
        btn.type = "button";
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-controls", "macc-" + id);
        btn.innerHTML = d[1] + ' <svg class="m-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
        item.appendChild(btn);
        item.appendChild(panelFor(id));
        acc.appendChild(item);
      });

      panel.replaceChild(acc, ul);

      var accBtns = acc.querySelectorAll(".m-acc-btn");
      Array.prototype.forEach.call(accBtns, function (btn) {
        btn.addEventListener("click", function () {
          var item = btn.parentNode;
          var isOpen = item.classList.contains("open");
          Array.prototype.forEach.call(accBtns, function (b) {
            b.parentNode.classList.remove("open");
            b.setAttribute("aria-expanded", "false");
          });
          if (!isOpen) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
          sizePanel();
        });
      });
    }
    buildAccordion();

    toggle.addEventListener("click", function () {
      if (panel.classList.contains("open")) closeMenu(); else openMenu();
    });
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        closeMenu();
        toggle.focus();
      }
    });
    window.addEventListener("resize", sizePanel);
    window.addEventListener("orientationchange", function () { setTimeout(sizePanel, 150); });
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
