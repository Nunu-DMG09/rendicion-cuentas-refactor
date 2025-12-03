import { motion } from 'motion/react'
import Card from './Card'
import type { CardData } from '../../types/card'
import { FiUsers } from 'react-icons/fi'
import { AiOutlineEye } from 'react-icons/ai'
import { HiOutlineDocumentText } from 'react-icons/hi2'

const cards: CardData[] = [
    {
        id: 'participacion',
        title: 'Participación Ciudadana',
        description:
            'Creemos en el poder de la ciudadanía informada. Participa activamente en nuestras Audiencias Públicas, donde cada voz cuenta y cada opinión contribuye al desarrollo de nuestra comunidad.',
        cta: 'Únete a la conversación',
        icon: <FiUsers className='size-12' />,
    },
    {
        id: 'transparencia',
        title: 'Transparencia Total',
        description:
            'La transparencia no es solo una obligación, es nuestro compromiso. Accede a información detallada sobre cómo utilizamos los recursos públicos, los proyectos ejecutados, metas alcanzadas.',
        cta: 'Explora la información',
        icon: <AiOutlineEye className='size-12' />,
    },
    {
        id: 'informes',
        title: 'Informes Completos',
        description:
            'Documentación completa y descargable sobre todos los aspectos de nuestra gestión municipal. Desde informes financieros hasta reportes de proyectos sociales.',
        cta: 'Descarga documentos',
        icon: <HiOutlineDocumentText className='size-12' />,
    },
]

export default function CardGrid() {
    return (
        <section className="w-full bg-linear-to-b from-gray-50 via-white to-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <motion.header
                    className="mb-16 text-center"
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-titles">
                        Conferencia de
                        <span className="text-gray-900 bg-clip-text"> Rendición de Cuentas</span>
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-body">
                        La Municipalidad Distrital de José Leonardo Ortiz te invita a nuestras Audiencias Públicas de Rendición de Cuentas.
                        <span className="font-semibold text-gray-800"> Un espacio de diálogo abierto donde la transparencia y la participación ciudadana son protagonistas.</span>
                    </p>
                </motion.header>
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
                    whileInView="visible"
                    initial="hidden"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.2,
                            },
                        },
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {cards.map((card) => (
                        <motion.div
                            key={card.id}
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <Card data={card} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export { CardGrid }