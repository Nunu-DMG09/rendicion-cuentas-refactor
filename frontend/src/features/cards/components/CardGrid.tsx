import Card from './Card'
import type { CardData } from '../types/card'

const cards: CardData[] = [
    {
        id: 'participacion',
        title: 'Participación Ciudadana',
        description:
            'Creemos en el poder de la ciudadanía informada. Participa activamente en nuestras Audiencias Públicas, donde cada voz cuenta y cada opinión contribuye al desarrollo de nuestra comunidad.',
        cta: 'Únete a la conversación',
        icon: (
            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        id: 'transparencia',
        title: 'Transparencia Total',
        description:
            'La transparencia no es solo una obligación, es nuestro compromiso. Accede a información detallada sobre cómo utilizamos los recursos públicos, los proyectos ejecutados, metas alcanzadas.',
        cta: 'Explora la información',
        icon: (
            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
    },
    {
        id: 'informes',
        title: 'Informes Completos',
        description:
            'Documentación completa y descargable sobre todos los aspectos de nuestra gestión municipal. Desde informes financieros hasta reportes de proyectos sociales.',
        cta: 'Descarga documentos',
        icon: (
            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,9 8,9" />
            </svg>
        ),
    },
]

export default function CardGrid() {
    return (
        <section className="w-full bg-linear-to-b from-gray-50 via-white to-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <header className="mb-16 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-titles">
                        Conferencia de
                        <span className="text-gray-900 bg-clip-text"> Rendición de Cuentas</span>
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-body">
                        La Municipalidad Distrital de José Leonardo Ortiz te invita a nuestras Audiencias Públicas de Rendición de Cuentas.
                        <span className="font-semibold text-gray-800"> Un espacio de diálogo abierto donde la transparencia y la participación ciudadana son protagonistas.</span>
                    </p>
                    <div className="mt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 rounded-full text-primary text-sm font-medium">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Próxima sesión: Diciembre 2025
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                    {cards.map((card) => (
                        <div key={card.id} className="flex">
                            <Card data={card} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export { CardGrid }