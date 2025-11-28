import { motion } from 'framer-motion'
import { FaQuestionCircle } from 'react-icons/fa'

export default function EmptyPreguntas() {
    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaQuestionCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Seleccione una rendición
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
                Elija una fecha de rendición en el selector superior y haga clic en "Buscar" para ver las preguntas registradas.
            </p>
        </motion.div>
    )
}