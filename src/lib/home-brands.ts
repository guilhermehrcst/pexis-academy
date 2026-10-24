// The Home's row of technology companies ("Instituições e fontes"): the six marks in the owner's order, shown on the
// page's white with nothing around them, and, for a company that has published courses, a link to them and their
// count. Which courses a company has is read from the catalogue and never typed: a company with nothing published
// has no link and no count, because nothing is available from it. Staged candidates (docs: the PR that stages them,
// BIGTECH_CANDIDATES) are not published and never reach here: homeSources reads published resources only. No asset
// imports (runs under Node); the marks are in lib/providers.ts (brandMarks), by `id`.
import { homeSources, type HomeSource } from './home-sources.ts';
import type { PublishedLearningResource } from './learning-resources.ts';
import type { TechTrack } from './tech-tracks.ts';

export interface HomeBrand {
  /** The key of its mark (brandMarks) and of nothing else. */
  id: string;
  /** What the mark says: the accessible name of the logo. */
  name: string;
  /** The `provider` the catalogue uses for its courses, character for character: it is how a published course finds
   *  its company. A name that differs only leaves the company without a link, never with a false one. */
  provider: string;
}

/** In the owner's order. The providers are the names the staged candidates use. */
export const HOME_BRANDS: readonly HomeBrand[] = [
  { id: 'anthropic', name: 'Anthropic', provider: 'Anthropic' },
  { id: 'google', name: 'Google', provider: 'Google' },
  { id: 'openai', name: 'OpenAI', provider: 'OpenAI' },
  { id: 'nvidia', name: 'NVIDIA', provider: 'NVIDIA Deep Learning Institute' },
  { id: 'apple', name: 'Apple', provider: 'Apple Developer' },
  { id: 'meta', name: 'Meta', provider: 'Meta Blueprint' },
];

export interface HomeBrandCell extends HomeBrand {
  /** The published courses it leads to (a track, or the search filtered by it) and how many; null: none published. */
  source: HomeSource | null;
}

/** Each brand with what the catalogue publishes for it. The guards of homeSources hold (only courses are counted,
 *  a course without a subject or a page to show it fails the build): publishing something of a company that is not
 *  a course, such as Apple's tutorial series, stops the build until someone decides where it leads. */
export const homeBrands = (
  brands: readonly HomeBrand[],
  resources: readonly PublishedLearningResource[],
  tracks: readonly TechTrack[],
): HomeBrandCell[] => {
  const published = new Map(homeSources(brands.map((brand) => brand.provider), resources, tracks).map((source) => [source.provider, source]));
  return brands.map((brand) => ({ ...brand, source: published.get(brand.provider) ?? null }));
};
