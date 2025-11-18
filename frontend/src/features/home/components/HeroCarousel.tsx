import React, { useEffect } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import banner1 from '/banners/bannerstatic.png'
import banner2 from '/banners/bannerstatic.png'
import banner3 from '/banners/bannerstatic.png'
import useCarousel from '../hooks/useCarousel'

type Props = {
  autoplay?: boolean
  intervalMs?: number
}

const IMAGES: { src: string; alt: string }[] = [
  { src: banner1, alt: 'Banner institucional' },
  { src: banner2, alt: 'Plaza principal' },
  { src: banner3, alt: 'Actividad municipal' },
]

export default function HeroCarousel({ autoplay = true, intervalMs = 5000 }: Props) {
  const { index, prev, next, goTo, preload, stop, start, isPreloaded } = useCarousel({
    length: IMAGES.length,
    autoplay,
    intervalMs,
  })

  // preload to avoid white flash between slides
  useEffect(() => {
    preload(IMAGES.map((i) => i.src))
  }, [preload])

  return (
    <section
      className="w-screen relative left-1/2 -translate-x-1/2 mt-0 sm:-mt-2 lg:-mt-4"
      onMouseEnter={() => stop()}
      onMouseLeave={() => start()}
      aria-roledescription="carousel"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <div className="relative h-56 sm:h-80 lg:h-[520px]">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out will-change-opacity ${
                i === index ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'
              }`}
              aria-hidden={i !== index}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-contain object-center block mx-auto"
                decoding="async"
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-b from-black/6 via-transparent to-black/10 pointer-events-none z-10" />

          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 rounded-full p-2 sm:p-3 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white z-40"
            type="button"
          >
            <IoChevronBack className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 rounded-full p-2 sm:p-3 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white z-40"
            type="button"
          >
            <IoChevronForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-40">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              className={`w-3 md:w-4 h-3 md:h-4 rounded-full transition-transform ${
                i === index ? 'bg-white scale-110' : 'bg-white/60'
              }`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  )
}