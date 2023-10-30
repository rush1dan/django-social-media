import React, {useEffect, useState, useRef} from 'react'
import ActionButton from './ActionButton'
import { FetchStatus, apiPath } from '@/lib/utils'
import axios from 'axios'
import { User, UserCommentType } from '@/data/typedata'
import Image from 'next/image'

type Props = {
    user: User | undefined, 
    post_id: number,
    commentLoadingState: number,
    setCommentLoadingState: React.Dispatch<React.SetStateAction<number>>,
    setLatestComment: React.Dispatch<React.SetStateAction<UserCommentType | null>>,
    setCommentsCount: React.Dispatch<React.SetStateAction<number>>
}   

const CommentBox = ({user, post_id, commentLoadingState, setCommentLoadingState, setLatestComment, setCommentsCount}: Props) => {
    useEffect(() => {
        const commentBox = commentInputBoxRef.current;

        function autoResize() {
            if (commentBox) {
                commentBox.style.height = "auto";
                commentBox.style.height = (commentBox.scrollHeight) + "px";
            }
        }

        commentBox?.addEventListener("input", autoResize);
    }, [])
    
    const commentInputBoxRef = useRef<HTMLTextAreaElement>(null);
    const commentFormRef = useRef<HTMLFormElement>(null);
    const [comment, setComment] = useState<string>('');

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        commentInputBoxRef.current!.style.height = '2.5rem';
        setCommentLoadingState(FetchStatus.pending);

        try {
            const response = await axios.post(apiPath(`comments/${post_id}/`), {
                text: comment
            }, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 201) {
                setLatestComment(response.data);
                setCommentsCount(current => current + 1);
                commentFormRef?.current?.reset();
                setCommentLoadingState(FetchStatus.success);
            }
        } catch (error: any) {
            console.log("Comment error: ", error.message);
            setCommentLoadingState(FetchStatus.error);
        }
    }
    return (
        <div className='w-full h-full'>
            <form onSubmit={handleCommentSubmit} ref={commentFormRef} className='relative'>
                <textarea rows={1} ref={commentInputBoxRef} className='w-full rounded-lg h-fit text-left pr-16 resize-none overflow-hidden' required onChange={e => setComment(e.target.value)}
                    placeholder='Write a comment...' />
                <ActionButton buttonType='submit' isPending={commentLoadingState === FetchStatus.pending}>
                    <div className='absolute h-12 aspect-square p-2 top-1/2 -translate-y-1/2 right-2'>
                        <div className='w-full h-full relative -mt-1'>
                            <Image src='/send.svg' alt='' fill />
                        </div>
                    </div>
                </ActionButton>
            </form>
        </div>
    )
}

export default CommentBox