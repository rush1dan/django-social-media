'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LoadingWrapper from '../LoadingWrapper'
import { FetchStatus } from '@/lib/utils'
import axios from 'axios'
import { useAuth } from '@/hooks/userAuth'
import { FeedItemDataType } from '@/data/typedata'
import PostCard from './PostCard'

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
    return (
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
    )
}

export default Feed