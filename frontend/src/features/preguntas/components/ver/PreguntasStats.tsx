import { motion } from "motion/react";
import { FaQuestionCircle, FaCheckCircle, FaClock, FaTags, FaHandPointRight } from "react-icons/fa";

interface Props {
    total: number;
    respondidas: number;
    pendientes: number;
    ejes: number;
    selected?: number;
    pending?: number;
}

export default function PreguntasStats({ 
    total, 
    respondidas, 
    pendientes, 
    ejes,
    selected,
    pending
}: Props) {
    const isSelectorMode = selected !== undefined && pending !== undefined;

    const stats = isSelectorMode 
        ? [
            {
                icon: FaQuestionCircle,
                label: "Total preguntas",
                value: total,
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200"
            },
            {
                icon: FaHandPointRight,
                label: "Seleccionadas",
                value: selected,
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-200"
            },
            {
                icon: FaClock,
                label: "Cambios pendientes",
                value: pending,
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200"
            },
            {
                icon: FaTags,
                label: "Ejes temáticos",
                value: ejes,
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200"
            }
        ]
        : [
            {
                icon: FaQuestionCircle,
                label: "Total preguntas",
                value: total,
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200"
            },
            {
                icon: FaCheckCircle,
                label: "Respondidas",
                value: respondidas,
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-200"
            },
            {
                icon: FaClock,
                label: "Pendientes",
                value: pendientes,
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200"
            },
            {
                icon: FaTags,
                label: "Ejes temáticos",
                value: ejes,
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200"
            }
        ];

    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className={`
                        rounded-xl p-4 border-2 ${stat.border} ${stat.bg} 
                        backdrop-blur-sm shadow-sm hover:shadow-md transition-all cursor-default
                    `}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-2xl font-bold text-gray-900 leading-none">
                                {stat.value.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600 font-medium mt-1 truncate">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}