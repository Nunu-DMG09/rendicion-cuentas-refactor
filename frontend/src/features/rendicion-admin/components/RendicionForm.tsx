import React, { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import {
    FaCalendarAlt,
    FaClock,
    FaImage,
    FaTags,
    FaPlus
} from 'react-icons/fa'
import type { RendicionFormData, RendicionFormProps, BannerFile } from '../types/rendicionAdmin'
import { useFormAnimations } from '../hooks/useFormAnimations'
import BannerSelector from './BannerSelector'
import EjesSelector from './EjesSelector'
import TimePicker from './TimePicker'
import { MAX_FILE_SIZE_MB } from '../constants/rendicionAdminData'

export default function RendicionForm({ onSubmit, isLoading }: RendicionFormProps) {
    const [fecha, setFecha] = useState('')
    const [hora, setHora] = useState('')
    const [selectedBanners, setSelectedBanners] = useState<BannerFile[]>([])
    const [selectedEjes, setSelectedEjes] = useState<string[]>([])
    const [errors, setErrors] = useState<string[]>([])

    const { containerVariants, itemVariants } = useFormAnimations()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData: RendicionFormData = {
            fecha,
            hora,
            banners: selectedBanners,
            ejesTematicos: selectedEjes
        }
        onSubmit(formData)
    }

    const handleAddBanners = useCallback((files: FileList) => {
        const newErrors: string[] = []
        const newBanners: BannerFile[] = []

        Array.from(files).forEach((file) => {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                newErrors.push(`${file.name}: No es una imagen válida`)
                return
            }

            // Validar tamaño
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                newErrors.push(`${file.name}: Excede el tamaño máximo de ${MAX_FILE_SIZE_MB}MB`)
                return
            }

            // Crear preview del bannrer
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
        setSelectedBanners(prev => [...prev, ...newBanners])

        // Limpiar errores después de 5 segundos
        if (newErrors.length > 0) {
            setTimeout(() => setErrors([]), 5000)
        }
    }, [])

    const handleRemoveBanner = useCallback((bannerId: string) => {
        setSelectedBanners(prev => {
            const bannerToRemove = prev.find(b => b.id === bannerId)
            if (bannerToRemove) {
                URL.revokeObjectURL(bannerToRemove.preview)
            }
            return prev.filter(b => b.id !== bannerId)
        })
    }, [])

    const handleEjeToggle = (ejeId: string) => {
        setSelectedEjes(prev =>
            prev.includes(ejeId)
                ? prev.filter(id => id !== ejeId)
                : [...prev, ejeId]
        )
    }

    const today = new Date().toISOString().split('T')[0]

    return (
        <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                variants={itemVariants}
            >
                <div className="bg-linear-to-r from-primary-dark to-primary p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <FaPlus className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Nueva Rendición de Cuentas</h2>
                            <p className="text-blue-100">Complete los datos para programar una nueva rendición</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {errors.length > 0 && (
                        <motion.div
                            className="bg-red-50 border border-red-200 rounded-xl p-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="font-semibold text-red-700 mb-2">Errores al cargar archivos:</p>
                            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={itemVariants}
                    >
                        <div>
                            <label htmlFor="fecha" className="block text-sm font-semibold text-gray-900 mb-3">
                                <FaCalendarAlt className="inline-block mr-2 text-primary-dark" />
                                Fecha de Rendición{" "}
                                <span className="text-red-400 font-bold">*</span>
                            </label>
                            <input
                                type="date"
                                id="fecha"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                min={today}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark/60 focus:border-primary-dark/60 outline-none transition-all duration-300 text-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                <FaClock className="inline-block mr-2 text-primary-dark" />
                                Hora de Rendición{" "}
                                <span className="text-red-400 font-bold">*</span>
                            </label>
                            <TimePicker
                                value={hora}
                                onChange={setHora}
                                placeholder="--:--"
                            />
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                            <FaImage className="inline-block mr-2 text-primary-dark" />
                            Subir Banners {" "}
                            <span className="text-red-400 font-bold">*</span>
                            <span className="text-gray-500 font-normal ml-2">
                                ({selectedBanners.length} seleccionados)
                            </span>
                        </label>
                        <BannerSelector
                            selectedBanners={selectedBanners}
                            onAdd={handleAddBanners}
                            onRemove={handleRemoveBanner}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                            <FaTags className="inline-block mr-2 text-primary-dark" />
                            Seleccionar Ejes Temáticos *
                            <span className="text-gray-500 font-normal ml-2">
                                ({selectedEjes.length} seleccionados)
                            </span>
                        </label>
                        <EjesSelector
                            selectedEjes={selectedEjes}
                            onToggle={handleEjeToggle}
                        />
                    </motion.div>
                    {(fecha || hora || selectedBanners.length > 0 || selectedEjes.length > 0) && (
                        <motion.div
                            className="bg-blue-50 rounded-xl p-4 border border-blue-100"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                        >
                            <h4 className="font-semibold text-primary-dark mb-2">Resumen de la Rendición</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Fecha:</span>
                                    <p className="font-medium text-gray-900">
                                        {fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Hora:</span>
                                    <p className="font-medium text-gray-900">{hora || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Banners:</span>
                                    <p className="font-medium text-gray-900">{selectedBanners.length}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Ejes:</span>
                                    <p className="font-medium text-gray-900">{selectedEjes.length}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <motion.div variants={itemVariants} className="pt-4">
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className={`cursor-pointer w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                                ${isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary-dark hover:bg-primary shadow-lg hover:shadow-xl cursor-pointer'
                                }
                                text-white transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary-dark/20
                            `}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            <div className="flex items-center justify-center gap-3">
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Creando Rendición...
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="h-5 w-5" />
                                        Registrar Rendición
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    )
}