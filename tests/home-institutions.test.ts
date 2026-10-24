import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pt } from '../src/i18n/pt.ts';

// "Instituições e fontes" and "Nossos compromissos" on the Home (V2.4): a row of institution cards after the Cursor
// reference, in the Paulex Edu's light system, then three open promises. What they must never do: show the
// institutions as partners, let an internal card pass for the provider's own page, or touch the colour of a mark.
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sources = read('src/components/OfficialSources.astro');
const markup = sources.slice(sources.indexOf('---', 3), sources.indexOf('<style>'));
const style = sources.slice(sources.indexOf('<style>'));
const page = read('src/pages/index.astro');
const s = pt.home.sources;
const c = pt.home.curation;

test('the heading and the line say where the courses come from, and never that the institutions are partners', () => {
  assert.equal(s.heading, 'Conheça as fontes dos nossos cursos');
  assert.equal(s.lead, 'Explore conteúdos gratuitos publicados por instituições de ensino e tecnologia.');
  const said = [s.eyebrow, s.heading, s.lead, s.note, s.swipe, s.exams].join(' ');
  assert.doesNotMatch(said, /parceir|patroc[ií]n|apoiad|endoss|confia|oficiais? da/i, 'no partner, sponsor, endorsement or trust claim');
  assert.doesNotMatch(said, /leva à página oficial/i, 'a card leads inside this site, not to the provider\'s own page');
  // The note says whose the marks are, and what a card opens, and that the indication is not a tie.
  assert.match(s.note, /nomes e as marcas pertencem às instituições/);
  assert.match(s.note, /não significa vínculo com a Paulex Edu/);
  assert.match(s.note, /abre, aqui no site/);
});

test('the three commitments, with the verification date and the rules kept', () => {
  assert.deepEqual(c.commitments, [
    { title: 'Gratuito para estudar', body: 'Os recursos indicados oferecem conteúdo gratuito para estudo. Certificados opcionais podem ter cobrança.' },
    { title: 'Conferido na fonte', body: 'Os materiais passam por verificação na página original do responsável pela publicação.' },
    { title: 'Independente', body: 'A curadoria não depende de parcerias comerciais ou de links de afiliados.' },
  ]);
  assert.match(c.verified('11 de outubro de 2026'), /^Catálogo verificado em /);
  assert.equal(c.more, 'Ler as regras completas');
  // Open and light: a check badge, a title and a line each; no number, no box, no rule on a promise.
  assert.match(page, /<ul class="commitments" role="list">\s*\{cur\.commitments\.map\(\(item\) => \(\s*<li>\s*<span class="check" aria-hidden="true"><\/span>\s*<h3>\{item\.title\}<\/h3>\s*<p>\{item\.body\}<\/p>/);
  assert.doesNotMatch(page, /class="n"/);
  const rules = page.match(/\.commitments[^{]*\{[^}]*\}/g)?.join('\n') ?? '';
  assert.doesNotMatch(rules, /border|box-shadow|::before/, 'the promises are not boxed or ruled');
  assert.match(page, /<time datetime=\{VERIFIED_ON\}>\{cur\.verified\(formatDate\(VERIFIED_ON\)\)\}<\/time>/);
  assert.match(page, /href=\{routes\.about\}/);
});

test('the row: one card per institution from the catalogue, each one link with its own count; nothing leaves the site', () => {
  assert.match(sources, /homeSources\(Object\.keys\(providerMarks\), publishedResources, publishedTracks\(\)\)/, 'the institutions and the counts are derived, never typed');
  assert.equal((markup.match(/<a href=\{item\.href\}>/g) ?? []).length, 1, 'one link per card');
  assert.match(markup, /<li data-institution=\{item\.provider\}>/);
  assert.doesNotMatch(markup, /https?:\/\//, 'no external address');
  assert.doesNotMatch(sources, /<script\b/, 'no script: native scroll only');
  assert.doesNotMatch(sources, /setInterval|autoplay|requestAnimationFrame|animation:/i, 'no auto-advance and no loop');
  assert.match(page, /<div class="head head-center">\s*<div><h2 id="fontes-title">\{t\.home\.sources\.heading\}<\/h2><\/div>/);
  assert.doesNotMatch(page, /<p class="kicker">/, "decorative section labels are removed");
});

test('the marks keep their own colours: no filter, blend, fade or layer over a mark', () => {
  assert.doesNotMatch(style, /filter\s*:|mix-blend-mode|background-blend-mode|opacity|grayscale|sepia|saturate|brightness\(|contrast\(|mask|::before|::after/);
  // A card moves nothing on hover but the arrow, by two pixels.
  assert.doesNotMatch(style, /\.marks a(:hover)?\s*\{[^}]*(transform|translate|box-shadow)/);
  assert.match(style, /\.marks a:hover \.go \{ transform: translateX\(2px\); \}/);
});

test('one row from 1024px, a native sideways row below it that every card can be reached in by keyboard', () => {
  assert.match(style, /\.marks \{[^}]*grid-auto-flow: column;[^}]*overflow-x: auto;[^}]*scroll-snap-type: x mandatory;/);
  assert.match(style, /@media \(min-width: 1024px\) \{\s*\.marks \{ grid-auto-columns: minmax\(0, 12rem\); justify-content: center; margin-inline: 0; padding: 0; overflow: visible; \}/);
  // The next card shows a little (44% on a phone, 11rem on a tablet), with the cue under the row (not on a wide screen).
  assert.match(style, /grid-auto-columns: 44%;/);
  assert.match(style, /@media \(min-width: 1024px\) \{ \.swipe \{ display: none; \} \}/);
  assert.match(markup, /<p class="swipe" aria-hidden="true">\{s\.swipe\} <span>→<\/span><\/p>/);
  // The focus ring is not cut by the scroller, and the arrow is drawn, not read.
  assert.match(style, /padding: 6px var\(--gutter\);/);
  assert.match(style, /\.marks a:focus-visible \{ outline-offset: 2px; \}/);
  assert.match(markup, /<span class="go" aria-hidden="true">→<\/span>/);
});
