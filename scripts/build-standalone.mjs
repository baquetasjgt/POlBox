#!/usr/bin/env node
// POLEBOX — generador del standalone de un solo archivo.
// Sustituye al POLEBOX-standalone.html mantenido a mano (674 KB duplicados
// que divergían del código real). Lee index.html, precompila cada JSX con
// Babel EN BUILD (el navegador ya no compila nada) e inlina React en
// producción: un único HTML autocontenido y sin dependencias externas.
//
// Uso:  node scripts/build-standalone.mjs [salida]  (por defecto POLEBOX-standalone.html)
// Requiere @babel/standalone resoluble via NODE_PATH o node_modules.

import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const Babel = require('@babel/standalone');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

const index = read('index.html');

// CSS del design system, inline
const css = read('colors_and_type.css');

// React/ReactDOM en producción (los vendor de desarrollo pesan 1,2 MB más)
const reactJs = read('vendor/react.production.min.js');
const reactDomJs = read('vendor/react-dom.production.min.js');

// Scripts en el orden exacto de index.html
const plainSrcs = [...index.matchAll(/<script src="((?!vendor\/)[^"]+)"><\/script>/g)].map(m => m[1]);
const babelSrcs = [...index.matchAll(/<script type="text\/babel" src="([^"]+)"><\/script>/g)].map(m => m[1]);

const compile = (src) => Babel.transform(read(src), {
  presets: [['react', { runtime: 'classic' }]],
  filename: src,
}).code;

const plainCode = plainSrcs.map(s => `/* ── ${s} ── */\n${read(s)}`).join('\n\n');
const appCode = babelSrcs.map(s => `/* ── ${s} ── */\n${compile(s)}`).join('\n\n');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>POLEBOX · Prototipo</title>
<style>
${css}
html, body { margin: 0; padding: 0; background: #EDEBE3; }
#root { min-height: 100vh; }
button:focus-visible { outline: 2px solid #482380; outline-offset: 2px; }
*::-webkit-scrollbar { width: 0; height: 0; }
</style>
</head>
<body>
<div id="root"></div>
<script>${reactJs}</script>
<script>${reactDomJs}</script>
<script>
${plainCode}
</script>
<script>
${appCode}
</script>
</body>
</html>
`;

const out = process.argv[2] || 'POLEBOX-standalone.html';
writeFileSync(resolve(root, out), html);
console.log(`✓ ${out} generado (${(html.length / 1024).toFixed(0)} KB) — ${plainSrcs.length} scripts de datos + ${babelSrcs.length} componentes precompilados`);
