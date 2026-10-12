import * as THREE from 'three';

// Highly detailed equirectangular polygons for world landmasses [lon, lat]
const WORLD_CONTINENTS: [number, number][][] = [
  // North America & Canada & Alaska
  [
    [-168, 65], [-165, 70], [-155, 71], [-140, 70], [-130, 70], [-120, 69], [-105, 69],
    [-90, 70], [-80, 72], [-70, 62], [-65, 58], [-55, 52], [-60, 44], [-65, 44],
    [-70, 42], [-75, 36], [-80, 30], [-81, 25], [-87, 21], [-90, 16], [-84, 10],
    [-77, 8], [-82, 8], [-88, 14], [-94, 17], [-97, 20], [-97, 26], [-105, 23],
    [-110, 24], [-115, 30], [-120, 34], [-124, 38], [-124, 48], [-130, 54], [-140, 59],
    [-150, 60], [-160, 56], [-168, 65]
  ],
  // South America
  [
    [-77, 8], [-72, 12], [-62, 11], [-50, 0], [-42, -2], [-35, -5], [-35, -10],
    [-38, -13], [-42, -22], [-48, -28], [-53, -33], [-58, -35], [-62, -40], [-65, -45],
    [-68, -54], [-75, -53], [-74, -45], [-72, -35], [-70, -25], [-75, -18], [-76, -14],
    [-81, -5], [-80, 2], [-77, 8]
  ],
  // Western Europe
  [
    [-9, 36], [-9, 43], [-2, 44], [-4, 48], [-1, 50], [5, 54], [8, 55], [12, 54],
    [15, 50], [18, 45], [15, 40], [16, 38], [12, 38], [8, 44], [3, 43], [0, 43],
    [-5, 36], [-9, 36]
  ],
  // Scandinavia & Baltic
  [
    [5, 58], [10, 58], [12, 56], [16, 56], [20, 60], [25, 65], [30, 70], [25, 71],
    [18, 69], [12, 65], [6, 62], [5, 58]
  ],
  // United Kingdom & Ireland
  [
    [-10, 51], [-6, 50], [-1, 51], [1, 53], [-2, 58], [-5, 59], [-6, 56], [-10, 54], [-10, 51]
  ],
  // Africa
  [
    [-17, 15], [-17, 21], [-12, 28], [-6, 35], [10, 37], [20, 33], [28, 32], [33, 31],
    [35, 27], [38, 22], [43, 12], [51, 11], [46, 5], [40, -3], [40, -12], [35, -20],
    [32, -28], [28, -34], [18, -34], [14, -23], [12, -15], [9, 0], [4, 5], [-5, 5],
    [-12, 8], [-17, 15]
  ],
  // Eurasia / Siberia / Central Asia / Russia
  [
    [30, 70], [45, 68], [60, 73], [75, 73], [90, 76], [105, 77], [125, 74], [140, 75],
    [160, 70], [170, 66], [175, 64], [165, 56], [142, 52], [135, 45], [130, 38],
    [122, 37], [120, 30], [118, 24], [108, 20], [105, 10], [100, 4], [98, 10],
    [92, 21], [88, 22], [80, 16], [70, 25], [60, 25], [56, 26], [50, 30], [40, 37],
    [35, 36], [35, 32], [40, 42], [32, 45], [30, 50], [30, 70]
  ],
  // Indian Subcontinent
  [
    [68, 24], [72, 21], [74, 15], [76, 9], [78, 8], [80, 10], [80, 13], [82, 17],
    [86, 20], [89, 22], [92, 21], [88, 26], [82, 28], [75, 32], [72, 34], [70, 30],
    [68, 24]
  ],
  // Arabian Peninsula
  [
    [35, 32], [42, 30], [48, 30], [55, 26], [60, 22], [58, 17], [53, 16], [45, 13],
    [43, 15], [36, 28], [35, 32]
  ],
  // East Asia & China
  [
    [100, 22], [108, 22], [115, 23], [120, 32], [122, 37], [126, 40], [130, 42],
    [125, 45], [115, 42], [105, 38], [95, 32], [98, 26], [100, 22]
  ],
  // Japan Islands
  [
    [130, 33], [133, 34], [136, 35], [141, 38], [141, 44], [145, 44], [142, 40],
    [137, 36], [132, 32], [130, 33]
  ],
  // Southeast Asia / Indonesia / Philippines
  [
    [98, 10], [102, 5], [105, 0], [110, -5], [118, -8], [125, -8], [130, -5],
    [132, -1], [125, 2], [120, 5], [115, 6], [108, 12], [102, 15], [98, 10]
  ],
  // Australia
  [
    [113, -22], [115, -34], [120, -35], [130, -32], [138, -35], [145, -38], [150, -37],
    [153, -28], [148, -20], [142, -11], [136, -12], [130, -14], [125, -15], [115, -20],
    [113, -22]
  ],
  // New Zealand
  [
    [166, -46], [170, -43], [175, -38], [178, -38], [175, -42], [170, -46], [166, -46]
  ],
  // Greenland
  [
    [-55, 60], [-45, 60], [-35, 65], [-20, 70], [-18, 77], [-20, 82], [-35, 83],
    [-55, 82], [-60, 76], [-50, 70], [-55, 60]
  ],
  // Madagascar
  [
    [44, -12], [49, -15], [50, -20], [47, -25], [44, -25], [43, -18], [44, -12]
  ],
];

