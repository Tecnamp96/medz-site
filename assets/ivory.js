/* ============================================================
   Medz Web Services — "Ivory" homepage behaviour
   Progressive enhancement only: the page reads fine without JS
   (a tiny inline <head> script adds the .js class that gates the
   hidden entrance states, so no-JS visitors see everything).
   All motion respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia &&
    window.matchMedia('(pointer: fine)').matches;

  /* ---------- nav: condensed style once scrolled past 40px ---------- */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onNavScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
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

  /* ---------- hero: parallax background ----------
     The image is 130% of the hero's height, so a 0.3 drift never
     exposes an edge. Desktop fine pointers only. */
  var heroImg = document.querySelector('.hero-bg img');
  if (heroImg && !reducedMotion && finePointer) {
    var ticking = false;
    var onParallax = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        heroImg.style.transform = 'translate3d(0,' + (window.scrollY * 0.18) + 'px,0)';
        ticking = false;
      });
    };
    window.addEventListener('scroll', onParallax, { passive: true });
    onParallax();
  }

  /* ---------- soft entrances ---------- */
  var faders = Array.prototype.slice.call(document.querySelectorAll('[data-fade]'));
  if (faders.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      faders.forEach(function (el) { el.classList.add('in-view'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      faders.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- magnetic headings ----------
     Headings drift a few px toward the cursor; the CSS transition
     on transform provides the spring back. */
  if (finePointer && !reducedMotion) {
    var heads = document.querySelectorAll('h1, .sec-head h2, .about-title, .book-title');
    var MAX = 6;
    Array.prototype.forEach.call(heads, function (h) {
      h.addEventListener('pointermove', function (e) {
        var r = h.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        h.style.setProperty('--mx', (dx * MAX).toFixed(1) + 'px');
        h.style.setProperty('--my', (dy * MAX).toFixed(1) + 'px');
      });
      h.addEventListener('pointerleave', function () {
        h.style.setProperty('--mx', '0px');
        h.style.setProperty('--my', '0px');
      });
    });
  }

})();
