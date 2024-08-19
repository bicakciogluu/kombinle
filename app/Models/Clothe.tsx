export interface Clothe {
    user_id: number;
    id: number;
    color: string;
    size: string;
    brand?: string;
    type: string;
    sex?: string;
    image_url?: string;
    vote: boolean
}

export class ClotheModel implements Clothe {
    user_id: number;
    id: number;
    color: string;
    size: string;
    brand: string;
    type: string;
    sex: string;
    image_url: string;
    vote: boolean

    constructor(
        user_id: number,
        id: number,
        color: string,
        size: string,
        type: string,
        brand: string = "Default",
        sex: string = "Unisex",
        image_url: string = "",
        vote: boolean,
    ) {
        this.user_id = user_id;
        this.id = id;
        this.color = color;
        this.size = size;
        this.brand = brand;
        this.type = type;
        this.sex = sex;
        this.image_url = image_url;
        this.vote = vote;
    }


}
