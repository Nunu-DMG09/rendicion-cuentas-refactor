import { useEffect, useMemo } from "react";
import type { Slide } from "../types/slide";

export default function useSlides(count = 3, src = "/banners/bannerstatic.png") {
  const slides = useMemo<Slide[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        src,
        alt: `Banner Municipalidad ${i + 1}`,
      })),
    [count, src]
  );

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, [slides]);

  return slides;
}