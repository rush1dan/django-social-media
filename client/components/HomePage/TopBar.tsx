'use client'

import { PublicUserInfo } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import { apiPath, getMediaURLFromApiBackend } from '@/lib/utils'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'

type Props = {
    className?: string,
    atProfilePage: boolean
}

const TopBar = ({ className, atProfilePage }: Props) => {
    const { user, signOut } = useAuth();
    const [searchText, setSearchText] = useState<string>('');
    const [searchData, setSearchData] = useState<PublicUserInfo[]>([]);

    const search = async (text: string) => {
        setSearchText(text);
        try {
            const response = await axios.post(apiPath(`search_users/`), {
                keyword: text
            }, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                setSearchData(response.data);
            }
        } catch (error: any) {

        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const router = useRouter();
    const handleLogout = useCallback(() => {
        signOut();
    }, [])

    return (
        <div className={className}>
            <div className='w-full h-full flex flex-row items-center justify-around'>
                {/* Profile button */}
                <Link href={atProfilePage ? '/' : `/profile/${user?.id}/`} className='flex flex-row items-center justify-center gap-x-2 px-2 py-2 bg-blue-500 hover:bg-blue-600 rounded-full border-2 border-white'>
                    <div className='w-6 h-6 relative'>
                        <Image src={atProfilePage ? '/home.svg' : '/user.svg'} alt='profile' fill />
                    </div>
                    <p className='text-white font-semibold'>{atProfilePage ? 'Home' : user?.username}</p>
                </Link>

                {/* Search bar */}
                <form className='max-w-lg w-1/2 h-[60%] relative' onSubmit={handleSubmit}>
                    <div className='absolute top-1/2 -translate-y-1/2 right-8 translate-x-1/2 h-full aspect-square p-1'>
                        <div className='h-full aspect-square relative'>
                            <Image src='/search.svg' alt='search' fill />
                        </div>
                    </div>
                    <input className='w-full h-full rounded-full' type="text" onChange={e => search(e.target.value)} />
                    {
                        searchText &&
                        <div className='absolute top-full w-full px-4 z-20'>
                            <div className='w-full bg-white shadow-lg shadow-black/20'>
                                {
                                    searchData.length > 0 ?
                                        <div className='w-full h-fit flex flex-col items-center justify-start gap-y-2'>
                                            {
                                                searchData.map((userData, index) => {
                                                    return (
                                                        <Link href={`/profile/${userData.id}`} className='w-full py-4 px-4 hover:bg-slate-500/25' key={index}>
                                                            <div className='flex flex-row items-center justify-start gap-x-2'>
                                                                <div className='w-12 h-12 rounded-full relative bg-slate-500 overflow-clip'>
                                                                    <Image src={userData.image ? getMediaURLFromApiBackend(userData.image) : '/user.svg'} alt='dp' fill />
                                                                </div>
                                                                <div className='text-center font-semibold'>
                                                                    {userData.first_name} {userData.last_name}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    )
                                                })
                                            }
                                        </div>
                                        :
                                        <div className='font-semibold text-gray-400 py-4 text-center text-lg'>
                                            No Results Found
                                        </div>
                                }
                            </div>
                        </div>
                    }
                </form>

                {/* Logout button */}
                <button className='flex flex-row items-center justify-center gap-x-2 px-2 py-2 bg-blue-900 
                hover:bg-blue-950 rounded-full border-2 border-white' onClick={handleLogout}>
                    <p className='text-white font-semibold'>Logout</p>
                    <div className='w-4 h-4 relative'>
                        <Image src={'/log-out.svg'} alt='logout' fill />
                    </div>
                </button>
            </div>
        </div>
    )
}

export default TopBar