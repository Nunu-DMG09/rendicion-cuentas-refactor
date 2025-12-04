import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaCalendarAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi2';
import { useRendicionesSelector } from '../hooks/useRendicionesSelector';
import { Loader } from 'dialca-ui';

interface Props {
    selectedRendicion: string;
    onRendicionChange: (rendicionId: string, rendicion?: { id: number, titulo: string }) => void;
    placeholder?: string;
    label?: string;
}

export default function RendicionesSelector({ 
    selectedRendicion, 
    onRendicionChange,
    placeholder = "Seleccione una rendición",
    label = "Rendición de Cuentas"
}: Props) {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const {
        rendicionesOptions,
        hasRendiciones,
        isLoading,
        searchQuery,
        handleSearchQueryChange,
    } = useRendicionesSelector();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 500); // 500ms de delay

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        handleSearchQueryChange(debouncedSearch);
    }, [debouncedSearch, handleSearchQueryChange]);

    const handleRendicionSelect = (rendicion: { id: number, titulo: string }) => {
        onRendicionChange(rendicion.id.toString(), rendicion);
        setIsOpen(false);
    };
    const handleSearchClear = () => {
        setSearchInput('');
        setDebouncedSearch('');
    };

    const selectedRendicionData = rendicionesOptions.find(
        r => r.id.toString() === selectedRendicion
    );

    return (
        <div className="relative w-full">
            <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <FaCalendarAlt className="inline-block mr-2 text-primary-dark" />
                {label}
            </label>

            <div className="relative mb-3">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Buscar por año, título... (ej: 2025)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-dark/60 focus:border-primary-dark/60 outline-none transition-all"
                    />
                    {isLoading && (
                        <motion.div
                            className="absolute right-10 top-1/2 transform -translate-y-1/2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader />
                        </motion.div>
                    )}
                    {searchInput && (
                        <button
                            onClick={handleSearchClear}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <FaTimes className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isLoading}
                    className={`
                        w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-primary-dark/60 focus:border-primary-dark/60 
                        outline-none transition-all text-left bg-white
                        ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-gray-300'}
                        ${selectedRendicion ? 'text-gray-900' : 'text-gray-500'}
                    `}
                >
                    <span className="block truncate">
                        {selectedRendicionData?.titulo || placeholder}
                    </span>
                    <motion.div
                        className="absolute inset-y-0 right-3 flex items-center"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <HiChevronDown className="h-5 w-5 text-gray-400" />
                    </motion.div>
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                        >
                            {isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="mr-2"
                                    >
                                        <Loader />
                                    </motion.div>
                                    <span className="text-gray-600">Buscando rendiciones...</span>
                                </div>
                            )}
                            {!isLoading && !hasRendiciones && (
                                <div className="text-center py-8 text-gray-500">
                                    <FaCalendarAlt className="mx-auto h-8 w-8 mb-2 text-gray-300" />
                                    <p className="font-medium">No se encontraron rendiciones</p>
                                    {searchQuery && (
                                        <p className="text-sm mt-1">
                                            Intenta con otros términos de búsqueda
                                        </p>
                                    )}
                                </div>
                            )}
                            {!isLoading && hasRendiciones && (
                                <div className="py-1 overflow-x-hidden">
                                    {rendicionesOptions.map((rendicion, index) => (
                                        <motion.button
                                            key={rendicion.id}
                                            onClick={() => handleRendicionSelect(rendicion)}
                                            className={`
                                                w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer
                                                ${selectedRendicion === rendicion.id.toString() 
                                                    ? 'bg-primary-dark/5 text-primary-dark font-medium' 
                                                    : 'text-gray-900'
                                                }
                                            `}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ x: 4 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="truncate">{rendicion.titulo}</span>
                                                {selectedRendicion === rendicion.id.toString() && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-primary-dark"
                                                    >
                                                        ✓
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {searchQuery && !isLoading && (
                <motion.p
                    className="text-xs text-gray-500 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {hasRendiciones 
                        ? `${rendicionesOptions.length} resultado${rendicionesOptions.length !== 1 ? 's' : ''} encontrado${rendicionesOptions.length !== 1 ? 's' : ''}`
                        : 'Sin resultados'
                    } para "{searchQuery}"
                </motion.p>
            )}
        </div>
    );
}