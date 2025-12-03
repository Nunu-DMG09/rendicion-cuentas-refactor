import SocialLink from './SocialLink'
import ContactInfo from './ContactInfo'
import ScheduleInfo from './ScheduleInfo'
import { useFooter } from './hooks/useFooter'

export default function Footer() {
    const footerData = useFooter()

    return (
        <footer className="w-full bg-primary-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <img src="/jlo.png" alt="Logo Municipalidad" className="w-20 h-20 object-contain" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-base">Municipalidad Distrital</h2>
                                <p className="text-blue-200 text-sm">José Leonardo Ortiz</p>
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm leading-relaxed">
                            Trabajamos por el desarrollo y bienestar de nuestra comunidad.
                            Transparencia, participación ciudadana y servicio público de calidad.
                        </p>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-semibold text-white">Redes Sociales</h3>
                        <div className="space-y-4">
                            {footerData.socialLinks.map((social) => (
                                <SocialLink key={social.id} social={social} />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <ContactInfo contact={footerData.contactInfo} />
                    </div>
                    <div className="lg:col-span-1">
                        <ScheduleInfo schedules={footerData.schedules} />
                    </div>
                </div>
            </div>
            <div className="border-t border-blue-700 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-blue-200 text-sm">
                            © {footerData.year} {footerData.companyName}. Todos los derechos reservados.
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-blue-200">
                            <span>Rendición de Cuentas</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }