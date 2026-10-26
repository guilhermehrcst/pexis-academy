import { test } from 'node:test';
import assert from 'node:assert/strict';
import intake from '../docs/academy/research/2026-10-26-reconstructed-36.json' with { type: 'json' };
import { RECOVERY36_STAGING, RECOVERY36_AUTHORIZES_PUBLICATION } from '../src/lib/staging-recovery-36.ts';
import { catalogue, publishedResources, resourceProblems, RELEASE } from '../src/lib/learning-resources.ts';
import { STAGED_RESOURCES } from '../src/lib/staging.ts';
import { GATEB_NEW_RESOURCES } from '../src/lib/staging-gateb.ts';
import { MILITARY_L003_CANDIDATES } from '../src/lib/staging-military.ts';

const previous = [...catalogue, ...STAGED_RESOURCES, ...GATEB_NEW_RESOURCES, ...MILITARY_L003_CANDIDATES];

test('36 reconstructed research candidates are accurately labeled and never auto-approved', () => {
  assert.equal(intake.candidates.length, 36);
  assert.deepEqual(intake.accessCounts, { free: 31, paid: 3, subscription: 2 });
  assert.equal(intake.approvalStatus, 'not-approved');
  assert.equal(intake.publicationStatus, 'not-published');
  assert.ok(intake.candidates.every((r) => r.editoriallyApproved === false && r.publicationAuthorized === false));
  assert.equal(new Set(intake.candidates.map((r) => r.url)).size, 36);
});

test('typed staging preserves the 25 compatible routes and keeps 11 new-category items in research only', () => {
  assert.equal(RECOVERY36_STAGING.length, 25);
  assert.equal(RECOVERY36_AUTHORIZES_PUBLICATION, false);
  const allowed = new Set(intake.candidates.map((r) => r.researchId.toLowerCase()));
  for (const r of RECOVERY36_STAGING) {
    assert.ok(allowed.has(r.id.replace(/^research-/, '')), r.id);
    if (r.verified) {
      assert.equal(r.verified.on, '2026-10-26', r.id);
      assert.equal(r.verified.by, 'official-page', r.id);
      assert.equal(r.verified.evidence?.url, r.url, r.id);
      assert.ok(r.verified.evidence?.note.trim(), r.id);
    }
    assert.deepEqual(resourceProblems(r, new Date('2026-10-26T23:59:59Z')), [], r.id);
    assert.ok(r.accessMode && r.accessMode !== 'unconfirmed', r.id);
    if (r.verified) assert.ok(r.review?.includes('Página oficial revalidada'), r.id);
    else assert.ok(r.review?.includes('Ainda sem revalidação'), r.id);
  }
  assert.equal(RECOVERY36_STAGING.filter((r) => r.verified !== undefined).length, 9);
  assert.equal(RECOVERY36_STAGING.filter((r) => r.verified === undefined).length, 16);
});

test('recovery data cannot mutate baseline, shadow old ids or appear on public pages', () => {
  const oldIds = new Set(previous.map((r) => r.id));
  const oldUrls = new Set(previous.filter((r) => r.url).map((r) => r.url));
  const publicIds = new Set(publishedResources.map((r) => r.id));
  assert.equal(publishedResources.length, 44);
  assert.deepEqual(RELEASE.problems, []);
  for (const r of RECOVERY36_STAGING) {
    assert.ok(!oldIds.has(r.id), r.id);
    assert.ok(!oldUrls.has(r.url), `${r.id}: use existing record, don't duplicate URLs`);
    assert.ok(!publicIds.has(r.id), r.id);
  }
});
