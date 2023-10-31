import { UserComment } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import { FetchStatus, apiPath } from '@/lib/utils'
import axios from 'axios'
import React, {useState, useCallback, useEffect} from 'react'
import LoadingWrapper from './LoadingWrapper'
import CommentCard from './CommentCard'

type Props = {
    postId: number, 
    opened: boolean
}



const CommentsModal = ({ postId, opened }: Props) => {
    const { user } = useAuth();
    const [fetchState, setFetchState] = useState<number>(FetchStatus.pending);
    const [userComments, setComments] = useState<UserComment[] | null>(null);

    const fetchComments = useCallback(async () => {
        try {
            const response = await axios.get(apiPath(`comments/${postId}/`), {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setComments(response.data);
                setFetchState(FetchStatus.success);
            }
        } catch (error: any) {
            setComments(null);
            setFetchState(FetchStatus.error);
        }
    }, []);

    useEffect(() => {
        if (opened) {
            fetchComments();
        }
    }, [opened])
    

    return (
        <LoadingWrapper fetchState={fetchState}>
            <div className='w-full h-full flex flex-col items-start justify-start gap-y-4 px-6 py-2 overflow-y-auto'>
                { 
                    userComments?.map((userComment, index) => {
                        return (
                            <div className='w-full' key={userComment?.comment.id}>
                                <CommentCard userComment={userComment} />
                            </div>
                        )
                    })
                }
            </div>
        </LoadingWrapper>
    )
}

export default CommentsModal