import Image from 'next/image'
import React, { useCallback, useState } from 'react'

type Props = {
    children: React.ReactNode,
    className: string,
    hidden: boolean,
    crossSizeClass: string,
    crossOffsetClass: string,
    onOpened?: () => void,
    onClosed?: () => void,
    fullScreen?: boolean
}

const Popup = ({ children, className, crossSizeClass, crossOffsetClass, hidden = true, onOpened, onClosed, fullScreen = true }: Props) => {
    const [closed, setClosed] = useState<boolean>(hidden);

    const crossHandler = useCallback(
        () => {
            setClosed(true);
            onClosed?.();
        }, []
    );

    if (!closed) {
        onOpened?.();
    }

    return (
            <div className={`absolute top-0 left-0 w-full h-full bg-gray-900/25 z-10 ${closed ? 'hidden' : ''}`}>
                <div className='relative w-full h-full'>
                    <div className={className}>
                        <button type='button' className={`absolute -translate-y-1/2 translate-x-1/2 ${crossSizeClass} ${crossOffsetClass}`}
                            onClick={e => crossHandler?.()}>
                            <Image loading='eager' src='/x.svg' alt='' fill />
                        </button>
                        {children}
                    </div>
                </div>
            </div>
    )
}

export default Popup