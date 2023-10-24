'use client'

import React, { useState, useEffect, useCallback } from 'react'
import LoadingWrapper from '../LoadingWrapper'
import { FetchStatus } from '@/lib/utils'
import axios from 'axios'
import { useAuth } from '@/hooks/userAuth'

type Props = {}

type UserDataType = {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    image?: string
}

type PostDataType = {
    id: number,
    description: string,
    created_at: string,
    updated_at: string,
    image?: string
}

type FeedItemDataType = {
    user: UserDataType,
    post: PostDataType,
    likes: Number,
    comments: Number
}

const Feed = (props: Props) => {
    const { user } = useAuth();
    const [fetchState, setFetchState] = useState<number>(0);
    const [fetchMsg, setFetchMsg] = useState<string>('');
    const [feedData, setFeedData] = useState<[FeedItemDataType]>();
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
                console.log(response.data);
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
            <div className='w-full h-full'>
                {feedData?.map((data, index) => {
                    return (
                        <div className='' key={data.post.id}>
                            <p>Post by {data.user.username}</p>
                            <p>{ data.post.description}</p>
                        </div>
                    )
                })}
            </div>
        </LoadingWrapper>
    )
}

export default Feed