import { ClotheModel } from "./Clothe";
import FollowModel from "./FollowModel";
import { PostModel } from "./Post";
export interface User {
    username: string;
    email: string;
    password: string;
    clothes: ClotheModel[];
    combinations: ClotheModel[];
    followers: FollowModel[];
    following: FollowModel[];
    id: number;
    name: string;
    posts: PostModel[];
    surname: string;
    survey: number[];
}

class UserModel implements User {
    username: string;
    email: string;
    password: string;
    clothes: ClotheModel[];
    combinations: ClotheModel[];
    followers: FollowModel[];
    following: FollowModel[];
    id!: number;
    name: string;
    posts: PostModel[];
    surname: string;
    survey: number[];

    constructor(
        username: string,
        email: string,
        password: string,
        name: string,
        surname: string,
        survey: number[] = []
    ) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.clothes = [];
        this.combinations = [];
        this.followers = [];
        this.following = [];
        this.posts = [];
        this.survey = survey;
    }
}

export default UserModel;
