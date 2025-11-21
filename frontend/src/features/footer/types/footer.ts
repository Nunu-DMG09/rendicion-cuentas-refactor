export type SocialLink = {
  id: string
  platform: string
  url: string
  username: string
  icon: React.ReactNode
}

export type ContactInfo = {
  address: string
  district: string
  province: string
  country: string
  phone?: string
  email?: string
}

export type Schedule = {
  title: string
  days: string
  hours: string
}

export type FooterData = {
  socialLinks: SocialLink[]
  contactInfo: ContactInfo
  schedules: Schedule[]
  companyName: string
  year: number
  additionalLinks: { name: string; url: string }[]
}