/*
 * "Right in your hands" on mobile: each phone screen and its card pop in as they scroll into view,
 * from the right, then the left, then the right again (the direction comes from CSS, --from).
 * The hidden start state is only added here, so without JavaScript, or with reduced motion,
 * everything simply shows. Desktop is a different layout and is not touched.
 */
(function () {
  'use strict';

  var items = document.querySelectorAll('.app-adaptive__img, .app-adaptive__card');
  if (!items.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  items.forEach(function (el) {
    el.classList.add('is-pop');
    io.observe(el);
  });
})();
