import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import RendicionAxisRow from './RendicionAxisRow';
import QuestionsModal from './QuestionsModal';
import { useRendicion } from '../hooks/useRendicion';
import { useQuestionsModal } from '../hooks/useQuestionsModal';
import { useRendicionInfo } from '../utils/rendicionHelpers';
import type { RendicionDetailProps } from '../types/rendicion';
import { HiArrowLeft, HiInformationCircle } from 'react-icons/hi2';
import { HiCalendar, HiClock } from 'react-icons/hi';
import { Button, Loader } from 'dialca-ui';
import { formatTime } from '../utils/formats';
import { formatDateWithWeekday } from '@/shared/utils';

export default function RendicionDetail({ rendicionId }: RendicionDetailProps) {
    const navigate = useNavigate();
    const { rendicionData, isLoading, isError, refetch } = useRendicion(rendicionId);
    const rendicionInfo = useRendicionInfo(rendicionId);
    const { isOpen, selectedAxis, openModal, closeModal } = useQuestionsModal();

    const handleBackClick = () => navigate('/', { replace: true });

    if (isLoading) {
        return (
            <section className="w-full py-20 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="flex flex-col items-center justify-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Loader size="lg" classes={{
                            container: "mb-6!"
                        }} />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Cargando preguntas...
                        </h3>
                        <p className="text-gray-600 text-center max-w-md">
                            Obteniendo las preguntas seleccionadas para esta rendición de cuentas.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }
    if (isError || !rendicionData) {
        return (
            <section className="w-full py-20 bg-gray-50 min-h-screen">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-8">
                            <HiInformationCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Error al cargar preguntas
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                            No se pudieron cargar las preguntas para esta rendición.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => refetch()} variant="primary">
                                Reintentar
                            </Button>
                            <Button onClick={handleBackClick} variant="outline">
                                Volver al inicio
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="w-full py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Button
                            onClick={handleBackClick}
                            variant="outline"
                            className="flex items-center gap-2"
                            classes={{
                                content: "flex items-center gap-2"
                            }}
                        >
                            <HiArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Button>
                    </motion.div>
                    <motion.header
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-1 bg-primary-dark rounded-full mb-6"></div>
                        <h1 className="text-4xl lg:text-5xl font-bold font-titles text-gray-900 mb-6">
                            {rendicionInfo.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
                            {rendicionInfo.date && (
                                <div className="flex items-center gap-2">
                                    <HiCalendar className="w-5 h-5 text-primary-dark" />
                                    <span className="font-medium">{formatDateWithWeekday(rendicionInfo.date)}</span>
                                </div>
                            )}
                            {rendicionInfo.time && (
                                <div className="flex items-center gap-2">
                                    <HiClock className="w-5 h-5 text-primary-dark" />
                                    <span className="font-medium">{formatTime(rendicionInfo.time)}</span>
                                </div>
                            )}
                        </div>
                    </motion.header>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Ejes</h3>
                            <p className="text-2xl font-bold text-primary-dark">{rendicionData.axes.length}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Total de Preguntas</h3>
                            <p className="text-2xl font-bold text-primary-dark">{rendicionData.totalQuestions}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border">
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Ejes con Preguntas</h3>
                            <p className="text-2xl font-bold text-primary-dark">
                                {rendicionData.axes.filter(axis => axis.preguntas.length > 0).length}
                            </p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Ejes Temáticos
                        </h2>
                        <p className="text-gray-600">
                            Selecciona un eje para ver las preguntas y respuestas correspondientes.
                        </p>
                    </motion.div>
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-primary-dark text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-r border-blue-600">
                                            Eje Temático
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">
                                            Preguntas
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rendicionData.axes.map((axis, index) => (
                                        <RendicionAxisRow
                                            key={axis.id}
                                            axis={axis}
                                            index={index}
                                            isEven={index % 2 === 0}
                                            onViewQuestions={openModal}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                    <motion.div
                        className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="flex items-start space-x-3">
                            <HiInformationCircle className="h-5 w-5 text-primary-dark mt-1 shrink-0" />
                            <div>
                                <h3 className="font-medium text-primary-dark mb-1">
                                    Información Importante
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Durante la audiencia pública, cada eje será presentado con detalle y se responderán
                                    las preguntas de la ciudadanía. Tu participación es fundamental para el desarrollo
                                    de nuestra comunidad.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            <QuestionsModal
                isOpen={isOpen}
                onClose={closeModal}
                axis={selectedAxis}
            />
        </>
    );
}

export { RendicionDetail };