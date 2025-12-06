import { motion } from 'motion/react';
import { HiPencil, HiKey, HiSwitchHorizontal } from 'react-icons/hi';
import type { User } from '../types/user';

interface Props {
    users: User[];
    currentUserId: string;
    onChangePassword: (user: User) => void;
    onEdit: (user: User) => void;
    onToggleStatus: (user: User) => void;
}

export const UsersTable = ({ users, currentUserId, onChangePassword, onEdit, onToggleStatus }: Props) => {
    const getRoleBadge = (categoria: User['categoria']) => {
        const styles = {
            admin: 'bg-blue-100 text-blue-700 border-blue-200',
            super_admin: 'bg-purple-100 text-purple-700 border-purple-200',
        };

        const labels = {
            admin: 'Administrador',
            super_admin: 'Super Admin',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[categoria]}`}>
                {labels[categoria]}
            </span>
        );
    };

    const getStatusBadge = (estado: User['estado']) => {
        const isActive = estado === '1';
        return (
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    isActive
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                }`}
            >
                {isActive ? 'Activo' : 'Inactivo'}
            </span>
        );
    };

    if (users.length === 0) {
        return (
            <motion.div
                className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">👥</span>
                </div>
                <h3 className="text-2xl font-titles font-bold text-gray-900 mb-2">
                    No hay usuarios
                </h3>
                <p className="text-gray-600 font-body text-lg">
                    No se encontraron usuarios con los filtros seleccionados.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                    {users.length} usuario{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                DNI
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <motion.tr
                                key={user.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {user.dni}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {user.nombre || 'Sin nombre'}
                                </td>
                                <td className="px-6 py-4">
                                    {getRoleBadge(user.categoria)}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(user.estado)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {/* Cambiar contraseña */}
                                        <motion.button
                                            onClick={() => onChangePassword(user)}
                                            className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Cambiar contraseña"
                                        >
                                            <HiKey className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => onEdit(user)}
                                            className="p-2 cursor-pointer text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title="Editar usuario"
                                        >
                                            <HiPencil className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => onToggleStatus(user)}
                                            className={`p-2 cursor-pointer rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                                user.estado === '1'
                                                    ? 'text-red-600 hover:bg-red-50'
                                                    : 'text-green-600 hover:bg-green-50'
                                            }`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            title={user.estado === '1' ? 'Desactivar' : 'Activar'}
                                            disabled={user.id === currentUserId}
                                        >
                                            <HiSwitchHorizontal className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};