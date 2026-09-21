import { Pixel } from '../Pixel'
import { Piece, Thought, daysOld, pieceSprite, spriteFor } from '../store'

interface Props {
  floats: Thought[]
  sparks: Piece[]
  onJudge: (t: Thought) => void
  onSpark: (p: Piece) => void
}

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

// hash + 인덱스로 방 안에 흩뿌리기 — 매 렌더 같은 위치, 마리 수 늘수록 넓어짐
function spot(id: string, i: number) {
  const h = hash(id)
  const x = 10 + ((h * 7 + i * 29) % 74)
  const y = 8 + ((h * 13 + i * 41) % 58)
  return { x, y, h }
}

export function Room({ floats, sparks, onJudge, onSpark }: Props) {
  const empty = floats.length === 0 && sparks.length === 0
  return (
    <div className={`room ${empty ? 'room-clear' : ''}`}>
      <div className="room-deco" aria-hidden>
        <Pixel name="cloud" size={3} className="cloud c1" />
        <Pixel name="cloud" size={2} className="cloud c2" />
        <Pixel name="star" size={2} className="twinkle t1" />
        <Pixel name="star" size={2} className="twinkle t2" />
        <Pixel name="star" size={1} className="twinkle t3" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`mote m${i}`} />
        ))}
        <Pixel name="tuft" size={2} className="tuft tf1" />
        <Pixel name="tuft" size={2} className="tuft tf2" />
        <Pixel name="tuft" size={2} className="tuft tf3" />
        <Pixel name="tuft" size={1} className="tuft tf4" />
      </div>
      {empty ? (
        <div className="room-empty">
          <Pixel name="puff" size={5} className="bob-slow" />
          <p>머리 비었음. 쾌적.</p>
        </div>
      ) : (
        <div className="room-cloud">
          {floats.map((t, i) => {
            const { x, y, h } = spot(t.id, i)
            const sprite = spriteFor(t)
            return (
              <div key={t.id} className="floater-pos" style={{ left: `${x}%`, top: `${y}%` }}>
                <div
                  className="wander"
                  style={{
                    animationDelay: `${(h % 7) * 0.7 - 2}s`,
                    animationDuration: `${6 + (h % 5)}s`,
                  }}
                >
                  <button
                    className="floater bob"
                    style={{
                      animationDelay: `${(h % 7) * 0.4 - 1}s`,
                      animationDuration: `${2.6 + (h % 5) * 0.3}s`,
                    }}
                    onClick={() => onJudge(t)}
                    title={t.text}
                  >
                    <span className="floater-sprite" style={{ transform: `rotate(${(h % 9) - 4}deg)` }}>
                      <Pixel name={sprite} size={4} />
                    </span>
                    <span className="floater-label">
                      {sprite === 'lazy' && `방치 ${daysOld(t.createdAt)}일 · `}
                      {t.text}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
          {sparks.map((p, i) => {
            const { x, y, h } = spot(p.id, i + floats.length)
            const sprite = pieceSprite(p)
            return (
              <div key={p.id} className="floater-pos" style={{ left: `${x}%`, top: `${y}%` }}>
                <div
                  className="wander"
                  style={{
                    animationDelay: `${(h % 5) * 0.5 - 1}s`,
                    animationDuration: `${5 + (h % 4)}s`,
                  }}
                >
                  <button
                    className={`floater floater-spark bob ${sprite === 'lazy' ? 'floater-lazy' : ''}`}
                    style={{
                      animationDelay: `${(h % 5) * 0.3 - 1}s`,
                      animationDuration: `${1.8 + (h % 3) * 0.3}s`,
                    }}
                    onClick={() => onSpark(p)}
                    title={p.text}
                  >
                    <span className="floater-sprite" style={{ transform: `rotate(${(h % 9) - 4}deg)` }}>
                      <Pixel name={sprite} size={sprite === 'lazy' ? 4 : 3} />
                    </span>
                    <span className="floater-label floater-label-spark">
                      {sprite === 'lazy' && `미뤄짐 ${daysOld(p.createdAt)}일 · `}
                      {p.text}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className="room-floor" aria-hidden />
    </div>
  )
}
