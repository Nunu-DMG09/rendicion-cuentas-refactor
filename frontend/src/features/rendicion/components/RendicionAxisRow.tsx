import type { RendicionAxis } from '../types/rendicion'

type Props = {
    axis: RendicionAxis
    index: number
    isEven: boolean
    onViewQuestions: (axis: RendicionAxis) => void
}

export default function RendicionAxisRow({ axis, index, isEven, onViewQuestions }: Props) {
    return (
        <tr className={`${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200`}>
            {/* Nombre */}
            <td className="px-6 py-6 text-sm font-medium text-gray-900 border-r border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#002f59] rounded-full flex-shrink-0"></div>
                    <span>{axis.name}</span>
                </div>
            </td>

            {/* Descripción */}
            <td className="px-6 py-6 text-sm text-gray-600 border-r border-gray-200 max-w-md">
                <p className="leading-relaxed">{axis.description}</p>
            </td>

            {/* Ver Preguntas */}
            <td className="px-6 py-6 text-center border-gray-200">
                <button
                    className="
            cursor-pointer inline-flex items-center gap-2 px-4 py-2 
            bg-[#002f59] text-white text-sm font-medium rounded-lg
            hover:bg-[#003366] focus:ring-2 focus:ring-[#002f59] focus:ring-offset-2
            transform hover:scale-105 transition-all duration-200
            shadow-sm hover:shadow-md
          "
                    onClick={() => onViewQuestions(axis)}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver Preguntas
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                        {axis.questionsCount}
                    </span>
                </button>
            </td>
        </tr>
    )
}