import type { SocialLink as SocialLinkType } from '../types/footer'

type Props = {
  social: SocialLinkType
}

export default function SocialLink({ social }: Props) {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center space-x-3 text-blue-100 hover:text-white transition-colors duration-300"
      aria-label={`Síguenos en ${social.platform}`}
    >
      <div className="flex items-center justify-center w-10 h-10 transition-colors duration-300">
        {social.icon}
      </div>
      <div className="">
        <p className="text-sm font-medium">{social.platform}</p>
        <p className="text-xs opacity-80">{social.username}</p>
      </div>
    </a>
  )
}