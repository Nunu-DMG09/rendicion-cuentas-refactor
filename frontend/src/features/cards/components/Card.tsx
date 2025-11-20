import React from 'react'
import type { CardData } from '../types/card'

type Props = {
    data: CardData
}

export default function Card({ data }: Props) {
    return (
        <article
            role="article"
            aria-labelledby={`card-title-${data.id}`}
            className="cursor-pointer group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transform-gpu hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100"
        >

            {/* Top accent bar */}
            <div className="h-1 bg-[#002f59]"></div>

            <div className="p-8 lg:p-10 ">
                {/* Icon container */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {data.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                    <h3 id={`card-title-${data.id}`} className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#002f59] transition-colors duration-300">
                        {data.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6 text-base lg:text-lg">
                        {data.description}
                    </p>

                    {/* CTA or additional info */}
                    <div className="pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                            {data.cta || 'Conoce más detalles'}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    )
}