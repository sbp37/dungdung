import { useState } from 'react'
import { Pixel } from '../Pixel'

interface Props {
  onDump: (lines: string[]) => void
  hasRoom: boolean
  onClose?: () => void
}

export function Dump({ onDump, hasRoom, onClose }: Props) {
  const [text, setText] = useState('')
  const lines = text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="dump">
      <div className="dump-head">
        <Pixel name="puff" size={5} className="bob-slow" />
        <div>
          <h1 className="dump-title">다 꺼내.</h1>
          <p className="dump-sub">머릿속 거 다 적어. 한 줄에 하나씩. 정리는 나중.</p>
        </div>
      </div>
      <textarea
        className="dump-input"
        placeholder={
          '예시:\n세미나 발표 준비\n발표 망하면 어떡하지\n커피 원두 사야 됨\n그냥 아무것도 하기 싫음'
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        rows={9}
      />
      <div className="dump-gallery" aria-hidden>
        {(
          [
            ['seer', '걱정 → 봉인'],
            ['brick', '할일 → 쪼개기'],
            ['junk', '잡념 → 분쇄'],
            ['memo', '기억 → 보관'],
            ['spark', '조각 → 처치'],
          ] as const
        ).map(([name, label]) => (
          <div key={name} className="gallery-item">
            <Pixel name={name} size={3} className="bob-slow" />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="dump-foot">
        <span className="dump-count">{lines.length > 0 ? `잡념 ${lines.length}개 포착` : '…'}</span>
        <div className="dump-btns">
          {hasRoom && (
            <button className="btn btn-ghost" onClick={onClose}>
              닫기
            </button>
          )}
          <button className="btn btn-primary" disabled={lines.length === 0} onClick={() => onDump(lines)}>
            다 쏟았다
          </button>
        </div>
      </div>
    </div>
  )
}
