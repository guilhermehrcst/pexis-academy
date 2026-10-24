import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

// The Paulex Edu identity (src/assets/brand/manifest.json). The wordmark is type; the official mascot is the
// owner's file, never drawn here; the icons are derived from it. Every file is checked against the manifest
// so a hand-edited or stale file fails here even if it looks right.
const root = new URL('../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root));
const manifest = JSON.parse(read('src/assets/brand/manifest.json').toString()) as {
  brand: string;
  navy: string;
  primary: string;
  mascot: { status: 'pending' | 'supplied' };
  icons: { provisional: boolean };
  sha256: Record<string, string>;
};

test('every brand file is exactly the one recorded in the manifest', () => {
  assert.deepEqual(Object.keys(manifest.sha256).sort(), ['public/apple-touch-icon.png', 'public/favicon-32.png', 'public/icon-192.png', 'src/assets/brand/paulex-mascot.png']);
  for (const [path, hash] of Object.entries(manifest.sha256)) {
    assert.ok(existsSync(new URL(path, root)), `${path} exists`);
    assert.equal(createHash('sha256').update(read(path)).digest('hex'), hash, `${path} matches the manifest`);
  }
});

test('the tokens are the identity recorded in the manifest', () => {
  const css = read('src/styles/global.css').toString();
  assert.equal(manifest.brand, 'Paulex Edu');
  assert.equal(/--brand:\s*(#[0-9a-f]{6})/i.exec(css)?.[1]?.toLowerCase(), manifest.navy);
  assert.equal(/--action:\s*(#[0-9a-f]{6})/i.exec(css)?.[1]?.toLowerCase(), manifest.primary);
});

test('the mascot is never invented: the manifest and the files agree on whether it exists', () => {
  const supplied = readdirSync(new URL('src/assets/brand/', root)).filter((name) => /^paulex-mascot\.(svg|png)$/.test(name));
  assert.equal(manifest.mascot.status, supplied.length ? 'supplied' : 'pending');
  // While it is pending, the icons say they are provisional; the day it arrives, they must be redone from it.
  assert.equal(manifest.icons.provisional, manifest.mascot.status === 'pending');
  const mark = read('src/components/BrandMark.astro').toString();
  assert.match(mark, /import\.meta\.glob<[^>]+>\('\.\.\/assets\/brand\/paulex-mascot\.\{svg,png\}'/, 'the mascot slot reads the official file only');
  assert.doesNotMatch(mark, /<svg\b|<circle\b|<path\b/, 'no drawn stand-in for the mascot');
});

test('the former Pexis Academy artwork is gone from the site', () => {
  for (const gone of ['src/assets/brand/lockup-white.png', 'src/assets/brand/symbol-white.png', 'src/assets/brand/source', 'scripts/brand-assets.mjs']) {
    assert.ok(!existsSync(new URL(gone, root)), `${gone} is gone`);
  }
});

test('the page shell links the icons, and the header and footer carry the wordmark', () => {
  const base = read('src/layouts/Base.astro').toString();
  for (const icon of ['/favicon-32.png', '/icon-192.png', '/apple-touch-icon.png']) assert.ok(base.includes(`href="${icon}"`), icon);
  assert.ok(!existsSync(new URL('public/favicon.svg', root)));
  for (const shell of ['src/components/SiteHeader.astro', 'src/components/SiteFooter.astro']) {
    assert.match(read(shell).toString(), /<BrandMark\b/, `${shell} shows the wordmark`);
  }
});
