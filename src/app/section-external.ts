import { ImageExternal } from './image-external';
import { SectionTitle } from './section-title';

export class SectionExternal {
    constructor(public id : number, public sectionTitle: SectionTitle,
                public text: string, public images: ImageExternal[]){}
}
