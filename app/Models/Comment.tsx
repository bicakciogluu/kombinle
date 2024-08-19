export interface Comment {
    id: number;
    content: string;
    timestamp: Date;
    user_id: number;
    post_id: number;
}

export class CommentModel implements Comment {
    id: number;
    content: string;
    timestamp: Date;
    user_id: number;
    post_id: number;

    constructor(
        id: number,
        content: string,
        timestamp: Date,
        user_id: number,
        post_id: number
    ) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.user_id = user_id;
        this.post_id = post_id;
    }



}
