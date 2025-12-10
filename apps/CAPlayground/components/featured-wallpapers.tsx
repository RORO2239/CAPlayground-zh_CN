"use client"

import React from "react"

export function FeaturedWallpapers() {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const rafRef = React.useRef<number | null>(null)

  const recalc = React.useCallback(() => {
    const container = containerRef.current
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!container || !track || !viewport) return

    const viewportW = viewport.clientWidth
    const viewportH = window.innerHeight
    const totalScrollableX = Math.max(0, track.scrollWidth - viewportW)

    container.style.height = `${viewportH + totalScrollableX}px`
  }, [])

  const onScroll = React.useCallback(() => {
    const container = containerRef.current
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!container || !track || !viewport) return

    const rect = container.getBoundingClientRect()
    const containerTop = window.scrollY + rect.top
    const viewportW = viewport.clientWidth
    const totalScrollableX = Math.max(0, track.scrollWidth - viewportW)

    const raw = window.scrollY - containerTop
    const progress = totalScrollableX === 0 ? 0 : Math.min(Math.max(raw / totalScrollableX, 0), 1)
    const x = -progress * totalScrollableX

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      track.style.transform = `translate3d(${x}px, 0, 0)`
    })
  }, [])

  React.useEffect(() => {
    recalc()
    onScroll()

    const track = trackRef.current
    const ro = track ? new ResizeObserver(() => recalc()) : null
    if (track && ro) ro.observe(track)

    const videos = track?.querySelectorAll("video") ?? []
    const onMeta = () => recalc()
    videos.forEach((v) => v.addEventListener("loadedmetadata", onMeta))

    window.addEventListener("resize", recalc)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("resize", recalc)
      window.removeEventListener("scroll", onScroll)
      videos.forEach((v) => v.removeEventListener("loadedmetadata", onMeta))
      if (ro && track) ro.unobserve(track)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [recalc, onScroll])

  return (
    <section className="relative bg-background">
      <div ref={containerRef} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="h-full flex items-center">
            <div
              ref={viewportRef}
              className="w-[92vw] sm:w-[88vw] md:w-[84vw] lg:w-[80vw] max-w-[1600px] mx-auto rounded-[2rem] border-8 border-border/60 dark:border-white/20 overflow-hidden shadow-xl"
            >
              <div
                ref={trackRef}
                className="will-change-transform flex gap-0"
                style={{ transform: "translate3d(0,0,0)" }}
              >
              {[
                "/featured-1.mp4",
                "/featured-2.mp4",
                "/featured-3.mp4",
                "/featured-4.mp4",
                "/featured-5.mp4",
                "/featured-6.mp4",
              ].map((src, idx) => (
                <div key={src} className="flex-shrink-0 w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[33vw] max-w-[560px]">
                  <video
                    src={src}
                    className="block w-full h-auto select-none pointer-events-none"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={`Featured wallpaper ${idx + 1}`}
                  />
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
