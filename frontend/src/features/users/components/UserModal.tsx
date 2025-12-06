import { AnimatePresence, motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
    FaTimes,
    FaKey,
    FaUserShield,
    FaCheckCircle,
    FaExclamationTriangle,
    FaExclamationCircle
} from 'react-icons/fa';
import { IoIosSwitch } from 'react-icons/io';
import type { UserModalState } from '../types/user';
import { toast } from 'sonner';

interface Props {
    modal: UserModalState;
    onClose: () => void;
    onConfirm: (data?: {
        newPassword?: string;
        newRole?: 'admin' | 'super_admin';
        motivo?: string;
    }) => void;
    isLoading?: boolean;
}

export const UserModal = ({ modal, onClose, onConfirm, isLoading = false }: Props) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'super_admin'>('admin');
    const [motivo, setMotivo] = useState(''); // ✅ Estado para motivo
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (modal.isOpen) {
            setNewPassword('');
            setConfirmPassword('');
            setMotivo('');
            setNewRole('admin');
            setShowPassword(false);
        }
    }, [modal.isOpen, modal.type]);

    const handleSubmit = () => {
        if (['change_password', 'edit_role', 'confirm'].includes(modal.type)) {
            if (!motivo.trim()) {
                toast.error('Debe proporcionar un motivo para esta acción');
                return;
            }
            if (motivo.trim().length < 10) {
                toast.error('El motivo debe tener al menos 10 caracteres');
                return;
            }
        }

        if (modal.type === 'change_password') {
            if (!newPassword || newPassword.length < 8) {
                toast.error('La contraseña debe tener al menos 8 caracteres');
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error('Las contraseñas no coinciden');
                return;
            }
            onConfirm({ newPassword, motivo: motivo.trim() });
        } else if (modal.type === 'edit_role') {
            onConfirm({ newRole, motivo: motivo.trim() });
        } else if (modal.type === 'confirm') {
            onConfirm({ motivo: motivo.trim() });
        } else {
            onConfirm();
        }
    };

    const getModalIcon = () => {
        switch (modal.type) {
            case 'change_password':
                return <FaKey className="w-8 h-8 text-blue-600" />;
            case 'edit_role':
                return <FaUserShield className="w-8 h-8 text-purple-600" />;
            case 'toggle_status':
            case 'confirm':
                return <IoIosSwitch className="w-8 h-8 text-amber-600" />;
            case 'success':
                return <FaCheckCircle className="w-8 h-8 text-green-600" />;
            case 'error':
                return <FaExclamationTriangle className="w-8 h-8 text-red-600" />;
            default:
                return <FaExclamationCircle className="w-8 h-8 text-gray-600" />;
        }
    };

    const getModalColor = () => {
        switch (modal.type) {
            case 'change_password':
                return 'blue';
            case 'edit_role':
                return 'purple';
            case 'toggle_status':
            case 'confirm':
                return 'amber';
            case 'success':
                return 'green';
            case 'error':
                return 'red';
            default:
                return 'gray';
        }
    };

    const color = getModalColor();

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.9, y: 50 }
    };
    const shouldShowMotivo = ['change_password', 'edit_role', 'confirm'].includes(modal.type);

    return (
        <AnimatePresence>
            {modal.isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`bg-${color}-50 border-b border-${color}-100 p-6 sticky top-0 z-10`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
                                        {getModalIcon()}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {modal.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                    disabled={isLoading}
                                >
                                    <FaTimes className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-gray-700">{modal.message}</p>
                            {modal.type === 'change_password' && (
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nueva Contraseña
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all duration-300 focus:border-transparent"
                                            placeholder="Mínimo 8 caracteres"
                                            minLength={8}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all duration-300 focus:border-transparent"
                                            placeholder="Repita la contraseña"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={(e) => setShowPassword(e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600">Mostrar contraseñas</span>
                                    </label>
                                </div>
                            )}
                            {modal.type === 'edit_role' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nuevo Rol
                                    </label>
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value as 'admin' | 'super_admin')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none"
                                    >
                                        <option value="admin">Administrador</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            )}
                            {shouldShowMotivo && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all duration-300 focus:border-transparent resize-none"
                                        placeholder="Explique el motivo de esta acción (mínimo 10 caracteres)"
                                        rows={4}
                                        minLength={10}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {motivo.length}/10 caracteres mínimos
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex gap-3 sticky bottom-0">
                            {modal.type === 'success' || modal.type === 'error' ? (
                                <button
                                    onClick={onClose}
                                    className={`flex-1 cursor-pointer px-4 py-2 bg-${color}-500 hover:bg-${color}-600 text-white rounded-lg font-medium transition-colors`}
                                >
                                    Cerrar
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className={`flex-1 cursor-pointer px-4 py-2 bg-${color}-500 hover:bg-${color}-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            'Confirmar'
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};