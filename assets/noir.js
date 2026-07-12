/* ============================================================
   Medz Web Services — "Noir" homepage behaviour
   Progressive enhancement only: the page reads fine without JS
   (the nav simply stays in its expanded state).
   Per the design spec: no cursor customization, no scroll reveals.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- nav: condensed style once scrolled past 40px ---------- */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- nav: mobile toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(links.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

})();
