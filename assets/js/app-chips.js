/*
 * "Right in your hands" (desktop): popups around the big phone on the left. The phone slides between
 * three screens (Send Money, Transfer status, Dashboard); the three popups that belong to the screen
 * that is showing pop in, one after another: left, right, left. This file only works out which screen
 * is showing and sets data-active (1 to 3) on .app-chips; the CSS does the rest.
 * Below 992px the popups are hidden (CSS) and nothing runs.
 */
(function () {
  'use strict';

  var chips = document.querySelector('.app-chips');
  var images = document.querySelectorAll('.app__image');
  var phone = chips ? chips.parentElement : null;
  if (!chips || images.length < 3) return;

  var mq = window.matchMedia('(min-width: 992px)');
  var ticking = false;
  var rest = -Infinity;

  function frame() {
    ticking = false;
    if (!mq.matches) return;

    var mid = window.innerHeight / 2;
    var best = 0;
    var bestDist = Infinity;
    var visible = false;

    for (var i = 0; i < images.length; i++) {
      var r = images[i].getBoundingClientRect();
      var op = parseFloat(window.getComputedStyle(images[i]).opacity);
      if (op < 0.5 || r.bottom < 0 || r.top > window.innerHeight) continue;
      var d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestDist) { bestDist = d; best = i + 1; }
      visible = true;
    }

    // Once the phone starts sliding away to the left at the end of the section, the popups go too.
    // (its resting place is the furthest right it has been, forgotten on resize)
    var pr = phone.getBoundingClientRect();
    if (pr.left > rest) rest = pr.left;
    // (also by position, in case the page was opened already scrolled past the resting place)
    var leaving = pr.left < rest - 6 || pr.left < window.innerWidth * 0.22 || pr.right > window.innerWidth;

    // Only while a phone is really in view, near the middle of the screen, and not leaving.
    chips.setAttribute('data-active', visible && !leaving && bestDist < window.innerHeight * 0.45 ? String(best) : '0');
  }

  function request() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(frame);
    }
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { rest = -Infinity; request(); });
  window.addEventListener('load', request);
  request();
})();
