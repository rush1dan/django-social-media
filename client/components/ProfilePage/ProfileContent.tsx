'use client'

import { ProfileDataType } from '@/data/typedata';
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import LoadingWrapper from '../LoadingWrapper';
import PostCard from '../HomePage/PostCard';

type Props = {}

const ProfileContent = (props: Props) => {
    const { user } = useAuth();
    const { id: profileId } = useParams();

    const [fetchState, setFetchState] = useState<number>(FetchStatus.none);
    const [profileData, setProfileData] = useState<ProfileDataType | null>(null);

    const fetchProfile = useCallback(async () => {
        setFetchState(FetchStatus.pending);
        try {
            const response = await axios.get(apiPath(`profile/${profileId}/`), {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setProfileData(response.data);
                setFetchState(FetchStatus.success);
            }
        } catch (error: any) {
            console.log("Error fetching profile info: ", error.message);
            setFetchState(FetchStatus.error);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [])

    return (
        <div className='w-full min-h-full'>
            <LoadingWrapper fetchState={fetchState}>
                <div className='w-full min-h-full flex flex-col items-center justify-start gap-y-6'>
                    {
                        profileData &&
                        profileData.posts.map((postData, index) => {
                            return (
                                <PostCard feedItem={{ user: profileData.user, ...postData }} key={postData.post.id} />
                            )
                        })
                    }
                </div>
            </LoadingWrapper>
        </div>
    )
}

export default ProfileContent