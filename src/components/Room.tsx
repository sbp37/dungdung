import { Pixel } from '../Pixel'
import { Piece, Thought, spriteFor } from '../store'

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

export function Room({ floats, sparks, onJudge, onSpark }: Props) {
  const empty = floats.length === 0 && sparks.length === 0
  return (
    <div className={`room ${empty ? 'room-clear' : ''}`}>
      {empty ? (
        <div className="room-empty">
          <Pixel name="puff" size={5} className="bob-slow" />
          <p>머리 비었음. 쾌적.</p>
        </div>
      ) : (
        <div className="room-cloud">
          {floats.map((t) => {
            const h = hash(t.id)
            return (
              <button
                key={t.id}
                className="floater bob"
                style={{
                  animationDelay: `${(h % 7) * 0.4 - 1}s`,
                  animationDuration: `${2.6 + (h % 5) * 0.3}s`,
                }}
                onClick={() => onJudge(t)}
                title={t.text}
              >
                <Pixel name={spriteFor(t)} size={4} />
                <span className="floater-label">{t.text}</span>
              </button>
            )
          })}
          {sparks.map((p) => {
            const h = hash(p.id)
            return (
              <button
                key={p.id}
                className="floater floater-spark bob"
                style={{
                  animationDelay: `${(h % 5) * 0.3 - 1}s`,
                  animationDuration: `${1.8 + (h % 3) * 0.3}s`,
                }}
                onClick={() => onSpark(p)}
                title={p.text}
              >
                <Pixel name="spark" size={3} />
                <span className="floater-label floater-label-spark">{p.text}</span>
              </button>
            )
          })}
        </div>
      )}
      <div className="room-floor" aria-hidden />
    </div>
  )
}
