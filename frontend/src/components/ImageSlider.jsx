import React, { useState } from "react";

function ImageSlider({ images = [], className = "" }) {
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      {/* MAIN IMAGE */}
      <div className={`relative ${className}`}>
        <img
          src={images[current]}
          alt="product"
          className="w-full h-full object-cover cursor-pointer rounded-xl"
          onClick={() => setIsOpen(true)}
        />

        {images.length > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded-full"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded-full"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-4xl w-full px-4">
            <img
              src={images[current]}
              className="w-full max-h-[80vh] object-contain rounded-xl"
              alt="preview"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute top-1/2 left-0 -translate-y-1/2 text-white text-4xl px-4"
                >
                  ‹
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-white text-4xl px-4"
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