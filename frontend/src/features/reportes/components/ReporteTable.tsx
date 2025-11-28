import { motion } from 'motion/react'
import { FaEye, FaTable, FaFileExcel } from 'react-icons/fa'
import type { Participante } from '../types/reportes'
import ReportePagination from './ReportePagination'

type Props = {
    participantes: Participante[]
    totalParticipantes: number
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onVerPregunta: (participante: Participante) => void
    onDownloadExcel: () => void
    isLoading: boolean
}

export default function ReporteTable({
    participantes,
    totalParticipantes,
    currentPage,
    totalPages,
    onPageChange,
    onVerPregunta,
    onDownloadExcel,
    isLoading
}: Props) {
    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#002f59] to-[#003d73] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <FaTable className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Reporte de Participantes</h2>
                        <p className="text-blue-100 text-sm">{totalParticipantes} registros encontrados</p>
                    </div>
                </div>

                {/* Botón Excel */}
                <motion.button
                    onClick={onDownloadExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaFileExcel className="h-4 w-4" />
                    Descargar Excel
                </motion.button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">DNI</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Nombre</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Sexo</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Tipo</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Título</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">RUC</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Organización</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Asistencia</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Eje</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Pregunta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, index) => (
                                <tr key={index} className="border-b border-gray-100 animate-pulse">
                                    {Array.from({ length: 10 }).map((_, cellIndex) => (
                                        <td key={cellIndex} className="px-4 py-3">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : participantes.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-4 py-12 text-center">
                                    <p className="text-gray-500">No hay participantes para mostrar</p>
                                </td>
                            </tr>
                        ) : (
                            participantes.map((p, index) => (
                                <motion.tr
                                    key={p.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    {/* DNI */}
                                    <td className="px-4 py-3 font-mono text-gray-900">{p.dni}</td>
                                    
                                    {/* Nombre */}
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-gray-900 whitespace-nowrap">{p.nombre}</span>
                                    </td>
                                    
                                    {/* Sexo (genero suena mejor, sexo suena a kchar)*/}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`
                                            inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                                            ${p.sexo === 'M' 
                                                ? 'bg-blue-100 text-blue-700' 
                                                : 'bg-pink-100 text-pink-700'
                                            }
                                        `}>
                                            {p.sexo}
                                        </span>
                                    </td>
                                    
                                    {/* Tipo */}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`
                                            inline-flex px-2 py-1 rounded-full text-xs font-medium
                                            ${p.tipoParticipacion === 'orador'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }
                                        `}>
                                            {p.tipoParticipacion === 'orador' ? 'Orador' : 'Asistente'}
                                        </span>
                                    </td>
                                    
                                    {/* Título */}
                                    <td className="px-4 py-3 text-center text-gray-600">
                                        {p.titulo || '-'}
                                    </td>
                                    
                                    {/* RUC */}
                                    <td className="px-4 py-3 text-center font-mono text-gray-600 text-xs">
                                        {p.ruc || '-'}
                                    </td>
                                    
                                    {/* Organización */}
                                    <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                                        <span className="truncate block" title={p.nombreOrganizacion || '-'}>
                                            {p.nombreOrganizacion || '-'}
                                        </span>
                                    </td>
                                    
                                    {/* Asistencia */}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`
                                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                            ${p.asistencia
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                p.asistencia ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                            {p.asistencia ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                    
                                    {/* Eje */}
                                    <td className="px-4 py-3 text-center">
                                        {p.eje ? (
                                            <span className="inline-flex px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium max-w-[120px] truncate" title={p.eje}>
                                                {p.eje}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Sin eje asignado</span>
                                        )}
                                    </td>
                                    
                                    {/* Pregunta */}
                                    <td className="px-4 py-3 text-center">
                                        {p.pregunta ? (
                                            <motion.button
                                                onClick={() => onVerPregunta(p)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002f59] text-white rounded-lg text-xs font-medium hover:bg-[#003d73] transition-colors cursor-pointer"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaEye className="h-3 w-3" />
                                                Ver pregunta
                                            </motion.button>
                                        ) : (
                                            <span className="text-gray-400 text-xs">Sin preguntas</span>
                                        )}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isLoading && participantes.length > 0 && (
                <ReportePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalParticipantes}
                    onPageChange={onPageChange}
                />
            )}
        </motion.div>
    )
}