import { motion } from "motion/react";

export function ScheduleCardSkeleton() {
    return (
        <motion.div
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="md:w-40 shrink-0">
                    <div className="bg-gray-200 rounded-xl p-6 animate-pulse">
                        <div className="h-10 bg-gray-300 rounded mb-2"></div>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                </div>
                <div className="md:w-14">
                    <div className="h-14 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </div>
        </motion.div>
    );
}