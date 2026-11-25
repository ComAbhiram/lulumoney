// "From a letter to a lifeline" - the scroll-told story before the footer.
// Self-contained: GSAP + ScrollTrigger scrub one timeline over this section's own track. The stage is held in
// place with CSS position: sticky inside the section only, so nothing else on the page is pinned or changed.
// Scenes are separate modules: scene-letter.js (the desk, the letter, the envelope) and scene-network.js
// (the world, the money's journey, the confirmation), scene-apps.js (the sender's and receiver's phones), sharing
// the camera in camera.js.

import { createCamera } from './camera.js';
import { buildLetter } from './scene-letter.js';
import { buildNetwork } from './scene-network.js';
import { buildApps } from './scene-apps.js';

function init() {
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var section = document.getElementById('money-story');
  if (!section || !gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var track = section.querySelector('[data-story-track]');
  var stage = section.querySelector('[data-story-stage]');
  var svg = section.querySelector('.story__svg');
  var hint = section.querySelector('[data-hint]');
  var eyebrow = section.querySelector('[data-eyebrow]');
  var finale = section.querySelectorAll('[data-finale] > *');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var cam = createCamera(svg, stage);
  var portrait = stage.clientWidth < stage.clientHeight * 0.9;
  // the envelope's own transform: where its centre is (x, y), how big (s) and a small lift (dy). Set by hand, because it moves, scales and breathes across both scenes.
  var envNode = svg.querySelector('[data-env]');
  var env = { x: 1000, y: 610, s: 1, dy: 0 };
  env.apply = function () {
    envNode.setAttribute('transform', 'translate(' + env.x.toFixed(2) + ' ' + (env.y + env.dy).toFixed(2) + ') scale(' + env.s.toFixed(4) + ') translate(-1000 -610)');
  };
  // the travelling money: the same idea - centre (x, y) and size (s)
  var tokenNode = svg.querySelector('[data-token]');
  var token = { x: 0, y: 0, s: 1 };
  token.apply = function () {
    tokenNode.setAttribute('transform', 'translate(' + token.x.toFixed(2) + ' ' + token.y.toFixed(2) + ') scale(' + token.s.toFixed(4) + ')');
  };
  var ctx = { gsap: gsap, section: section, svg: svg, cam: cam, env: env, token: token, mapWidth: portrait ? 1320 : 1640 };

  // the camera starts close on the desk
  cam.state.cx = 800;
  cam.state.cy = 600;
  cam.state.w = portrait ? 1040 : 1500;
  cam.apply();

  var tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  buildLetter(tl, ctx);
  var networkEnd = buildNetwork(tl, ctx);
  var length = buildApps(tl, ctx, networkEnd + 1);

  gsap.set(finale, { opacity: 0, y: 18 });
  tl.to(hint, { opacity: 0, duration: 3 }, 1);
  tl.to(eyebrow, { opacity: 0, y: -12, duration: 4, ease: 'power1.in' }, 9);
  tl.to(finale, { opacity: 1, y: 0, duration: 4, ease: 'power2.out', stagger: 2.5 }, length + 1);
  tl.to({}, { duration: 6 }, length + 9);

  section.classList.add('is-ready');

  if (reduce) {
    section.classList.add('is-static');
    tl.progress(1);
    cam.apply();
    return;
  }

  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'bottom bottom',
    animation: tl,
    scrub: 0.6,
    invalidateOnRefresh: true,
    onRefresh: cam.apply
  });

  window.addEventListener('resize', cam.apply);
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
}

init();
