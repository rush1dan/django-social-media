import { FeedItemDataType } from '@/data/typedata'
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import ActionButton from '../ActionButton'
import axios from 'axios'
import { FetchStatus, apiPath } from '@/lib/utils'
import { useAuth } from '@/hooks/userAuth'
import ActionLink from '../ActionLink'
import UserInfo from '../UserInfo'
import Popup from '../Popup'
import LikesModal from '../LikesModal'
import CommentsModal from '../CommentsModal'

const PostCard = ({ feedItem }: { feedItem: FeedItemDataType }) => {
    const { user } = useAuth();

    // Like Management:
    const [likeLoadingState, setLikeLoadingState] = useState<number>(FetchStatus.none);
    const [likeCount, setLikeCount] = useState<number>(feedItem.likes);
    const [likedState, setLikedState] = useState<boolean>(feedItem.liked);
    const [likesModalOpened, setLikesModalOpened] = useState<boolean>(false);

    const like = useCallback(async () => {
        setLikeLoadingState(FetchStatus.pending);
        try {
            const response = await axios.post(apiPath(`likes/${feedItem.post.id}/`), {}, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 201) {
                setLikeCount((current) => current + 1);
                setLikeLoadingState(FetchStatus.success);
                setLikedState(true);
            } else if (response.status === 200) {
                setLikeCount((current) => current - 1);
                setLikeLoadingState(FetchStatus.success);
                setLikedState(false);
            }
        } catch (error: any) {
            console.log("Like error: ", error.message);
            setLikeLoadingState(FetchStatus.error);
        }
    }, []);


    // Comment managment:
    const commentFormRef = useRef<HTMLFormElement>(null);
    const [commentLoadingState, setcommentLoadingState] = useState<number>(FetchStatus.none);
    const [comment, setComment] = useState<string>('');
    const [commentsCount, setCommentsCount] = useState<number>(feedItem.comments);
    const [userNewComments, setUserNewComments] = useState<string[]>([]);
    const [commentsModalOpened, setCommentsModalOpened] = useState<boolean>(false);


    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setcommentLoadingState(FetchStatus.pending);

        try {
            const response = await axios.post(apiPath(`comments/${feedItem.post.id}/`), {
                text: comment
            }, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 201) {
                setUserNewComments((current: string[]) => [...current, comment]);
                setCommentsCount(current => current + 1);
                commentFormRef?.current?.reset();
                setcommentLoadingState(FetchStatus.success);
            }
        } catch (error: any) {
            console.log("Comment error: ", error.message);
            setcommentLoadingState(FetchStatus.error);
        }
    }

    return (
        <div className='w-full h-fit bg-slate-50 p-4 flex flex-col items-start justify-start rounded-lg overflow-clip gap-y-2'>
            {/* User Info */}
            <UserInfo id={feedItem.user.id} username={feedItem.user.username}
                first_name={feedItem.user.first_name} last_name={feedItem.user.last_name}
                image={feedItem.user.image} />

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
                    <ActionLink isPending={likeLoadingState === FetchStatus.pending} onClick={() => setLikesModalOpened(true)}>
                        <p className='hover:underline'>Likes</p>
                    </ActionLink>
                    <p>{likeCount.toString()}</p>
                </div>

                {/* Comments Link */}
                <div className='flex flex-row items-center justify-center gap-x-2'>
                    <Image src='/comment.svg' alt='' width={16} height={16} />
                    <ActionLink isPending={commentLoadingState === FetchStatus.pending} onClick={() => setCommentsModalOpened(true)}>
                        <p className='hover:underline'>Comments</p>
                    </ActionLink>
                    <p>{commentsCount.toString()}</p>
                </div>
            </div>

            <div className='bg-gray-800 w-full h-[1px]' />
            {/* Like Comment Share Buttons */}
            <div className='w-full px-2 flex flex-row items-center justify-around'>
                <ActionButton isPending={likeLoadingState === FetchStatus.pending} onClick={(like)}>
                    <div className='w-40 h-10 flex flex-row items-center justify-center gap-x-2 hover:bg-slate-400/20 rounded-lg'>
                        <Image src='/like.svg' alt='' width={20} height={20} />
                        <p className={`font-bold text-xl ${likedState ? 'text-blue-500' : 'text-black'}`}>
                            {likedState ? 'Liked' : 'Like'}
                        </p>
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

            {/* User Comments */}
            {
                userNewComments &&
                <div className='w-full'>
                    {
                        userNewComments.map((com, index) => {
                            return (
                                <div className='bg-slate-200 w-full rounded-full' key={index}>
                                    Goku
                                </div>
                            )
                        })
                    }
                </div>
            }

            {/* Comment Box */}
            <div className='w-full'>
                <form onSubmit={handleCommentSubmit} ref={commentFormRef} className='relative'>
                    <input type="text" className='w-full rounded-full h-fit text-left pr-16' required onChange={e => setComment(e.target.value)}
                        placeholder='Write a comment...' />
                    <ActionButton buttonType='submit' isPending={commentLoadingState === FetchStatus.pending}>
                        <div className='absolute h-full aspect-square p-2 top-1/2 -translate-y-1/2 right-4'>
                            <div className='w-full h-full relative'>
                                <Image src='share.svg' alt='' fill />
                            </div>
                        </div>
                    </ActionButton>
                </form>
            </div>

            {/* Likes Modal */}
            {
                likesModalOpened &&
                <Popup className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[32rem] pt-16 rounded-lg bg-slate-50 overflow-clip'
                        hidden={!likesModalOpened} onClosed={() => setLikesModalOpened(false)}
                        popUpHeader='Likes'>
                    <LikesModal postId={feedItem.post.id} opened={likesModalOpened} />
                </Popup>
            }

            {/* Focused Post Modal */} 
            {
                commentsModalOpened &&
                <Popup className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[32rem] pt-16 rounded-lg bg-slate-50 overflow-clip'
                        hidden={!commentsModalOpened} onClosed={() => setCommentsModalOpened(false)}
                        popUpHeader='Comments'>
                    <CommentsModal postId={feedItem.post.id} opened={commentsModalOpened} />
                </Popup>
            }
        </div>
    )
}

export default PostCard