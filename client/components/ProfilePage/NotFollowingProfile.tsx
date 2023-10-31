import { ProfileData } from '@/data/typedata'
import React from 'react'

type Props = {
    profileData: ProfileData
}

const NotFollowingProfile = ({profileData}: Props) => {
    return (
        <div className='w-full min-h-full'>
            <div className='w-full text-center text-3xl font-semibold text-gray-400'>
                Follow user to see posts
            </div>
        </div>
    )
}

export default NotFollowingProfile