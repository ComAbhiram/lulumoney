/*
 * Banner shape (desktop only; Taptop's animation is kept).
 * Taptop (GSAP) tweens the banner's width, height and radius inline, from full screen to a
 * landscape tile. The CSS (assets/sass/5-pages/_homePage.sass) clamps its width to the width of
 * the wall's tiles (min-width). The clamp would widen it on both sides, so this script only
 * shifts it left (--mask-x) by half of the extra width, which keeps its right edge where Taptop
 * puts it, next to the middle row. It never writes the banner's size, so Taptop's tweens are
 * not disturbed.
 * The clamp and shift only apply once the first-load intro is over (class banner-shrinking on <html>):
 * the intro grows the banner from a small bar, and that must start from the centre.
 */
(function () {
  'use strict';

  var mq = window.matchMedia('(min-width: 992px)');
  var mask = document.querySelector('.cover__mask');
  var tile = document.querySelector('.route__image');
  var ticking = false;
  var introDone = false;

  if (!mask || !tile) return;

  function frame() {
    ticking = false;
    var x = 0;
    // The intro is over once the banner has been full width, or the page is already scrolled well past the top.
    if (!introDone && (mask.offsetWidth >= window.innerWidth * 0.9 || window.pageYOffset > 1500)) {
      introDone = true;
      document.documentElement.classList.add('banner-shrinking');
    }
    if (mq.matches && introDone) {
      // Taptop's inline width is a % of the wrapper or vw.
      var tw = /^([\d.]+)(%|vw)/.exec(mask.style.width || '');
      if (tw) {
        var base = tw[2] === '%' ? mask.parentElement.clientWidth : window.innerWidth;
        var taptopW = parseFloat(tw[1]) * base / 100;
        x = -Math.max(0, tile.offsetWidth - taptopW) / 2;
      }
    }
    document.documentElement.style.setProperty('--mask-x', x + 'px');
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
  // Taptop eases the banner width over several frames, so follow its style changes too.
  new MutationObserver(request).observe(mask, { attributes: true, attributeFilter: ['style'] });
  request();
})();
