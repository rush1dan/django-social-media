'use client'

import { PublicUserInfo } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import { getMediaURLFromApiBackend } from '@/lib/utils'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import Popup from '../Popup'
import EditProfileModal from './EditProfileModal'

type Props = {
    userInfo: PublicUserInfo,
}

const ProfileInfoCard = ({ userInfo }: Props) => {
    const { user } = useAuth();
    const [editModalOpened, setEditModalOpened] = useState<boolean>(false);
    const [updatedUserInfo, setUpdatedUserInfo] = useState<PublicUserInfo>(userInfo);

    const onEditPressed = useCallback(() => {
        setEditModalOpened(true);
    }, []);

    const onProfileEdited = useCallback((editedUserInfo: PublicUserInfo) => {
        setUpdatedUserInfo(editedUserInfo)
        setEditModalOpened(false);
    }, []);

    return (
        <div className='w-full rounded-lg bg-white shadow-md shadow-black/10 pt-20 pb-6 px-6 mt-20 relative
            flex flex-col items-center justify-start'>
            {/* Name & Bio */}
            <div className='w-full max-h-[24rem] flex flex-col items-center justify-center gap-y-4 overflow-y-auto overflow-x-hidden'>
                {/* Name */}
                <div className='w-full flex flex-row justify-center items-center'>
                    <p className='font-bold text-lg'>{updatedUserInfo?.first_name} {updatedUserInfo?.last_name}</p>
                </div>
                {/* Bio */}
                <div className='w-full text-center break-words text-gray-500'>
                    {updatedUserInfo.bio}
                </div>
            </div>

            {/* Image */}
            <div className='absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-32 h-32 z-10'>
                <div className='w-full h-full rounded-full relative bg-slate-500 overflow-clip'>
                    <Image src={updatedUserInfo.image ? getMediaURLFromApiBackend(updatedUserInfo.image) : '/user.svg'} alt='dp' fill />
                </div>
            </div>

            {/* Edit */}
            {
                user?.id === userInfo.id &&
                <button className='absolute w-10 h-10 top-4 right-4 rounded-full bg-slate-300/50 hover:bg-slate-300 overflow-clip p-2'
                    onClick={onEditPressed}>
                    <div className='w-full h-full relative'>
                        <Image src={'/edit.svg'} alt='edit' fill />
                    </div>
                </button>
            }

            {
                editModalOpened &&
                <Popup className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[32rem] pt-16 rounded-lg bg-slate-50 overflow-clip'
                    hidden={!editModalOpened} onClosed={() => setEditModalOpened(false)}
                    popUpHeader='Edit Profile'>
                    <EditProfileModal user={user} onModalEdited={onProfileEdited} />
                </Popup>
            }
        </div>
    )
}

export default ProfileInfoCard