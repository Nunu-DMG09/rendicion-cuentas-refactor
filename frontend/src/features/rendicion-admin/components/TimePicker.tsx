import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClock } from 'react-icons/fa'

type TimePickerProps = {
    value: string
    onChange: (time: string) => void
    placeholder?: string
}

export default function TimePicker({ value, onChange, placeholder = '--:--' }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedHour, setSelectedHour] = useState<string>('')
    const [selectedMinute, setSelectedMinute] = useState<string>('')
    const containerRef = useRef<HTMLDivElement>(null)

    // Generar horas (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))

    // Generar minutos (00-59)
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

    // Parsear valor inicial
    useEffect(() => {
        if (value) {
            const [hour, minute] = value.split(':')
            setSelectedHour(hour || '')
            setSelectedMinute(minute || '')
        }
    }, [value])

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleHourSelect = (hour: string) => {
        setSelectedHour(hour)
        if (selectedMinute) {
            onChange(`${hour}:${selectedMinute}`)
        }
    }

    const handleMinuteSelect = (minute: string) => {
        setSelectedMinute(minute)
        if (selectedHour) {
            onChange(`${selectedHour}:${minute}`)
            setIsOpen(false)
        }
    }

    const displayValue = selectedHour && selectedMinute
        ? `${selectedHour}:${selectedMinute}`
        : placeholder

    return (
        <div ref={containerRef} className="relative">
            <motion.div
                className={`
        w-full px-4 py-3 border-2 rounded-xl cursor-pointer
        flex items-center justify-between
        transition-all duration-300
        ${isOpen
                        ? 'border-[#002f59] ring-2 ring-[#002f59]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }
        `}
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.99 }}
            >
                <span className={`text-lg ${value ? 'text-gray-900' : 'text-gray-400'}`}>
                    {displayValue}
                </span>
                <FaClock className={`h-5 w-5 ${isOpen ? 'text-[#002f59]' : 'text-gray-400'}`} />
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="bg-[#002f59] px-4 py-2 flex justify-between text-white text-sm font-semibold">
                            <span>Hora</span>
                            <span>Minutos</span>
                        </div>

                        {/* Columns Container */}
                        <div className="flex h-64">
                            {/* coluna de klas horas */}
                            <div className="flex-1 overflow-y-auto border-r border-gray-200 custom-scrollbar">
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className={`
                    px-4 py-2 text-center cursor-pointer transition-all duration-150
                    ${selectedHour === hour
                                                ? 'bg-[#002f59] text-white font-semibold'
                                                : 'hover:bg-blue-50 text-gray-700'
                                            }
                    `}
                                        onClick={() => handleHourSelect(hour)}
                                    >
                                        {hour}
                                    </div>
                                ))}
                            </div>

                            {/* Minutes Column */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {minutes.map((minute) => (
                                    <div
                                        key={minute}
                                        className={`
                    px-4 py-2 text-center cursor-pointer transition-all duration-150
                    ${selectedMinute === minute
                                                ? 'bg-[#002f59] text-white font-semibold'
                                                : 'hover:bg-blue-50 text-gray-700'
                                            }
                    `}
                                        onClick={() => handleMinuteSelect(minute)}
                                    >
                                        {minute}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer con hora seleccionada */}
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Seleccionado:</span>
                            <span className="font-semibold text-[#002f59]">
                                {selectedHour || '--'}:{selectedMinute || '--'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

    {/* Estilos para scrollbar - sino te gusta borra todo esto */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #002f59;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #003366;
        }
      `}</style>
        </div>
    )
}