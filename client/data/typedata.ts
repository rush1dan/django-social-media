export type User = {
    access_token: string,
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    bio?: string,
    image?: string
}

export type PublicUserInfo = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    image?: string
}

export type Post = {
    id: number,
    description: string,
    created_at: string,
    updated_at: string,
    image?: string
}

export type FeedItem = {
    user: PublicUserInfo,
    post: Post,
    likes: number,
    comments: number,
    liked: boolean,
    latest_comment: UserComment
}

export type Comment = {
    id: number,
    text: string,
    updated_at: string
}

export type UserComment = {
    user: PublicUserInfo,
    comment: Comment
}

export type PostData = {
    post: Post,
    likes: number,
    comments: number,
    liked: boolean,
    latest_comment: UserComment
}

export type ProfileData = {
    user: PublicUserInfo,
    is_following: boolean,
    posts: PostData[] | null
}

export enum ProfileType {
    OWNER = 0,
    FOLLOWING = 1,
    NOT_FOLLOWING = 2
}