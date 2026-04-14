import { Star } from 'lucide-react'

export default function StarRating({ rating, size = 14, showCount, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={size}
          fill={star <= Math.round(rating) ? '#C9A84C' : 'none'}
          color={star <= Math.round(rating) ? '#C9A84C' : '#888880'}
        />
      ))}
      {showCount && count !== undefined && (
        <span style={{ color: '#888880', fontSize: '0.75rem', marginLeft: '4px' }}>({count})</span>
      )}
    </div>
  )
}
