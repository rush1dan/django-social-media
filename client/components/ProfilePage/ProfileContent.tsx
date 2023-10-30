import { ProfileData, ProfileType } from '@/data/typedata'
import React from 'react'
import UserProfile from './UserProfile'
import FollowingProfile from './FollowingProfile'

type Props = {
    profileType: ProfileType | undefined,
    profileData: ProfileData
}

const ProfileContent = ({ profileType, profileData }: Props) => {
    return (
        <div className='w-full min-h-full'>
            {/* <div className='w-full min-h-full flex flex-col items-center justify-start gap-y-6'>
                {
                    profileData &&
                    profileData.posts.map((postData, index) => {
                        return (
                            <PostCard feedItem={{ user: profileData.user, ...postData }} key={postData.post.id} />
                        )
                    })
                }
            </div> */}
            {
                (profileType === ProfileType.OWNER && profileData !== null) && 
                <UserProfile profileData={profileData} />
            }

            {
                (profileType === ProfileType.FOLLOWING && profileData !== null) &&
                <FollowingProfile profileData={profileData} />
            }

            {
                profileType === ProfileType.NOT_FOLLOWING &&
                <div>Not following</div>
            }
        </div>
    )
}

export default ProfileContent