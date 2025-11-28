import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa'
import type { BannerSelectorProps } from '../types/rendicionAdmin'
import { ACCEPTED_IMAGE_FORMATS, MAX_FILE_SIZE_MB, MAX_FILES } from '../constants/rendicionAdminData'

export default function BannerSelector({ selectedBanners, onAdd, onRemove }: BannerSelectorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            onAdd(files)
        }
        // Reset input para permitir seleccionar el mismo archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            onAdd(files)
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <motion.div
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${selectedBanners.length >= MAX_FILES
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-[#002f59] hover:bg-blue-50/30'
                    }
        `}
                onClick={selectedBanners.length >= MAX_FILES ? undefined : handleClick}
                onDragOver={handleDragOver}
                onDrop={selectedBanners.length >= MAX_FILES ? undefined : handleDrop}
                whileHover={selectedBanners.length >= MAX_FILES ? {} : { scale: 1.01 }}
                whileTap={selectedBanners.length >= MAX_FILES ? {} : { scale: 0.99 }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_FORMATS}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={selectedBanners.length >= MAX_FILES}
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${selectedBanners.length >= MAX_FILES ? 'bg-gray-200' : 'bg-[#002f59]/10'}
          `}>
                        <FaCloudUploadAlt className={`
              h-8 w-8 
              ${selectedBanners.length >= MAX_FILES ? 'text-gray-400' : 'text-[#002f59]'}
            `} />
                    </div>

                    <div>
                        <p className={`font-semibold ${selectedBanners.length >= MAX_FILES ? 'text-gray-400' : 'text-gray-700'}`}>
                            {selectedBanners.length >= MAX_FILES
                                ? 'Límite de archivos alcanzado'
                                : 'Arrastra tus imágenes aquí o haz clic para seleccionar'
                            }
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            JPG, PNG, WebP o GIF • Máx. {MAX_FILE_SIZE_MB}MB por archivo • Hasta {MAX_FILES} archivos
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Preview Grid */}
            <AnimatePresence mode="popLayout">
                {selectedBanners.length > 0 && (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {selectedBanners.map((banner, index) => (
                            <motion.div
                                key={banner.id}
                                className="relative group rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                {/* Image Preview */}
                                <div className="aspect-video bg-gray-100">
                                    <img
                                        src={banner.preview}
                                        alt={banner.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                                {/* Remove Button */}
                                <motion.button
                                    type="button"
                                    className="cursor-pointer absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                    onClick={() => onRemove(banner.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaTimes className="h-3 w-3" />
                                </motion.button>

                                {/* File Info */}
                                <div className="p-2 bg-white">
                                    <p className="text-xs font-medium text-gray-700 truncate" title={banner.name}>
                                        {banner.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(banner.file.size)}
                                    </p>
                                </div>

                                {/* Index Badge */}
                                <div className="absolute top-2 left-2 w-6 h-6 bg-[#002f59] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {index + 1}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {selectedBanners.length === 0 && (
                <div className="flex items-center justify-center py-4 text-gray-400">
                    <FaImage className="h-5 w-5 mr-2" />
                    <span className="text-sm">No hay banners seleccionados</span>
                </div>
            )}

            {/* Counter */}
            {selectedBanners.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                        {selectedBanners.length} de {MAX_FILES} archivos seleccionados
                    </span>
                    {selectedBanners.length > 1 && (
                        <button
                            type="button"
                            className="cursor-pointer text-red-500 hover:text-red-600 font-medium transition-colors"
                            onClick={() => selectedBanners.forEach(b => onRemove(b.id))}
                        >
                            Eliminar todos
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}