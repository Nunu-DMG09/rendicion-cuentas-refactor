import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FaPlus, FaTags } from 'react-icons/fa'
import type { CreateEjeFormProps } from '../types/ejesTematicos'

export default function CreateEjeForm({ onSubmit, isLoading }: CreateEjeFormProps) {
    const [tematica, setTematica] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!tematica.trim()) return
        const success = await onSubmit({ tematica: tematica.trim() })
        if (success) setTematica('')
    }

    return (
        <motion.article
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <header className="bg-linear-to-r from-primary-dark to-primary p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <FaPlus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Crear Nuevo Eje</h2>
                        <p className="text-blue-100 text-sm">Agregue una nueva temática</p>
                    </div>
                </div>
            </header>
            <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-4">
                    <label 
                        htmlFor="tematica" 
                        className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                        <FaTags className="inline-block mr-2 text-primary-dark" />
                        Temática del eje
                        <span className='text-red-400 font-bold'>*</span>
                    </label>
                    <input
                        type="text"
                        id="tematica"
                        value={tematica}
                        onChange={(e) => setTematica(e.target.value)}
                        placeholder="Ej: Seguridad Ciudadana"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark/60 focus:border-primary-dark/60 transition-all outline-none text-gray-900"
                        required
                        disabled={isLoading}
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={isLoading || !tematica.trim()}
                    className={`
                        w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300
                        flex items-center justify-center gap-2
                        ${isLoading || !tematica.trim()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-dark text-white hover:bg-primary shadow-lg hover:shadow-xl cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: isLoading || !tematica.trim() ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading || !tematica.trim() ? 1 : 0.98 }}
                >
                    {isLoading ? (
                        <>
                            <motion.div
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Creando...
                        </>
                    ) : (
                        <>
                            <FaPlus className="h-4 w-4" />
                            Crear Eje
                        </>
                    )}
                </motion.button>
            </form>
        </motion.article>
    )
}