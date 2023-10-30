import { ProfileData } from '@/data/typedata'
import React from 'react'

type Props = {
    profileData: ProfileData
}

const FollowingProfile = ({profileData}: Props) => {
    return (
        <div>Following: {profileData.user.first_name} {profileData.user.last_name}</div>
    )
}

export default FollowingProfile