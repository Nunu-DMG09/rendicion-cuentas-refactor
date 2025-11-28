import { motion } from 'motion/react'
import CreateEjeForm from '../components/CreateEjeForm'
import EjesTable from '../components/EjesTable'
import EjesModal from '../components/EjesModal'
import EjesStats from '../components/EjesStats'
import { useEjesTematicos } from '../hooks/useEjesTematicos'

export default function EjesTematicosPage() {
    const {
        ejes,
        isLoading,
        isCreating,
        isToggling,
        createEje,
        showConfirmToggle,
        modal,
        closeModal,
        confirmModalAction,
        stats
    } = useEjesTematicos()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Ejes Temáticos</h1>
                <p className="text-gray-600 mt-1">Gestiona los ejes temáticos para las rendiciones de cuentas</p>
            </div>

            {/* Stats */}
            <EjesStats 
                total={stats.total}
                activos={stats.activos}
                inactivos={stats.inactivos}
            />

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <CreateEjeForm 
                        onSubmit={createEje}
                        isLoading={isCreating}
                    />
                </div>

                {/* Table */}
                <div className="lg:col-span-2">
                    <EjesTable 
                        ejes={ejes}
                        onToggleEstado={showConfirmToggle}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Modal */}
            <EjesModal 
                modal={modal}
                onClose={closeModal}
                onConfirm={confirmModalAction}
                isLoading={isToggling}
            />
        </motion.div>
    )
}