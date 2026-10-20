'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Children,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

/*
 * Horizontal carousel built on native scroll-snap: product rails, the
 * gallery on phones, lookbooks.
 *
 *   <Carousel label="New arrivals" slideClassName="basis-4/5 sm:basis-1/2 lg:basis-1/4">
 *     {products.map((p) => <ProductCard key={p.id} product={p} />)}
 *   </Carousel>
 *
 * - Touch: native swipe with momentum and snapping (the browser does it).
 * - Mouse: drag to scroll (snap is paused while dragging, then snaps).
 * - Keyboard: the track is focusable; ←/→ go to the previous/next slide.
 *   Prev/next buttons and dots work too.
 * - ARIA carousel pattern: a region with aria-roledescription="carousel",
 *   each slide a group labelled "3 of 8". No autoplay.
 * - The active slide is tracked with IntersectionObserver: state changes
 *   only when the slide changes, never on every scroll frame.
 * - Trackpad horizontal scrolling passes through Lenis (it only smooths
 *   vertical wheel movement).
 */

export interface CarouselProps {
  children: ReactNode;
  /** Accessible name, e.g. "New arrivals". */
  label: string;
  /** Width of each slide (flex-basis classes). Default: full width. */
  slideClassName?: string;
  /** Gap between slides (Tailwind gap class). */
  gapClassName?: string;
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  children,
  label,
  slideClassName = 'basis-full',
  gapClassName = 'gap-4',
  showDots = true,
  className,
}: CarouselProps) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(slides.length <= 1);

  // Which slides are (mostly) visible → active index, start/end state.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const visible = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) visible.add(index);
          else visible.delete(index);
        }
        if (visible.size === 0) return;
        const first = Math.min(...visible);
        setActive(first);
        setAtStart(visible.has(0));
        setAtEnd(visible.has(slides.length - 1));
      },
      { root: track, threshold: 0.6 },
    );
    track
      .querySelectorAll<HTMLElement>('[data-index]')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const target = track?.querySelector<HTMLElement>(
      `[data-index="${Math.max(0, Math.min(slides.length - 1, index))}"]`,
    );
    if (!track || !target) return;
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };

  // ---- mouse drag (touch already swipes natively)
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const track = trackRef.current!;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = event.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      const track = trackRef.current!;
      track.setPointerCapture(event.pointerId);
      track.dataset.dragging = 'true'; // pauses snapping (CSS below)
    }
    if (d.moved) trackRef.current!.scrollLeft = d.startScroll - dx;
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    const track = trackRef.current!;
    if (d.moved) {
      delete track.dataset.dragging;
      // Snap to the nearest slide now that snapping is back on.
      const slideEls = [...track.querySelectorAll<HTMLElement>('[data-index]')];
      const nearest = slideEls.reduce((best, el) =>
        Math.abs(el.offsetLeft - track.offsetLeft - track.scrollLeft) <
        Math.abs(best.offsetLeft - track.offsetLeft - track.scrollLeft)
          ? el
          : best,
      );
      goTo(Number(nearest.dataset.index));
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      // min-w-0: in a grid/flex parent, don't grow to the scroll content's
      // width (that would overflow the page instead of scrolling the track).
      className={cn('relative w-full min-w-0', className)}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label={`${label}, use arrow keys to scroll`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // A drag must not count as a click on a link inside a slide.
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className={cn(
          'flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain rounded-sm data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none data-[dragging=true]:select-none [&::-webkit-scrollbar]:hidden',
          gapClassName,
        )}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            data-index={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn('min-w-0 shrink-0 snap-start', slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        {showDots && slides.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => goTo(i)}
                className="grid size-6 place-items-center rounded-full"
              >
                <span
                  className={cn(
                    'size-2 rounded-full transition-[background-color,transform] duration-base',
                    i === active ? 'scale-125 bg-fg' : 'bg-border-strong',
                  )}
                />
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <IconButton
            aria-label="Previous slide"
            variant="outline"
            size="sm"
            disabled={atStart}
            onClick={() => goTo(active - 1)}
          >
            <Icon icon={ChevronLeft} size="sm" />
          </IconButton>
          <IconButton
            aria-label="Next slide"
            variant="outline"
            size="sm"
            disabled={atEnd}
            onClick={() => goTo(active + 1)}
          >
            <Icon icon={ChevronRight} size="sm" />
          </IconButton>
        </div>
      </div>
    </section>
  );
}
