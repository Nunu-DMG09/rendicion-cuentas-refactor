import { motion } from 'motion/react';

interface Props {
    rows?: number;
}

export const UsersTableSkeleton = ({ rows = 5 }: Props) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="h-6 bg-gray-300 rounded w-48 animate-pulse" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {['DNI', 'Nombre', 'Rol', 'Estado', 'Acciones'].map((_, idx) => (
                                <th key={idx} className="px-6 py-4 text-left">
                                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
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
                                transition={{ delay: rowIdx * 0.05 }}
                            >
                                {/* DNI */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                                </td>
                                {/* Nombre */}
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                                </td>
                                {/* Rol */}
                                <td className="px-6 py-4">
                                    <div className="h-6 bg-gray-200 rounded-full w-28 animate-pulse" />
                                </td>
                                {/* Estado */}
                                <td className="px-6 py-4">
                                    <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
                                </td>
                                {/* Acciones */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
                                        <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
                                        <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
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