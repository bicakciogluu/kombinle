import { ClotheModel } from './Clothe';
import { CommentModel } from './Comment';
import UserClass from './User';

export interface Post {
    id: number;
    content: string;
    timestamp: Date;
    user_id: number;
    image_url: string; // Added to match backend model
    clothes: ClotheModel[];
    comments: CommentModel[];
    author?: UserClass;
}

export class PostModel implements Post {
    id: number;
    content: string;
    timestamp: Date;
    user_id: number;
    image_url: string; // Added to match backend model
    clothes: ClotheModel[];
    comments: CommentModel[];
    author?: UserClass;

    constructor(
        id: number,
        content: string,
        timestamp: Date,
        user_id: number,
        image_url: string, // Added to match backend model
        clothes: ClotheModel[] = [],
        comments: CommentModel[] = [],
        author?: UserClass
    ) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.user_id = user_id;
        this.image_url = image_url; // Added to match backend model
        this.clothes = clothes;
        this.comments = comments;
        this.author = author;
    }


}