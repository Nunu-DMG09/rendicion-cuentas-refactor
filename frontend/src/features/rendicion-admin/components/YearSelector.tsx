import { motion } from 'motion/react'
import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa'

type Props = {
    selectedYear: number
    years: number[]
    onChange: (year: number) => void
}

export default function YearSelector({ selectedYear, years, onChange }: Props) {
    return (
        <div className="relative inline-block">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FaCalendarAlt className="h-4 w-4" />
                <span className="text-sm font-medium">Filtrar por año</span>
            </div>

            <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
            >
                <select
                    value={selectedYear}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-6 py-3 pr-12 text-lg font-semibold text-primary-dark cursor-pointer outline-none focus:border-primary-dark/60 focus:ring-2 focus:ring-primary-dark/60 transition-all"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="h-4 w-4 text-primary-dark" />
                </div>
            </motion.div>
        </div>
    )
}