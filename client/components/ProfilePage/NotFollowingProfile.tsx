import { ProfileData } from '@/data/typedata'
import React from 'react'

type Props = {
    profileData: ProfileData
}

const NotFollowingProfile = ({profileData}: Props) => {
    return (
        <div>Not following: {profileData.user.first_name} {profileData.user.last_name}</div>
    )
}

export default NotFollowingProfile