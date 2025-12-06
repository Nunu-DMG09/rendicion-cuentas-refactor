import { motion } from 'motion/react';

export const SearchUserSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
            <div className="bg-linear-to-r from-gray-300 to-gray-400 p-8 animate-pulse">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/30 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="h-8 bg-white/30 rounded w-64" />
                        <div className="flex gap-3">
                            <div className="h-8 bg-white/30 rounded-full w-32" />
                            <div className="h-8 bg-white/30 rounded-full w-24" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
                                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-6 border-t border-gray-200">
                    <div className="h-6 bg-gray-300 rounded w-48 mb-4 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                                <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
                                    <div className="h-3 bg-gray-300 rounded w-24 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};