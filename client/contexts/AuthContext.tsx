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
    signOut: () => void;
    signIn: (credentials: SignInCredentials) => Promise<AxiosResponse>;
    user: User | undefined;
    isAuthenticated: boolean;
    authCheckComplete: boolean;
};

export const AuthContext = createContext({} as AuthContextData);




export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authCheckComplete, setAuthCheckComplete] = useState<boolean>(false);
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

    const signOut = useCallback(() => {
        destroyCookie(undefined, ACCESS_TOKEN);
        destroyCookie(undefined, REFRESH_TOKEN);

        setUser(undefined);
        setAuthCheckComplete(false);

        router?.push('/login');
    }, []);
    
    const signIn = useCallback(async ({ username, password }: SignInCredentials) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token/`, {
            'username': username,
            'password': password
        });
        if (response.status === 200) {
            createCookie(response.data['access'], response.data['refresh']);
            authenticate(true);
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

    const authenticate = useCallback(async (fromLogin: boolean = false) => {
        try {
            const { [ACCESS_TOKEN]: access_token, [REFRESH_TOKEN]: refresh_token } = parseCookies();
            if (access_token && access_token !== 'undefined') {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                if (response.status === 200) {
                    setUser({ ...response.data, access_token: access_token});
                    if (fromLogin) {
                        router.push('/');
                    }
                } else if (response.status === 401) {
                    if (refresh_token && refresh_token !== 'undefined') {
                        if (await refreshAccessToken(refresh_token)) {
                            authenticate();
                        } else {
                            signOut();
                        };
                    } else {
                        signOut();
                    }
                }
            } else if (refresh_token && refresh_token !== 'undefined') {
                if (await refreshAccessToken(refresh_token)) {
                    authenticate();
                } else {
                    signOut();
                }
            } else {
                signOut();
            }
        } catch (error: any) {
            console.log("Error authenticating: ", error.message);
            signOut();
        } finally {
            setAuthCheckComplete(true);
        }
    }, []);

    useEffect(() => {
        authenticate();
    }, []);

    return (
        <AuthContext.Provider value={{ signOut, signIn, user, isAuthenticated, authCheckComplete  }}>
            {children}
        </AuthContext.Provider>
    )
}