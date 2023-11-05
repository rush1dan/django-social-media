import React, { useState, useCallback, useEffect } from 'react'
import Popup from '../Popup'
import CreatePostModal from '../CreatePostModal'
import { ProfileData, PostData } from '@/data/typedata'
import PostCard from '../HomePage/PostCard'
import { useAuth } from '@/hooks/userAuth'
import { getMediaURLFromApiBackend } from '@/lib/utils'
import UserImage from '../UserImage'

type Props = {
    profileData: ProfileData
}

const UserProfile = ({ profileData }: Props) => {
    const { user } = useAuth();

    const [postModalOpened, setPostModalOpened] = useState<boolean>(false);
    const [profilePostData, setProfilePostData] = useState<PostData[]>(profileData.posts!);

    const onPostCreated = useCallback((profilePost: PostData) => {
        setProfilePostData((current) => [profilePost, ...current]);
        setPostModalOpened(false);
    }, []);

    return (
        <div className='w-full min-h-full'>
            {/* Create Post */}
            <div className='w-full h-fit p-2 bg-slate-50 border-2 border-slate-200 mb-6 rounded-lg'>
                <div className='flex flex-row items-center justify-start gap-x-2 mb-2'>
                    <UserImage src={user?.image} widthClass='w-12' heightClass='h-12' />
                    <button type='button' className='w-full rounded-full h-10 text-left px-4 py-2 bg-slate-200 hover:bg-slate-300 text-gray-500 font-medium'
                        onClick={e => setPostModalOpened(true)}>
                        What&apos;s on your mind, {user?.first_name}?
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
                    <CreatePostModal user={user} onPostCreated={onPostCreated} />
                </Popup>
            }

            {
                profilePostData.length > 0 ?
                    <div className='w-full min-h-full flex flex-col items-center justify-start gap-y-6'>
                        {
                            profilePostData?.map((data, index) => {
                                return (
                                    <PostCard feedItem={{ user: profileData.user, ...data }} key={data.post.id} />
                                )
                            })
                        }
                    </div>
                    :
                    <div className='w-full text-center text-3xl font-semibold text-gray-400'>
                        User has no posts
                    </div>
            }
        </div>
    )
}

export default UserProfile