// Helper to project lon/lat into equirectangular canvas coordinates
function project(lon: number, lat: number, width: number, height: number): [number, number] {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

/**
 * Creates an in-memory land bitmap to check if any spherical coordinate (lat, lon) is land.
 */
let landBitmapCache: Uint8Array | null = null;
const BITMAP_W = 1024;
const BITMAP_H = 512;

function getLandBitmap(): Uint8Array {
  if (landBitmapCache) return landBitmapCache;

  const canvas = document.createElement('canvas');
  canvas.width = BITMAP_W;
  canvas.height = BITMAP_H;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    landBitmapCache = new Uint8Array(BITMAP_W * BITMAP_H);
    return landBitmapCache;
  }

  // Draw landmass polygons filled with white on black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, BITMAP_W, BITMAP_H);

  ctx.fillStyle = '#ffffff';
  for (const polygon of WORLD_CONTINENTS) {
    if (polygon.length < 3) continue;
    ctx.beginPath();
    const [sx, sy] = project(polygon[0][0], polygon[0][1], BITMAP_W, BITMAP_H);
    ctx.moveTo(sx, sy);
    for (let i = 1; i < polygon.length; i++) {
      const [px, py] = project(polygon[i][0], polygon[i][1], BITMAP_W, BITMAP_H);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  const imgData = ctx.getImageData(0, 0, BITMAP_W, BITMAP_H).data;
  const mask = new Uint8Array(BITMAP_W * BITMAP_H);
  for (let i = 0; i < BITMAP_W * BITMAP_H; i++) {
    mask[i] = imgData[i * 4] > 120 ? 1 : 0;
  }

  landBitmapCache = mask;
  return mask;
}

export function isLandCoordinate(lat: number, lon: number): boolean {
  const mask = getLandBitmap();
  let x = Math.floor(((lon + 180) / 360) * BITMAP_W);
  let y = Math.floor(((90 - lat) / 180) * BITMAP_H);

  x = Math.max(0, Math.min(BITMAP_W - 1, x));
  y = Math.max(0, Math.min(BITMAP_H - 1, y));

  return mask[y * BITMAP_W + x] === 1;
}

/**
 * Creates a soft glowing radial circular sprite texture for particles
 */
export function createGlowDotTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.25, 'rgba(235, 225, 255, 0.9)');
    gradient.addColorStop(0.55, 'rgba(168, 135, 255, 0.5)');
    gradient.addColorStop(0.85, 'rgba(123, 97, 255, 0.15)');
    gradient.addColorStop(1.0, 'rgba(123, 97, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates an ultra-dense Fibonacci spherical particle cloud representing continents.
 */
export function generateContinentParticles(
  radius: number,
  totalSamples: number = 36000
): {
  positions: Float32Array;
  colors: Float32Array;
  count: number;
} {
  const tempPositions: number[] = [];
  const tempColors: number[] = [];

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / totalSamples;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;

    const lat = 90 - (inclination * 180) / Math.PI;
    let lon = (azimuth * 180) / Math.PI;
    lon = ((lon + 180) % 360) - 180;

    const onLand = isLandCoordinate(lat, lon);

    // If on land, generate a bright glowing particle
    if (onLand) {
      // Subtle depth variation on land for rich tactile texture
      const r = radius + (Math.random() - 0.5) * 0.015;
      const x = r * Math.sin(inclination) * Math.cos(azimuth);
      const y = r * Math.cos(inclination);
      const z = r * Math.sin(inclination) * Math.sin(azimuth);

      tempPositions.push(x, y, z);

      // Bright white, silver and soft violet tint
      const tint = Math.random();
      if (tint > 0.6) {
        // Pure luminous white
        tempColors.push(1.0, 1.0, 1.0);
      } else if (tint > 0.3) {
        // Soft electric violet tint
        tempColors.push(0.88, 0.82, 1.0);
      } else {
        // Cyan-silver sparkle
        tempColors.push(0.82, 0.94, 1.0);
      }
    } else if (Math.random() < 0.035) {
      // Faint dark ocean particles to subtly outline the globe volume
      const r = radius;
      const x = r * Math.sin(inclination) * Math.cos(azimuth);
      const y = r * Math.cos(inclination);
      const z = r * Math.sin(inclination) * Math.sin(azimuth);

      tempPositions.push(x, y, z);
      // Very faint dark indigo
      tempColors.push(0.18, 0.16, 0.35);
    }
  }

  const positions = new Float32Array(tempPositions);
  const colors = new Float32Array(tempColors);
  return {
    positions,
    colors,
    count: tempPositions.length / 3,
  };
}

/**
 * Convert lat/lon degrees to 3D Cartesian coordinates on sphere of radius R
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
