import { ProfileData } from '@/data/typedata'
import React from 'react'
import PostCard from '../HomePage/PostCard'

type Props = {
    profileData: ProfileData
}

const FollowingProfile = ({profileData}: Props) => {
    return (
        <div className='w-full min-h-full'>
            {
                profileData.posts !== null && profileData.posts.length > 0 ?
                <div className='w-full min-h-full flex flex-col items-center justify-start gap-y-6'>
                {
                    profileData.posts?.map((postData, index) => {
                        return (
                            <PostCard feedItem={{user: profileData.user, ...postData}} key={postData.post.id} />
                        )
                    })
                }
                    </div>
                    :
                    <div className='w-full text-center text-3xl font-semibold text-gray-400'>
                        User has no posts
                    </div>
            }
        </div>
    )
}

export default FollowingProfile