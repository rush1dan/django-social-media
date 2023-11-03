import { FeedItem, PublicUserInfo, User } from '@/data/typedata'
import React, { ReactEventHandler, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { FetchStatus, apiPath, getFileNameWithExtension, getMediaURLFromApiBackend } from '@/lib/utils'
import ActionButton from '../ActionButton'

type Props = {
    user?: User,
    userInfo: PublicUserInfo,
    onModalEdited: (userInfo: PublicUserInfo) => void,
}

const EditProfileModal = ({ user, userInfo, onModalEdited }: Props) => {
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

    const [editingState, setEditingState] = useState<number>(FetchStatus.none);

    const [bio, setBio] = useState<string | undefined>(userInfo?.bio);

    const [inputImageSrc, setInputImageSrc] = useState<string | null>('');
    const [inputImage, setInputImage] = useState<File | null>(null);

    const fetchExistingImage = async (imageURL: string) => {
        const response = await axios.get(getMediaURLFromApiBackend(imageURL), {
            responseType: 'blob'
        });
        const imageFile = new File([response.data], getFileNameWithExtension(imageURL)!);
        setInputImage(imageFile);
        setInputImageSrc(URL.createObjectURL(imageFile));
    }
    useEffect(() => {
        if (userInfo?.image) {
            fetchExistingImage(userInfo.image);
        }
    }, []);

    const editFormRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditingState(FetchStatus.pending);

        const formData = new FormData();
        if (bio) {
            formData.append('bio', bio);
        }
        if (inputImage) {
            formData.append('image', inputImage);
        }

        try {
            const response = await axios.put(apiPath(`profile/${user?.id}/`), formData, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            if (response.status === 200) {
                setEditingState(FetchStatus.success);
                editFormRef.current?.reset();
                setInputImage(null);
                setInputImageSrc(null);

                const receivedData: PublicUserInfo = response.data;
                onModalEdited(receivedData);
            }
        } catch (error: any) {
            console.log("Profile editing error: ", error.message);
            setEditingState(FetchStatus.error);
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
                <form onSubmit={e => handleSubmit(e)} className='w-full min-h-full pb-16' ref={editFormRef}>

                    <div className='flex flex-row items-center justify-start gap-x-2 mb-2'>
                        <div className='flex-none w-12 h-12 rounded-full relative bg-slate-500 overflow-clip'>
                            <Image src={user?.image ? getMediaURLFromApiBackend(user.image) : '/user.svg'} alt='dp' fill />
                        </div>
                        <p className='font-semibold'>{user?.first_name} {user?.last_name}</p>
                    </div>

                    <div className='w-full flex flex-col items-center justify-start gap-y-8'>
                        <div className='w-48 h-fit'>
                            <label>
                                <input type="file" accept="image/png, image/jpeg" className='hidden' onChange={e => handleImageSelection(e)} />
                                {
                                    inputImageSrc ?
                                        <div className='relative overflow-clip w-full aspect-square rounded-full bg-slate-200 border-2 border-slate-300 flex flex-row items-center justify-center gap-x-2 cursor-pointer'>
                                                <Image src={inputImageSrc} alt='dp' fill />
                                        </div>
                                        :
                                        <div className='w-full aspect-square rounded-full bg-slate-200 border-2 border-slate-300 flex flex-row items-center justify-center gap-x-2 cursor-pointer'>
                                            <div className='w-12 h-12 relative'>
                                                <Image src='/placeholder_image.svg' alt='image' fill />
                                            </div>
                                        </div>
                                }
                            </label>
                        </div>

                        <textarea className='w-full mb-4 overflow-hidden rounded-lg bg-slate-100/10 resize-none text-base' name="create_post" id="create_post" rows={1}
                            placeholder={`Write something about you, ${user?.first_name}...`} required onChange={e => setBio(e.target.value)}
                            defaultValue={bio}>
                        </textarea>
                    </div>


                    <ActionButton buttonType='submit' isPending={editingState === FetchStatus.pending}
                        className='w-3/4 h-10 absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold'>
                        Edit
                    </ActionButton>
                </form>
            </div>
        </div>
    )
}

export default EditProfileModal