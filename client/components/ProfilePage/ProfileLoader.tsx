'use client'

import { ProfileData, ProfileType } from '@/data/typedata';
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import LoadingWrapper from '../LoadingWrapper';
import ProfileFeed from './ProfileFeed';
import ProfileInfoCard from './ProfileInfoCard';
import ActionButton from '../ActionButton';
import Followers from './Followers';

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

                if (user?.id === parseInt(profileId.toString())) {
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
    }, [profileType])

    const [followRequestState, setFollowRequestState] = useState<number>(FetchStatus.none);

    const followUnfollowRequest = useCallback(async () => {
        setFollowRequestState(FetchStatus.pending);
        try {
            const response = await axios.post(apiPath(`/follow/${profileId}/`), {}, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                const { is_following }: { is_following: boolean } = response.data;
                setFollowRequestState(FetchStatus.success);
                setProfileType(is_following ? ProfileType.FOLLOWING : ProfileType.NOT_FOLLOWING);
            }
        } catch (error: any) {
            console.log("Follow/Unfollow Error: ", error.message);
            setFollowRequestState(FetchStatus.error);
        }
    }, []);

    return (
        <LoadingWrapper fetchState={fetchState}>
            <div className='w-full h-full flex flex-row items-center justify-start'>
                {/* Left SideBar */}
                <div className='w-1/4 h-full bg-slate-100 p-6'>
                    {
                        profileData &&
                        <ProfileInfoCard userInfo={profileData?.user} />
                    }
                    {
                        profileType === ProfileType.FOLLOWING &&
                        <ActionButton isPending={followRequestState === FetchStatus.pending} className='block mx-auto mt-8'
                            onClick={followUnfollowRequest}>
                            <div className='px-4 py-2 bg-slate-400 text-center text-xl rounded-lg text-white font-semibold'>
                                Unfollow
                            </div>
                        </ActionButton>
                    }
                    {
                        profileType === ProfileType.NOT_FOLLOWING &&
                        <ActionButton isPending={followRequestState === FetchStatus.pending} className='block mx-auto mt-8'
                            onClick={followUnfollowRequest}>
                            <div className='px-4 py-2 bg-blue-500 text-center text-xl rounded-lg text-white font-semibold'>
                                Follow
                            </div>
                        </ActionButton>
                    }
                </div>
                {/* Feed */}
                <div className='w-1/2 h-full p-6 overflow-y-auto'>
                    {
                        profileData &&
                        <ProfileFeed profileType={profileType} profileData={profileData} />
                    }
                </div>
                {/* Right SideBar */}
                <div className='w-1/4 h-full bg-slate-100 overflow-y-auto'>
                    {
                        profileType === ProfileType.OWNER &&
                        <Followers />
                    }
                </div>
            </div>
        </LoadingWrapper>
    )
}

export default ProfileLoader