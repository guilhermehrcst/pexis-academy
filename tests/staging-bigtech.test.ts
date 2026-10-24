import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BIGTECH_CANDIDATES, BIGTECH_STAGING_AUTHORIZES_PUBLICATION } from '../src/lib/staging-bigtech.ts';
import { resourceProblems, publishedResources } from '../src/lib/learning-resources.ts';
import { STAGED_RESOURCES } from '../src/lib/staging.ts';

test('new big-tech candidates are editorial staging, not automatic publication', () => {
  assert.equal(BIGTECH_STAGING_AUTHORIZES_PUBLICATION, false);
  assert.equal(BIGTECH_CANDIDATES.length, 8);
  const ids = BIGTECH_CANDIDATES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.ok(!publishedResources.some((r) => r.id === id), id);
});

test('the six publishing organizations are identified and Google MLCC is not duplicated', () => {
  assert.deepEqual([...new Set(BIGTECH_CANDIDATES.map((r) => r.provider))].sort(), [
    'Anthropic', 'Apple Developer', 'Google', 'Meta Blueprint', 'NVIDIA Deep Learning Institute', 'OpenAI',
  ]);
  assert.ok(STAGED_RESOURCES.some((r) => r.id === 'google-mlcc'));
  assert.ok(!BIGTECH_CANDIDATES.some((r) => r.id === 'google-mlcc'));
  const allIds = [...STAGED_RESOURCES, ...BIGTECH_CANDIDATES].map((r) => r.id);
  assert.equal(new Set(allIds).size, allIds.length);
});

test('candidate records pass the catalogue shape and remain strictly source-linked', () => {
  for (const item of BIGTECH_CANDIDATES) {
    assert.deepEqual(resourceProblems(item), [], item.id);
    assert.ok(item.url?.startsWith('https://'), item.id);
    assert.ok(item.paths.includes('tecnologia'), item.id);
    assert.ok(item.registration !== undefined && item.certificate !== undefined, item.id);
    assert.ok(!/affiliate|utm_source|utm_medium|utm_campaign/.test(item.url ?? ''), item.id);
  }
});

test('only the two directly accessible official sources carry completed verification', () => {
  assert.deepEqual(BIGTECH_CANDIDATES.filter((r) => r.verified).map((r) => r.id).sort(), [
    'apple-develop-in-swift', 'google-intro-ml',
  ]);
  for (const item of BIGTECH_CANDIDATES.filter((r) => r.verified)) {
    assert.equal(item.verified?.evidence?.url, item.url);
    assert.equal(item.verified?.on, '2026-10-24');
  }
  for (const item of BIGTECH_CANDIDATES.filter((r) => !r.verified)) {
    assert.ok(item.review?.trim(), item.id);
  }
});

test('Apple stays labelled as tutorials, not as a course', () => {
  assert.equal(BIGTECH_CANDIDATES.find((r) => r.id === 'apple-develop-in-swift')?.format, 'lessons');
});

test('digital advertising is not falsely tagged as programming or generative AI', () => {
  const meta = BIGTECH_CANDIDATES.find((r) => r.id === 'meta-blueprint-intro-ads');
  assert.equal(meta?.provider, 'Meta Blueprint');
  assert.equal(meta?.technology, undefined);
});
