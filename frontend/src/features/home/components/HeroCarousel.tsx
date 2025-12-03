import React, { useEffect, useRef } from "react";
import useSlides from "../hooks/useSlides";
import useCarouselLoop from "../hooks/useCarouselLoop";
import CarouselTrack from "./CarouselTrack";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import type { Slide } from "../types/slide";

type Props = {
	slides?: Slide[];
	className?: string;
	height?: string;
};

export default function HeroCarousel({
	slides,
	className = "",
	height = "h-[720px] md:h-[640px] lg:h-[700px]",
}: Props) {
	const defaultSlides = useSlides(3, "/banners/bannerstatic.png");
	const realSlides = slides && slides.length > 0 ? slides : defaultSlides;

	const {
		augmented,
		position,
		withTransition,
		next,
		prev,
		goTo,
		onTransitionEnd,
		setPaused,
	} = useCarouselLoop(realSlides, { autoplay: true, interval: 5000 });

	const containerRef = useRef<HTMLDivElement | null>(null);

	const touchStartX = useRef<number | null>(null);
	const touchEndX = useRef<number | null>(null);
	const minSwipeDistance = 40;
	const onTouchStart = (e: React.TouchEvent) => {
		touchEndX.current = null;
		touchStartX.current = e.touches[0].clientX;
	};
	const onTouchMove = (e: React.TouchEvent) => {
		touchEndX.current = e.touches[0].clientX;
	};
	const onTouchEnd = () => {
		if (touchStartX.current === null || touchEndX.current === null) return;
		const distance = touchStartX.current - touchEndX.current;
		if (Math.abs(distance) > minSwipeDistance) {
			if (distance > 0) next();
			else prev();
		}
		touchStartX.current = null;
		touchEndX.current = null;
	};

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

	return (
		<div className="w-full">
			<div
				ref={containerRef}
				tabIndex={0}
				onMouseEnter={() => setPaused(true)}
				onMouseLeave={() => setPaused(false)}
				onFocus={() => setPaused(true)}
				onBlur={() => setPaused(false)}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				className={`relative ${height} cursor-grab w-screen left-1/2 -translate-x-1/2 overflow-hidden ${className} bg-gray-100`}
				aria-roledescription="carousel"
				aria-label="Galería principal"
			>
				{/* Track - componente */}
				<CarouselTrack
					slides={augmented}
					index={position}
					withTransition={withTransition}
					duration={600}
					onTransitionEnd={onTransitionEnd}
				/>

				{/* Controles */}
				{realSlides.length > 1 && (
					<>
						<button
							onClick={prev}
							aria-label="Anterior"
							className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/95 shadow hover:scale-105 transition"
						>
							<HiChevronLeft className="w-6 h-6 text-[#002f59]" />
						</button>
						<button
							onClick={next}
							aria-label="Siguiente"
							className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/95 shadow hover:scale-105 transition"
						>
							<HiChevronRight className="w-6 h-6 text-[#002f59]" />
						</button>
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
							{realSlides.map((_, i) => (
								<button
									key={i}
									onClick={() => goTo(i)}
									aria-label={`Ir a la diapositiva ${i + 1}`}
									className={`w-3 h-3 rounded-full transition-all ${
										position === i + 1
											? "bg-[#002f59] scale-110"
											: "bg-white/80"
									} shadow`}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
