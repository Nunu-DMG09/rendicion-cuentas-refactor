import type { HistorialItem } from '../types/historial';
import { HiPlus } from 'react-icons/hi';
import { HiDocument, HiUser, HiXMark } from 'react-icons/hi2';
import { PiCheckFatDuotone, PiKeyDuotone } from 'react-icons/pi';


export const getAccionBadge = (accion: HistorialItem['accion']) => {
    const badges = {
        crear: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-200',
            label: 'Crear',
            icon: HiPlus 
        },
        editar_password: {
            bg: 'bg-blue-100',
            text: 'text-blue-700',
            border: 'border-blue-200',
            label: 'Cambio de Contraseña',
            icon: PiKeyDuotone 
        },
        edit_categoria: {
            bg: 'bg-purple-100',
            text: 'text-purple-700',
            border: 'border-purple-200',
            label: 'Cambio de Rol',
            icon: HiUser 
        },
        habilitar: {
            bg: 'bg-emerald-100',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            label: 'Habilitar',
            icon: PiCheckFatDuotone
        },
        deshabilitar: {
            bg: 'bg-red-100',
            text: 'text-red-700',
            border: 'border-red-200',
            label: 'Deshabilitar',
            icon: HiXMark
        },
        '': {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            border: 'border-gray-200',
            label: 'Otra Acción',
            icon: HiDocument
        }
    };

    return badges[accion] || badges[''];
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

export const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace unos segundos';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    
    return formatDate(dateString);
};