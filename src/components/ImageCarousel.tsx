import React, { useEffect, useState } from "react";
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
  const imageArray = images && images.length ? images : [];

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
    <div className="relative">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-1"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {imageArray.map((_, idx) => (
              <button
                key={idx}
                onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                className={`w-2 h-2 rounded-full ${idx === selectedIndex ? "bg-white" : "bg-white/50"}`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
