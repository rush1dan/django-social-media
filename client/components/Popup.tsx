import Image from 'next/image'
import React, { useCallback, useState } from 'react'

type Props = {
    children: React.ReactNode,
    className: string,
    hidden: boolean,
    onOpened?: () => void,
    onClosed?: () => void,
    popUpHeader?: string
}

const Popup = ({ children, className, hidden = true, onOpened, onClosed, popUpHeader }: Props) => {
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
            <div className={className}>
                <button type='button' className={`absolute w-6 h-6 top-8 -translate-y-1/2 right-8 translate-x-1/2`}
                    onClick={e => crossHandler?.()}>
                    <Image loading='eager' src='/x.svg' alt='' fill />
                </button>
                <h2 className='absolute top-8 -translate-y-1/2 left-1/2 -translate-x-1/2 font-bold text-xl'>
                    {popUpHeader}
                    <div className='w-full h-1 bg-black' />
                </h2>
                {children}
            </div>
        </div>
    )
}

export default Popup