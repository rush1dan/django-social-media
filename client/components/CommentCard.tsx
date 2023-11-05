import { UserComment } from '@/data/typedata'
import React from 'react'
import { formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import UserImage from './UserImage'

type Props = {
    userComment: UserComment
}

const CommentCard = ({ userComment }: Props) => {
    return (
        <div className='w-full h-fit p-2 rounded-lg bg-slate-300 overflow-hidden'>
            {/* User and Timestamp*/}
            <div className='w-full flex flex-row items-center justify-between'>
                <Link href={`/profile/${userComment.user.id}/`} className='flex flex-row items-center justify-start gap-x-2'>
                    <UserImage src={userComment.user.image} widthClass='w-10' heightClass='h-10' />
                    <p className='text-base font-semibold'>{userComment.user.first_name} {userComment.user.last_name}</p>
                </Link>
                <p className='font-medium text-sm text-gray-400'>{formatRelativeTime(userComment.comment.updated_at)}</p>
            </div>

            {/* Comment */} 
            <div className='w-full h-full pl-12'>
                <p className='font-normal break-words whitespace-pre-wrap'>{userComment.comment.text}</p>
            </div>
        </div>
    )
}

export default CommentCard