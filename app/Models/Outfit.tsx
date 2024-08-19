import { ClotheModel } from './Clothe';

export interface Outfit {
    id: number;
    user_id: number;
    image_url: string;
    clothes_in_outfits: ClotheModel[];
}

export class OutfitModel implements Outfit {
    id: number;
    user_id: number;
    image_url: string;
    clothes_in_outfits: ClotheModel[];

    constructor(
        id: number,
        user_id: number,
        image_url: string,
        clothes_in_outfits: ClotheModel[] = []
    ) {
        this.id = id;
        this.user_id = user_id;
        this.image_url = image_url;
        this.clothes_in_outfits = clothes_in_outfits;
    }


}
