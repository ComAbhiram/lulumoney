/*
 * "Sending money. Made effortless.": the heading stays pinned while the three step cards rise over
 * it and leave upward. It blurs as the cards come up to it and clears again once they have gone.
 * The blur follows the cards' real positions: each card contributes 0 (far below the heading, or
 * already well above it) up to the full blur (covering it), and the strongest card wins.
 * Desktop only; below 992px the steps are a plain list and nothing runs.
 */
(function () {
  'use strict';

  var MAX_BLUR = 18;

  var mq = window.matchMedia('(min-width: 992px)');
  var heading = document.querySelector('.steps__text-mask .text');
  var mask = heading ? heading.parentElement : null;
  var cards = document.querySelectorAll('.steps__card');
  var ticking = false;

  if (!heading || !cards.length) return;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function frame() {
    ticking = false;

    if (!mq.matches) {
      heading.style.filter = '';
      mask.classList.remove('is-blurring');
      return;
    }

    var h = heading.getBoundingClientRect();
    var ramp = 0.4 * window.innerHeight;
    var amount = 0;

    for (var i = 0; i < cards.length; i++) {
      var c = cards[i].getBoundingClientRect();
      var entering = clamp((h.bottom + ramp - c.top) / ramp);   // card rises up to the heading
      var leaving = clamp((c.bottom - (h.top - ramp)) / ramp);  // card has gone up past the heading
      amount = Math.max(amount, Math.min(entering, leaving));
    }

    var on = amount > 0.01;
    heading.style.filter = on ? 'blur(' + (amount * MAX_BLUR).toFixed(1) + 'px)' : '';
    // The heading's box clips overflow (for the text reveal); while it is blurred the blur has to spread
    // past that box, otherwise it is cut off in a hard-edged strip.
    mask.classList.toggle('is-blurring', on);
  }

  function request() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(frame);
    }
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  window.addEventListener('load', request);
  request();
})();
