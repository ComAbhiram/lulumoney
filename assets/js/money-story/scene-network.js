// Scene 2: the sealed envelope leaves the desk, the camera pulls back, and its curved routes straighten into a
// digital network. At the first city the envelope hands over to a small glowing note of money, which carries on
// along the routes (each one it uses lights up green). Cities glow one after another; the transfer completes,
// a soft green ring expands, every city glows at once and the whole network pulses once.

import { CITIES, LINKS } from './cities.js';
import { worldDotsPath } from './world.js';

var NS = 'http://www.w3.org/2000/svg';

function el(name, attrs) {
  var n = document.createElementNS(NS, name);
  Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
  return n;
}

export function buildNetwork(tl, q) {
  var gsap = q.gsap;
  var svg = q.svg;
  var cam = q.cam;
  var $ = function (s) { return svg.querySelector(s); };

  var byId = {};
  CITIES.forEach(function (c) { byId[c.id] = c; });

  // the world, as dots
  var world = $('[data-world]');
  world.setAttribute('d', worldDotsPath());

  // the routes: curved at first (the old, paper-era way), each with a control point we can straighten
  var edgeHost = $('[data-edges]');

  function shape(edge, t) {
    var cx = edge.curve.x + (edge.mid.x - edge.curve.x) * t;
    var cy = edge.curve.y + (edge.mid.y - edge.curve.y) * t;
    edge.path.setAttribute('d', 'M' + edge.a.x.toFixed(1) + ' ' + edge.a.y.toFixed(1) + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + edge.b.x.toFixed(1) + ' ' + edge.b.y.toFixed(1));
  }

  var edges = LINKS.map(function (pair, i) {
    var a = byId[pair[0]];
    var b = byId[pair[1]];
    var mx = (a.x + b.x) / 2;
    var my = (a.y + b.y) / 2;
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    var side = i % 2 ? 1 : -1;
    var curve = { x: mx - (dy / len) * len * 0.2 * side, y: my + (dx / len) * len * 0.2 * side };
    var path = el('path', { class: 'st-edge', pathLength: '1' });
    edgeHost.appendChild(path);
    var edge = { a: a, b: b, mid: { x: mx, y: my }, curve: curve, path: path };
    shape(edge, 0);
    return edge;
  });

  // the cities
  var cityHost = $('[data-cities]');
  var cities = CITIES.map(function (c) {
    var g = el('g', { class: 'st-city', transform: 'translate(' + c.x.toFixed(1) + ' ' + c.y.toFixed(1) + ')' });
    var halo = el('circle', { class: 'st-halo', r: '8' });
    var dot = el('circle', { class: 'st-dot', r: '4.5' });
    var label = el('text', { class: 'st-label', x: c.dx, y: c.dy, 'text-anchor': c.anchor });
    label.textContent = c.name;
    g.appendChild(halo);
    g.appendChild(dot);
    g.appendChild(label);
    cityHost.appendChild(g);
    return { data: c, g: g, halo: halo, dot: dot, label: label };
  });

  var env = $('[data-env]');
  var token = $('[data-token]');
  var ring = $('[data-ring]');
  var done = $('[data-done]');
  var colombo = byId.colombo;
  var dubai = byId.dubai;
  var paths = edges.map(function (e) { return e.path; });
  var journeyPaths = paths.slice(0, 5);
  var meshPaths = paths.slice(5);
  var halos = cities.map(function (c) { return c.halo; });
  var dots = cities.map(function (c) { return c.dot; });
  var labels = cities.map(function (c) { return c.label; });

  gsap.set(world, { opacity: 0 });
  gsap.set(token, { opacity: 0 });
  q.token.x = dubai.x;
  q.token.y = dubai.y;
  q.token.apply();
  gsap.set(paths, { strokeDashoffset: 1 });
  gsap.set(halos, { opacity: 0 });
  gsap.set(dots, { opacity: 0 });
  gsap.set(labels, { opacity: 0 });
  gsap.set(ring, { attr: { cx: colombo.x, cy: colombo.y, r: 0 }, opacity: 0 });
  gsap.set(done, { x: colombo.x, y: colombo.y, scale: 0, opacity: 0, transformOrigin: '50% 50%' });

  // 76-92 the camera pulls back from the desk to the world; the envelope leaves for Dubai
  tl.to(cam.state, { cx: 810, cy: 600, w: q.mapWidth, duration: 16, ease: 'power2.inOut', onUpdate: cam.apply }, 76);
  tl.to(q.env, { s: 0.3, x: dubai.x, y: dubai.y, duration: 13, ease: 'power2.inOut', onUpdate: q.env.apply }, 79);
  tl.to(world, { opacity: 1, duration: 10 }, 84);

  // 86-96 the old curved routes are drawn
  tl.to(paths, { strokeDashoffset: 0, duration: 4, stagger: 0.55 }, 86);

  // 96-104 the curves straighten into digital lines
  var morph = { t: 0 };
  tl.to(morph, {
    t: 1,
    duration: 8,
    ease: 'power2.inOut',
    onUpdate: function () { edges.forEach(function (e) { shape(e, morph.t); }); }
  }, 96);
  tl.to(paths, { stroke: '#00a651', strokeOpacity: 0.3, strokeWidth: 1.2, duration: 8 }, 96);
  tl.to(dots, { opacity: 1, duration: 4, stagger: 0.4 }, 98);

  // 104-128 the cities glow one after another while the envelope keeps travelling
  function glow(c, t) {
    tl.to(c.halo, { opacity: 0.32, attr: { r: 26 }, duration: 3, ease: 'power2.out' }, t);
    tl.to(c.dot, { fill: '#00a651', attr: { r: 6 }, duration: 2 }, t);
    tl.to(c.label, { opacity: 1, duration: 2.5 }, t);
  }
  var stops = [
    { id: 'dubai', arrive: 104 },
    { id: 'kerala', arrive: 108 },
    { id: 'manila', arrive: 113 },
    { id: 'cairo', arrive: 119 },
    { id: 'kathmandu', arrive: 124 },
    { id: 'colombo', arrive: 128 }
  ];
  // the envelope hands over to the money
  tl.to(env, { opacity: 0, duration: 1.6 }, 102.4);
  tl.fromTo(q.token, { s: 0.7 }, { s: 1.5, duration: 2, ease: 'back.out(1.6)', onUpdate: q.token.apply }, 102.6);
  tl.to(token, { opacity: 1, duration: 1.6 }, 102.6);

  stops.forEach(function (s, i) {
    var city = cities.filter(function (c) { return c.data.id === s.id; })[0];
    glow(city, s.arrive - 1);
    if (i > 0) {
      var prev = stops[i - 1];
      var hop = s.arrive - prev.arrive - 0.8;
      tl.to(q.token, { x: city.data.x, y: city.data.y, duration: hop, ease: 'power1.inOut', onUpdate: q.token.apply }, prev.arrive + 0.4);
      // the route the money takes lights up
      tl.to(journeyPaths[i - 1], { strokeOpacity: 0.95, strokeWidth: 2.2, duration: hop }, prev.arrive + 0.4);
    }
  });

  // 129-131 the transfer completes
  tl.to(token, { opacity: 0, duration: 1.2 }, 128.6);
  tl.to(done, { scale: 1, opacity: 1, duration: 2, ease: 'back.out(2)' }, 129);

  // 131-138 a soft green ring expands; every city glows at once; the network pulses once
  tl.fromTo(ring, { attr: { r: 0 }, opacity: 0.9 }, { attr: { r: 820 }, opacity: 0, duration: 7, ease: 'power2.out' }, 131);
  tl.to(halos, { opacity: 0.55, attr: { r: 44 }, duration: 2, ease: 'power2.out' }, 131);
  tl.to(halos, { opacity: 0.28, attr: { r: 26 }, duration: 4, ease: 'sine.inOut' }, 133);
  tl.to(paths, { strokeOpacity: 1, strokeWidth: 2.4, duration: 2, ease: 'power2.out' }, 131);
  tl.to(journeyPaths, { strokeOpacity: 0.75, strokeWidth: 1.9, duration: 4, ease: 'sine.inOut' }, 133);
  tl.to(meshPaths, { strokeOpacity: 0.3, strokeWidth: 1.2, duration: 4, ease: 'sine.inOut' }, 133);

  return 138;
}
