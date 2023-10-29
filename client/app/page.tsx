import Feed from '@/components/HomePage/Feed'
import InfoCard from '@/components/HomePage/InfoCard'
import TopBar from '@/components/HomePage/TopBar'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Home() {
	return (
		<ProtectedRoute>
			<main className="w-screen min-h-screen overflow-hidden">
				{/* TopBar */}
				<div className='w-full h-16 bg-slate-400'>
					<TopBar className='w-full h-full' />
				</div>
				<div className='w-full h-[calc(100vh-4rem)] flex flex-row items-center justify-start'>
					{/* Left SideBar */}
					<div className='w-1/4 h-full bg-red-400 p-6'>
						<InfoCard />
					</div>
					{/* Feed */}
					<div className='w-1/2 h-full bg-green-400 p-6 overflow-y-auto'>
						<Feed />
					</div>
					{/* Right SideBar */}
					<div className='w-1/4 h-full bg-blue-400'>
					</div>
				</div>
			</main>
		</ProtectedRoute>
	)
}
