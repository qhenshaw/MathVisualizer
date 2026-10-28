"""Build index.html from the Claude Design artboard source (Main.dc.html).

Usage: python3 build.py path/to/Main.dc.html
"""
import json
import re
import sys
from pathlib import Path

src = Path(sys.argv[1]).read_text(encoding="utf-8")
here = Path(__file__).parent

helmet = re.search(r"<helmet>(.*?)</helmet>", src, re.S).group(1).strip()
body = re.search(r"</helmet>(.*?)</x-dc>", src, re.S).group(1).strip()
m = re.search(r"data-props='(.*?)'>(.*?)</script>", src, re.S)
props_decl = json.loads(m.group(1).replace("&#39;", "'").replace("&amp;", "&"))
logic = m.group(2).strip()
defaults = {k: v["default"] for k, v in props_decl.items() if not k.startswith("$") and "default" in v}

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Math Visualizer</title>
<meta name="description" content="Interactive, animated explainer for the math behind games: vectors, rotations, waves, noise, easing, physics and shaders.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230E1117'/%3E%3Cpath d='M7 25 L24 8' stroke='%23F06FB0' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M15 8 H24 V17' fill='none' stroke='%23F06FB0' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
{helmet}
</head>
<body>
<div id="app"><p style="font-family: system-ui, sans-serif; color: #B4BDCC; padding: 32px">Loading Math Visualizer…</p></div>
<template id="dc-template">
{body}
</template>
<noscript><p style="font-family: system-ui, sans-serif; color: #E6EAF2; padding: 32px">Math Visualizer needs JavaScript to run.</p></noscript>
<script type="module">
import {{ DCLogic, mount }} from './runtime.js';

{logic}

const params = new URLSearchParams(location.search);
const props = {json.dumps(defaults)};
if (params.get('topic')) props.startTopic = params.get('topic');
if (params.get('speed')) props.speed = parseFloat(params.get('speed')) || props.speed;
if (params.get('grid') === '0') props.showGrid = false;
mount(Component, props);
</script>
</body>
</html>
"""
(here / "index.html").write_text(html, encoding="utf-8")
print("wrote index.html", len(html), "bytes; props", defaults)
