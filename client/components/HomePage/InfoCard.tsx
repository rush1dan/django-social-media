'use client'

import { useAuth } from '@/hooks/userAuth'
import React from 'react'

type Props = {}

const InfoCard = (props: Props) => {
    const { user } = useAuth();
    return (
        <div className='w-full rounded-lg bg-white shadow-md shadow-black/10 pt-20 pb-6 px-6 mt-20 relative
        flex flex-col items-center justify-start'>
            {/* Name & Bio */}
            <div className='w-full h-full flex flex-col items-center justify-center gap-y-4'>
                {/* Name */}
                <div className='w-full flex flex-row justify-center items-center'>
                    <p>{user?.first_name} {user?.last_name}</p>
                </div>
                {/* Bio */}
                <div className='w-full text-center'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum quidem velit sint dicta, cupiditate fugiat eligendi accusantium magni! Accusantium soluta sed dicta molestias quos sunt id neque consectetur accusamus perferendis.
                </div>
            </div>

            {/* Image */}
            <div className='absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-32 h-32 z-10 bg-slate-600 rounded-full'>

            </div>
        </div>
    )
}

export default InfoCard