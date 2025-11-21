import type { QuestionsModalProps } from '../types/rendicion'

export default function QuestionsModal({ isOpen, onClose, axis }: QuestionsModalProps) {
    if (!isOpen || !axis) return null

    const hasQuestions = axis.questions && axis.questions.length > 0

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-[#002f59] text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        Preguntas Eje: {axis.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors duration-200"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!hasQuestions ? (
                        /* No Questions Found */
                        <div className="text-center py-12">
                            <div className=" w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className=" h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No se encontraron preguntas para este eje
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Aún no hay preguntas ciudadanas registradas para "{axis.name}".
                            </p>
                            <button
                                onClick={onClose}
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#002f59] text-white rounded-lg hover:bg-[#003366] transition-colors duration-200"
                            >
                                Entendido
                            </button>
                        </div>
                    ) : (
                        /* Questions List */
                        <div className="max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                {axis.questions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className="border border-gray-200 rounded-xl p-6 hover:border-[#002f59]/20 hover:bg-gray-50/50 transition-all duration-200"
                                    >
                                        {/* Question Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#002f59] rounded-full flex items-center justify-center text-white font-semibold">
                                                    {question.personName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {question.personName}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(question.createdAt).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>

                                        {/* Question Content */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-100">
                                            <p className="text-gray-800 leading-relaxed">
                                                {question.question}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {hasQuestions && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Total: {axis.questions.length} pregunta{axis.questions.length !== 1 ? 's' : ''}
                        </p>
                        <button
                            onClick={onClose}
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#002f59] text-white rounded-lg hover:bg-[#003366] transition-colors duration-200"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}