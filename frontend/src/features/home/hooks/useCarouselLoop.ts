import { useEffect, useMemo, useRef, useState } from "react";
import type { Slide } from "../types/slide";

type Options = {
  autoplay?: boolean;
  interval?: number;
};

export default function useCarouselLoop(realSlides: Slide[], options: Options = {}) {
  const { autoplay = true, interval = 5000 } = options;
  const n = realSlides.length;

  const augmented = useMemo<Slide[]>(() => {
    if (n === 0) return [];
    const first = realSlides[0];
    const last = realSlides[n - 1];
    return [last, ...realSlides, first];
  }, [realSlides, n]);

  const [position, setPosition] = useState<number>(1); 
  const [withTransition, setWithTransition] = useState<boolean>(true);

  // preload 
  useEffect(() => {
    realSlides.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, [realSlides]);

  // autoplay
  const autoplayRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!autoplay || n <= 1) return;
    const start = () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
      autoplayRef.current = window.setInterval(() => {
        if (!isPausedRef.current) {
          setWithTransition(true);
          setPosition((p) => p + 1);
        }
      }, interval);
    };
    start();
    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [autoplay, interval, n]);

  const next = () => {
    if (n <= 1) return;
    setWithTransition(true);
    setPosition((p) => p + 1);
  };

  const prev = () => {
    if (n <= 1) return;
    setWithTransition(true);
    setPosition((p) => p - 1);
  };

  const goTo = (realIndex: number) => {
    if (n <= 0) return;
    setWithTransition(true);
    setPosition(realIndex + 1);
  };

  const onTransitionEnd = () => {
    if (position === augmented.length - 1) {
    setWithTransition(false);
    setPosition(1);
    requestAnimationFrame(() => requestAnimationFrame(() => setWithTransition(true)));
    return;
    }
    if (position === 0) {
    setWithTransition(false);
    setPosition(n);
    requestAnimationFrame(() => requestAnimationFrame(() => setWithTransition(true)));
    return;
    }
  };

  const setPaused = (v: boolean) => {
    isPausedRef.current = v;
  };

  return {
    augmented,         
    realSlides,         
    position,           
    withTransition,
    next,
    prev,
    goTo,
    onTransitionEnd,
    setPaused,
  };
}