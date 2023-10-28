import React from 'react'
import Image from 'next/image'
import { UserDataType } from '@/data/typedata'

const UserInfo = ({ id, username, first_name, last_name, image }: UserDataType) => {
    return (
        <div>
            <div className='flex flex-row justify-center items-center gap-x-4'>
                <div className='w-12 h-12 rounded-full relative bg-slate-400'>
                    <Image src={image ?? '/placeholder_image.svg'} alt='' fill />
                </div>
                <div className='flex flex-col items-start justify-center'>
                    <p className='text-base font-semibold'>{first_name} {last_name}</p>
                    <p className='text-sm font-semibold text-gray-600'>@{username}</p>
                </div>
            </div>
        </div>
    )
}

export default UserInfo