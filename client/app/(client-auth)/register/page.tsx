'use client'

import axios, { AxiosError } from "axios";
import { useState, useEffect, useRef, FormEvent } from "react"
import { FetchStatus } from "@/lib/utils";
import LoadingState from "@/components/LoadingState";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    // const { data: session, status } = useSession();
    const router = useRouter();

    const formRef = useRef<HTMLFormElement>(null);
    
    // useEffect(() => {
    //     if (status === 'authenticated') {
    //         router.push('/');
    //     }
    // }, [status]);

    const initialData = {
        username: '',
        email: '',
        password: ''
    }
    const [data, setData] = useState(initialData);
    const [fetchState, setFetchState] = useState(FetchStatus.none);
    const [errorMsg, setErrorMsg] = useState('');

    // if (status === 'authenticated') {
    //     return null;
    // } else if (status === 'loading') {
    //     return (
    //         <div className="h-screen w-full flex flex-col items-center justify-center">
    //             <LoadingState status={FetchStatus.pending} />
    //         </div>
    //     )
    // }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFetchState(FetchStatus.pending);
        try {
            const res = await axios.post('/api/register', data);
            console.log(res.data);
            setFetchState(FetchStatus.success);
            router.push('/login');
        } catch (error: any) {
            console.log("Error creating user. ", error);
            if (error instanceof AxiosError) {      //or use error.name === 'AxiosError'
                setErrorMsg(error.message);
                setFetchState(FetchStatus.error);
            } else {
                setErrorMsg(error.message);
                setFetchState(FetchStatus.error);
            }
        } finally {
            formRef.current?.reset();
        }
    }

    if (fetchState !== FetchStatus.none) {
        if (fetchState == FetchStatus.pending) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center">
                    <LoadingState className={''} status={FetchStatus.pending} />
                </div>
            )
        }

        if (fetchState == FetchStatus.success) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center">
                    <LoadingState className={''} status={FetchStatus.success} />
                </div>
            )
        }

        if (fetchState == FetchStatus.error) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center">
                    <LoadingState className={''} status={FetchStatus.error} info={errorMsg} />
                </div>
            )
        }
    }

    return (
        <div className='h-screen w-full'>
            <div className="-mt-10 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create an account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST" onSubmit={(e) => handleSubmit(e)} ref={formRef}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                UserName
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setData({ ...data, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                            LogIn
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}