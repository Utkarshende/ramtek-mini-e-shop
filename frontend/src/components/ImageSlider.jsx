import React, { useState, useEffect } from "react";

function ImageSlider({ images = [], className = "" }) {
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextSlide = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, images.length]);

  return (
    <>
      <div className={`relative ${className}`}>
        <img
          src={images[current]}
          alt={`Product image ${current + 1}`}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
          onClick={() => setIsOpen(true)}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white px-3 py-1 rounded-full transition"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white px-3 py-1 rounded-full transition"
              aria-label="Next image"
            >
              ›
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 text-white px-3 py-1 rounded-full">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

   
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-5xl w-full px-4">
            <img
              src={images[current]}
              alt={`Preview ${current + 1}`}
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-0 -translate-y-1/2 text-white text-4xl px-4"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-white text-4xl px-4"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ImageSlider;