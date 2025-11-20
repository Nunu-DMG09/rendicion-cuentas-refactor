import type { Slide } from "../types/slide";

type Props = {
  slides: Slide[];           
  index: number;              
  withTransition?: boolean;
  duration?: number;          // ms
  onTransitionEnd?: () => void;
};

export default function CarouselTrack({
  slides,
  index,
  withTransition = true,
  duration = 600,
  onTransitionEnd,
}: Props) {
  const slideCount = slides.length;
  const transform = `translateX(-${index * 100}vw)`;

  return (
    <div
      className="absolute inset-0 flex h-full"
      style={{
        width: `${slideCount * 100}vw`,
        transform,
        transition: withTransition ? `transform ${duration}ms ease-out` : "none",
        willChange: "transform",
        backgroundColor: "#f3f4f6",
      }}
      onTransitionEnd={onTransitionEnd}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          role="group"
          aria-roledescription="slide"
          aria-label={s.alt ?? `Slide ${i}`}
          className="relative flex-shrink-0 h-full"
          style={{
            width: `100vw`,
            backgroundImage: `url("${s.src}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f3f4f6",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
}