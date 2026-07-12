/* =========================================================
   Christine Hwang — Cybersecurity Portfolio
   Vanilla-JS interactions ported from the Figma Make React app:
   nav scroll state, scroll-spy, hero typing effect,
   cursor-reveal dot grid, animated skill bars.
   ========================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Nav: blur/border once scrolled ---- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Scroll-spy: highlight the active nav link ---- */
  var navLinks = {};
  document.querySelectorAll('.nav__links a[data-nav]').forEach(function (a) {
    navLinks[a.getAttribute('data-nav')] = a;
  });
  var sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          Object.keys(navLinks).forEach(function (key) {
            navLinks[key].classList.toggle('is-active', key === id);
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Hero: typing effect cycling through roles ---- */
  var roles = [
    'Cybersecurity Student',
    'Technical Translator',
    'Policy-Minded Technologist',
    'CTF Competitor',
    'Bridge-Builder'
  ];
  var typedEl = document.getElementById('typed-role');
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      var speed = 80, pause = 1800;
      var wordIndex = 0, charIndex = 0, deleting = false;
      (function tick() {
        var current = roles[wordIndex];
        typedEl.textContent = current.slice(0, charIndex);
        var delay;
        if (!deleting && charIndex < current.length) {
          charIndex++; delay = speed;
        } else if (!deleting && charIndex === current.length) {
          deleting = true; delay = pause;
        } else if (deleting && charIndex > 0) {
          charIndex--; delay = speed / 2;
        } else {
          deleting = false;
          wordIndex = (wordIndex + 1) % roles.length;
          delay = speed;
        }
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---- Hero: cursor-reveal brighter dot grid ---- */
  var hero = document.getElementById('home');
  var reveal = document.getElementById('hero-reveal');
  if (hero && reveal && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointerenter', function () { hero.classList.add('is-hovering'); });
    hero.addEventListener('pointerleave', function () { hero.classList.remove('is-hovering'); });
    hero.addEventListener('pointermove', function (e) {
      var rect = hero.getBoundingClientRect();
      reveal.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      reveal.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
  }

  /* ---- Resume: animate skill bars when scrolled into view ---- */
  var skills = document.querySelectorAll('.skill');
  function fill(skill) {
    var level = skill.getAttribute('data-level') || '0';
    var bar = skill.querySelector('.skill__fill');
    if (bar) bar.style.width = level + '%';
  }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    skills.forEach(fill);
  } else {
    var barObs = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skills.forEach(function (s) { barObs.observe(s); });
  }

  /* ---- About: reveal the headshot once it loads; keep placeholder if missing ---- */
  var photo = document.getElementById('about-photo');
  var photoPh = document.getElementById('about-photo-ph');
  if (photo && photoPh) {
    var showPhoto = function () { photoPh.style.display = 'none'; photo.style.display = 'block'; };
    if (photo.complete && photo.naturalWidth > 0) {
      showPhoto();
    } else {
      photo.addEventListener('load', showPhoto);
      /* on error we leave the placeholder visible — no action needed */
    }
  }
})();
