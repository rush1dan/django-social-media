import { ProfileData, ProfileType } from '@/data/typedata'
import React from 'react'
import UserProfileFeed from './UserProfileFeed'
import FollowingProfileFeed from './FollowingProfileFeed'
import NotFollowingProfileFeed from './NotFollowingProfileFeed'

type Props = {
    profileType: ProfileType | undefined,
    profileData: ProfileData
}

const ProfileFeed = ({ profileType, profileData }: Props) => {
    return (
        <div className='w-full min-h-full'>
            {
                (profileType === ProfileType.OWNER && profileData !== null) && 
                <UserProfileFeed profileData={profileData} />
            }

            {
                (profileType === ProfileType.FOLLOWING && profileData !== null) &&
                <FollowingProfileFeed profileData={profileData} />
            }

            {
                (profileType === ProfileType.NOT_FOLLOWING && profileData !== null) &&
                <NotFollowingProfileFeed profileData={profileData} />
            }
        </div>
    )
}

export default ProfileFeed