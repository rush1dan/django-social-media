'use client'

import { PublicUserInfo } from '@/data/typedata';
import { useAuth } from '@/hooks/userAuth';
import { FetchStatus, apiPath, getMediaURLFromApiBackend } from '@/lib/utils';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoadingWrapper from '../LoadingWrapper';
import Link from 'next/link';
import Image from 'next/image';

type Props = {}

const Following = (props: Props) => {
    const { user } = useAuth();

    const [fetchState, setFetchState] = useState<number>(FetchStatus.none);
    const [followingList, setFollowingList] = useState<PublicUserInfo[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(apiPath(`following/`), {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setFetchState(FetchStatus.success);

                const receivedData: PublicUserInfo[] = response.data;
                setFollowingList(receivedData);
            }
        } catch (error: any) {
            console.log("Error showing following list: ", error.message);
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
                    Following
                    <div className='absolute w-full bg-black h-1 top-full mt-1' />
                </div>
            </div>
            <LoadingWrapper fetchState={fetchState}>
                {
                    followingList.length > 0 &&
                    <div className='w-full h-fit flex flex-col items-center justify-start gap-y-2'>
                        {
                            followingList.map((followingUser, index) => {
                                return (
                                    <Link href={`/profile/${followingUser.id}`} className='w-full py-4 px-4 hover:bg-slate-500/25' key={followingUser.id}>
                                        <div className='flex flex-row items-center justify-start gap-x-2'>
                                            <div className='w-12 h-12 rounded-full relative bg-slate-500 overflow-clip'>
                                                <Image src={followingUser.image ? getMediaURLFromApiBackend(followingUser.image) : '/user.svg'} alt='dp' fill />
                                            </div>
                                            <div className='text-center font-semibold'>
                                                {followingUser.first_name} {followingUser.last_name}
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

export default Following