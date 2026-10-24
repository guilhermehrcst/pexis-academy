import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { contrast } from '../src/lib/contrast.ts';
import { AREA_TONE } from '../src/lib/area-signs.ts';
import { AREA_ORDER } from '../src/lib/taxonomy.ts';

// The six pictures of the Home's area cards (src/assets/areas/manifest.json): the owner's files, byte for byte, in
// their own colours. A first version toned them to each card inside the files themselves; that was rejected, so
// the files are held to the owner's hashes, and the card's CSS is held to touch nothing of their colour. The card
// keeps its panel and its links, and the panel stays legible whatever the picture.
const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root));
const manifest = JSON.parse(read('src/assets/areas/manifest.json').toString()) as {
  tones: Record<string, string>;
  provenance: { status: string; c2pa: { generator: string; digitalSourceType: string } };
  files: Record<string, { source: string; sha256: string; width: number; height: number; ground?: { value: string } }>;
};
const component = read('src/components/HomeAreas.astro').toString();
const css = read('src/styles/global.css').toString();
const token = (name: string): string => {
  const value = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css)?.[1];
  assert.ok(value, `--${name} is a hex token`);
  return value!;
};

/** Width and height of a PNG, read from its IHDR chunk. */
const pngSize = (bytes: Uint8Array): [number, number] => {
  const u32 = (at: number): number => bytes[at]! * 16777216 + bytes[at + 1]! * 65536 + bytes[at + 2]! * 256 + bytes[at + 3]!;
  assert.equal(u32(0), 0x89504e47, 'a PNG');
  return [u32(16), u32(20)];
};

test('every area has its picture: the owner\'s file, untouched, as the manifest records it', () => {
  assert.deepEqual(Object.keys(manifest.files), [...AREA_ORDER]);
  for (const area of AREA_ORDER) {
    const bytes = read(`src/assets/areas/${area}.png`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.files[area]!.sha256, `${area} is the file as supplied`);
    assert.deepEqual(pngSize(bytes), [manifest.files[area]!.width, manifest.files[area]!.height], `${area} keeps its own proportions`);
  }
  // They are AI-generated, and their Content Credentials (a C2PA manifest in the PNG) say so: the manifest records
  // what the files declare, and that publishing them is the owner's to confirm, until they do.
  assert.equal(manifest.provenance.status, 'ai-generated-rights-unconfirmed');
  assert.match(manifest.provenance.c2pa.generator, /gpt-image/);
  assert.match(manifest.provenance.c2pa.digitalSourceType, /trainedAlgorithmicMedia$/);
  for (const area of AREA_ORDER) {
    const text = read(`src/assets/areas/${area}.png`).toString();
    assert.ok(text.includes('caBX') && text.includes('trainedAlgorithmicMedia') && text.includes('gpt-image'), `${area} carries the credentials the manifest records`);
  }
});

test('the manifest and the Home agree on the tone of every area, and every picture is imported with the place of its subject', () => {
  assert.deepEqual(manifest.tones, AREA_TONE);
  const lib = read('src/lib/area-images.ts').toString();
  for (const area of AREA_ORDER) {
    assert.match(lib, new RegExp(`import ${area} from '\\.\\./assets/areas/${area}\\.png';`), area);
    assert.match(lib, new RegExp(`${area}: \\{ src: ${area}, position: '\\d+% \\d+%', fit: '(cover|contain)'`), `${area} has its picture, the place of its subject and its fit`);
  }
  // A picture shown whole (contain) sits over the flat ground measured in its own file, recorded in the manifest.
  const grounds = [...lib.matchAll(/(\w+): \{ src: \w+, position: '[^']+', fit: 'contain', ground: '([^']+)' \}/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(grounds, [['idiomas', manifest.files['idiomas']!.ground!.value]]);
  assert.equal((lib.match(/fit: 'contain'/g) ?? []).length, grounds.length, 'only a picture with a ground is shown whole');
});

test('the card keeps its structure: a picture that is decorative, the area name, the subjects as links', () => {
  // The picture: empty alt, in a field hidden from assistive tech, behind the panel in the order of the document.
  assert.match(component, /<div class="art" aria-hidden="true"[^>]*>\s*<Image src=\{areaImages\[area\.id\]\.src\} alt=""/);
  assert.ok(component.indexOf('class="art"') < component.indexOf('class="panel"'), 'the picture comes before the panel');
  assert.match(component, /<h3 class="name">\{area\.label\}<\/h3>/);
  assert.match(component, /area\.subjects\.map\(\(id\) => <li><a href=\{routes\.subject\(id\)\}>\{SUBJECTS\[id\]\.label\}<\/a><\/li>\)/);
  assert.doesNotMatch(component, /data-sign|AREA_SIGNS/, 'the typographic signs gave way to the pictures');
  // Decorative pictures are never what loads first: the section is below the fold.
  assert.match(component, /loading="lazy"/);
});

test('nothing in the card touches the colour of the pictures: no filter, blend, fade or layer over them', () => {
  const markup = component.slice(component.indexOf('---', 3), component.indexOf('<style>'));
  const style = component.slice(component.indexOf('<style>'));
  // The only styles are data: how a picture fits and where its subject sits, and the flat ground a whole picture
  // continues (src/lib/area-images.ts, measured in the file itself, not a tint of the card's colour).
  assert.match(markup, /style=\{`object-fit: \$\{areaImages\[area\.id\]\.fit\}; object-position: \$\{areaImages\[area\.id\]\.position\}`\}/);
  assert.match(markup, /style=\{areaImages\[area\.id\]\.ground \? `background: \$\{areaImages\[area\.id\]\.ground\}` : undefined\}/);
  assert.equal((markup.match(/\sstyle=/g) ?? []).length, 2);
  // No filter at all in the card, not even the panel's blur of what is behind it (backdrop-filter).
  assert.doesNotMatch(style, /filter\s*:/, 'no filter, and no backdrop-filter over a picture');
  assert.doesNotMatch(style, /mix-blend-mode|background-blend-mode|sepia|grayscale|hue-rotate|saturate|brightness\(|contrast\(/);
  // The rules that reach the picture say nothing of opacity or of a layer over it.
  const art = style.match(/\.art[^{]*\{[^}]*\}/g) ?? [];
  assert.ok(art.length >= 2, 'the rules of the picture are found');
  for (const rule of art) assert.doesNotMatch(rule, /opacity|background|::before|::after|mask|clip-path/, rule);
  assert.doesNotMatch(style, /\.art[^{]*::(before|after)|\.area::(before|after)|\.area:has/, 'no pseudo-element layer over a card');
  // The ground of the card is only what shows while a picture loads: it never sits over one.
  assert.match(style, /\.area \{[^}]*background: var\(--ground\);/);
});

test('the panel stays legible over any picture, down to pure black', () => {
  const alpha = Number(/background: rgb\(255 253 249 \/ ([\d.]+)\);/.exec(component)?.[1]);
  assert.ok(alpha >= 0.94 && alpha <= 1, `the panel is near-white and almost opaque (${alpha})`);
  const hex = (n: number[]) => `#${n.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
  // The darkest a backdrop can be is black (the blackboard, the atom's night, the code's screen): the panel over it.
  const worst = hex([255, 253, 249].map((v) => alpha * v));
  assert.ok(contrast(token('ink'), worst) >= 7, `--ink on the panel over black (${contrast(token('ink'), worst).toFixed(1)}:1)`);
  assert.ok(contrast(token('action'), worst) >= 4.5, '--action (a link in hover) on the panel over black');
  assert.ok(contrast(token('muted'), worst) >= 4.5, '--muted on the panel over black');
});
