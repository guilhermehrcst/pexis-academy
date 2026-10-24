import matematica from '../assets/areas/matematica.png';
import linguagens from '../assets/areas/linguagens.png';
import natureza from '../assets/areas/natureza.png';
import humanas from '../assets/areas/humanas.png';
import idiomas from '../assets/areas/idiomas.png';
import tecnologia from '../assets/areas/tecnologia.png';
import type { AreaId } from './taxonomy';

export interface AreaImage {
  src: ImageMetadata;
  /** Where its subject sits (object-position), so that the picture keeps it in the upper part of the card, which
   *  the panel at the foot leaves free. The tall ones (the atom, the globe) are slid down their own height. */
  position: string;
  /** `cover` fills the card; `contain` shows the whole picture (a wide one that `cover` would cut), and then the
   *  card continues the picture's own flat ground (`ground`, measured in the file: src/assets/areas/manifest.json). */
  fit: 'cover' | 'contain';
  ground?: string;
}

/** The picture over each area's card on the Home: the owner's file, untouched (src/assets/areas/manifest.json).
 *  Decorative: always rendered with an empty alt, inside an aria-hidden field. */
export const areaImages: Readonly<Record<AreaId, AreaImage>> = {
  matematica: { src: matematica, position: '50% 50%', fit: 'cover' },
  linguagens: { src: linguagens, position: '50% 40%', fit: 'cover' },
  natureza: { src: natureza, position: '50% 76%', fit: 'cover' },
  humanas: { src: humanas, position: '50% 67%', fit: 'cover' },
  idiomas: { src: idiomas, position: '50% 0%', fit: 'contain', ground: 'rgb(239 231 217)' },
  tecnologia: { src: tecnologia, position: '50% 0%', fit: 'cover' },
};
