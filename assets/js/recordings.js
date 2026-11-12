/* All recordings page: renders assets/data/recordings.json and plays each file from Wikimedia Commons. */
(function () {
  var list = document.getElementById('rec-list');
  var status = document.getElementById('rec-status');
  var q = document.getElementById('rec-q');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.rec-tabs [role="tab"]'));
  var player = document.getElementById('rec-player');
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.2-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
  var data = null, group = 'all', current = null; // current = the button that is playing

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function time(sec) {
    sec = Math.round(sec);
    if (sec < 60) return sec + ' s';
    var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0');
  }

  // Word lists: one tile per English word, one play button per take.
  function words(items) {
    var byWord = {}, order = [];
    items.forEach(function (it) {
      var k = it.word.toLowerCase();
      if (!byWord[k]) { byWord[k] = { word: it.word, takes: [] }; order.push(k); }
      byWord[k].takes.push(it);
    });
    return order.map(function (k) { return byWord[k]; });
  }

  function render() {
    if (!data) return;
    var term = q.value.trim().toLowerCase();
    var html = '', shown = 0;
    data.groups.forEach(function (g) {
      if (group !== 'all' && group !== g.id) return;
      if (g.id === 'sessions') {
        var items = g.items.filter(function (it) { return !term || it.title.toLowerCase().indexOf(term) > -1 || it.file.toLowerCase().indexOf(term) > -1; });
        if (!items.length) return;
        shown += items.length;
        html += '<section class="rec-group" aria-labelledby="h-' + g.id + '"><div class="rec-group-head"><h2 id="h-' + g.id + '">' + esc(g.label) + '</h2><span class="caption">' + items.length + ' long recordings</span></div><div class="recordings">';
        items.forEach(function (it) {
          html += '<article class="su-word rec-session"><button class="su-word-play" type="button" data-src="' + esc(it.src) + '" aria-label="Play ' + esc(it.title) + '" aria-pressed="false">' + PLAY + '</button>' +
            '<div class="su-word-head"><span class="su-word-roman">' + esc(it.title) + '</span></div>' +
            '<div class="su-word-gloss">' + time(it.duration) + '</div>' +
            '<div class="su-word-progress" aria-hidden="true"><span></span></div>' +
            '<div class="su-word-meta"><span>' + esc(it.file.replace(/\.mp3$/i, '')) + '</span><a href="' + esc(it.page) + '">Source on Commons</a></div></article>';
        });
        html += '</div></section>';
      } else {
        var ws = words(g.items).filter(function (w) { return !term || w.word.toLowerCase().indexOf(term) > -1; });
        if (!ws.length) return;
        var n = ws.reduce(function (a, w) { return a + w.takes.length; }, 0);
        shown += n;
        html += '<section class="rec-group" aria-labelledby="h-' + g.id + '"><div class="rec-group-head"><h2 id="h-' + g.id + '">' + esc(g.label) + '</h2><span class="caption">' + ws.length + ' words · ' + n + ' recordings · <a href="' + esc(g.category) + '">on Commons</a></span></div><ul class="rec-words">';
        ws.forEach(function (w) {
          html += '<li class="rec-word' + (w.takes.length > 1 ? ' rec-word-multi' : '') + '"><span class="rec-word-name">' + esc(w.word) + '</span><span class="rec-takes">';
          w.takes.forEach(function (t, i) {
            var label = w.takes.length > 1 ? 'Play ' + w.word + ', take ' + (i + 1) : 'Play ' + w.word;
            html += '<button class="rec-take" type="button" data-src="' + esc(t.src) + '" aria-label="' + esc(label) + '" aria-pressed="false" title="' + esc(t.file) + '">' + PLAY + (w.takes.length > 1 ? '<span>' + (i + 1) + '</span>' : '') + '</button>';
          });
          html += '</span></li>';
        });
        html += '</ul></section>';
      }
    });
    stop();
    list.innerHTML = html || '<div class="rec-empty"><p class="lead">No recordings match “' + esc(q.value.trim()) + '”.</p><p>Try another English word, or <button type="button" class="su-btn su-btn-quiet" id="rec-clear">show everything</button>.</p></div>';
    status.textContent = shown ? (term ? shown + ' recordings match “' + q.value.trim() + '”.' : 'Showing ' + shown + ' recordings.') : '';
    var clear = document.getElementById('rec-clear');
    if (clear) clear.addEventListener('click', function () { q.value = ''; render(); q.focus(); });
  }

  function setState(btn, playing) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(playing));
    btn.classList.toggle('is-playing', playing);
    var card = btn.closest('.su-word, .rec-word');
    if (card) card.classList.toggle('is-playing', playing);
    var num = btn.querySelector('span');
    btn.innerHTML = (playing ? PAUSE : PLAY) + (num ? num.outerHTML : '');
    btn.setAttribute('aria-label', btn.getAttribute('aria-label').replace(/^(Play|Pause) /, playing ? 'Pause ' : 'Play '));
  }
  function bar(btn) { var c = btn && btn.closest('.su-word'); return c ? c.querySelector('.su-word-progress span') : null; }
  function stop() { if (current) { setState(current, false); var b = bar(current); if (b) b.style.width = '0'; } current = null; player.pause(); }

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-src]');
    if (!btn) return;
    if (btn === current) { if (player.paused) player.play(); else player.pause(); return; }
    stop();
    current = btn;
    player.src = btn.getAttribute('data-src');
    var p = player.play();
    if (p && p.catch) p.catch(function () { setState(btn, false); });
  });
  player.addEventListener('play', function () { setState(current, true); });
  player.addEventListener('pause', function () { setState(current, false); });
  player.addEventListener('ended', function () { var b = bar(current); if (b) b.style.width = '0'; setState(current, false); current = null; });
  player.addEventListener('timeupdate', function () { var b = bar(current); if (b && player.duration) b.style.width = (player.currentTime / player.duration * 100) + '%'; });

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      group = t.getAttribute('data-group');
      tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
      render();
    });
  });
  var timer;
  q.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(render, 120); });

  fetch('assets/data/recordings.json').then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (d) {
    data = d;
    var total = 0, counts = {};
    d.groups.forEach(function (g) { counts[g.id] = g.items.length; total += g.items.length; });
    document.getElementById('rec-counts').innerHTML = '<li><b>' + total + '</b> recordings</li><li><b>' + (counts.sessions || 0) + '</b> sessions</li><li><b>' + (counts.swadesh || 0) + '</b> Swadesh list</li><li><b>' + (counts.elicitation || 0) + '</b> elicitation list</li>';
    render();
  }).catch(function () {
    status.innerHTML = 'The recordings list could not load. You can browse them on <a href="https://commons.wikimedia.org/wiki/Category:Project_Korikath-ShoiUku-Audio">Wikimedia Commons</a>.';
  });
})();
