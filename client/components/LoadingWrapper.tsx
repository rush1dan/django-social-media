'use client'

import React, { useEffect, useState } from 'react'
import { FetchStatus } from '@/lib/utils'
import LoadingState from './LoadingState'

type Props = {
    children: React.ReactNode,
    fetchState: number,
    fetchInfo?: string,
    loadImmediatelyOnSuccess?: boolean
}

const LoadingWrapper = ({ children, fetchState, fetchInfo, loadImmediatelyOnSuccess=true}: Props) => { 
    if (fetchState !== FetchStatus.none && (loadImmediatelyOnSuccess ? fetchState !== FetchStatus.success : true)) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <LoadingState className={''} status={fetchState} info={fetchInfo} />
            </div>
        )
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default LoadingWrapper