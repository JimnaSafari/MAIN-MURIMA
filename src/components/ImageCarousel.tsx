// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ImageCarouselProps {
  images: string[];
  title?: string;
  heightClass?: string; // e.g. "h-48"
  loop?: boolean;
}

const ImageCarousel = ({ images, title = "image", heightClass = "h-48", loop = false }: ImageCarouselProps) => {
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const imageArray = images && images.length ? images : [];
  const touchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      if (emblaApi && typeof emblaApi.off === "function") emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi && typeof emblaApi.reInit === "function") emblaApi.reInit();
  }, [imageArray, emblaApi]);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };
  }, []);

  const scheduleHideArrows = (delay = 3000) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = window.setTimeout(() => {
      setShowArrows(false);
      touchTimerRef.current = null;
    }, delay);
  };

  // show arrows only after explicit image interaction (click / touch / keyboard)
  const onImageInteract = (e: React.SyntheticEvent | React.KeyboardEvent) => {
    // if keyboard, only react to Enter or Space
    if ("key" in e) {
      const ke = (e as React.KeyboardEvent).key;
      if (ke !== "Enter" && ke !== " ") return;
    }
    setShowArrows(true);
    scheduleHideArrows();
  };

  const onTouchMove = () => {
    // keep arrows visible while interacting, restart hide timer
    if (showArrows) scheduleHideArrows();
  };

  const onTouchEnd = () => {
    // keep arrows briefly visible so user can tap them
    scheduleHideArrows(2500);
  };

  const onBlurCapture = (e: React.FocusEvent) => {
    const currentTarget = e.currentTarget as HTMLElement;
    window.setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setShowArrows(false);
      }
    }, 0);
  };

  const scrollPrev = () => {
    if (!emblaApi) return;
    const current = emblaApi.selectedScrollSnap();
    const prev = current === 0 ? Math.max(0, imageArray.length - 1) : current - 1;
    emblaApi.scrollTo(prev);
  };

  const scrollNext = () => {
    if (!emblaApi) return;
    const current = emblaApi.selectedScrollSnap();
    const next = current === imageArray.length - 1 ? 0 : current + 1;
    emblaApi.scrollTo(next);
  };

  if (imageArray.length === 0) return null;

  return (
    <div
      className="relative"
      // only reveal arrows after explicit image interaction
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onBlurCapture={onBlurCapture}
    >
      <div className="embla">
        <div className="embla__viewport overflow-hidden" ref={viewportRef}>
          <div className="embla__container flex">
            {imageArray.map((src, i) => (
              <div key={i} className="embla__slide flex-none min-w-full">
                <img
                  src={src}
                  alt={`${title} - ${i + 1}`}
                  className={`w-full object-cover ${heightClass}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300.png?text=${encodeURIComponent(title)}`;
                  }}
                  // show arrows only when this image is explicitly interacted with
                  onClick={onImageInteract}
                  onTouchStart={onImageInteract}
                  onKeyDown={onImageInteract}
                  // make image focusable for keyboard users
                  tabIndex={0}
                  role="button"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      {imageArray.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={scrollPrev}
            tabIndex={showArrows ? 0 : -1}
            aria-hidden={!showArrows}
            style={{ display: showArrows ? undefined : "none" }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-300 transform"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={scrollNext}
            tabIndex={showArrows ? 0 : -1}
            aria-hidden={!showArrows}
            style={{ display: showArrows ? undefined : "none" }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-300 transform"
          >
            ›
          </button>

          {/* Dots */}
          <div
            style={{ display: showArrows ? undefined : "none" }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-200"
          >
            {imageArray.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === selectedIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
                tabIndex={showArrows ? 0 : -1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
// ...existing code...
