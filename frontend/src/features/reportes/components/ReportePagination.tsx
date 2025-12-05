import { motion } from 'motion/react'
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import type { Pagination } from '../types/reportes'

type Props = {
    pagination: Pagination
    onPageChange: (page: number) => void
}

export default function ReportePagination({ pagination, onPageChange }: Props) {
    if (pagination.total_pages <= 1) return null

    const startItem = pagination.first_page
    const endItem = pagination.last_page

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        if (pagination.total_pages <= 7) {
            for (let i = pagination.first_page; i <= pagination.total_pages; i++) {
                pages.push(i)
            }
        } else {
            if (pagination.current_page <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i)
                }
                pages.push('...')
                pages.push(pagination.total_pages)
            } else if (pagination.current_page >= pagination.total_pages - 3) {
                pages.push(pagination.first_page)
                pages.push('...')
                for (let i = pagination.total_pages - 4; i <= pagination.total_pages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(pagination.first_page)
                pages.push('...')
                pages.push(pagination.current_page - 1)
                pages.push(pagination.current_page)
                pages.push(pagination.current_page + 1)
                pages.push('...')
                pages.push(pagination.total_pages)
            }
        }        
        return pages
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
                Mostrando <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> de{' '}
                <span className="font-semibold text-primary-dark">{pagination.total}</span> registro{pagination.total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1">
                <motion.button
                    onClick={() => onPageChange(1)}
                    disabled={!pagination.has_prev}
                    className={`
                        p-2 rounded-lg transition-all
                        ${!pagination.has_prev
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: !pagination.has_prev ? 1 : 1.1 }}
                    whileTap={{ scale: !pagination.has_prev ? 1 : 0.9 }}
                    title="Primera página"
                >
                    <FaAngleDoubleLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                    onClick={() => onPageChange(pagination.current_page - 1)}
                    disabled={!pagination.has_prev}
                    className={`
                        p-2 rounded-lg transition-all
                        ${!pagination.has_prev
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: !pagination.has_prev ? 1 : 1.1 }}
                    whileTap={{ scale: !pagination.has_prev ? 1 : 0.9 }}
                    title="Página anterior"
                >
                    <FaChevronLeft className="h-4 w-4" />
                </motion.button>
                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map((page, index) => (
                        <div key={`${page}-${index}`}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-gray-400 text-sm">...</span>
                            ) : (
                                <motion.button
                                    onClick={() => onPageChange(page as number)}
                                    disabled={pagination.current_page === page}
                                    className={`
                                        min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer
                                        ${pagination.current_page === page
                                            ? 'bg-primary-dark text-white shadow-md'
                                            : 'text-gray-600 hover:bg-white'
                                        }
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {page}
                                </motion.button>
                            )}
                        </div>
                    ))}
                </div>
                <motion.button
                    onClick={() => onPageChange(pagination.current_page + 1)}
                    disabled={!pagination.has_next}
                    className={`
                        p-2 rounded-lg transition-all
                        ${!pagination.has_next
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: !pagination.has_next ? 1 : 1.1 }}
                    whileTap={{ scale: !pagination.has_next ? 1 : 0.9 }}
                    title="Página siguiente"
                >
                    <FaChevronRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                    onClick={() => onPageChange(pagination.total_pages)}
                    disabled={!pagination.has_next}
                    className={`
                        p-2 rounded-lg transition-all
                        ${!pagination.has_next
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-white cursor-pointer'
                        }
                    `}
                    whileHover={{ scale: !pagination.has_next ? 1 : 1.1 }}
                    whileTap={{ scale: !pagination.has_next ? 1 : 0.9 }}
                    title="Última página"
                >
                    <FaAngleDoubleRight className="h-4 w-4" />
                </motion.button>
            </div>
            <p className="text-xs text-gray-500 sm:hidden">
                Página {pagination.current_page} de {pagination.total_pages}
            </p>
        </div>
    )
}