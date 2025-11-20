import { useEffect, useRef, useState } from "react";

type Options = {
  autoplay?: boolean;
  interval?: number;
  preload?: boolean;
};

export default function useCarousel(length: number, options: Options = {}) {
  const { autoplay = true, interval = 5000, preload = true } = options;
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay || isPaused || length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, interval);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [autoplay, isPaused, interval, length]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const next = () => setIndex((i) => (i + 1) % length);
  const prev = () => setIndex((i) => (i - 1 + length) % length);
  const goTo = (i: number) => setIndex(((i % length) + length) % length);

  useEffect(() => {
    if (!preload) return;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < length; i++) {
      const img = new Image();
      imgs.push(img);
    }
    return () => {
    };
  }, [length, preload]);

  return {
    index,
    setIndex,
    next,
    prev,
    goTo,
    isPaused,
    setIsPaused,
  };
}