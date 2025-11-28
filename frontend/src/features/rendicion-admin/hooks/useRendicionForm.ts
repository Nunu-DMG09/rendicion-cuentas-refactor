import { useState } from 'react'
import type { RendicionFormData } from '../types/rendicionAdmin'
import { useRendicionModal } from './useRendicionModal'

export const useRendicionForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { modalState, showSuccessModal, showErrorModal, showLoadingModal, closeModal } = useRendicionModal()

    const submitRendicion = async (data: RendicionFormData) => {
        setIsLoading(true)
        showLoadingModal('Creando nueva rendición de cuentas...')

        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Validaciones
            if (!data.fecha) {
                throw new Error('La fecha es requerida')
            }
            if (!data.hora) {
                throw new Error('La hora es requerida')
            }
            if (data.banners.length === 0) {
                throw new Error('Debe subir al menos un banner')
            }
            if (data.ejesTematicos.length === 0) {
                throw new Error('Debe seleccionar al menos un eje temático')
            }

            // Aquí iría la lógica para subir los archivos
            // Por ejemplo, usando FormData para enviar al servidor
            const formData = new FormData()
            formData.append('fecha', data.fecha)
            formData.append('hora', data.hora)
            formData.append('ejesTematicos', JSON.stringify(data.ejesTematicos))

            data.banners.forEach((banner, index) => {
                formData.append(`banner_${index}`, banner.file)
            })

            console.log('Rendición creada:', {
                fecha: data.fecha,
                hora: data.hora,
                banners: data.banners.map(b => ({ name: b.name, size: b.file.size })),
                ejesTematicos: data.ejesTematicos
            })

            showSuccessModal()
            return true

        } catch (error) {
            console.error('Error al crear rendición:', error)
            showErrorModal(
                error instanceof Error
                    ? error.message
                    : 'No se pudo crear la rendición. Verifique los datos e intente nuevamente.'
            )
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        modalState,
        submitRendicion,
        closeModal
    }
}