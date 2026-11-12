(function () {
  // Mobile menu
  var menuBtn = document.getElementById('menu-btn');
  var links = document.getElementById('nav-links');
  var mq = window.matchMedia('(max-width: 1080px)');
  function syncMenu() { links.hidden = mq.matches && menuBtn.getAttribute('aria-expanded') !== 'true'; }
  menuBtn.addEventListener('click', function () {
    var open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    syncMenu();
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a') && mq.matches) { menuBtn.setAttribute('aria-expanded', 'false'); syncMenu(); }
  });
  (mq.addEventListener ? mq.addEventListener('change', syncMenu) : mq.addListener(syncMenu));
  syncMenu();

  // Numbers count up from zero when they scroll into view.
  // The HTML holds the final values, so the page reads correctly without JavaScript.
  var counters = Array.prototype.slice.call(document.querySelectorAll('.count[data-to]'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var fmt = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
    var show = function (el, n) { el.textContent = (el.dataset.prefix || '') + fmt(n); };
    var run = function (el) {
      var to = parseInt(el.dataset.to, 10), dur = to > 50 ? 1800 : 1100, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - t, 3);
        show(el, Math.round(to * eased));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.unobserve(e.target); run(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.style.fontVariantNumeric = 'tabular-nums';
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { show(el, 0); run(el); }
      else { show(el, 0); io.observe(el); }
    });
  }

  // Audio cards: one plays at a time
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.2-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-audio]'));
  cards.forEach(function (card) {
    var btn = card.querySelector('.su-word-play');
    var audio = card.querySelector('audio');
    var bar = card.querySelector('.su-word-progress span');
    var label = btn.getAttribute('aria-label').replace(/^Play /, '');
    btn.innerHTML = PLAY;
    function set(playing) {
      card.classList.toggle('is-playing', playing);
      btn.innerHTML = playing ? PAUSE : PLAY;
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + label);
    }
    btn.addEventListener('click', function () {
      if (audio.paused) {
        cards.forEach(function (c) { var a = c.querySelector('audio'); if (a !== audio && !a.paused) a.pause(); });
        var p = audio.play(); if (p && p.catch) p.catch(function () { set(false); });
      } else audio.pause();
    });
    audio.addEventListener('play', function () { set(true); });
    audio.addEventListener('pause', function () { set(false); });
    audio.addEventListener('ended', function () { set(false); bar.style.width = '0'; });
    audio.addEventListener('timeupdate', function () { if (audio.duration) bar.style.width = (audio.currentTime / audio.duration * 100) + '%'; });
  });

  var y = document.getElementById('year'); if (y) y.textContent = String(new Date().getFullYear());
})();
