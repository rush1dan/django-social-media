import React from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileLoader from '@/components/ProfilePage/ProfileLoader';
import TopBar from '@/components/HomePage/TopBar';

const ProfilePage = ({ params }: any) => {
	const { id } = params;  //This id is the .../profile/[id]/
	return (
		<ProtectedRoute>
			<main className="w-screen min-h-screen overflow-hidden">
				{/* TopBar */}
				<div className='w-full h-16 bg-slate-100'>
					<TopBar atProfilePage={true} className='w-full h-full' />
				</div>
				<div className='w-full h-[calc(100vh-4rem)]'>
					<ProfileLoader />
				</div>
			</main>
		</ProtectedRoute>
	)
}

export default ProfilePage