'use client'

import { User } from "@/data/typedata";
import axios, { AxiosResponse } from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/data/constants";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type SignInCredentials = {
    username: string;
    password: string;
};

type AuthContextData = {
    signIn: (credentials: SignInCredentials) => Promise<AxiosResponse>;
    user: User | undefined;
    isAuthenticated: boolean;
};

export const AuthContext = createContext({} as AuthContextData);


export function signOut(router?: AppRouterInstance) {
    destroyCookie(undefined, ACCESS_TOKEN);
    destroyCookie(undefined, REFRESH_TOKEN);
    
    router?.push('/login');
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;
    const router = useRouter();

    
    const createCookie = useCallback((accessToken: string, refreshToken: string) => {
        setCookie(undefined, ACCESS_TOKEN, accessToken, {
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        
        setCookie(undefined, REFRESH_TOKEN, refreshToken, {
            maxAge: 86400, // 1 day
        });
    }, []);
    
    const signIn = useCallback(async ({ username, password }: SignInCredentials) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token/`, {
            'username': username,
            'password': password
        });
        if (response.status === 200) {
            createCookie(response.data['access'], response.data['refresh']);
            authenticate();
        }
    
        return response;
    }, []);

    const refreshAccessToken = useCallback(async (refreshToken: string) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token/refresh/`, {
                'refresh': refreshToken
            });
            if (response.status === 200) {
                createCookie(response.data['access'], response.data['refresh']);
                return true;
            } else {
                return false;
            }
        } catch (error: any) {
            console.log("Error refreshing token: ", error.message);
            return false;
        }
    }, []);

    const authenticate = useCallback(async () => {
        try {
            const { [ACCESS_TOKEN]: access_token, [REFRESH_TOKEN]: refresh_token } = parseCookies();
            if (access_token && access_token !== 'undefined') {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                if (response.status === 200) {
                    setUser(response.data);
                    router.push('/entry');
                } else if (response.status === 401) {
                    if (refresh_token && refresh_token !== 'undefined') {
                        if (await refreshAccessToken(refresh_token)) {
                            authenticate();
                        } else {
                            signOut(router);
                        };
                    } else {
                        signOut(router);
                    }
                }
            } else if (refresh_token && refresh_token !== 'undefined') {
                if (await refreshAccessToken(refresh_token)) {
                    authenticate();
                } else {
                    signOut(router);
                }
            } else {
                signOut(router);
            }
        } catch (error: any) {
            console.log("Error authenticating: ", error.message);
            signOut(router);
        }
    }, []);

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <AuthContext.Provider value={{ signIn, user, isAuthenticated  }}>
            {children}
        </AuthContext.Provider>
    )
}