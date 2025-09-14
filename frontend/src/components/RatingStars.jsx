import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, onRatingChange, readonly = false, size = 'w-6 h-6' }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (ratingValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(ratingValue);
    }
  };

  const handleMouseEnter = (ratingValue) => {
    if (!readonly) {
      setHover(ratingValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHover(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || rating);
        return (
          <Star
            key={star}
            className={`${size} transition-all duration-200 ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${
              isFilled
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-transparent'
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm text-muted-foreground font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;