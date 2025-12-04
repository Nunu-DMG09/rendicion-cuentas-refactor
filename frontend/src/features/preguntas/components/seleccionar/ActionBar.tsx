import { motion, AnimatePresence } from "motion/react";
import { FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { Button } from "dialca-ui";

interface Props {
    hasPendingChanges: boolean;
    pendingCount: number;
    isUpdating: boolean;
    onSave: () => void;
    onDiscard: () => void;
}

export default function SelectionActionBar({
    hasPendingChanges,
    pendingCount,
    isUpdating,
    onSave,
    onDiscard
}: Props) {
    const btnClasses = {
        content: "flex items-center gap-2",
    }
    return (
        <AnimatePresence>
            {hasPendingChanges && (
                <motion.div
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-gray-900">
                                {pendingCount} cambio{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={onDiscard}
                                variant="outline"
                                size="sm"
                                disabled={isUpdating}
                                classes={btnClasses}
                            >
                                <FaTimes className="w-3 h-3" />
                                Descartar
                            </Button>
                            
                            <Button
                                onClick={onSave}
                                variant="primary"
                                size="sm"
                                disabled={isUpdating}
                                loading={isUpdating}
                                classes={btnClasses}
                            >
                                {isUpdating ? (
                                    <FaSpinner className="w-3 h-3 animate-spin" />
                                ) : (
                                    <FaSave className="w-3 h-3" />
                                )}
                                Guardar
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}