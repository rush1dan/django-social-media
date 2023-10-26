export type User = {
    access_token: string,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    bio?: string,
    image?: string
}

export type UserDataType = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    image?: string
}

export type PostDataType = {
    id: number,
    description: string,
    created_at: string,
    updated_at: string,
    image?: string
}

export type FeedItemDataType = {
    user: UserDataType,
    post: PostDataType,
    likes: number,
    comments: number,
    liked: boolean
}