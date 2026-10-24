import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isPublishedResource, resourceProblems, type LearningResource } from '../src/lib/learning-resources.ts';
import { projectRelease, type LotEntry, type LotManifest } from '../src/lib/release/engine.ts';
import { digestOf } from '../src/lib/release/canonical.ts';
import { priceDisplay, resourceDisplayFacts } from '../src/lib/resource-display.ts';
import { pt } from '../src/i18n/pt.ts';
import { POOL, NOW, SIMULATED_BY, inventoryWith, lotOf, project, releaseOf } from './incremental-release/fixtures.ts';

const paid: LearningResource = {
  id: 'fixture-paid-course',
  title: 'Sample paid course (fixture only)',
  provider: 'Sample Education',
  subject: 'tecnologia',
  format: 'course',
  paths: ['tecnologia'],
  language: 'en',
  level: 'beginner',
  url: 'https://example.edu/courses/paid-example',
  accessMode: 'paid',
  accessTerms: 'Preço da aula: pagamento único; valor e disponibilidade devem ser conferidos no provedor.',
  price: { value: 90, currency: 'USD', cadence: 'once' },
  registration: 'unconfirmed',
  certificate: 'unconfirmed',
  verified: {
    on: '2026-10-11',
    by: 'official-page',
    freeAccess: false,
    evidence: {
      url: 'https://example.edu/courses/paid-example',
      checked: ['pricing', 'scope', 'language', 'format', 'path'],
      note: 'SIMULAÇÃO: página e preço não foram realmente verificados; fixture exclusivamente para teste.',
    },
  },
};

test('a paid course can be verified without being misclassified as free', () => {
  assert.deepEqual(resourceProblems(paid, NOW), []);
  assert.equal(isPublishedResource(paid), true);
  const shown = resourceDisplayFacts(paid as Extract<typeof paid, { url: string }>, pt.resource);
  assert.equal(priceDisplay(paid, pt.resource), 'Pago · US$ 90,00');
  assert.ok(shown.access.includes(paid.accessTerms!));
  assert.ok(!shown.access.includes('Gratuito'));
});

test('paid and conditional access require visible terms and source evidence', () => {
  assert.match(resourceProblems({ ...paid, accessTerms: '' }, NOW).join(';'), /access terms required/);
  assert.match(resourceProblems({ ...paid, price: { value: -10, currency: 'USD' } }, NOW).join(';'), /positive amount/);
  assert.match(resourceProblems({ ...paid, verified: { ...paid.verified!, freeAccess: true } }, NOW).join(';'), /inconsistent verified access/);
  assert.match(resourceProblems({ ...paid, verified: { ...paid.verified!, evidence: { ...paid.verified!.evidence!, checked: ['scope', 'language', 'format', 'path'] } } }, NOW).join(';'), /pricing\/access conditions not checked/);
  assert.equal(isPublishedResource({ ...paid, accessMode: 'unconfirmed' }), false);
  const withoutVerification = { ...paid };
  delete withoutVerification.verified;
  assert.equal(isPublishedResource(withoutVerification), false);
  const subscription = { ...paid, accessMode: 'subscription' as const, price: { value: 30, currency: 'BRL' as const, cadence: 'month' as const } };
  assert.deepEqual(resourceProblems(subscription, NOW), []);
  assert.match(priceDisplay(subscription, pt.resource), /Assinatura.*R\$.*30,00\/mês/);
  const conditional: LearningResource = { ...paid, accessMode: 'conditional', accessTerms: 'Parte das aulas disponível sem cobrança; certificado opcional pago.',
    verified: { ...paid.verified!, freeAccess: true, evidence: { ...paid.verified!.evidence!, checked: ['free', 'pricing', 'scope', 'language', 'format', 'path'] } } };
  delete conditional.price;
  assert.deepEqual(resourceProblems(conditional, NOW), []);
  assert.equal(isPublishedResource(conditional), true);
});

test('a paid course still needs an individually approved applied release lot', () => {
  const evidence = paid.verified!.evidence!;
  const entry: LotEntry = {
    id: paid.id,
    url: paid.url!,
    digest: digestOf(paid),
    institution: paid.provider,
    format: paid.format,
    evidence: { on: paid.verified!.on, version: 'fixture-paid-v1', method: paid.verified!.by, url: evidence.url, observed: evidence.note },
    decision: 'approved',
    decidedBy: SIMULATED_BY,
    decidedOn: '2026-10-12',
  };
  const lot: LotManifest = lotOf('L003-paid-course', [entry]);
  const pool = [...POOL, paid];

  const pending = project({ pool, lots: [lot], release: releaseOf([], inventoryWith([])) });
  assert.deepEqual(pending.problems, []);
  assert.equal(pending.published.some((r) => r.id === paid.id), false, 'unapplied approvals never publish');

  const published = project({ pool, lots: [lot], release: releaseOf([lot], inventoryWith([paid.id])) });
  assert.deepEqual(published.problems, []);
  assert.equal(published.published.find((r) => r.id === paid.id)?.accessMode, 'paid');

  const changed = pool.map((r) => r.id === paid.id ? { ...paid, price: { value: 120, currency: 'USD' as const, cadence: 'once' as const } } : r);
  const mismatch = project({ pool: changed, lots: [lot], release: releaseOf([lot], inventoryWith([paid.id])) });
  assert.match(mismatch.problems.join(';'), /record changed after its approval/);
});
