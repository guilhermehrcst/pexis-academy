import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pt } from '../src/i18n/pt.ts';

// "Instituições e fontes" and "Nossos compromissos" on the Home. V2.5: the first is the marks of six technology
// companies straight on the page's white, nothing around them; the second, three open promises. What they must
// never do: show a company as a partner, say a company is a source of courses when none of its courses is published,
// suggest by a link or a count that something is available, or touch the colour of a mark or put a box around it.
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sources = read('src/components/OfficialSources.astro');
const markup = sources.slice(sources.indexOf('---', 3), sources.indexOf('<style>'));
const style = sources.slice(sources.indexOf('<style>'));
const page = read('src/pages/index.astro');
const s = pt.home.sources;
const c = pt.home.curation;

test('the heading and line: the owner\'s once a company has a published course; until then, what is true', () => {
  assert.equal(s.heading, 'Conheça as fontes dos nossos cursos');
  assert.equal(s.lead, 'Explore cursos de diferentes instituições, com acesso gratuito ou pago informado no catálogo.');
  // None of the six has a published course today, so "the sources of our courses" would be false: the page says it is checking.
  assert.equal(s.pending.heading, 'Fontes que estamos conferindo');
  assert.match(s.pending.lead, /^Estamos avaliando cursos gratuitos e pagos de empresas de tecnologia\. Eles entram no catálogo após a verificação/);
  assert.doesNotMatch(`${s.pending.heading} ${s.pending.lead}`, /nossos cursos|publicados por/, 'the pending copy claims no published course');
  // The page picks by what the catalogue publishes, never by hand.
  assert.match(page, /const brands = homeBrands\(HOME_BRANDS, publishedResources, publishedTracks\(\)\);/);
  assert.match(page, /const sourcesCopy = brands\.some\(\(brand\) => brand\.source\) \? t\.home\.sources : t\.home\.sources\.pending;/);
  assert.match(page, /<h2 id="fontes-title">\{sourcesCopy\.heading\}<\/h2>/);
  assert.match(page, /<p class="lead">\{sourcesCopy\.lead\}<\/p>/);
  assert.match(page, /<OfficialSources brands=\{brands\} \/>/);
});

test('no copy of the row presents a company as a partner, sponsor or endorser, or its mark as a tie', () => {
  const said = [s.heading, s.lead, s.pending.heading, s.pending.lead, s.note, s.exams].join(' ');
  assert.doesNotMatch(said, /parceir|patroc[ií]n|apoiad|endoss|confia\b|oficiais? da|leva à página oficial/i);
  assert.match(s.note, /nomes e as marcas pertencem às respectivas empresas/);
  assert.match(s.note, /presença de um logotipo não significa vínculo com a Paulex Edu/);
});

test('the three commitments, with the verification date and the rules kept', () => {
  assert.deepEqual(c.commitments, [
    { title: 'Acesso transparente', body: 'Indicamos se o curso é gratuito, pago, por assinatura ou tem condições. A Paulex Edu não cobra pelo acesso ao catálogo.' },
    { title: 'Conferido na fonte', body: 'Os materiais passam por verificação na página original do responsável pela publicação.' },
    { title: 'Independente', body: 'A curadoria não depende de parcerias comerciais ou de links de afiliados.' },
  ]);
  assert.match(c.verified('11 de outubro de 2026'), /^Catálogo verificado em /);
  assert.equal(c.more, 'Ler as regras completas');
  assert.match(page, /<ul class="commitments" role="list">\s*\{cur\.commitments\.map\(\(item\) => \(\s*<li>\s*<span class="check" aria-hidden="true"><\/span>\s*<h3>\{item\.title\}<\/h3>\s*<p>\{item\.body\}<\/p>/);
  assert.doesNotMatch(page, /class="n"/);
  const rules = page.match(/\.commitments[^{]*\{[^}]*\}/g)?.join('\n') ?? '';
  assert.doesNotMatch(rules, /border|box-shadow|::before/, 'the promises are not boxed or ruled');
  assert.match(page, /<time datetime=\{VERIFIED_ON\}>\{cur\.verified\(formatDate\(VERIFIED_ON\)\)\}<\/time>/);
  assert.match(page, /href=\{routes\.about\}/);
});

test('a mark is its logo alone; a company with a published course is a link with its count, one without is not', () => {
  assert.match(sources, /interface Props \{ brands: HomeBrandCell\[\] \}/);
  assert.match(markup, /<li data-institution=\{brand\.name\}>\s*\{brand\.source \? \(\s*<a href=\{brand\.source\.href\}>\s*<span class="mark"><ProviderMark name=\{brand\.name\} marks=\{markOf\(brand\.id\)\} \/><\/span>\s*<span class="count">\{label\(brand\.source\)\}/);
  // The other branch is the mark alone: no link, no count, no text.
  assert.match(markup, /\) : \(\s*<span class="mark"><ProviderMark name=\{brand\.name\} marks=\{markOf\(brand\.id\)\} \/><\/span>\s*\)\}/);
  assert.equal((markup.match(/<a href=/g) ?? []).length, 3, 'a link for the courses of a company, and the two exam guides');
  assert.doesNotMatch(markup, /https?:\/\//, 'no external address');
  assert.doesNotMatch(sources, /<script\b/, 'no script');
});

test('nothing around a mark and nothing on it: no card, border, shadow, rounded box, panel, filter, fade or layer', () => {
  assert.doesNotMatch(style, /border|box-shadow|radius|background|filter\s*:|opacity|mix-blend-mode|grayscale|sepia|saturate|brightness\(|contrast\(|mask|::before|::after|transform:\s*translateY|scale\(/i);
  // A hover is a colour on the count and the arrow's two pixels; it makes no box and moves no mark.
  assert.match(style, /\.marks a:hover \.count \{ color: var\(--action\); \}/);
  assert.match(style, /\.marks a:hover \.go \{ transform: translateX\(2px\); \}/);
  assert.doesNotMatch(style, /\.marks a:hover \{/);
});

test('six in one row from 1024px, wrapped (never scrolled, never shrunk) below, all on one line', () => {
  assert.match(style, /\.marks \{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);[^}]*align-items: start;[^}]*justify-items: center;/);
  assert.match(style, /@media \(min-width: 600px\) \{ \.marks \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\); \} \}/);
  assert.match(style, /@media \(min-width: 1024px\) \{ \.marks \{ grid-template-columns: repeat\(6, minmax\(0, 1fr\)\);/);
  assert.doesNotMatch(style, /overflow|scroll-snap|grid-auto-flow/, 'nothing is hidden behind a scroll');
  // A link takes the site's own focus ring, kept clear of its mark.
  assert.match(style, /\.marks a:focus-visible \{ outline-offset: 6px; \}/);
});
