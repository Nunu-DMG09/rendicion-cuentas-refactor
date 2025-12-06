import { motion } from 'motion/react';
import { HiUser, HiMail, HiShieldCheck, HiCalendar } from 'react-icons/hi';
import { FaKey, FaUserShield, FaPowerOff } from 'react-icons/fa';
import { IoIosSwitch } from 'react-icons/io';
import { CiWarning } from 'react-icons/ci';
import type { User } from '../types/user';

interface Props {
    user: User;
    onChangePassword: (user: User) => void;
    onEditRole: (user: User) => void;
    onToggleStatus: (user: User) => void;
    currentUserId: string;
}

export const SearchUserCard = ({ user, onChangePassword, onEditRole, onToggleStatus, currentUserId }: Props) => {
    const isCurrentUser = user.id === currentUserId;
    const isActive = user.estado === '1';

    const getRoleBadge = () => {
        const isSuper = user.categoria === 'super_admin';
        return (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                isSuper
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
                <HiShieldCheck className="w-4 h-4" />
                {isSuper ? 'Super Administrador' : 'Administrador'}
            </div>
        );
    };

    const getStatusBadge = () => {
        return (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
                isActive
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-red-100 text-red-700 border-red-200'
            }`}>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                {isActive ? 'Activo' : 'Inactivo'}
            </div>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
            <div className="bg-linear-to-r from-primary to-primary-dark p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="relative flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                        <HiUser className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">
                            {user.nombre || 'Sin nombre'}
                        </h2>
                        <div className="flex items-center gap-3">
                            {getRoleBadge()}
                            {getStatusBadge()}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <HiMail className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">DNI</p>
                            <p className="text-lg font-bold text-gray-900">{user.dni}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <HiCalendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">Fecha de registro</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatDate(user.created_at)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                            <HiCalendar className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">Última actualización</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatDate(user.updated_at)}
                            </p>
                        </div>
                    </div>
                    {user.deleted_at && (
                        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                <FaPowerOff className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-red-500 font-medium">Deshabilitado el</p>
                                <p className="text-sm font-semibold text-red-900">
                                    {formatDate(user.deleted_at)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {isCurrentUser && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                            <CiWarning className="text-2xl text-amber-800" />
                        </div>
                        <p className="text-sm text-amber-800 font-medium">
                            Este es tu usuario actual. Ten cuidado al realizar cambios.
                        </p>
                    </motion.div>
                )}
                <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                            onClick={() => onChangePassword(user)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex cursor-pointer items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all group"
                        >
                            <div className="w-12 h-12 bg-blue-500 group-hover:bg-blue-600 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                                <FaKey className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-semibold text-blue-900">Cambiar</p>
                                <p className="text-xs text-blue-600">Contraseña</p>
                            </div>
                        </motion.button>
                        <motion.button
                            onClick={() => onEditRole(user)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex cursor-pointer items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl transition-all group"
                        >
                            <div className="w-12 h-12 bg-purple-500 group-hover:bg-purple-600 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                                <FaUserShield className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-semibold text-purple-900">Cambiar</p>
                                <p className="text-xs text-purple-600">Rol de usuario</p>
                            </div>
                        </motion.button>
                        <motion.button
                            onClick={() => onToggleStatus(user)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex cursor-pointer items-center gap-3 p-4 border-2 rounded-xl transition-all group ${
                                isActive
                                    ? 'bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300'
                                    : 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isActive
                                    ? 'bg-red-500 group-hover:bg-red-600'
                                    : 'bg-green-500 group-hover:bg-green-600'
                            }`}>
                                <IoIosSwitch className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`text-sm font-semibold ${isActive ? 'text-red-900' : 'text-green-900'}`}>
                                    {isActive ? 'Deshabilitar' : 'Habilitar'}
                                </p>
                                <p className={`text-xs ${isActive ? 'text-red-600' : 'text-green-600'}`}>
                                    {isActive ? 'Usuario activo' : 'Usuario inactivo'}
                                </p>
                            </div>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};