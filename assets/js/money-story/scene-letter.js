// Scene 1: a quiet white canvas, a wooden writing desk, physical currency notes that are laid out, gathered into
// a neat stack, slipped into an old postal envelope, closed and sealed with wax. Slow, on purpose.
// Adds its tweens to the master timeline `tl`; the numbers are timeline units (the whole story is ~170).

export function buildLetter(tl, q) {
  var gsap = q.gsap;
  var svg = q.svg;
  var $ = function (s) { return svg.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(svg.querySelectorAll(s)); };

  var notesGroup = $('[data-notes]');
  var notes = $$('[data-note]');
  var back = $('[data-envback]');
  var front = $('[data-envfront]');
  var flapOpen = $('[data-flap-open]');
  var flapClosed = $('[data-flap-closed]');
  var seal = $('[data-seal]');

  // where each note lies on the desk (fanned out), and where it ends up (one neat stack)
  var fanned = [
    { x: 790, y: 470, r: -7 },
    { x: 806, y: 512, r: 3.5 },
    { x: 796, y: 548, r: -2 }
  ];
  var stacked = [
    { x: 800, y: 496, r: 0 },
    { x: 800, y: 504, r: 0 },
    { x: 800, y: 512, r: 0 }
  ];

  // starting state
  gsap.set(notesGroup, { x: 0, y: 0 });
  notes.forEach(function (n, i) {
    gsap.set(n, { x: fanned[i].x, y: fanned[i].y + 18, rotation: fanned[i].r, opacity: 0 });
    gsap.set(n.querySelectorAll('.st-nd'), { strokeDashoffset: 1 });
  });
  gsap.set([back, front], { opacity: 0 });
  gsap.set(flapOpen, { scaleY: -1, transformOrigin: '50% 0%' });
  gsap.set(flapClosed, { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set(seal, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });

  // 0     the desk is already there, so something is on screen the moment the section comes in

  // 2-10  the notes are laid on the desk, one after another
  notes.forEach(function (n, i) {
    tl.to(n, { opacity: 1, y: fanned[i].y, duration: 4, ease: 'power2.out' }, 2 + i * 1.6);
  });

  // 14-38 each note's fine lines are drawn, as if being counted
  notes.forEach(function (n, i) {
    tl.to(n.querySelectorAll('.st-nd'), { strokeDashoffset: 0, duration: 5, stagger: 0.5, ease: 'power1.inOut' }, 14 + i * 7.5);
  });

  // 40-52 the notes are gathered into one neat stack, then tapped square
  notes.forEach(function (n, i) {
    tl.to(n, { x: stacked[i].x, y: stacked[i].y, rotation: 0, duration: 5, ease: 'power2.inOut' }, 40 + i * 1.2);
  });
  tl.to(notesGroup, { y: -6, duration: 1, ease: 'power1.out' }, 51);
  tl.to(notesGroup, { y: 0, duration: 1.2, ease: 'power1.in' }, 52);

  // 53-67 the envelope arrives; the cash is slipped inside
  tl.to([back, front], { opacity: 1, duration: 4, ease: 'power2.out' }, 53);
  tl.to(notesGroup, { x: 200, duration: 3.5, ease: 'power2.inOut' }, 57);
  tl.to(notesGroup, { y: 130, duration: 6.5, ease: 'power2.inOut' }, 60.5);

  // 67-70 the envelope closes
  tl.to(flapOpen, { scaleY: 0, duration: 1.6, ease: 'power1.in' }, 67);
  tl.to(flapClosed, { scaleY: 1, duration: 1.8, ease: 'power1.out' }, 68.5);

  // 70-73 the wax seal
  tl.to(seal, { scale: 1, opacity: 1, duration: 3, ease: 'elastic.out(1, 0.55)' }, 70.5);

  // 73-77 a breath
  tl.to(q.env, { dy: -8, duration: 2, ease: 'sine.inOut', onUpdate: q.env.apply }, 73.5);
  tl.to(q.env, { dy: 0, duration: 2, ease: 'sine.inOut', onUpdate: q.env.apply }, 75.5);

  // the desk lets go
  tl.to($$('.st-desk'), { opacity: 0, duration: 6, ease: 'power1.inOut' }, 78);
}
