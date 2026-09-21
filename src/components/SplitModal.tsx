import { useEffect, useState } from 'react'
import { Pixel } from '../Pixel'
import { Thought, spriteFor } from '../store'

interface Props {
  thought: Thought
  onSplit: (pieces: string[]) => void
  onClose: () => void
}

export function SplitModal({ thought, onSplit, onClose }: Props) {
  const [pieces, setPieces] = useState<string[]>([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])

  const add = () => {
    const t = draft.trim()
    if (!t) return
    setPieces((p) => [...p, t])
    setDraft('')
  }

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-stage sheet-stage-small">
          <Pixel name={spriteFor(thought)} size={5} className="bob-slow" />
        </div>
        <p className="sheet-text">{thought.text}</p>
        <p className="sheet-guess">
          첫 행동만 적어. "세미나 준비" 말고 "자료 폴더 열기" 정도로. 2분짜리면 충분함.
        </p>

        <div className="split-row">
          <input
            className="split-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add()
              e.stopPropagation()
            }}
            placeholder="작은 행동 하나"
            autoFocus
          />
          <button className="btn btn-ghost" onClick={add} disabled={!draft.trim()}>
            + 조각
          </button>
        </div>

        {pieces.length > 0 && (
          <ul className="piece-list">
            {pieces.map((p, i) => (
              <li key={i} className="piece-chip">
                <Pixel name="spark" size={2} />
                <span>{p}</span>
                <button className="chip-x" onClick={() => setPieces((ps) => ps.filter((_, j) => j !== i))}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="judge-btns">
          <button
            className="btn btn-primary"
            onClick={() => onSplit(pieces.length ? pieces : [thought.text])}
          >
            {pieces.length ? `조각 ${pieces.length}개로` : '통째로 할게'}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            아직 안 할래
          </button>
        </div>
      </div>
    </div>
  )
}
