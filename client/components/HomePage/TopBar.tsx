'use client'

import { UserDataType } from '@/data/typedata'
import { useAuth } from '@/hooks/userAuth'
import { apiPath } from '@/lib/utils'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    className?: string
}

const TopBar = ({ className }: Props) => {
    const { user } = useAuth();
    const [searchText, setSearchText] = useState<string>('');
    const [searchData, setSearchData] = useState<UserDataType[]>([]);

    const search = async (text: string) => {
        setSearchText(text);
        if (!text) {
            setSearchData([]);
        }
        try {
            const response = await axios.post(apiPath(`search_users/`), {
                keyword: text
            }, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`
                }
            });
            if (response.status === 200) {
                console.log(response.data);
                setSearchData(response.data);
            }
        } catch (error: any) {

        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }


    return (
        <div className={className}>
            <div className='w-full h-full flex flex-row items-center justify-center'>
                <form className='w-1/2 h-[60%] relative' onSubmit={handleSubmit}>
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
                                                                <div className='w-12 h-12 rounded-full relative bg-slate-500'>
                                                                    <Image src={userData.image ?? '/placeholder_image.svg'} alt='dp' fill />
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
            </div>
        </div>
    )
}

export default TopBar