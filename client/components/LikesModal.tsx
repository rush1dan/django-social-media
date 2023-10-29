import { UserDataType } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils'
import axios from 'axios'
import React, { useState, useCallback, useEffect } from 'react'
import LoadingWrapper from './LoadingWrapper'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
    postId: number,
    opened: boolean
}

type LikedUser = {
    user: UserDataType
}

const LikesModal = ({ postId, opened }: Props) => {
    const { user } = useAuth();
    const [fetchState, setFetchState] = useState<number>(FetchStatus.pending);
    const [likedUsers, setLikedUsers] = useState<LikedUser[] | null>(null);

    const fetchLikers = useCallback(async () => {
        try {
            const response = await axios.get(apiPath(`likes/${postId}/`), {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setLikedUsers(response.data);
                setFetchState(FetchStatus.success);
            }
        } catch (error: any) {
            setLikedUsers(null);
            setFetchState(FetchStatus.error);
        }
    }, []);

    useEffect(() => {
        if (opened) {
            fetchLikers();
        }
    }, [opened])


    return (
        <LoadingWrapper fetchState={fetchState}>
            <div className='w-full h-full flex flex-col items-start justify-start gap-y-4 p-6 overflow-y-auto'>
                {
                    likedUsers?.map((likedUser, index) => {
                        return (
                            <Link href={`/profile/${likedUser.user.id}/`} key={likedUser.user.id}>
                                <div className='flex flex-row justify-center items-center gap-x-4'>
                                    <div className='w-12 h-12 rounded-full relative bg-slate-400'>
                                        <Image src={likedUser.user.image ?? '/placeholder_image.svg'} alt='' fill />
                                    </div>
                                    <div className='flex flex-col items-start justify-center'>
                                        <p className='text-base font-semibold'>{likedUser.user.first_name} {likedUser.user.last_name}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </LoadingWrapper>
    )
}

export default LikesModal