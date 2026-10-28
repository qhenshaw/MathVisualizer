# Math Visualizer

An interactive, animated explainer for the math behind games, shaders and animation rigs: vectors, rotations, waves, noise, easing, physics and shaders.

**Live:** https://qhenshaw.github.io/MathVisualizer/

| # | Topic | What you can do |
|---|-------|-----------------|
| | **Vectors** | |
| 01 | Directions | Drag a player and an enemy; see `Q − P`, its length and the normalized direction |
| 02 | Normalization | Drag `v` and watch `n = v / |v|` stay on the unit circle |
| 03 | Dot product | Drag two unit vectors; read `A · B = cos θ` on a −1…1 scale |
| 04 | Cross product | Drag unit vectors in 3D; see `A × B`, the parallelogram and `sin θ` |
| 05 | Lerp | Blend two points (and colors) by `t`, with optional smoothstep easing |
| 06 | Inverse lerp | Slide V between A and B and read back t from 0 to 1 |
| | **Rotations** | |
| 01 | Quaternions | Rotate a cube by axis and angle; watch `w, x, y, z` and the 720° double cover |
| 02 | Gimbal lock | Yaw / pitch / roll rings; pitch to 90° and lose an axis |
| 03 | Slerp | Constant-speed rotation along the arc versus the lerp chord |
| | **Waves & Noise** | |
| 01 | Sine & cosine | A point on a circle unrolled into sin and cos waves; frequency, amplitude, phase |
| 02 | Sawtooth | `frac(x·f)` and its triangle and square cousins driving an output bar |
| 03 | Perlin noise | Gradient arrows, corner votes, fade curve, octaves, and a 1D slice |
| 04 | Voronoi | Draggable seeds; cells, Worley F1 distance and F2 − F1 edges |
| | **Easing** | |
| 01 | Quad & Cubic | Polynomial ease in / out / in-out with an eased ball racing a linear one |
| 02 | Sine & Expo | The gentlest and the most dramatic standard curves |
| 03 | Back & Elastic | Curves that overshoot or spring outside 0 … 1 |
| 04 | Bounce | Shrinking parabolic hops, like a ball landing |
| | **Physics** | |
| 01 | Acceleration & impulse | Constant force vs instant kicks on a cart, with a live velocity graph |
| 02 | Linear & angular drag | A sliding puck and a spinning wheel decaying exponentially |
| 03 | Springs | Drag a mass on a damped spring; stiffness, damping, mass and ζ |
| | **Shader** | |
| 01 | Normals & normal maps | Mesh vertex vs face normals in side view, and a normal map decoded texel by texel |
| 02 | Fresnel effect | Rim glow on a sphere from n · V, with Schlick and power curves |

## Embedding

```html
<iframe src="https://qhenshaw.github.io/MathVisualizer/" width="100%" height="1000"
        style="border:0" title="Math Visualizer"></iframe>
```

URL options:

- `?topic=dot` opens on a tab, and its category (`dir`, `norm`, `dot`, `cross`, `lerp`, `inv`, `quat`, `gimbal`, `slerp`, `sine`, `saw`, `perlin`, `voronoi`, `easePoly`, `easeSine`, `easeBack`, `easeBounce`, `physAccel`, `physDrag`, `physSpring`, `normals`, `fresnel`)
- `?speed=0.5` changes the animation speed
- `?grid=0` hides the background grid

Example: `https://qhenshaw.github.io/MathVisualizer/?topic=quat&speed=0.5`

## How it's built

- `index.html` is the page that GitHub Pages serves. It has no build step and no external scripts; only the fonts come from Google Fonts.
- `runtime.js` is a ~100-line template runtime on top of [Preact](https://preactjs.com) (vendored in `vendor/`, MIT licensed).
- `src/Main.dc.html` is the original design source from Claude Design. To regenerate `index.html` from it, run:

  ```sh
  python3 build.py src/Main.dc.html
  ```

To run it locally, use any static server (ES modules don't load from `file://`):

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```
