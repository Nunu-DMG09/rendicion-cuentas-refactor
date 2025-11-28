import React from 'react'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import type { PaginationProps } from '../types/ejesTematicos'

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        
        if (totalPages <= 5) {
            // Mostrar todas las páginas si son 5 o menos
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Lógica para mostrar páginas con elipsis
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
            }
        }
        
        return pages
    }

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            {/* Info */}
            <p className="text-sm text-gray-600">
                Página <span className="font-semibold">{currentPage}</span> de{' '}
                <span className="font-semibold">{totalPages}</span>
            </p>

            {/* Controles */}
            <div className="flex items-center gap-1">
                {/* Previous */}
                <motion.button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                        p-2 rounded-lg transition-all
                        ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
                >
                    <FaChevronLeft className="h-4 w-4" />
                </motion.button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-gray-400">...</span>
                            ) : (
                                <motion.button
                                    onClick={() => onPageChange(page as number)}
                                    className={`
                                        min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                                        ${currentPage === page
                                            ? 'bg-[#002f59] text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
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
                            : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
                >
                    <FaChevronRight className="h-4 w-4" />
                </motion.button>
            </div>
        </div>
    )
}