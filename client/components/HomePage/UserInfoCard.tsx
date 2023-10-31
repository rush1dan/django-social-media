'use client'

import { useAuth } from '@/hooks/userAuth'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { getMediaURLFromApiBackend } from '@/lib/utils'

type Props = {}

const UserInfoCard = (props: Props) => {
    const { user } = useAuth();
    return (
        <Link href={`/profile/${user?.id}`} className='w-full rounded-lg bg-white shadow-md shadow-black/10 pt-20 pb-6 px-6 mt-20 relative
        flex flex-col items-center justify-start'>
            {/* Name & Bio */}
            <div className='w-full max-h-[24rem] flex flex-col items-center justify-center gap-y-4 overflow-y-auto overflow-x-hidden'>
                {/* Name */}
                <div className='w-full flex flex-row justify-center items-center'>
                    <p className='font-bold text-lg'>{user?.first_name} {user?.last_name}</p>
                </div>
                {/* Bio */}
                <div className='w-full text-center break-words'>
                    <p className='text-gray-500'>{user?.bio}</p>
                </div>
            </div>

            {/* Image */}
            <div className='absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-32 h-32 z-10'>
                <div className='w-full h-full bg-slate-600 rounded-full relative overflow-clip'>
                    <Image src={user?.image ? getMediaURLFromApiBackend(user?.image) : '/user.svg'} alt='dp' fill />
                </div>
            </div>
        </Link>
    )
}

export default UserInfoCard