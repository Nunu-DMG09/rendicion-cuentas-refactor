import { motion } from "motion/react";
import { FaCheck, FaUsers } from "react-icons/fa";
import { useEjesDisponibles } from "../hooks/useEjesDisponibles";

type Props = {
	selectedEjes: string[];
	onToggle: (ejeId: string) => void;
};

export default function EjesSelector({ selectedEjes, onToggle }: Props) {
	const { data: ejes = [], isLoading, isError, error, refetch } = useEjesDisponibles();
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div key={index} className="animate-pulse">
						<div className="h-20 bg-gray-200 rounded-xl"></div>
					</div>
				))}
			</div>
		);
	}
    if (isError) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-2">Error al cargar los ejes temáticos</p>
                <p className="text-sm text-gray-500 mb-4">
                    {error?.message || 'Ocurrió un error inesperado'}
                </p>
                <button 
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }
	if (ejes.length === 0) {
		return (
			<div className="text-center py-8">
				<FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
				<p className="text-gray-600">
					No hay ejes temáticos disponibles
				</p>
				<p className="text-sm text-gray-500">
					Todos los ejes están deshabilitados o no hay ninguno creado
				</p>
			</div>
		);
	}
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{ejes.map((eje) => {
				const isSelected = selectedEjes.includes(eje.id);

				return (
					<motion.div
						key={eje.id}
						className={`relative cursor-pointer rounded-xl p-4 border-2 
                            transition-all duration-300
                            ${
								isSelected
									? "border-primary-dark bg-primary-dark/5 shadow-md"
									: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
							}
                        `}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onToggle(eje.id)}
					>
						<div className="flex items-start gap-3">
							<div
								className={`w-5 h-5 rounded border-2 flex items-center justify-center
                                        shrink-0 mt-0.5 transition-all duration-300
                                        ${
											isSelected
												? "bg-primary-dark border-primary-dark"
												: "border-gray-300 bg-white"
										}
                                    `}
							>
								{isSelected && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											type: "spring",
											stiffness: 500,
											damping: 30,
										}}
									>
										<FaCheck className="h-3 w-3 text-white" />
									</motion.div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<h4
										className={`font-medium text-sm ${
											isSelected
												? "text-primary-dark"
												: "text-gray-700"
										}`}
									>
										{eje.tematica}
									</h4>
								</div>
							</div>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
