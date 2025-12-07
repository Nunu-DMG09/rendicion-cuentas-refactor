import { motion } from 'motion/react';
import { useHistorial } from '../hooks/useHistorial';
import { HistorialTable } from '../components/HistorialTable';
import { HistorialTableSkeleton } from '../components/Skeleton';
import { HistorialErrorState } from '../components/ErrorState';
import { HistorialPagination } from '../components/Pagination';
import { Button } from 'dialca-ui';
import { LuRefreshCw } from 'react-icons/lu';
import { HiClipboardList } from 'react-icons/hi';

export const HistorialAdmin = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        handlePageChange
    } = useHistorial();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-titles font-bold text-gray-900 flex items-center gap-3">
                        <HiClipboardList className="w-10 h-10 text-primary" />
                        Historial de Administradores
                    </h1>
                    <p className="text-gray-600 font-body text-lg mt-1">
                        Registro de todas las acciones realizadas en el sistema
                    </p>
                </div>
                <Button
                    onClick={() => refetch()}
                    loading={isLoading}
                    loadingText="Refrescando..."
                    loadingIcon={<LuRefreshCw className="size-5 text-white animate-spin" />}
                    className={`${isLoading && 'cursor-not-allowed! opacity-60!'}`}
                    classes={{
                        content: 'flex items-center gap-2',
                    }}
                >
                    <LuRefreshCw className="size-5 text-white" />
                    Refrescar
                </Button>
            </header>
            {isLoading && <HistorialTableSkeleton rows={10} />}
            {isError && <HistorialErrorState error={error} onRetry={refetch} />}
            {!isLoading && !isError && data && (
                <>
                    <HistorialTable
                        items={data.items}
                        total={data.pagination.total}
                    />
                    <HistorialPagination
                        pagination={data.pagination}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </motion.div>
    );
};