import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaTimes,
    FaCalendarAlt,
    FaClock,
    FaImage,
    FaSave,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa'
import type { RendicionItem, BannerFile } from '../types/rendicionAdmin'
import TimePicker from './TimePicker'
import BannerSelector from './BannerSelector'
import { MAX_FILE_SIZE_MB } from '../constants/rendicionAdminData'

type Props = {
    isOpen: boolean
    rendicion: RendicionItem | null
    onClose: () => void
    onUpdate: (id: string, fecha: string, hora: string, banners: BannerFile[]) => Promise<boolean>
    isUpdating: boolean
    updateSuccess: boolean
    updateError: string | null
}

export default function EditRendicionModal({
    isOpen,
    rendicion,
    onClose,
    onUpdate,
    isUpdating,
    updateSuccess,
    updateError
}: Props) {
    const [fecha, setFecha] = useState('')
    const [hora, setHora] = useState('')
    const [banners, setBanners] = useState<BannerFile[]>([])
    const [errors, setErrors] = useState<string[]>([])

    // Cargar datos de la rendición al abrir
    useEffect(() => {
        if (rendicion) {
            setFecha(rendicion.fecha)
            setHora(rendicion.hora)
            setBanners([])
            setErrors([])
        }
    }, [rendicion])

    const handleAddBanners = useCallback((files: FileList) => {
        const newErrors: string[] = []
        const newBanners: BannerFile[] = []

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) {
                newErrors.push(`${file.name}: No es una imagen válida`)
                return
            }

            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                newErrors.push(`${file.name}: Excede el tamaño máximo de ${MAX_FILE_SIZE_MB}MB`)
                return
            }

            const preview = URL.createObjectURL(file)
            const bannerFile: BannerFile = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                preview,
                name: file.name
            }

            newBanners.push(bannerFile)
        })

        setErrors(newErrors)
        setBanners(prev => [...prev, ...newBanners])

        if (newErrors.length > 0) {
            setTimeout(() => setErrors([]), 5000)
        }
    }, [])

    const handleRemoveBanner = useCallback((bannerId: string) => {
        setBanners(prev => {
            const bannerToRemove = prev.find(b => b.id === bannerId)
            if (bannerToRemove) {
                URL.revokeObjectURL(bannerToRemove.preview)
            }
            return prev.filter(b => b.id !== bannerId)
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rendicion) {
            await onUpdate(rendicion.id, fecha, hora, banners)
        }
    }

    const today = new Date().toISOString().split('T')[0]

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { opacity: 0, scale: 0.9, y: 50 }
    }

    return (
        <AnimatePresence>
            {isOpen && rendicion && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#002f59] to-[#003366] p-6 sticky top-0 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Editar Rendición</h2>
                                    <p className="text-blue-100 mt-1">Modifica los datos de la rendición</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="cursor-pointer p-2 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <FaTimes className="h-5 w-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Success Message */}
                        {updateSuccess && (
                            <motion.div
                                className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FaCheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-green-700 font-medium">¡Rendición actualizada exitosamente!</span>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {updateError && (
                            <motion.div
                                className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                                <span className="text-red-700 font-medium">{updateError}</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Errores de archivos */}
                            {errors.length > 0 && (
                                <motion.div
                                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Current Banner Preview */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Banner Actual
                                </label>
                                <div className="rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={rendicion.banners[0]?.url || 'https://placehold.co/1200x400/002f59/white?text=Sin+Banner'}
                                        alt="Banner actual"
                                        className="w-full h-32 object-cover"
                                    />
                                </div>
                            </div>

                            {/* Fecha y Hora */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Fecha */}
                                <div>
                                    <label htmlFor="edit-fecha" className="block text-sm font-semibold text-gray-900 mb-3">
                                        <FaCalendarAlt className="inline-block mr-2 text-[#002f59]" />
                                        Nueva Fecha *
                                    </label>
                                    <input
                                        type="date"
                                        id="edit-fecha"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                        min={today}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002f59]/20 focus:border-[#002f59] transition-all"
                                        required
                                    />
                                </div>

                                {/* Hora */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        <FaClock className="inline-block mr-2 text-[#002f59]" />
                                        Nueva Hora *
                                    </label>
                                    <TimePicker
                                        value={hora}
                                        onChange={setHora}
                                    />
                                </div>
                            </div>

                            {/* Nuevos Banners */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    <FaImage className="inline-block mr-2 text-[#002f59]" />
                                    Cambiar Banners
                                    <span className="text-gray-500 font-normal ml-2">(Opcional)</span>
                                </label>
                                <BannerSelector
                                    selectedBanners={banners}
                                    onAdd={handleAddBanners}
                                    onRemove={handleRemoveBanner}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Si no selecciona nuevos banners, se mantendrán los actuales.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <motion.button
                                    type="submit"
                                    disabled={isUpdating || updateSuccess}
                                    className={`
                    w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                    ${isUpdating || updateSuccess
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#002f59] to-[#003366] hover:from-[#003366] hover:to-[#004080] shadow-lg hover:shadow-xl cursor-pointer'
                                        }
                    text-white
                  `}
                                    whileHover={{ scale: isUpdating || updateSuccess ? 1 : 1.02 }}
                                    whileTap={{ scale: isUpdating || updateSuccess ? 1 : 0.98 }}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        {isUpdating ? (
                                            <>
                                                <motion.div
                                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                                Actualizando...
                                            </>
                                        ) : updateSuccess ? (
                                            <>
                                                <FaCheckCircle className="h-5 w-5" />
                                                ¡Actualizado!
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="h-5 w-5" />
                                                Actualizar Rendición
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}