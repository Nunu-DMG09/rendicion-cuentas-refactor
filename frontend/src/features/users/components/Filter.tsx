import { motion } from 'motion/react';

interface Props {
    roleFilter: 'all' | 'admin' | 'super_admin';
    onRoleFilterChange: (filter: 'all' | 'admin' | 'super_admin') => void;
    statusFilter: 'all' | '1' | '0';
    onStatusFilterChange: (filter: 'all' | '1' | '0') => void;
}

export const UsersFilters = ({
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
}: Props) => {
    return (
        <motion.div
            className="bg-white rounded-xl border border-gray-200 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrar por Rol
                    </label>
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value as 'all' | 'admin' | 'super_admin')}
                        className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-300"
                    >
                        <option value="all">Todos los roles</option>
                        <option value="admin">Administrador</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrar por Estado
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value as 'all' | '1' | '0')}
                        className="w-full cursor-pointer px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark focus:border-transparent transition-all duration-300"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="1">Activos</option>
                        <option value="0">Inactivos</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
};