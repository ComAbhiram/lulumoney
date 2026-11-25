/*
 * "Your money. Your way." (desktop): keeps the green dot level with the active tab title.
 * Taptop slides the dot by fixed distances that no longer match the tab spacing (the tabs have their own
 * size and row gap), so the dot drifted off the titles. The CSS turns Taptop's dot movement off
 * (.advantages__marker, pages layer); this moves the dot with the CSS `translate` property to the centre of
 * the active tab. Taptop marks the active tab with the dark text colour. Below 992px it does nothing.
 */
(function () {
  'use strict';

  var wrap = document.querySelector('.advantages__tabs-wrapper');
  var marker = document.querySelector('.advantages__marker');
  var tabs = document.querySelectorAll('.advantages__tab');
  if (!wrap || !marker || !tabs.length) return;

  var mq = window.matchMedia('(min-width: 992px)');
  var applied = 0;
  var running = false;
  var visible = true;

  function center(el) {
    var r = el.getBoundingClientRect();
    return (r.top + r.bottom) / 2;
  }

  // The active tab is the one with the darkest text.
  function activeTab() {
    var best = tabs[0];
    var bestLum = Infinity;
    for (var i = 0; i < tabs.length; i++) {
      var m = window.getComputedStyle(tabs[i]).color.match(/\d+(\.\d+)?/g);
      var lum = m ? +m[0] + +m[1] + +m[2] : 765;
      if (lum < bestLum - 1) { bestLum = lum; best = tabs[i]; }
    }
    return best;
  }

  var until = 0;

  function frame(now) {
    running = false;
    if (!mq.matches) {
      if (applied) { marker.style.translate = ''; applied = 0; }
      return;
    }
    // Where the dot would sit without our shift, then ease toward the active title's centre.
    var natural = center(marker) - applied;
    var target = center(activeTab()) - natural;
    var diff = target - applied;
    applied = Math.abs(diff) < 0.2 ? target : applied + diff * 0.2;
    marker.style.translate = '0 ' + applied.toFixed(2) + 'px';
    // Keep going while the dot is still moving, and a little after any change (the tabs animate too).
    if (Math.abs(diff) >= 0.2 || now < until) request();
  }

  function request() {
    if (!running && visible) {
      running = true;
      window.requestAnimationFrame(frame);
    }
  }

  function poke() {
    until = performance.now() + 700;
    request();
  }

  // The dot's position follows the page scroll with the tabs, so measure on every scroll and tab change.
  window.addEventListener('scroll', poke, { passive: true });
  window.addEventListener('resize', poke);
  new MutationObserver(poke).observe(wrap, { attributes: true, subtree: true, attributeFilter: ['style'] });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) poke();
    }, { rootMargin: '20% 0px' }).observe(wrap);
  }
  poke();
})();
