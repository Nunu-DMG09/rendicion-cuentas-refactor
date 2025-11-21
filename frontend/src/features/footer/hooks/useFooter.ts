import { useState } from 'react'
import type { FooterData } from '../types/footer'
import { SocialIcons } from '../components/SocialIcons'

export function useFooter(): FooterData {
    const [footerData] = useState<FooterData>({
        socialLinks: [
            {
                id: 'instagram',
                platform: 'Instagram',
                url: 'https://instagram.com/municipalidadjoseleonardoortiz',
                username: '@municipalidadjoseleonardoortiz',
                icon: SocialIcons.instagram
            },
            {
                id: 'facebook',
                platform: 'Facebook',
                url: 'https://www.facebook.com/munijlo',
                username: '@munijlo',
                icon: SocialIcons.facebook
            },
            {
                id: 'tiktok',
                platform: 'TikTok',
                url: 'https://tiktok.com/@muni.jlo',
                username: '@muni.jlo',
                icon: SocialIcons.tiktok
            }
        ],
        contactInfo: {
            address: 'Av. Sáenz Peña N.° 2151',
            district: 'José Leonardo Ortiz',
            province: 'Chiclayo - Lambayeque',
            country: 'Perú',
            //   phone: '+51 074 123456',
            email: 'contacto@munijlo.gob.pe'
        },
        schedules: [
            {
                title: 'Horario de Atención',
                days: 'Lunes a Viernes',
                hours: '8:00 a.m - 4:00 p.m'
            },
            {
                title: 'Mesa de Partes',
                days: 'Lunes a Viernes',
                hours: '8:00 a.m - 4:00 p.m'
            }
        ],
        companyName: 'Municipalidad Distrital de José Leonardo Ortiz',
        year: new Date().getFullYear(),
        additionalLinks: []
    })

    return footerData
}