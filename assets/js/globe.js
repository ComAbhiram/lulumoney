/*
 * "One App. No Borders." globe: a half globe of land dots (assets/js/globe-dots.js) drawn on a
 * canvas. While the section is pinned, scroll progress turns the globe and lifts it a little.
 * It also publishes the progress as --p (0 to 1) on the section for the coins and heading.
 * Only draws while the section is on screen. With reduced motion it draws one still frame.
 */
(function () {
  'use strict';

  var section = document.getElementById('globe-section');
  var dots = window.LULU_GLOBE_DOTS;
  if (!section || !dots || !dots.length) return;

  var canvas = section.querySelector('.globe__canvas');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia('(max-width: 991px)');

  var n = dots.length;
  var lat = new Float32Array(n);
  var lon = new Float32Array(n);
  var i;
  for (i = 0; i < n; i++) {
    lat[i] = dots[i][0] / 10 * Math.PI / 180;
    lon[i] = dots[i][1] / 10 * Math.PI / 180;
  }
  var cosLat = lat.map(Math.cos);
  var sinLat = lat.map(Math.sin);

  // One white dot, drawn once and stamped for every land dot (thousands of arcs in one path left a
  // hairline artifact down the middle of the globe).
  var sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  var sctx = sprite.getContext('2d');
  sctx.fillStyle = '#fff';
  sctx.beginPath();
  sctx.arc(16, 16, 16, 0, Math.PI * 2);
  sctx.fill();

  var TILT = 22 * Math.PI / 180;
  var cosT = Math.cos(TILT);
  var sinT = Math.sin(TILT);

  var W = 0;
  var H = 0;
  var visible = false;
  var ticking = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t * t * (3 - 2 * t); }

  function size() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function progress() {
    var r = section.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }

  function draw() {
    ticking = false;
    if (!W || !H) return;

    var p = reduce ? 0.35 : progress();
    section.style.setProperty('--p', p.toFixed(4));

    var R = narrow.matches ? 0.62 * W : 0.35 * W;
    // The canvas is the stage under the title: the globe's top edge sits at about half of it.
    var topY = H * (0.5 - 0.1 * ease(p));
    var cx = W / 2;
    var cy = topY + R;
    var spin = (-60 + 150 * p) * Math.PI / 180;

    ctx.clearRect(0, 0, W, H);

    // soft atmosphere around the globe
    var halo = ctx.createRadialGradient(cx, cy, R * 0.97, cx, cy, R * 1.16);
    halo.addColorStop(0, 'rgba(255,255,255,0.5)');
    halo.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.16, 0, Math.PI * 2);
    ctx.fill();

    // the sphere
    var body = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.4, R * 0.05, cx, cy, R * 1.05);
    body.addColorStop(0, 'rgba(206,255,228,0.95)');
    body.addColorStop(0.5, 'rgba(94,222,150,0.92)');
    body.addColorStop(1, 'rgba(0,160,76,0.95)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.stroke();

    // land dots, three brightness steps (far side of the globe is not drawn)
    var base = R * 0.0095;
    var steps = [[], [], []];
    for (i = 0; i < n; i++) {
      var a = lon[i] + spin;
      var x0 = cosLat[i] * Math.sin(a);
      var z0 = cosLat[i] * Math.cos(a);
      var y1 = sinLat[i] * cosT - z0 * sinT;
      var z1 = sinLat[i] * sinT + z0 * cosT;
      if (z1 <= 0) continue;
      var px = cx + R * x0;
      var py = cy - R * y1;
      if (py < -base || py > H + base) continue;
      steps[z1 < 0.25 ? 0 : z1 < 0.55 ? 1 : 2].push(px, py, base * (0.5 + 0.5 * z1));
    }
    var alpha = [0.38, 0.68, 0.96];
    for (var s = 0; s < 3; s++) {
      var d = steps[s];
      ctx.globalAlpha = alpha[s];
      for (i = 0; i < d.length; i += 3) {
        ctx.drawImage(sprite, d[i] - d[i + 2], d[i + 1] - d[i + 2], d[i + 2] * 2, d[i + 2] * 2);
      }
    }
    ctx.globalAlpha = 1;
  }

  function request() {
    if (visible && !ticking) {
      ticking = true;
      window.requestAnimationFrame(draw);
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) request();
    }, { rootMargin: '10% 0px' }).observe(section);
  } else {
    visible = true;
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', size);
  size();
})();
