import ProtectedRoute from '@/components/ProtectedRoute';
import React from 'react'

type Props = {}

const page = (props: Props) => {
    console.log("Server comp");
    return (
        <ProtectedRoute>
            <div>
                Hello user
            </div>
        </ProtectedRoute>
    )
}

export default page