// Presentation-only metadata for a published resource. This does not change verification,
// publication, category, or destination, and never invents an unavailable attribute.
import type { PublishedLearningResource } from './learning-resources.ts';
import { formatDate } from './dates.ts';
import type { Dict } from '../i18n/types.ts';

type ResourceLabels = Dict['resource'];
type DisplayResource = Pick<PublishedLearningResource,
  'provider' | 'format' | 'schoolYears' | 'language' | 'duration' | 'registration' | 'certificate' | 'accessMode' | 'accessTerms' | 'price'> & Partial<Pick<PublishedLearningResource, 'verified'>>;

export interface ResourceDisplayFacts {
  /** What the resource is. Always factual; provider is included for compact rows. */
  readonly overview: readonly string[];
  /** What a learner should know before opening its official source. */
  readonly access: readonly string[];
}

/** Display a source-verified price when present, otherwise label the payment model without inventing a value. */
export const priceDisplay = (resource: DisplayResource, labels: ResourceLabels): string => {
  const mode = resource.accessMode ?? 'free';
  const label = labels.accessModes[mode];
  if (!resource.price || !resource.verified) return label;
  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: resource.price.currency }).format(resource.price.value);
  const cadence = resource.price.cadence === 'month' ? '/mês' : resource.price.cadence === 'year' ? '/ano' : '';
  return `${label} · ${formatted}${cadence} · verificado em ${formatDate(resource.verified.on)}`;
};

export const resourceDisplayFacts = (
  resource: DisplayResource,
  labels: ResourceLabels,
  compact = false,
): ResourceDisplayFacts => {
  const overview = [
    compact ? resource.provider : null,
    labels.formats[resource.format],
    resource.schoolYears ? labels.schoolYears(resource.schoolYears) : null,
    labels.languages[resource.language],
    resource.duration ? `${resource.duration.value} ${labels.units[resource.duration.unit]}` : null,
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  const access: string[] = [priceDisplay(resource, labels)];
  if (resource.accessTerms?.trim()) access.push(resource.accessTerms.trim());
  if (resource.registration && resource.registration !== 'unconfirmed') {
    access.push(labels.registration[resource.registration]);
  }
  if (resource.certificate && resource.certificate !== 'none' && resource.certificate !== 'unconfirmed') {
    access.push(labels.certificates[resource.certificate]);
  }
  return { overview, access };
};
