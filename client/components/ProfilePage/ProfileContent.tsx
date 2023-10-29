'use client'

import { useAuth } from '@/hooks/userAuth'
import { useParams } from 'next/navigation';
import React from 'react'

type Props = {}

const ProfileContent = (props: Props) => {
    const { user } = useAuth();
    const { id: profileId } = useParams();
    return (
        user?.id === parseInt(profileId[0]) ?
            <div>Client: Viewing own profile with id: {profileId[0]}</div>
            :
            <div>Client: Viewing user {profileId}'s profile</div>
    )
}

export default ProfileContent