# RAY1

**Author**: Adama Software
**License**: MIT License

---

## Overview

`RAY1` is a hash function that leverages 3D spatial traversal inspired by raycasting algorithms. It converts input strings into deterministic 3D coordinates within a cube and simulates ray traversal through that cube to mutate a state buffer. The result is a fixed-length hexadecimal digest, designed for use in obfuscation or experimental cryptographic tasks.

---

## Conceptual Visualization

### 1. Input Encoding → Hex Grid Initialization

![Input Encoding](https://user-images.githubusercontent.com/your-username/input-encoding-3d-grid.png)

Each character in the UTF-8 input string is hex-encoded and used to fill a 3D cube (default size: 16x16x16) in layers.

---

### 2. Raycasting Logic

![Raycasting Logic](https://user-images.githubusercontent.com/your-username/3d-raycasting-paths.png)

* 24 rays are cast from the center of the 3D grid.
* Each ray has a deterministic direction based on a pseudo-random number generator seeded by the input.
* Each ray moves step-by-step across the 3D grid (default 27 steps).

---

### 3. State Mutation (Digest Construction)

![State Mutation](https://user-images.githubusercontent.com/your-username/state-buffer-xor-rotation.png)

For each ray step:

* The value at the current grid coordinate is XOR’d with the state.
* The state byte is then rotated left by 3 bits to add diffusion.

---

### 4. Output Encoding

![Final Output](https://user-images.githubusercontent.com/your-username/final-hash-output.png)

32-byte buffer becomes a 64-character hexadecimal hash.

---

## Function Parameters

* `input` *(string)*: Text to hash.
* `gridSize` *(int, default=16)*: Size of the 3D cube.
* `rayCount` *(int, default=24)*: Number of rays to cast.
* `steps` *(int, default=27)*: How many steps each ray takes.
* `outputLength` *(int, default=32)*: Number of bytes in output.

---

## Example Usage

```js
RAY1("Hello, world!");
// Returns a 64-character hexadecimal hash
```

---

## Design Note

RAY1 demonstrates how spatial and geometric concepts like raycasting can influence hashing design. Though not intended for cryptographic security, it’s a creative exploration into 3D data mutation algorithms.

> "Hashing doesn’t have to be flat." – Adama Software
