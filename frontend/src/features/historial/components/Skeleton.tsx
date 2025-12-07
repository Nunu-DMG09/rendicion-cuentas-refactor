import { motion } from 'motion/react';

interface Props {
    rows?: number;
}

export const HistorialTableSkeleton = ({ rows = 10 }: Props) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-linear-to-r from-gray-300 to-gray-400 p-5 animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-xl" />
                    <div className="space-y-2">
                        <div className="h-5 bg-white/30 rounded w-48" />
                        <div className="h-4 bg-white/30 rounded w-32" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {['#ID', 'Acción', 'Admin Afectado', 'Realizado Por', 'Motivo', 'Fecha'].map((_, idx) => (
                                <th key={idx} className="px-4 py-3 text-left">
                                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, rowIdx) => (
                            <motion.tr
                                key={rowIdx}
                                className="border-b border-gray-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: rowIdx * 0.03 }}
                            >
                                <td className="px-4 py-4">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="h-7 bg-gray-200 rounded-full w-36 animate-pulse" />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};