import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function EstablishmentPhotoGallery({
  images,
  name,
  compact = false,
}: {
  images: string[];
  name: string;
  compact?: boolean;
}) {
  const usableImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [name]);

  useEffect(() => {
    if (!isViewerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsViewerOpen(false);
      if (event.key === 'ArrowLeft') setActiveIndex((current) => (current - 1 + usableImages.length) % usableImages.length);
      if (event.key === 'ArrowRight') setActiveIndex((current) => (current + 1) % usableImages.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isViewerOpen, usableImages.length]);

  if (usableImages.length === 0) return null;
  const activeImage = usableImages[Math.min(activeIndex, usableImages.length - 1)];
  const hasMultiple = usableImages.length > 1;

  return (
    <>
      <div className={compact ? 'w-[96px] lg:w-[236px]' : 'w-full'}>
        <button
          type="button"
          aria-label={`Open photos for ${name}`}
          onClick={() => setIsViewerOpen(true)}
          className="group relative block w-full overflow-hidden rounded-xl bg-slate-100 text-left shadow-sm"
        >
          <img
            src={activeImage}
            alt={name}
            className={compact ? 'h-[64px] w-full object-cover transition duration-200 group-hover:scale-[1.02] lg:h-[150px]' : 'h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]'}
          />
          {hasMultiple ? (
            <span className="sy-small sy-semibold absolute bottom-2 right-2 rounded-full bg-slate-950/68 px-2 py-1 text-white backdrop-blur">
              {activeIndex + 1}/{usableImages.length}
            </span>
          ) : null}
        </button>

        {hasMultiple ? (
          <div className="mt-1.5 hidden grid-cols-3 gap-1.5 lg:grid">
            {usableImages.slice(0, 3).map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Show photo ${index + 1} of ${name}`}
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-lg border bg-slate-100 transition ${activeIndex === index ? 'border-blue-500 ring-2 ring-blue-500/15' : 'border-slate-200 hover:border-blue-300'}`}
              >
                <img src={image} alt="" className="h-11 w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isViewerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo viewer`}
          className="fixed inset-0 z-[1800] flex items-center justify-center bg-slate-950/88 p-4 backdrop-blur-sm"
          onMouseDown={() => setIsViewerOpen(false)}
        >
          <button type="button" aria-label="Close photo viewer" onClick={() => setIsViewerOpen(false)} className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/20">
            <X size={22} />
          </button>

          {hasMultiple ? (
            <button
              type="button"
              aria-label="Previous photo"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => setActiveIndex((current) => (current - 1 + usableImages.length) % usableImages.length)}
              className="absolute left-3 z-20 grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={27} />
            </button>
          ) : null}

          <div className="flex max-h-[92vh] max-w-[92vw] flex-col items-center" onMouseDown={(event) => event.stopPropagation()}>
            <img src={activeImage} alt={`${name} photo ${activeIndex + 1}`} className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl" />
            <div className="mt-3 rounded-full bg-white/10 px-4 py-2 text-center text-white backdrop-blur">
              <div className="sy-small sy-semibold">{name}</div>
              <div className="sy-small mt-0.5 text-white/70">Photo {activeIndex + 1} of {usableImages.length} · Use ← → keys to browse</div>
            </div>
          </div>

          {hasMultiple ? (
            <button
              type="button"
              aria-label="Next photo"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => setActiveIndex((current) => (current + 1) % usableImages.length)}
              className="absolute right-3 z-20 grid h-12 w-12 place-items-center rounded-full bg-white/12 text-white backdrop-blur hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={27} />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
