import { UserDataType } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils'
import axios from 'axios'
import React, {useState, useCallback, useEffect} from 'react'
import LoadingWrapper from './LoadingWrapper'
import UserInfo from './UserInfo'

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
    const [likedUsers, setLikedUsers] = useState<[LikedUser] | null>(null);

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
            <div className='w-full h-full flex flex-col items-start justify-start'>
                { 
                    likedUsers?.map((likedUser, index) => {
                        return (
                            <UserInfo id={likedUser?.user.id} username={likedUser?.user.username}
                                first_name={likedUser?.user.first_name} last_name={likedUser?.user.last_name}
                                image={likedUser?.user.image} key={likedUser?.user.id} />
                        )
                    })
                }
            </div>
        </LoadingWrapper>
    )
}

export default LikesModal