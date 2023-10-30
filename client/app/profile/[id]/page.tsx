import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileLoader from '@/components/ProfilePage/ProfileLoader';

const ProfilePage = ({params}: any) => {
    const { id } = params;  //This id is the .../profile/[id]/
    return (
        <ProtectedRoute>
            <main className="w-screen min-h-screen overflow-hidden">
				{/* TopBar */}
				<div className='w-full h-16 bg-slate-400'>

				</div>
				<div className='w-full h-[calc(100vh-4rem)] flex flex-row items-center justify-start'>
					{/* Left SideBar */}
					<div className='w-1/4 h-full bg-red-400 p-6'>

					</div>
					{/* Feed */}
					<div className='w-1/2 h-full bg-green-400 p-6 overflow-y-auto'>
						<ProfileLoader />
					</div>
					{/* Right SideBar */}
					<div className='w-1/4 h-full bg-blue-400'>
					</div>
				</div>
			</main>
        </ProtectedRoute>
    )
}

export default ProfilePage