'use client'

import { PublicUserInfo } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import Image from 'next/image'
import React from 'react'

type Props = {
    userInfo: PublicUserInfo
}

const ProfileInfoCard = ({ userInfo }: Props) => {
    return (
        <div className='w-full rounded-lg bg-white shadow-md shadow-black/10 pt-20 pb-6 px-6 mt-20 relative
        flex flex-col items-center justify-start'>
            {/* Name & Bio */}
            <div className='w-full max-h-[24rem] flex flex-col items-center justify-center gap-y-4 overflow-y-auto overflow-x-hidden'>
                {/* Name */}
                <div className='w-full flex flex-row justify-center items-center'>
                    <p>{userInfo?.first_name} {userInfo?.last_name}</p>
                </div>
                {/* Bio */}
                <div className='w-full text-center break-words'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum quidem velit sint dicta, cupiditate fugiat eligendi accusantium magni! Accusantium soluta sed dicta molestias quos sunt id neque consectetur accusamus perferendis.
                </div>
            </div>

            {/* Image */}
            <div className='absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-32 h-32 z-10'>
                <div className='w-full h-full rounded-full relative bg-slate-500'>
                    <Image src={userInfo.image ?? '/placeholder_image.svg'} alt='dp' fill />
                </div>
            </div>
        </div>
    )
}

export default ProfileInfoCard