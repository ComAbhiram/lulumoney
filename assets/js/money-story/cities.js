// The six cities of the story, and how a longitude / latitude becomes a place in the 1600 x 900 scene.
// Equirectangular, 13.46 units per degree, framed on lon 24-128, lat -6 to 44.

const UNIT = 13.46;

export function project(lon, lat) {
  return [100 + (lon - 24) * UNIT, 120 + (44 - lat) * UNIT];
}

// order = the order they glow in. dx/dy/anchor place the label so neighbours (Kerala, Colombo) never collide.
export const CITIES = [
  { id: 'dubai', name: 'Dubai', lon: 55.3, lat: 25.2, dx: 0, dy: -20, anchor: 'middle' },
  { id: 'kerala', name: 'Kerala', lon: 76.3, lat: 10.0, dx: -14, dy: 5, anchor: 'end' },
  { id: 'manila', name: 'Manila', lon: 121.0, lat: 14.6, dx: 0, dy: -20, anchor: 'middle' },
  { id: 'cairo', name: 'Cairo', lon: 31.2, lat: 30.0, dx: 0, dy: -20, anchor: 'middle' },
  { id: 'kathmandu', name: 'Kathmandu', lon: 85.3, lat: 27.7, dx: 0, dy: -20, anchor: 'middle' },
  { id: 'colombo', name: 'Colombo', lon: 79.9, lat: 6.9, dx: 0, dy: 30, anchor: 'middle' }
].map(function (c) {
  var p = project(c.lon, c.lat);
  c.x = p[0];
  c.y = p[1];
  return c;
});

// Every link of the network: the first five are the journey, in order; the rest complete the mesh.
export const LINKS = [
  ['dubai', 'kerala'], ['kerala', 'manila'], ['manila', 'cairo'], ['cairo', 'kathmandu'], ['kathmandu', 'colombo'],
  ['dubai', 'cairo'], ['dubai', 'kathmandu'], ['kerala', 'colombo'], ['kathmandu', 'manila'], ['colombo', 'manila'], ['kerala', 'kathmandu']
];
