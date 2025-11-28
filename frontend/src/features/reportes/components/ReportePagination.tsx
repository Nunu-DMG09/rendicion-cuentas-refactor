import React from 'react'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { ITEMS_PER_PAGE } from '../constants/reportesData'

type Props = {
    currentPage: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
}

export default function ReportePagination({ currentPage, totalPages, totalItems, onPageChange }: Props) {
    if (totalPages <= 1) return null

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages)
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
            }
        }
        
        return pages
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
            {/* Info */}
            <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> de{' '}
                <span className="font-semibold">{totalItems}</span> registros
            </p>

            {/* Controles */}
            <div className="flex items-center gap-1">
                {/* First */}
                <motion.button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={`
                        p-2 rounded-lg transition-all
                        ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
                    title="Primera página"
                >
                    <FaAngleDoubleLeft className="h-4 w-4" />
                </motion.button>

                {/* Previous */}
                <motion.button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                        p-2 rounded-lg transition-all
                        ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
                    title="Página anterior"
                >
                    <FaChevronLeft className="h-4 w-4" />
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-gray-400 text-sm">...</span>
                            ) : (
                                <motion.button
                                    onClick={() => onPageChange(page as number)}
                                    className={`
                                        min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                                        ${currentPage === page
                                            ? 'bg-[#002f59] text-white shadow-md'
                                            : 'text-gray-600 hover:bg-white'
                                        }
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {page}
                                </motion.button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next */}
                <motion.button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                        p-2 rounded-lg transition-all
                        ${currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
                    title="Página siguiente"
                >
                    <FaChevronRight className="h-4 w-4" />
                </motion.button>

                {/* Last */}
                <motion.button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`
                        p-2 rounded-lg transition-all
                        ${currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
                    title="Última página"
                >
                    <FaAngleDoubleRight className="h-4 w-4" />
                </motion.button>
            </div>
        </div>
    )
}