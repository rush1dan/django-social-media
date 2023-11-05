'use client'

import { PublicUserInfo } from '@/data/typedata';
import { useAuth } from '@/hooks/userAuth';
import { FetchStatus, apiPath, getMediaURLFromApiBackend } from '@/lib/utils';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoadingWrapper from '../LoadingWrapper';
import Link from 'next/link';
import UserImage from '../UserImage';

type Props = {}

const Followers = (props: Props) => {
    const { user } = useAuth();

    const [fetchState, setFetchState] = useState<number>(FetchStatus.none);
    const [followersList, setFollowersList] = useState<PublicUserInfo[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(apiPath(`followers/`), {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setFetchState(FetchStatus.success);

                const receivedData: PublicUserInfo[] = response.data;
                setFollowersList(receivedData);
            }
        } catch (error: any) {
            console.log("Error showing followers list: ", error.message);
            setFetchState(FetchStatus.error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='w-full min-h-full'>
            <div className='w-full py-2 flex flex-row items-center justify-center mb-1'>
                <div className='text-center text-lg font-bold relative'>
                    {`Followers (${followersList.length})`}
                    <div className='absolute w-full bg-black h-1 top-full mt-1' />
                </div>
            </div>
            <LoadingWrapper fetchState={fetchState}>
                {
                    followersList.length > 0 &&
                    <div className='w-full h-fit flex flex-col items-center justify-start gap-y-2'>
                        {
                            followersList.map((followerUser, index) => {
                                return (
                                    <Link href={`/profile/${followerUser.id}`} className='w-full py-4 px-4 hover:bg-slate-500/25' key={followerUser.id}>
                                        <div className='flex flex-row items-center justify-start gap-x-2'>
                                            <UserImage src={followerUser.image} widthClass='w-12' heightClass='h-12' />
                                            <div className='text-center font-semibold'>
                                                {followerUser.first_name} {followerUser.last_name}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                }
            </LoadingWrapper>
        </div>
    )
}

export default Followers