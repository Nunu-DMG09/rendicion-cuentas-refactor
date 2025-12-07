import { motion } from 'motion/react';
import { HiClock, HiClipboardList } from 'react-icons/hi';
import type { HistorialItem } from '../types/historial';
import { getAccionBadge, formatDate } from '../utils/badges';

interface Props {
    items: HistorialItem[];
    total: number;
}

export const HistorialTable = ({ items, total }: Props) => {
    if (items.length === 0) {
        return (
            <motion.div
                className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiClipboardList className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-titles font-bold text-gray-900 mb-2">
                    No hay registros
                </h3>
                <p className="text-gray-600 font-body text-lg">
                    Aún no se han registrado acciones en el sistema.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <header className="bg-linear-to-r from-primary-dark to-primary p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <HiClipboardList className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Historial de Acciones</h2>
                        <p className="text-blue-100 text-sm">{total} registro{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                                #ID
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                                Acción
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                                Administrador Afectado
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                                Realizado Por
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                                Motivo
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                                Fecha
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const badge = getAccionBadge(item.accion);
                            return (
                                <motion.tr
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                >
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                                            {item.id}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                                            <span className="text-base">
                                                <badge.icon />
                                            </span>
                                            {badge.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {item.admin_nombre}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">
                                                DNI: {item.admin_dni}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {item.realizado_nombre}
                                            </span>
                                            <span className="text-xs text-gray-500 font-mono">
                                                DNI: {item.realizado_dni}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="max-w-xs">
                                            <p className="text-gray-700 line-clamp-2" title={item.motivo}>
                                                {item.motivo}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <HiClock className="w-4 h-4 text-gray-400" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium">
                                                    {formatDate(item.created_at).split(',')[0]}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(item.created_at).split(',')[1]}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};