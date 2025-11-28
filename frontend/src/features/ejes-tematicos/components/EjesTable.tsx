import React, { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { FaBan, FaCheckCircle, FaTags, FaList } from 'react-icons/fa'
import type { EjesTableProps } from '../types/ejesTematicos'
import Pagination from './Pagination'

const ITEMS_PER_PAGE = 5

export default function EjesTable({ ejes, onToggleEstado, isLoading }: EjesTableProps) {
    const [currentPage, setCurrentPage] = useState(1)

    // Calcular paginación
    const totalPages = Math.ceil(ejes.length / ITEMS_PER_PAGE)
    
    const paginatedEjes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return ejes.slice(startIndex, endIndex)
    }, [ejes, currentPage])

    // Reset a página 1 cuando cambian los ejes
    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1)
        }
    }, [ejes.length, totalPages, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002f59] to-[#003d73] p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <FaList className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Lista de Ejes Temáticos</h2>
                        <p className="text-blue-100 text-sm">{ejes.length} ejes registrados</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                Temática
                            </th>
                            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                                Estado
                            </th>
                            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                                Fecha Creación
                            </th>
                            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            // Skeleton loading
                            Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                <tr key={index} className="border-b border-gray-100 animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-5 bg-gray-200 rounded w-24 mx-auto" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-9 bg-gray-200 rounded-lg w-28 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : ejes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <FaTags className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No hay ejes temáticos registrados</p>
                                        <p className="text-gray-400 text-sm">Crea uno nuevo usando el formulario</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedEjes.map((eje, index) => (
                                <motion.tr
                                    key={eje.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-[#002f59]/10 rounded-lg flex items-center justify-center">
                                                <FaTags className="h-4 w-4 text-[#002f59]" />
                                            </div>
                                            <span className="font-medium text-gray-900">{eje.tematica}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`
                                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                                            ${eje.estado === 'activo' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                            }
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                eje.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                            {eje.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600 text-sm">
                                        {formatDate(eje.fechaCreacion)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <motion.button
                                            onClick={() => onToggleEstado(eje.id)}
                                            className={`
                                                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                                                ${eje.estado === 'activo'
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                                }
                                            `}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {eje.estado === 'activo' ? (
                                                <>
                                                    <FaBan className="h-3.5 w-3.5" />
                                                    Deshabilitar
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="h-3.5 w-3.5" />
                                                    Habilitar
                                                </>
                                            )}
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isLoading && ejes.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </motion.div>
    )
}