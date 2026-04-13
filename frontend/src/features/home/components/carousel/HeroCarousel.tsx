import React, { useEffect, useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const DEFAULT_IMAGES = [
    { id: 1, src: "/banners/muni-banner-1.jpeg", alt: "Banner principal" },
    { id: 2, src: "/banners/muni-banner-2.jpeg", alt: "Actividad municipal 1" },
    { id: 3, src: "/banners/muni-banner-3.jpeg", alt: "Actividad municipal 2" },
];

type Props = {
    className?: string;
};

export default function HeroCarousel({ className = "" }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev === DEFAULT_IMAGES.length - 1 ? 0 : prev + 1));
    }, []);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? DEFAULT_IMAGES.length - 1 : prev - 1));
    }, []);

    const goTo = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = window.setInterval(next, 5000);
        }
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, [isPaused, next]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        el.addEventListener("keydown", onKey);
        return () => el.removeEventListener("keydown", onKey);
    }, [next, prev]);

    const touchStartX = useRef<number | null>(null);
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchStartX.current - touchEndX;
        
        if (Math.abs(distance) > 40) {
            if (distance > 0) next();
            else prev();
        }
        touchStartX.current = null;
    };

    return (
        <section className="w-full">
            <div
                ref={containerRef}
                tabIndex={0}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className={`relative w-screen left-1/2 -translate-x-1/2 overflow-hidden bg-gray-50 focus:outline-none group ${className}`}
                aria-roledescription="carousel"
                aria-label="Galería principal"
            >
                <div className="relative w-full flex items-center justify-center">
                    {DEFAULT_IMAGES.map((img, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <img
                                key={img.id}
                                src={img.src}
                                alt={img.alt}
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                                className={`
                                    w-full h-auto object-cover transition-opacity duration-700 ease-in-out
                                    ${isActive ? "relative opacity-100 z-10 block" : "absolute top-0 left-0 opacity-0 z-0 pointer-events-none hidden sm:block"}
                                `}
                            />
                        );
                    })}
                </div>
                <button
                    onClick={prev}
                    aria-label="Anterior"
                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <HiChevronLeft className="w-6 h-6 text-primary-dark" />
                </button>
                <button
                    onClick={next}
                    aria-label="Siguiente"
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 shadow hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <HiChevronRight className="w-6 h-6 text-primary-dark" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {DEFAULT_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Ir a la diapositiva ${i + 1}`}
                            className={`w-3 md:w-4 h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                currentIndex === i
                                    ? "bg-primary-dark w-6 md:w-8"
                                    : "bg-white/80 hover:bg-white"
                            } shadow`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}