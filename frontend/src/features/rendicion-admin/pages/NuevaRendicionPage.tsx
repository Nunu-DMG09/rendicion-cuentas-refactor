import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import RendicionForm from '../components/RendicionForm'
import RendicionAdminModal from '../components/RendicionAdminModal'
import { useRendicionForm } from '../hooks/useRendicionForm'

export default function NuevaRendicionPage() {
    const navigate = useNavigate()
    const { isLoading, modalState, submitRendicion, closeModal } = useRendicionForm()

    const handleSubmit = async (data: Parameters<typeof submitRendicion>[0]) => {
        const success = await submitRendicion(data)
        if (success) {
            // Opcional: redirigir después de cerrar el modal
        }
    }

    const handleModalClose = () => {
        closeModal()
        if (modalState.type === 'success') navigate('/admin/rendiciones/ver-rendiciones')
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Nueva Rendición</h1>
                <p className="text-gray-600 mt-1">Programe una nueva audiencia de rendición de cuentas</p>
            </header>
            <RendicionForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
            <RendicionAdminModal
                isOpen={modalState.isOpen}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                onClose={handleModalClose}
            />
        </motion.div>
    )
}