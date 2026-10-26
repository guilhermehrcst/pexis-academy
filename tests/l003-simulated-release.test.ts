// The nine-item L003 rehearsal is a test, NEVER a release manifest or human approval.
// It does not write to release.json, lots.ts or the public catalogue.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import baseline from '../src/data/academy-release/baseline.json' with { type: 'json' };
import currentRelease from '../src/data/academy-release/release.json' with { type: 'json' };
import { catalogue, publishedResources, resourceProblems, type LearningResource } from '../src/lib/learning-resources.ts';
import { STAGED_RESOURCES } from '../src/lib/staging.ts';
import { GATEB_NEW_RESOURCES } from '../src/lib/staging-gateb.ts';
import { MILITARY_L003_CANDIDATES } from '../src/lib/staging-military.ts';
import { RECOVERY36_STAGING } from '../src/lib/staging-recovery-36.ts';
import { LOT_MANIFESTS } from '../src/lib/release/lots.ts';
import { projectRelease, type LotEntry, type LotManifest, type ReleaseManifest } from '../src/lib/release/engine.ts';
import { digestOf } from '../src/lib/release/canonical.ts';
import { placementOf } from '../src/lib/placement.ts';
import { resourceHome } from '../src/lib/search-index.ts';
import { higherEducationGroupsFor } from '../src/lib/higher-education.ts';
import { techTracksFor } from '../src/lib/tech-tracks.ts';
import { libraryCourses } from '../src/lib/course-library.ts';

const NOW = new Date('2026-10-26T23:59:59Z');
const SIMULATED = 'SIMULAÇÃO — teste isolado, não é decisão editorial';
const verified = RECOVERY36_STAGING.filter((r): r is LearningResource & { verified: NonNullable<LearningResource['verified']>; url: string } =>
  r.verified !== undefined && r.url !== null);
const pool = [...STAGED_RESOURCES, ...GATEB_NEW_RESOURCES, ...MILITARY_L003_CANDIDATES, ...RECOVERY36_STAGING];
const entries: LotEntry[] = verified.map((r) => ({
  id: r.id,
  url: r.url,
  digest: digestOf(r),
  institution: r.provider,
  format: r.format,
  evidence: {
    on: r.verified.on,
    version: 'rehearsal-2026-10-26',
    method: r.verified.by,
    url: r.verified.evidence!.url,
    observed: r.verified.evidence!.note,
  },
  decision: 'approved',
  decidedBy: SIMULATED,
  decidedOn: '2026-10-26',
}));
const hosts = [...new Map(verified.map((r) => {
  const host = new URL(r.url).hostname;
  return [`${host}|${r.provider}`, { host, institution: r.provider }];
})).values()];
const simulatedLot: LotManifest = {
  schema: 'pexis-academy-lot/1',
  lot: 'L003-nine-rehearsal',
  title: 'Nove recursos revalidados (SIMULAÇÃO, sem aprovação humana)',
  createdOn: '2026-10-26',
  simulation: true,
  hosts,
  entries,
  suspensions: [],
  authorization: { by: SIMULATED, on: '2026-10-26' },
};
const pin = { lot: simulatedLot.lot, digest: digestOf(simulatedLot) };
const release: ReleaseManifest = {
  schema: 'pexis-academy-release/1',
  mode: 'simulation',
  applied: [...currentRelease.applied, pin],
  ledger: [...currentRelease.ledger, pin],
  inventory: [...currentRelease.inventory, ...verified.map((r) => r.id)].sort(),
};
const projected = projectRelease({
  catalogue,
  pool,
  baseline,
  lots: [...LOT_MANIFESTS, simulatedLot],
  release,
  validate: (r) => resourceProblems(r, NOW),
  now: NOW,
});

test('L003 rehearsal: isolated nine-resource simulated release transitions 44 to 53', () => {
  assert.equal(currentRelease.mode, 'production');
  assert.equal(currentRelease.inventory.length, 44);
  assert.equal(publishedResources.length, 44);
  assert.equal(verified.length, 9);
  assert.equal(simulatedLot.simulation, true);
  assert.match(SIMULATED, /^SIMULAÇÃO/);
  assert.deepEqual(projected.problems, []);
  assert.equal(projected.published.length, 53);
  assert.equal(new Set(projected.published.map((r) => r.id)).size, 53);
  for (const r of verified) {
    assert.ok(projected.published.some((p) => p.id === r.id), r.id);
    assert.equal(projected.states.get(r.id), 'published', r.id);
    assert.ok(!publishedResources.some((p) => p.id === r.id), r.id);
  }
});

test('L003 rehearsal: every simulated published record is visible and searchable at its real destination', () => {
  assert.deepEqual(projected.problems, []);
  for (const r of projected.published) {
    const at = placementOf(r, undefined, projected.published);
    assert.ok(at, r.id);
    const home = resourceHome(r, projected.published);
    assert.ok(home.startsWith(at!.page), r.id);
  }
  const tech = techTracksFor(projected.published);
  const idsInTracks = tech.flatMap((track) => track.resourceIds);
  for (const r of verified.filter((r) => r.paths.includes('tecnologia'))) {
    assert.ok(idsInTracks.includes(r.id), `${r.id} missing from Technology`);
  }
  assert.deepEqual(higherEducationGroupsFor(projected.published).find((g) => g.id === 'quimica')?.resourceIds, ['research-int-002']);
  const shownCourses = libraryCourses(projected.published);
  assert.ok(shownCourses.some((r) => r.id === 'research-br1-014'));
  assert.ok(shownCourses.some((r) => r.id === 'research-tec-054'));
  assert.ok(!shownCourses.some((r) => r.id === 'research-br1-016'), 'past-exam must never masquerade as a course');
});

test('L003 rehearsal: published files and human authorization remain untouched', () => {
  assert.ok(!LOT_MANIFESTS.some((m) => (m as LotManifest).lot === simulatedLot.lot));
  assert.ok(!currentRelease.applied.some((m) => m.lot === simulatedLot.lot));
  assert.equal(projected.states.get('research-int-002'), 'published');
  assert.equal(publishedResources.some((r) => r.id === 'research-int-002'), false);
});
