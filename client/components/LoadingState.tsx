import Image from 'next/image'
import React from 'react'

export const Status = {
    error: -1,
    pending: 0,
    success: 1
}

type StatusProps = {
    className?: string,
    status: Number,
    info?: string
}

const LoadingState = ({ className, status, info }: StatusProps) => {
    let statusIcon;
    let statusText;
    let textColorClass;

    switch (status) {
        case Status.error:
            statusIcon = '/x-red.svg';
            statusText = 'Error';
            textColorClass = 'text-red-500';
            break;
        case Status.pending:
            statusIcon = '/loading.gif';
            statusText = 'Loading...';
            textColorClass = 'text-slate-900';
            break;
        case Status.success:
            statusIcon = '/tick-green.svg';
            statusText = 'Success';
            textColorClass = 'text-green-500';
            break;
        default:
            statusIcon = '/placeholder_image.svg'
            statusText = '';
            break;
    }

    return (
        <div className={className}>
            <div className='w-full h-full relative flex flex-col items-center justify-center'>
                <div className='flex flex-row items-center justify-center gap-x-3'>
                    <div className='w-8 h-8 relative'>
                        <Image src={statusIcon} alt='status icon' fill />
                    </div>
                    <p className={`${textColorClass} font-semibold text-xl`}>{statusText}</p>
                </div>
                {
                    info &&
                    <p className={`${textColorClass} font-semibold text-xl`}>{info}</p>
                }
            </div>
        </div>
    )
}

export default LoadingState