// The land of the world as one path of tiny round dots (re-using the globe's dot data), framed on the story's map.

import { project } from './cities.js';

export function worldDotsPath() {
  var dots = window.LULU_GLOBE_DOTS;
  if (!dots || !dots.length) return '';
  var d = '';
  for (var i = 0; i < dots.length; i++) {
    var lat = dots[i][0] / 10;
    var lon = dots[i][1] / 10;
    if (lon < 22 || lon > 130 || lat < -8 || lat > 46) continue;
    var p = project(lon, lat);
    d += 'M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'h0';
  }
  return d;
}
