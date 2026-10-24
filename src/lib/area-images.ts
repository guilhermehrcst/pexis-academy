import matematica from '../assets/areas/matematica.jpg';
import linguagens from '../assets/areas/linguagens.jpg';
import natureza from '../assets/areas/natureza.jpg';
import humanas from '../assets/areas/humanas.jpg';
import idiomas from '../assets/areas/idiomas.jpg';
import tecnologia from '../assets/areas/tecnologia.jpg';
import type { AreaId } from './taxonomy';

/** The picture over each area's card on the Home (src/assets/areas/manifest.json says how each was prepared).
 *  Decorative: always rendered with an empty alt, inside an aria-hidden field. */
export const areaImages: Readonly<Record<AreaId, ImageMetadata>> = { matematica, linguagens, natureza, humanas, idiomas, tecnologia };
