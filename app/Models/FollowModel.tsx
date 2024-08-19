export interface Follow {
    id: number;
    followerId: number;
    followedId: number;
    timestamp: Date;
}
class FollowModel {
    id: number;
    followerId: number;
    followedId: number;
    timestamp: Date;
    constructor(id: number, followerId: number, followedId: number, timestamp: Date) {
        this.id = id;
        this.followerId = followerId;
        this.followedId = followedId;
        this.timestamp = timestamp || new Date();
    }
}
export default FollowModel;