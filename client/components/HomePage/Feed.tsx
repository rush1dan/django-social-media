'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LoadingWrapper from '../LoadingWrapper'
import { FetchStatus } from '@/lib/utils'
import axios from 'axios'
import { useAuth } from '@/hooks/userAuth'
import { FeedItemDataType } from '@/data/typedata'
import PostCard from './PostCard'
import Image from 'next/image'
import Popup from '../Popup'
import CreatePostModal from '../CreatePostModal'

type Props = {}

const Feed = (props: Props) => {
    const { user } = useAuth();
    const [fetchState, setFetchState] = useState<number>(0);
    const [fetchMsg, setFetchMsg] = useState<string>('');
    const [feedData, setFeedData] = useState<FeedItemDataType[]>();
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feed/`, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setFetchState(FetchStatus.success);
                setFetchMsg(response.statusText);
                setFeedData(response.data);
            } else {
                setFetchState(FetchStatus.error);
                setFetchMsg(response.statusText);
            }
        } catch (error: any) {
            setFetchState(FetchStatus.error);
            setFetchMsg(error.message);
        }
    }, []);
    useEffect(() => {
        fetchData();
    }, []);

    const [postModalOpened, setPostModalOpened] = useState<boolean>(false);

    return (
        <div className='w-full min-h-full'>
            {/* Create Post */}
            <div className='w-full h-fit p-2 bg-slate-50 mb-6 rounded-lg'>
                <div className='flex flex-row items-center justify-start gap-x-2 mb-2'>
                    <div className='flex-none w-12 h-12 rounded-full relative bg-slate-500'>
                        <Image src={user?.image ?? '/placeholder_image.svg'} alt='dp' fill />
                    </div>
                    <button type='button' className='w-full rounded-full h-10 text-left px-4 py-2 bg-slate-200 hover:bg-slate-300 text-gray-500 font-medium'
                        onClick={e => setPostModalOpened(true)}>
                        What's on your mind, {user?.first_name}?
                    </button>
                </div>
                <button type='button' className='w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md'
                    onClick={e => setPostModalOpened(true)}>
                    Create Post
                </button>
            </div>

            {
                postModalOpened &&
                <Popup className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] pt-16 rounded-lg bg-slate-50 overflow-clip'
                        hidden={!postModalOpened} onClosed={() => setPostModalOpened(false)}
                        popUpHeader='Create Post'>
                        <CreatePostModal user={user} />
                </Popup>
            }

            {/* Post Cards */}
            <LoadingWrapper fetchState={fetchState} fetchInfo={fetchMsg}>
                <div className='w-full min-h-full flex flex-col items-center justify-start gap-y-6'>
                    {
                        feedData?.map((data, index) => {
                            return (
                                <PostCard feedItem={data} key={data.post.id} />
                            )
                        })
                    }
                </div>
            </LoadingWrapper>
        </div>
    )
}

export default Feed