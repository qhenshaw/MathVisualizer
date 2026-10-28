# Vector Lab — MathVisualizer

An interactive, animated explainer for the vector math behind games, shaders and animation rigs.

**Live:** https://qhenshaw.github.io/MathVisualizer/

| # | Topic | What you can do |
|---|-------|-----------------|
| 01 | Directions | Drag a player and an enemy; see `Q − P`, its length and the normalized direction |
| 02 | Normalization | Drag `v` and watch `n = v / |v|` stay on the unit circle |
| 03 | Dot product | Drag two unit vectors; read `A · B = cos θ` on a −1…1 scale |
| 04 | Cross product | Drag unit vectors in 3D; see `A × B`, the parallelogram and `sin θ` |
| 05 | Lerp | Blend two points (and colors) by `t`, with optional smoothstep easing |
| 06 | Slerp | Constant-speed rotation along the arc versus the lerp chord |
| 07 | Inverse lerp | Remap a value as a straight line through `(a, c)` and `(b, d)` |
| 08 | Gimbal lock | Yaw / pitch / roll rings; pitch to 90° and lose an axis |
| 09 | Quaternions | Rotate a cube by axis and angle; watch `w, x, y, z` and the 720° double cover |

## Embedding

```html
<iframe src="https://qhenshaw.github.io/MathVisualizer/" width="100%" height="1000"
        style="border:0" title="Vector Lab"></iframe>
```

URL options:

- `?topic=dot` opens on a tab (`dir`, `norm`, `dot`, `cross`, `lerp`, `slerp`, `inv`, `gimbal`, `quat`)
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
