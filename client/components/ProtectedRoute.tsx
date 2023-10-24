'use client'

import { useAuth } from '@/hooks/userAuth'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ProtectedRoute = ({ children } : { children: React.ReactNode }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated])
    return isAuthenticated ? (
        <>
            {children}
        </>
    ) : (
            <div>
                
            </div>
    )
}

export default ProtectedRoute