import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

import { isPublishedResource, resourceProblems, publishedResources, verificationProblems, type LearningResource } from '../src/lib/learning-resources.ts';
import type { LotEntry, LotManifest } from '../src/lib/release/engine.ts';
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
  assert.equal(priceDisplay(paid, pt.resource), 'Pago · US$ 90,00 · verificado em 11 de outubro de 2026');
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
  assert.equal(priceDisplay(conditional, pt.resource), 'Acesso gratuito com condições');
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


test('changing a legacy free course to a paid model requires fresh individual evidence', () => {
  const legacy = publishedResources.find((r) => r.id === 'cs50x')!;
  const changed = { ...legacy, accessMode: 'paid' as const, accessTerms: 'Pagamento único no provedor.',
    verified: { ...legacy.verified, freeAccess: false } };
  assert.match(verificationProblems(changed, NOW).join(';'), /no individual evidence/);
});

test('a subscription quote needs a verified billing period; one-time courses cannot show recurring prices', () => {
  assert.match(resourceProblems({ ...paid, accessMode: 'subscription' }, NOW).join(';'), /subscription price needs a billing period/);
  assert.match(resourceProblems({ ...paid, price: { value: 90, currency: 'USD', cadence: 'month' } }, NOW).join(';'), /recurring price requires subscription or conditional access/);
});

test('direct-link course cards expose provider conditions before the learner opens the source', () => {
  for (const name of ['CourseCard', 'HomeCourseFeature']) {
    const template = readFileSync(new URL(`../src/components/${name}.astro`, import.meta.url), 'utf8');
    assert.match(template, /data-access-terms/);
    assert.match(template, /r\.accessTerms\?\.trim\(\)/);
  }
});

test('newly approved records require explicit access mode even when the course is free', () => {
  const r = { ...paid, verified: { ...paid.verified!, freeAccess: true,
    evidence: { ...paid.verified!.evidence!, checked: ['free', 'scope', 'language', 'format', 'path'] } } };
  delete r.accessMode;
  delete r.accessTerms;
  delete r.price;
  const ev = r.verified.evidence!;
  const entry: LotEntry = {
    id: r.id, url: r.url!, digest: digestOf(r), institution: r.provider, format: r.format,
    evidence: { on: r.verified.on, version: 'fixture-v1', method: r.verified.by, url: ev.url, observed: ev.note },
    decision: 'approved', decidedBy: SIMULATED_BY, decidedOn: '2026-10-12',
  };
  const lot: LotManifest = lotOf('L003-mode-required', [entry]);
  const attempt = project({ pool: [...POOL, r], lots: [lot], release: releaseOf([lot], inventoryWith([r.id])), now: new Date('2026-10-26T23:59:59Z') });
  assert.match(attempt.problems.join(';'), /new approval requires explicit access mode/);
});

test('unknown prices stay omitted while the payment model and terms remain visible', () => {
  const { price, ...withoutPrice } = paid;
  assert.equal(priceDisplay(withoutPrice, pt.resource), 'Pago');
  assert.deepEqual(resourceDisplayFacts(withoutPrice, pt.resource).access, ['Pago', paid.accessTerms]);
});
