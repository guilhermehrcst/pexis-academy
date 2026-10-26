import { test } from 'node:test';
import assert from 'node:assert/strict';
import intake from '../docs/academy/research/2026-10-26-reconstructed-36.json' with { type: 'json' };
import { RECOVERY36_STAGING, RECOVERY36_AUTHORIZES_PUBLICATION } from '../src/lib/staging-recovery-36.ts';
import { catalogue, publishedResources, resourceProblems, RELEASE } from '../src/lib/learning-resources.ts';
import { STAGED_RESOURCES } from '../src/lib/staging.ts';
import { GATEB_NEW_RESOURCES } from '../src/lib/staging-gateb.ts';
import { MILITARY_L003_CANDIDATES } from '../src/lib/staging-military.ts';
import { digestOf } from '../src/lib/release/canonical.ts';

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

test('a reviewable nine-item approval queue is pinned to the exact verified staging records', () => {
  const queue = RECOVERY36_STAGING.filter((r) => r.verified).map((r) => ({
    id: r.id,
    url: r.url,
    digest: digestOf(r),
    provider: r.provider,
    format: r.format,
    verifiedOn: r.verified!.on,
  }));
  assert.equal(queue.length, 9);
  assert.equal(new Set(queue.map((e) => e.digest)).size, 9);
  assert.ok(queue.every((e) => e.digest.startsWith('sha256:')));
  // Review evidence only, never an approval: this output can be copied into a
  // precise future human-decision packet without pretending the decision exists.
  console.log('PAULEX_RECOVERY36_APPROVAL_QUEUE=' + JSON.stringify(queue));
});

test('editorial review packet hashes are exact, complete, and do not authorize publication', async () => {
  const packet = (await import('../docs/academy/research/2026-10-26-l003-exact-nine-review.json', { with: { type: 'json' } })).default;
  assert.equal(packet.recordCount, 9);
  assert.equal(packet.approvalBy, null);
  assert.equal(packet.authorization, null);
  assert.equal(packet.status, 'awaiting_explicit_human_editorial_approval');
  const verified = RECOVERY36_STAGING.filter((r) => r.verified);
  assert.deepEqual(packet.entries.map((entry) => entry.id), verified.map((r) => r.id));
  for (const entry of packet.entries) {
    const record = verified.find((r) => r.id === entry.id);
    assert.ok(record, entry.id);
    assert.equal(entry.digest, digestOf(record), entry.id);
    assert.equal(entry.url, record!.url, entry.id);
    assert.equal(entry.evidenceUrl, record!.verified!.evidence?.url, entry.id);
    assert.equal(entry.verifiedOn, record!.verified!.on, entry.id);
    assert.equal(entry.accessMode, record!.accessMode, entry.id);
  }
});
