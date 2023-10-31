import { FeedItem, User } from '@/data/typedata'
import React, { ReactEventHandler, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { FetchStatus, apiPath, getMediaURLFromApiBackend } from '@/lib/utils'
import ActionButton from './ActionButton'

type Props = {
    user?: User,
    onPostCreated: (feedItem: FeedItem) => void,
}

const CreatePostModal = ({ user, onPostCreated }: Props) => {
    useEffect(() => {
        const postArea = document.getElementById("create_post");

        function autoResize() {
            if (postArea) {
                postArea.style.height = "auto";
                postArea.style.height = (postArea.scrollHeight) + "px";
            }
        }

        postArea?.addEventListener("input", autoResize);
    }, [])

    const [postingState, setPostingState] = useState<number>(FetchStatus.none);

    const [postDescription, setPostDescription] = useState<string>('');

    const [inputImage, setInputImage] = useState<File | null>(null);
    const [inputImageSrc, setInputImageSrc] = useState<string | null>(null);

    const postFormRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPostingState(FetchStatus.pending);

        const formData = new FormData();
        formData.append('description', postDescription);
        if (inputImage) {
            formData.append('image', inputImage);
        }

        try {
            const response = await axios.post(apiPath(`posts/`), formData, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            if (response.status === 201) {
                setPostingState(FetchStatus.success);
                postFormRef.current?.reset();
                setInputImage(null);
                setInputImageSrc(null);

                onPostCreated(response.data);
            }
        } catch (error: any) {
            console.log("Post creationg error: ", error.message);
            setPostingState(FetchStatus.error);
        }
    }

    const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const imageFile: File | null = e.target.files !== null ? e.target.files[0] : null;

        if (imageFile) {
            setInputImage(imageFile);
            setInputImageSrc(URL.createObjectURL(imageFile));
        }
    }

    return (
        <div className='w-full h-full p-6 overflow-y-auto'>
            <div className='w-full h-full'>
                <form onSubmit={e => handleSubmit(e)} className='w-full min-h-full pb-16' ref={postFormRef}>

                    <div className='flex flex-row items-center justify-start gap-x-2 mb-2'>
                        <div className='flex-none w-12 h-12 rounded-full relative bg-slate-500 overflow-clip'>
                            <Image src={user?.image ? getMediaURLFromApiBackend(user.image) : '/user.svg'} alt='dp' fill />
                        </div>
                        <p className='font-semibold'>{user?.first_name} {user?.last_name}</p>
                    </div>

                    <textarea className='w-full mb-4 overflow-hidden rounded-lg bg-slate-100/10 resize-none text-base' name="create_post" id="create_post" rows={1}
                        placeholder={`What's on your mind, ${user?.first_name}?`} required onChange={e => setPostDescription(e.target.value)}>

                    </textarea>

                    <div className='w-full h-fit'>
                        <label>
                            <input type="file" accept="image/png, image/jpeg" className='hidden' onChange={e => handleImageSelection(e)} />
                            {
                                inputImageSrc ?
                                    <img src={inputImageSrc} alt='post image' className='w-full h-auto cursor-pointer
                                        hover:ring-2 hover:ring-blue-500' /> :
                                    <div className='w-full h-32 rounded-lg bg-slate-200 border-2 border-slate-300 flex flex-row items-center justify-center gap-x-2 cursor-pointer'>
                                        <div className='w-12 h-12 relative'>
                                            <Image src='/placeholder_image.svg' alt='image' fill />
                                        </div>
                                    </div>
                            }
                        </label>
                    </div>

                    <ActionButton buttonType='submit' isPending={postingState === FetchStatus.pending}
                        className='w-3/4 h-10 absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold'>
                        Post
                    </ActionButton>
                </form>
            </div>
        </div>
    )
}

export default CreatePostModal