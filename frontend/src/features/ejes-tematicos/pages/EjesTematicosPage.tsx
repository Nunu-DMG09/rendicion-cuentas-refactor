import { motion } from 'motion/react'
import CreateEjeForm from '../components/CreateEjeForm'
import EjesTable from '../components/EjesTable'
import EjesModal from '../components/EjesModal'
import EjesStats from '../components/EjesStats'
import { useEjesTematicos } from '../hooks/useEjesTematicos'

export default function EjesTematicosPage() {
    const {
        createEje,
        showConfirmToggle,
        modal,
        closeModal,
        confirmModalAction,
        stats,
        ejesQuery,
        toggleEstadoMutation,
        createEjeMutation
    } = useEjesTematicos()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header className="mb-6">
                <h1 className="text-4xl font-titles font-bold text-gray-900">Ejes Temáticos</h1>
                <p className="text-gray-600 mt-1">Gestiona los ejes temáticos para las rendiciones de cuentas</p>
            </header>
            <EjesStats 
                total={stats.total || 0}
                activos={stats.activos || 0}
                inactivos={stats.inactivos || 0}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <CreateEjeForm 
                        onSubmit={createEje}
                        isLoading={createEjeMutation.isPending}
                    />
                </div>
                <div className="lg:col-span-2">
                    <EjesTable 
                        ejes={ejesQuery.data || []}
                        onToggleEstado={showConfirmToggle}
                        isLoading={ejesQuery.isFetching}
                    />
                </div>
            </div>
            <EjesModal 
                modal={modal}
                onClose={closeModal}
                onConfirm={confirmModalAction}
                isLoading={toggleEstadoMutation.isPending}
            />
        </motion.div>
    )
}