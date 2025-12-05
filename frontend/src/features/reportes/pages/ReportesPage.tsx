import { motion } from 'motion/react'
import ReporteSelector from '../components/ReporteSelector'
import ReporteStats from '../components/ReporteStats'
import ReporteTable from '../components/ReporteTable'
import PreguntaModal from '../components/PreguntaModal'
import EmptyReporte from '../components/EmptyReporte'
import { useReportes } from '../hooks/useReportes'

export default function ReportesPage() {
    const {
        selectedRendicion,
        setSelectedRendicion,
        rendicionesOptions,
        reporteData,
        isLoading,
        buscarReporte,
        // Paginación
        currentPage,
        totalPages,
        paginatedParticipantes,
        handlePageChange,
        // Modal
        modal,
        openPreguntaModal,
        closePreguntaModal,
        // Excel
        downloadExcel
    } = useReportes()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-4xl font-titles font-bold text-gray-900">Ver Reportes</h1>
                <p className="text-gray-600 font-body text-lg mt-1">Consulta el reporte de participantes por rendición</p>
            </div>

            {/* Selector */}
            <ReporteSelector
                selectedRendicion={selectedRendicion}
                rendiciones={rendicionesOptions}
                onChange={setSelectedRendicion}
                onBuscar={buscarReporte}
                isLoading={isLoading}
            />

            {/* Reporte */}
            {reporteData ? (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Título del reporte */}
                    <div className="bg-gradient-to-r from-[#002f59] to-[#003d73] rounded-xl p-4 flex items-center justify-between">
                        <div className="text-white">
                            <h2 className="text-xl font-bold">{reporteData.rendicionLabel}</h2>
                            <p className="text-blue-100 text-sm">
                                {new Date(reporteData.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <ReporteStats stats={reporteData.stats} />

                    {/* Table */}
                    <ReporteTable
                        participantes={paginatedParticipantes}
                        totalParticipantes={reporteData.participantes.length}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onVerPregunta={openPreguntaModal}
                        onDownloadExcel={downloadExcel}
                        isLoading={isLoading}
                    />
                </motion.div>
            ) : !isLoading ? (
                <EmptyReporte />
            ) : null}

            {/* Modal Pregunta */}
            <PreguntaModal
                modal={modal}
                onClose={closePreguntaModal}
            />
        </motion.div>
    )
}