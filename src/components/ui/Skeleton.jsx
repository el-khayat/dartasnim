export function Skeleton({ width, height, borderRadius = '8px', style = {} }) {
  return (
    <div
      style={{
        width: width || '100%',
        height: height || '100%',
        borderRadius,
        backgroundColor: '#1E1E1E',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div style={{ backgroundColor: '#1E1E1E', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#252525', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '10px', width: '80px', backgroundColor: '#252525', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '16px', width: '100%', backgroundColor: '#252525', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '12px', width: '100px', backgroundColor: '#252525', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '36px', width: '100%', backgroundColor: '#252525', borderRadius: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: '24px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
