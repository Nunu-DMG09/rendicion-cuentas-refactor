import { useEffect, useRef, useState, useCallback } from 'react'

type UseCarouselProps = {
  length: number
  autoplay?: boolean
  intervalMs?: number
}

export default function useCarousel({ length, autoplay = true, intervalMs = 5000 }: UseCarouselProps) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef<number | null>(null)
  const preloadedRef = useRef<boolean[]>(new Array(length).fill(false))

  const start = useCallback(() => {
    if (!autoplay) return
    stop()
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % length)
    }, intervalMs)
  }, [autoplay, intervalMs, length])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const goTo = useCallback(
    (i: number) => {
      setIndex(i % length)
      if (autoplay) start()
    },
    [autoplay, length, start],
  )

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % length)
    if (autoplay) start()
  }, [autoplay, length, start])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + length) % length)
    if (autoplay) start()
  }, [autoplay, length, start])

  // preload images (call with an array of srcs by the component)
  const preload = useCallback((srcs: string[]) => {
    srcs.forEach((src, i) => {
      if (preloadedRef.current[i]) return
      const img = new Image()
      img.src = src
      img.onload = () => {
        preloadedRef.current[i] = true
      }
    })
  }, [])

  useEffect(() => {
    if (autoplay) start()
    return () => stop()
  }, [autoplay, start, stop])

  return {
    index,
    prev,
    next,
    goTo,
    start,
    stop,
    preload,
    isPreloaded: preloadedRef.current,
  }
}