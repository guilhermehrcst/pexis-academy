import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { contrast } from '../src/lib/contrast.ts';

// Contrast is measured, not estimated (spec §6.7, R8). WCAG 2.x: 4.5:1 for text, 7:1 for body ink.
const root = new URL('../', import.meta.url);
const css = readFileSync(new URL('src/styles/global.css', root), 'utf8');
const rootBlock = /:root\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? '';
const token = (name: string): string => {
  const value = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(rootBlock)?.[1];
  assert.ok(value, `--${name} is a hex token`);
  return value!;
};

test('the contrast function matches a known reference', () => {
  assert.ok(Math.abs(contrast('#ffffff', '#0b57d0') - 6.4) < 0.05, String(contrast('#ffffff', '#0b57d0')));
  assert.equal(Math.round(contrast('#000000', '#ffffff') * 100) / 100, 21);
  assert.equal(contrast('#777777', '#777777'), 1);
});

const pairs: [string, string, number][] = [
  ['ink', 'paper', 7], ['ink', 'surface', 7], ['ink-soft', 'paper', 7],
  ['muted', 'paper', 4.5], ['muted', 'surface', 4.5],
  ['action', 'paper', 4.5], ['action', 'surface', 4.5], ['action-hover', 'paper', 4.5],
  ['on-action', 'action', 4.5], ['on-action', 'action-hover', 4.5],
  ['ink', 'raised', 7], ['muted', 'raised', 4.5], ['action', 'raised', 4.5],
  ['ink', 'tint-brand', 7], ['muted', 'tint-brand', 4.5], ['action', 'tint-brand', 4.5], ['ink-soft', 'tint-brand', 7],
  // The navy of the identity: the wordmark and headings on white, and text set on the navy.
  ['brand', 'paper', 7], ['on-brand', 'brand', 7],
  // Menus and the course library: panels, chips and avatars on the neutral grounds; the chosen chip on the navy.
  ['ink', 'tint-neutral', 7], ['muted', 'tint-neutral', 4.5], ['brand', 'raised', 7],
  // The Home's path cards: the name, its line and its state on each ground (navy, never the blue: the blue
  // falls under 4.5:1 on these tones); ink on the deep tones.
  ...(['sage', 'peach', 'sky', 'cream', 'blush', 'sand'] as const).flatMap((bg): [string, string, number][] => [['ink', bg, 7], ['muted', bg, 4.5], ['brand', bg, 7], ['ink', `${bg}-deep`, 7]]),
];
for (const [fg, bg, min] of pairs) {
  test(`--${fg} on --${bg} is at least ${min}:1`, () => {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= min, `${ratio.toFixed(2)}:1`);
  });
}

test('no hex colour outside :root, but the theme-color meta, which equals --paper', () => {
  const walk = (dir: string): string[] => readdirSync(new URL(dir, root)).flatMap((name) => {
    const path = `${dir}/${name}`;
    return statSync(new URL(path, root)).isDirectory() ? walk(path) : [path];
  });
  for (const path of walk('src').filter((p) => /\.(astro|css)$/.test(p))) {
    let text = readFileSync(new URL(path, root), 'utf8');
    if (path.endsWith('global.css')) text = text.replace(rootBlock, '');
    const theme = /<meta name="theme-color" content="(#[0-9a-f]{6})">/i.exec(text);
    if (theme) {
      assert.equal(theme[1]!.toLowerCase(), token('paper'), 'theme-color equals --paper');
      text = text.replace(theme[0], '');
    }
    assert.ok(!/#[0-9a-f]{3,8}\b(?![\w-])/i.test(text.replace(/href="#[^"]*"|`#\$\{[^}]*\}`|'#[a-z-]*'/g, '')), `hex colour in ${path}`);
  }
});

test('one action colour, the primary blue; the navy is the identity; the former wine is gone', () => {
  assert.equal(token('action'), '#175cd3');
  assert.equal(token('brand'), '#102a56');
  assert.notEqual(token('action'), token('brand'));
  assert.ok(!/#720111|#8c1023|#5a000d/i.test(css), 'the Pexis Academy wine is gone');
});
