// Scene 3: after the money reaches its destination the story moves into the LuLu Money app. The network settles
// into the background; the sender's phone and the receiver's phone rise side by side, joined by one instant
// green line. Both confirmations - "Money Sent" and "Money Received" - appear together, at the same moment.

export function buildApps(tl, q, t0) {
  var gsap = q.gsap;
  var section = q.section;
  var $ = function (s) { return section.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(section.querySelectorAll(s)); };

  var svg = q.svg;
  var apps = $$('[data-app]');
  var sender = $('[data-app="sender"]');
  var receiver = $('[data-app="receiver"]');
  var link = $('[data-link]');
  var line = $('[data-link-line]');
  var dot = $('[data-link-dot]');
  var pending = $$('[data-pending]');
  var confirmed = $$('[data-confirmed]');
  var halos = $$('[data-a-halo]');
  var rings = $$('[data-a-ring]');
  var ticks = $$('[data-a-tick]');
  var titles = $$('[data-a-title]');
  var amounts = $$('[data-a-amount]');
  var subs = $$('[data-a-sub]');

  gsap.set(apps, { opacity: 0, y: 36, scale: 0.97 });
  gsap.set(sender, { x: -28 });
  gsap.set(receiver, { x: 28 });
  gsap.set(link, { opacity: 0 });
  gsap.set(line, { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(dot, { left: '0%', opacity: 0 });
  gsap.set(confirmed, { opacity: 0 });
  gsap.set([titles, amounts, subs], { opacity: 0, y: 10 });
  gsap.set(rings, { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' });
  gsap.set(halos, { scale: 0.7, opacity: 0, transformOrigin: '50% 50%' });
  gsap.set(ticks, { strokeDashoffset: 1 });

  // the network steps back
  tl.to(svg, { opacity: 0.1, duration: 5, ease: 'power1.inOut' }, t0);

  // the two phones rise
  tl.to(apps, { opacity: 1, x: 0, y: 0, scale: 1, duration: 6, ease: 'power3.out', stagger: 0.6 }, t0 + 2);

  // an instant line joins them
  tl.to(link, { opacity: 1, duration: 1 }, t0 + 8);
  tl.to(line, { scaleX: 1, duration: 3.5, ease: 'power2.inOut' }, t0 + 8);
  tl.to(dot, { opacity: 1, duration: 0.4 }, t0 + 8.2);
  tl.to(dot, { left: '100%', duration: 3.2, ease: 'power2.inOut' }, t0 + 8.2);
  tl.to(dot, { opacity: 0, duration: 0.6 }, t0 + 11.4);

  // both confirmations, at the very same moment
  var c = t0 + 12;
  tl.to(pending, { opacity: 0, y: -8, duration: 1.6, ease: 'power1.in' }, c);
  tl.to(confirmed, { opacity: 1, duration: 0.6 }, c + 1);
  tl.to(rings, { scale: 1, opacity: 1, duration: 2.4, ease: 'back.out(1.7)' }, c + 1);
  tl.to(ticks, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.out' }, c + 2);
  tl.fromTo(halos, { scale: 0.7, opacity: 0.55 }, { scale: 1.45, opacity: 0, duration: 3, ease: 'power2.out' }, c + 1.4);
  tl.to([titles, amounts, subs], { opacity: 1, y: 0, duration: 2.2, ease: 'power2.out', stagger: 0.25 }, c + 2);

  return c + 6;
}
