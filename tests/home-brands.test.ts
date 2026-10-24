import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { publishedResources, type PublishedLearningResource } from '../src/lib/learning-resources.ts';
import { publishedTracksFor } from '../src/lib/tech-tracks.ts';
import { HOME_BRANDS, homeBrands } from '../src/lib/home-brands.ts';

// The Home's row of six technology companies: in the owner's order, linked and counted only from what the catalogue
// publishes (never typed), and with marks that are the supplied files, untouched. The staged candidates of the PR
// that prepares their courses are not in the catalogue, so none is shown as available.
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url));
const tracks = publishedTracksFor(publishedResources);
const clone = (provider: string, patch: Partial<PublishedLearningResource> = {}): PublishedLearningResource => {
  const base = publishedResources.find((r) => r.provider === 'Cisco Networking Academy' && r.format === 'course')!;
  return { ...base, provider, ...patch } as PublishedLearningResource;
};

test('the row, in the owner\'s order, with the provider names the staged courses use', () => {
  assert.deepEqual(HOME_BRANDS.map((b) => b.name), ['Anthropic', 'Google', 'OpenAI', 'NVIDIA', 'Apple', 'Meta']);
  assert.deepEqual(HOME_BRANDS.map((b) => b.provider), ['Anthropic', 'Google', 'OpenAI', 'NVIDIA Deep Learning Institute', 'Apple Developer', 'Meta Blueprint']);
});

test('today nothing of theirs is published, so no company has a link or a count', () => {
  const cells = homeBrands(HOME_BRANDS, publishedResources, tracks);
  assert.equal(cells.length, 6);
  // If a company's course is published later this is the test that changes, with the release that publishes it.
  for (const cell of cells) assert.equal(cell.source, null, `${cell.name} has no published course`);
  assert.ok(!publishedResources.some((r) => HOME_BRANDS.some((b) => b.provider === r.provider)));
});

test('a company with a published course leads to it, with its real count; the others stay bare', () => {
  const cells = homeBrands(HOME_BRANDS, [clone('Google')], tracks);
  const google = cells.find((cell) => cell.name === 'Google')!;
  assert.equal(google.source?.count, 1);
  assert.match(google.source!.href, /^\/tecnologia\/#[\w-]+$/);
  assert.deepEqual(cells.filter((cell) => cell.source).map((cell) => cell.name), ['Google']);
  // The order never depends on what is published.
  assert.deepEqual(cells.map((cell) => cell.name), HOME_BRANDS.map((b) => b.name));
});

test('a provider name that differs leaves a company bare, never with a link that is not its own', () => {
  const cells = homeBrands(HOME_BRANDS, [clone('Apple')], tracks);
  assert.equal(cells.filter((cell) => cell.source).length, 0, '"Apple" is not "Apple Developer"');
});

test('publishing something that is not a course stops the build until someone decides where it leads', () => {
  assert.throws(() => homeBrands(HOME_BRANDS, [clone('Apple Developer', { format: 'lessons' })], tracks), /not a course/);
});

test('the marks are the supplied files, untouched, and their geometry is the one recorded', () => {
  const manifest = JSON.parse(read('src/assets/providers/brands.json').toString()) as {
    provenance: { status: string; guidelinesChecked: boolean; ownerConfirmed: boolean };
    files: Record<string, { sha256: string; width: number; height: number; bbox: number[] }>;
  };
  const providers = read('src/lib/providers.ts').toString();
  assert.deepEqual(Object.keys(manifest.files), HOME_BRANDS.map((b) => b.id));
  for (const brand of HOME_BRANDS) {
    const file = manifest.files[brand.id]!;
    assert.equal(createHash('sha256').update(read(`src/assets/providers/${brand.id}.png`)).digest('hex'), file.sha256, `${brand.id}.png is the file as supplied`);
    assert.match(providers, new RegExp(`${brand.id}: \\{ src: ${brand.id}, alt: '${brand.name}', bbox: \\[${file.bbox.join(', ')}\\], h: \\d+ \\},`), `${brand.id}: alt and visible box as measured`);
    assert.match(providers, new RegExp(`  ${brand.id}: \\[marks\\.${brand.id}\\],`), `${brand.id} is in brandMarks`);
  }
  // Apart from providerMarks on purpose: the course cards and avatars do not use them yet.
  const providerBlock = providers.slice(providers.indexOf('export const providerMarks'), providers.indexOf('/** The marks of the Home'));
  for (const brand of HOME_BRANDS) assert.doesNotMatch(providerBlock, new RegExp(`marks\\.${brand.id}\\b`));
  // What is not known stays recorded as not known, until the owner confirms it.
  assert.equal(manifest.provenance.status, 'owner-supplied-origin-unverified');
  assert.equal(manifest.provenance.guidelinesChecked, false);
  assert.equal(manifest.provenance.ownerConfirmed, false);
});
