/* eslint-disable @next/next/no-img-element -- Office supplies validated, processed WebP renditions. */
"use client";
// Adapted from Ochiga-website app/components/StoryCarousel.tsx (8b2024e),
// the reusable implementation of HomeHeroCarousel. Corporate source is unchanged.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import Link from "next/link";
const DEFAULT_AUTOPLAY_MS = 8000;
const SWIPE_THRESHOLD_PX = 48;
export type StorySlide = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  durationMs: number;
  image?: { src: string; alt: string };
};
export default function StoryCarousel({
  slides,
  ariaLabel,
  sectionId = "story-stage",
  sectionClassName = "hw-story",
}: {
  slides: StorySlide[];
  ariaLabel: string;
  sectionId?: string;
  sectionClassName?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(slides.length > 1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pausedByRef = useRef<"user" | "system" | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const startedAtRef = useRef<number | null>(null);
  const autoplayMs = slides[activeIndex]?.durationMs || DEFAULT_AUTOPLAY_MS;
  const panelId = `${sectionId}-panel`;
  const multiSlide = slides.length > 1;

  useEffect(() => {
    if (!multiSlide) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      setReducedMotion(query.matches);
      if (query.matches) {
        pausedByRef.current = null;
        setIsPlaying(false);
      }
    };
    applyPreference();
    query.addEventListener("change", applyPreference);
    return () => query.removeEventListener("change", applyPreference);
  }, [multiSlide]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // A fresh slide always starts its progress at zero — whether it became
  // active via autoplay advancing or via manual navigation.
  useEffect(() => {
    elapsedRef.current = 0;
  }, [activeIndex]);

  // Schedules the next advance for whatever time remains out of the full
  // autoplayMs, so pausing and resuming continues the same slide's
  // countdown instead of restarting it (matches the progress-pill fill,
  // which — via animation-play-state below — resumes from the same point
  // for the same reason).
  useEffect(() => {
    if (!multiSlide || !isPlaying) {
      if (startedAtRef.current !== null) {
        elapsedRef.current += Date.now() - startedAtRef.current;
        startedAtRef.current = null;
      }
      return;
    }
    startedAtRef.current = Date.now();
    const remaining = Math.max(autoplayMs - elapsedRef.current, 0);
    const timer = setTimeout(goNext, remaining);
    return () => {
      clearTimeout(timer);
      if (startedAtRef.current !== null) {
        elapsedRef.current += Date.now() - startedAtRef.current;
        startedAtRef.current = null;
      }
    };
  }, [multiSlide, isPlaying, activeIndex, goNext, autoplayMs]);

  useEffect(() => {
    if (!multiSlide) return;
    const handleVisibility = () => {
      if (document.hidden) {
        if (isPlaying) {
          pausedByRef.current = "system";
          setIsPlaying(false);
        }
      } else if (pausedByRef.current === "system") {
        pausedByRef.current = null;
        setIsPlaying(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [multiSlide, isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      pausedByRef.current = "user";
      setIsPlaying(false);
    } else {
      pausedByRef.current = null;
      setIsPlaying(true);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (!multiSlide) return;
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (!multiSlide) return;
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const delta = endX - startX;
    const dy =
      (event.changedTouches[0]?.clientY ?? 0) - (touchStartYRef.current ?? 0);
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX || Math.abs(delta) <= Math.abs(dy))
      return;
    if (delta < 0) goNext();
    else goPrev();
  };

  const active = slides[activeIndex];
  if (!active) return null;
  return (
    <section
      id={sectionId}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      className={sectionClassName}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hw-story-background" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            className={`hw-story-image ${i === activeIndex ? "is-active" : ""}`}
          >
            {slide.image && (
              <img
                src={slide.image.src}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
              />
            )}
          </div>
        ))}
      </div>
      <div
        className="hw-story-content"
        id={panelId}
        role="group"
        aria-label={`Story ${activeIndex + 1} of ${slides.length}`}
      >
        <p className="hw-eyebrow">{active.eyebrow}</p>
        <h1>{active.title}</h1>
        <p className="hw-story-description">{active.description}</p>
        <Link className="hw-primary" href={active.ctaHref}>
          {active.ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
      {multiSlide && (
        <>
          <button
            type="button"
            className="hw-story-prev"
            aria-label="Previous story"
            onClick={goPrev}
          >
            ‹
          </button>
          <button
            type="button"
            className="hw-story-next"
            aria-label="Next story"
            onClick={goNext}
          >
            ›
          </button>
          <div
            className="hw-story-controls"
            role="group"
            aria-label="Story playback"
          >
            <button
              type="button"
              className="hw-play"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M5 3v10M11 3v10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="m5 3 8 5-8 5z" fill="currentColor" />
                </svg>
              )}
            </button>
            {slides.map((slide, i) => (
              <button
                type="button"
                key={slide.key}
                className="hw-segment"
                aria-label={`Show story ${i + 1}: ${slide.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                aria-controls={panelId}
                onClick={() => goTo(i)}
              >
                <span className="hw-segment-track">
                  {i === activeIndex && (
                    <span
                      key={activeIndex}
                      className="hw-progress"
                      style={{
                        animationDuration: `${autoplayMs}ms`,
                        animationPlayState: isPlaying ? "running" : "paused",
                        ...(reducedMotion
                          ? { animation: "none", width: "100%" }
                          : {}),
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
