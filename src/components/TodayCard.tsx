import { useState } from 'react'
import { Pixel } from '../Pixel'
import { Piece } from '../store'

interface Props {
  pieces: Piece[]
  remaining: number
  onSpark: (p: Piece) => void
}

export function TodayCard({ pieces, remaining, onSpark }: Props) {
  const [idx, setIdx] = useState(0)
  const current = pieces.length ? pieces[idx % pieces.length] : null

  return (
    <div className="today">
      {current ? (
        <>
          <div className="today-label">오늘은 이거 하나면 됨</div>
          <button className="today-card" onClick={() => onSpark(current)}>
            <Pixel name="spark" size={3} />
            <span>{current.text}</span>
          </button>
          {pieces.length > 1 && (
            <button className="link" onClick={() => setIdx((i) => i + 1)}>
              다른 거 ({pieces.length}개 남음)
            </button>
          )}
        </>
      ) : remaining > 0 ? (
        <div className="today-note">
          남은 몬스터 {remaining}마리. 자정에 리스폰될 예정 — 지금 안 잡아도 됨.
        </div>
      ) : (
        <div className="today-note">끝. 머리 비었음.</div>
      )}
    </div>
  )
}
