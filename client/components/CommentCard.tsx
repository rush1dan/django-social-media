import { UserCommentType, UserDataType } from '@/data/typedata'
import React from 'react'
import UserInfo from './UserInfo'
import Image from 'next/image'
import { formatRelativeTime } from '@/lib/utils'

type Props = {
    userComment: UserCommentType
}

const CommentCard = ({ userComment }: Props) => {
    return (
        <div className='w-full h-fit p-2 flex flex-row items-start justify-start gap-x-2 rounded-lg bg-slate-300'>
            {/* User Image */}
            <div className='w-12 h-12 flex-none rounded-full relative bg-slate-500'>
                <Image src={userComment.user.image ?? '/placeholder_image.svg'} alt='' fill />
            </div>

            {/* User name and comment */} 
            <div className='w-full flex flex-col justify-start items-start'>
                <div className='w-full flex flex-row justify-between items-center'>
                    <p className='font-semibold text-lg'>{userComment.user.first_name} {userComment.user.last_name}</p>
                    <p className='font-normal text-sm text-gray-400'>{formatRelativeTime(userComment.comment.updated_at)}</p>
                </div>
                <p className='font-light text-base'>{userComment.comment.text}</p>
            </div>
        </div>
    )
}

export default CommentCard