// Tiny template runtime: renders the page's <template id="dc-template"> markup with Preact.
// Supports {{dotted.path}} holes in text and attributes, <sc-if value>, <sc-for list as>,
// and event attributes (onClick, onPointerDown, ...). Logic lives in a class extending DCLogic.
import { h, render, Component } from './vendor/preact.module.js';

const WHOLE = /^\{\{\s*([^{}]+?)\s*\}\}$/;
const HOLE = /\{\{\s*([^{}]+?)\s*\}\}/g;
const SVG_NS = 'http://www.w3.org/2000/svg';

function lookup(path, scopes) {
  if (path === 'true') return true;
  if (path === 'false') return false;
  if (path === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(path)) return parseFloat(path);
  const parts = path.split('.');
  for (let i = scopes.length - 1; i >= 0; i--) {
    const sc = scopes[i];
    if (sc && typeof sc === 'object' && parts[0] in sc) {
      let v = sc;
      for (const p of parts) { if (v == null) return undefined; v = v[p]; }
      return v;
    }
  }
  return undefined;
}

function evalAttr(raw, scopes) {
  const m = WHOLE.exec(raw);
  if (m) return lookup(m[1], scopes);
  if (raw.indexOf('{{') === -1) return raw;
  return raw.replace(HOLE, (_, p) => { const v = lookup(p, scopes); return v == null ? '' : String(v); });
}

// Compile DOM nodes once into a light tree.
function compile(node, inSvg) {
  if (node.nodeType === 3) {
    const text = node.nodeValue;
    if (!text.trim()) return inSvg ? null : { t: 'text', raw: ' ' };
    return { t: 'text', raw: text };
  }
  if (node.nodeType !== 1) return null;
  const tag = node.localName;
  const svg = inSvg || node.namespaceURI === SVG_NS || tag === 'svg';
  const attrs = [];
  for (const a of node.attributes) {
    if (a.name.startsWith('hint-')) continue;
    let name = a.name;
    if (name === 'onchange' && tag === 'input') name = 'oninput';
    attrs.push([name, a.value]);
  }
  const kids = [];
  for (const c of node.childNodes) { const k = compile(c, svg); if (k) kids.push(k); }
  if (tag === 'sc-if') return { t: 'if', value: node.getAttribute('value'), kids };
  if (tag === 'sc-for') return { t: 'for', list: node.getAttribute('list'), as: node.getAttribute('as') || 'item', kids };
  return { t: 'el', tag, attrs, kids };
}

function renderNodes(nodes, scopes, out) {
  for (const n of nodes) {
    if (n.t === 'text') {
      out.push(n.raw.indexOf('{{') === -1 ? n.raw : n.raw.replace(HOLE, (_, p) => { const v = lookup(p, scopes); return v == null ? '' : String(v); }));
    } else if (n.t === 'if') {
      if (evalAttr(n.value, scopes)) renderNodes(n.kids, scopes, out);
    } else if (n.t === 'for') {
      const list = evalAttr(n.list, scopes) || [];
      list.forEach((item, i) => renderNodes(n.kids, scopes.concat([{ [n.as]: item, $index: i }]), out));
    } else {
      const props = {};
      for (const [k, raw] of n.attrs) {
        const v = evalAttr(raw, scopes);
        if (v === undefined) continue;
        props[k] = v;
      }
      const kids = [];
      renderNodes(n.kids, scopes, kids);
      out.push(h(n.tag, props, kids));
    }
  }
  return out;
}

const tplEl = document.getElementById('dc-template');
const TREE = [];
for (const c of tplEl.content.childNodes) { const k = compile(c, false); if (k && k.t !== 'text') TREE.push(k); }

export class DCLogic extends Component {
  render() { return renderNodes(TREE, [this.renderVals()], []); }
}

export function mount(Cls, props) {
  const root = document.getElementById('app');
  root.textContent = '';
  render(h(Cls, props), root);
}
