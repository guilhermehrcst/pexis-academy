// The institutions' marks for the Courses page, as supplied (src/assets/providers, unmodified).
// One place: `marks` holds each artwork with its measured geometry and its optical size, and
// `providerMarks` says which marks stand for each provider name in the learning-resource catalogue.
// The resource `provider` string stays the single source of the name: it is the key here, the
// accessible name of the group, and the fallback text when a provider has no mark.
import harvard from '../assets/providers/harvard.png';
import mit from '../assets/providers/mit-opencourseware.png';
import fgv from '../assets/providers/fgv.png';
import cisco from '../assets/providers/cisco-networking-academy.png';
import bradesco from '../assets/providers/fundacao-bradesco.png';
import microsoft from '../assets/providers/microsoft.png';
import anthropic from '../assets/providers/anthropic.png';
import google from '../assets/providers/google.png';
import openai from '../assets/providers/openai.png';
import nvidia from '../assets/providers/nvidia.png';
import apple from '../assets/providers/apple.png';
import meta from '../assets/providers/meta.png';

export interface Mark {
  src: ImageMetadata;
  /** The institution's name, as the image's alt text. */
  alt: string;
  /**
   * The visible artwork inside the supplied canvas, in canvas pixels [left, top, right, bottom]:
   * measured (alpha > 8). The canvases carry a lot of empty margin (FGV is 59% empty above and below
   * the mark, the Microsoft file has a 64px margin on the left); the frame of the mark is the artwork itself, so
   * sizes are the artwork's and not the canvas's. Nothing visible is cut.
   */
  bbox: [number, number, number, number];
  /**
   * Height of the artwork on desktop, in px. Optical size, not geometry: set so that, side by side,
   * no mark reads larger than the others (a shield is heavier than a thin wordmark of the same height).
   */
  h: number;
  /** The supplied artwork is white: it is shown on the ink, as small as the mark needs. */
  ground?: 'ink';
}

export const marks = {
  harvard: { src: harvard, alt: 'Harvard University', bbox: [7, 5, 2098, 2040], h: 40 },
  // White artwork on transparency: on the page's white it would vanish, so it sits on the ink.
  mit: { src: mit, alt: 'MIT OpenCourseWare', bbox: [60, 186, 1540, 444], h: 18, ground: 'ink' },
  fgv: { src: fgv, alt: 'FGV', bbox: [15, 142, 728, 270], h: 22 },
  cisco: { src: cisco, alt: 'Cisco Networking Academy', bbox: [0, 9, 867, 203], h: 28 },
  bradesco: { src: bradesco, alt: 'Fundação Bradesco', bbox: [323, 324, 4639, 1287], h: 24 },
  // The horizontal signature (the four squares and the wordmark), as supplied: 2172 x 724, RGBA,
  // transparent around the artwork. The box is the visible area (alpha > 8); the height is that of
  // the squares, which is what sits beside Fundação Bradesco's mark in the partnership.
  microsoft: { src: microsoft, alt: 'Microsoft', bbox: [64, 147, 2110, 579], h: 22 },
  // The six technology companies of the Home's row (src/assets/providers/brands.json: supplied PNGs, origin and
  // brand guidelines not verified). The box is the visible artwork (alpha > 8); the height is optical, set so that,
  // side by side on white, a wide wordmark, a rounded logotype and the Apple mark weigh alike.
  anthropic: { src: anthropic, alt: 'Anthropic', bbox: [76, 78, 1884, 286], h: 17 },
  google: { src: google, alt: 'Google', bbox: [72, 72, 1704, 616], h: 36 },
  openai: { src: openai, alt: 'OpenAI', bbox: [78, 74, 1886, 532], h: 32 },
  nvidia: { src: nvidia, alt: 'NVIDIA', bbox: [70, 82, 1928, 448], h: 28 },
  apple: { src: apple, alt: 'Apple', bbox: [38, 38, 750, 916], h: 50 },
  meta: { src: meta, alt: 'Meta', bbox: [32, 38, 876, 222], h: 28 },
} satisfies Record<string, Mark>;

/** The marks of the Home's row of technology companies, by brand id (lib/home-brands.ts). Apart from providerMarks
 *  on purpose: the course cards and avatars read that one, and how these wordmarks look there is decided with the
 *  first course of theirs that is published, not before. */
export const brandMarks: Record<string, Mark[]> = {
  anthropic: [marks.anthropic],
  google: [marks.google],
  openai: [marks.openai],
  nvidia: [marks.nvidia],
  apple: [marks.apple],
  meta: [marks.meta],
};

/** The marks that stand for provider names used in the catalogue, in reading order. */
export const providerMarks: Record<string, Mark[]> = {
  'Harvard University': [marks.harvard],
  'MIT OpenCourseWare': [marks.mit],
  FGV: [marks.fgv],
  'Cisco Networking Academy': [marks.cisco],
  'Fundação Bradesco': [marks.bradesco],
  // A partnership, shown as two institutions side by side and not as a new mark.
  'Fundação Bradesco + Microsoft': [marks.bradesco, marks.microsoft],
};
