/* 

MIT License

Copyright (c) 2025 Adama Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.	

*/

function RAY1(input, gridSize = 16, rayCount = 24, steps = 27, outputLength = 32) {
  function toHexChars(str) {
    return Buffer.from(str, 'utf8').toString('hex').split('');
  }

  function rotateLeft8(val, bits) {
    return ((val << bits) | (val >> (8 - bits))) & 0xFF;
  }

  const hexChars = toHexChars(input);

  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
      for (let k = 0; k < gridSize; k++) {
        const idx = (i * gridSize * gridSize + j * gridSize + k) % hexChars.length;
        grid[i][j][k] = parseInt(hexChars[idx], 16);
      }
    }
  }
  function xorshift32(seed) {
    let x = seed >>> 0;
    return function () {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return x >>> 0;
    };
  }
  const seed = hexChars.reduce((acc, c) => acc + c.charCodeAt(0), 0) || 1;
  const rand = xorshift32(seed);

  const rays = [];
  for (let i = 0; i < rayCount; i++) {
    const theta = ((rand() % 1000) / 1000) * 2 * Math.PI;
    const phi = ((rand() % 1000) / 1000) * Math.PI;
    rays.push({
      dx: Math.cos(theta) * Math.sin(phi),
      dy: Math.sin(theta) * Math.sin(phi),
      dz: Math.cos(phi),
    });
  }
  const state = new Uint8Array(outputLength).fill(0xA5);
  const mid = gridSize / 2;

  for (let r = 0; r < rays.length; r++) {
    const { dx, dy, dz } = rays[r];
    let x = mid, y = mid, z = mid;

    for (let step = 0; step < steps; step++) {
	function mod(n, m) {
  		return ((n % m) + m) % m;
	}

	const xi = mod(Math.floor(x), gridSize);
	const yi = mod(Math.floor(y), gridSize);
	const zi = mod(Math.floor(z), gridSize);

      const val = grid[xi][yi][zi];
      const sidx = (r + step) % outputLength;

      state[sidx] ^= val ^ ((sidx * step) & 0xFF);
      state[sidx] = rotateLeft8(state[sidx], 3);

      x += dx;
      y += dy;
      z += dz;
    }
  }
  let finalState = state;
  return Array.from(finalState)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
console.log('RAY1:', RAY1("Hello, raycasting hash 3A test"));
console.log('RAY1:', RAY1("Hello, raycasting hash 3A test"));
console.log('RAY1:', RAY1("Hello, raycasting hash 3B test"));
console.log('RAY1:', RAY1("Hello, raycasting hash 3C test"));
