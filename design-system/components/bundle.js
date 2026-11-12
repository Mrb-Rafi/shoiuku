/* @ds-bundle: {"format":4,"namespace":"ShoiUku","components":[{"name":"Button"},{"name":"StatusBadge"},{"name":"SectionHeader"},{"name":"Stat"},{"name":"WordCard"},{"name":"Timeline"},{"name":"RoadmapCard"},{"name":"PressCard"},{"name":"Notice"},{"name":"PotCurve"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function omit(o, keys) { var r = {}; for (var k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  function Button(p) {
    var variant = p.variant || "primary", size = p.size || "md";
    var rest = omit(p, ["variant", "size", "className", "children", "href"]);
    var cls = cx("su-btn", "su-btn-" + variant, size === "lg" && "su-btn-lg", p.className);
    if (p.href) return h("a", Object.assign({ href: p.href, className: cls }, rest), p.children);
    return h("button", Object.assign({ type: "button", className: cls }, rest), p.children);
  }

  var STATUS_LABEL = { done: "Done", progress: "In progress", blocked: "Blocked", planned: "Planned" };
  function StatusBadge(p) {
    var s = p.status || "planned";
    return h("span", { className: cx("su-badge", "su-badge-" + s, p.className) }, p.children || STATUS_LABEL[s]);
  }

  function SectionHeader(p) {
    var Tag = p.as || "h2";
    return h("header", { className: cx("su-sh", p.align === "center" && "su-sh-center", p.className) },
      p.numeral != null ? h("span", { className: "su-sh-numeral", "aria-hidden": "true" }, p.numeral) : null,
      p.eyebrow ? h("span", { className: "su-sh-eyebrow" }, p.eyebrow) : null,
      h(Tag, { className: "su-sh-title" }, p.title),
      p.hook ? h("span", { className: "su-hook", "aria-hidden": "true" }) : null,
      p.intro ? h("p", { className: "su-sh-intro" }, p.intro) : null);
  }

  function Stat(p) {
    return h("div", { className: cx("su-stat", p.className) },
      h("div", { className: "su-stat-value" }, (p.approx ? "~" : "") + p.value, p.unit ? h("span", { className: "su-stat-unit" }, p.unit) : null),
      h("div", { className: "su-stat-label" }, p.label));
  }

  var PLAY = h("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, h("path", { d: "M7 4.5v15a1 1 0 0 0 1.5.86l12.2-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" }));
  var PAUSE = h("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, h("path", { d: "M6 4h4v16H6zM14 4h4v16h-4z" }));
  function WordCard(p) {
    var st = React.useState(false), playing = st[0], setPlaying = st[1];
    var ref = React.useRef(null);
    function toggle() {
      var a = ref.current;
      if (a) { if (a.paused) { var pr = a.play(); if (pr && pr.catch) pr.catch(function () { setPlaying(false); }); } else a.pause(); }
      else setPlaying(!playing);
    }
    return h("article", { className: cx("su-word", playing && "is-playing", p.className), lang: "en" },
      h("button", { className: "su-word-play", onClick: toggle, "aria-label": (playing ? "Pause " : "Play ") + p.roman, "aria-pressed": playing }, playing ? PAUSE : PLAY),
      h("div", { className: "su-word-head" },
        h("span", { className: "su-word-roman", lang: "ckh-Latn" }, p.roman),
        p.ipa ? h("span", { className: "su-word-ipa" }, "/" + p.ipa + "/") : null),
      h("div", { className: "su-word-gloss" }, p.gloss),
      p.script ? h("div", { className: "su-word-script" }, p.script) : null,
      (p.category || p.speaker || p.credit) ? h("div", { className: "su-word-meta" },
        p.category ? h("span", null, p.category) : null,
        p.speaker ? h("span", null, "Spoken by " + p.speaker) : null,
        p.credit ? h("span", null, p.credit) : null) : null,
      p.src ? h("audio", { ref: ref, src: p.src, preload: "none", onPlay: function () { setPlaying(true); }, onPause: function () { setPlaying(false); }, onEnded: function () { setPlaying(false); } }) : null);
  }

  function Timeline(p) {
    return h("ol", { className: cx("su-tl", p.className) }, (p.items || []).map(function (it, i) {
      return h("li", { key: i, className: cx("su-tl-item", "su-tl-" + (it.kind || "step")) },
        h("span", { className: "su-tl-dot", "aria-hidden": "true" }),
        h("div", { className: "su-tl-body" },
          it.when ? h("span", { className: "su-tl-when" }, it.when) : null,
          h("h3", { className: "su-tl-title" }, it.title),
          it.text ? h("p", { className: "su-tl-text" }, it.text) : null));
    }));
  }

  function RoadmapCard(p) {
    return h("article", { className: cx("su-rm", p.status === "blocked" && "su-rm-blocked", p.className) },
      h("div", { className: "su-rm-top" }, h("h3", { className: "su-rm-title" }, p.title), h(StatusBadge, { status: p.status })),
      p.children ? h("p", { className: "su-rm-text" }, p.children) : null);
  }

  function PressCard(p) {
    var reel = p.kind === "reel";
    var body = [
      h("span", { key: "o", className: "su-press-outlet" }, p.outlet + (reel ? " · Reel" : "")),
      h("h3", { key: "t", className: "su-press-title" }, p.headline),
      p.quote ? h("p", { key: "q", className: "su-press-quote" }, p.quote) : null,
      (p.author || p.date) ? h("span", { key: "m", className: "su-press-meta" }, [p.author, p.date].filter(Boolean).join(" · ")) : null,
      h("span", { key: "c", className: "su-press-cta" }, p.cta || (reel ? "Watch on Facebook" : "Read the article"))
    ];
    var props = { className: cx("su-press", reel && "su-press-reel", p.className) };
    if (p.href) { props.href = p.href; props.target = "_blank"; props.rel = "noopener"; }
    return h(p.href ? "a" : "article", props,
      reel ? h("div", { className: "su-press-media" }, p.media || "Reel plays here") : null,
      reel ? h("div", { className: "su-press-body" }, body) : body);
  }

  function Notice(p) {
    var tone = p.tone || "info";
    return h("aside", { className: cx("su-note", "su-note-" + tone, p.className) },
      p.title ? h("h3", { className: "su-note-title" }, p.title) : null,
      h("div", { className: "su-note-body" }, p.children),
      p.action ? h("div", { className: "su-note-action" }, p.action) : null);
  }

  var CURVE = "M0 0H1440V34C1290 92 1090 118 860 112C628 106 430 72 262 54C150 42 64 46 0 64Z";
  function PotCurve(p) {
    return h("svg", { className: cx("su-curve", "su-curve-" + (p.color || "brown"), p.flip && "su-curve-flip", p.className), viewBox: "0 0 1440 120", preserveAspectRatio: "none", "aria-hidden": "true", focusable: "false" },
      h("path", { d: CURVE }));
  }

  window.ShoiUku = Object.assign(window.ShoiUku || {}, {
    PotCurve: PotCurve,
    Button: Button, StatusBadge: StatusBadge, SectionHeader: SectionHeader, Stat: Stat,
    WordCard: WordCard, Timeline: Timeline, RoadmapCard: RoadmapCard, PressCard: PressCard, Notice: Notice
  });
})();
