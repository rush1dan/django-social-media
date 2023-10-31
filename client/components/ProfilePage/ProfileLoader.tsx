'use client'

import { ProfileData, ProfileType } from '@/data/typedata';
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import LoadingWrapper from '../LoadingWrapper';
import ProfileContent from './ProfileContent';
import ProfileInfoCard from './ProfileInfoCard';

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
                } else if (receivedProfileData.is_following) {
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
        <div className='w-full h-full flex flex-row items-center justify-start'>
            {/* Left SideBar */}
            <div className='w-1/4 h-full bg-red-400 p-6'>
                <LoadingWrapper fetchState={fetchState}>
                    {   profileData &&
                        <ProfileInfoCard userInfo={profileData?.user} />
                    }
                </LoadingWrapper>
            </div>

            {/* Feed */}
            <div className='w-1/2 h-full bg-green-400 p-6 overflow-y-auto'>
                <LoadingWrapper fetchState={fetchState}>
                    {
                        profileData &&
                        <ProfileContent profileType={profileType} profileData={profileData} />
                    }
                </LoadingWrapper>
            </div>

            {/* Right SideBar */}
            <div className='w-1/4 h-full bg-blue-400'>
            </div>
        </div>
    )
}

export default ProfileLoader