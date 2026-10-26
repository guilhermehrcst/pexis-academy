import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publishedResources } from '../src/lib/learning-resources.ts';
import { RECOVERY36_STAGING } from '../src/lib/staging-recovery-36.ts';
import { placementOf } from '../src/lib/placement.ts';
import { resourceHome } from '../src/lib/search-index.ts';
import { higherEducationGroupsFor } from '../src/lib/higher-education.ts';
import { techTracksFor } from '../src/lib/tech-tracks.ts';

const verified = RECOVERY36_STAGING.filter((r) => r.verified !== undefined);
const context = [...publishedResources, ...verified];
const expected: Record<string, string> = {
  'research-br1-014': '/ensino-medio/',
  'research-br1-016': '/vestibulares/',
  'research-int-002': '/ensino-superior/',
  'research-tec-016': '/tecnologia/',
  'research-tec-038': '/tecnologia/',
  'research-tec-040': '/tecnologia/',
  'research-tec-041': '/tecnologia/',
  'research-tec-049': '/tecnologia/',
  'research-tec-054': '/tecnologia/',
};

test('preflight: nine exact reviewed records have real destinations under simulated publication context', () => {
  assert.equal(verified.length, 9);
  assert.equal(new Set(verified.map((r) => r.id)).size, 9);
  for (const r of verified) {
    const at = placementOf(r, undefined, context);
    assert.ok(at, `${r.id} has no page`);
    assert.equal(at!.page, expected[r.id], r.id);
    assert.equal(at!.anchor, `recurso-${r.id}`, r.id);
    const home = resourceHome(r, context);
    assert.ok(home.startsWith(at!.page), `${r.id}: search index must point to the same page`);
  }
});

test('preflight: tech tracks and university group contain candidates only in projected context, never production', () => {
  const tracks = techTracksFor(context);
  const actual = tracks.flatMap((t) => t.resourceIds).filter((id) => id.startsWith('research-'));
  assert.equal(actual.length, 6);
  assert.equal(new Set(actual).size, 6);
  const university = higherEducationGroupsFor(context);
  assert.deepEqual(university.find((g) => g.id === 'quimica')?.resourceIds, ['research-int-002']);
  assert.equal(higherEducationGroupsFor(publishedResources).some((g) => g.id === 'quimica'), false);
  assert.ok(techTracksFor(publishedResources).every((t) => !t.resourceIds.some((id) => id.startsWith('research-'))));
  assert.equal(publishedResources.length, 44);
});

test('preflight: Ensino Médio has a conditional visible section for cross-disciplinary courses', () => {
  const page = readFileSync(new URL('../src/pages/ensino-medio/index.astro', import.meta.url), 'utf8');
  assert.match(page, /placedOnPath\('ensino-medio'\)\.length/);
  assert.match(page, /<PathResources path="ensino-medio" id="complementares"/);
  const section = readFileSync(new URL('../src/components/PathResources.astro', import.meta.url), 'utf8');
  assert.match(section, /const resources = placedOnPath\(path\)/);
});
