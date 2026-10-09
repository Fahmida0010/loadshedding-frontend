export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
			<div className="w-full max-w-4xl space-y-6 animate-pulse">
				{/* Header Skeleton */}
				<div className="h-8 bg-gray-200 rounded-md w-1/3 mx-auto"></div>
				<div className="h-4 bg-gray-200 rounded-md w-1/2 mx-auto"></div>

				{/* Content Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
					<div className="h-40 bg-gray-200 rounded-xl"></div>
					<div className="h-40 bg-gray-200 rounded-xl"></div>
					<div className="h-40 bg-gray-200 rounded-xl"></div>
				</div>
			</div>
		</div>
	);
}
