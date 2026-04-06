import { FiStar } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

export default function StarRating({ rating, size = 16, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onChange?.(star) : undefined}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}>
          {star <= Math.round(rating)
            ? <AiFillStar size={size} className="text-amber-400" />
            : <FiStar size={size} className="text-gray-600" />}
        </button>
      ))}
    </div>
  );
}
