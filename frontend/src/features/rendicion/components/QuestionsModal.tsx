import { FaQuestionCircle } from "react-icons/fa";
import type { RendicionAxis } from "../types/rendicion";
import { formatDate } from "@/shared/utils";

interface QuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    axis: RendicionAxis | null;
}
export default function QuestionsModal({ isOpen, onClose, axis }: QuestionsModalProps) {
    if (!isOpen || !axis) return null

    const hasQuestions = axis.preguntas && axis.preguntas.length > 0

    return (
        <article className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <header className="bg-primary-dark text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        Preguntas Eje: {axis.tematica}
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors duration-200"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                <main className="p-6">
                    {!hasQuestions ? (
                        <div className="text-center py-12">
                            <div className=" size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaQuestionCircle className="size-10 text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No se encontraron preguntas para este eje
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Aún no hay preguntas ciudadanas registradas para "{axis.tematica}".
                            </p>
                            <button
                                onClick={onClose}
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors duration-200"
                            >
                                Entendido
                            </button>
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                {axis.preguntas.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className="border border-gray-200 rounded-xl p-6 hover:border-primary-dark/20 hover:bg-gray-50/50 transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                                                    {question.usuario.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {question.usuario}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(question.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                                            <p className="text-gray-800 leading-relaxed">
                                                {question.contenido}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
                {hasQuestions && (
                    <footer className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Total: {axis.preguntas.length} pregunta{axis.preguntas.length !== 1 ? 's' : ''}
                        </p>
                        <button
                            onClick={onClose}
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition-colors duration-200"
                        >
                            Cerrar
                        </button>
                    </footer>
                )}
            </div>
        </article>
    )
}