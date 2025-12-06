import { Button } from "dialca-ui";
import { motion } from "motion/react";
import { HiRefresh } from "react-icons/hi";
import { HiExclamationTriangle } from "react-icons/hi2";

interface Props {
    error: { message?: string } | null;
    onRetry: () => void;
}

export const UsersErrorState = ({ error, onRetry }: Props) => {
    const isNetworkError = error?.message?.includes("Network Error");

    return (
        <motion.div
            className="bg-white rounded-2xl p-12 text-center shadow-lg border border-red-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiExclamationTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-3xl font-titles font-bold text-gray-900 mb-4">
                {isNetworkError ? "Error de conexión" : "Error al cargar usuarios"}
            </h3>
            <p className="text-gray-600 text-lg font-body mb-8 max-w-md mx-auto">
                {isNetworkError
                    ? "Verifica tu conexión a internet e intenta nuevamente."
                    : "Ocurrió un problema al obtener los usuarios. Intenta nuevamente."}
            </p>
            <Button
                onClick={onRetry}
                variant="primary"
                classes={{ content: "flex items-center gap-2" }}
            >
                <HiRefresh className="w-4 h-4" />
                Reintentar
            </Button>
        </motion.div>
    );
};