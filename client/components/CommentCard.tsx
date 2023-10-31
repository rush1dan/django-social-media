import { UserComment, PublicUserInfo } from '@/data/typedata'
import React from 'react'
import Image from 'next/image'
import { formatRelativeTime, getMediaURLFromApiBackend } from '@/lib/utils'
import Link from 'next/link'

type Props = {
    userComment: UserComment
}

const CommentCard = ({ userComment }: Props) => {
    return (
        <div className='w-full h-fit p-2 rounded-lg bg-slate-300 overflow-hidden'>
            {/* User and Timestamp*/}
            <div className='w-full flex flex-row items-center justify-between'>
                <Link href={`/profile/${userComment.user.id}/`} className='flex flex-row items-center justify-start gap-x-2'>
                    <div className='w-12 h-12 flex-none rounded-full relative bg-slate-500 overflow-clip'>
                        <Image src={userComment.user.image ? getMediaURLFromApiBackend(userComment.user.image) : '/user.svg'} alt='' fill />
                    </div>
                    <p className='font-semibold text-lg'>{userComment.user.first_name} {userComment.user.last_name}</p>
                </Link>
                <p className='font-medium text-sm text-gray-400'>{formatRelativeTime(userComment.comment.updated_at)}</p>
            </div>

            {/* Comment */} 
            <div className='w-full h-full pl-14'>
                <p className='font-normal break-words whitespace-pre-wrap'>{userComment.comment.text}</p>
            </div>
        </div>
    )
}

export default CommentCard