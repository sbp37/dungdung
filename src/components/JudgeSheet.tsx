import { useEffect, useState } from 'react'
import { Pixel } from '../Pixel'
import { Piece, Thought, ThoughtKind, guessKind, spriteFor } from '../store'
import { sfx } from '../sound'
import { Poof } from './Poof'

type Phase = 'ask' | 'seal' | 'crush' | 'slain'

interface ThoughtProps {
  thought: Thought
  onResolve: (kind: Exclude<ThoughtKind, 'float'>) => void
  onSplit: () => void
  onClose: () => void
}

interface PieceProps {
  piece: Piece
  onDone: () => void
  onClose: () => void
}

const GUESS_LABEL = { worry: '걱정', task: '할일', junk: '잡념' } as const

export function JudgeSheet({ thought, onResolve, onSplit, onClose }: ThoughtProps) {
  const [phase, setPhase] = useState<Phase>('ask')
  const guess = guessKind(thought.text)

  useEffect(() => {
    if (phase === 'ask') return
    const t = setTimeout(() => {
      if (phase === 'seal') onResolve('worry')
      else onResolve('junk')
    }, 950)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const pick = (phase2: Phase, sound: () => void) => {
    setPhase(phase2)
    sound()
  }

  return (
    <div className="sheet-wrap" onClick={phase === 'ask' ? onClose : undefined}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-stage">
          {phase === 'crush' && <Pixel name="crusher" size={4} className="crusher-in" />}
          <div
            className={`sheet-monster ${phase === 'crush' ? 'monster-crushed' : ''} ${phase === 'seal' ? 'monster-sealed' : ''}`}
          >
            {phase === 'slain' ? (
              <Poof />
            ) : (
              <Pixel name={phase === 'seal' ? 'box' : spriteFor(thought)} size={6} />
            )}
          </div>
          {phase === 'crush' && <Poof />}
        </div>
        <p className="sheet-text">{thought.text}</p>

        {phase === 'ask' && (
          <>
            <p className="sheet-guess">이거 대충 {GUESS_LABEL[guess]} 같은데 — 얘 뭐야?</p>
            <div className="judge-btns">
              <button className="btn btn-brick" onClick={onSplit}>
                할일임
              </button>
              <button className="btn btn-seer" onClick={() => pick('seal', sfx.seal)}>
                걱정임
              </button>
              <button className="btn btn-junk" onClick={() => pick('crush', sfx.crush)}>
                그냥 잡념
              </button>
            </div>
            <button className="link" onClick={() => onResolve('memo')}>
              아, 그냥 기억해둘 거야
            </button>
          </>
        )}
        {phase === 'seal' && <p className="sheet-result">봉인 완료. 진짜 일어나면 그때 깨우자.</p>}
        {phase === 'crush' && <p className="sheet-result">분쇄됨. 다음.</p>}
      </div>
    </div>
  )
}

export function PieceSheet({ piece, onDone, onClose }: PieceProps) {
  const [phase, setPhase] = useState<Phase>('ask')

  useEffect(() => {
    if (phase !== 'slain') return
    const t = setTimeout(onDone, 800)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <div className="sheet-wrap" onClick={phase === 'ask' ? onClose : undefined}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-stage">
          <div className="sheet-monster">
            {phase === 'slain' ? <Poof /> : <Pixel name="spark" size={7} className="bob" />}
          </div>
        </div>
        <p className="sheet-text">{piece.text}</p>
        {phase === 'ask' ? (
          <>
            <p className="sheet-guess">이거 했어?</p>
            <div className="judge-btns">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setPhase('slain')
                  sfx.done()
                }}
              >
                했다!
              </button>
              <button className="btn btn-ghost" onClick={onClose}>
                아직
              </button>
            </div>
          </>
        ) : (
          <p className="sheet-result">처치 완료. 가벼워졌다.</p>
        )}
      </div>
    </div>
  )
}
