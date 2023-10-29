import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileContent from '@/components/ProfilePage/ProfileContent';

const ProfilePage = ({params}: any) => {
    const { id } = params;  //This id is the .../profile/[id]/
    return (
        <ProtectedRoute>
            <div>Server: UserId {id}</div>
            <ProfileContent />
        </ProtectedRoute>
    )
}

export default ProfilePage