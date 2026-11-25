// The scene's "camera": a viewBox with a centre and a width. Its height follows the stage, so the picture
// always fits whatever screen it is on (wide desktop or tall phone). Labels keep a constant size on screen.

export function createCamera(svg, stage) {
  var cam = { cx: 800, cy: 470, w: 1000 };

  function apply() {
    var r = stage.getBoundingClientRect();
    var aspect = r.width / Math.max(1, r.height);
    var h = cam.w / aspect;
    svg.setAttribute('viewBox', (cam.cx - cam.w / 2).toFixed(1) + ' ' + (cam.cy - h / 2).toFixed(1) + ' ' + cam.w.toFixed(1) + ' ' + h.toFixed(1));
    svg.style.setProperty('--ls', (12.5 * cam.w / Math.max(1, r.width)).toFixed(2));
  }

  return { state: cam, apply: apply };
}
