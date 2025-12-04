import { motion } from "motion/react";
export const PreguntasSkeleton = () => (
	<motion.div
		className="space-y-6"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
	>
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="h-24 bg-gray-200 rounded-xl animate-pulse"
				/>
			))}
		</div>
		<div className="space-y-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="h-32 bg-gray-200 rounded-2xl animate-pulse"
				/>
			))}
		</div>
	</motion.div>
);
