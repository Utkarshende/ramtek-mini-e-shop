import React from 'react';

function StarRating({ rating, setRating, interactive = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && setRating(star)}
          className={`text-xl ${interactive ? 'cursor-pointer' : ''} ${
            star <= rating ? 'text-yellow-500' : 'text-slate-700'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;