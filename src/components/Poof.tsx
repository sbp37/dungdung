const OFFSETS: [number, number][] = [
  [-30, -18],
  [26, -26],
  [-22, 20],
  [30, 14],
  [0, -34],
  [-36, 4],
  [36, -4],
  [8, 30],
]

const COLORS = ['#ffd97d', '#ffb3a0', '#c9b6f2', '#a5dcbe', '#fffdf7']

// 처치 이펙트 — 사각 파편이 사방으로 튐
export function Poof() {
  return (
    <div className="poof" aria-hidden>
      {OFFSETS.map(([x, y], i) => (
        <div
          key={i}
          className="poof-bit"
          style={
            {
              '--dx': `${x}px`,
              '--dy': `${y}px`,
              background: COLORS[i % COLORS.length],
              animationDelay: `${i * 15}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
