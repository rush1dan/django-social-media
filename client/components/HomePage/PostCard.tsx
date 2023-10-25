import { FeedItemDataType } from '@/data/typedata'
import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import ActionButton from '../ActionButton'
import axios from 'axios'
import { FetchStatus, apiPath } from '@/lib/utils'
import { useAuth } from '@/hooks/userAuth'
import ActionLink from '../ActionLink'

const PostCard = ({ feedItem }: { feedItem: FeedItemDataType }) => {
    const { user } = useAuth();
    const [likeState, setLikeState] = useState<number>(FetchStatus.none);
    const [likeCount, setLikeCount] = useState<number>(feedItem.likes);
    const like = useCallback(async () => {
        setLikeState(FetchStatus.pending);
        try {
            const response = await axios.post(apiPath(`likes/${feedItem.post.id}/`), { },{
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 201) {
                setLikeCount((current) => current + 1);
                setLikeState(FetchStatus.success);
            } else if (response.status === 200) {
                setLikeCount((current) => current - 1);
                setLikeState(FetchStatus.success);
            }
        } catch (error: any) {
            console.log("Like error: ", error.message);
            setLikeState(FetchStatus.error);
        }
    }, []);

    return (
        <div className='w-full h-fit bg-slate-50 p-4 flex flex-col items-start justify-start rounded-lg overflow-clip gap-y-2'>
            {/* User Info */}
            <div className='flex flex-row justify-center items-center gap-x-4'>
                <div className='w-12 h-12 rounded-full relative bg-slate-400'>
                    <Image src={feedItem.user.image ?? '/placeholder_image.svg'} alt='' fill />
                </div>
                <div className='flex flex-col items-start justify-center'>
                    <p className='text-base font-semibold'>{feedItem.user.first_name} {feedItem.user.last_name}</p>
                    <p className='text-sm font-semibold text-gray-600'>@{feedItem.user.username}</p>
                </div>
            </div>

            {/* Description */}
            {
                feedItem.post.description &&
                <div className=''>
                    {feedItem.post.description}
                </div>
            }

            {/* Image */}
            {
                feedItem.post.image &&
                <div className='w-full aspect-video bg-blue-500 rounded-lg'>

                </div>
            }

            {/* Like Comment Links */}
            <div className='w-full px-4 flex flex-row items-center justify-between'>
                {/* Likes Link */}
                <div className='flex flex-row items-center justify-center gap-x-2'>
                    <Image src='/like.svg' alt='' width={16} height={16} />
                    <ActionLink isPending={likeState === FetchStatus.pending} onClick={() => console.log('likes')}>
                        <p className='hover:underline'>Likes</p>
                    </ActionLink>
                    <p>{likeCount.toString()}</p>
                </div>

                {/* Comments Link */}
                <div className='flex flex-row items-center justify-center gap-x-2'>
                    <Image src='/comment.svg' alt='' width={16} height={16} />
                    <ActionLink isPending={false} onClick={() => console.log('likes')}>
                        <p className='hover:underline'>Comments</p>
                    </ActionLink>
                    <p>{feedItem.comments.toString()}</p>
                </div>
            </div>

            <div className='bg-gray-800 w-full h-[1px]' />
            {/* Like Comment Share Buttons */}
            <div className='w-full px-2 flex flex-row items-center justify-around'>
                <ActionButton isPending={likeState === FetchStatus.pending} onClick={(like)}>
                    <div className='w-40 h-10 flex flex-row items-center justify-center gap-x-2 hover:bg-slate-400/20 rounded-lg'>
                        <Image src='/like.svg' alt='' width={20} height={20} />
                        <p className='font-bold text-xl'>Like</p>
                    </div>
                </ActionButton>
                <button>
                    <div className='w-40 h-10 flex flex-row items-center justify-center gap-x-2 hover:bg-slate-400/20 rounded-lg'>
                        <Image src='/comment.svg' alt='' width={20} height={20} />
                        <p className='font-bold text-xl'>Comment</p>
                    </div>
                </button>
                <ActionButton isPending={false} onClick={(like)} isRestricted>
                    <div className='w-40 h-10 flex flex-row items-center justify-center gap-x-2 hover:bg-slate-400/20 rounded-lg'>
                        <Image src='/share.svg' alt='' width={20} height={20} />
                        <p className='font-bold text-xl'>Share</p>
                    </div>
                </ActionButton>
            </div>
            <div className='bg-gray-800 w-full h-[1px]' />
        </div>
    )
}

export default PostCard