'use client'

import { ProfileData, ProfileType } from '@/data/typedata';
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import LoadingWrapper from '../LoadingWrapper';
import PostCard from '../HomePage/PostCard';
import ProfileContent from './ProfileContent';

type Props = {}

const ProfileLoader = (props: Props) => {
    const { user } = useAuth();
    const { id: profileId } = useParams();

    const [fetchState, setFetchState] = useState<number>(FetchStatus.none);
    const [profileType, setProfileType] = useState<ProfileType>();
    const [profileData, setProfileData] = useState<ProfileData>();

    const fetchProfile = useCallback(async () => {
        setFetchState(FetchStatus.pending);
        try {
            const response = await axios.get(apiPath(`profile/${profileId}/`), {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                const receivedProfileData: ProfileData = response.data;

                setProfileData(receivedProfileData);
                setFetchState(FetchStatus.success);

                if (user?.id === parseInt(profileId[0])) {
                    setProfileType(ProfileType.OWNER);
                } else if (receivedProfileData.is_following){
                    setProfileType(ProfileType.FOLLOWING);
                } else {
                    setProfileType(ProfileType.NOT_FOLLOWING);
                }
            }
        } catch (error: any) {
            console.log("Error fetching profile info: ", error.message);
            // setFetchState(FetchStatus.error);
            // if (error instanceof AxiosError) {
            //     if (error.response?.status === 403) {
            //         setProfileType(ProfileType.NOT_FOLLOWING);
            //     }
            // }
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [])

    return (
        <div className='w-full min-h-full'>
            <LoadingWrapper fetchState={fetchState}>
                {
                    profileData &&
                    <ProfileContent profileType={profileType} profileData={profileData} />
                }
            </LoadingWrapper>
        </div>
    )
}

export default ProfileLoader