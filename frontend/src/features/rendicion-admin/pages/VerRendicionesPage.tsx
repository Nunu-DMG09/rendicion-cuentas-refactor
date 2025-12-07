import { motion } from 'motion/react'
import { FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa'
import RendicionCard from '../components/RendicionCard'
import YearSelector from '../components/YearSelector'
import EditRendicionModal from '../components/EditRendicionModal'
import ViewRendicionModal from '../components/ViewRendicionModal'
import RendicionesSkeleton from '../components/RendicionesSkeleton'
import { useVerRendiciones } from '../hooks/useVerRendiciones'

export const VerRendicionesPage = () => {
    const {
        selectedYear,
        setSelectedYear,
        availableYears,
        editModal,
        openEditModal,
        closeEditModal,
        viewModal,
        openViewModal,
        closeViewModal,
        isEditable,
        updateRendicion,
        isUpdating,
        updateSuccess,
        updateError,
        rendicionesQuery
    } = useVerRendiciones()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-titles">Ver Rendiciones</h1>
                    <p className="text-gray-600 text-lg mt-1 font-body">Gestiona las rendiciones de cuentas programadas</p>
                </div>
                <YearSelector
                    selectedYear={selectedYear}
                    years={availableYears}
                    onChange={setSelectedYear}
                />
            </header>
            <motion.article
                className="bg-linear-to-r from-primary-dark to-primary rounded-xl p-4 mb-8 flex items-center gap-3"
                key={selectedYear}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <FaCalendarAlt className="h-6 w-6 text-white" />
                <span className="text-white font-semibold text-lg">
                    Mostrando rendiciones del año {selectedYear}
                </span>
                <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                    {(rendicionesQuery.data || []).length} rendicion{(rendicionesQuery.data || []).length !== 1 ? 'es' : ''}
                </span>
            </motion.article>
            {rendicionesQuery.isFetching ? (
                <RendicionesSkeleton />
            ) : rendicionesQuery.data && rendicionesQuery.data.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {rendicionesQuery.data?.map((rendicion, index) => (
                        <motion.div
                            key={rendicion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <RendicionCard
                                rendicion={rendicion}
                                isEditable={isEditable(rendicion)}
                                onEdit={() => openEditModal(rendicion)}
                                onView={() => openViewModal(rendicion)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No hay rendiciones para el año {selectedYear}
                    </h3>
                    <p className="text-gray-500">
                        No se encontraron rendiciones de cuentas programadas para este año.
                    </p>
                </motion.div>
            )}
            <EditRendicionModal
                isOpen={editModal.isOpen}
                rendicion={editModal.rendicion}
                onClose={closeEditModal}
                onUpdate={updateRendicion}
                isUpdating={isUpdating}
                updateSuccess={updateSuccess}
                updateError={updateError}
            />
            <ViewRendicionModal
                isOpen={viewModal.isOpen}
                rendicion={viewModal.rendicion}
                onClose={closeViewModal}
            />
        </motion.div>
    )
}