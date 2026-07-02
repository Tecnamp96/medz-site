/* ============================================================
   Medz Web Services — shared behaviour
   Replaces the support.js / DCLogic runtime (migration, July 2026).
   Everything here is progressive enhancement: the page reads fine
   with this file missing (see the <noscript> reveal override).
   ============================================================ */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav: condensed style once scrolled ---------- */
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

  /* ---------- staggered fade-up reveal ----------
     Manual JS tween that writes opacity directly — survives throttled
     paint timelines (carried over from the original build). Skipped
     entirely for reduced-motion users. */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reducedMotion) {
    items.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  } else {
    var dur = 650;
    items.forEach(function (el, i) {
      el.style.transition = 'none';
      var delay = 60 + i * 110;
      var startAt = performance.now() + delay;
      var step = function () {
        var p = Math.min(1, Math.max(0, (performance.now() - startAt) / dur));
        var e = 1 - Math.pow(1 - p, 3);
        el.style.opacity = String(e);
        el.style.transform = 'translateY(' + (16 * (1 - e)) + 'px)';
        if (p < 1) setTimeout(step, 16);
      };
      setTimeout(step, delay);
    });
  }

  /* ---------- signature Medz koru cursor trail ----------
     The maker's mark on every page. Desktop fine pointers only,
     and silent for anyone who prefers reduced motion. */
  (function initKoruTrail() {
    var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!fine || reducedMotion) return;

    // Pages in /work/ need to reach assets one level up.
    var prefix = /\/work\//.test(window.location.pathname) ? '../' : '';

    var cursorCss = document.createElement('style');
    cursorCss.textContent = '*, *::before, *::after { cursor: url("' + prefix +
      'assets/logo/koru-cursor.png") 30 30, auto !important; }';
    document.head.appendChild(cursorCss);

    var N = 7;
    var layer = document.createElement('div');
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = 'position:fixed; inset:0; z-index:60; pointer-events:none; overflow:hidden;';
    document.body.appendChild(layer);

    var dots = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);
      var img = document.createElement('img');
      img.src = prefix + 'assets/logo/medz-koru-solo-amber.svg';
      img.alt = '';
      var size = 26 - t * 16;               // 26px → 10px down the chain
      var baseOpacity = 0.55 * (1 - t) + 0.06;
      img.style.cssText = 'position:absolute; left:0; top:0; width:' + size + 'px; height:' + size +
        'px; opacity:' + baseOpacity.toFixed(3) +
        '; will-change:transform; filter:drop-shadow(0 2px 6px rgba(230,168,23,0.35));';
      layer.appendChild(img);
      dots.push({ el: img, x: window.innerWidth / 2, y: -50, size: size, baseOpacity: baseOpacity });
    }

    var mouse = { x: window.innerWidth / 2, y: -50, active: false };
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    }, { passive: true });

    var rot = 0;
    var prevX = mouse.x, prevY = mouse.y, trailVis = 0;
    var tick = function () {
      rot += 0.9;
      // Bloom the trail only while the cursor is moving; settle to just the
      // koru pointer when it rests, so dots never pile up under the cursor.
      var speed = Math.hypot(mouse.x - prevX, mouse.y - prevY);
      prevX = mouse.x; prevY = mouse.y;
      var target = mouse.active ? Math.min(1, speed / 7) : 0;
      trailVis += (target - trailVis) * (target > trailVis ? 0.35 : 0.12);
      var px = mouse.x, py = mouse.y;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += (px - d.x) * 0.34;
        d.y += (py - d.y) * 0.34;
        d.el.style.transform = 'translate(' + (d.x - d.size / 2) + 'px,' + (d.y - d.size / 2) +
          'px) rotate(' + (rot - i * 14) + 'deg)';
        d.el.style.opacity = (d.baseOpacity * trailVis).toFixed(3);
        px = d.x; py = d.y;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();

})();
