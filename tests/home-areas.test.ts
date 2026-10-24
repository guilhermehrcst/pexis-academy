import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { contrast } from '../src/lib/contrast.ts';
import { AREA_TONE } from '../src/lib/area-signs.ts';
import { AREA_ORDER } from '../src/lib/taxonomy.ts';

// The six pictures of the Home's area cards (src/assets/areas/manifest.json): the owner's choice, prepared once so
// that six styles read as one system. The files are checked against the manifest, so a hand-edited or stale one
// fails here even if it looks right; the card keeps its panel and its links; the panel stays legible whatever
// the darkest pixel of a picture.
const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root));
const manifest = JSON.parse(read('src/assets/areas/manifest.json').toString()) as {
  tones: Record<string, string>;
  files: Record<string, { source: string; sourceSha256: string; sha256: string; crop: number[] }>;
};
const component = read('src/components/HomeAreas.astro').toString();
const css = read('src/styles/global.css').toString();
const token = (name: string): string => {
  const value = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css)?.[1];
  assert.ok(value, `--${name} is a hex token`);
  return value!;
};

/** Width and height of a JPEG, read from its first start-of-frame marker. */
const jpegSize = (bytes: Uint8Array): [number, number] => {
  const u16 = (at: number): number => bytes[at]! * 256 + bytes[at + 1]!;
  assert.equal(u16(0), 0xffd8, 'a JPEG');
  for (let i = 2; i < bytes.length;) {
    assert.equal(bytes[i], 0xff, 'a marker');
    const marker = bytes[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [u16(i + 7), u16(i + 5)];
    i += 2 + u16(i + 2);
  }
  throw new Error('no frame');
};

test('every area has its picture: the file the manifest records, square and the same size for all', () => {
  assert.deepEqual(Object.keys(manifest.files), [...AREA_ORDER]);
  for (const area of AREA_ORDER) {
    const bytes = read(`src/assets/areas/${area}.jpg`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.files[area]!.sha256, `${area} matches the manifest`);
    assert.deepEqual(jpegSize(bytes), [1000, 1000], `${area} is 1000x1000`);
    assert.ok(bytes.length < 250_000, `${area} stays light (${bytes.length} bytes)`);
    assert.match(manifest.files[area]!.sourceSha256, /^[0-9a-f]{64}$/, `${area} records its original`);
  }
});

test('each picture is toned for its own card: the manifest and the Home agree on the tone of every area', () => {
  assert.deepEqual(manifest.tones, AREA_TONE);
  const lib = read('src/lib/area-images.ts').toString();
  for (const area of AREA_ORDER) assert.match(lib, new RegExp(`import ${area} from '\\.\\./assets/areas/${area}\\.jpg';`), area);
  assert.match(lib, /\{ matematica, linguagens, natureza, humanas, idiomas, tecnologia \}/);
});

test('the card keeps its structure: a picture that is decorative, the area name, the subjects as links', () => {
  // The picture: empty alt, in a field hidden from assistive tech, behind the panel in the order of the document.
  assert.match(component, /<div class="art" aria-hidden="true">\s*<Image src=\{areaImages\[area\.id\]\} alt=""/);
  assert.ok(component.indexOf('class="art"') < component.indexOf('class="panel"'), 'the picture comes before the panel');
  assert.match(component, /<h3 class="name">\{area\.label\}<\/h3>/);
  assert.match(component, /area\.subjects\.map\(\(id\) => <li><a href=\{routes\.subject\(id\)\}>\{SUBJECTS\[id\]\.label\}<\/a><\/li>\)/);
  assert.doesNotMatch(component, /data-sign|AREA_SIGNS/, 'the typographic signs gave way to the pictures');
  // Decorative pictures are never what loads first: the section is below the fold.
  assert.match(component, /loading="lazy"/);
});

test('the panel stays legible over the darkest pixel a picture can have', () => {
  const alpha = Number(/background: rgb\(255 253 249 \/ ([\d.]+)\);/.exec(component)?.[1]);
  assert.ok(alpha >= 0.9 && alpha <= 1, `the panel is nearly opaque (${alpha})`);
  const hex = (n: number[]) => `#${n.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
  for (const tone of new Set(Object.values(AREA_TONE))) {
    const deep = token(`${tone}-deep`);
    // The recipe's dark end: the area's deep tone shaded to 60% (src/assets/areas/manifest.json).
    const dark = [1, 3, 5].map((i) => Number.parseInt(deep.slice(i, i + 2), 16) * 0.6);
    const panel = [255, 253, 249].map((v, i) => alpha * v + (1 - alpha) * dark[i]!);
    assert.ok(contrast(token('ink'), hex(panel)) >= 7, `--ink on the panel over ${tone}`);
    assert.ok(contrast(token('action'), hex(panel)) >= 4.5, `--action (a link in hover) on the panel over ${tone}`);
  }
});
